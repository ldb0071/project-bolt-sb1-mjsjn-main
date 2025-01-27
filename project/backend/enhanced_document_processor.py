import uuid
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
from PIL import Image
import logging
import spacy
import networkx as nx
import chromadb
from pydantic import BaseModel
from docling.document_converter import DocumentConverter
import pdfplumber
from models import MarkdownDocument, DocumentChunk
import os
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DoclingPDFProcessor:
    """Enhanced PDF processor using Docling"""
    def __init__(self):
        self.doc_processor = DocumentConverter()
        self.nlp = spacy.load("en_core_web_sm")

    async def process_pdf(self, file_path: str) -> Dict:
        """Process PDF using Docling with enhanced page extraction"""
        try:
            # Process with Docling for markdown conversion
            result = self.doc_processor.convert(file_path)
            markdown_content = result.document.export_to_markdown()
            
            # Extract structured content using pdfplumber
            with pdfplumber.open(file_path) as pdf:
                total_pages = len(pdf.pages)
                pages_data = []
                tables_data = []
                figures_data = []
                
                # Process each page
                for page_num, page in enumerate(pdf.pages, 1):
                    # Extract text with layout info
                    text = page.extract_text()
                    words = page.extract_words()
                    
                    # Get page dimensions and layout
                    layout = {
                        "width": page.width,
                        "height": page.height,
                        "bbox": page.bbox,
                        "page_number": page_num
                    }
                    
                    # Extract tables
                    page_tables = page.extract_tables()
                    if page_tables:
                        for table in page_tables:
                            table_data = {
                                "page": page_num,
                                "content": table,
                                "position": None,  # Could be enhanced with table bbox
                                "rows": len(table),
                                "cols": len(table[0]) if table else 0
                            }
                            tables_data.append(table_data)
                    
                    # Extract figures/images
                    page_images = page.images
                    if page_images:
                        for img in page_images:
                            figure_data = {
                                "page": page_num,
                                "bbox": img.get("bbox"),
                                "type": img.get("type", "figure"),
                                "width": img.get("width"),
                                "height": img.get("height")
                            }
                            figures_data.append(figure_data)
                    
                    # Create page data structure
                    page_data = {
                        "number": page_num,
                        "text": text,
                        "layout": layout,
                        "word_count": len(words),
                        "tables": [t for t in tables_data if t["page"] == page_num],
                        "figures": [f for f in figures_data if f["page"] == page_num],
                        "has_tables": bool(page_tables),
                        "has_figures": bool(page_images)
                    }
                    pages_data.append(page_data)
            
            # Extract headers from markdown
            headers = []
            header_pattern = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
            for match in header_pattern.finditer(markdown_content):
                level = len(match.group(1))
                text = match.group(2).strip()
                # Try to determine page number from context
                page_num = 1
                for page in pages_data:
                    if text in page["text"]:
                        page_num = page["number"]
                        break
                headers.append({
                    "text": text,
                    "level": level,
                    "page": page_num
                })
            
            # Create final structured content
            structured_content = {
                "pages": pages_data,
                "tables": tables_data,
                "figures": figures_data,
                "headers": headers,
                "total_pages": total_pages,
                "metadata": {
                    "title": headers[0]["text"] if headers else "",
                    "has_tables": any(page["has_tables"] for page in pages_data),
                    "has_figures": any(page["has_figures"] for page in pages_data),
                    "total_tables": len(tables_data),
                    "total_figures": len(figures_data),
                    "total_headers": len(headers)
                }
            }

            return {
                "structured_content": structured_content,
                "markdown_content": markdown_content,
                "total_pages": total_pages
            }

        except Exception as e:
            logger.error(f"Error in Docling processing: {str(e)}")
            raise

    async def split_into_pages(self, markdown_content: str, total_pages: int) -> List[str]:
        """Split markdown content into pages with enhanced context preservation"""
        try:
            pages = []
            
            # Try to find natural page breaks first
            page_markers = [
                r'(?:^|\n)#\s*Page\s+(\d+)(?:\n|$)',  # Explicit page markers
                r'(?:^|\n)#{1,2}\s+([^#\n]+)(?:\n|$)',  # Major headers
                r'\n\n(?=[A-Z])',  # Paragraph breaks starting with capital letter
            ]
            
            content_parts = []
            last_pos = 0
            
            # Look for natural breaks using the markers
            for marker in page_markers:
                pattern = re.compile(marker, re.IGNORECASE | re.MULTILINE)
                matches = list(pattern.finditer(markdown_content))
                
                if matches:
                    for i, match in enumerate(matches):
                        start = match.start()
                        if start > last_pos:
                            content_parts.append(markdown_content[last_pos:start])
                        last_pos = start
                    
                    # Add the last part
                    if last_pos < len(markdown_content):
                        content_parts.append(markdown_content[last_pos:])
                    
                    break
            
            # If no natural breaks found, fall back to size-based splitting
            if not content_parts:
                content_length = len(markdown_content)
                approx_page_length = content_length // total_pages
                
                for i in range(total_pages):
                    start = i * approx_page_length
                    end = start + approx_page_length if i < total_pages - 1 else content_length
                    content_parts.append(markdown_content[start:end])
            
            # Process each part into a proper page
            for i, part in enumerate(content_parts, 1):
                content = part.strip()
                if content:
                    # Add page header if not present
                    if not content.startswith("# Page"):
                        content = f"# Page {i}\n\n{content}"
                    pages.append(content)
            
            return pages
            
        except Exception as e:
            logger.error(f"Error splitting pages: {str(e)}")
            raise

