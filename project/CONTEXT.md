# Project Context Documentation

## Project Overview
This project is a PDF viewer and analysis application that combines advanced PDF viewing capabilities with AI-powered text analysis features. The application allows users to view PDFs, select text, and perform various AI-assisted operations on the selected text using Google's Gemini AI. Users can also engage in interactive chat conversations with the AI about the selected text and share images for visual context and analysis.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript
- **State Management**: Zustand for global state management
- **UI Components**: Custom components with Tailwind CSS
- **PDF Handling**: react-pdf for PDF rendering and interaction
- **Animations**: Framer Motion for smooth transitions and typewriter effects
- **API Client**: Axios for HTTP requests
- **Chat Interface**: Real-time interactive chat with AI, including image support
- **Image Processing**: Base64 encoding for image uploads
- **File Management**: Project-based file organization with thumbnail caching
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar

### Backend (FastAPI + Python)
- **Framework**: FastAPI
- **AI Integration**: Google's Gemini AI via google.generativeai
  * Text analysis with gemini-pro model
  * Image analysis with gemini-pro-vision model
- **Async Support**: asyncio for handling concurrent operations
- **Rate Limiting**: Custom implementation for API request management
- **Error Handling**: Comprehensive error handling and logging
- **Chat Management**: Stateful chat history and context management
- **Image Processing**: Support for image analysis and multimodal conversations
- **File Storage**: Local file system storage with path management

## Core Features

### PDF Viewer
- Full-screen mode support with persistent content
- Text selection capabilities
- Zoom controls
- Page navigation
- Search functionality with highlighting
- Thumbnail generation and caching
- Grid and list view options
- File organization by projects

### Project Management
- Create and manage multiple projects
- Move/copy files between projects
- Project-based file organization
- File thumbnails with caching
- Search within projects
- Grid and list view options

### Chat Interface
- Typewriter animation for responses
- Context-aware conversations
- Multiple chat sessions
- Chat history persistence
- Real-time message streaming
- Mobile-responsive design
- Collapsible chat window

### Text Analysis (Gemini AI Integration)
- Text selection popup with three main actions:
  * Explain: Detailed explanation of selected text
  * Summarize: Concise summary of selected text
  * Rewrite: Alternative expression of the selected text
- Interactive chat interface:
  * Real-time message exchange with AI
  * Support for follow-up questions
  * Context-aware responses
  * Message history tracking
  * Image upload and analysis
  * Multimodal conversations combining text and images
- Error handling and rate limiting
- Visual feedback for processing states

## Components

### Layout
- Responsive sidebar with collapsible navigation
- Dark/light mode toggle
- Project navigation
- Settings access
- Mobile-friendly design

### PDFViewerPage
- Grid/list view toggle
- Thumbnail generation and caching
- File management controls
- Search functionality
- Drag and drop file upload
- File preview modal
- Move/copy file controls

### TextSelectionPopup
- Triggered on text selection
- Provides action buttons (Explain, Summarize, Rewrite)
- Interactive chat interface:
  * Message input field
  * Image upload button
  * Send button with loading state
  * Enter key support for sending messages
  * Auto-scroll to latest messages
  * Visual distinction between user and AI messages
  * Image preview with delete option
  * Support for multimodal conversations
- Error display and loading states
- Responsive design with smooth animations

### ChatService
- Handles communication with Gemini AI
- Manages chat history with timestamps
- Implements rate limiting
- Formats responses
- Maintains conversation context
- Supports both text and image processing
- Error handling and recovery
- Message streaming support
- Typewriter animation effects

## State Management
- Zustand store for global state
- Project state management
- File organization
- Chat session management
- Theme preferences
- UI state persistence
- Thumbnail caching
- Search state

## User Interface Features
- Real-time message input and response
- Visual feedback for processing states
- Distinct styling for user and AI messages
- Support for multi-line input
- Image upload and preview
- Enter key shortcut for sending messages
- Automatic scrolling to latest messages
- Loading indicators and error displays
- Typewriter animation for responses
- Grid/list view toggle
- Collapsible sidebar
- Dark/light mode toggle

## API Endpoints

### POST Endpoints

1. `/api/analyze`
   - Description: Analyze text and handle chat interactions using Gemini AI
   - Request Body:
     ```json
     {
       "text": "string",
       "action": "explain" | "summarize" | "rewrite",
       "image": "string | null"  // Base64 encoded image data
     }
     ```
   - Response:
     ```json
     {
       "response": "string",
       "error": "string | null"
     }
     ```

## Development Setup

1. Backend Setup:
   ```bash
   cd project/backend
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8080
   ```

2. Frontend Setup:
   ```bash
   cd project
   npm install
   npm start
   ```

## Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-pdf": "^7.x",
    "framer-motion": "^10.x",
    "axios": "^1.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.x",
    "typescript": "^5.x"
  }
}
```

### Backend Dependencies
```python
requirements = [
    "fastapi==0.104.1",
    "uvicorn==0.24.0",
    "google-generativeai==0.3.0",
    "python-multipart==0.0.6",
    "pydantic==2.5.2",
    "Pillow==10.0.0"  # For image processing
]
```

## Security Features
- CORS configuration for API access control
- Rate limiting to prevent abuse
- Input validation using Pydantic models
- Error handling for sensitive information
- Message sanitization
- Secure image handling and validation

## Future Enhancements
1. Authentication system
2. PDF annotation support
3. Collaborative features
4. Enhanced AI model selection
5. Export functionality for analyzed text
6. Customizable rate limiting
7. Response caching
8. Batch text analysis
9. Message threading support
10. Rich text formatting in chat
11. Message search functionality
12. Chat session persistence
13. Advanced image analysis features
14. Image annotation tools
15. OCR integration for images 