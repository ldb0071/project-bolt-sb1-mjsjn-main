from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from ....domain.models import Paper, SearchResult
from ....services.paper_service import PaperService
from ....core.dependencies import get_paper_service
from ....core.config import get_settings

router = APIRouter()
settings = get_settings()

@router.get("/search", response_model=SearchResult)
async def search_papers(
    query: str = Query(..., description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Results per page"),
    source: Optional[str] = Query(None, description="Filter by source"),
    use_semantic: bool = Query(False, description="Use semantic search"),
    paper_service: PaperService = Depends(get_paper_service)
):
    """
    Search for papers using keyword or semantic search
    """
    filters = {"source": source} if source else {}
    
    try:
        papers = await paper_service.search_papers(
            query=query,
            filters=filters,
            page=page,
            page_size=page_size,
            use_semantic=use_semantic
        )
        
        total_papers = len(papers)  # In production, this should be a separate count query
        total_pages = (total_papers + page_size - 1) // page_size
        
        return SearchResult(
            items=papers,
            total=total_papers,
            page=page,
            total_pages=total_pages,
            query=query,
            filters=filters
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{paper_id}", response_model=Paper)
async def get_paper(
    paper_id: str,
    paper_service: PaperService = Depends(get_paper_service)
):
    """
    Get a specific paper by ID
    """
    try:
        paper = await paper_service.get_paper(paper_id)
        return paper
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{paper_id}/pdf")
async def download_paper_pdf(
    paper_id: str,
    paper_service: PaperService = Depends(get_paper_service)
):
    """
    Download paper PDF
    """
    try:
        paper = await paper_service.get_paper(paper_id)
        if not paper.pdf_url:
            raise HTTPException(
                status_code=404,
                detail="PDF not available for this paper"
            )
        
        # In production, implement proper PDF streaming
        return StreamingResponse(
            paper_service.stream_pdf(paper.pdf_url),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{paper.id}.pdf"'
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
