# Queue Worker para Safety Observation
# =====================================
# Compatible con XAMPP (desarrollo) y IIS (producción)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ConfigPath = Join-Path $ScriptDir "queue-config.json"

# Cargar configuración o usar valores por defecto
if (Test-Path $ConfigPath) {
    $config = Get-Content $ConfigPath | ConvertFrom-Json
    $ProjectPath = $config.ProjectPath
    $PhpPath = $config.PhpPath
} else {
    # Valores por defecto (XAMPP)
    $ProjectPath = (Get-Item $ScriptDir).Parent.Parent.FullName

    # Detectar PHP
    $phpLocations = @(
        "C:\xampp\php\php.exe",
        "C:\php\php.exe",
        "C:\Program Files\PHP\php.exe"
    )
    foreach ($loc in $phpLocations) {
        if (Test-Path $loc) {
            $PhpPath = $loc
            break
        }
    }
    if (-not $PhpPath) {
        $PhpPath = (Get-Command php -ErrorAction SilentlyContinue).Source
    }
}

# Verificar configuración
if (-not (Test-Path $ProjectPath)) {
    Write-Host "ERROR: Proyecto no encontrado en $ProjectPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $PhpPath)) {
    Write-Host "ERROR: PHP no encontrado en $PhpPath" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Queue Worker - Safety Observation" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proyecto: $ProjectPath" -ForegroundColor Gray
Write-Host "PHP: $PhpPath" -ForegroundColor Gray
Write-Host ""
Write-Host "Procesando colas de correos electronicos..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

# Bucle infinito que reinicia el worker si falla
while ($true) {
    try {
        # Ejecutar el worker
        & $PhpPath artisan queue:work --sleep=3 --tries=3 --timeout=90 --max-jobs=1000 --max-time=3600

        # Si termina, esperar 5 segundos antes de reiniciar
        Write-Host "`nWorker detenido. Reiniciando en 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5

    } catch {
        Write-Host "`nError: $_" -ForegroundColor Red
        Write-Host "Reiniciando en 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}
