from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from .models import Paper, Video, ChatMessage

class PaperRepository(ABC):
    @abstractmethod
    async def search(self, query: str, filters: Dict[str, Any], page: int, page_size: int) -> List[Paper]:
        pass
    
    @abstractmethod
    async def get_by_id(self, paper_id: str) -> Optional[Paper]:
        pass
    
    @abstractmethod
    async def save(self, paper: Paper) -> Paper:
        pass
    
    @abstractmethod
    async def update_citations(self, paper_id: str, citation_count: int) -> bool:
        pass

class VideoRepository(ABC):
    @abstractmethod
    async def search(self, query: str, category: str, max_results: int) -> List[Video]:
        pass
    
    @abstractmethod
    async def get_trending(self, category: str, max_results: int) -> List[Video]:
        pass
    
    @abstractmethod
    async def get_channel_videos(self, channel_id: str, max_results: int) -> List[Video]:
        pass

class ChatRepository(ABC):
    @abstractmethod
    async def save_message(self, message: ChatMessage) -> ChatMessage:
        pass
    
    @abstractmethod
    async def get_history(self, limit: int = 100) -> List[ChatMessage]:
        pass
    
    @abstractmethod
    async def clear_history(self) -> bool:
        pass
