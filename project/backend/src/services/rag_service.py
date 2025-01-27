import os
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from openai import AzureOpenAI
import networkx as nx
from ..models.article import ScientificArticle, Citation, Concept
from ..database.article_store import ArticleStore
from .article_processor import ArticleProcessor

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ScientificRAGService:
    """Service that enhances GPT-4 with both graph-based knowledge retrieval (RAG) 
    and context-augmented generation (CAG) for scientific articles.
    
    This service combines:
    1. GPT-4 for text generation
    2. Graph-based knowledge representation for context retrieval (RAG)
    3. Context-augmented generation for improved relevance (CAG)
    4. Scientific domain-specific processing
    """
    
    def __init__(self, storage_dir: str, azure_endpoint: str = None, api_key: str = None, 
                 deployment_name: str = None):
        """Initialize the service with GPT-4 and knowledge enhancement components."""
        self.storage_dir = storage_dir
        self.article_store = ArticleStore(storage_dir)
        self.article_processor = ArticleProcessor()
        
        # Initialize Azure OpenAI client for GPT-4
        self.azure_endpoint = azure_endpoint or os.getenv('AZURE_ENDPOINT')
        self.api_key = api_key or os.getenv('AZURE_API_KEY')
        self.deployment_name = deployment_name or os.getenv('AZURE_GPT4_DEPLOYMENT', 'gpt-4')
        
        if not (self.azure_endpoint and self.api_key):
            raise ValueError("Azure OpenAI credentials not found")
            
        self.client = AzureOpenAI(
            api_key=self.api_key,
            azure_endpoint=self.azure_endpoint,
            api_version="2024-02-15-preview"
        )
    
    async def process_article(self, content: str, metadata: Dict[str, Any]) -> ScientificArticle:
        """Process a scientific article and add it to the knowledge base."""
        try:
            # Process the article
            article = self.article_processor.process_markdown(content, metadata)
            
            # Store the article and update the knowledge graph
            self.article_store.add_article(article)
            
            return article
        except Exception as e:
            logger.error(f"Error processing article: {e}")
            raise
    
    async def query(self, query: str, context_size: int = 3) -> Dict[str, Any]:
        """Process a query using both RAG and CAG approaches."""
        try:
            # Step 1: RAG - Extract concepts and build graph context
            concepts = self.article_processor._extract_concepts(query)
            logger.info(f"Extracted concepts: {[c.name for c in concepts]}")
            
            # Get relevant articles through concept search (RAG)
            relevant_articles = set()
            for concept in concepts:
                articles = self.article_store.search_by_concept(concept.name)
                relevant_articles.update(articles)
            logger.info(f"Found {len(relevant_articles)} relevant articles")
            
            # Get citation network for relevant articles (RAG)
            citation_context = []
            for article_id in relevant_articles:
                network = self.article_store.get_citation_network(article_id)
                if network["nodes"]:
                    citation_context.append(network)
            
            # Get concept graph (RAG)
            concept_context = []
            for concept in concepts:
                graph = self.article_store.get_concept_graph(concept.name)
                if graph["nodes"]:
                    concept_context.append(graph)
            
            # Step 2: CAG - Build contextual understanding
            context_info = self._build_context_info(query, list(relevant_articles), concepts)
            logger.info(f"CAG Analysis - Query type: {context_info['query_type']}")
            logger.info(f"CAG Analysis - Domain context: {context_info['domain_context']['primary_domains']}")
            logger.info(f"CAG Analysis - Temporal context: {context_info['temporal_context']}")
            
            # Step 3: Combine RAG and CAG for enhanced prompting
            prompt = self._prepare_enhanced_prompt(
                query=query,
                concepts=concepts,
                citation_context=citation_context,
                concept_context=concept_context,
                context_info=context_info
            )
            
            # Generate response using combined RAG+CAG approach
            response = await self._generate_response(prompt)
            
            return {
                "answer": response,
                "context": {
                    "concepts": [c.dict() for c in concepts],
                    "citation_networks": citation_context,
                    "concept_graphs": concept_context,
                    "context_info": context_info
                }
            }
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            raise
    
    def _build_context_info(self, query: str, articles: List[ScientificArticle], 
                           concepts: List[Concept]) -> Dict[str, Any]:
        """Build contextual understanding for CAG."""
        context_info = {
            "query_type": self._identify_query_type(query),
            "domain_context": self._extract_domain_context(articles),
            "temporal_context": self._extract_temporal_context(articles),
            "concept_relationships": self._analyze_concept_relationships(concepts, articles)
        }
        return context_info
    
    def _identify_query_type(self, query: str) -> str:
        """Identify the type of academic query."""
        query_lower = query.lower()
        if any(word in query_lower for word in ["compare", "contrast", "versus", "vs"]):
            return "comparative"
        elif any(word in query_lower for word in ["why", "how", "explain"]):
            return "explanatory"
        elif any(word in query_lower for word in ["recent", "latest", "current"]):
            return "temporal"
        elif any(word in query_lower for word in ["method", "technique", "approach"]):
            return "methodological"
        return "general"
    
    def _extract_domain_context(self, articles: List[ScientificArticle]) -> Dict[str, Any]:
        """Extract domain-specific context from articles."""
        domains = {}
        methodologies = set()
        key_findings = []
        
        for article in articles:
            # Extract domain information from concepts and sections
            for concept in article.concepts:
                if concept.category:
                    domains[concept.category] = domains.get(concept.category, 0) + 1
            
            # Extract methodologies from method sections
            for section in article.sections:
                if any(method_word in section.title.lower() 
                      for method_word in ["method", "methodology", "approach"]):
                    methodologies.update(c.name for c in section.concepts)
            
            # Extract key findings from conclusion/results sections
            for section in article.sections:
                if any(result_word in section.title.lower() 
                      for result_word in ["conclusion", "result", "finding"]):
                    key_findings.append({
                        "article_id": article.id,
                        "finding": section.content[:200]  # First 200 chars as summary
                    })
        
        return {
            "primary_domains": sorted(domains.items(), key=lambda x: x[1], reverse=True)[:3],
            "common_methodologies": list(methodologies)[:5],
            "key_findings": key_findings[:3]
        }
    
    def _extract_temporal_context(self, articles: List[ScientificArticle]) -> Dict[str, Any]:
        """Extract temporal context from articles."""
        years = [a.year for a in articles if a.year]
        if not years:
            return {"temporal_range": None}
            
        return {
            "temporal_range": {
                "earliest": min(years),
                "latest": max(years),
                "median": sorted(years)[len(years)//2]
            }
        }
    
    def _analyze_concept_relationships(self, concepts: List[Concept], 
                                     articles: List[ScientificArticle]) -> List[Dict[str, Any]]:
        """Analyze relationships between concepts across articles."""
        relationships = []
        for i, concept1 in enumerate(concepts):
            for concept2 in concepts[i+1:]:
                # Find articles that mention both concepts
                shared_articles = [
                    article for article in articles
                    if any(c.name == concept1.name for c in article.concepts) and
                    any(c.name == concept2.name for c in article.concepts)
                ]
                
                if shared_articles:
                    relationships.append({
                        "concept1": concept1.name,
                        "concept2": concept2.name,
                        "shared_articles": len(shared_articles),
                        "latest_mention": max(a.year for a in shared_articles if a.year) if any(a.year for a in shared_articles) else None
                    })
        
        return relationships
    
    def _prepare_enhanced_prompt(self, query: str, concepts: List[Concept],
                               citation_context: List[Dict[str, Any]],
                               concept_context: List[Dict[str, Any]],
                               context_info: Dict[str, Any]) -> str:
        """Prepare an enhanced prompt combining RAG and CAG approaches."""
        prompt_parts = [
            "You are a scientific research assistant powered by GPT-4, enhanced with both graph-based knowledge retrieval (RAG) and context-aware generation (CAG).",
            "You have been asked the following question:",
            f"\nQuestion: {query}\n",
            f"\nQuery Type: {context_info['query_type']}",
            "\nDomain Context:",
        ]
        
        # Add domain context
        for domain, count in context_info['domain_context']['primary_domains']:
            prompt_parts.append(f"- Primary domain: {domain} (mentioned in {count} articles)")
        
        # Add temporal context if available
        if context_info['temporal_context']['temporal_range']:
            temporal = context_info['temporal_context']['temporal_range']
            prompt_parts.append(f"\nTemporal Context: Research from {temporal['earliest']} to {temporal['latest']}")
        
        # Add concept information (RAG)
        prompt_parts.append("\nRelevant concepts and their relationships:")
        for concept in concepts:
            prompt_parts.append(f"- {concept.name} ({concept.category})")
        
        # Add concept relationships (CAG)
        for rel in context_info['concept_relationships']:
            prompt_parts.append(f"  * {rel['concept1']} and {rel['concept2']} are discussed together in {rel['shared_articles']} articles")
        
        # Add citation network information (RAG)
        if citation_context:
            prompt_parts.append("\nRelevant citation networks:")
            for network in citation_context:
                papers = [n for n in network["nodes"] if n.get("type") == "article"]
                prompt_parts.append(f"- Network with {len(papers)} papers")
                for paper in papers[:3]:
                    prompt_parts.append(f"  * {paper.get('title')} ({paper.get('year', 'N/A')})")
        
        prompt_parts.extend([
            "\nPlease provide a comprehensive answer that:",
            "1. Addresses the question directly using your GPT-4 capabilities",
            "2. Leverages both graph-based knowledge and contextual understanding",
            "3. Cites relevant papers using proper academic citation format",
            "4. Explains relationships between concepts when relevant",
            "5. Considers the temporal and domain context in your response",
            "6. Maintains academic writing standards",
            "\nAnswer:"
        ])
        
        return "\n".join(prompt_parts)
    
    async def _generate_response(self, prompt: str) -> str:
        """Generate a response using GPT-4."""
        try:
            response = self.client.chat.completions.create(
                model=self.deployment_name,  # Use configured deployment name
                messages=[
                    {"role": "system", "content": "You are a knowledgeable academic research assistant powered by GPT-4, enhanced with graph-based knowledge retrieval."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error generating response with GPT-4: {e}")
            # Log more details about the error
            logger.error(f"Deployment name: {self.deployment_name}")
            logger.error(f"Azure endpoint: {self.azure_endpoint}")
            raise
    
    def get_article_graph(self, article_id: str) -> Dict[str, Any]:
        """Get the complete graph visualization data for an article."""
        try:
            # Get article's citation network
            citation_network = self.article_store.get_citation_network(article_id)
            
            # Get concept graphs for all concepts in the article
            article = self.article_store.get_article(article_id)
            concept_graphs = []
            if article:
                for concept in article.concepts:
                    graph = self.article_store.get_concept_graph(concept.name)
                    if graph["nodes"]:
                        concept_graphs.append(graph)
            
            # Combine all graphs
            combined_nodes = {}
            combined_links = []
            
            # Add citation network
            for node in citation_network["nodes"]:
                node_id = str(node["id"])
                if node_id not in combined_nodes:
                    combined_nodes[node_id] = node
            
            for link in citation_network["links"]:
                combined_links.append(link)
            
            # Add concept graphs
            for graph in concept_graphs:
                for node in graph["nodes"]:
                    node_id = str(node["id"])
                    if node_id not in combined_nodes:
                        combined_nodes[node_id] = node
                
                for link in graph["links"]:
                    combined_links.append(link)
            
            return {
                "nodes": list(combined_nodes.values()),
                "links": combined_links
            }
        except Exception as e:
            logger.error(f"Error getting article graph: {e}")
            return {"nodes": [], "links": []} 
    
    async def debug_cag(self, query: str) -> Dict[str, Any]:
        """Debug endpoint to expose CAG analysis results."""
        try:
            concepts = self.article_processor._extract_concepts(query)
            relevant_articles = set()
            for concept in concepts:
                articles = self.article_store.search_by_concept(concept.name)
                relevant_articles.update(articles)
            
            context_info = self._build_context_info(query, list(relevant_articles), concepts)
            
            return {
                "query": query,
                "query_type": context_info["query_type"],
                "concepts": [{"name": c.name, "category": c.category} for c in concepts],
                "domain_context": context_info["domain_context"],
                "temporal_context": context_info["temporal_context"],
                "concept_relationships": context_info["concept_relationships"]
            }
        except Exception as e:
            logger.error(f"Error in CAG debug: {e}")
            raise 