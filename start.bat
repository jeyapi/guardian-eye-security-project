@echo off
echo ========================================
echo   GuardianEye - Starting Services
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server...
start "GuardianEye Backend" cmd /k "cd backend && npm install && node server.js"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend...
start "GuardianEye Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:8080
echo.
echo Press any key to exit this window...
pause >nul
