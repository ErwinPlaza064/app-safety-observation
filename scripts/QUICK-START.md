# 🚀 Accesos Rápidos - Safety Observation

Este documento proporciona enlaces rápidos a los scripts y documentación más utilizados.

## 📬 Queue Worker (Desarrollo Local)

### Iniciar Worker

```powershell
# Opción 1: Batch (Doble click)
scripts\queue\start-queue-worker.bat

# Opción 2: PowerShell
.\scripts\queue\start-queue-worker.ps1
```

### Configurar inicio automático

```powershell
.\scripts\queue\install-queue-task.ps1
```

---

## 🚀 Deployment (Producción)

### Verificar sistema

```powershell
.\scripts\deployment\verify-system.ps1
```

### Desplegar

```powershell
.\scripts\deployment\deploy.ps1
```

### Rollback

```powershell
.\scripts\deployment\rollback.ps1
```

---

## 📊 Monitoreo

### Ver estado del sistema

```powershell
.\scripts\monitoring\monitor.ps1
```

---

## ⏰ Task Scheduler

### Configurar tareas programadas

```powershell
.\scripts\scheduler\setup-scheduler.ps1
```

---

## 📚 Documentación

-   [**Guía del Queue Worker**](docs/QUEUE-WORKER-GUIA.md)
-   [**Solución de problemas de correo**](docs/SOLUCION_CORREO_OUTLOOK.md)
-   [**Scripts disponibles**](scripts/README.md)
-   [**Deployment en IIS**](docs/DEPLOYMENT-IIS.md) _(si existe)_

---

## 🎯 Comandos útiles de Laravel

### Desarrollo

```bash
# Iniciar servidor de desarrollo
php artisan serve --host=0.0.0.0

# Compilar assets
npm run dev

# Ver rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Queue

```bash
# Ver trabajos pendientes
php artisan queue:monitor

# Procesar un trabajo
php artisan queue:work --once

# Limpiar trabajos fallidos
php artisan queue:flush
```

### Base de datos

```bash
# Migrar
php artisan migrate

# Rollback última migración
php artisan migrate:rollback

# Refrescar BD y seeders
php artisan migrate:fresh --seed
```

---

## 🔗 Links útiles

-   **Aplicación local**: http://localhost:8000
-   **Aplicación red local**: https://10.110.100.84
-   **phpMyAdmin**: http://localhost/phpmyadmin
-   **Logs**: `storage/logs/laravel.log`

---

**Última actualización**: Diciembre 2025
