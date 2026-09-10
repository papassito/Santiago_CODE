# SANTIAGO CODE — CODES

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `CODES.md`

---

## 1. Propósito

Este documento define los códigos canónicos utilizados por **SANTIAGO CODE** para representar estados, resultados, decisiones, errores, evidencias, auditorías y condiciones de ejecución.

Los códigos definidos aquí permiten que los componentes del sistema utilicen un vocabulario común, determinista y auditable.

```text
SAME CONDITION
      ↓
SAME SEMANTIC CODE
```

Los códigos no sustituyen el contexto, la evidencia ni el mensaje descriptivo asociado.

---

## 2. Principios

Todo código deberá ser:

* único dentro de su categoría;
* estable;
* inequívoco;
* legible;
* clasificable;
* auditable;
* independiente de mensajes humanos;
* independiente de proveedores de infraestructura;
* independiente de proveedores o modelos de IA.

Un código no deberá cambiar de significado después de convertirse en parte del baseline autoritativo.

---

## 3. Formato canónico

Los códigos deberán seguir conceptualmente:

```text
SC-<DOMAIN>-<NUMBER>
```

Donde:

```text
SC       = SANTIAGO CODE
DOMAIN   = DOMINIO DEL EVENTO
NUMBER   = IDENTIFICADOR NUMÉRICO
```

Ejemplo:

```text
SC-SEC-001
```

Los números identifican condiciones semánticas.

No deberán reutilizarse para representar condiciones diferentes.

---

## 4. Dominios

Los dominios canónicos serán:

```text
SYS   SYSTEM
AGT   AGENT
GOV   GOVERNANCE
CTR   CONTRACT
REQ   REQUIREMENT
WRK   WORKSPACE
MUT   MUTATION
SEC   SECURITY
PER   PERMISSION
AI    ARTIFICIAL INTELLIGENCE
TOL   TOOL
EXE   EXECUTION
AUD   AUDIT
EVD   EVIDENCE
VER   VERIFICATION
CFG   CONFIGURATION
IO    INPUT / OUTPUT
```

Los dominios especializados podrán añadirse únicamente cuando exista una necesidad semántica real.

---

## 5. Estados generales

### `SC-SYS-000`

```text
SUCCESS
```

La operación terminó satisfactoriamente dentro del alcance evaluado.

---

### `SC-SYS-001`

```text
FAILURE
```

La operación terminó con fallo confirmado.

---

### `SC-SYS-002`

```text
PARTIAL
```

La operación produjo resultados parciales.

No deberá interpretarse como éxito completo.

---

### `SC-SYS-003`

```text
UNKNOWN
```

El estado real no pudo determinarse.

```text
UNKNOWN ≠ SUCCESS
```

---

### `SC-SYS-004`

```text
NOT_APPLICABLE
```

La condición evaluada no resulta aplicable al contexto.

---

### `SC-SYS-005`

```text
NOT_EXECUTED
```

La operación no fue ejecutada.

---

## 6. Agent Codes

### `SC-AGT-001`

```text
OBJECTIVE_ACCEPTED
```

El objetivo fue recibido y reconocido dentro del alcance autorizado.

### `SC-AGT-002`

```text
OBJECTIVE_REJECTED
```

El objetivo fue rechazado por incumplimiento contractual, de seguridad, alcance o autorización.

### `SC-AGT-003`

```text
EXECUTION_STOPPED
```

El ciclo del agente fue detenido.

### `SC-AGT-004`

```text
HUMAN_DECISION_REQUIRED
```

La operación requiere una decisión explícita del operador humano.

### `SC-AGT-005`

```text
SCOPE_UNRESOLVED
```

El alcance necesario para continuar no pudo determinarse de forma segura.

---

## 7. Governance Codes

### `SC-GOV-001`

```text
AUTHORIZED
```

La operación o decisión posee autorización válida dentro de su alcance.

### `SC-GOV-002`

```text
DENIED
```

La operación fue denegada.

### `SC-GOV-003`

```text
AUTHORITY_CONFLICT
```

