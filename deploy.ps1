# ==================================================
# Script de Deployment para IIS
# ==================================================
# Este script automatiza el proceso de deployment de la aplicación Laravel
# Ejecutar con PowerShell como Administrador

param(
    [Parameter(Mandatory=$false)]
    [string]$Ambiente = "production",

    [Parameter(Mandatory=$false)]
    [string]$RutaApp = "C:\inetpub\wwwroot\safety-observation",

    [Parameter(Mandatory=$false)]
    [switch]$SkipBackup,

    [Parameter(Mandatory=$false)]
    [switch]$SkipMigrations
)

# Colores para output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "=========================================="
Write-ColorOutput Green "  Deployment Safety Observation App"
Write-ColorOutput Green "  Ambiente: $Ambiente"
Write-ColorOutput Green "=========================================="
Write-Output ""

# Verificar que estamos en modo administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-ColorOutput Red "ERROR: Este script debe ejecutarse como Administrador"
    exit 1
}

# Navegar a la carpeta del proyecto
Set-Location $RutaApp
Write-ColorOutput Yellow "Ubicación: $RutaApp"
Write-Output ""

# ==================================================
# 1. MODO MANTENIMIENTO
# ==================================================
Write-ColorOutput Cyan "[1/10] Activando modo mantenimiento..."
php artisan down --render="errors::503" --retry=60
Write-Output ""

# ==================================================
# 2. BACKUP (Opcional)
# ==================================================
if (-not $SkipBackup) {
    Write-ColorOutput Cyan "[2/10] Creando backup..."
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "C:\backups\safety-observation\$timestamp"

    if (-not (Test-Path "C:\backups\safety-observation")) {
        New-Item -ItemType Directory -Path "C:\backups\safety-observation" -Force | Out-Null
    }

    # Backup de la base de datos
    Write-Output "  - Backup de base de datos..."
    php artisan backup:run --only-db 2>&1 | Out-Null

    # Backup de archivos críticos
    Write-Output "  - Backup de archivos..."
    Copy-Item ".env" -Destination "$backupDir\.env" -Force
    Copy-Item "storage\app" -Destination "$backupDir\storage\app" -Recurse -Force

    Write-ColorOutput Green "  Backup completado en: $backupDir"
} else {
    Write-ColorOutput Yellow "[2/10] Backup omitido"
}
Write-Output ""

# ==================================================
# 3. ACTUALIZAR CÓDIGO DESDE GIT (si está en Git)
# ==================================================
Write-ColorOutput Cyan "[3/10] Actualizando código..."
if (Test-Path ".git") {
    git pull origin main
    Write-ColorOutput Green "  Código actualizado desde Git"
} else {
    Write-ColorOutput Yellow "  No es un repositorio Git - omitiendo..."
}
Write-Output ""

# ==================================================
# 4. INSTALAR DEPENDENCIAS DE COMPOSER
# ==================================================
Write-ColorOutput Cyan "[4/10] Instalando dependencias PHP (Composer)..."
composer install --no-dev --optimize-autoloader --no-interaction
Write-Output ""

# ==================================================
# 5. INSTALAR DEPENDENCIAS DE NPM
# ==================================================
Write-ColorOutput Cyan "[5/10] Instalando dependencias JavaScript (NPM)..."
npm ci --production=false
Write-Output ""

# ==================================================
# 6. COMPILAR ASSETS
# ==================================================
Write-ColorOutput Cyan "[6/10] Compilando assets para producción..."
npm run build
Write-Output ""

# ==================================================
# 7. OPTIMIZAR LARAVEL
# ==================================================
Write-ColorOutput Cyan "[7/10] Optimizando Laravel..."

# Limpiar cachés antiguos
Write-Output "  - Limpiando cachés..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Crear nuevos cachés optimizados
Write-Output "  - Creando cachés optimizados..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

Write-ColorOutput Green "  Optimización completada"
Write-Output ""

# ==================================================
# 8. EJECUTAR MIGRACIONES
# ==================================================
if (-not $SkipMigrations) {
    Write-ColorOutput Cyan "[8/10] Ejecutando migraciones de base de datos..."
    php artisan migrate --force
    Write-Output ""
} else {
    Write-ColorOutput Yellow "[8/10] Migraciones omitidas"
    Write-Output ""
}

# ==================================================
# 9. PERMISOS DE DIRECTORIOS
# ==================================================
Write-ColorOutput Cyan "[9/10] Configurando permisos..."

$directorios = @(
    "storage",
    "storage\framework",
    "storage\framework\cache",
    "storage\framework\sessions",
    "storage\framework\views",
    "storage\logs",
    "storage\app",
    "bootstrap\cache"
)

foreach ($dir in $directorios) {
    if (Test-Path $dir) {
        Write-Output "  - Configurando permisos para $dir"
        $acl = Get-Acl $dir
        $permission = "IIS_IUSRS","FullControl","ContainerInherit,ObjectInherit","None","Allow"
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
        $acl.SetAccessRule($accessRule)
        Set-Acl $dir $acl
    }
}

# Crear link simbólico para storage si no existe
if (-not (Test-Path "public\storage")) {
    Write-Output "  - Creando link simbólico para storage..."
    php artisan storage:link
}

Write-ColorOutput Green "  Permisos configurados"
Write-Output ""

# ==================================================
# 10. DESACTIVAR MODO MANTENIMIENTO
# ==================================================
Write-ColorOutput Cyan "[10/10] Desactivando modo mantenimiento..."
php artisan up
Write-Output ""

# ==================================================
# RESUMEN FINAL
# ==================================================
Write-ColorOutput Green "=========================================="
Write-ColorOutput Green "  DEPLOYMENT COMPLETADO CON ÉXITO"
Write-ColorOutput Green "=========================================="
Write-Output ""
Write-ColorOutput Yellow "Tareas post-deployment recomendadas:"
Write-Output "  1. Verificar la aplicación en el navegador"
Write-Output "  2. Revisar los logs en storage\logs"
Write-Output "  3. Verificar que el correo funciona correctamente"
Write-Output "  4. Probar funcionalidades críticas"
Write-Output ""
Write-ColorOutput Cyan "Logs disponibles en: $RutaApp\storage\logs"
Write-Output ""

# Mostrar información del sistema
Write-ColorOutput Yellow "Información del sistema:"
Write-Output "  PHP Version: $(php -v | Select-String -Pattern 'PHP \d+\.\d+\.\d+')"
Write-Output "  Composer Version: $(composer --version)"
Write-Output "  Node Version: $(node --version)"
Write-Output "  NPM Version: $(npm --version)"
Write-Output ""

Write-ColorOutput Green "Deployment finalizado exitosamente!"
