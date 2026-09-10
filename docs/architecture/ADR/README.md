# SANTIAGO CODE — ARCHITECTURAL DECISION RECORDS (ADR)

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/architecture/ADR/README.md`

---

## 1. Propósito de ADR

Este directorio sirve como registro histórico y técnico de las decisiones de diseño arquitectónico de **SANTIAGO CODE**. Permite trazar por qué se adoptaron ciertas soluciones técnicas frente a alternativas posibles.

Corresponde crear una ADR cuando se deba registrar una decisión de diseño de sistemas que altere de manera sustancial la topología de los componentes, sus adaptadores, puertos o mecanismos de persistencia local.

---

## 2. Relación con la Arquitectura Autoritativa

Las decisiones de arquitectura documentadas en este directorio se encuentran permanentemente subordinadas a los contratos de la raíz del sistema.

```text
ADR ≠ AUTHORITY ABOVE CONTRACT
```

Una ADR puede registrar y formalizar la implementación de una decisión autorizada, pero bajo ninguna circunstancia puede eludir, mitigar o invalidar un contrato o control de seguridad maestro.

## 3. Estados Permitidos de una ADR

Toda ADR creada en este directorio debe declarar explícitamente uno de los siguientes estados:
* **DRAFT**: Registro en fase de redacción preliminar.
* **PROPOSED**: Decisión planteada formalmente para evaluación.
* **ACCEPTED**: Decisión válida y actualmente en vigor en la arquitectura del sistema.
* **SUPERSEDED**: Decisión reemplazada por una ADR posterior.
* **REJECTED**: Alternativa rechazada tras evaluación de gobernanza.
* **DEPRECATED**: Decisión en proceso de retiro de la arquitectura activa.
* **ARCHIVED**: Registro histórico conservado únicamente con fines de auditoría.