Existe conflicto entre fuentes de autoridad.

### `SC-GOV-004`

```text
HUMAN_AUTHORITY_REQUIRED
```

La resolución requiere intervención de la autoridad humana.

### `SC-GOV-005`

```text
SILENT_OVERRIDE_DENIED
```

Se detectó un intento de sustituir una autoridad normativa sin decisión explícita.

---

## 8. Contract Codes

### `SC-CTR-001`

```text
CONTRACT_VALID
```

El contrato aplicable fue identificado y es válido dentro de su alcance.

### `SC-CTR-002`

```text
CONTRACT_MISSING
```

No se encontró un contrato obligatorio para la operación.

### `SC-CTR-003`

```text
CONTRACT_CONFLICT
```

Dos reglas contractuales aplicables presentan contradicción.

### `SC-CTR-004`

```text
CONTRACT_VIOLATION
```

La implementación o acción contradice un contrato aplicable.

### `SC-CTR-005`

```text
NON_COMPLIANT
```

El elemento evaluado incumple una autoridad normativa aplicable.

---

## 9. Requirement Codes

### `SC-REQ-001`

```text
IMPLEMENTED
```

Existe una implementación identificable asociada al requisito.

No implica verificación.

### `SC-REQ-002`

```text
PARTIALLY_IMPLEMENTED
```

El requisito posee implementación parcial.

### `SC-REQ-003`

```text
NOT_IMPLEMENTED
```

No existe implementación demostrada del requisito.

### `SC-REQ-004`

```text
REQUIREMENT_CONFLICT
```

El requisito contradice una autoridad superior.

### `SC-REQ-005`

```text
REQUIREMENT_NOT_VERIFIED
```

La implementación puede existir, pero no dispone de evidencia suficiente para establecer cumplimiento verificado.

---

## 10. Workspace Codes

### `SC-WRK-001`

```text
WORKSPACE_VALID
```

El workspace fue identificado y validado.

### `SC-WRK-002`

```text
WORKSPACE_UNKNOWN
```

No pudo establecerse de forma segura el workspace aplicable.

### `SC-WRK-003`

```text
TARGET_INSIDE_WORKSPACE
```

El destino efectivo pertenece al workspace autorizado.

### `SC-WRK-004`

```text
TARGET_OUTSIDE_WORKSPACE
```

El destino efectivo se encuentra fuera del workspace autorizado.

### `SC-WRK-005`

```text
PATH_INVALID
```

La ruta no puede considerarse válida.

### `SC-WRK-006`

```text
PATH_RESOLUTION_FAILED
```

No fue posible resolver de manera segura la ruta efectiva.

### `SC-WRK-007`

```text
WORKSPACE_BOUNDARY_VIOLATION
```

Una operación intentó atravesar o evadir el límite autorizado del workspace.

---

## 11. Mutation Codes

### `SC-MUT-001`

```text
MUTATION_AUTHORIZED
```

La modificación cumple las condiciones contractuales necesarias.

### `SC-MUT-002`

```text
MUTATION_DENIED
```

La modificación fue denegada.

### `SC-MUT-003`

```text
INVALID_TARGET
```

El objetivo de modificación no es válido.

### `SC-MUT-004`

```text
INVALID_ACTION
```

La acción solicitada no está autorizada o no es válida para el objetivo.

### `SC-MUT-005`

```text
WRITE_FAILED
```

La escritura autorizada fue intentada pero no pudo completarse.

### `SC-MUT-006`

```text
DELETE_DENIED
```

La eliminación solicitada no posee autorización suficiente.

---

## 12. Security Codes

### `SC-SEC-001`

```text
SECURITY_CHECK_PASSED
```

El control específico evaluado fue satisfecho.

No constituye certificación global de seguridad.

### `SC-SEC-002`

```text
SECURITY_CHECK_FAILED
```

El control específico evaluado falló.

### `SC-SEC-003`

```text
FAIL_CLOSED
```

La operación fue detenida porque una condición obligatoria no pudo verificarse.

### `SC-SEC-004`

