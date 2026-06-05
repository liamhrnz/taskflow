@echo off
REM Start JSON Server with proper Node.js PATH
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
json-server --watch db.json --port 3000
