# SANTIAGO CODE — DOCUMENTATION GOVERNANCE

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `DOCS.md`

---

## 1. Propósito

Este documento define la gobernanza documental de **SANTIAGO CODE**.

Establece:

* la jerarquía normativa;
* la relación entre documentos maestros y especializados;
* las reglas de precedencia;
* los estados documentales;
* el tratamiento de contradicciones;
* las reglas para modificación y evolución documental.

La documentación no constituye evidencia automática de implementación.

```text
DOCUMENTED ≠ IMPLEMENTED
```

---

## 2. Jerarquía de autoridad documental

La jerarquía normativa será:

```text
HUMAN AUTHORITY
      │
      ▼
CONTRACTS.md
      │
      ▼
REQUIREMENTS.md
      │
      ▼
SECURITY.md
      │
      ▼
ARCHITECTURE.md
      │
      ▼
COMPONENTS.md
      │
      ▼
SPECIALIZED DOCUMENTATION
      │
      ▼
IMPLEMENTATION
```

`README.md` describe la identidad, propósito y alcance general del proyecto, pero no constituye una autoridad superior a los contratos.

`DOCS.md` gobierna la organización, clasificación, precedencia y mantenimiento de la documentación, pero no podrá modificar ni contradecir los contratos fundamentales definidos por `CONTRACTS.md`.

---

## 3. Regla de precedencia

Ningún documento de jerarquía inferior podrá redefinir, reducir o contradecir una regla establecida por un documento de jerarquía superior.

```text
HIGHER AUTHORITY
      ↓
PREVAILS
```

Cuando exista contradicción:

```text
LOWER DOCUMENT
      ↓
NON-COMPLIANT
```

La contradicción deberá registrarse y resolverse explícitamente.

No deberá corregirse silenciosamente mediante interpretación de la implementación.

---

## 4. Función de los documentos maestros

Los documentos maestros tendrán las siguientes responsabilidades:

| Documento         | Responsabilidad                                     |
| ----------------- | --------------------------------------------------- |
| `README.md`       | Identidad, propósito, alcance y orientación general |
| `CONTRACTS.md`    | Contratos fundamentales                             |
| `REQUIREMENTS.md` | Requisitos normativos verificables                  |
| `SECURITY.md`     | Baseline obligatorio de seguridad                   |
| `ARCHITECTURE.md` | Arquitectura, límites y dependencias                |
| `COMPONENTS.md`   | Responsabilidades conceptuales de componentes       |
| `AI.md`           | Gobierno específico del subsistema de IA            |
| `MAP.md`          | Relaciones, flujos y dependencias conceptuales      |
| `SITEMAP.md`      | Ubicación canónica de documentos y componentes      |
| `DOCS.md`         | Gobernanza documental                               |

Los documentos descriptivos no adquieren autoridad superior simplemente por encontrarse en la raíz del repositorio.

---

## 5. Documentación especializada

La documentación especializada deberá derivarse de los documentos maestros aplicables.

Ejemplos:

```text
docs/
├── architecture/
├── contracts/
├── security/
├── governance/
├── evidence/
├── development/
└── operations/
```

La relación será:

```text
MASTER DOCUMENT
      ↓
SPECIALIZED DOCUMENT
      ↓
IMPLEMENTATION
```

Un documento especializado podrá ampliar detalles dentro de su dominio.

No podrá reducir garantías ni alterar reglas establecidas por una autoridad superior.

---

## 6. Contratos especializados

Los contratos especializados definidos en:

```text
docs/contracts/
```

deberán derivarse de `CONTRACTS.md`.

Conceptualmente:

```text
CONTRACTS.md
      │
      ├── AGENT_CONTRACT.md
      ├── WORKSPACE_CONTRACT.md
      ├── TOOL_CONTRACT.md
      └── AI_PROVIDER_CONTRACT.md
```

Cuando un contrato especializado contradiga el contrato maestro:

```text
CONTRACTS.md
      ↓
PREVAILS
```

El contrato especializado deberá clasificarse como `NON-COMPLIANT` hasta que la contradicción sea resuelta.

---

## 7. Documentos de arquitectura

`ARCHITECTURE.md` define la arquitectura autorizada del sistema.

Los Architecture Decision Records podrán documentar decisiones arquitectónicas específicas en:

```text
docs/architecture/ADR/
```

Un ADR no podrá modificar silenciosamente:

* contratos;
* requisitos;
* baseline de seguridad;
* autoridad humana;
* límites fundamentales del sistema.

Cuando una decisión arquitectónica requiera modificar una autoridad superior, deberá realizarse primero el cambio normativo correspondiente.

```text
CHANGE CONTRACT / REQUIREMENT
        ↓
AUTHORIZE
        ↓
UPDATE ARCHITECTURE
        ↓
UPDATE IMPLEMENTATION
```

---

## 8. Documentos de seguridad

Los documentos bajo:

```text
docs/security/
```

especializan el baseline definido por `SECURITY.md`.

Podrán definir:

* amenazas;
* permisos;
* trust boundaries;
* mitigaciones;
* controles especializados;
* riesgos residuales.

No podrán reducir las garantías establecidas por `SECURITY.md`.

---

## 9. Documentación de IA

`AI.md` gobierna específicamente el comportamiento conceptual del subsistema de Inteligencia Artificial.

Su autoridad permanece subordinada a:

```text
CONTRACTS.md
      ↓
REQUIREMENTS.md
      ↓
SECURITY.md
```

