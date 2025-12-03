# Crear tarea programada para Queue Worker
# ==========================================
# Compatible con XAMPP (desarrollo) y IIS (producción)

param(
    [string]$ProjectPath = "",
    [string]$PhpPath = ""
)

$TaskName = "SafetyObservation-QueueWorker"

# Detectar ruta del proyecto automáticamente
if (-not $ProjectPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $ProjectPath = (Get-Item $ScriptDir).Parent.Parent.FullName
}

$ScriptPath = Join-Path $ProjectPath "scripts\queue\start-queue-worker.ps1"

# Detectar PHP automáticamente
if (-not $PhpPath) {
    # Buscar en ubicaciones comunes
    $phpLocations = @(
        "C:\xampp\php\php.exe",
        "C:\php\php.exe",
        "C:\Program Files\PHP\php.exe",
        "C:\Program Files (x86)\PHP\php.exe"
    )

    foreach ($loc in $phpLocations) {
        if (Test-Path $loc) {
            $PhpPath = $loc
            break
        }
    }

    # Si no se encuentra, buscar en PATH
    if (-not $PhpPath) {
        $PhpPath = (Get-Command php -ErrorAction SilentlyContinue).Source
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Instalador de Queue Worker" -ForegroundColor Green
Write-Host "  Safety Observation System" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuracion detectada:" -ForegroundColor Yellow
Write-Host "  Proyecto: $ProjectPath" -ForegroundColor Gray
Write-Host "  PHP: $PhpPath" -ForegroundColor Gray
Write-Host "  Script: $ScriptPath" -ForegroundColor Gray
Write-Host ""

# Verificar que el script existe
if (-not (Test-Path $ScriptPath)) {
    Write-Host "ERROR: No se encontro el script en $ScriptPath" -ForegroundColor Red
    exit 1
}

# Verificar que PHP existe
if (-not $PhpPath -or -not (Test-Path $PhpPath)) {
    Write-Host "ERROR: No se encontro PHP. Especifica la ruta con -PhpPath" -ForegroundColor Red
    exit 1
}

# Guardar configuración en archivo para que start-queue-worker.ps1 la use
$configPath = Join-Path $ProjectPath "scripts\queue\queue-config.json"
$config = @{
    ProjectPath = $ProjectPath
    PhpPath = $PhpPath
} | ConvertTo-Json
$config | Out-File -FilePath $configPath -Encoding UTF8
Write-Host "Configuracion guardada en: $configPath" -ForegroundColor Gray
Write-Host ""

# Eliminar tarea si ya existe
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Eliminando tarea existente..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Crear acción (ejecutar PowerShell con el script)
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

# Crear triggers (al inicio del sistema Y al inicio de sesión)
$TriggerStartup = New-ScheduledTaskTrigger -AtStartup
$TriggerLogon = New-ScheduledTaskTrigger -AtLogOn

# Configuración de la tarea
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit (New-TimeSpan -Days 9999)

# Principal - Ejecutar con privilegios elevados
$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Registrar la tarea
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $TriggerStartup, $TriggerLogon `
    -Settings $Settings `
    -Principal $Principal `
    -Description "Procesa la cola de correos electronicos para Safety Observation" `
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
