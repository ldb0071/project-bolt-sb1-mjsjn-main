from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from chat_service import ChatService
import os
import shutil
import arxiv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv
import yt_dlp
from docling.document_converter import DocumentConverter
import traceback
import sys
from rag_service import RAGService
import logging
from openai import OpenAI

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define request models
class AnalyzeRequest(BaseModel):
    text: str
    action: str

class AnalyzeResponse(BaseModel):
    response: Optional[str] = None
    error: Optional[str] = None

class UploadResponse(BaseModel):
    filename: str
    path: str

class ArxivPaper(BaseModel):
    id: str
    title: str
    authors: List[str]
    summary: str
    published: str
    updated: str
    pdfUrl: str
    categories: List[str]

class ArxivSearchResponse(BaseModel):
    papers: List[ArxivPaper]
    total_results: int

class Video(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: str
    channelTitle: str
    channelId: str
    publishedAt: str

class VideoResponse(BaseModel):
    videos: List[Video]
    total_results: int

class Channel(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: str

class ChannelResponse(BaseModel):
    channels: List[Channel]
    total_results: int

# Initialize YouTube API client
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
if not YOUTUBE_API_KEY:
    print("Warning: YOUTUBE_API_KEY not found in environment variables")
    youtube = None
else:
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chat service with API key
chat_service = ChatService(api_key="AIzaSyBQfQ7sN-ASKnlFe8Zg50xsp6qmDdZoweU")

# Initialize RAG service lazily
rag_service = None

def get_rag_service():
    global rag_service
    if rag_service is None:
        rag_service = RAGService(github_token="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")
    return rag_service

# Create storage directories if they don't exist
STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "projects")
if not os.path.exists(STORAGE_DIR):
    os.makedirs(STORAGE_DIR)

def get_project_dirs(project_name: str) -> tuple[str, str, str]:
    """Create and return project directories for different types of PDFs."""
    if not project_name:
        raise HTTPException(status_code=400, detail="Project name cannot be empty")
        
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    project_dir = os.path.join(STORAGE_DIR, safe_project_name)
    uploaded_dir = os.path.join(project_dir, "uploaded")
    downloaded_dir = os.path.join(project_dir, "downloaded")
    
    # Create directories if they don't exist
    for dir_path in [project_dir, uploaded_dir, downloaded_dir]:
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
            
    return project_dir, uploaded_dir, downloaded_dir

@app.get("/api/arxiv/search", response_model=ArxivSearchResponse)
async def search_arxiv(
    query: str, 
    source: str = 'All',
    max_results: int = 10,
    include_citations: bool = False
):
    print(f"\n=== Received arxiv search request ===")
    print(f"Query: {query}")
    print(f"Source: {source}")
    print(f"Max results: {max_results}")
    print(f"Include citations: {include_citations}")
    
    try:
        # Search arxiv
        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.Relevance
        )

        papers = []
        total_results = 0
        
        for result in search.results():
            paper = ArxivPaper(
                id=result.entry_id.split('/')[-1],
                title=result.title,
                authors=[author.name for author in result.authors],
                summary=result.summary,
                published=result.published.strftime("%Y-%m-%d"),
                updated=result.updated.strftime("%Y-%m-%d"),
                pdfUrl=result.pdf_url,
                categories=result.categories
            )
            papers.append(paper)
            total_results += 1
            
            if total_results >= max_results:
                break

        print(f"Found {total_results} papers")
        print("=== Search completed ===\n")
        
        return ArxivSearchResponse(papers=papers, total_results=total_results)
        
    except Exception as e:
        print(f"Error searching arxiv: {e}")
        # Return empty results instead of throwing error
        return ArxivSearchResponse(papers=[], total_results=0)

