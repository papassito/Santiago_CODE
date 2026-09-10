# SANTIAGO CODE — SPECIALIZED EVIDENCE INDEX

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/evidence/README.md`

---

## 1. Propósito de la Evidencia Técnica

Este subdirectorio contiene las directrices normativas aplicables a la recolección, clasificación, conservación y validación de la evidencia que sustenta las aserciones de conformidad de **SANTIAGO CODE**.

Su función principal es asegurar la neutralidad y auditabilidad del sistema, separando de manera estricta los registros observables en host de las aserciones documentales declarativas.

---

## 2. Separación de Conceptos: Afirmación vs Evidencia

Para garantizar la transparencia del sistema de gobernanza de Santiago, se establece una distinción tajante entre las declaraciones y los resultados verificables:

```text
CLAIM ≠ EVIDENCE
```

* **Afirmación (Claim)**: Declarar en la documentación, logs o respuestas generadas por la IA que una funcionalidad está implementada, un error está resuelto o una suite de pruebas ha pasado con éxito.
* **Evidencia (Evidence)**: Captura real criptográfica de hashes de archivos, códigos de salida lógicos (exit codes) devueltos por la PTY, logs del compilador nativo de Go o salidas de error de la suite de pruebas.

## 3. Estructura de Políticas

* **`EVIDENCE_POLICY.md`**: Detalla los estándares rigurosos de captura, clasificación, descarte de información confidencial y suficiencia de la evidencia para certificar la estabilidad de la plataforma en la máquina host.
