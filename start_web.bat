@echo off
title CampusNav3D Web Server
cd /d "%~dp0web"
echo Starting CampusNav3D server on http://localhost:3000 ...
start http://localhost:3000
node server.js
pause
