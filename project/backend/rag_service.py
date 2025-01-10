import os
import logging
from typing import List, Dict, Optional, Any, Union
from dotenv import load_dotenv
from openai import AzureOpenAI
from openai.types.chat import ChatCompletion
from openai.types.embedding import Embedding
from document_processor import DocumentProcessor
from vector_store import ChromaStore
from models import MarkdownDocument, DocumentChunk, SearchResult

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

SYSTEM_PROMPT = """You are a knowledgeable AI assistant with access to a specific set of documents. Your role is to:
1. Provide accurate, clear, and concise answers based solely on the provided context
2. If the context doesn't contain enough information, clearly state that you cannot answer
3. If the context is partially relevant, explain what you can answer and what information is missing
4. Always maintain a helpful and professional tone

When answering:
- Focus on the most relevant information from the context
- Use direct quotes when appropriate to support your answers
- Break down complex information into digestible parts
- Provide specific references to sources when possible

Context: {context}

Remember: Only answer based on the provided context. If you're unsure or the information isn't in the context, say so."""

class AzureOpenAIEmbedder:
    def __init__(self, client: AzureOpenAI, model: str = "text-embedding-3-small"):
        self.client = client
        self.model = model
        self.dimensions = None
        # Initialize dimensions
        test_response = self.get_embeddings(["test"])
        self.dimensions = len(test_response[0])

    def get_embedding(self, text: str) -> List[float]:
        return self.get_embeddings([text])[0]

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        try:
            response = self.client.embeddings.create(
                input=texts,
                model=self.model
            )
            return [item.embedding for item in response.data]
        except Exception as e:
            logger.error(f"Error getting embeddings: {e}")
            raise

class RAGService:
    def __init__(self, github_token: str = None, azure_endpoint: str = None):
        try:
            self.github_token = github_token or os.getenv('GITHUB_TOKEN')
            self.azure_endpoint = azure_endpoint or os.getenv('AZURE_ENDPOINT', "https://models.inference.ai.azure.com")
            
            if not self.github_token:
                raise ValueError("GitHub token not found in environment variables or constructor")
            
            # Initialize Azure OpenAI client
            self.azure_client = AzureOpenAI(
                api_key=self.github_token,
                azure_endpoint=self.azure_endpoint,
                api_version="2023-05-15"
            )
            
            # Initialize embeddings with larger model
            self.embeddings = AzureOpenAIEmbedder(
                client=self.azure_client,
                model="text-embedding-3-large"
            )
            logger.info("Embeddings model initialized successfully")
            
            # Initialize chat model
            self.llm = self.azure_client.chat.completions
            logger.info("Chat model initialized successfully")
            
            # Initialize document processor with larger chunks
            self.document_processor = DocumentProcessor(
                chunk_size=4000,  # Increased from 1000
                chunk_overlap=400  # Increased from 100
            )
            logger.info("Document processor initialized successfully")
            
            # Base directory for storage
            self.persist_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma_db")
            os.makedirs(self.persist_directory, exist_ok=True)
            
            # Initialize vector store
            self.vector_store = ChromaStore(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings
            )
            logger.info("Vector store initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing RAG service: {e}")
            raise

    async def process_markdown_files(self, project_name: str, markdown_dir: str = None) -> Dict[str, Any]:
        try:
            # Normalize project name for directory lookup
            safe_project_name = project_name.replace("-", "_").replace(" ", "_").lower()
            
            # Construct the full path to the markdown directory
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            project_dir = os.path.join(base_dir, "projects", safe_project_name)
            markdown_dir = markdown_dir or os.path.join(project_dir, "markdown")
            
            if not os.path.exists(markdown_dir):
                raise ValueError(f"Directory not found: {markdown_dir}")
            
            logger.info(f"Looking for markdown files in: {markdown_dir}")
            
            # Get markdown files
            markdown_files = []
            for root, _, files in os.walk(markdown_dir):
                for file in files:
                    if file.endswith('.md'):
                        full_path = os.path.join(root, file)
                        markdown_files.append(full_path)
                        logger.info(f"Found markdown file: {full_path}")
            
            if not markdown_files:
                logger.warning(f"No markdown files found in {markdown_dir}")
                return {"message": "No markdown files found", "files_processed": 0, "chunks_created": 0}
            
            logger.info(f"Found {len(markdown_files)} markdown files")
            
            # Process all files and collect chunks
            all_chunks = []
            
            for file_path in markdown_files:
                try:
                    # Process markdown file
                    document = self.document_processor.process_markdown(file_path, markdown_dir)
                    
                    # Create chunks
                    document_chunks = self.document_processor.create_chunks(document)
                    all_chunks.extend(document_chunks)
                    
                except Exception as e:
                    logger.error(f"Error processing {file_path}: {e}")
                    continue
            
            if not all_chunks:
                logger.warning("No valid chunks were created from the markdown files")
                return {"message": "No valid chunks created", "files_processed": len(markdown_files), "chunks_created": 0}
            
            # Add all chunks in a single operation
            try:
                self.vector_store.add_chunks(project_name, all_chunks)
                return {
                    "message": "Successfully processed files",
                    "files_processed": len(markdown_files),
                    "chunks_created": len(all_chunks)
                }
            except Exception as e:
                logger.error(f"Error adding chunks to vector store: {e}")
                raise
            
        except Exception as e:
            logger.error(f"Error processing markdown files: {e}")
            raise

    async def chat(self, project_name: str, query: str) -> Dict[str, Any]:
        try:
            # Search for relevant chunks
            results = self.vector_store.search(project_name, query)
            
            if not results["documents"]:
                return {
                    "answer": "I don't have enough relevant information to answer this question.",
                    "sources": []
                }
            
            # Prepare context
            context = "\n\n".join(results["documents"][0])
            
            # Generate response using Azure OpenAI
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT.format(context=context)},
                {"role": "user", "content": query}
            ]
            
            response: ChatCompletion = self.llm.create(
                model="gpt-4o",
                messages=messages,
                temperature=0.3,
                max_tokens=1000
            )
            
            answer = response.choices[0].message.content
            
            # Format response with sources
            return {
                "answer": answer,
                "sources": [
                    {
                        "source": metadata.get("source", "unknown"),
                        "section": metadata.get("section", "unknown"),
                        "preview": doc[:200] + "..."
                    }
                    for metadata, doc in zip(results["metadatas"][0], results["documents"][0])
                ]
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise

    def get_project_stats(self, project_name: str) -> Dict[str, Any]:
        try:
            return self.vector_store.get_collection_stats(project_name)
        except Exception as e:
            logger.error(f"Error getting project stats: {e}")
            raise 