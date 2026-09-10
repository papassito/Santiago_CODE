# SANTIAGO CODE — PHASES GOVERNANCE

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `phases/README.md`

---

## 1. Propósito del Sistema de Fases

El desarrollo, despliegue y validación de las capacidades de **SANTIAGO CODE** se organiza de manera lógica y secuencial mediante Fases de Ejecución controladas de forma empírica. Cada fase representa un hito de madurez técnica que debe ser certificado con evidencia antes de habilitar hitos subsiguientes.

---

## 2. Límites y Relación de Autoridad

El sistema de fases es un mecanismo organizativo de control de entrega técnica. No constituye de ninguna forma una autoridad normativa paralela capaz de contradecir o mitigar las reglas definidas por el baseline maestro de la raíz.

```text
PHASE ≠ PARALLEL AUTHORITY
```

Ninguna directiva o requerimiento de una fase puede relajar las políticas de seguridad, anular los contratos del workspace, o habilitar la escritura de código sin validación estática previa.

## 3. Criterios de Transición y Bloqueo

La progresión de una fase a otra requiere la compleción y firma de todos los criterios de salida documentados.

Si se detecta cualquier contradicción normativa no resuelta en el código, el estado general de la fase en ejecución se clasificará como **BLOCKED**, cancelando la habilitación de tareas posteriores.

```text
CONTRADICTION DETECTED / MISSING EVIDENCE ──► PHASE STATUS = BLOCKED
```
