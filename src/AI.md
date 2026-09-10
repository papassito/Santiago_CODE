# SANTIAGO CODE — AI

**Estado:** ARCHITECTURAL CONTRACT

---

## 1. Regla fundamental

```text
AI OUTPUT ≠ FACT
```
La inferencia de un modelo es un borrador o propuesta no confiable hasta que sea validada contra las pruebas y los contratos del sistema.

---

## 2. Clasificación de Contexto

Antes de procesar información, se debe clasificar el nivel de seguridad:
* `PUBLIC`
* `INTERNAL`
* `CONFIDENTIAL`
* `SECRET` (Este nivel **nunca** abandonará el enjambre de daemons en `localhost`).

---

## 3. Flujo de Validación de Inferencia

```text
AI RESPONSE → CONTRACT CHECK → SECURITY CHECK → EVIDENCE CHECK → OPTIONAL EXECUTION
```