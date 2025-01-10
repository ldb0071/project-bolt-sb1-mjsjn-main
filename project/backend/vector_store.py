import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any
from models import DocumentChunk
import logging
import os
import shutil
import time

logger = logging.getLogger(__name__)

class ChromaStore:
    def __init__(self, persist_directory: str, embedding_function: Any):
        self.persist_directory = persist_directory
        self.embedding_function = embedding_function
        
        # Ensure directory exists
        os.makedirs(persist_directory, exist_ok=True)
        
        try:
            # Initialize ChromaDB client with older version settings
            self.client = chromadb.PersistentClient(
                path=persist_directory,
                settings=Settings(
                    anonymized_telemetry=False,
                    is_persistent=True
                )
            )
            
            # Test if database is accessible
            try:
                self.client.list_collections()
            except Exception as e:
                logger.warning(f"Database access error: {e}")
                # If there's an error, try to recreate the client
                self.client = chromadb.PersistentClient(
                    path=persist_directory,
                    settings=Settings(
                        anonymized_telemetry=False,
                        is_persistent=True
                    )
                )
                
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB client: {e}")
            raise

    def _delete_collection_if_exists(self, name: str) -> None:
        """Delete a collection if it exists."""
        try:
            self.client.delete_collection(name)
            logger.info(f"Deleted existing collection: {name}")
        except Exception:
            # Ignore if collection doesn't exist
            pass

    def _get_safe_collection_name(self, name: str) -> str:
        """
        Convert a project name into a valid ChromaDB collection name.
        Collection names must:
        1. Be 3-63 characters long
        2. Start and end with alphanumeric
        3. Contain only alphanumeric, underscore, hyphen
        4. No consecutive periods
        5. Not be a valid IPv4 address
        """
        # Replace spaces and special chars with underscore
        safe_name = name.replace(" ", "_").replace("-", "_").lower()
        
        # Remove any non-alphanumeric characters except underscore
        safe_name = ''.join(c for c in safe_name if c.isalnum() or c == '_')
        
        # Ensure minimum length of 3 characters
        while len(safe_name) < 3:
            safe_name += "_collection"
        
        # Truncate to maximum length if needed
        if len(safe_name) > 63:
            safe_name = safe_name[:63]
        
        # Ensure starts and ends with alphanumeric
        if not safe_name[0].isalnum():
            safe_name = "c" + safe_name[1:]
        if not safe_name[-1].isalnum():
            safe_name = safe_name[:-1] + "x"
        
        return safe_name

    def create_collection(self, name: str):
        """Create a new collection, deleting the old one if it exists."""
        try:
            safe_name = self._get_safe_collection_name(name)
            
            # Delete existing collection if it exists
            self._delete_collection_if_exists(safe_name)
            
            # Create new collection
            collection = self.client.create_collection(
                name=safe_name,
                metadata={"hnsw:space": "cosine"}
            )
            
            logger.info(f"Created new collection: {safe_name}")
            return collection
            
        except Exception as e:
            logger.error(f"Error creating collection {name}: {e}")
            raise

    def get_collection(self, name: str):
        """Get an existing collection."""
        try:
            safe_name = self._get_safe_collection_name(name)
            return self.client.get_collection(
                name=safe_name,
                embedding_function=self.embedding_function
            )
        except Exception:
            return None

    def add_chunks(self, collection_name: str, chunks: List[DocumentChunk]):
        try:
            if not chunks:
                logger.warning("No chunks to add to collection")
                return
            
            # Always create a new collection
            collection = self.create_collection(collection_name)
            
            # Get embeddings for chunks
            texts = [chunk.content for chunk in chunks]
            embeddings = self.embedding_function.get_embeddings(texts)
            
            # Prepare data for addition
            documents = [chunk.content for chunk in chunks]
            metadatas = [chunk.metadata for chunk in chunks]
            ids = [f"chunk_{chunk.chunk_id}" for chunk in chunks]
            
            # Add all chunks in a single request
            collection.add(
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            
            logger.info(f"Added {len(chunks)} chunks to collection {collection_name}")
            
        except Exception as e:
            logger.error(f"Error adding chunks to collection {collection_name}: {e}")
            raise

    def search(self, collection_name: str, query: str, limit: int = 5):
        try:
            safe_name = self._get_safe_collection_name(collection_name)
            collection = self.client.get_collection(name=safe_name)
            
            if not collection:
                logger.warning(f"Collection {collection_name} not found")
                return {"documents": [], "metadatas": [], "distances": []}
            
            # Get query embedding
            query_embedding = self.embedding_function.get_embedding(query)
            
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=limit,
                include=["documents", "metadatas", "distances"]
            )
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching collection {collection_name}: {e}")
            raise

    def get_collection_stats(self, collection_name: str) -> Dict[str, Any]:
        try:
            safe_name = self._get_safe_collection_name(collection_name)
            
            try:
                collection = self.client.get_collection(name=safe_name)
            except Exception as e:
                logger.warning(f"Error accessing collection {safe_name}: {e}")
                return {
                    "total_documents": 0,
                    "sources": [],
                    "chunks_per_source": {}
                }
            
            if not collection:
                return {
                    "total_documents": 0,
                    "sources": [],
                    "chunks_per_source": {}
                }
            
            try:
                # Get all documents and metadata
                results = collection.get(include=["metadatas"])
                
                stats = {
                    "total_documents": len(results["ids"]) if results else 0,
                    "sources": set(),
                    "chunks_per_source": {}
                }
                
                if results and results["metadatas"]:
                    for metadata in results["metadatas"]:
                        source = metadata.get("source", "unknown")
                        stats["sources"].add(source)
                        stats["chunks_per_source"][source] = stats["chunks_per_source"].get(source, 0) + 1
                    
                    stats["sources"] = list(stats["sources"])
                
                return stats
            except Exception as inner_e:
                logger.error(f"Error getting collection data: {inner_e}")
                return {
                    "total_documents": 0,
                    "sources": [],
                    "chunks_per_source": {}
                }
            
        except Exception as e:
            logger.error(f"Error getting stats for collection {collection_name}: {e}")
            return {
                "total_documents": 0,
                "sources": [],
                "chunks_per_source": {}
            }
