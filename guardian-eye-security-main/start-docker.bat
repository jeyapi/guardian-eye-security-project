@echo off
echo ========================================
echo   GuardianEye - Docker Startup
echo ========================================
echo.
echo Starting GuardianEye with Docker...
echo This will download and configure everything automatically.
echo.

docker-compose up --build -d

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Open your browser at: http://localhost:8080
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
pause