```text
UNTRUSTED_INPUT
```

La entrada deberá tratarse como no confiable.

### `SC-SEC-005`

```text
SECRET_DETECTED
```

Se detectó información clasificada como secreto.

### `SC-SEC-006`

```text
SECRET_EXPOSURE_BLOCKED
```

Se evitó la exposición de un secreto.

### `SC-SEC-007`

```text
PROMPT_INJECTION_DETECTED
```

Se identificó contenido potencialmente destinado a alterar ilegítimamente las instrucciones o autoridad del agente.

### `SC-SEC-008`

```text
SECURITY_CONTROL_UNAVAILABLE
```

Un control obligatorio no se encuentra disponible.

La operación afectada deberá seguir la política fail-closed aplicable.

---

## 13. Permission Codes

### `SC-PER-001`

```text
READ_ALLOWED
```

### `SC-PER-002`

```text
WRITE_ALLOWED
```

### `SC-PER-003`

```text
DELETE_ALLOWED
```

### `SC-PER-004`

```text
EXECUTE_ALLOWED
```

### `SC-PER-005`

```text
ADMIN_ALLOWED
```

### `SC-PER-101`

```text
READ_DENIED
```

### `SC-PER-102`

```text
WRITE_DENIED
```

### `SC-PER-103`

```text
DELETE_DENIED
```

### `SC-PER-104`

```text
EXECUTE_DENIED
```

### `SC-PER-105`

```text
ADMIN_DENIED
```

Las capacidades son independientes.

```text
READ_ALLOWED
      ≠
WRITE_ALLOWED
      ≠
DELETE_ALLOWED
      ≠
EXECUTE_ALLOWED
      ≠
ADMIN_ALLOWED
```

---

## 14. AI Codes

### `SC-AI-001`

```text
AI_OUTPUT_RECEIVED
```

Se recibió una salida de IA.

### `SC-AI-002`

```text
AI_OUTPUT_UNTRUSTED
```

La salida permanece sin verificación.

### `SC-AI-003`

```text
AI_OUTPUT_VALIDATED
```

La parte evaluada de la salida superó los controles específicos aplicables.

No significa que toda la respuesta sea verdadera.

### `SC-AI-004`

```text
AI_PROVIDER_UNAVAILABLE
```

El proveedor configurado no está disponible.

### `SC-AI-005`

```text
AI_REQUEST_DENIED
```

La solicitud al subsistema de IA fue bloqueada por política, seguridad o autorización.

### `SC-AI-006`

```text
AI_PRIVILEGE_ESCALATION_DENIED
```

Una salida o acción derivada de IA intentó adquirir autoridad o privilegios no concedidos.

### `SC-AI-007`

```text
AI_CLAIM_NOT_VERIFIED
```

Una afirmación generada mediante IA carece de evidencia suficiente para ser presentada como resultado verificado.

---

## 15. Tool Codes

### `SC-TOL-001`

```text
TOOL_ALLOWED
```

### `SC-TOL-002`

```text
TOOL_DENIED
```

### `SC-TOL-003`

```text
TOOL_NOT_FOUND
```

### `SC-TOL-004`

```text
TOOL_EXECUTION_FAILED
```

### `SC-TOL-005`

```text
TOOL_RESULT_PARTIAL
```

### `SC-TOL-006`

```text
TOOL_RESULT_UNKNOWN
```

### `SC-TOL-007`

```text
TOOL_SCOPE_VIOLATION
```

La herramienta intentó operar fuera del alcance autorizado.

---

## 16. Execution Codes

### `SC-EXE-001`

```text
EXECUTION_STARTED
```

### `SC-EXE-002`

```text
EXECUTION_SUCCEEDED
```

### `SC-EXE-003`

```text
EXECUTION_FAILED
```

### `SC-EXE-004`

```text
EXECUTION_ABORTED
```

### `SC-EXE-005`

```text
EXECUTION_TIMEOUT
```

### `SC-EXE-006`

```text
EXECUTION_NOT_VERIFIED
```

