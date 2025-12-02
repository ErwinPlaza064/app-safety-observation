# 🚀 Scripts de Deployment

Scripts para despliegue de la aplicación en entornos de producción (IIS/Windows Server).

## 📋 Archivos

### `verify-system.ps1`

Verifica que el sistema cumpla con todos los requisitos necesarios:

-   IIS instalado y configurado
-   PHP 8.2+
-   MySQL
-   Extensiones de PHP requeridas
-   URL Rewrite Module

**Uso:**

```powershell
.\verify-system.ps1
```

### `deploy.ps1`

Script de deployment automatizado que:

-   Crea backup de la versión actual
-   Actualiza código desde Git
-   Instala dependencias (Composer y NPM)
-   Ejecuta migraciones
-   Compila assets de producción
-   Configura permisos

**Uso:**

```powershell
.\deploy.ps1
```

### `rollback.ps1`

Revierte el deployment a la versión anterior en caso de problemas.

**Uso:**

```powershell
.\rollback.ps1
```

## ⚠️ Requisitos

-   Ejecutar como **Administrador**
-   Tener configurado `web.config` para IIS
-   Backup de base de datos antes de deployment

## 📚 Documentación relacionada

Ver `/docs/DEPLOYMENT-IIS.md` para guía completa de deployment.
