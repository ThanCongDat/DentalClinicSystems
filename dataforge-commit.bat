@echo off
chcp 65001 >nul
title DataForge - Git Commit

echo ============================================================
echo   DataForge - Hoan tat phan commit vao Git
echo   Ngay: 30/05/2026 - 08:00 AM
echo ============================================================
echo.

cd /d "%~dp0DentalClinicSystem"

REM Xoa lock file neu con ton tai tu session truoc
if exist ".git\index.lock" (
    echo [1/3] Xoa index.lock cu...
    del /f /q ".git\index.lock"
) else (
    echo [1/3] Khong co index.lock - OK
)

REM Stage tat ca thay doi
echo [2/3] Git add ...
git add .
if %errorlevel% neq 0 (
    echo [LOI] git add that bai!
    pause
    exit /b 1
)

REM Commit
echo [3/3] Git commit...
git commit -m "Auto-Data [DataForge]: Bom them du lieu mau vao local database DentalClincDB - 30/05/2026"
if %errorlevel% neq 0 (
    echo [LOI] git commit that bai - co the khong co thay doi moi.
) else (
    echo.
    echo [OK] Commit thanh cong!
    git log --oneline -3
)

echo.
echo DataForge hoan tat - nhan phim bat ky de dong.
pause
