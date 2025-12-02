# 📜 Scripts de Safety Observation

Esta carpeta contiene todos los scripts de automatización y mantenimiento del sistema, organizados por categoría.

## 📁 Estructura de Carpetas

### 🚀 `/deployment`

Scripts para despliegue en producción (IIS)

-   `deploy.ps1` - Deployment automatizado
-   `rollback.ps1` - Rollback a versión anterior
-   `verify-system.ps1` - Verificación de requisitos del sistema

### 📬 `/queue`

Scripts para gestión de colas de Laravel

-   `start-queue-worker.ps1` - Worker de colas (PowerShell)
-   `start-queue-worker.bat` - Worker de colas (Batch - doble click)
-   `install-queue-task.ps1` - Instalador de tarea programada
-   `setup-queue-worker.ps1` - Configuración avanzada del worker

### 📊 `/monitoring`

Scripts de monitoreo del sistema

-   `monitor.ps1` - Monitor de estado de la aplicación

### ⏰ `/scheduler`

Scripts para configuración del Task Scheduler de Laravel

-   `setup-scheduler.ps1` - Configuración del scheduler en Windows

## 🎯 Uso Rápido

### Iniciar Queue Worker (Desarrollo)

```bash
# Opción 1: PowerShell
.\scripts\queue\start-queue-worker.ps1

# Opción 2: Doble click (Windows)
# Navega a scripts\queue\ y haz doble click en start-queue-worker.bat
```

### Configurar inicio automático del Queue Worker

```bash
.\scripts\queue\install-queue-task.ps1
```

### Deployment a producción

```bash
.\scripts\deployment\verify-system.ps1
.\scripts\deployment\deploy.ps1
```

### Rollback

```bash
.\scripts\deployment\rollback.ps1
```

## 📚 Documentación Adicional

Ver carpeta `/docs` para guías detalladas:

-   `QUEUE-WORKER-GUIA.md` - Guía completa del Queue Worker
-   `SOLUCION_CORREO_OUTLOOK.md` - Solución de problemas de correo

## ⚠️ Notas Importantes

-   Los scripts de deployment requieren **permisos de administrador**
-   El queue worker es necesario si `QUEUE_CONNECTION=database` en `.env`
-   Para desarrollo local, considera usar `QUEUE_CONNECTION=sync`
