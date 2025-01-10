from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field

class MarkdownDocument(BaseModel):
    """Represents a processed markdown document."""
    content: str
    source: str
    metadata: Dict[str, str] = Field(default_factory=dict)

class DocumentChunk(BaseModel):
    """Represents a chunk of text from a document."""
    content: str
    chunk_id: int
    metadata: Dict[str, str] = Field(default_factory=dict)

class SearchResult(BaseModel):
    """Represents a search result from the vector store."""
    content: str
    source: str
    chunk_id: int
    score: float
    metadata: Dict[str, str] = Field(default_factory=dict)

class ChatMessage(BaseModel):
    """Represents a chat message."""
    role: str
    content: str
    metadata: Optional[Dict[str, str]] = Field(default_factory=dict)

class ProcessingResult(BaseModel):
    """Represents the result of processing markdown files."""
    message: str
    files_processed: int
    chunks_created: int

class ChatResponse(BaseModel):
    """Represents a response from the chat system."""
    answer: str
    sources: List[Dict[str, str]] = Field(default_factory=list)

class CollectionStats(BaseModel):
    """Represents statistics about a document collection."""
    total_documents: int = 0
    sources: List[str] = Field(default_factory=list)
    chunks_per_source: Dict[str, int] = Field(default_factory=dict) 