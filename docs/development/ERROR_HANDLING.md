# SANTIAGO CODE — ERROR HANDLING PROTOCOL

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/development/ERROR_HANDLING.md`

---

## 1. Clasificación y Propagación

Toda función interna que interactúe con el host de manera física o lógica debe propagar los errores envolviéndolos (wrapping) para conservar el contexto semántico de la llamada original:

```go
return fmt.Errorf("santiago: invalid workspace: %w", err)
```

Los mensajes de error deben ser descriptivos pero defensivos; no se revelarán nombres de rutas del host, claves lógicas ni detalles del enclave Vault en las trazas de error expuestas a la interfaz de usuario.

## 2. Alineación con CODES.md

Cada fallo capturado debe mapearse contra el catálogo de códigos estáticos del sistema en `CODES.md`:
* **`SC-SYS-001` (FAILURE)**: Errores imprevistos de llamadas del sistema operativo.
* **`SC-SYS-003` (UNKNOWN)**: Pérdidas de consistencia de datos o timeouts.
* **`SC-SEC-003` (FAIL_CLOSED)**: Detención del sistema por brechas de seguridad o de tokens locales.

## 3. Reglas de Invariantes ante Fallos

El sistema aplica tres principios lógicos inmutables para impedir falsas aserciones de éxito durante condiciones de error en el host:

```text
FAILURE ≠ SUCCESS
```
```text
UNKNOWN ≠ SUCCESS
```
```text
SECURITY FAILURE ≠ RECOVERED SUCCESS
```

Cualquier error de inicialización o falta de autenticación en los sockets locales provocará de inmediato el comportamiento fail-closed del micro-daemon involucrado, cancelando cualquier operación de escritura pendiente en disco.
