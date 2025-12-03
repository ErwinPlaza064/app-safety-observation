# ============================================
# Script para Limpiar Cache de Laravel
# ============================================

param(
    [switch]$All,
    [switch]$Config,
    [switch]$Route,
    [switch]$View,
    [switch]$Cache,
    [switch]$Event,
    [switch]$Compiled
)

# Colores para output
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }

# Directorio del proyecto
$projectPath = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Limpieza de Cache - Laravel" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location $projectPath
Write-Info "Directorio del proyecto: $projectPath"
Write-Host ""

# Si no se especifica ningún parámetro o se usa -All, limpiar todo
if (-not ($Config -or $Route -or $View -or $Cache -or $Event -or $Compiled) -or $All) {
    Write-Info "Limpiando TODA la cache..."
    Write-Host ""

    Write-Info "[1/6] Limpiando cache de configuración..."
    php artisan config:clear
    Write-Success "✓ Cache de configuración limpiada"

    Write-Info "[2/6] Limpiando cache de rutas..."
    php artisan route:clear
    Write-Success "✓ Cache de rutas limpiada"

    Write-Info "[3/6] Limpiando cache de vistas..."
    php artisan view:clear
    Write-Success "✓ Cache de vistas limpiada"

    Write-Info "[4/6] Limpiando cache de aplicación..."
    php artisan cache:clear
    Write-Success "✓ Cache de aplicación limpiada"

    Write-Info "[5/6] Limpiando cache de eventos..."
    php artisan event:clear
    Write-Success "✓ Cache de eventos limpiada"

    Write-Info "[6/6] Limpiando archivos compilados..."
    php artisan clear-compiled
    Write-Success "✓ Archivos compilados limpiados"

} else {
    # Limpiar solo lo especificado
    if ($Config) {
        Write-Info "Limpiando cache de configuración..."
        php artisan config:clear
        Write-Success "✓ Cache de configuración limpiada"
    }

    if ($Route) {
        Write-Info "Limpiando cache de rutas..."
        php artisan route:clear
        Write-Success "✓ Cache de rutas limpiada"
    }

    if ($View) {
        Write-Info "Limpiando cache de vistas..."
        php artisan view:clear
        Write-Success "✓ Cache de vistas limpiada"
    }

    if ($Cache) {
        Write-Info "Limpiando cache de aplicación..."
        php artisan cache:clear
        Write-Success "✓ Cache de aplicación limpiada"
    }

    if ($Event) {
        Write-Info "Limpiando cache de eventos..."
        php artisan event:clear
        Write-Success "✓ Cache de eventos limpiada"
    }

    if ($Compiled) {
        Write-Info "Limpiando archivos compilados..."
        php artisan clear-compiled
        Write-Success "✓ Archivos compilados limpiados"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Success "  ¡Limpieza completada!"
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
