@echo off
cd backend
start cmd /k "node server.mjs"
cd ..\frontend
start cmd /k "npm start"
timeout /t 5 /nobreak > nul
start "" "http://localhost:3000/"