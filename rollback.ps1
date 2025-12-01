# Script de Rollback para IIS
# ==================================================
# Este script revierte el deployment a una versión anterior

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupPath,

    [Parameter(Mandatory=$false)]
    [string]$RutaApp = "C:\inetpub\wwwroot\safety-observation"
)

Write-Host "=========================================="
Write-Host "  Rollback Safety Observation App" -ForegroundColor Red
Write-Host "  Backup: $BackupPath"
Write-Host "=========================================="
Write-Host ""

# Verificar que el backup existe
if (-not (Test-Path $BackupPath)) {
    Write-Host "ERROR: El backup no existe en $BackupPath" -ForegroundColor Red
    exit 1
}

# Confirmar rollback
$confirm = Read-Host "¿Está seguro de realizar el rollback? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Rollback cancelado" -ForegroundColor Yellow
    exit 0
}

# Navegar a la carpeta del proyecto
Set-Location $RutaApp

# Activar modo mantenimiento
Write-Host "[1/6] Activando modo mantenimiento..." -ForegroundColor Cyan
php artisan down
Write-Host ""

# Crear backup del estado actual (por seguridad)
Write-Host "[2/6] Creando backup del estado actual..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$currentBackup = "C:\backups\safety-observation\rollback_$timestamp"
New-Item -ItemType Directory -Path $currentBackup -Force | Out-Null
Copy-Item ".env" -Destination "$currentBackup\.env" -Force
Write-Host "  Backup actual guardado en: $currentBackup" -ForegroundColor Green
Write-Host ""

# Restaurar archivos desde backup
Write-Host "[3/6] Restaurando archivos..." -ForegroundColor Cyan
Copy-Item "$BackupPath\.env" -Destination ".env" -Force -ErrorAction SilentlyContinue
Copy-Item "$BackupPath\storage\app\*" -Destination "storage\app\" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "  Archivos restaurados" -ForegroundColor Green
Write-Host ""

# Restaurar base de datos
Write-Host "[4/6] Restaurando base de datos..." -ForegroundColor Cyan
$dbBackup = Get-ChildItem "$BackupPath\*.sql" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($dbBackup) {
    # Leer credenciales de .env
    $dbName = (Get-Content .env | Where-Object {$_ -match "^DB_DATABASE="}) -replace "DB_DATABASE=", ""
    $dbUser = (Get-Content .env | Where-Object {$_ -match "^DB_USERNAME="}) -replace "DB_USERNAME=", ""
    $dbPass = (Get-Content .env | Where-Object {$_ -match "^DB_PASSWORD="}) -replace "DB_PASSWORD=", ""

    # Restaurar
    if ($dbPass) {
        mysql -u $dbUser -p$dbPass $dbName < $dbBackup.FullName
    } else {
        mysql -u $dbUser $dbName < $dbBackup.FullName
    }
    Write-Host "  Base de datos restaurada" -ForegroundColor Green
} else {
    Write-Host "  No se encontró backup de base de datos" -ForegroundColor Yellow
}
Write-Host ""

# Limpiar cachés
Write-Host "[5/6] Limpiando cachés..." -ForegroundColor Cyan
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
Write-Host "  Cachés limpiados" -ForegroundColor Green
Write-Host ""

# Desactivar modo mantenimiento
Write-Host "[6/6] Desactivando modo mantenimiento..." -ForegroundColor Cyan
php artisan up
Write-Host ""

Write-Host "=========================================="
Write-Host "  ROLLBACK COMPLETADO" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""
Write-Host "Verifique que la aplicación funciona correctamente" -ForegroundColor Yellow
Write-Host ""
