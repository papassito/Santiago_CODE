# SANTIAGO CODE — TRACEABILITY MATRIX

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/governance/TRACEABILITY.md`

---

## 1. Estructura de la Cadena de Trazabilidad

Para certificar la integridad del sistema, **SANTIAGO CODE** implementa un mapeo unívoco y estructurado que conecta cada directriz normativa de la raíz con la evidencia empírica de ejecución real:

```text
CONTRATO (ID) ──► REQUISITO (ID) ──► CÓDIGO (internal/*) ──► PRUEBA (go test) ──► EVIDENCIA ──► ESTADO
```

## 2. Mapeo de Identificadores Normativos

| Contrato Maestro ID | Requisito ID | Referencia de Implementación | Suite de Pruebas | Código de Evidencia | Estado de Verificación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ppxkr1`** (Regla de Autoridad) | REQ-GOV-001 | `internal/governance` | `tests/integration_test.go` | `Exit Code 0 (go test)` | `SC-VER-002` (NOT_VERIFIED) |
| **`atop63`** (Mutation Contract) | REQ-FUNC-003 | `internal/filesystem` | `tests/integration_test.go` | `PTY sandboxed stdout` | `SC-VER-002` (NOT_VERIFIED) |
| **`ijv6wb`** (Workspace Boundary) | REQ-SEC-003 | `internal/security` | `tests/integration_test.go` | `Security log entries` | `SC-VER-002` (NOT_VERIFIED) |
| **`yve89u`** (Evidence Policy) | REQ-FUNC-005 | `internal/evidence` | `tests/integration_test.go` | `Evidence metadata JSON` | `SC-VER-002` (NOT_VERIFIED) |
| **`4ftgo9`** (AI Output Neutral) | REQ-AI-001 | `internal/ai` | `tests/integration_test.go` | `AST Guardrail test logs` | `SC-VER-002` (NOT_VERIFIED) |
| **`95w7aa`** (Modificación Ctrl) | REQ-GOV-002 | `internal/governance` | `tests/integration_test.go` | `Audit trail verification` | `SC-VER-002` (NOT_VERIFIED) |

---

## 3. Limitación Normativa

La mera existencia de un registro de mapeo en esta matriz de trazabilidad documenta una correspondencia estructural del sistema. No constituye por sí misma una prueba de cumplimiento del requisito de software.

El estado formal `SC-VER-001` (**VERIFIED**) solo se considerará válido cuando la prueba de integración unitaria correspondiente sea ejecutada por el Runner local y retorne de manera satisfactoria evidencia observable en el log de auditoría.