No existe evidencia suficiente para determinar de forma confiable el resultado final.

---

## 17. Audit Codes

### `SC-AUD-001`

```text
PASS
```

El elemento evaluado satisface el criterio específico auditado.

### `SC-AUD-002`

```text
FAIL
```

El elemento evaluado incumple el criterio específico auditado.

### `SC-AUD-003`

```text
WARNING
```

Se detectó una condición que requiere atención pero no constituye por sí misma incumplimiento demostrado.

### `SC-AUD-004`

```text
NOT_VERIFIED
```

No existe evidencia suficiente para emitir un resultado verificado.

### `SC-AUD-005`

```text
NOT_APPLICABLE
```

El criterio no aplica al objeto evaluado.

### `SC-AUD-006`

```text
AMBIGUITY
```

La especificación o evidencia admite más de una interpretación relevante.

### `SC-AUD-007`

```text
MISALIGNMENT
```

Existe una desalineación entre elementos que debería corregirse.

### `SC-AUD-008`

```text
CONTRADICTION
```

Dos elementos aplicables expresan reglas incompatibles.

---

## 18. Evidence Codes

### `SC-EVD-001`

```text
EVIDENCE_CAPTURED
```

### `SC-EVD-002`

```text
EVIDENCE_VALID
```

La evidencia es válida para el alcance específico evaluado.

### `SC-EVD-003`

```text
EVIDENCE_INSUFFICIENT
```

La evidencia disponible no demuestra completamente la afirmación.

### `SC-EVD-004`

```text
EVIDENCE_MISSING
```

No existe evidencia disponible para la afirmación evaluada.

### `SC-EVD-005`

```text
EVIDENCE_SCOPE_MISMATCH
```

La evidencia presentada no corresponde al alcance de la afirmación.

### `SC-EVD-006`

```text
EVIDENCE_INVALID
```

La evidencia no puede utilizarse como soporte verificable.

---

## 19. Verification Codes

### `SC-VER-001`

```text
VERIFIED
```

La afirmación evaluada dispone de evidencia suficiente y pertinente.

### `SC-VER-002`

```text
NOT_VERIFIED
```

No existe evidencia suficiente para establecer el estado como verificado.

### `SC-VER-003`

```text
VERIFICATION_FAILED
```

La verificación produjo evidencia incompatible con la afirmación evaluada.

### `SC-VER-004`

```text
VERIFICATION_PARTIAL
```

Solo una parte del alcance pudo verificarse.

### `SC-VER-005`

```text
VERIFICATION_NOT_APPLICABLE
```

La verificación no aplica al elemento evaluado.

---

## 20. Configuration Codes

### `SC-CFG-001`

```text
CONFIG_VALID
```

### `SC-CFG-002`

```text
CONFIG_INVALID
```

### `SC-CFG-003`

```text
CONFIG_MISSING
```

### `SC-CFG-004`

```text
CONFIG_VALUE_REJECTED
```

### `SC-CFG-005`

```text
SECRET_IN_CONFIG
```

Se detectó un secreto en una ubicación de configuración donde su presencia no está permitida.

---

## 21. Input / Output Codes

### `SC-IO-001`

```text
INPUT_VALID
```

### `SC-IO-002`

```text
INPUT_INVALID
```

### `SC-IO-003`

```text
INPUT_REJECTED
```

### `SC-IO-004`

```text
OUTPUT_VALID
```

### `SC-IO-005`

```text
OUTPUT_REDACTED
```

### `SC-IO-006`

```text
OUTPUT_BLOCKED
```

---

## 22. Severidad

Los hallazgos podrán clasificarse mediante:

```text
INFO
LOW
MEDIUM
HIGH
CRITICAL
```

### `INFO`

Información sin incumplimiento.

### `LOW`

Desviación menor sin impacto significativo inmediato.

### `MEDIUM`

Problema relevante que afecta comportamiento, mantenibilidad, trazabilidad o controles.

### `HIGH`

Incumplimiento con impacto importante sobre seguridad, integridad, autorización, disponibilidad o comportamiento contractual.

