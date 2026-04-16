@echo off
echo ==========================================
echo   Avatar.ai Server Launcher
echo ==========================================
echo.
echo Starting Avatar.ai Server...
echo This may take a few seconds to load the AI model
echo.
cd /d "%~dp0Avatar.ai"
python app.py
echo.
echo Server stopped. Press any key to exit.
pause
