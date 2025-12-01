# WASION Safety Observer

<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
  </a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11">
    <img src="https://img.shields.io/badge/Inertia.js-React-8956FF?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

## 📋 Descripción

**WASION Safety Observer** es una aplicación web integral diseñada para la gestión de seguridad industrial (EHS). Permite a los empleados reportar actos y condiciones inseguras en tiempo real, mientras proporciona a la gerencia herramientas analíticas para la toma de decisiones.

El sistema está construido con una arquitectura moderna utilizando **Laravel 11** como API backend y **React** (vía Inertia.js) para una experiencia de usuario fluida y reactiva.

## 🚀 Características Principales

### 👷 Para Empleados

-   **Reporte de Observaciones:** Formulario multi-pasos intuitivo para registrar actos inseguros, condiciones inseguras o actos seguros.
-   **Autoguardado Inteligente:** Sistema de persistencia automática (drafts) que guarda el progreso cada 30 segundos o al detener la escritura, permitiendo retomar el reporte más tarde incluso tras recargar la página.
-   **Evidencia Fotográfica:** Carga múltiple de imágenes para respaldar los reportes.
-   **Historial Personal:** Visualización de estatus de reportes propios (Abiertos/Cerrados).

### 📊 Para Gerentes EHS

-   **Dashboard Ejecutivo:** Vista centralizada con KPIs en tiempo real (Tasa de resolución, Reincidencia, Total del mes).
-   **Análisis de Datos:** Gráficas de distribución por planta y top de categorías críticas.
-   **Gestión de Reportes:** Tabla detallada de observaciones recientes con modales de vista rápida.
-   **Exportación:** Generación de reportes en **PDF** y **CSV** (Excel) con un solo clic.

### 🛡️ Para Super Administradores

-   **Gestión de Usuarios:** CRUD completo de usuarios con asignación de roles (Empleado, EHS Manager, Super Admin).
-   **Control Total:** Capacidad de eliminar o editar cualquier registro del sistema.

## 🛠️ Tecnologías Utilizadas

-   **Backend:** Laravel 11, PHP 8.2+
-   **Frontend:** React 18, Inertia.js
-   **Estilos:** Tailwind CSS
-   **Base de Datos:** MySQL / MariaDB
-   **Paquetes Clave:**
    -   `maatwebsite/excel`: Exportación a Excel/CSV.
    -   `barryvdh/laravel-dompdf`: Generación de reportes PDF.
    -   `react-icons`: Iconografía dinámica.

## ⚙️ Instalación y Configuración

Sigue estos pasos para desplegar el proyecto en tu entorno local:

1.  **Clonar el repositorio**

    ```bash
    git clone [https://github.com/tu-usuario/safety-observation.git](https://github.com/tu-usuario/safety-observation.git)
    cd safety-observation
    ```

2.  **Instalar dependencias de PHP**

    ```bash
    composer install
    ```

3.  **Instalar dependencias de JavaScript**

    ```bash
    npm install
    ```

4.  **Configurar entorno**
    Copia el archivo de ejemplo y genera la clave de la aplicación:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Configura tus credenciales de base de datos en el archivo `.env`._

5.  **Crear enlace simbólico para imágenes**
    Este paso es crucial para visualizar las evidencias fotográficas:

    ```bash
    php artisan storage:link
    ```

6.  **Ejecutar migraciones**

    ```bash
    php artisan migrate --seed
    ```

7.  **Habilitar extensión GD (Para Excel)**
    Asegúrate de tener descomentada la línea `extension=gd` en tu `php.ini`.

## ▶️ Ejecución

Para correr el proyecto en desarrollo, necesitas dos terminales:

**Terminal 1 (Laravel):**

```bash
php artisan serve
# O para acceso en red local:
php artisan serve --host=0.0.0.0 --port=8000
```

**Terminal 2 (Vite):**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8000`.

## 🏭 Deployment en Producción (IIS)

Para desplegar la aplicación en un servidor Windows con IIS:

### 📚 Documentación Completa

Consulta **[DEPLOYMENT-IIS.md](DEPLOYMENT-IIS.md)** para la guía completa de instalación en IIS.

### ⚡ Quick Start

1. **Verificar requisitos del sistema:**

    ```powershell
    .\verify-system.ps1
    ```

2. **Deployment automático:**

    ```powershell
    .\deploy.ps1
    ```

3. **Checklist pre-deployment:**
   Ver [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

### 📦 Archivos de Deployment Incluidos

-   `public/web.config` - Configuración de IIS con URL Rewrite
-   `.env.production.example` - Plantilla de variables de entorno para producción
-   `deploy.ps1` - Script automatizado de deployment
-   `rollback.ps1` - Script de rollback en caso de problemas
-   `verify-system.ps1` - Verificación de requisitos del sistema
-   `php-production.ini` - Configuración recomendada de PHP para producción

### 🔧 Requisitos Mínimos

-   Windows Server 2016+ o Windows 10/11 Pro
-   IIS 10.0+ con URL Rewrite Module
-   PHP 8.2+
-   MySQL 8.0+
-   Node.js 18+
-   4 GB RAM (recomendado: 8 GB)

## 🔐 Usuarios por Defecto

Después de ejecutar las migraciones con seed, tendrás acceso a:

| Rol         | Email               | Contraseña |
| ----------- | ------------------- | ---------- |
| Super Admin | admin@wasion.com    | password   |
| EHS Manager | manager@wasion.com  | password   |
| Empleado    | employee@wasion.com | password   |

**⚠️ IMPORTANTE:** Cambia estas contraseñas en producción.

## 🧪 Testing

```bash
php artisan test
```
