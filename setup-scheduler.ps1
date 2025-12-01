# Script para Configurar el Task Scheduler de Laravel
# ==================================================
# Este script configura una tarea programada para ejecutar el scheduler de Laravel

param(
    [Parameter(Mandatory=$false)]
    [string]$RutaApp = "C:\inetpub\wwwroot\safety-observation",

    [Parameter(Mandatory=$false)]
    [string]$TaskName = "SafetyObservationScheduler"
)

Write-Host "=========================================="
Write-Host "  Configuración de Laravel Scheduler" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""

# Verificar que estamos en modo administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    exit 1
}

# Verificar que PHP existe
try {
    $phpPath = (Get-Command php -ErrorAction Stop).Source
    Write-Host "PHP encontrado en: $phpPath" -ForegroundColor Green
} catch {
    Write-Host "ERROR: PHP no encontrado en el PATH" -ForegroundColor Red
    Write-Host "Asegúrese de que PHP esté instalado y agregado al PATH del sistema" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Crear la acción de la tarea
$action = New-ScheduledTaskAction `
    -Execute 'php.exe' `
    -Argument "artisan schedule:run" `
    -WorkingDirectory $RutaApp

# Crear el trigger (cada minuto, indefinidamente)
$trigger = New-ScheduledTaskTrigger `
    -Once `
    -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 1) `
    -RepetitionDuration ([TimeSpan]::MaxValue)

# Configurar los settings
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable:$false `
    -DontStopOnIdleEnd `
    -MultipleInstances IgnoreNew

# Crear el principal (ejecutar como SYSTEM)
$principal = New-ScheduledTaskPrincipal `
    -UserID "NT AUTHORITY\SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel Highest

# Eliminar tarea existente si existe
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Eliminando tarea existente..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Registrar la tarea
try {
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "Ejecuta el Task Scheduler de Laravel para Safety Observation cada minuto"

    Write-Host ""
    Write-Host "✓ Tarea programada creada exitosamente" -ForegroundColor Green
    Write-Host ""

    # Iniciar la tarea inmediatamente
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "✓ Tarea iniciada" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "ERROR al crear la tarea: $_" -ForegroundColor Red
    exit 1
}

# Mostrar información de la tarea
Write-Host "=========================================="
Write-Host "  Información de la Tarea" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host ""
Write-Host "Nombre: $TaskName" -ForegroundColor White
Write-Host "Ruta de trabajo: $RutaApp" -ForegroundColor White
Write-Host "Comando: php artisan schedule:run" -ForegroundColor White
Write-Host "Frecuencia: Cada 1 minuto" -ForegroundColor White
Write-Host "Usuario: SYSTEM" -ForegroundColor White
Write-Host ""

# Verificar estado
$task = Get-ScheduledTask -TaskName $TaskName
$taskInfo = Get-ScheduledTaskInfo -TaskName $TaskName

Write-Host "Estado actual: $($task.State)" -ForegroundColor $(if ($task.State -eq "Ready") {"Green"} else {"Yellow"})
Write-Host "Última ejecución: $($taskInfo.LastRunTime)" -ForegroundColor White
Write-Host "Próxima ejecución: $($taskInfo.NextRunTime)" -ForegroundColor White
Write-Host "Último resultado: $($taskInfo.LastTaskResult)" -ForegroundColor $(if ($taskInfo.LastTaskResult -eq 0) {"Green"} else {"Red"})
Write-Host ""

# Comandos útiles
Write-Host "=========================================="
Write-Host "  Comandos Útiles" -ForegroundColor Yellow
Write-Host "=========================================="
Write-Host ""
Write-Host "Ver estado de la tarea:" -ForegroundColor White
Write-Host "  Get-ScheduledTask -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Ver información detallada:" -ForegroundColor White
Write-Host "  Get-ScheduledTaskInfo -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Iniciar tarea manualmente:" -ForegroundColor White
Write-Host "  Start-ScheduledTask -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Detener tarea:" -ForegroundColor White
Write-Host "  Stop-ScheduledTask -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Deshabilitar tarea:" -ForegroundColor White
Write-Host "  Disable-ScheduledTask -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Habilitar tarea:" -ForegroundColor White
Write-Host "  Enable-ScheduledTask -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""
Write-Host "Eliminar tarea:" -ForegroundColor White
Write-Host "  Unregister-ScheduledTask -TaskName $TaskName" -ForegroundColor Gray
Write-Host ""

# Información sobre el scheduler de Laravel
Write-Host "=========================================="
Write-Host "  Sobre Laravel Scheduler" -ForegroundColor Cyan
Write-Host "=========================================="
Write-Host ""
Write-Host "El scheduler de Laravel permite programar tareas periódicas como:" -ForegroundColor White
Write-Host "  - Limpieza de datos temporales" -ForegroundColor Gray
Write-Host "  - Envío de reportes periódicos" -ForegroundColor Gray
Write-Host "  - Backups automáticos" -ForegroundColor Gray
Write-Host "  - Procesamiento de datos en lote" -ForegroundColor Gray
Write-Host ""
Write-Host "Las tareas se definen en: routes/console.php" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ejemplo de uso:" -ForegroundColor White
Write-Host @"
  Schedule::command('observations:cleanup')
      ->daily()
      ->at('02:00');
"@ -ForegroundColor Gray
Write-Host ""
Write-Host "Ver tareas programadas:" -ForegroundColor White
Write-Host "  php artisan schedule:list" -ForegroundColor Gray
Write-Host ""

Write-Host "=========================================="
Write-Host "  Configuración Completada" -ForegroundColor Green
Write-Host "=========================================="
Write-Host ""
