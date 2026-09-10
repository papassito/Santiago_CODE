# SANTIAGO CODE — LOGGING STANDARDS

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/development/LOGGING.md`

---

## 1. Propósito y Estructura de Logs

**SANTIAGO CODE** utiliza un logging estrictamente estructurado en formato JSON a través del paquete `internal/security`. Esto asegura que cada evento del enjambre de daemons sea fácilmente parseado de forma automatizada por el Audit Engine.

Cada entrada de log debe contener campos clave correlacionados: marcas de tiempo, identificador del daemon, severidad, mensaje descriptivo, componente emisor y el código semántico de estado asociado.

---

## 2. Filtrado Automático de Datos Sensibles

Para garantizar la postura de seguridad, el formateador de log aplica un middleware de filtrado de tokens. Cualquier clave API que inicie con firmas comunes o secuencias de entropía criptográfica conocidas será interceptada y formateada como:

```text
sk_live_************************7f2a
```

## 3. Limitación de Veracidad de Logs

Los logs del sistema capturan la secuencia cronológica de eventos lógicos y llamadas de funciones, pero su mera presencia no constituye una prueba infalible del estado real del host.

```text
LOG ENTRY ≠ AUTOMATIC PROOF
```

### Niveles de Severidad de Logs:
* **`INFO`**: Flujos operativos y de inicialización del enjambre.
* **`WARN`**: Latencias que exceden el SLA P95 o accesos restringidos a archivos.
* **`ERROR`**: Códigos de error de compilación o fallos de conexión RPC locales.
* **`FATAL`**: Transgresiones de límites de workspace o caídas de daemons críticos que provocan el comportamiento fail-closed del sistema.
