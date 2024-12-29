from typing import List, Optional, Dict, Any
from fastapi import HTTPException
from ..domain.models import Paper
from ..domain.repositories import PaperRepository
from ..core.config import get_settings
from ..infrastructure.vector_store import VectorStore

class PaperService:
    def __init__(
        self,
        paper_repository: PaperRepository,
        vector_store: VectorStore,
    ):
        self.paper_repository = paper_repository
        self.vector_store = vector_store
        self.settings = get_settings()
    
    async def search_papers(
        self,
        query: str,
        filters: Dict[str, Any],
        page: int = 1,
        page_size: int = 10,
        use_semantic: bool = False
    ) -> List[Paper]:
        if use_semantic:
            # Get vector embedding for query
            query_embedding = await self.vector_store.encode_text(query)
            # Search by vector similarity
            results = await self.vector_store.search(
                query_embedding,
                filters=filters,
                limit=page_size
            )
        else:
            # Regular keyword search
            results = await self.paper_repository.search(
                query,
                filters,
                page,
                page_size
            )
        
        return results
    
    async def get_paper(self, paper_id: str) -> Optional[Paper]:
        paper = await self.paper_repository.get_by_id(paper_id)
        if not paper:
            raise HTTPException(status_code=404, detail="Paper not found")
        return paper
    
    async def save_paper(self, paper: Paper) -> Paper:
        # Generate vector embedding
        if paper.abstract:
            embedding = await self.vector_store.encode_text(paper.abstract)
            paper.vector_embedding = embedding
        
        # Save to repository
        saved_paper = await self.paper_repository.save(paper)
        
        # Index in vector store if embedding exists
        if paper.vector_embedding:
            await self.vector_store.index(
                paper.id,
                paper.vector_embedding,
                {"source": paper.source}
            )
        
        return saved_paper
