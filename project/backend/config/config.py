import os

# Base directory for project files
BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
PROJECTS_DIR = os.path.abspath(os.path.join(BASE_DIR, 'projects'))
THUMBNAILS_DIR = os.path.abspath(os.path.join(BASE_DIR, 'thumbnails'))
PDF_STORAGE_DIR = os.path.abspath(os.path.join(BASE_DIR, 'pdf_storage'))
VIDEO_STORAGE_DIR = os.path.abspath(os.path.join(BASE_DIR, 'video_storage'))

# API Keys
YOUTUBE_API_KEY = 'AIzaSyAGkuC9cB1QcXOmbUuSdbUwlPcCEmOcj_0'
GEMINI_API_KEY = 'AIzaSyBp0lmfw0QSHWrAwZVXGtmCxf2fhHzEHck'

# Upload settings
MAX_UPLOAD_SIZE = 100 * 1024 * 1024  # 100MB in bytes

# Cache settings
CACHE_EXPIRY = 3600  # 1 hour cache expiry

# CORS settings
ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:5186"]

# YouTube categories
YOUTUBE_CATEGORIES = {
    "AI": ["artificial intelligence", "machine learning", "deep learning"],
    "Computer Vision": ["computer vision", "image processing", "object detection"],
    "LLM": ["large language models", "nlp", "natural language processing"]
}

# Create necessary directories
for directory in [PROJECTS_DIR, THUMBNAILS_DIR, PDF_STORAGE_DIR, VIDEO_STORAGE_DIR]:
    os.makedirs(directory, exist_ok=True) 