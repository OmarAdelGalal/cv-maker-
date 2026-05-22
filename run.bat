@echo off
setlocal
set "NODE_PATH=%~dp0.node\node-v20.11.1-win-x64"
if not exist "%NODE_PATH%\node.exe" (
    echo Local Node.js environment not found. Please wait until the background setup completes.
    pause
    exit /b 1
)
set "PATH=%NODE_PATH%;%PATH%"
echo Starting Next.js Dev Server...
if not exist "%~dp0node_modules" (
    echo Installing dependencies...
    call npm install
)
call npm run dev
endlocal
