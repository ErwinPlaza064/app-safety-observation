# Script de Monitoreo y Mantenimiento
# ==================================================
# Verifica el estado de la aplicación y realiza mantenimiento preventivo

param(
    [Parameter(Mandatory=$false)]
    [string]$RutaApp = "C:\inetpub\wwwroot\safety-observation",

    [Parameter(Mandatory=$false)]
    [switch]$AutoClean,

    [Parameter(Mandatory=$false)]
    [int]$DaysToKeepLogs = 7
)

Write-Host "=========================================="
Write-Host "  Monitoreo Safety Observation" -ForegroundColor Green
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "=========================================="
Write-Host ""

Set-Location $RutaApp

# ==================================================
# 1. VERIFICAR ESTADO DE SERVICIOS
# ==================================================
Write-Host "[1] Verificando servicios..." -ForegroundColor Cyan
Write-Host ""

# IIS
$iis = Get-Service W3SVC -ErrorAction SilentlyContinue
if ($iis -and $iis.Status -eq "Running") {
    Write-Host "  ✓ IIS está corriendo" -ForegroundColor Green
} else {
    Write-Host "  ✗ IIS no está corriendo" -ForegroundColor Red
}

# MySQL
$mysql = Get-Service MySQL* -ErrorAction SilentlyContinue | Select-Object -First 1
if ($mysql -and $mysql.Status -eq "Running") {
    Write-Host "  ✓ MySQL está corriendo" -ForegroundColor Green
} else {
    Write-Host "  ⚠ MySQL no está corriendo" -ForegroundColor Yellow
}

