@echo off
echo ==============================================
echo   Starting Auction Bazaar (Local Deployment)
echo ==============================================

echo.
echo [1/2] Starting Spring Boot Backend (Port 8080)...
cd /d "c:\Online_Auction_Platform\Auction"
start "Auction Backend" cmd /c "./mvnw spring-boot:run"

echo.
echo [2/2] Starting React Frontend (Port 3001)...
cd /d "c:\Online_Auction_Platform\Auction-Frontend-main\my-app"
set PORT=3001
start "Auction Frontend" cmd /c "npm start"

echo.
echo ==============================================
echo   Deployment Successful!
echo   - Backend is booting up in a new window.
echo   - Frontend is booting up in a new window.
echo   
echo   The app will automatically open in your browser
echo   at http://localhost:3001 in a few seconds...
echo ==============================================
pause