class EnhancedDocumentProcessor:
    """Enhanced document processing with Docling integration"""
    def __init__(self, chunk_size: int = 4000, chunk_overlap: int = 400):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.pdf_processor = DoclingPDFProcessor()
        self.nlp = spacy.load("en_core_web_sm")

    def _create_enhanced_metadata(self, content: Dict, page_num: int, project_name: str) -> Dict:
        """Create enhanced metadata using Docling output"""
        page_content = next((page for page in content.get("structured_content", {}).get("pages", []) 
                           if page["number"] == page_num), {})
        
        # Convert all values to strings to match DocumentChunk model requirements
        return {
            "project": str(project_name),
            "page_number": str(page_num),
            "chunk_id": str(f"{project_name}_p{page_num}_{uuid.uuid4().hex[:8]}"),
            "timestamp": str(datetime.now().isoformat()),
            "content_type": str(self._detect_content_type(page_content)),
            "word_count": str(len(page_content.get("text", "").split())),
            "has_citations": str(bool(re.findall(r'\[\d+\]', page_content.get("text", "")))),
            "has_figures": str(any(fig["page"] == page_num for fig in content["structured_content"]["figures"])),
            "has_tables": str(any(table["page"] == page_num for table in content["structured_content"]["tables"])),
            "headers": str([h["text"] for h in content["structured_content"]["headers"] if h["page"] == page_num]),
            "key_terms": str(self._extract_key_terms(page_content.get("text", "")))
        }

    def _detect_content_type(self, page_content: Dict) -> str:
        """Detect content type from page content"""
        text = page_content.get("text", "")
        
        # Check for title page indicators
        if page_content.get("number") == 1 and any(marker in text.lower() for marker in ["abstract", "introduction"]):
            return "title_page"
        
        # Check for table of contents
        if "contents" in text.lower() and any(str(i) for i in range(10) if str(i) in text):
            return "table_of_contents"
        
        # Check for figures
        if "figure" in text.lower() and any(str(i) for i in range(10) if str(i) in text):
            return "figure_page"
        
        # Check for tables
        if "table" in text.lower() and any(str(i) for i in range(10) if str(i) in text):
            return "table_page"
        
        # Check for citations
        if re.search(r'\[\d+\]', text):
            return "citation_rich"
            
        return "main_content"

    def _extract_key_terms(self, text: str) -> List[str]:
        """Extract key terms using spaCy"""
        if not text:
            return []
            
        doc = self.nlp(text)
        key_terms = []
        
        # Extract named entities
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT", "GPE", "PERSON", "WORK_OF_ART"]:
                key_terms.append(ent.text)
                
        # Extract noun phrases
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 3:  # Limit to phrases of 3 words or less
                key_terms.append(chunk.text)
                
        return list(set(key_terms))  # Remove duplicates

    def _create_chunks(self, text: str, metadata: Dict[str, Any]) -> List[DocumentChunk]:
        """Create chunks from text with enhanced metadata"""
        chunks = []
        
        # Split text into paragraphs
        paragraphs = text.split('\n\n')
        current_chunk = []
        current_length = 0
        chunk_id = 0
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
                
            # If paragraph is too long, split it into sentences
            if len(paragraph) > self.chunk_size:
                sentences = paragraph.split('. ')
                for sentence in sentences:
                    sentence = sentence.strip()
                    if not sentence:
                        continue
                        
                    sentence_length = len(sentence)
                    
                    # If adding this sentence would exceed chunk size, create new chunk
                    if current_length + sentence_length > self.chunk_size and current_chunk:
                        chunk_text = ' '.join(current_chunk)
                        unique_chunk_id = f"{metadata['project']}_chunk_{chunk_id}"
                        chunks.append(DocumentChunk(
                            content=chunk_text,
                            chunk_id=unique_chunk_id,
                            metadata={**metadata, "chunk_id": unique_chunk_id}
                        ))
                        chunk_id += 1
                        current_chunk = []
                        current_length = 0
                        
                    current_chunk.append(sentence)
                    current_length += sentence_length
            else:
                # If adding this paragraph would exceed chunk size, create new chunk
                if current_length + len(paragraph) > self.chunk_size and current_chunk:
                    chunk_text = ' '.join(current_chunk)
                    unique_chunk_id = f"{metadata['project']}_chunk_{chunk_id}"
                    chunks.append(DocumentChunk(
                        content=chunk_text,
                        chunk_id=unique_chunk_id,
                        metadata={**metadata, "chunk_id": unique_chunk_id}
                    ))
                    chunk_id += 1
                    current_chunk = []
                    current_length = 0
                    
                current_chunk.append(paragraph)
                current_length += len(paragraph)
                
        # Add any remaining text as a chunk
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            unique_chunk_id = f"{metadata['project']}_chunk_{chunk_id}"
            chunks.append(DocumentChunk(
                content=chunk_text,
                chunk_id=unique_chunk_id,
                metadata={**metadata, "chunk_id": unique_chunk_id}
            ))
            
        return chunks

    async def extract_figures(self, pdf_path: str, output_dir: str) -> List[Dict]:
        """Extract figures and images from PDF with position information"""
        figures = []
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    # Extract images from page
                    page_images = page.images
                    page_height = page.height
                    
                    for img_num, img in enumerate(page_images, 1):
                        try:
                            # Create figure directory if it doesn't exist
                            figure_dir = os.path.join(output_dir, "figures")
                            os.makedirs(figure_dir, exist_ok=True)
                            
                            # Generate unique filename for the figure
                            base_name = os.path.splitext(os.path.basename(pdf_path))[0]
                            figure_filename = f"{base_name}_page_{page_num}_figure_{img_num}.png"
                            figure_path = os.path.join(figure_dir, figure_filename)
                            
                            # Extract image data
                            bbox = img.get("bbox")
                            if bbox:
                                x0, y0, x1, y1 = bbox
                                # Convert PDF coordinates (bottom-left origin) to image coordinates (top-left origin)
                                y0 = page_height - y1
                                y1 = page_height - y0
                            
                            # Save image data
                            with open(figure_path, "wb") as f:
                                f.write(img["stream"].get_data())
                            
                            # Add figure information
                            figures.append({
                                "page": page_num,
                                "figure_num": img_num,
                                "path": figure_path,
                                "filename": figure_filename,
                                "bbox": bbox,
                                "type": img.get("type", "figure"),
                                "width": img.get("width"),
                                "height": img.get("height"),
                                "caption": self._extract_figure_caption(page.extract_text(), bbox) if bbox else ""
                            })
                            
                        except Exception as e:
                            logger.warning(f"Error extracting figure {img_num} from page {page_num}: {str(e)}")
                            continue
                            
        except Exception as e:
            logger.error(f"Error extracting figures from PDF: {str(e)}")
            
        return figures

    def _extract_figure_caption(self, page_text: str, bbox: tuple) -> str:
        """Extract figure caption from nearby text"""
        try:
            # Look for text containing "Figure" or "Fig." near the image bbox
            caption_pattern = re.compile(r'(Figure|Fig\.)\s*\d+[.:]\s*([^\n]+)', re.IGNORECASE)
            matches = caption_pattern.finditer(page_text)
            
            # Find the closest caption to the image bbox
            closest_caption = ""
            min_distance = float('inf')
            
            for match in matches:
                caption_text = match.group(0)
                # Simple distance calculation - can be improved
                caption_pos = page_text.find(caption_text)
                distance = abs(caption_pos - bbox[1])  # Use y-coordinate of bbox
                
                if distance < min_distance:
                    min_distance = distance
                    closest_caption = caption_text
            
            return closest_caption
            
        except Exception:
            return ""

    async def process_pdf(self, file_path: str, project_name: str) -> Dict:
        """Main processing method using Docling with enhanced page handling"""
        try:
            # Process PDF with Docling
            content = await self.pdf_processor.process_pdf(file_path)
            
            # Get project directories
            project_dir = os.path.dirname(os.path.dirname(file_path))
            
            # Extract figures with position information
            figures = await self.extract_figures(file_path, project_dir)
            
            # Process pages into chunks with enhanced metadata
            all_chunks = []
            pages_data = []
            
            for page in content["structured_content"]["pages"]:
                page_num = page["number"]
                page_text = page.get("text", "")
                
                # Create page metadata
                metadata = self._create_enhanced_metadata(content, page_num, project_name)
                
                # Get page-specific elements
                page_tables = [t for t in content["structured_content"]["tables"] if t["page"] == page_num]
                page_figures = [f for f in figures if f["page"] == page_num]
                page_headers = [h for h in content["structured_content"]["headers"] if h.get("page") == page_num]
                
                # Create page data structure
                page_data = {
                    "page_number": page_num,
                    "text": page_text,
                    "metadata": metadata,
                    "elements": {
                        "tables": page_tables,
                        "figures": page_figures,
                        "headers": page_headers
                    },
                    "layout": page.get("layout", {}),
                }
                pages_data.append(page_data)
                
                # Create chunks for the page
                chunks = self._create_chunks(page_text, metadata)
                all_chunks.extend(chunks)
            
            # Generate thumbnail
            thumbnail = await self.generate_thumbnail(file_path)
            
            # Extract page images for display
            page_images = []
            try:
                pdf_images = convert_from_path(file_path)
                for i, image in enumerate(pdf_images, 1):
                    # Save image to project directory
                    image_filename = f"{os.path.splitext(os.path.basename(file_path))[0]}_page_{i}.png"
                    image_path = os.path.join(project_dir, "images", image_filename)
                    os.makedirs(os.path.dirname(image_path), exist_ok=True)
                    image.save(image_path, "PNG")
                    page_images.append({
                        "page": i,
                        "path": image_path,
                        "filename": image_filename
                    })
            except Exception as e:
                logger.warning(f"Error extracting page images from PDF: {str(e)}")
            
            return {
                'chunks': all_chunks,
                'pages': pages_data,
                'page_images': page_images,
                'figures': figures,
                'thumbnail': thumbnail,
                'total_pages': content["total_pages"],
                'structured_content': content["structured_content"],
                'markdown_content': content["markdown_content"]
            }
            
        except Exception as e:
            logger.error(f"Error in document processing: {str(e)}")
            raise

    async def generate_thumbnail(self, pdf_path: str, width: int = 200) -> Optional[Image.Image]:
        """Generate a thumbnail from the first page of a PDF"""
        try:
            # Convert first page of PDF to image
            images = convert_from_path(pdf_path, first_page=1, last_page=1)
            if not images:
                raise Exception("Failed to convert PDF to image")

            # Get first page
            image = images[0]
            
            # Calculate height maintaining aspect ratio
            aspect_ratio = image.height / image.width
            height = int(width * aspect_ratio)
            
            # Resize image
            thumbnail = image.resize((width, height), Image.LANCZOS)
            
            return thumbnail
            
        except Exception as e:
            logger.error(f"Error generating thumbnail: {str(e)}")
            return None

def process_document(document_path: str, content_types: list = ['text']):
    # Add content type filtering
    processors = []
    if 'text' in content_types:
        processors.append(TextProcessor())
    if 'tables' in content_types:
        processors.append(TableExtractor())
    if 'figures' in content_types:
        processors.append(FigureCaptionExtractor())
    
    chunks = []
    for processor in processors:
        chunks.extend(processor.process(document_path))
    
    # Add cross-modal references
    for chunk in chunks:
        if chunk['type'] == 'figure':
            chunk['text_references'] = find_text_references(chunk['caption'])
        elif chunk['type'] == 'table':
            chunk['summary'] = generate_table_summary(chunk['content'])
    
    return chunks

def calculate_relevance_score(content: str, query: str) -> float:
    # Implement hybrid scoring
    semantic_sim = cosine_similarity(
        embed(content), 
        embed(query)
    )
    keyword_overlap = jaccard_similarity(
        set(content.split()), 
        set(query.split())
    )
    return 0.7 * semantic_sim + 0.3 * keyword_overlap 