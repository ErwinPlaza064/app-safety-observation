# ⏰ Scripts del Task Scheduler

Scripts para configurar tareas programadas de Laravel en Windows.

## 📋 Archivos

### `setup-scheduler.ps1`

Configura el Task Scheduler de Windows para ejecutar comandos programados de Laravel.

**¿Qué hace?**

-   Crea una tarea que ejecuta `php artisan schedule:run` cada minuto
-   Permite programar tareas como:
    -   Limpieza de archivos temporales
    -   Envío de reportes automáticos
    -   Backups programados
    -   Notificaciones periódicas

**Uso:**

```powershell
.\setup-scheduler.ps1
```

## 📅 Tareas programadas disponibles

Define tus tareas en `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Ejemplo: Limpiar logs viejos cada día
    $schedule->command('logs:clean')
             ->daily()
             ->at('02:00');

    // Ejemplo: Backup diario
    $schedule->command('backup:run')
             ->daily()
             ->at('03:00');
}
```

## ✅ Verificar que está configurado

```powershell
Get-ScheduledTask -TaskName "Laravel*"
```

## 🔍 Ver próximas ejecuciones

```powershell
php artisan schedule:list
```

## 📚 Más información

[Laravel Task Scheduling](https://laravel.com/docs/11.x/scheduling)
