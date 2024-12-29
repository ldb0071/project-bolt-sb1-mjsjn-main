import os
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self, persist_directory: str = "chroma_db"):
        """Initialize the vector store with ChromaDB"""
        self.persist_directory = persist_directory
        
        # Create persist directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Use sentence-transformers for embeddings
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Initialize collections
        self.papers_collection = self.client.get_or_create_collection(
            name="research_papers",
            embedding_function=self.embedding_function,
            metadata={"description": "Research papers from various sources"}
        )

    def add_papers(self, papers: List[Dict[str, Any]]) -> None:
        """Add papers to the vector store"""
        try:
            # Prepare data for ChromaDB
            documents = []  # Text content for embedding
            metadatas = []  # Additional metadata
            ids = []        # Unique IDs
            
            for paper in papers:
                # Combine title and summary for better semantic search
                content = f"{paper['title']} {paper.get('summary', '')}"
                documents.append(content)
                
                # Prepare metadata
                metadata = {
                    "title": paper["title"],
                    "authors": ", ".join(paper["authors"]) if isinstance(paper.get("authors"), list) else paper.get("authors", ""),
                    "published": paper.get("published", ""),
                    "source": paper.get("source", "unknown"),
                    "pdf_url": paper.get("pdfUrl", "")
                }
                metadatas.append(metadata)
                
                # Use paper ID or generate one
                paper_id = str(paper.get("id", hash(paper["title"])))
                ids.append(paper_id)
            
            # Add to collection in batches
            batch_size = 100
            for i in range(0, len(documents), batch_size):
                end_idx = min(i + batch_size, len(documents))
                self.papers_collection.add(
                    documents=documents[i:end_idx],
                    metadatas=metadatas[i:end_idx],
                    ids=ids[i:end_idx]
                )
                
            logger.info(f"Successfully added {len(documents)} papers to vector store")
            
        except Exception as e:
            logger.error(f"Error adding papers to vector store: {str(e)}")
            raise

    def add_document(self, document_id: str, text: str, metadata: Dict[str, Any]) -> None:
        """Add a single document to the vector store"""
        try:
            # Add to collection
            self.papers_collection.add(
                documents=[text],
                metadatas=[metadata],
                ids=[document_id]
            )
            logger.info(f"Successfully added document {document_id} to vector store")
        except Exception as e:
            logger.error(f"Error adding document to vector store: {str(e)}")
            raise

    def search_papers(
        self,
        query: str,
        n_results: int = 10,
        source_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search papers using semantic similarity"""
        try:
            # Prepare where clause for filtering
            where = {"source": source_filter} if source_filter else None
            
            # Query the collection
            results = self.papers_collection.query(
                query_texts=[query],
                n_results=n_results,
                where=where
            )
            
            # Format results
            papers = []
            if results and results['metadatas']:
                for metadata, distance in zip(results['metadatas'][0], results['distances'][0]):
                    paper = metadata.copy()
                    paper['similarity_score'] = 1 - distance  # Convert distance to similarity score
                    papers.append(paper)
            
            return papers
            
        except Exception as e:
            logger.error(f"Error searching papers in vector store: {str(e)}")
            raise

    def clear_collection(self) -> None:
        """Clear all papers from the collection"""
        try:
            self.papers_collection.delete()
            self.papers_collection = self.client.get_or_create_collection(
                name="research_papers",
                embedding_function=self.embedding_function
            )
            logger.info("Successfully cleared papers collection")
        except Exception as e:
            logger.error(f"Error clearing papers collection: {str(e)}")
            raise
