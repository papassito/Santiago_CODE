# SANTIAGO CODE — COMPONENTS

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `COMPONENTS.md`

---

## 1. Propósito

Este documento define los componentes conceptuales principales de **SANTIAGO CODE** y delimita sus responsabilidades.

`COMPONENTS.md` especifica:

* qué componentes existen;
* qué responsabilidad tiene cada uno;
* qué límites funcionales deben respetar.
* cómo se estructuran los cuatro subsistemas principales (SANTIAGO ENGINE, SANTIAGO VOICE, CASA DE SANTIAGO, SANTIAGO VS CODE EXTENSION).

No define puertos de red, algoritmos criptográficos concretos, procesos físicos ni detalles de despliegue salvo que formen parte de un contrato superior explícito.

Los detalles de implementación deberán residir en `ARCHITECTURE.md`, contratos especializados o documentación operativa.

---

## 1.1. Los Cuatro Subsistemas Principales

La topología del sistema se rige por un desacoplamiento modular estricto:

```text id="modular-swarm-subsystems"
SANTIAGO CODE
│
├── SANTIAGO ENGINE             (Orquestador y Núcleo de Reglas)
├── SANTIAGO VOICE              (Módulo de Procesamiento de Voz)
├── CASA DE SANTIAGO            (Entorno de Desarrollo e IDE Propio)
└── SANTIAGO VS CODE EXTENSION  (Adaptador Cliente de Extensión)
```

### Regla Modular Obligatoria:

```text id="modular-isolation-rule"
MODULE A ≠ DIRECT ACCESS TO INTERNALS OF MODULE B
```

Cada subsistema se comunica con los demás de forma exclusiva mediante contratos de interfaz definidos. Ningún módulo puede sortear la gobernanza del motor ni alterar variables lógicas internas del mismo.

---

## 2. Principio de separación

Cada componente deberá poseer una responsabilidad claramente delimitada.

```text
COMPONENT
    ↓
RESPONSIBILITY
    ↓
CONTRACT
    ↓
IMPLEMENTATION
```

Un componente no deberá asumir responsabilidades pertenecientes a otro sin un contrato explícito.

---

## 3. SANTIAGO ENGINE

**SANTIAGO ENGINE** constituye el núcleo de procesamiento lógico, gobernanza y seguridad de SANTIAGO CODE. No implementa interfaces de usuario, síntesis de voz ni dependencias específicas de IDEs externos.

El **Agent Engine** coordina el ciclo principal de operación dentro de este subsistema.

Responsabilidades:

* recibir objetivos autorizados;
* coordinar componentes internos;
* mantener el estado de ejecución;
* controlar la secuencia operativa;
* detener operaciones cuando un control obligatorio falle.

No deberá implementar directamente:

* acceso al sistema de archivos;
* ejecución de comandos;
* inferencia de IA;
* políticas de seguridad;
* persistencia de evidencia.

Estas capacidades deberán consumirse mediante componentes o contratos especializados.

---

## 4. Governance Engine

El **Governance Engine** interpreta y aplica la gobernanza del sistema.

Responsabilidades:

* resolver jerarquía documental;
* identificar contratos aplicables;
* evaluar políticas;
* determinar restricciones;
* identificar contradicciones normativas;
* proporcionar decisiones de gobernanza a otros componentes.

No deberá convertir código existente en autoridad normativa.

```text
CODE ≠ GOVERNANCE
```

---

## 5. Workspace Engine

El **Workspace Engine** administra el contexto físico y lógico del workspace autorizado.

Responsabilidades:

* identificar la raíz autorizada;
* enumerar archivos y directorios;
* resolver rutas;
* validar límites;
* detectar recursos existentes;
* mantener el contexto estructural del workspace.

No deberá asumir que el análisis sintáctico o semántico del código pertenece necesariamente a este componente.

Cuando se requiera análisis AST, éste deberá residir en un componente especializado o una herramienta autorizada.

---

## 6. Contract Engine

El **Contract Engine** interpreta y valida contratos normativos.

Responsabilidades:

* cargar contratos aplicables;
* identificar requisitos derivados;
* comparar contratos contra implementación;
* detectar contradicciones;
* detectar contratos faltantes;
* proporcionar resultados verificables de cumplimiento documental.

El Contract Engine no deberá modificar silenciosamente los contratos que analiza.

---

## 7. Planning Engine

El **Planning Engine** transforma un objetivo autorizado en un plan estructurado de acciones.

Podrá utilizar ciclos como:

```text
OBSERVAR
↓
PLANEAR
↓
ACTUAR
↓
VERIFICAR
```

La generación de un plan no implica autorización para ejecutar todas sus acciones.

```text
PLAN ≠ AUTHORIZATION
```

El Planning Engine deberá respetar las restricciones emitidas por Governance y Security.

---

## 8. AI Engine

El **AI Engine** proporciona capacidades de inferencia y razonamiento asistido.

Responsabilidades:

* exponer una interfaz común de inferencia;
* desacoplar al dominio de proveedores concretos;
* gestionar solicitudes y respuestas de modelos;
* aplicar políticas de clasificación y contexto;
* permitir proveedores locales o autorizados.

El AI Engine no deberá depender arquitectónicamente de:

* un puerto específico;
* un endpoint fijo;
* una marca;
* un proveedor;
* un modelo determinado.

La implementación concreta deberá resolverse mediante adaptadores.

```text
DOMAIN
  ↓
AI CONTRACT
  ↓
AI ADAPTER
  ↓
PROVIDER
```

---

## 9. Tool Engine

El **Tool Engine** administra herramientas operativas autorizadas.

Estas herramientas podrán incluir:

* terminales;
* shells;
* compiladores;
* linters;
* analizadores;
* sistemas de pruebas;
* editores;
* utilidades de diagnóstico.

Responsabilidades:

* registrar herramientas disponibles;
* validar el alcance de ejecución;
* aplicar permisos;
* ejecutar capacidades autorizadas;
* devolver resultados estructurados.

Las herramientas no constituyen autoridad normativa.

---

## 10. Audit Engine

El **Audit Engine** evalúa comportamiento, cumplimiento y resultados.

Responsabilidades:

* registrar hallazgos;
* comparar requisitos con evidencia;
* clasificar incumplimientos;
* emitir estados verificables;
* mantener trazabilidad de auditoría.

Los estados podrán incluir:

```text
PASS
FAIL
WARNING
NOT_VERIFIED
NOT_APPLICABLE
```

El Audit Engine no deberá declarar cumplimiento global basándose únicamente en una prueba aislada.

---

## 11. Evidence Engine

El **Evidence Engine** administra evidencia técnica asociada a acciones, pruebas y verificaciones.

Responsabilidades:

* capturar evidencia;
* relacionarla con requisitos;
* identificar origen;
* registrar resultados;
* conservar metadatos relevantes;
* diferenciar evidencia verificable de afirmaciones no comprobadas.

Un registro de evidencia podrá contener referencias a:

```text
SOURCE
PATH
COMMAND
OUTPUT
TEST
ASSERTION
TIMESTAMP
VERIFICATION STATE
```

cuando resulten aplicables.

El Evidence Engine no sustituye al framework de testing.

```text
TEST PRODUCES EVIDENCE
EVIDENCE ENGINE MANAGES EVIDENCE
```

---

## 12. Security Engine

El **Security Engine** aplica los controles definidos por `SECURITY.md`.

Responsabilidades:

* validar autorización;
* aplicar mínimo privilegio;
* controlar límites del workspace;
* proteger secretos;
* controlar operaciones privilegiadas;
* aplicar políticas fail-closed;
* validar capacidades antes de ejecución;
* detener operaciones inseguras.

El Security Engine deberá definir capacidades mediante contratos y políticas, no mediante dependencia obligatoria de un algoritmo o mecanismo específico.

Los mecanismos concretos de:

* cifrado;
* aislamiento;
* sandboxing;
* protección de memoria;
* almacenamiento seguro;

deberán definirse en arquitectura o contratos especializados cuando sean requeridos.

---

## 12.1. SANTIAGO VOICE

**SANTIAGO VOICE** es un módulo complementario y opcional encargado del procesamiento y traducción de comandos de voz en intenciones estructuradas transferidas al SANTIAGO ENGINE.

Responsabilidades:
* Capturar flujo de voz local (Whisper.cpp) y transformarlo a texto plano.
* Enviar intenciones autenticadas al Motor a través de un canal seguro.
* Convertir las respuestas de texto del Motor a síntesis de voz (Piper TTS).

```text id="voice-auth-boundary"
VOICE COMMAND ≠ DIRECT AUTHORIZATION
```

---

## 12.2. CASA DE SANTIAGO

**CASA DE SANTIAGO** es la interfaz gráfica y entorno de desarrollo (IDE) principal de la plataforma. Proporciona capacidades completas de edición de código, gestión de workspaces locales y diagnósticos interactivos sin depender del runtime de editores de terceros.

Estructura Conceptual Interna:
```text
CASA DE SANTIAGO ──► [Editor, Explorer, Search, Terminal, Tasks, Diagnostics, Debug, Extensions]
```

---

## 12.3. SANTIAGO VS CODE EXTENSION

Módulo adaptador de integración externa. Conecta el host de Visual Studio Code con SANTIAGO ENGINE de forma asíncrona, actuando meramente como cliente consumidor de inferencias y diagnósticos AST locales.

---

## 13. Relación entre componentes

La relación conceptual principal será:

```text
USER
  │
  ▼
SANTIAGO ENGINE (Core)
  │
  ├── SANTIAGO VOICE              (Modulo Opcional)
  ├── CASA DE SANTIAGO            (IDE Completo)
  └── SANTIAGO VS CODE EXTENSION  (Cliente de Extension)
```

Agent Engine coordina.

Los demás componentes conservan responsabilidades especializadas.

---

## 14. Dependencias

Los componentes del dominio deberán depender de contratos internos y no directamente de infraestructura concreta.

```text
CORE COMPONENT
      ↓
CONTRACT / PORT
      ↓
ADAPTER
      ↓
INFRASTRUCTURE
```

Ejemplos de infraestructura concreta incluyen:

* sockets;
* HTTP;
* procesos locales;
* bases de datos;
* modelos de IA;
* sistema operativo;
* almacenamiento;
* terminales.

---

## 15. Regla de autoridad

Los componentes implementan comportamiento.

No crean autoridad normativa por sí mismos.

```text
CONTRACTS
   ↓
REQUIREMENTS
   ↓
ARCHITECTURE
   ↓
COMPONENTS
   ↓
IMPLEMENTATION
```

Si una implementación contradice un contrato superior, la implementación deberá considerarse no conforme.

---

## 16. Regla final

Cada componente deberá responder a una responsabilidad concreta y verificable.

```text
AGENT       → COORDINA
GOVERNANCE  → GOBIERNA
WORKSPACE   → DELIMITA
CONTRACT    → VALIDA CONTRATOS
PLANNING    → PLANEA
AI          → INFIERA
TOOLS       → EJECUTAN CAPACIDADES
AUDIT       → EVALÚA
EVIDENCE    → DEMUESTRA
SECURITY    → PROTEGE
```

Los detalles de infraestructura no deberán convertirse accidentalmente en contratos arquitectónicos.