@app.post("/api/pdf/upload", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    project_name: str = Form(...)
):
    print(f"\n=== Received upload request ===")
    print(f"File name: {file.filename}")
    print(f"Project ID: {project_id}")
    print(f"Project name: {project_name}")
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    
    # Get project directories using project name
    _, uploaded_dir, _ = get_project_dirs(safe_project_name)
    
    # Save the file in the uploaded directory
    file_path = os.path.join(uploaded_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        print(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save file")
    
    relative_path = f"/projects/{safe_project_name}/uploaded/{file.filename}"
    print(f"File saved at: {file_path}")
    print(f"Relative path: {relative_path}")
    print("=== Upload completed ===\n")
    
    return UploadResponse(filename=file.filename, path=relative_path)

@app.post("/api/pdf/download", response_model=UploadResponse)
async def download_pdf(
    url: str = Form(...),
    filename: str = Form(...),
    project_id: str = Form(...),
    project_name: str = Form(...)
):
    print(f"\n=== Received download request ===")
    print(f"URL: {url}")
    print(f"Filename: {filename}")
    print(f"Project ID: {project_id}")
    print(f"Project name: {project_name}")
    
    if not filename.lower().endswith('.pdf'):
        filename = f"{filename}.pdf"
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    
    # Get project directories using project name
    _, _, downloaded_dir = get_project_dirs(safe_project_name)
    
    # Save the file in the downloaded directory
    file_path = os.path.join(downloaded_dir, filename)
    try:
        # Download the file using requests
        import requests
        response = requests.get(url)
        response.raise_for_status()
        
        with open(file_path, "wb") as buffer:
            buffer.write(response.content)
    except Exception as e:
        print(f"Error downloading file: {e}")
        raise HTTPException(status_code=500, detail="Failed to download file")
    
    relative_path = f"/projects/{safe_project_name}/downloaded/{filename}"
    print(f"File saved at: {file_path}")
    print(f"Relative path: {relative_path}")
    print("=== Download completed ===\n")
    
    return UploadResponse(filename=filename, path=relative_path)

@app.delete("/api/pdf/{project_name}/{file_type}/{file_name}")
async def delete_pdf(project_name: str, file_type: str, file_name: str):
    print(f"\n=== Received delete request ===")
    print(f"Project name: {project_name}")
    print(f"File type: {file_type}")
    print(f"File name: {file_name}")
    
    if file_type not in ["uploaded", "downloaded"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    
    # Get project directories using project name
    _, uploaded_dir, downloaded_dir = get_project_dirs(safe_project_name)
    
    # Choose the correct directory based on file type
    base_dir = uploaded_dir if file_type == "uploaded" else downloaded_dir
    file_path = os.path.join(base_dir, file_name)
    
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"File deleted: {file_path}")
            print("=== Delete completed ===\n")
            return {"message": "File deleted successfully"}
        except Exception as e:
            print(f"Error deleting file: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete file")
    
    print("File not found")
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/")
async def root():
    return {"message": "Welcome to AI Trending API"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest) -> Dict[str, Optional[str]]:
    """
    Analyze text using the specified action (explain, summarize, or rewrite).
    """
    print(f"\n=== Received analyze request ===")
    print(f"Action: {request.action}")
    print(f"Text length: {len(request.text)}")
    print(f"Text preview: {request.text[:100]}...")

    if not request.text:
        print("Error: Empty text received")
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if request.action not in ["explain", "summarize", "rewrite"]:
        print(f"Error: Invalid action '{request.action}'")
        raise HTTPException(status_code=400, detail="Invalid action specified")
    
    print("Processing text with chat service...")
    result = await chat_service.process_text(request.text, request.action)
    
    if result["error"]:
        print(f"Error from chat service: {result['error']}")
        if "Rate limit exceeded" in result["error"]:
            raise HTTPException(status_code=429, detail=result["error"])
        raise HTTPException(status_code=500, detail=result["error"])
    
    print("Successfully processed text")
    print(f"Response preview: {result['response'][:100] if result['response'] else 'No response'}...")
    print("=== Request completed ===\n")
    
    return result

@app.delete("/api/project/{project_name}")
async def delete_project(project_name: str):
    """Delete a project and all its files."""
    print(f"\n=== Received project delete request ===")
    print(f"Project name: {project_name}")
    
    if not project_name:
        raise HTTPException(status_code=400, detail="Project name cannot be empty")
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    project_dir = os.path.join(STORAGE_DIR, safe_project_name)
    
    if not os.path.exists(project_dir):
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Remove the entire project directory and all its contents
        shutil.rmtree(project_dir)
        print(f"Project directory deleted: {project_dir}")
        print("=== Project deletion completed ===\n")
        return {"message": "Project deleted successfully"}
    except Exception as e:
        print(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete project")

@app.get("/api/projects/{project_name}/{file_type}/{file_name}")
async def get_pdf(project_name: str, file_type: str, file_name: str):
    print(f"\n=== Received get PDF request ===")
    print(f"Project name: {project_name}")
    print(f"File type: {file_type}")
    print(f"File name: {file_name}")
    
    if file_type not in ["uploaded", "downloaded"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    
    # Get project directories using project name
    _, uploaded_dir, downloaded_dir = get_project_dirs(safe_project_name)
    
    # Choose the correct directory based on file type
    base_dir = uploaded_dir if file_type == "uploaded" else downloaded_dir
    file_path = os.path.join(base_dir, file_name)
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")
    
    print(f"Serving file: {file_path}")
    print("=== Get PDF completed ===\n")
    
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=file_name
    )

@app.get("/api/youtube/search")
async def search_youtube_videos(
    query: str = '',
    category: str = 'AI',
    max_results: int = 10
):
    print(f"\n=== Received YouTube search request ===")
    print(f"Query: {query}")
    print(f"Category: {category}")
    print(f"Max results: {max_results}")
    
    if not youtube:
        raise HTTPException(
            status_code=500, 
            detail="YouTube API not configured. Please set YOUTUBE_API_KEY environment variable."
        )
    
    try:
        # Add category to query if specified and not 'All'
        search_query = f"{query} {category}" if category and category.lower() != 'all' else query
        
        # Call YouTube API
        search_response = youtube.search().list(
            q=search_query,
            part='snippet',
            type='video',
            maxResults=max_results,
            order='relevance'
        ).execute()
        
        # Process results
        videos = []
        for item in search_response.get('items', []):
            if item['id']['kind'] == 'youtube#video':
                video = {
                    'id': item['id']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnail': item['snippet']['thumbnails']['high']['url'],
                    'channelTitle': item['snippet']['channelTitle'],
                    'channelId': item['snippet']['channelId'],
                    'publishedAt': item['snippet']['publishedAt']
                }
                videos.append(video)
        
        print(f"Found {len(videos)} videos")
        print("=== Search completed ===\n")
        
        return JSONResponse(content={'videos': videos, 'total_results': len(videos)})
        
    except HttpError as e:
        print(f"YouTube API error: {e}")
        if e.resp.status == 403:
            raise HTTPException(status_code=403, detail="YouTube API quota exceeded")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error searching YouTube: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/trending")
async def get_trending_videos(category: str = 'AI'):
    print(f"\n=== Received trending videos request ===")
    print(f"Category: {category}")
    
    try:
        # Get trending videos
        videos_response = youtube.videos().list(
            part='snippet',
            chart='mostPopular',
            regionCode='US',
            maxResults=10,
            videoCategoryId='28'  # Science & Technology category
        ).execute()
        
        # Process results
        videos = []
        for item in videos_response.get('items', []):
            video = {
                'id': item['id'],
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'channelTitle': item['snippet']['channelTitle'],
                'channelId': item['snippet']['channelId'],
                'publishedAt': item['snippet']['publishedAt']
            }
            videos.append(video)
        
        print(f"Found {len(videos)} trending videos")
        print("=== Request completed ===\n")
        
        return JSONResponse(content={'videos': videos, 'total_results': len(videos)})
        
    except HttpError as e:
        print(f"YouTube API error: {e}")
        if e.resp.status == 403:
            raise HTTPException(status_code=403, detail="YouTube API quota exceeded")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error getting trending videos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/channels/{channel_id}/videos")
async def get_channel_videos(channel_id: str, max_results: int = 10):
    print(f"\n=== Received channel videos request ===")
    print(f"Channel ID: {channel_id}")
    print(f"Max results: {max_results}")
    
    try:
        # Get channel's uploaded videos
        channels_response = youtube.channels().list(
            part='contentDetails',
            id=channel_id
        ).execute()
        
        if not channels_response['items']:
            raise HTTPException(status_code=404, detail="Channel not found")
        
        uploads_playlist_id = channels_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        
        # Get videos from uploads playlist
        playlist_response = youtube.playlistItems().list(
            part='snippet',
            playlistId=uploads_playlist_id,
            maxResults=max_results
        ).execute()
        
        # Process results
        videos = []
        for item in playlist_response.get('items', []):
            video = {
                'id': item['snippet']['resourceId']['videoId'],
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'channelTitle': item['snippet']['channelTitle'],
                'channelId': item['snippet']['channelId'],
                'publishedAt': item['snippet']['publishedAt']
            }
            videos.append(video)
        
        print(f"Found {len(videos)} channel videos")
        print("=== Request completed ===\n")
        
        return JSONResponse(content={'videos': videos, 'total_results': len(videos)})
        
    except HttpError as e:
        print(f"YouTube API error: {e}")
        if e.resp.status == 403:
            raise HTTPException(status_code=403, detail="YouTube API quota exceeded")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error getting channel videos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/channels/search")
async def search_channels(query: str, max_results: int = 5, category: str = 'AI'):
    print(f"\n=== Received channel search request ===")
    print(f"Query: {query}")
    print(f"Category: {category}")
    print(f"Max results: {max_results}")
    
    try:
        # Add category to query if specified and not 'All'
        search_query = f"{query} {category}" if category and category.lower() != 'all' else query
        
        # Search for channels
        search_response = youtube.search().list(
            q=search_query,
            part='snippet',
            type='channel',
            maxResults=max_results
        ).execute()
        
        # Process results
        channels = []
        for item in search_response.get('items', []):
            channel = {
                'id': item['id']['channelId'],
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'thumbnail': item['snippet']['thumbnails']['high']['url']
            }
            channels.append(channel)
        
        print(f"Found {len(channels)} channels")
        print("=== Search completed ===\n")
        
        return JSONResponse(content={'channels': channels, 'total_results': len(channels)})
        
    except HttpError as e:
        print(f"YouTube API error: {e}")
        if e.resp.status == 403:
            raise HTTPException(status_code=403, detail="YouTube API quota exceeded")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error searching channels: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/youtube/video/{video_id}")
async def get_video_url(video_id: str, stream: bool = False):
    print(f"\n=== Received video URL request ===")
    print(f"Video ID: {video_id}")
    print(f"Stream: {stream}")
    
    try:
        # Configure yt-dlp
        ydl_opts = {
            'format': 'best[ext=mp4]',  # Get best quality MP4
            'quiet': True,
            'no_warnings': True
        }
        
        # Get video info and URL
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
                if 'url' in info:
                    video_url = info['url']
                    print(f"Video URL retrieved successfully")
                    print("=== Request completed ===\n")
                    return JSONResponse(content={'url': video_url})
                else:
                    raise HTTPException(status_code=404, detail="Video URL not found")
            except Exception as e:
                print(f"Error extracting video info: {e}")
                raise HTTPException(status_code=404, detail=str(e))
                
    except Exception as e:
        print(f"Error getting video URL: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pdf/convert-to-markdown/{project_name}/{file_type}/{file_name}")
async def convert_pdf_to_markdown(project_name: str, file_type: str, file_name: str):
    print(f"\n=== Received PDF to Markdown conversion request ===")
    print(f"Project name: {project_name}")
    print(f"File type: {file_type}")
    print(f"File name: {file_name}")
    
    if file_type not in ["uploaded", "downloaded"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    
    # Get project directories using project name
    project_dir, uploaded_dir, downloaded_dir = get_project_dirs(safe_project_name)
    
    # Choose the correct directory based on file type
    base_dir = uploaded_dir if file_type == "uploaded" else downloaded_dir
    file_path = os.path.join(base_dir, file_name)
    
    # Create markdown directory if it doesn't exist
    markdown_dir = os.path.join(project_dir, "markdown")
    if not os.path.exists(markdown_dir):
        os.makedirs(markdown_dir)
    
    # Generate markdown filename
    markdown_base_name = os.path.splitext(file_name)[0]
    markdown_path = os.path.join(markdown_dir, f"{markdown_base_name}")
    
    # Check if markdown version already exists
    if os.path.exists(f"{markdown_path}_page_1.md"):
        print(f"Markdown version already exists at: {markdown_path}")
        # Read and combine all markdown pages
        markdown_content = []
        page_num = 1
        while os.path.exists(f"{markdown_path}_page_{page_num}.md"):
            with open(f"{markdown_path}_page_{page_num}.md", 'r', encoding='utf-8') as f:
                markdown_content.append(f.read())
            page_num += 1
        
        return {
            "content": markdown_content,
            "total_pages": page_num - 1,
            "base_path": f"/projects/{safe_project_name}/markdown/{markdown_base_name}"
        }
    
    print(f"Full file path: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Check if file is readable
        if not os.access(file_path, os.R_OK):
            print(f"File is not readable: {file_path}")
            raise HTTPException(status_code=500, detail="File is not readable")

        # Check file size
        file_size = os.path.getsize(file_path)
        print(f"File size: {file_size} bytes")
        
        if file_size == 0:
            print("File is empty")
            raise HTTPException(status_code=400, detail="File is empty")
            
        # Initialize the document converter
        try:
            print("Attempting to initialize DocumentConverter...")
            converter = DocumentConverter()
            print("DocumentConverter initialized successfully")
        except Exception as e:
            error_traceback = traceback.format_exc()
            print(f"Error initializing DocumentConverter:\n{error_traceback}")
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to initialize document converter: {str(e)}\nTraceback: {error_traceback}"
            )
        
        # Convert PDF to Markdown
        try:
            print("Starting PDF to Markdown conversion...")
            # Convert the document using Docling
            result = converter.convert(file_path)
            doc = result.document
            
            # Get the total number of pages from the PDF
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                total_pages = len(pdf.pages)
            
            print(f"PDF has {total_pages} pages")
            
            # Get the full markdown content
            markdown_content = doc.export_to_markdown()
            
            # Split content by page markers or create balanced pages
            pages = []
            
            # First try to split by page markers if they exist
            page_markers = [f"\n\nPage {i+1}\n" for i in range(total_pages)]
            content_with_markers = markdown_content
            
            # Add page markers to the content if they don't exist
            if not any(marker in markdown_content for marker in page_markers):
                # Split content into paragraphs
                paragraphs = markdown_content.split('\n\n')
                paragraphs_per_page = max(1, len(paragraphs) // total_pages)
                
                # Distribute paragraphs across pages
                for i in range(total_pages):
                    start_idx = i * paragraphs_per_page
                    end_idx = start_idx + paragraphs_per_page if i < total_pages - 1 else len(paragraphs)
                    page_content = '\n\n'.join(paragraphs[start_idx:end_idx])
                    if page_content.strip():
                        pages.append(f"Page {i+1}\n\n{page_content}")
            else:
                # Split by existing page markers
                current_page = []
                current_page_content = []
                
                for line in markdown_content.split('\n'):
                    if any(marker.strip() in line for marker in page_markers):
                        if current_page_content:
                            pages.append('\n'.join(current_page_content))
                            current_page_content = []
                    current_page_content.append(line)
                
                # Add the last page
                if current_page_content:
                    pages.append('\n'.join(current_page_content))
            
            # Ensure we have exactly the same number of pages as the PDF
            while len(pages) < total_pages:
                pages.append(f"Page {len(pages)+1}\n\n[Empty page]")
            
            # Save each page separately
            for i, page_content in enumerate(pages, 1):
                if page_content.strip():  # Only save non-empty pages
                    page_file_path = f"{markdown_path}_page_{i}.md"
                    with open(page_file_path, 'w', encoding='utf-8') as f:
                        f.write(page_content.strip())
                    print(f"Saved page {i} to {page_file_path} (length: {len(page_content)} chars)")
            
            print(f"Successfully converted PDF to {len(pages)} markdown pages")
            print("=== Conversion completed ===\n")
            
            return {
                "content": pages,
                "total_pages": len(pages),
                "base_path": f"/projects/{safe_project_name}/markdown/{markdown_base_name}"
            }
            
        except Exception as e:
            error_traceback = traceback.format_exc()
            print(f"Error during conversion:\n{error_traceback}")
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to convert PDF: {str(e)}\nTraceback: {error_traceback}"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"Unexpected error converting PDF to Markdown:\n{error_traceback}")
        raise HTTPException(
            status_code=500, 
            detail=f"Unexpected error: {str(e)}\nTraceback: {error_traceback}"
        )

@app.post("/api/project/{project_name}/convert-all-pdfs")
async def convert_all_pdfs(project_name: str):
    print(f"\n=== Received convert all PDFs request for project {project_name} ===")
    
    # Create a safe project name for the folder
    safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    
    # Get project directories
    project_dir, uploaded_dir, downloaded_dir = get_project_dirs(safe_project_name)
    
    # Get all PDF files from both directories
    pdf_files = []
    for dir_path, dir_type in [(uploaded_dir, "uploaded"), (downloaded_dir, "downloaded")]:
        if os.path.exists(dir_path):
            for file_name in os.listdir(dir_path):
                if file_name.lower().endswith('.pdf'):
                    pdf_files.append({
                        "name": file_name,
                        "type": dir_type,
                        "path": os.path.join(dir_path, file_name)
                    })
    
    if not pdf_files:
        return {"message": "No PDF files found in project", "converted": 0, "total": 0}
    
    print(f"Found {len(pdf_files)} PDF files to convert")
    converted = 0
    total_chunks = 0
    all_chunks = []
    
    # First convert all PDFs to markdown
    for pdf_file in pdf_files:
        try:
            # Check if markdown version already exists
            markdown_dir = os.path.join(project_dir, "markdown")
            markdown_base_name = os.path.splitext(pdf_file["name"])[0]
            if os.path.exists(os.path.join(markdown_dir, f"{markdown_base_name}_page_1.md")):
                print(f"Markdown already exists for {pdf_file['name']}, skipping...")
                converted += 1
                continue
                
            print(f"Converting {pdf_file['name']}...")
            await convert_pdf_to_markdown(
                project_name=project_name,
                file_type=pdf_file["type"],
                file_name=pdf_file["name"]
            )
            converted += 1
            print(f"Successfully converted {pdf_file['name']}")
            
        except Exception as e:
            print(f"Error converting {pdf_file['name']}: {str(e)}")
            continue
    
    # Now process all markdown files at once
    try:
        print("\nProcessing all markdown files...")
        markdown_dir = os.path.join(project_dir, "markdown")
        
        # Get all markdown files grouped by base name (PDF file)
        markdown_files_by_pdf = {}
        for file_name in os.listdir(markdown_dir):
            if file_name.endswith('.md'):
                # Extract base name (remove _page_X.md)
                base_name = '_'.join(file_name.split('_')[:-2]) if '_page_' in file_name else file_name[:-3]
                if base_name not in markdown_files_by_pdf:
                    markdown_files_by_pdf[base_name] = []
                markdown_files_by_pdf[base_name].append(os.path.join(markdown_dir, file_name))
        
        print(f"Found {len(markdown_files_by_pdf)} PDFs to process")
        
        # Process each PDF's pages together
        for base_name, file_paths in markdown_files_by_pdf.items():
            try:
                print(f"\nProcessing {base_name} ({len(file_paths)} pages)...")
                pdf_chunks = []
                
                # Collect chunks from all pages of this PDF
                for file_path in sorted(file_paths):  # Sort to process pages in order
                    document = get_rag_service().document_processor.process_markdown(file_path, markdown_dir)
                    document_chunks = get_rag_service().document_processor.create_chunks(document)
                    pdf_chunks.extend(document_chunks)
                
                if pdf_chunks:
                    # Process all chunks from this PDF at once
                    get_rag_service().vector_store.add_chunks(project_name, pdf_chunks)
                    total_chunks += len(pdf_chunks)
                    print(f"Processed {len(pdf_chunks)} chunks from {base_name}")
                
            except Exception as e:
                print(f"Error processing PDF {base_name}: {str(e)}")
                continue
        
        print(f"\nTotal chunks processed: {total_chunks}")
        
    except Exception as e:
        print(f"Error during markdown processing: {str(e)}")
    
    print(f"=== Conversion completed: {converted}/{len(pdf_files)} files converted with {total_chunks} chunks processed ===\n")
    return {
        "message": f"Successfully converted {converted} out of {len(pdf_files)} PDF files and processed {total_chunks} chunks",
        "converted": converted,
        "total": len(pdf_files),
        "chunks_processed": total_chunks
    }

# Add new endpoints for RAG chat
@app.post("/api/rag/{project_name}/process")
async def process_project_markdown(project_name: str):
    """Process markdown files for a project and update the knowledge base."""
    try:
        # Initialize RAG service only when needed
        rag = get_rag_service()
        
        # Create a safe project name for the folder
        safe_project_name = project_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
        
        # Get project directories using project name
        project_dir, _, _ = get_project_dirs(safe_project_name)
        markdown_dir = os.path.join(project_dir, "markdown")
        
        if not os.path.exists(markdown_dir):
            raise HTTPException(status_code=404, detail=f"Project '{project_name}' markdown directory not found")
        
        await rag.process_markdown_files(project_name, markdown_dir)
        return {"message": "Successfully processed markdown files"}
    except Exception as e:
        logger.error(f"Error processing markdown files: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rag/{project_name}/chat")
async def chat_with_project(
    project_name: str,
    query: str = Form(...),
    chat_history: Optional[List[Dict[str, str]]] = Form(None)
):
    """Chat with the project's knowledge base."""
    try:
        rag = get_rag_service()
        response = await rag.chat(project_name, query, chat_history)
        return response
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rag/{project_name}/stats")
async def get_project_stats(project_name: str):
    """Get statistics about the project's knowledge base."""
    try:
        rag = get_rag_service()
        stats = rag.get_project_stats(project_name)
        return stats
    except Exception as e:
        logger.error(f"Error getting project stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rag/{project_name}/visualize")
async def get_embeddings_visualization(project_name: str):
    """Get 2D visualization data for the embeddings."""
    try:
        rag = get_rag_service()
        visualization_data = rag.get_embeddings_visualization(project_name)
        return visualization_data
    except Exception as e:
        logger.error(f"Error getting visualization data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(
    request: Request,
    messages: List[Dict[str, str]] = Body(...),
    model: str = Body(...)
):
    """Handle chat requests for Azure OpenAI models."""
    try:
        logger.info(f"Received chat request with model: {model}")
        logger.info(f"Messages: {messages}")
        
        # Get GitHub token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.error("Missing or invalid Authorization header")
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        github_token = auth_header.replace('Bearer ', '')
        
        # Use GitHub token as API key
        client = OpenAI(
            base_url="https://models.inference.ai.azure.com",
            api_key=github_token,
        )

        logger.info("Initialized OpenAI client, sending request to Azure...")
        logger.info(f"Using model: gpt-4o")

        try:
            response = client.chat.completions.create(
                messages=messages,
                temperature=1.0,
                top_p=1.0,
                max_tokens=1000,
                model="gpt-4o"  # Use the fixed model name
            )
            
            logger.info("Received response from Azure")
            
            # Extract and return the response
            content = response.choices[0].message.content
            return {"content": content}

        except Exception as api_error:
            logger.error(f"Azure API error: {api_error}")
            raise HTTPException(status_code=500, detail=f"Azure OpenAI API error: {str(api_error)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

