from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class Paper(BaseModel):
    id: str = Field(..., description="Unique identifier")
    title: str
    authors: List[str]
    abstract: str
    url: Optional[str]
    pdf_url: Optional[str]
    published_date: datetime
    source: str
    citation_count: Optional[int] = 0
    vector_embedding: Optional[List[float]] = None

class Video(BaseModel):
    id: str = Field(..., description="YouTube video ID")
    title: str
    description: str
    channel_id: str
    channel_title: str
    published_at: datetime
    thumbnail_url: str
    category: str
    view_count: Optional[int]
    like_count: Optional[int]

class ChatMessage(BaseModel):
    id: str = Field(..., description="Message ID")
    content: str
    timestamp: datetime
    role: str = Field(..., description="user or assistant")
    context: Optional[dict] = None

class SearchResult(BaseModel):
    items: List[dict]
    total: int
    page: int
    total_pages: int
    query: str
    filters: Optional[dict]
