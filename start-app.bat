@echo off
cd backend
start cmd /k "node server.mjs"
cd ..\frontend
start cmd /k "npm start"

echo Waiting for backend to start...

:waitloop
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'https://localhost:3001/' -UseBasicParsing -TimeoutSec 1 -SkipCertificateCheck | Out-Null; exit 0 } catch { exit 1 }"
IF %ERRORLEVEL% NEQ 0 (
    timeout /t 1 >nul
    goto waitloop
)

echo Backend is ready!
start "" "http://localhost:3000/"