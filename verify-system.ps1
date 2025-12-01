# ==================================================
# Script de Verificación del Sistema
# ==================================================
# Verifica que todos los requisitos estén instalados y configurados

Write-Host "=========================================="
Write-Host "  Verificación del Sistema" -ForegroundColor Green
Write-Host "  Safety Observation App"
Write-Host "=========================================="
Write-Host ""

$errores = 0
$advertencias = 0

# ==================================================
# 1. VERIFICAR VERSIONES DE SOFTWARE
# ==================================================
Write-Host "[1] Verificando versiones de software..." -ForegroundColor Cyan
Write-Host ""

# PHP
try {
    $phpVersion = php -v 2>&1 | Select-String -Pattern "PHP (\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    if ($phpVersion) {
        Write-Host "  ✓ PHP: $phpVersion" -ForegroundColor Green

        # Verificar que sea 8.2 o superior
        if ([version]$phpVersion -lt [version]"8.2.0") {
            Write-Host "    ⚠ Advertencia: Se requiere PHP 8.2 o superior" -ForegroundColor Yellow
            $advertencias++
        }
    } else {
        Write-Host "  ✗ PHP no encontrado" -ForegroundColor Red
        $errores++
    }
} catch {
    Write-Host "  ✗ PHP no encontrado" -ForegroundColor Red
    $errores++
}

# Composer
try {
    $composerVersion = composer --version 2>&1 | Select-String -Pattern "Composer version (\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    if ($composerVersion) {
        Write-Host "  ✓ Composer: $composerVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Composer no encontrado" -ForegroundColor Red
        $errores++
    }
} catch {
    Write-Host "  ✗ Composer no encontrado" -ForegroundColor Red
    $errores++
}

# Node.js
try {
    $nodeVersion = node --version 2>&1
    if ($nodeVersion) {
        Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Node.js no encontrado" -ForegroundColor Red
        $errores++
    }
} catch {
    Write-Host "  ✗ Node.js no encontrado" -ForegroundColor Red
    $errores++
}

# NPM
try {
    $npmVersion = npm --version 2>&1
    if ($npmVersion) {
        Write-Host "  ✓ NPM: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "  ✗ NPM no encontrado" -ForegroundColor Red
        $errores++
    }
} catch {
    Write-Host "  ✗ NPM no encontrado" -ForegroundColor Red
    $errores++
}

Write-Host ""

# ==================================================
# 2. VERIFICAR EXTENSIONES PHP
# ==================================================
Write-Host "[2] Verificando extensiones PHP..." -ForegroundColor Cyan
Write-Host ""

$extensionesRequeridas = @(
    'mbstring',
    'openssl',
    'pdo',
    'pdo_mysql',
    'curl',
    'fileinfo',
    'zip',
    'gd',
    'xml'
)

foreach ($ext in $extensionesRequeridas) {
    $loaded = php -m | Select-String -Pattern "^$ext$" -Quiet
    if ($loaded) {
        Write-Host "  ✓ $ext" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $ext - NO INSTALADA" -ForegroundColor Red
        $errores++
    }
}

Write-Host ""

# ==================================================
# 3. VERIFICAR IIS
# ==================================================
Write-Host "[3] Verificando IIS..." -ForegroundColor Cyan
Write-Host ""

# Verificar que IIS está instalado
$iisService = Get-Service W3SVC -ErrorAction SilentlyContinue
if ($iisService) {
    Write-Host "  ✓ IIS instalado" -ForegroundColor Green
    if ($iisService.Status -eq "Running") {
        Write-Host "  ✓ IIS está corriendo" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ IIS no está corriendo" -ForegroundColor Yellow
        $advertencias++
    }
} else {
    Write-Host "  ✗ IIS no encontrado" -ForegroundColor Red
    $errores++
}

# Verificar URL Rewrite
$rewriteModule = Get-WebGlobalModule -Name "RewriteModule" -ErrorAction SilentlyContinue
if ($rewriteModule) {
    Write-Host "  ✓ URL Rewrite Module instalado" -ForegroundColor Green
} else {
    Write-Host "  ✗ URL Rewrite Module NO instalado" -ForegroundColor Red
    $errores++
}

Write-Host ""

# ==================================================
# 4. VERIFICAR MYSQL
# ==================================================
Write-Host "[4] Verificando MySQL..." -ForegroundColor Cyan
Write-Host ""

$mysqlService = Get-Service MySQL* -ErrorAction SilentlyContinue | Select-Object -First 1
if ($mysqlService) {
    Write-Host "  ✓ MySQL instalado" -ForegroundColor Green
    if ($mysqlService.Status -eq "Running") {
        Write-Host "  ✓ MySQL está corriendo" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ MySQL no está corriendo" -ForegroundColor Yellow
        $advertencias++
    }
} else {
    Write-Host "  ⚠ MySQL no encontrado o no como servicio" -ForegroundColor Yellow
    $advertencias++
}

Write-Host ""

# ==================================================
# 5. VERIFICAR PERMISOS
# ==================================================
Write-Host "[5] Verificando permisos de directorios..." -ForegroundColor Cyan
Write-Host ""

$directoriosVerificar = @(
    "storage",
    "storage\framework",
    "storage\logs",
    "bootstrap\cache"
)

