# SANTIAGO CODE — WORKSPACE CONTRACT

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/contracts/WORKSPACE_CONTRACT.md`

---

## 1. Definición del Workspace Autorizado

El workspace constituye el límite espacial de la máquina host del desarrollador en el que **SANTIAGO CODE** está autorizado a realizar búsquedas, lecturas y modificaciones. 

La ruta raíz del workspace debe establecerse de manera explícita y unívoca al arrancar el agente. El sistema no asumirá bajo ninguna justificación que el directorio de trabajo actual (`PWD`) constituye un workspace autorizado por defecto.

---

## 2. Resolución y Validación de Rutas

Para prevenir ataques lógicos o de salto de directorio, toda operación del sistema de archivos debe validar las rutas antes de proceder a la acción física:

```text id="workspace-route-pipeline"
RUTA SOLICITADA ──► NORMALIZAR ──► ABSOLUTA ──► VERIFICAR EN WORKSPACE ──► EJECUTAR
```

### Reglas de Contención:
* **Validación de Symlinks/Reparse Points**: Si una operación involucra un enlace simbólico, junction o reparse point, se debe validar que el destino final absoluto resuelva dentro del workspace autorizado.
* **Tratamiento de Rutas Fuera de Límite**: Cualquier intento de lectura o escritura fuera de la frontera física del workspace será rechazado inmediatamente.

```text
TARGET ∈ AUTHORIZED WORKSPACE
```

Si el destino de la ruta no pertenece al workspace o no se puede verificar con certeza matemática:

```text
DENY
```
