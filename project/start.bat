@echo off
echo Starting Project Bolt...

REM Start the backend server
start cmd /k "cd backend && conda activate project-bolt && python -m uvicorn app:app --reload --host 0.0.0.0 --port 8080"

REM Wait for backend to start
timeout /t 5

REM Start the frontend development server
start cmd /k "npm run dev"

echo Project Bolt is starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5174
