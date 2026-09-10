# SANTIAGO CODE — INSTALLATION GUIDE

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/operations/INSTALLATION.md`

---

## 1. Prerrequisitos de la Máquina Host

Para desplegar el sistema local de **SANTIAGO CODE** de forma correcta, se requiere asegurar que los siguientes binarios estén disponibles en el host del desarrollador:
* Entorno de ejecución de Go 1.22 o superior.
* Herramienta Git local (instalada y expuesta en la variable de entorno `PATH`).

Se prohibe estrictamente simular la presencia o inventar instaladores de sistema, servicios de red de terceros, bases de datos o infraestructuras de virtualización ajenas a las dependencias declaradas en el baseline.

---

## 2. Procedimiento de Instalación Local

El despliegue de los daemons locales se realiza directamente clonando el repositorio local y compilando la suite de herramientas estáticas:

```bash
# Compilar la suite de daemons en el host local
go build -o ./bin/santiago ./cmd/santiago
```

## 3. Validación y Evidencia de Instalación

La finalización exitosa del procedimiento de instalación exige que el desarrollador invoque la verificación de salud del sistema mediante la ejecución del script de PowerShell `create_folders.ps1`. La validación comprueba de forma empírica la creación correcta de los directorios de gobernanza en el host, registrando el código de éxito `SC-SYS-000` en el Audit Trail.
