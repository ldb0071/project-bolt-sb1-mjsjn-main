import re
import spacy
from typing import List, Tuple, Dict
from datetime import datetime
import uuid
from ..models.article import ScientificArticle, Author, Citation, Concept, Section

class ArticleProcessor:
    """Service for processing scientific articles and extracting structured information."""
    
    def __init__(self):
        """Initialize the article processor with required NLP models."""
        # Load scientific NLP model
        self.nlp = spacy.load("en_core_sci_md")
        
        # Regular expressions for extracting information
        self.citation_pattern = re.compile(r'\[([\d,\s]+)\]')
        self.section_pattern = re.compile(r'^#+\s+(.+)$', re.MULTILINE)
        
    async def process_markdown(self, content: str, metadata: Dict = None) -> ScientificArticle:
        """Process a markdown document and extract structured information."""
        if metadata is None:
            metadata = {}
            
        # Generate unique ID for the article
        article_id = str(uuid.uuid4())
        
        # Extract basic metadata
        title = self._extract_title(content)
        authors = self._extract_authors(content)
        abstract = self._extract_abstract(content)
        
        # Process sections
        sections = self._process_sections(content)
        
        # Extract citations
        citations = self._extract_citations(content)
        
        # Extract concepts
        concepts = self._extract_concepts(content)
        
        # Create article object
        article = ScientificArticle(
            id=article_id,
            title=title,
            authors=authors,
            abstract=abstract,
            sections=sections,
            citations=citations,
            concepts=concepts,
            processed_date=datetime.utcnow(),
            metadata=metadata
        )
        
        return article
    
    def _extract_title(self, content: str) -> str:
        """Extract the title from the markdown content."""
        lines = content.split('\n')
        for line in lines:
            if line.strip().startswith('# '):
                return line.strip('# ').strip()
        return "Untitled"
    
    def _extract_authors(self, content: str) -> List[Author]:
        """Extract author information from the markdown content."""
        authors = []
        lines = content.split('\n')
        author_section = False
        
        for line in lines:
            if line.strip().lower().startswith('## author'):
                author_section = True
                continue
            elif author_section and line.strip().startswith('##'):
                break
            elif author_section and line.strip():
                # Parse author information
                parts = line.strip().split(',')
                name = parts[0].strip()
                affiliation = parts[1].strip() if len(parts) > 1 else None
                email = parts[2].strip() if len(parts) > 2 else None
                
                authors.append(Author(
                    name=name,
                    affiliation=affiliation,
                    email=email
                ))
                
        return authors
    
    def _extract_abstract(self, content: str) -> str:
        """Extract the abstract from the markdown content."""
        lines = content.split('\n')
        abstract = []
        in_abstract = False
        
        for line in lines:
            if line.strip().lower().startswith('## abstract'):
                in_abstract = True
                continue
            elif in_abstract and line.strip().startswith('##'):
                break
            elif in_abstract and line.strip():
                abstract.append(line.strip())
                
        return ' '.join(abstract) if abstract else ""
    
    def _process_sections(self, content: str) -> List[Section]:
        """Process the content into structured sections."""
        sections = []
        current_section = None
        current_content = []
        level = 1
        
        for line in content.split('\n'):
            if line.strip().startswith('#'):
                # Save previous section if it exists
                if current_section:
                    sections.append(Section(
                        title=current_section,
                        content='\n'.join(current_content),
                        level=level
                    ))
                    
                # Start new section
                level = len(re.match(r'^#+', line).group())
                current_section = line.strip('#').strip()
                current_content = []
            elif current_section:
                current_content.append(line)
                
        # Add the last section
        if current_section:
            sections.append(Section(
                title=current_section,
                content='\n'.join(current_content),
                level=level
            ))
            
        return sections
    
    def _extract_citations(self, content: str) -> List[Citation]:
        """Extract citations from the content."""
        citations = []
        citation_matches = self.citation_pattern.finditer(content)
        
        for match in citation_matches:
            # Parse citation text
            cite_numbers = [int(n.strip()) for n in match.group(1).split(',')]
            
            # For each citation number, create a Citation object
            # In a real implementation, you would look up the actual citation details
            for num in cite_numbers:
                citations.append(Citation(
                    authors=["Author"],  # Placeholder
                    title=f"Citation {num}",  # Placeholder
                    year=2024  # Placeholder
                ))
                
        return citations
    
    def _extract_concepts(self, content: str) -> List[Concept]:
        """Extract key concepts from the content using NLP."""
        concepts = set()
        doc = self.nlp(content)
        
        # Extract entities recognized by the scientific model
        for ent in doc.ents:
            if ent.label_ in {'METHOD', 'TASK', 'METRIC', 'MATERIAL'}:
                concepts.add((ent.text, ent.label_))
                
        # Convert to Concept objects
        return [
            Concept(
                name=concept[0],
                category=concept[1],
                related_terms=[]  # Could be populated using word embeddings
            )
            for concept in concepts
        ] 