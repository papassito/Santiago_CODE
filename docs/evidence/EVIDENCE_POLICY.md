# SANTIAGO CODE — EVIDENCE POLICY

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/evidence/EVIDENCE_POLICY.md`

---

## 1. Captura e Integridad de la Evidencia

Toda evidencia recolectada por el **Evidence Engine** durante la ejecución de tareas de compilación o pruebas locales se serializa en un formato asíncrono y estructurado (JSON). Debe incluir marcas de tiempo deterministas, el comando de sistema ejecutado, la salida cruda de error y el hash criptográfico SHA-256 del código fuente involucrado.

La conservación de la evidencia se mantendrá acotada a la duración de la sesión de validación; cualquier alteración del workspace o manipulación manual del código fuente por el operador invalidará de manera automática las aserciones previas, exigiendo la recomputación de las pruebas en la PTY.

---

## 2. Coincidencia de Alcance (Evidence Scope)

La validez de la evidencia técnica se acota rígidamente al alcance de su verificación específica:

```text
EVIDENCE SCOPE = CLAIM SCOPE
```

### Reglas de Suficiencia:
* **Prohibición de Certificación Global**: Que una suite de pruebas unitarias pase con éxito no autoriza a certificar que todo el sistema de seguridad es invulnerable. La evidencia solo demuestra aquello que realmente evalúa.
* **Tratamiento de Resultados Parciales**: Si una operación privilegiada se interrumpe o falla en alguna de sus aserciones locales, el estado del sistema se clasifica obligatoriamente como `SC-SYS-002` (**PARTIAL**) o `SC-SYS-001` (**FAILURE**).
* **Caducidad por Modificación**: La evidencia de compilación o testeo tiene una vigencia temporal en memoria. Si el sistema de archivos del workspace sufre alguna modificación, la evidencia previa queda automáticamente invalidada, requiriendo una nueva ejecución del Runner Daemon (`:34822`).

## 3. Exclusión de Datos Sensibles

La recolección de evidencia nunca debe vulnerar el baseline de secretos. Los metadatos de evidencia se procesan previamente en `internal/security` para anonimizar nombres de usuario del sistema operativo local, credenciales de red o variables de entorno confidenciales.
