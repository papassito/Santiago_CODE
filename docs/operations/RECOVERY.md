# SANTIAGO CODE — RECOVERY PLAN

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/operations/RECOVERY.md`

---

## 1. Escenarios de Caída del Enjambre

Dado que la plataforma se orquesta mediante 4 micro-daemons locales (`:34820 - :34823`), se evalúan dos condiciones principales de fallo de servicio:
* **Pérdida de Conexión de un Daemon No Crítico**: Si el RAG AST Memory (`:34821`) o el Runner Daemon (`:34822`) sufren una caída, el Gateway Router entrará en modo de degradación controlada (`SC-SYS-002`), bloqueando operaciones de mutación de código pero permitiendo la lectura del editor de forma segura.
* **Caída del Enclave Vault (`:34823`)**: Al ser el custodio de los tokens de sesión locales, su interrupción invalida de forma inmediata todas las credenciales activas, deteniendo por completo la orquestación.

Se prohíbe de manera expresa simular o documentar infraestructuras complejas de recuperación como snapshots en la nube, backups automatizados multisitio o redundancia activa que no formen parte del baseline local y de los recursos físicos del host.

---

## 2. Protocolo de Reinicio de Daemons

La recuperación de un servicio caído se realiza localmente orquestando la inicialización en frío desde el Gateway. El sistema re-sincronizará la salud de los procesos en un ciclo cerrado de sondeo de 10 segundos controlado por React en `App.tsx`.

---

## 3. Prohibición de Recuperación de Estado Insegura

Si la detención de un daemon ocurre durante una operación de escritura persistente en disco, la recuperación automática del sistema tiene denegada la recomputación ciega del estado. 

El sistema no asumirá éxito sobre parches de código incompletos. Se exigirá que el desarrollador ejecute de forma manual una validación del estado del repositorio de Git local para certificar la integridad estructural del workspace antes de reactivar el Runner.

```text
UNVERIFIED RECOVERY STATE ──► MANUAL INTEGRITY CHECK REQUIRED
```
