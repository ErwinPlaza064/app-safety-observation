# 📬 Scripts de Queue Worker

Scripts para gestión del procesador de colas de Laravel.

## 🎯 ¿Por qué necesitas esto?

Cuando `QUEUE_CONNECTION=database` en tu `.env`, Laravel guarda los trabajos (como envío de correos) en la base de datos. Necesitas un **worker** que procese estos trabajos.

## 📋 Archivos

### `start-queue-worker.bat` ⭐ (Recomendado para desarrollo)

Script de inicio rápido para Windows.

**Uso:**

-   Doble click en el archivo
-   Se ejecuta en segundo plano
-   Procesa correos automáticamente

### `start-queue-worker.ps1`

Script PowerShell del worker con reinicio automático.

**Uso:**

```powershell
.\start-queue-worker.ps1
```

### `install-queue-task.ps1`

Configura una tarea programada de Windows para que el worker inicie automáticamente.

**Uso:**

```powershell
.\install-queue-task.ps1
```

**Resultado:**

-   Worker inicia automáticamente al encender Windows
-   No necesitas iniciar manualmente cada vez

### `setup-queue-worker.ps1`

Configuración avanzada para IIS/Producción usando NSSM.

## 🚀 Quick Start

### Opción 1: Manual (Desarrollo)

1. Doble click en `start-queue-worker.bat`
2. ✅ Listo

### Opción 2: Automático (Producción)

1. Ejecuta `install-queue-task.ps1`
2. Sigue las instrucciones
3. El worker iniciará con Windows

## 🔍 Verificar que está corriendo

```powershell
Get-Process php | Where-Object {$_.Path -like "*xampp*"}
```

## 🛑 Detener el worker

```powershell
Get-Process php | Where-Object {$_.CommandLine -like "*queue:work*"} | Stop-Process -Force
```

## 📝 Ver logs

```powershell
Get-Content ..\..\storage\logs\laravel.log -Wait -Tail 20
```

## 💡 Alternativa: Sin worker

Si no quieres usar workers, cambia en `.env`:

```
QUEUE_CONNECTION=sync
```

Los correos se enviarán inmediatamente sin necesidad de worker.

## 📚 Documentación

Ver `/docs/QUEUE-WORKER-GUIA.md` para más detalles.