# Queue Worker
$queueWorker = Get-Service SafetyObservationWorker -ErrorAction SilentlyContinue
if ($queueWorker) {
    if ($queueWorker.Status -eq "Running") {
        Write-Host "  ✓ Queue Worker está corriendo" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Queue Worker no está corriendo" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ Queue Worker no está configurado" -ForegroundColor Yellow
}

# Scheduler
$scheduler = Get-ScheduledTask -TaskName "SafetyObservationScheduler" -ErrorAction SilentlyContinue
if ($scheduler) {
    if ($scheduler.State -eq "Ready") {
        Write-Host "  ✓ Scheduler está activo" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Scheduler estado: $($scheduler.State)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ Scheduler no está configurado" -ForegroundColor Yellow
}

Write-Host ""

# ==================================================
# 2. VERIFICAR USO DE DISCO
# ==================================================
Write-Host "[2] Verificando espacio en disco..." -ForegroundColor Cyan
Write-Host ""

$drive = (Get-Item $RutaApp).PSDrive.Name + ":"
$disk = Get-PSDrive $drive.Replace(":", "")
$freeGB = [math]::Round($disk.Free / 1GB, 2)
$totalGB = [math]::Round(($disk.Free + $disk.Used) / 1GB, 2)
$percentFree = [math]::Round(($disk.Free / ($disk.Free + $disk.Used)) * 100, 2)

Write-Host "  Disco $drive" -ForegroundColor White
Write-Host "    Libre: $freeGB GB de $totalGB GB ($percentFree%)" -ForegroundColor $(if ($percentFree -gt 20) {"Green"} elseif ($percentFree -gt 10) {"Yellow"} else {"Red"})

if ($percentFree -lt 10) {
    Write-Host "    ⚠ ADVERTENCIA: Espacio en disco bajo!" -ForegroundColor Red
}

Write-Host ""

# Tamaño de directorios importantes
$storagePath = Join-Path $RutaApp "storage"
if (Test-Path $storagePath) {
    $storageSize = (Get-ChildItem -Path $storagePath -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $storageMB = [math]::Round($storageSize / 1MB, 2)
    Write-Host "  Tamaño de storage/: $storageMB MB" -ForegroundColor White
}

$logsPath = Join-Path $RutaApp "storage\logs"
if (Test-Path $logsPath) {
    $logsSize = (Get-ChildItem -Path $logsPath -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $logsMB = [math]::Round($logsSize / 1MB, 2)
    Write-Host "  Tamaño de logs/: $logsMB MB" -ForegroundColor $(if ($logsMB -gt 100) {"Yellow"} else {"White"})
}

Write-Host ""

# ==================================================
# 3. VERIFICAR LOGS DE ERRORES
# ==================================================
Write-Host "[3] Analizando logs recientes..." -ForegroundColor Cyan
Write-Host ""

$today = Get-Date -Format "Y-m-d"
$todayLog = Join-Path $logsPath "laravel-$today.log"

if (Test-Path $todayLog) {
    $logContent = Get-Content $todayLog -ErrorAction SilentlyContinue

    # Contar errores
    $errors = ($logContent | Select-String -Pattern "\[ERROR\]|\[CRITICAL\]|\[EMERGENCY\]" -AllMatches).Matches.Count
    $warnings = ($logContent | Select-String -Pattern "\[WARNING\]" -AllMatches).Matches.Count

    Write-Host "  Log del día: laravel-$today.log" -ForegroundColor White
    Write-Host "    Errores: $errors" -ForegroundColor $(if ($errors -gt 0) {"Red"} else {"Green"})
    Write-Host "    Warnings: $warnings" -ForegroundColor $(if ($warnings -gt 5) {"Yellow"} else {"Green"})

    # Mostrar últimos 5 errores si existen
    if ($errors -gt 0) {
        Write-Host ""
        Write-Host "  Últimos errores:" -ForegroundColor Yellow
        $logContent | Select-String -Pattern "\[ERROR\]|\[CRITICAL\]|\[EMERGENCY\]" |
            Select-Object -Last 5 |
            ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    }
} else {
    Write-Host "  ✓ No hay log del día actual" -ForegroundColor Green
}

Write-Host ""

# ==================================================
# 4. VERIFICAR BASE DE DATOS
# ==================================================
Write-Host "[4] Verificando conexión a base de datos..." -ForegroundColor Cyan
Write-Host ""

try {
    $dbCheck = php artisan tinker --execute="DB::connection()->getPdo(); echo 'OK';" 2>&1
    if ($dbCheck -match "OK") {
        Write-Host "  ✓ Conexión a base de datos exitosa" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Error en conexión a base de datos" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ No se pudo verificar la base de datos" -ForegroundColor Red
}

Write-Host ""

# ==================================================
# 5. VERIFICAR CACHÉS
# ==================================================
Write-Host "[5] Verificando cachés..." -ForegroundColor Cyan
Write-Host ""

$cacheFiles = @(
    @{Name="Config"; Path="bootstrap\cache\config.php"},
    @{Name="Routes"; Path="bootstrap\cache\routes-v7.php"},
    @{Name="Events"; Path="bootstrap\cache\events.php"}
)

foreach ($cache in $cacheFiles) {
    $fullPath = Join-Path $RutaApp $cache.Path
    if (Test-Path $fullPath) {
        $age = (Get-Date) - (Get-Item $fullPath).LastWriteTime
        Write-Host "  ✓ $($cache.Name) cache (actualizado hace $([math]::Round($age.TotalHours, 1)) horas)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $($cache.Name) cache no existe" -ForegroundColor Yellow
    }
}

Write-Host ""

# ==================================================
# 6. VERIFICAR PERMISOS
# ==================================================
Write-Host "[6] Verificando permisos críticos..." -ForegroundColor Cyan
Write-Host ""

$dirsToCheck = @("storage", "bootstrap\cache")
foreach ($dir in $dirsToCheck) {
    $fullPath = Join-Path $RutaApp $dir
    if (Test-Path $fullPath) {
        $acl = Get-Acl $fullPath
        $hasPermission = $acl.Access | Where-Object {
            $_.IdentityReference -like "*IIS_IUSRS*" -and
            ($_.FileSystemRights -match "FullControl|Modify")
        }

        if ($hasPermission) {
            Write-Host "  ✓ $dir" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ $dir - Permisos insuficientes" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

# ==================================================
# 7. MANTENIMIENTO AUTOMÁTICO
# ==================================================
if ($AutoClean) {
    Write-Host "[7] Ejecutando mantenimiento automático..." -ForegroundColor Cyan
    Write-Host ""

    # Limpiar logs antiguos
    Write-Host "  Limpiando logs antiguos (>$DaysToKeepLogs días)..." -ForegroundColor White
    $cutoffDate = (Get-Date).AddDays(-$DaysToKeepLogs)
    $oldLogs = Get-ChildItem -Path $logsPath -Filter "*.log" |
        Where-Object { $_.LastWriteTime -lt $cutoffDate }

    if ($oldLogs) {
        foreach ($log in $oldLogs) {
            Remove-Item $log.FullName -Force
            Write-Host "    Eliminado: $($log.Name)" -ForegroundColor Gray
        }
        Write-Host "    $($oldLogs.Count) archivo(s) eliminado(s)" -ForegroundColor Green
    } else {
        Write-Host "    No hay logs antiguos para eliminar" -ForegroundColor Green
    }

    # Limpiar caché de vistas antiguas
    Write-Host "  Limpiando caché de vistas..." -ForegroundColor White
    php artisan view:clear | Out-Null
    Write-Host "    ✓ Caché de vistas limpiado" -ForegroundColor Green

    # Limpiar sesiones expiradas
    Write-Host "  Limpiando sesiones expiradas..." -ForegroundColor White
    php artisan session:gc | Out-Null
    Write-Host "    ✓ Sesiones limpiadas" -ForegroundColor Green

    Write-Host ""
}

# ==================================================
# 8. ESTADÍSTICAS DE LA APLICACIÓN
# ==================================================
Write-Host "[8] Estadísticas de la aplicación..." -ForegroundColor Cyan
Write-Host ""

try {
    # Contar observaciones del mes
    $obsCount = php artisan tinker --execute="echo App\Models\Observation::whereMonth('created_at', date('m'))->count();" 2>&1 | Select-String -Pattern "\d+" | Select-Object -First 1
    Write-Host "  Observaciones este mes: $($obsCount.Matches.Value)" -ForegroundColor White

    # Contar usuarios activos
    $userCount = php artisan tinker --execute="echo App\Models\User::count();" 2>&1 | Select-String -Pattern "\d+" | Select-Object -First 1
    Write-Host "  Total de usuarios: $($userCount.Matches.Value)" -ForegroundColor White
} catch {
    Write-Host "  ⚠ No se pudieron obtener estadísticas" -ForegroundColor Yellow
}

Write-Host ""

# ==================================================
# RESUMEN
# ==================================================
Write-Host "=========================================="
Write-Host "  Resumen del Monitoreo" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host ""
Write-Host "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host "Aplicación: Safety Observation" -ForegroundColor White
Write-Host "Ruta: $RutaApp" -ForegroundColor White
Write-Host ""

if ($AutoClean) {
    Write-Host "✓ Mantenimiento automático ejecutado" -ForegroundColor Green
} else {
    Write-Host "Ejecute con -AutoClean para realizar mantenimiento automático" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Para más detalles, revise los logs en: $logsPath" -ForegroundColor Cyan
Write-Host ""
