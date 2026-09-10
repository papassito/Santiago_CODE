# SANTIAGO CODE — PERMISSIONS & CAPABILITIES

**Estado:** SECURITY BASELINE / AUTHORITATIVE
**Documento:** `docs/security/PERMISSIONS.md`

---

## 1. Esquema de Capacidades del Sistema

**SANTIAGO CODE** separa rígidamente las acciones lógicas e interacciones físicas con la máquina host mediante un esquema de capacidades independientes:

* **`READ`**: Inspección pasiva del árbol de directorios y contenido estático de archivos del workspace autorizado.
* **`WRITE`**: Persistencia inmutable de parches de código sobre archivos previamente declarados en el baseline del workspace.
* **`DELETE`**: Eliminación o truncamiento físico de archivos en el disco host (capacidad privilegiada que requiere autorización explícita).
* **`EXECUTE`**: Invocación de compiladores locales, linters y suites de pruebas reales a través de la terminal pseudo-PTY del Runner Daemon `:34822`.
* **`ADMINISTRATE`**: Gestión y control de la rotación de llaves, cifrado de Vault local `:34823` y redefinición del catálogo de gobernanza.

---

## 2. Regla de Independencia de Capacidades

De acuerdo con el principio de mínimo privilegio (`SECURITY.md`), disponer de una capacidad lógica no concede de forma automática el acceso a capacidades adyacentes.

```text
READ ≠ WRITE ≠ DELETE ≠ EXECUTE ≠ ADMINISTRATE
```

### Reglas de Control de Privilegios:
* La autorización para analizar código estático (`READ`) no otorga permisos de escritura en el workspace (`WRITE`).
* La capacidad de aplicar parches (`WRITE`) no habilita la ejecución de scripts o binarios de infraestructura (`EXECUTE`).
* La capacidad de compilación (`EXECUTE`) se mantiene confinada dentro de la PTY local y no puede modificar los secretos inyectados en memoria del Vault (`ADMINISTRATE`).

Cualquier intento de salto o elevación de privilegios detectado por la validación de llamadas locales forzará la caída en cadena y el bloqueo fail-closed del micro-daemon involucrado, arrojando código `SC-SEC-006`.
