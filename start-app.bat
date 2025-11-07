@echo off
cd backend
start cmd /k "node server.mjs"
cd ..\frontend
start cmd /k "npm start"