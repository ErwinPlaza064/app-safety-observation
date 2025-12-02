# 📊 Scripts de Monitoreo

Scripts para supervisar el estado y rendimiento de la aplicación.

## 📋 Archivos

### `monitor.ps1`

Monitorea el estado de la aplicación y sus componentes:

-   Estado del servidor web
-   Conexión a base de datos
-   Queue workers activos
-   Espacio en disco
-   Uso de memoria
-   Logs de errores recientes

**Uso:**

```powershell
.\monitor.ps1
```

## 🔄 Monitoreo continuo

Para monitoreo en tiempo real:

```powershell
while ($true) { Clear-Host; .\monitor.ps1; Start-Sleep -Seconds 30 }
```

## 📊 Métricas monitoreadas

-   ✅ Estado de IIS/Apache
-   ✅ Conectividad MySQL
-   ✅ Workers de cola activos
-   ✅ Errores en logs
-   ✅ Uso de recursos

## 🚨 Alertas

El script muestra advertencias cuando:

-   El servidor web no responde
-   No hay conexión a la base de datos
-   No hay workers procesando la cola
-   Espacio en disco bajo (<10%)
-   Memoria alta (>80%)
