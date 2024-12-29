# PDF Management Backend

## Overview
A FastAPI-based backend service for PDF management, providing file upload, deletion, and static file serving.

## Features
- PDF file upload
- PDF file deletion
- Static file serving for uploaded PDFs
- CORS support for frontend integration

## Prerequisites
- Python 3.9+
- pip

## Setup and Installation

1. Create a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8080
```

### Production Mode
```bash
uvicorn app:app --host 0.0.0.0 --port 8080
```

## Endpoints

### Upload PDF
- **URL**: `/upload`
- **Method**: `POST`
- **Accepts**: Multipart form-data with PDF file
- **Returns**: 
  ```json
  {
    "filename": "unique_filename.pdf",
    "path": "/uploads/unique_filename.pdf"
  }
  ```

### Delete PDF
- **URL**: `/delete/{filename}`
- **Method**: `DELETE`
- **Returns**: Success message

## Troubleshooting
- Ensure the server is running on `http://localhost:8080`
- Check that you have the correct Python version
- Verify all dependencies are installed
- Make sure the `uploads/` directory exists and is writable

## Configuration
- CORS is configured to allow all origins (development mode)
- Uploads are stored in the `uploads/` directory
- Unique filenames are generated using UUID

## Security Considerations
- Only PDF files are allowed
- Unique filename generation prevents file overwriting
- Basic error handling for file operations

## License
[Specify your license here]
