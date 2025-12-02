@echo off
REM Iniciar Queue Worker en segundo plano
REM =====================================

echo.
echo ========================================
echo   Queue Worker - Safety Observation
echo ========================================
echo.
echo Iniciando procesador de colas...
echo.

cd /d "C:\xampp\htdocs\safety-observation"

REM Crear un script VBS para ejecutar sin ventana visible
echo Set WshShell = CreateObject("WScript.Shell") > "%TEMP%\start-queue-worker.vbs"
echo WshShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""C:\xampp\htdocs\safety-observation\scripts\queue\start-queue-worker.ps1""", 0 >> "%TEMP%\start-queue-worker.vbs"

REM Ejecutar el script VBS
cscript //nologo "%TEMP%\start-queue-worker.vbs"

echo.
echo Queue Worker iniciado en segundo plano.
echo.
echo Para verificar que está corriendo:
echo   Get-Process powershell
echo.
echo Para detener:
echo   Stop-Process -Name powershell -Force
echo.
pause
