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
            try:
                collection = self.client.get_collection(name=safe_name)
                if not collection:
                    logger.warning(f"Collection {name} not found")
                    return None
                return collection
            except Exception as e:
                logger.error(f"Error getting collection {name}: {e}")
                return None
            
        except Exception as e:
            logger.error(f"Error getting collection {name}: {e}")
            return None

    def get_collection_data(self, name: str) -> Dict[str, Any]:
        """Get all data from a collection including embeddings, documents, and metadata."""
        try:
            collection = self.get_collection(name)
            if not collection:
                return None
                
            # Get all data including embeddings
            try:
                # First get the count to ensure we have the right limit
                count = collection.count()
                if count == 0:
                    logger.warning(f"Collection {name} is empty")
                    return None

                logger.info(f"Retrieving {count} documents from collection {name}")
                results = collection.get(include=["embeddings", "documents", "metadatas"])
                
                if not results:
                    logger.warning(f"No results found in collection {name}")
                    return None
                    
                if not isinstance(results, dict):
                    logger.warning(f"Invalid results format in collection {name}: {type(results)}")
                    return None
                    
                embeddings = results.get('embeddings')
                if not embeddings:
                    logger.warning(f"No embeddings found in collection {name}")
                    return None
                
                documents = results.get('documents', [])
                metadatas = results.get('metadatas', [])
                
                logger.info(f"Successfully retrieved {len(embeddings)} embeddings, {len(documents)} documents, and {len(metadatas)} metadata entries")
                
                # Log some sample data for debugging
                if embeddings and documents and metadatas:
                    logger.info(f"First document preview: {documents[0][:100]}...")
                    logger.info(f"First metadata: {metadatas[0]}")
                    logger.info(f"First embedding shape: {len(embeddings[0])} dimensions")
                
                return {
                    'embeddings': embeddings,
                    'documents': documents,
                    'metadatas': metadatas
                }
            except Exception as inner_e:
                logger.error(f"Error getting collection data: {inner_e}")
                return None
            
        except Exception as e:
            logger.error(f"Error getting collection data for {name}: {e}")
            return None

    def add_chunks(self, collection_name: str, chunks: List[DocumentChunk]):
        try:
            if not chunks:
                logger.warning("No chunks to add to collection")
                return
            
            # Always create a new collection
            collection = self.create_collection(collection_name)
            
            # Get embeddings for chunks
            texts = []
            for chunk in chunks:
                if chunk.metadata.get("is_table") == "true":
                    # For tables, include a description to improve semantic search
                    table_text = chunk.content
                    # Extract headers from the table
                    headers = []
                    rows = table_text.split('\n')
                    if len(rows) > 1:  # Ensure we have at least headers and separator
                        headers = [h.strip() for h in rows[0].split('|') if h.strip()]
                    # Create a descriptive text for the table
                    table_description = f"Table containing columns: {', '.join(headers)}. {table_text}"
                    texts.append(table_description)
                else:
                    texts.append(chunk.content)
            
            logger.info(f"Generating embeddings for {len(texts)} chunks")
            
            # Log first text for debugging
            if texts:
                logger.info(f"First text sample: {texts[0][:200]}...")
            
            embeddings = self.embedding_function.get_embeddings(texts)
            
            if embeddings is None or len(embeddings) == 0:
                logger.error("Failed to generate embeddings")
                raise ValueError("Failed to generate embeddings")
                
            if len(embeddings) != len(chunks):
                logger.error(f"Mismatch between number of embeddings ({len(embeddings)}) and chunks ({len(chunks)})")
                raise ValueError("Embedding count does not match chunk count")
            
            # Log embedding shape information
            if embeddings:
                logger.info(f"First embedding shape: {len(embeddings[0])} dimensions")
                logger.info(f"Successfully generated {len(embeddings)} embeddings")
            
            # Prepare data for addition
            documents = [chunk.content for chunk in chunks]
            metadatas = [chunk.metadata for chunk in chunks]
            ids = [chunk.chunk_id for chunk in chunks]
            
            # Add to collection
            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            
            logger.info(f"Successfully added {len(chunks)} chunks to collection {collection_name}")
            
        except Exception as e:
            logger.error(f"Error adding chunks to collection: {e}")
            raise

    def search(self, collection_name: str, query: str, limit: int = 5) -> Dict[str, Any]:
        """Search for similar chunks in the collection."""
        try:
            collection = self.get_collection(collection_name)
            if not collection:
                logger.error(f"Collection {collection_name} not found")
                return {"documents": [], "metadatas": [], "distances": []}
            
            # Check if query is likely looking for tabular data
            table_keywords = ["table", "comparison", "statistics", "data", "metrics", "results", "performance", "numbers"]
            is_table_query = any(keyword in query.lower() for keyword in table_keywords)
            
            # Get query embedding
            query_embedding = self.embedding_function.get_embedding(query)
            
            # Search with potentially different limits based on query type
            search_limit = limit * 2 if is_table_query else limit  # Get more results if looking for tables
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=search_limit,
                include=["documents", "metadatas", "distances"]
            )
            
            if not results or not results["documents"]:
                return {"documents": [], "metadatas": [], "distances": []}
            
            documents = results["documents"][0]  # First list since we only have one query
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]
            
            # If query is table-related, prioritize table chunks
            if is_table_query:
                # Separate tables and non-tables
                table_results = []
                other_results = []
                
                for doc, meta, dist in zip(documents, metadatas, distances):
                    if meta.get("is_table") == "true":
                        table_results.append((doc, meta, dist))
                    else:
                        other_results.append((doc, meta, dist))
                
                # Combine results, prioritizing tables but keeping some context
                combined_results = (table_results + other_results)[:limit]
                
                # Unzip the combined results
                documents = [r[0] for r in combined_results]
                metadatas = [r[1] for r in combined_results]
                distances = [r[2] for r in combined_results]
            else:
                # For non-table queries, just take the top results
                documents = documents[:limit]
                metadatas = metadatas[:limit]
                distances = distances[:limit]
            
            return {
                "documents": documents,
                "metadatas": metadatas,
                "distances": distances
            }
            
        except Exception as e:
            logger.error(f"Error searching collection: {e}")
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
