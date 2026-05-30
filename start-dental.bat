@echo off
title LocalOps - DentalClinic Launcher
color 0A
cls

echo ============================================================
echo   LocalOps - DentalClinic System Launcher
echo   %date% %time%
echo ============================================================
echo.

:: === KILL OLD PROCESSES ===
echo [1/3] Don dep process cu...
taskkill /F /IM DentalClinicSystem.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":7136 " 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5144 " 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " 2^>nul') do taskkill /F /PID %%a >nul 2>&1
echo     Done.

:: === START BACKEND ===
echo.
echo [2/3] Khoi dong Backend (.NET 8)...
start "DentalClinic - Backend" cmd /k "cd /d "%~dp0DentalClinicSystem" && echo Backend dang khoi dong... && dotnet run --launch-profile https"
timeout /t 10 /nobreak >nul
echo     Backend da duoc khoi dong tai https://localhost:7136

:: === START FRONTEND ===
echo.
echo [3/3] Khoi dong Frontend (React + Vite)...
start "DentalClinic - Frontend" cmd /k "cd /d "%~dp0dental-frontend" && echo Frontend dang khoi dong... && npm run dev"
timeout /t 8 /nobreak >nul
echo     Frontend da duoc khoi dong tai http://localhost:5173

:: === DONE ===
echo.
echo ============================================================
echo   HE THONG DA DUOC DUNG THANH CONG!
echo.
echo   Database : localhost \ DentalClinicDB
echo   Backend  : https://localhost:7136/swagger
echo   Frontend : http://localhost:5173
echo.
echo   Click vao link Frontend de bat dau!
echo ============================================================
echo.

:: Open browser
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173"

pause
