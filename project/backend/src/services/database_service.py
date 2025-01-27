from typing import List, Optional, Dict
import networkx as nx
from datetime import datetime
from ..models.article import ScientificArticle, Author, Citation, Concept

class ArticleDatabase:
    """Service for managing scientific articles and their relationships."""
    
    def __init__(self):
        self.articles: Dict[str, ScientificArticle] = {}
        self.citation_graph = nx.DiGraph()
        self.concept_graph = nx.Graph()
        self.author_graph = nx.Graph()
        
    def add_article(self, article: ScientificArticle) -> None:
        """Add a new article to the database and update all graphs."""
        self.articles[article.id] = article
        self._update_citation_graph(article)
        self._update_concept_graph(article)
        self._update_author_graph(article)
        
    def get_article(self, article_id: str) -> Optional[ScientificArticle]:
        """Retrieve an article by its ID."""
        return self.articles.get(article_id)
    
    def get_articles_by_author(self, author_name: str) -> List[ScientificArticle]:
        """Get all articles by a specific author."""
        return [
            article for article in self.articles.values()
            if any(author.name == author_name for author in article.authors)
        ]
    
    def get_articles_by_concept(self, concept_name: str) -> List[ScientificArticle]:
        """Get all articles discussing a specific concept."""
        return [
            article for article in self.articles.values()
            if any(concept.name == concept_name for concept in article.concepts)
        ]
    
    def get_citing_articles(self, article_id: str) -> List[ScientificArticle]:
        """Get all articles that cite the given article."""
        if article_id not in self.citation_graph:
            return []
        citing_ids = [n for n in self.citation_graph.predecessors(article_id)]
        return [self.articles[aid] for aid in citing_ids if aid in self.articles]
    
    def get_cited_articles(self, article_id: str) -> List[ScientificArticle]:
        """Get all articles cited by the given article."""
        if article_id not in self.citation_graph:
            return []
        cited_ids = [n for n in self.citation_graph.successors(article_id)]
        return [self.articles[aid] for aid in cited_ids if aid in self.articles]
    
    def get_related_concepts(self, concept_name: str) -> List[str]:
        """Get concepts related to the given concept."""
        if concept_name not in self.concept_graph:
            return []
        return [n for n in self.concept_graph.neighbors(concept_name)]
    
    def get_collaborators(self, author_name: str) -> List[str]:
        """Get all authors who have collaborated with the given author."""
        if author_name not in self.author_graph:
            return []
        return [n for n in self.author_graph.neighbors(author_name)]
    
    def get_citation_subgraph(self, article_id: str, depth: int = 1) -> nx.DiGraph:
        """Get the citation network around an article up to a certain depth."""
        if article_id not in self.citation_graph:
            return nx.DiGraph()
        
        nodes = {article_id}
        for _ in range(depth):
            new_nodes = set()
            for node in nodes:
                new_nodes.update(self.citation_graph.predecessors(node))
                new_nodes.update(self.citation_graph.successors(node))
            nodes.update(new_nodes)
        
        return self.citation_graph.subgraph(nodes)
    
    def get_concept_subgraph(self, concept_name: str, depth: int = 1) -> nx.Graph:
        """Get the concept network around a concept up to a certain depth."""
        if concept_name not in self.concept_graph:
            return nx.Graph()
        
        nodes = {concept_name}
        for _ in range(depth):
            new_nodes = set()
            for node in nodes:
                new_nodes.update(self.concept_graph.neighbors(node))
            nodes.update(new_nodes)
        
        return self.concept_graph.subgraph(nodes)
    
    def _update_citation_graph(self, article: ScientificArticle) -> None:
        """Update the citation graph with a new article."""
        self.citation_graph.add_node(article.id)
        for citation in article.citations:
            if citation.doi:  # Use DOI as a unique identifier
                self.citation_graph.add_edge(article.id, citation.doi)
    
    def _update_concept_graph(self, article: ScientificArticle) -> None:
        """Update the concept graph with a new article."""
        for concept in article.concepts:
            self.concept_graph.add_node(concept.name)
            # Connect related concepts
            for related in concept.related_terms:
                self.concept_graph.add_edge(concept.name, related)
    
    def _update_author_graph(self, article: ScientificArticle) -> None:
        """Update the author collaboration graph with a new article."""
        authors = [author.name for author in article.authors]
        for i, author1 in enumerate(authors):
            self.author_graph.add_node(author1)
            # Connect co-authors
            for author2 in authors[i+1:]:
                self.author_graph.add_edge(author1, author2) 