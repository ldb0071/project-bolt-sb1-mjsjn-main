from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class MarkdownDocument(BaseModel):
    title: str
    content: str
    metadata: Dict = Field(default_factory=dict)
    sections: List[str] = Field(default_factory=list)
    source_path: str
    file_name: str

class DocumentChunk(BaseModel):
    content: str
    metadata: Dict
    embedding: Optional[List[float]] = None
    chunk_id: int
    total_chunks: int 