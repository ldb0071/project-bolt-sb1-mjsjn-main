from typing import List, Dict, Any, Optional
import networkx as nx
from datetime import datetime
from openai import AsyncAzureOpenAI
from .database_service import ArticleDatabase
from .article_processor import ArticleProcessor
from ..models.article import ScientificArticle, Citation, Concept

class GraphRAGService:
    """Service that combines graph-based knowledge with RAG capabilities."""
    
    def __init__(self, openai_client: AsyncAzureOpenAI):
        """Initialize the GraphRAG service."""
        self.openai_client = openai_client
        self.db = ArticleDatabase()
        self.processor = ArticleProcessor()
        
    async def process_article(self, content: str, metadata: Dict = None) -> ScientificArticle:
        """Process a new article and add it to the database."""
        article = await self.processor.process_markdown(content, metadata)
        self.db.add_article(article)
        return article
    
    async def query(self, query: str, context_depth: int = 1) -> Dict[str, Any]:
        """Process a query using graph-enhanced RAG."""
        # Step 1: Extract concepts from the query
        concepts = self._extract_query_concepts(query)
        
        # Step 2: Find relevant articles through concept graph
        relevant_articles = []
        for concept in concepts:
            # Get concept subgraph
            concept_graph = self.db.get_concept_subgraph(concept.name, depth=context_depth)
            
            # Find articles discussing related concepts
            for node in concept_graph.nodes():
                articles = self.db.get_articles_by_concept(node)
                relevant_articles.extend(articles)
        
        # Step 3: Expand context through citation graph
        cited_articles = []
        for article in relevant_articles:
            # Get citation subgraph
            citation_graph = self.db.get_citation_subgraph(article.id, depth=context_depth)
            
            # Add cited and citing articles
            for node in citation_graph.nodes():
                if node in self.db.articles:
                    cited_articles.append(self.db.articles[node])
        
        # Combine and deduplicate articles
        all_articles = list({art.id: art for art in relevant_articles + cited_articles}.values())
        
        # Step 4: Prepare context from articles
        context = self._prepare_context(all_articles, query)
        
        # Step 5: Generate response using RAG
        response = await self._generate_response(query, context)
        
        return {
            "response": response,
            "articles_used": len(all_articles),
            "concepts_found": len(concepts),
            "citation_depth": context_depth
        }
    
    def get_article_graph(self, article_id: str) -> Dict[str, Any]:
        """Get the knowledge graph visualization data for an article."""
        article = self.db.get_article(article_id)
        if not article:
            return {"nodes": [], "links": []}
        
        # Initialize graph components
        nodes = []
        links = []
        
        # Add article node
        nodes.append({
            "id": article.id,
            "label": article.title,
            "type": "article",
            "color": "#4CAF50"  # Green for articles
        })
        
        # Add and connect concepts
        for concept in article.concepts:
            nodes.append({
                "id": f"concept_{concept.name}",
                "label": concept.name,
                "type": "concept",
                "color": "#FF9800"  # Orange for concepts
            })
            links.append({
                "source": article.id,
                "target": f"concept_{concept.name}",
                "label": "discusses"
            })
        
        # Add and connect citations
        for citation in article.citations:
            if citation.doi:  # Only add citations with DOIs
                nodes.append({
                    "id": citation.doi,
                    "label": citation.title,
                    "type": "citation",
                    "color": "#2196F3"  # Blue for citations
                })
                links.append({
                    "source": article.id,
                    "target": citation.doi,
                    "label": "cites"
                })
        
        return {
            "nodes": nodes,
            "links": links
        }
    
    def _extract_query_concepts(self, query: str) -> List[Concept]:
        """Extract concepts from the query text."""
        return self.processor._extract_concepts(query)
    
    def _prepare_context(self, articles: List[ScientificArticle], query: str) -> str:
        """Prepare context from relevant articles."""
        context_parts = []
        
        for article in articles:
            # Add article title and authors
            context_parts.append(f"Title: {article.title}")
            authors = ", ".join(a.name for a in article.authors)
            context_parts.append(f"Authors: {authors}")
            
            # Add abstract
            context_parts.append(f"Abstract: {article.abstract}")
            
            # Add relevant sections based on query concepts
            query_concepts = self._extract_query_concepts(query)
            for section in article.sections:
                section_concepts = set(c.name for c in section.concepts)
                query_concept_names = set(c.name for c in query_concepts)
                if section_concepts & query_concept_names:  # If there's overlap
                    context_parts.append(f"Section - {section.title}: {section.content}")
        
        return "\n\n".join(context_parts)
    
    async def _generate_response(self, query: str, context: str) -> str:
        """Generate a response using the OpenAI API."""
        system_prompt = """You are a knowledgeable research assistant. Using the provided context from scientific articles, 
        answer the user's question. Include relevant citations in your response using the format: 
        Author1, Author2, and Author3. Title. Conference/Journal, Year. For more than three authors, use: 
        Author1 et al. Title. Conference/Journal, Year."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ]
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content 