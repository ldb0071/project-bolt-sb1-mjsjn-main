# PDF Management System

## Overview
A comprehensive PDF management web application with local file storage, built using React, TypeScript, FastAPI, and Zustand.

## Features
- Create and manage multiple projects
- Upload PDFs to specific projects
- Preview PDFs within the application
- Local file storage
- Responsive and modern UI

## Tech Stack
### Frontend
- React 18
- TypeScript
- Vite
- Zustand (State Management)
- Tailwind CSS
- Framer Motion
- react-pdf

### Backend
- FastAPI
- Python 3.9+
- Uvicorn

## Prerequisites
- Node.js 16+
- Python 3.9+
- npm or yarn

## Setup and Installation

### Frontend Setup
1. Navigate to the project directory
```bash
cd project
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

### Backend Setup
1. Navigate to the backend directory
```bash
cd backend
```

2. Create a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the backend server
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8080
```

## Development Servers
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Project Structure
```
project/
├── backend/
│   ├── app.py          # FastAPI backend
│   ├── uploads/        # Local PDF storage
│   └── requirements.txt
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── store/          # State management
└── README.md
```

## Key Features
- Multi-project PDF management
- Local file storage
- PDF preview and navigation
- Responsive design
- State persistence

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
[Specify your license here]

## Contact
[Your contact information]
