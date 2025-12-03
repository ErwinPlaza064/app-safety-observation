# 📬 Scripts de Queue Worker

Scripts para gestión del procesador de colas de Laravel.
**Compatible con XAMPP (desarrollo) y Windows Server + IIS (producción)**

## 🎯 ¿Por qué necesitas esto?

Cuando `QUEUE_CONNECTION=database` en tu `.env`, Laravel guarda los trabajos (como envío de correos) en la base de datos. Necesitas un **worker** que procese estos trabajos.

## 📋 Archivos

| Script                   | Uso                                                    |
| ------------------------ | ------------------------------------------------------ |
| `install-queue-task.ps1` | **⭐ Principal** - Instala tarea programada de Windows |
| `start-queue-worker.ps1` | Script del worker con reinicio automático              |
| `start-queue-worker.bat` | Inicio rápido para desarrollo                          |
| `queue-config.json`      | Configuración generada automáticamente                 |

---

## 🚀 Instalación Rápida

### Desarrollo (XAMPP)

El worker ya se inicia automáticamente con VS Code (configurado en `tasks.json`).

Si necesitas iniciarlo manualmente:

```powershell
.\start-queue-worker.bat
```

### Producción (Windows Server + IIS)

**1. Abre PowerShell como Administrador**

**2. Navega a la carpeta de scripts:**

```powershell
cd C:\inetpub\wwwroot\safety-observation\scripts\queue
```

**3. Ejecuta el instalador:**

```powershell
.\install-queue-task.ps1
```

**4. ¡Listo!** El worker:

-   Se inicia automáticamente con Windows
-   Se reinicia si falla
-   Corre como servicio del sistema (SYSTEM)

---

## 🔧 Opciones Avanzadas

### Especificar rutas manualmente

Si el instalador no detecta las rutas automáticamente:

```powershell
.\install-queue-task.ps1 -ProjectPath "C:\inetpub\wwwroot\safety-observation" -PhpPath "C:\php\php.exe"
```

---

## 📊 Comandos Útiles

### Ver estado de la tarea

```powershell
Get-ScheduledTask -TaskName "SafetyObservation-QueueWorker"
```

### Iniciar manualmente

```powershell
Start-ScheduledTask -TaskName "SafetyObservation-QueueWorker"
```

### Detener

```powershell
Stop-ScheduledTask -TaskName "SafetyObservation-QueueWorker"
```

### Eliminar tarea

```powershell
Unregister-ScheduledTask -TaskName "SafetyObservation-QueueWorker" -Confirm:$false
```

### Ver procesos PHP activos

```powershell
Get-Process php -ErrorAction SilentlyContinue | Format-Table Id, CPU, WorkingSet
```

### Ver logs de Laravel

```powershell
Get-Content ..\..\storage\logs\laravel.log -Wait -Tail 30
```

---

## 🔍 Verificar que funciona

1. Crea una observación de prueba
2. Espera a que EHS la revise
3. El empleado debería recibir el correo

Revisa los logs si hay problemas:

```powershell
Get-Content ..\..\storage\logs\laravel.log -Tail 50 | Select-String "mail|queue|error"
```

---

## 💡 Alternativa: Sin Queue Worker

Si no quieres manejar workers, cambia en `.env`:

```env
QUEUE_CONNECTION=sync
```

**Pros:** No necesitas worker
**Contras:** La página tarda más al enviar correos

---

## 🛠️ Troubleshooting

### El worker no inicia

1. Verifica que PHP esté en la ruta correcta
2. Ejecuta manualmente para ver errores:
    ```powershell
    php artisan queue:work --verbose
    ```

### Los correos no se envían

1. Verifica `QUEUE_CONNECTION=database` en `.env`
2. Verifica las credenciales de correo en `.env`
3. Revisa la tabla `jobs` en la base de datos
4. Revisa `failed_jobs` para errores

### La tarea no se ejecuta al reiniciar

1. Verifica que se creó como SYSTEM:
    ```powershell
    Get-ScheduledTask -TaskName "SafetyObservation-QueueWorker" | Select-Object -ExpandProperty Principal
    ```
2. Re-ejecuta `install-queue-task.ps1` como Administrador
