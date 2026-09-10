# SANTIAGO CODE — SITEMAP

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `SITEMAP.md`

---

## 1. Propósito

Este documento define la topología canónica del repositorio de **SANTIAGO CODE**.

Su función es establecer:

* ubicación de documentos normativos;
* separación entre documentación e implementación;
* organización de contratos especializados;
* ubicación de componentes internos;
* límites estructurales del proyecto.

`SITEMAP.md` define **dónde pertenece cada elemento**.

No sustituye a `MAP.md`, que define las relaciones y flujos entre componentes.

---

## 2. Estructura canónica

```text
SANTIAGO_CODE/
│
├── README.md
├── REQUIREMENTS.md
├── CONTRACTS.md
├── SECURITY.md
├── COMPONENTS.md
├── AI.md
├── MAP.md
├── SITEMAP.md
├── DOCS.md
│
├── docs/
│   ├── README.md
│   │
│   ├── architecture/
│   │   ├── ARCHITECTURE.md
│   │   │
│   │   └── ADR/
│   │       └── README.md
│   │
│   ├── contracts/
│   │   ├── README.md
│   │   ├── AGENT_CONTRACT.md
│   │   ├── WORKSPACE_CONTRACT.md
│   │   ├── TOOL_CONTRACT.md
│   │   └── AI_PROVIDER_CONTRACT.md
│   │
│   ├── security/
│   │   ├── README.md
│   │   ├── THREAT_MODEL.md
│   │   └── PERMISSIONS.md
│   │
│   ├── governance/
│   │   ├── README.md
│   │   └── TRACEABILITY.md
│   │
│   ├── evidence/
│   │   └── README.md
│   │
│   ├── development/
│   │   ├── BUILD.md
│   │   ├── TESTING.md
│   │   ├── LOGGING.md
│   │   └── ERROR_HANDLING.md
│   │
│   └── operations/
│       ├── INSTALLATION.md
│       ├── CONFIGURATION.md
│       └── RECOVERY.md
│
├── cmd/
│   └── santiago/
│
├── internal/
│   ├── agent/
│   ├── ai/
│   ├── audit/
│   ├── contracts/
│   ├── evidence/
│   ├── filesystem/
│   ├── governance/
│   ├── security/
│   ├── workspace/
│   └── tools/
│
├── tests/
│
└── scripts/
```

---

## 3. Documentos raíz

Los documentos ubicados en la raíz establecen las definiciones globales del proyecto.

### `README.md`

Define:

* identidad del proyecto;
* propósito;
* alcance general;
* principios fundamentales.

No deberá contener contratos detallados de implementación.

---

### `REQUIREMENTS.md`

Define los requisitos normativos del sistema.

Incluye requisitos:

* funcionales;
* arquitectónicos;
* de seguridad;
* de IA;
* de herramientas;
* de gobernanza;
* de evidencia verificable.

---

### `CONTRACTS.md`

Define los contratos fundamentales y las reglas de autoridad del sistema.

Los contratos especializados ubicados en:

```text
docs/contracts/
```

deberán derivar de este documento y no podrán contradecirlo.

---

### `SECURITY.md`

Define el baseline general de seguridad.

Las especificaciones detalladas deberán residir en:

```text
docs/security/
```

---

### `COMPONENTS.md`

Define los componentes conceptuales del sistema y sus responsabilidades.

No deberá sustituir la arquitectura detallada.

---

### `AI.md`

Define las reglas arquitectónicas y operativas aplicables al subsistema de inteligencia artificial.

No deberá acoplar el dominio a un proveedor concreto.

---

### `MAP.md`

Define:

* relaciones;
* dependencias;
* capas;
* flujos;
* dirección arquitectónica.

---

### `SITEMAP.md`

Define la ubicación canónica de documentos, código y áreas estructurales.

---

### `DOCS.md`

Define las reglas de gobernanza documental.

---

## 4. Directorio `docs/`

Contiene documentación especializada.

Los documentos contenidos en `docs/` no adquieren automáticamente mayor autoridad que los documentos normativos de raíz.

Su autoridad deberá derivarse explícitamente de la jerarquía documental.

---

## 5. Arquitectura

```text
docs/architecture/
```

contiene la definición arquitectónica detallada.

### `ARCHITECTURE.md`

Define:

* capas;
* límites;
* dependencias;
* puertos;
* adaptadores;
* dirección de dependencias;
* restricciones arquitectónicas.

### `ADR/`

Contiene Architecture Decision Records.

Los ADR registran decisiones arquitectónicas.

Un ADR no podrá modificar silenciosamente un contrato superior.

---

## 6. Contratos especializados

```text
docs/contracts/
```

contiene contratos específicos derivados del contrato maestro.

### `AGENT_CONTRACT.md`

Contrato operativo del agente.

### `WORKSPACE_CONTRACT.md`

