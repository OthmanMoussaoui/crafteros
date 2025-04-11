@echo off
echo Starting MatchVisor application...
echo.

rem Start the Flask backend server
echo Starting Flask backend...
start cmd /k "cd backend && python app_with_assets.py"

rem Wait for backend to start
timeout /t 5 /nobreak

rem Start the Next.js frontend
echo Starting Next.js frontend...
start cmd /k "npm run dev"

echo.
echo MatchVisor is running!
echo Flask backend: http://localhost:5000
echo Next.js frontend: http://localhost:3000
echo.
echo Press any key to close all servers...
pause

rem Kill the processes
taskkill /f /im cmd.exe 