Por tanto:

```text
AI POLICY ≠ SYSTEM AUTHORITY
```

Ningún proveedor, modelo, prompt o salida de IA podrá redefinir la gobernanza documental.

---

## 10. MAP y SITEMAP

`MAP.md` y `SITEMAP.md` cumplen funciones descriptivas y estructurales diferentes.

```text
MAP.md
   ↓
HOW THINGS RELATE

SITEMAP.md
   ↓
WHERE THINGS LIVE
```

Estos documentos deberán reflejar la arquitectura y gobernanza vigentes.

No podrán convertirse en fuentes normativas paralelas.

Cuando exista contradicción con una autoridad superior, deberán actualizarse.

---

## 11. Estados documentales

Todo documento normativo deberá declarar explícitamente su estado cuando corresponda.

Estados permitidos:

```text
DRAFT
PROPOSED
FOUNDATION
AUTHORITATIVE
SUPERSEDED
DEPRECATED
ARCHIVED
```

### DRAFT

Documento en elaboración.

No constituye autoridad normativa.

### PROPOSED

Documento presentado formalmente para revisión.

No adquiere autoridad hasta su aprobación.

### FOUNDATION

Documento fundacional del sistema o de un dominio específico.

### AUTHORITATIVE

Documento vigente con autoridad dentro de su alcance.

### SUPERSEDED

Documento sustituido por una versión posterior.

No deberá utilizarse como autoridad vigente.

### DEPRECATED

Documento todavía existente pero cuyo uso está siendo retirado.

### ARCHIVED

Documento conservado únicamente como registro histórico.

---

## 12. Alcance de autoridad

La declaración:

```text
AUTHORITATIVE
```

no convierte un documento en autoridad universal.

Todo documento posee autoridad únicamente dentro de su alcance y conforme a la jerarquía documental.

```text
AUTHORITY
      =
STATUS
+
SCOPE
+
HIERARCHY
```

Un documento especializado marcado como `AUTHORITATIVE` continúa subordinado a las autoridades superiores aplicables.

---

## 13. Contradicciones documentales

Cuando se detecte una contradicción deberá identificarse:

```text
SOURCE DOCUMENT
CONFLICTING DOCUMENT
APPLICABLE SECTIONS
AUTHORITY LEVEL
IMPACT
RESOLUTION STATE
```

La contradicción deberá clasificarse como mínimo en:

```text
AMBIGUITY
MISALIGNMENT
CONTRADICTION
NON-COMPLIANT
```

No deberá resolverse modificando silenciosamente el significado de uno de los documentos.

---

## 14. Cambios documentales

Todo cambio normativo deberá preservar trazabilidad suficiente para conocer:

* qué cambió;
* por qué cambió;
* qué autoridad autorizó el cambio;
* qué documentos dependientes resultan afectados;
* qué implementación puede requerir actualización.

La secuencia conceptual será:

```text
PROPOSE
      ↓
REVIEW
      ↓
AUTHORIZE
      ↓
UPDATE AUTHORITATIVE DOCUMENT
      ↓
UPDATE DERIVED DOCUMENTS
      ↓
UPDATE IMPLEMENTATION
      ↓
VERIFY
```

---

## 15. Prohibición de autoridad inversa

La implementación no podrá convertirse automáticamente en fuente de autoridad documental.

```text
IMPLEMENTATION
      ✕
DOES NOT REDEFINE CONTRACT
```

La existencia de comportamiento diferente al documentado deberá producir un hallazgo, no una modificación automática del contrato.

```text
CODE CONTRADICTS CONTRACT
        ↓
NON-COMPLIANT
```

No:

```text
CODE CONTRADICTS CONTRACT
        ↓
CHANGE CONTRACT TO MATCH CODE
```

---

## 16. Documentación y verificación

La documentación define lo esperado.

La implementación materializa ese comportamiento.

Las pruebas evalúan comportamiento.

La evidencia permite demostrar resultados.

```text
DOCUMENTATION
      ↓
IMPLEMENTATION
      ↓
TEST
      ↓
EVIDENCE
      ↓
VERIFICATION
```

Por tanto:

```text
DOCUMENTED ≠ IMPLEMENTED

IMPLEMENTED ≠ VERIFIED

TEST PASS ≠ GLOBAL CERTIFICATION
```

---

## 17. Trazabilidad

La gobernanza documental deberá permitir establecer, cuando resulte aplicable:

```text
CONTRACT
      ↓
REQUIREMENT
      ↓
ARCHITECTURE
      ↓
COMPONENT
      ↓
IMPLEMENTATION
      ↓
TEST
      ↓
EVIDENCE
      ↓
VERIFIED STATE
```

La existencia de la relación de trazabilidad no implica por sí misma cumplimiento.

---

## 18. Regla de cierre

La documentación de SANTIAGO CODE deberá mantener una única línea coherente de autoridad.

```text
HUMAN AUTHORITY
      ↓
CONTRACT
      ↓
REQUIREMENT
      ↓
SECURITY
      ↓
ARCHITECTURE
      ↓
COMPONENT
      ↓
SPECIALIZED DOCUMENTATION
      ↓
IMPLEMENTATION
```

Ningún documento inferior podrá elevarse unilateralmente sobre una autoridad superior.

Ninguna implementación podrá reescribir su contrato para justificar su propio comportamiento.

Ningún documento podrá declarar como verificado aquello que no esté respaldado por evidencia suficiente y pertinente.
