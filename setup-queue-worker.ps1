# Script para Iniciar Queue Worker como Servicio en IIS
# ==================================================
# Este script crea un servicio de Windows para ejecutar el Queue Worker de Laravel

param(
    [Parameter(Mandatory=$false)]
    [string]$RutaApp = "C:\inetpub\wwwroot\safety-observation",

    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "SafetyObservationWorker"
)

Write-Host "=========================================="
Write-Host "  Configuración de Queue Worker" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""

# Verificar que estamos en modo administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    exit 1
}

# Crear directorio para scripts
$scriptDir = "C:\scripts\safety-observation"
if (-not (Test-Path $scriptDir)) {
    New-Item -ItemType Directory -Path $scriptDir -Force | Out-Null
    Write-Host "Directorio de scripts creado: $scriptDir" -ForegroundColor Green
}

# Crear script de worker
$workerScript = @"
# Queue Worker para Safety Observation
Set-Location '$RutaApp'

Write-Host "Iniciando Queue Worker..." -ForegroundColor Green
Write-Host "Presione Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

while (`$true) {
    try {
        php artisan queue:work --sleep=3 --tries=3 --max-time=3600 --timeout=60

        if (`$LASTEXITCODE -ne 0) {
            Write-Host "Worker terminó con error. Reiniciando en 5 segundos..." -ForegroundColor Red
            Start-Sleep -Seconds 5
        }
    } catch {
        Write-Host "Error: `$_" -ForegroundColor Red
        Write-Host "Reiniciando en 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}
"@

$workerScriptPath = "$scriptDir\queue-worker.ps1"
$workerScript | Out-File -FilePath $workerScriptPath -Encoding UTF8
Write-Host "Script de worker creado: $workerScriptPath" -ForegroundColor Green
Write-Host ""

# Instrucciones para NSSM
Write-Host "=========================================="
Write-Host "  Instalación como Servicio" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host ""
Write-Host "Para ejecutar el Queue Worker como servicio, sigue estos pasos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Descargar NSSM (Non-Sucking Service Manager):" -ForegroundColor White
Write-Host "   https://nssm.cc/download" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Extraer nssm.exe a C:\nssm\" -ForegroundColor White
Write-Host ""
Write-Host "3. Instalar el servicio con estos comandos:" -ForegroundColor White
Write-Host ""
Write-Host "   cd C:\nssm" -ForegroundColor Gray
Write-Host "   .\nssm.exe install $ServiceName PowerShell.exe" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Configurar parámetros:" -ForegroundColor White
Write-Host ""
Write-Host "   .\nssm.exe set $ServiceName AppParameters '-ExecutionPolicy Bypass -NoProfile -File ""$workerScriptPath""'" -ForegroundColor Gray
Write-Host "   .\nssm.exe set $ServiceName AppDirectory ""$RutaApp""" -ForegroundColor Gray
Write-Host "   .\nssm.exe set $ServiceName DisplayName ""Safety Observation Queue Worker""" -ForegroundColor Gray
Write-Host "   .\nssm.exe set $ServiceName Description ""Procesa trabajos en cola para Safety Observation""" -ForegroundColor Gray
Write-Host "   .\nssm.exe set $ServiceName Start SERVICE_AUTO_START" -ForegroundColor Gray
Write-Host "   .\nssm.exe set $ServiceName AppStdout ""$RutaApp\storage\logs\queue-worker.log""" -ForegroundColor Gray
Write-Host "   .\nssm.exe set $ServiceName AppStderr ""$RutaApp\storage\logs\queue-worker-error.log""" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Iniciar el servicio:" -ForegroundColor White
Write-Host ""
Write-Host "   .\nssm.exe start $ServiceName" -ForegroundColor Gray
Write-Host ""
Write-Host "=========================================="
Write-Host ""

# Crear script de instalación automática si NSSM está disponible
if (Test-Path "C:\nssm\nssm.exe") {
    Write-Host "NSSM detectado. ¿Desea instalar el servicio ahora? (S/N): " -ForegroundColor Yellow -NoNewline
    $respuesta = Read-Host

    if ($respuesta -eq "S" -or $respuesta -eq "s") {
        Write-Host ""
        Write-Host "Instalando servicio..." -ForegroundColor Cyan

        & C:\nssm\nssm.exe install $ServiceName PowerShell.exe
        & C:\nssm\nssm.exe set $ServiceName AppParameters "-ExecutionPolicy Bypass -NoProfile -File `"$workerScriptPath`""
        & C:\nssm\nssm.exe set $ServiceName AppDirectory "$RutaApp"
        & C:\nssm\nssm.exe set $ServiceName DisplayName "Safety Observation Queue Worker"
        & C:\nssm\nssm.exe set $ServiceName Description "Procesa trabajos en cola para Safety Observation"
        & C:\nssm\nssm.exe set $ServiceName Start SERVICE_AUTO_START
        & C:\nssm\nssm.exe set $ServiceName AppStdout "$RutaApp\storage\logs\queue-worker.log"
        & C:\nssm\nssm.exe set $ServiceName AppStderr "$RutaApp\storage\logs\queue-worker-error.log"

        Write-Host ""
        Write-Host "Servicio instalado exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para iniciar el servicio:" -ForegroundColor Yellow
        Write-Host "   Start-Service $ServiceName" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "NOTA: NSSM no encontrado en C:\nssm\" -ForegroundColor Yellow
    Write-Host "Sigue las instrucciones anteriores para instalarlo manualmente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  Configuración Completada" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Yellow
Write-Host "  Start-Service $ServiceName      # Iniciar servicio" -ForegroundColor Gray
Write-Host "  Stop-Service $ServiceName       # Detener servicio" -ForegroundColor Gray
Write-Host "  Restart-Service $ServiceName    # Reiniciar servicio" -ForegroundColor Gray
Write-Host "  Get-Service $ServiceName        # Ver estado" -ForegroundColor Gray
Write-Host ""
