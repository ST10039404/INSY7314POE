@echo off
cd frontend
npm run build
cd ..

cd backend
start cmd /k "npm run start"
cd ..

echo Waiting for backend to start, then opening production frontend

:waitloop
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'https://localhost:3001/' -UseBasicParsing -TimeoutSec 1 -SkipCertificateCheck | Out-Null; exit 0 } catch { exit 1 }"
IF %ERRORLEVEL% NEQ 0 (
    timeout /t 1 >nul
    goto waitloop
)

echo Backend is ready!
start "" "https://localhost:3001/"
