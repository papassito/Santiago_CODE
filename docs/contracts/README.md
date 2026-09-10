# SANTIAGO CODE — SPECIALIZED CONTRACTS

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/contracts/README.md`

---

## 1. Propósito de los Contratos Especializados

Los contratos especializados detallan las obligaciones, capacidades y límites para dominios específicos del sistema, facilitando una validación estricta y determinista de la ejecución del software.

El alcance de cada contrato especializado se delimita de la siguiente manera:
* **`AGENT_CONTRACT.md`**: Delimita el ciclo de vida, permisos e interacción del Agent Engine con herramientas e interfaces de usuario.
* **`WORKSPACE_CONTRACT.md`**: Define las fronteras de contención del sistema de archivos, normalización de rutas y mitigación de symlinks.
* **`TOOL_CONTRACT.md`**: Regula las capacidades operativas y de ejecución local del Runner Daemon y terminales pseudo-PTY.
* **`AI_PROVIDER_CONTRACT.md`**: Especifica las abstracciones y el desacoplamiento de la inferencia local y tratamiento de información confidencial.

---

## 2. Jerarquía Contractual

Todos los documentos de este subdirectorio derivan directamente del contrato maestro de la raíz (`CONTRACTS.md`) y están subordinados a él.

```text
CONTRACTS.md
      ↓
SPECIALIZED CONTRACTS (AGENT, WORKSPACE, TOOL, AI_PROVIDER)
```

### Reglas Fundamentales:
* **Especialización**: Un contrato especializado puede profundizar en aserciones y condiciones de su dominio.
* **No Contradicción**: Un contrato especializado no puede reducir, sustituir ni contradecir las garantías, controles y principios de seguridad definidos en la raíz.

```text
SPECIALIZED CONTRACT MAY SPECIALIZE, BUT MAY NOT CONTRADICT
```
