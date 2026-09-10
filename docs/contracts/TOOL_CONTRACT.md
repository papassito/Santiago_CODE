# TOOL CONTRACT

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/contracts/TOOL_CONTRACT.md`

---

## 1. Definición y Registro de Herramientas

Las herramientas (Tools) son capacidades operativas e infraestructura ejecutable integradas o expuestas por el sistema, tales como compiladores (`go build`), frameworks de pruebas (`go test`), analizadores estáticos de código y terminales pseudo-PTY controladas por el Runner Daemon (`:34822`).

Toda herramienta disponible en el host debe estar explícitamente registrada y clasificada en el Tool Engine bajo políticas estrictas de descubrimiento y alcance operativo de sus variables de entorno asociadas.

---

## 2. Capacidad vs Autoridad

Las herramientas facilitan el procesamiento de datos y la recolección de métricas lógicas de los archivos. No constituyen en ningún escenario autoridad sobre las reglas de la plataforma.

```text
TOOL ≠ AUTHORITY
```

Ninguna herramienta del sistema tiene autorización para ampliar sus propios permisos de ejecución, omitir verificaciones de seguridad, o modificar las directivas inmutables de los contratos de la raíz.

## 3. Clasificación de Resultados de Ejecución

Toda invocación de herramientas debe retornar una salida estructurada y un código de estado representable bajo el vocabulario de `CODES.md`:
* **`SC-SYS-000` (SUCCESS)**: Operación completada satisfactoriamente con código de salida cero.
* **`SC-SYS-001` (FAILURE)**: La herramienta devolvió un código de error o una interrupción no recuperable.
* **`SC-SYS-002` (PARTIAL)**: La ejecución arrojó un éxito parcial (ej. tests pasados pero con warnings).
* **`SC-SYS-003` (UNKNOWN)**: El estado real no pudo determinarse (ej. pérdida de comunicación de socket o timeout).

### Regla de Control de Éxito:

El sistema tiene estrictamente prohibido asumir de forma implícita el éxito ante un resultado parcial, desconocido o interrumpido.

```text
UNKNOWN ≠ SUCCESS
```
