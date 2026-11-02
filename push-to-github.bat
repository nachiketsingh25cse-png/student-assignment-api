@echo off
title Push Student Assignment API to GitHub
echo ========================================================
echo   Auto-Push Student Assignment API to GitHub
echo ========================================================
echo.
set /p GHUSER="Enter your GitHub username: "
echo.
echo Linking repository to: https://github.com/%GHUSER%/student-assignment-api.git
git remote remove origin 2>nul
git remote add origin https://github.com/%GHUSER%/student-assignment-api.git
git branch -M main
echo.
echo Pushing to GitHub (a sign-in window will pop up if not logged in)...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo SUCCESS! Pushed to GitHub.
    echo Your Assignment Submission URL is:
    echo https://github.com/%GHUSER%/student-assignment-api
    echo ========================================================
) else (
    echo --------------------------------------------------------
    echo If the push failed:
    echo 1. Make sure you went to https://github.com/new and created
    echo    a repository named: student-assignment-api
    echo 2. Make sure it is set to Public
    echo --------------------------------------------------------
)
pause