### `CRITICAL`

Incumplimiento capaz de comprometer una frontera fundamental del sistema o permitir comportamiento expresamente prohibido por los contratos.

La severidad no sustituye al código del hallazgo.

---

## 23. Estructura de resultado

Cuando resulte aplicable, un resultado estructurado deberá poder expresar:

```text
CODE
DOMAIN
STATUS
SEVERITY
MESSAGE
SCOPE
EVIDENCE
TIMESTAMP
```

No todos los campos serán obligatorios para todas las operaciones.

El código deberá conservar su significado independientemente del mensaje asociado.

Ejemplo conceptual:

```text
CODE:      SC-WRK-004
STATUS:    DENIED
SEVERITY:  HIGH
MESSAGE:   Target resolves outside authorized workspace.
SCOPE:     requested filesystem operation
EVIDENCE:  resolved path
```

---

## 24. Reglas de uso

Los códigos deberán utilizarse conforme a las siguientes reglas:

```text
ONE CODE
      ↓
ONE SEMANTIC CONDITION
```

```text
UNKNOWN
      ≠
SUCCESS
```

```text
PARTIAL
      ≠
SUCCESS
```

```text
NOT VERIFIED
      ≠
FAIL
```

```text
IMPLEMENTED
      ≠
VERIFIED
```

```text
DENIED
      ≠
FAILED
```

Una operación `DENIED` no necesariamente falló técnicamente.

Puede haber funcionado correctamente al impedir una acción no autorizada.

---

## 25. Códigos y evidencia

Un código de éxito no constituye por sí mismo evidencia suficiente.

```text
SUCCESS CODE
      ≠
PROOF
```

Cuando una afirmación requiera evidencia, el código deberá relacionarse con la evidencia correspondiente.

```text
RESULT CODE
      +
RELEVANT EVIDENCE
      ↓
VERIFIABLE RESULT
```

---

## 26. Códigos y contratos

Los códigos representan estados del sistema.

No modifican contratos.

```text
CODE
      ≠
AUTHORITY
```

Si un código contradice el comportamiento requerido por un contrato, el contrato prevalece.

---

## 27. Extensión del catálogo

Un nuevo código podrá incorporarse cuando:

* represente una condición semántica distinta;
* no exista un código equivalente;
* pertenezca a un dominio definido o justificadamente nuevo;
* tenga significado estable;
* no contradiga códigos existentes.

No deberán crearse códigos diferentes únicamente para cambiar el texto del mensaje.

---

## 28. Deprecación

Un código utilizado por una implementación publicada no deberá reutilizarse con otro significado.

Cuando deje de utilizarse deberá marcarse como:

```text
DEPRECATED
```

o:

```text
RESERVED
```

Su identificador no deberá reasignarse a otra condición.

```text
OLD CODE
      ✕
NEW MEANING
```

---

## 29. Autoridad

`CODES.md` define el vocabulario semántico canónico de estados y resultados.

Permanece subordinado a:

```text
CONTRACTS.md
      ↓
REQUIREMENTS.md
      ↓
SECURITY.md
      ↓
ARCHITECTURE.md
```

Por tanto:

```text
CODES.md
      ≠
CONTRACTS.md
```

Este documento no podrá utilizarse para introducir comportamiento contrario a una autoridad superior.

---

## 30. Regla de cierre

Los códigos de SANTIAGO CODE deberán representar el estado real conocido del sistema.

```text
KNOWN SUCCESS
      ↓
SUCCESS

KNOWN FAILURE
      ↓
FAILURE

PARTIAL RESULT
      ↓
PARTIAL

INSUFFICIENT EVIDENCE
      ↓
NOT VERIFIED

UNKNOWN STATE
      ↓
UNKNOWN
```

Nunca deberá utilizarse un código de éxito para ocultar:

```text
FAILURE
PARTIAL RESULT
UNKNOWN STATE
DENIED OPERATION
MISSING EVIDENCE
```

La regla fundamental será:

```text
CODE MUST REPRESENT REAL STATE
```
