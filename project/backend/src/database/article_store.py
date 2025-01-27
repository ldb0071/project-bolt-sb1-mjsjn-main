import os
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
import networkx as nx
from ..models.article import ScientificArticle, Author, Citation, Concept, Section

class ArticleStore:
    """Service for managing scientific articles with graph-based relationships."""
    
    def __init__(self, storage_dir: str):
        """Initialize the article store with storage directory."""
        self.storage_dir = storage_dir
        self.articles_dir = os.path.join(storage_dir, "articles")
        self.graph_path = os.path.join(storage_dir, "knowledge_graph.gpickle")
        
        # Create directories if they don't exist
        os.makedirs(self.articles_dir, exist_ok=True)
        
        # Initialize knowledge graph
        self.graph = self._load_graph() if os.path.exists(self.graph_path) else nx.DiGraph()
    
    def _load_graph(self) -> nx.DiGraph:
        """Load the knowledge graph from disk."""
        try:
            return nx.read_gpickle(self.graph_path)
        except Exception as e:
            print(f"Error loading graph: {e}")
            return nx.DiGraph()
    
    def _save_graph(self):
        """Save the knowledge graph to disk."""
        try:
            nx.write_gpickle(self.graph, self.graph_path)
        except Exception as e:
            print(f"Error saving graph: {e}")
    
    def add_article(self, article: ScientificArticle):
        """Add or update an article and update the knowledge graph."""
        # Save article to JSON file
        article_path = os.path.join(self.articles_dir, f"{article.id}.json")
        with open(article_path, 'w', encoding='utf-8') as f:
            json.dump(article.dict(), f, indent=2, default=str)
        
        # Update knowledge graph
        self._update_graph_with_article(article)
        self._save_graph()
    
    def _update_graph_with_article(self, article: ScientificArticle):
        """Update the knowledge graph with article information."""
        # Add article node
        self.graph.add_node(article.id, 
                           type="article",
                           title=article.title,
                           year=article.year,
                           venue=article.venue)
        
        # Add and link authors
        for author in article.authors:
            author_id = f"author_{author.name}"
            self.graph.add_node(author_id, 
                              type="author",
                              name=author.name,
                              affiliation=author.affiliation)
            self.graph.add_edge(article.id, author_id, type="authored_by")
        
        # Add and link citations
        for citation in article.citations:
            citation_id = f"citation_{citation.title}"
            self.graph.add_node(citation_id,
                              type="citation",
                              title=citation.title,
                              authors=citation.authors,
                              year=citation.year,
                              venue=citation.venue)
            self.graph.add_edge(article.id, citation_id, type="cites")
        
        # Add and link concepts
        for concept in article.concepts:
            concept_id = f"concept_{concept.name}"
            self.graph.add_node(concept_id,
                              type="concept",
                              name=concept.name,
                              category=concept.category)
            self.graph.add_edge(article.id, concept_id, type="contains")
            
            # Link related concepts
            for related in concept.related_terms:
                related_id = f"concept_{related}"
                if related_id in self.graph:
                    self.graph.add_edge(concept_id, related_id, type="related_to")
    
    def get_article(self, article_id: str) -> Optional[ScientificArticle]:
        """Retrieve an article by ID."""
        article_path = os.path.join(self.articles_dir, f"{article_id}.json")
        if not os.path.exists(article_path):
            return None
            
        with open(article_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return ScientificArticle(**data)
    
    def get_related_articles(self, article_id: str, max_depth: int = 2) -> List[Dict[str, Any]]:
        """Get related articles through graph traversal."""
        if article_id not in self.graph:
            return []
            
        related = []
        for node in nx.single_source_shortest_path_length(self.graph, article_id, cutoff=max_depth):
            if node != article_id and self.graph.nodes[node].get('type') == 'article':
                path = nx.shortest_path(self.graph, article_id, node)
                edges = list(zip(path[:-1], path[1:]))
                relationships = [self.graph[u][v]['type'] for u, v in edges]
                
                related.append({
                    'article_id': node,
                    'title': self.graph.nodes[node].get('title'),
                    'path': path,
                    'relationships': relationships,
                    'distance': len(path) - 1
                })
        
        return related
    
    def search_by_concept(self, concept_name: str) -> List[str]:
        """Find articles related to a specific concept."""
        concept_id = f"concept_{concept_name}"
        if concept_id not in self.graph:
            return []
            
        articles = []
        for node in self.graph.predecessors(concept_id):
            if self.graph.nodes[node].get('type') == 'article':
                articles.append(node)
        
        return articles
    
    def get_citation_network(self, article_id: str, depth: int = 2) -> Dict[str, Any]:
        """Get the citation network around an article."""
        if article_id not in self.graph:
            return {'nodes': [], 'links': []}
            
        # Get subgraph of citations
        nodes = set([article_id])
        for d in range(depth):
            new_nodes = set()
            for node in nodes:
                # Add cited papers
                new_nodes.update([n for n in self.graph.successors(node)
                                if self.graph.nodes[n].get('type') == 'citation'])
                # Add citing papers
                new_nodes.update([n for n in self.graph.predecessors(node)
                                if self.graph.nodes[n].get('type') == 'article'])
            nodes.update(new_nodes)
        
        subgraph = self.graph.subgraph(nodes)
        
        return {
            'nodes': [{'id': n, **subgraph.nodes[n]} for n in subgraph.nodes()],
            'links': [{'source': u, 'target': v, **subgraph.edges[u, v]}
                     for u, v in subgraph.edges()]
        }
    
    def get_concept_graph(self, concept_name: str) -> Dict[str, Any]:
        """Get the concept graph around a specific concept."""
        concept_id = f"concept_{concept_name}"
        if concept_id not in self.graph:
            return {'nodes': [], 'links': []}
            
        # Get nodes within 2 steps of the concept
        nodes = set([concept_id])
        for _ in range(2):
            new_nodes = set()
            for node in nodes:
                new_nodes.update(self.graph.successors(node))
                new_nodes.update(self.graph.predecessors(node))
            nodes.update(new_nodes)
        
        subgraph = self.graph.subgraph(nodes)
        
        return {
            'nodes': [{'id': n, **subgraph.nodes[n]} for n in subgraph.nodes()],
            'links': [{'source': u, 'target': v, **subgraph.edges[u, v]}
                     for u, v in subgraph.edges()]
        } 