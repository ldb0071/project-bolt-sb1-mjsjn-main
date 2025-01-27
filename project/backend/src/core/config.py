import os
from typing import Optional
from functools import lru_cache
from pydantic_settings import BaseSettings
from openai import AsyncAzureOpenAI

class Settings(BaseSettings):
    """Application settings."""
    
    # Azure OpenAI settings
    AZURE_OPENAI_API_KEY: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_API_VERSION: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
    
    # Model deployment names
    AZURE_GPT4_DEPLOYMENT: str = os.getenv("AZURE_GPT4_DEPLOYMENT", "gpt-4")  # Your actual GPT-4 deployment name
    AZURE_EMBEDDINGS_DEPLOYMENT: str = os.getenv("AZURE_EMBEDDINGS_DEPLOYMENT", "text-embedding-3-small")
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./articles.db")
    
    # File storage settings
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    
    # API settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Scientific Article GraphRAG"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

async def get_openai_client() -> AsyncAzureOpenAI:
    """Get Azure OpenAI client instance."""
    settings = get_settings()
    
    if not settings.AZURE_OPENAI_API_KEY or not settings.AZURE_OPENAI_ENDPOINT:
        raise ValueError("Azure OpenAI API key and endpoint must be set")
    
    client = AsyncAzureOpenAI(
        api_key=settings.AZURE_OPENAI_API_KEY,
        api_version=settings.AZURE_OPENAI_API_VERSION,
        azure_endpoint=settings.AZURE_OPENAI_ENDPOINT
    )
    
    return client

# Ensure upload directory exists
os.makedirs(get_settings().UPLOAD_DIR, exist_ok=True)