foreach ($dir in $directoriosVerificar) {
    if (Test-Path $dir) {
        $acl = Get-Acl $dir
        $hasIISPermission = $acl.Access | Where-Object {
            $_.IdentityReference -like "*IIS_IUSRS*" -and
            $_.FileSystemRights -match "FullControl|Modify"
        }

        if ($hasIISPermission) {
            Write-Host "  ✓ $dir - Permisos OK" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ $dir - Permisos insuficientes" -ForegroundColor Yellow
            $advertencias++
        }
    } else {
        Write-Host "  ⚠ $dir - No existe" -ForegroundColor Yellow
        $advertencias++
    }
}

Write-Host ""

# ==================================================
# 6. VERIFICAR CONFIGURACIÓN
# ==================================================
Write-Host "[6] Verificando archivos de configuración..." -ForegroundColor Cyan
Write-Host ""

# .env
if (Test-Path ".env") {
    Write-Host "  ✓ .env existe" -ForegroundColor Green

    # Verificar configuraciones críticas
    $envContent = Get-Content .env

    $appEnv = $envContent | Where-Object {$_ -match "^APP_ENV=(.+)"} | ForEach-Object {
        if ($matches[1] -eq "production") {
            Write-Host "    ✓ APP_ENV=production" -ForegroundColor Green
        } else {
            Write-Host "    ⚠ APP_ENV=$($matches[1]) (debería ser 'production')" -ForegroundColor Yellow
            $advertencias++
        }
    }

    $appDebug = $envContent | Where-Object {$_ -match "^APP_DEBUG=(.+)"} | ForEach-Object {
        if ($matches[1] -eq "false") {
            Write-Host "    ✓ APP_DEBUG=false" -ForegroundColor Green
        } else {
            Write-Host "    ⚠ APP_DEBUG=$($matches[1]) (debería ser 'false' en producción)" -ForegroundColor Yellow
            $advertencias++
        }
    }

    $appKey = $envContent | Where-Object {$_ -match "^APP_KEY=(.+)"}
    if ($appKey -and $appKey -ne "APP_KEY=") {
        Write-Host "    ✓ APP_KEY configurado" -ForegroundColor Green
    } else {
        Write-Host "    ✗ APP_KEY no configurado" -ForegroundColor Red
        $errores++
    }
} else {
    Write-Host "  ✗ .env no existe" -ForegroundColor Red
    $errores++
}

# web.config
if (Test-Path "public\web.config") {
    Write-Host "  ✓ public\web.config existe" -ForegroundColor Green
} else {
    Write-Host "  ✗ public\web.config NO existe" -ForegroundColor Red
    $errores++
}

# vendor
if (Test-Path "vendor") {
    Write-Host "  ✓ vendor/ existe (dependencias instaladas)" -ForegroundColor Green
} else {
    Write-Host "  ✗ vendor/ no existe (ejecutar 'composer install')" -ForegroundColor Red
    $errores++
}

# node_modules
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules/ existe" -ForegroundColor Green
} else {
    Write-Host "  ⚠ node_modules/ no existe (ejecutar 'npm install')" -ForegroundColor Yellow
    $advertencias++
}

# public/build
if (Test-Path "public\build") {
    Write-Host "  ✓ public\build/ existe (assets compilados)" -ForegroundColor Green
} else {
    Write-Host "  ✗ public\build/ no existe (ejecutar 'npm run build')" -ForegroundColor Red
    $errores++
}

Write-Host ""

# ==================================================
# 7. VERIFICAR OPTIMIZACIONES
# ==================================================
Write-Host "[7] Verificando optimizaciones Laravel..." -ForegroundColor Cyan
Write-Host ""

$cacheFiles = @(
    @{Path="bootstrap\cache\config.php"; Name="Config cache"},
    @{Path="bootstrap\cache\routes-v7.php"; Name="Routes cache"},
    @{Path="bootstrap\cache\events.php"; Name="Events cache"}
)

foreach ($cache in $cacheFiles) {
    if (Test-Path $cache.Path) {
        Write-Host "  ✓ $($cache.Name)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $($cache.Name) no existe (ejecutar optimizaciones)" -ForegroundColor Yellow
        $advertencias++
    }
}

Write-Host ""

# ==================================================
# RESUMEN
# ==================================================
Write-Host "=========================================="
Write-Host "  RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host ""

if ($errores -eq 0 -and $advertencias -eq 0) {
    Write-Host "  ✓ TODO OK - Sistema listo para producción" -ForegroundColor Green
} elseif ($errores -eq 0) {
    Write-Host "  ⚠ Sistema funcional con $advertencias advertencia(s)" -ForegroundColor Yellow
} else {
    Write-Host "  ✗ Se encontraron $errores error(es) y $advertencias advertencia(s)" -ForegroundColor Red
    Write-Host "    El sistema NO está listo para producción" -ForegroundColor Red
}

Write-Host ""
Write-Host "Errores críticos: $errores" -ForegroundColor $(if ($errores -gt 0) {"Red"} else {"Green"})
Write-Host "Advertencias: $advertencias" -ForegroundColor $(if ($advertencias -gt 0) {"Yellow"} else {"Green"})
Write-Host ""

if ($errores -gt 0 -or $advertencias -gt 0) {
    Write-Host "Consulte DEPLOYMENT-IIS.md para más información" -ForegroundColor Cyan
}

Write-Host ""
