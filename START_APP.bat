@echo off
title Personal Mobile UI Server
cd /d "%~dp0"
echo ===================================================
echo     STARTING PERSONAL MOBILE UI SERVER
echo ===================================================
echo.
echo Opening browser on PC: http://localhost:5173
start http://localhost:5173
echo.
echo TO CONNECT FROM YOUR MOBILE PHONE:
echo Make sure your phone is connected to the same Wi-Fi.
echo.
npm run dev -- --host 0.0.0.0 --port 5173
pause
