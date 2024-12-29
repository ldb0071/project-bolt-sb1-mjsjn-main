from typing import List, Dict, Any, Optional
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from ..core.config import get_settings

class VectorStore:
    def __init__(self):
        self.settings = get_settings()
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = self.settings.VECTOR_DIMENSION
        self.index = faiss.IndexFlatL2(self.dimension)
        self.id_to_metadata: Dict[str, Dict[str, Any]] = {}
        
    async def encode_text(self, text: str) -> List[float]:
        """Convert text to vector embedding"""
        embedding = self.model.encode(text)
        return embedding.tolist()
    
    async def index(
        self,
        id: str,
        vector: List[float],
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Add vector to the index with associated metadata"""
        vector_np = np.array([vector], dtype=np.float32)
        self.index.add(vector_np)
        if metadata:
            self.id_to_metadata[id] = metadata
    
    async def search(
        self,
        query_vector: List[float],
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Search for similar vectors"""
        query_np = np.array([query_vector], dtype=np.float32)
        distances, indices = self.index.search(query_np, limit)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1:  # No more results
                break
                
            metadata = self.id_to_metadata.get(str(idx), {})
            if filters:
                # Apply filters
                matches_filters = all(
                    metadata.get(k) == v 
                    for k, v in filters.items()
                )
                if not matches_filters:
                    continue
            
            results.append({
                "id": str(idx),
                "score": float(distances[0][i]),
                "metadata": metadata
            })
        
        return results
    
    async def delete(self, id: str) -> None:
        """Remove a vector from the index"""
        # Note: FAISS doesn't support direct deletion
        # In production, we'd need to rebuild the index or use a different solution
        if id in self.id_to_metadata:
            del self.id_to_metadata[id]
