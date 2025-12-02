# Crear tarea programada para Queue Worker
# ==========================================

$TaskName = "SafetyObservation-QueueWorker"
$ScriptPath = "C:\xampp\htdocs\safety-observation\scripts\queue\start-queue-worker.ps1"

Write-Host "Creando tarea programada: $TaskName" -ForegroundColor Cyan

# Verificar que el script existe
if (-not (Test-Path $ScriptPath)) {
    Write-Host "ERROR: No se encontró el script en $ScriptPath" -ForegroundColor Red
    exit 1
}

# Eliminar tarea si ya existe
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Eliminando tarea existente..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Crear acción (ejecutar PowerShell con el script)
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

# Crear trigger (al inicio de sesión)
$Trigger = New-ScheduledTaskTrigger -AtLogOn

# Configuración de la tarea
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1)

# Registrar la tarea (se ejecutará con el usuario actual)
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Procesa la cola de correos electrónicos para Safety Observation" `
    -Force

Write-Host ""
Write-Host "✅ Tarea programada creada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "La tarea se iniciará automáticamente cuando inicies sesión en Windows." -ForegroundColor Yellow
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Cyan
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'    # Iniciar ahora" -ForegroundColor Gray
Write-Host "  Stop-ScheduledTask -TaskName '$TaskName'     # Detener" -ForegroundColor Gray
Write-Host "  Get-ScheduledTask -TaskName '$TaskName'      # Ver estado" -ForegroundColor Gray
Write-Host ""
Write-Host "¿Deseas iniciar la tarea ahora? (S/N): " -ForegroundColor Yellow -NoNewline
$respuesta = Read-Host

if ($respuesta -eq "S" -or $respuesta -eq "s") {
    Start-ScheduledTask -TaskName $TaskName
    Write-Host ""
    Write-Host "✅ Tarea iniciada!" -ForegroundColor Green
    Write-Host "Los correos ahora se enviarán automáticamente desde la cola." -ForegroundColor Green
}
