@echo off
setlocal

set PORT=8080
set URL=http://localhost:%PORT%/?v=20260607-2
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
    start "YoyoClicker Server" /min py -3 -m http.server %PORT%
    goto open_browser
)

where python >nul 2>nul
if %errorlevel%==0 (
    start "YoyoClicker Server" /min python -m http.server %PORT%
    goto open_browser
)

where node >nul 2>nul
if %errorlevel%==0 (
    start "YoyoClicker Server" /min node server.js
    goto open_browser
)

echo Could not find Python or Node.js.
echo Please install Python 3, then run this file again:
echo https://www.python.org/downloads/
pause
exit /b 1

:open_browser
timeout /t 1 /nobreak >nul
start "" "%URL%"
exit /b 0