Contrato de límites, selección y operaciones sobre workspaces.

### `TOOL_CONTRACT.md`

Contrato aplicable a herramientas y capacidades ejecutables.

### `AI_PROVIDER_CONTRACT.md`

Contrato que deberán satisfacer los adaptadores de proveedores de IA.

La relación será:

```text
CONTRACTS.md
      │
      ▼
docs/contracts/*
```

Nunca en sentido inverso.

---

## 7. Seguridad

```text
docs/security/
```

contiene especificaciones especializadas de seguridad.

### `THREAT_MODEL.md`

Documenta:

* activos;
* amenazas;
* fronteras de confianza;
* vectores;
* mitigaciones;
* riesgo residual.

### `PERMISSIONS.md`

Define el modelo de permisos y operaciones privilegiadas.

---

## 8. Gobernanza

```text
docs/governance/
```

contiene mecanismos de control y trazabilidad.

### `TRACEABILITY.md`

Deberá permitir relacionar:

```text
CONTRATO
↓
REQUISITO
↓
COMPONENTE
↓
IMPLEMENTACIÓN
↓
PRUEBA
↓
EVIDENCIA
```

La existencia de una relación de trazabilidad no implica por sí misma cumplimiento.

---

## 9. Evidencia

```text
docs/evidence/
```

define las reglas aplicables a evidencia técnica generada o registrada por el sistema.

No deberá utilizarse como depósito indiscriminado de logs, secretos o artefactos temporales.

---

## 10. Desarrollo

```text
docs/development/
```

contiene documentación relativa al ciclo de construcción del software.

Incluye:

```text
BUILD.md
TESTING.md
LOGGING.md
ERROR_HANDLING.md
```

Estos documentos deberán implementar las reglas establecidas por los contratos y requisitos superiores.

---

## 11. Operaciones

```text
docs/operations/
```

contiene procedimientos operativos.

Incluye:

```text
INSTALLATION.md
CONFIGURATION.md
RECOVERY.md
```

Los procedimientos operativos no podrán reducir controles definidos por `SECURITY.md`.

---

## 12. Código ejecutable

### `cmd/`

Contiene los puntos de entrada ejecutables.

```text
cmd/santiago/
```

deberá limitarse a composición, configuración y arranque.

La lógica de dominio no deberá residir en `cmd/`.

---

### `internal/`

Contiene la implementación interna de SANTIAGO CODE.

```text
agent/       → orquestación del agente
ai/          → integración y abstracción de IA
audit/       → auditoría y evaluación
contracts/   → contratos internos de código
evidence/    → captura y manejo de evidencia
filesystem/  → acceso controlado al sistema de archivos
governance/  → aplicación de reglas normativas
security/    → controles de seguridad
workspace/   → gestión del workspace
tools/       → capacidades y herramientas
```

Las responsabilidades concretas deberán quedar definidas por `ARCHITECTURE.md` y `COMPONENTS.md`.

---

## 13. Pruebas

```text
tests/
```

contiene pruebas que no pertenezcan naturalmente junto al paquete probado.

La organización de pruebas deberá respetar `docs/development/TESTING.md`.

Una prueba exitosa constituye evidencia únicamente sobre aquello que realmente verifica.

---

## 14. Scripts

```text
scripts/
```

contiene herramientas auxiliares de:

* construcción;
* diagnóstico;
* mantenimiento;
* desarrollo;
* operaciones autorizadas.

La presencia de un script dentro de este directorio no le concede privilegios especiales.

Todo script permanece sujeto a los mismos controles de seguridad y autorización del proyecto.

---

## 15. Regla estructural

La topología documental deberá conservar la siguiente separación:

```text
ROOT
│
├── AUTORIDAD GLOBAL
│
└── docs/
    └── ESPECIALIZACIÓN

CODE
│
├── cmd/
│   └── COMPOSITION ROOT
│
└── internal/
    └── IMPLEMENTACIÓN
```

Ningún directorio de implementación podrá convertirse en una fuente normativa paralela.

---

## 16. Regla final

La estructura del repositorio deberá mantener una separación explícita entre:

```text
QUÉ DEBE CUMPLIRSE      → REQUIREMENTS / CONTRACTS
CÓMO SE PROTEGE         → SECURITY
CÓMO SE DISEÑA          → ARCHITECTURE
QUÉ COMPONENTES EXISTEN → COMPONENTS
CÓMO SE RELACIONAN      → MAP
DÓNDE RESIDEN           → SITEMAP
CÓMO SE DOCUMENTAN      → DOCS
CÓMO SE IMPLEMENTAN     → CODE
CÓMO SE DEMUESTRAN      → TESTS / EVIDENCE
```

`SITEMAP.md` establece la ubicación canónica de estas responsabilidades y no deberá utilizarse para redefinir sus contratos.
