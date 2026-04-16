@echo off
echo Starting SRI MURUGAN TEX Servers...
echo.

:: Start Backend Server
echo Starting Backend Server (Port 3001)...
start "Backend Server" cmd /c "cd /d %~dp0backend && node server.js"

:: Start Avatar.ai Server
echo Starting Avatar.ai Server (Port 5001)...
start "Avatar AI" cmd /c "cd /d %~dp0Avatar.ai && python app.py"

:: Start Frontend
echo Starting Frontend (Port 3000)...
timeout /t 3 >nul
start "Frontend" cmd /c "cd /d %~dp0 && npm start"

echo.
echo All servers starting...
echo Backend: http://localhost:3001
echo Avatar AI: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
pause
