from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from openai import AsyncAzureOpenAI
from ...services.graph_rag_service import GraphRAGService
from ...core.config import get_openai_client

router = APIRouter()

async def get_rag_service() -> GraphRAGService:
    """Dependency to get the GraphRAG service instance."""
    client = await get_openai_client()
    return GraphRAGService(client)

@router.post("/articles/process")
async def process_article(
    content: str,
    metadata: Dict[str, Any] = None,
    rag_service: GraphRAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """Process a new article and add it to the database."""
    try:
        article = await rag_service.process_article(content, metadata)
        return {
            "status": "success",
            "article_id": article.id,
            "title": article.title,
            "concepts_found": len(article.concepts),
            "citations_found": len(article.citations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/articles/query")
async def query_articles(
    query: str,
    context_depth: int = 1,
    rag_service: GraphRAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """Query the knowledge base using graph-enhanced RAG."""
    try:
        response = await rag_service.query(query, context_depth)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/articles/{article_id}/graph")
async def get_article_graph(
    article_id: str,
    rag_service: GraphRAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """Get the knowledge graph visualization data for an article."""
    try:
        graph_data = rag_service.get_article_graph(article_id)
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/articles/{article_id}/citations")
async def get_citation_network(
    article_id: str,
    depth: int = 1,
    rag_service: GraphRAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """Get the citation network for an article."""
    try:
        article = rag_service.db.get_article(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
            
        citation_graph = rag_service.db.get_citation_subgraph(article_id, depth)
        
        nodes = []
        links = []
        
        # Add nodes
        for node in citation_graph.nodes():
            if node in rag_service.db.articles:
                article = rag_service.db.articles[node]
                nodes.append({
                    "id": node,
                    "label": article.title,
                    "year": article.year,
                    "authors": [a.name for a in article.authors]
                })
        
        # Add links
        for source, target in citation_graph.edges():
            links.append({
                "source": source,
                "target": target,
                "label": "cites"
            })
            
        return {
            "nodes": nodes,
            "links": links
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/articles/{article_id}/concepts")
async def get_concept_network(
    article_id: str,
    depth: int = 1,
    rag_service: GraphRAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """Get the concept network for an article."""
    try:
        article = rag_service.db.get_article(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
            
        nodes = []
        links = []
        
        # Add article concepts
        for concept in article.concepts:
            nodes.append({
                "id": concept.name,
                "label": concept.name,
                "category": concept.category,
                "type": "primary"
            })
            
            # Get related concepts
            concept_graph = rag_service.db.get_concept_subgraph(concept.name, depth)
            
            # Add related concepts and links
            for node in concept_graph.nodes():
                if node != concept.name:
                    nodes.append({
                        "id": node,
                        "label": node,
                        "type": "related"
                    })
                    links.append({
                        "source": concept.name,
                        "target": node,
                        "label": "related"
                    })
                    
        return {
            "nodes": nodes,
            "links": links
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 