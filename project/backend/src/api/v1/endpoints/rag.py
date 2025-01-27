from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from ....services.rag_service import ScientificRAGService
from ....core.deps import get_rag_service

router = APIRouter()

@router.post("/query")
async def query_rag(query: str, rag_service: ScientificRAGService = Depends(get_rag_service)) -> Dict[str, Any]:
    try:
        return await rag_service.query(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/debug/cag")
async def debug_cag(query: str, rag_service: ScientificRAGService = Depends(get_rag_service)) -> Dict[str, Any]:
    """Debug endpoint to check CAG functionality."""
    try:
        return await rag_service.debug_cag(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 