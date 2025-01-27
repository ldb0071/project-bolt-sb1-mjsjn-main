from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Author(BaseModel):
    """Represents an author of a scientific article."""
    name: str
    affiliation: Optional[str] = None
    email: Optional[str] = None
    orcid: Optional[str] = None

class Citation(BaseModel):
    """Represents a citation in a scientific article."""
    authors: List[str]
    title: str
    venue: Optional[str] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    citation_count: Optional[int] = 0

class Concept(BaseModel):
    """Represents an academic concept discussed in the article."""
    name: str
    category: Optional[str] = None
    definition: Optional[str] = None
    related_terms: List[str] = Field(default_factory=list)

class Section(BaseModel):
    """Represents a section of the scientific article."""
    title: str
    content: str
    level: int = 1  # Section level (1 for main sections, 2 for subsections, etc.)
    concepts: List[Concept] = Field(default_factory=list)
    citations: List[Citation] = Field(default_factory=list)

class ScientificArticle(BaseModel):
    """Main model for scientific articles."""
    id: str
    title: str
    authors: List[Author]
    abstract: str
    keywords: List[str] = Field(default_factory=list)
    sections: List[Section] = Field(default_factory=list)
    citations: List[Citation] = Field(default_factory=list)
    concepts: List[Concept] = Field(default_factory=list)
    
    # Publication metadata
    venue: Optional[str] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    
    # File paths
    pdf_path: Optional[str] = None
    markdown_path: Optional[str] = None
    
    # Processing metadata
    processed_date: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict)

    class Config:
        arbitrary_types_allowed = True 