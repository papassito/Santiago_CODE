# SANTIAGO — AGENTE DE IA DE DESARROLLO AUTÓNOMO
## DOCUMENTO MAESTRO DE ARQUITECTURA Y ESPECIFICACIÓN (FASE 0)

---

### 1. ARQUITECTURA GENERAL
Santiago es un agente de ingeniería de software autónomo y local, diseñado desde sus cimientos para operar sin depender de proveedores de nube externos ni APIs SaaS cerradas.

#### Separación Esencial: Santiago Core vs. Model Provider
```text
┌────────────────────────────────────────────────────────────────────────┐
│                             SANTIAGO CORE                              │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Agent Runtime│  │ Memory Store │  │ Task Planner │  │Tool Engine │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                 │                │         │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐  ┌─────┴──────┐  │
│  │Command Policy│  │  Audit Ledger│  │ Verification │  │ Windows Opt│  │
│  │ (Safety Eng) │  │  (Immutable) │  │   Engine     │  │ (AV/FW/RAM)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│                                  │                                     │
│                         ┌────────┴────────┐                            │
│                         │  MODEL ROUTER   │                            │
└─────────────────────────┴────────┬────────┴────────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
     ┌────────────────┐   ┌─────────────────┐   ┌───────────────┐
     │ Ollama Local   │   │ Llama.cpp / GGUF│   │ Fallback HTTP │
     │127.0.0.1:11434 │   │ Native Process  │   │ (Opcional)    │
     └────────────────┘   └─────────────────┘   └───────────────┘
```
**Regla Inmutable:** El modelo de lenguaje NO es Santiago. El modelo es exclusivamente un motor de inferencia cognitiva intercambiable. Si se cambia de `qwen2.5-coder` a `deepseek-coder` o `llama3`, Santiago mantiene intacta su memoria SQLite, sus proyectos, sus árboles de dependencias, su historial de auditoría y sus políticas de seguridad.

---

### 2. ÁRBOL DE PROYECTO GO
```text
santiago/
├── cmd/
│   └── santiago/               # Punto de entrada CLI y demonio local en Windows
│       └── main.go
├── internal/
│   ├── core/                   # Orquestador del ciclo de vida del agente
│   │   ├── engine.go
│   │   └── session.go
│   ├── model/                  # Capa de abstracción de proveedores LLM
│   │   ├── router.go
│   │   ├── ollama.go           # Cliente HTTP optimizado para Ollama local
│   │   └── token_counter.go    # Telemetría de tokens y control de costos
│   ├── memory/                 # Sistema de memoria de 6 niveles (SQLite WAL)
│   │   ├── memory.go
│   │   ├── sqlite_store.go
│   │   └── vector_index.go     # Embeddings locales mediante Ollama
│   ├── planner/                # Descomposición de tareas y sub-planes
│   │   ├── planner.go
│   │   └── dependency_graph.go # Grafo de contexto de proyecto
│   ├── tools/                  # Sistema modular de herramientas con sandbox
│   │   ├── registry.go
│   │   ├── filesystem.go       # Lectura, escritura, diffs y snapshots
│   │   ├── terminal.go         # Ejecución controlada de subprocesos
│   │   ├── git.go              # Inspección de commits, ramas y diffs
│   │   └── code_intel.go       # Análisis sintáctico y de tipos (Go AST, etc.)
│   ├── execution/              # Motor de ejecución y ciclo de comandos
│   │   ├── executor.go
│   │   └── process_windows.go  # Creación segura de procesos en Windows (CreateProcessW)
│   ├── verification/           # Motor de verificación independiente
│   │   ├── verifier.go
│   │   ├── compiler.go         # Compilación de Go, C#, C++, TypeScript, Python
│   │   └── test_runner.go      # Ejecución de tests y captura de logs/panics
│   ├── security/               # Motor de seguridad y políticas
│   │   ├── policy.go           # DETECTAR != DECIDIR != EJECUTAR
│   │   └── sandbox.go
│   ├── audit/                  # Ledger inmutable con hashes SHA-256
│   │   ├── ledger.go
│   │   └── export.go
│   ├── project/                # Registro de proyectos aislados
│   │   ├── registry.go
│   │   └── isolation.go
│   └── windows/                # Adaptaciones específicas para Windows PC
│       ├── av_friendly.go      # Compatibilidad con Antivirus / AMSI
│       ├── firewall.go         # Bind estricto a 127.0.0.1
│       └── resource_governor.go# Throttling de memoria y CPU
├── pkg/
│   ├── types/                  # Modelos de dominio y enums compartidos
│   │   └── types.go
│   └── interfaces/             # Contratos Go canónicos desacoplados
│       └── interfaces.go
├── configs/
│   └── santiago.example.yaml   # Configuración de producción para Windows
├── go.mod
└── go.sum
```

---

### 3. COMPONENTES Y RESPONSABILIDADES
1. **Core Orchestrator (`internal/core`)**: Dirige las transiciones entre fases del Protocolo Maestro.
2. **Model Router (`internal/model`)**: Enruta prompts a Ollama local (`127.0.0.1:11434`), mide latencias y tokens.
3. **Memory Store (`internal/memory`)**: Almacena de forma persistente conocimiento en SQLite local en 6 capas independientes.
4. **Task Planner (`internal/planner`)**: Divide objetivos complejos en sub-tareas secuenciales verificables.
5. **Code Intelligence Engine (`internal/tools/code_intel`)**: Analiza árboles sintácticos (AST), dependencias y símbolos.
6. **Command Policy & Safety Engine (`internal/security`)**: Clasifica comandos, detecta riesgos e impide ejecuciones no autorizadas.
7. **Execution Engine (`internal/execution`)**: Ejecuta comandos mediante Windows API nativa con timeouts y buffers reciclados.
8. **Rollback & Snapshot Manager (`internal/tools/filesystem`)**: Toma un snapshot con hash SHA256 antes de cada mutación de archivo.
9. **Verification Engine (`internal/verification`)**: Compila, ejecuta tests y compara diffs. Distingue inferencia de verificación.
10. **Audit Ledger (`internal/audit`)**: Escribe eventos en un archivo JSON Lines append-only inmutable.
11. **Windows Optimizer (`internal/windows`)**: Garantiza cero alertas de Firewall y compatibilidad con Antivirus.

---

### 4. INTERFACES EN GO
Definidas en `pkg/interfaces/interfaces.go`:
- `Engine`: Orquestador de solicitudes y cambio de contexto de proyecto.
- `ModelProvider`: Interfaz para Ollama con streaming, métricas y health checks.
- `MemoryStore`: Acceso a las 6 capas de memoria (Short-Term, Project, Long-Term, Decision, Failure, User Instructions).
- `Tool`: Contrato unificado para herramientas con declaración explícita de riesgos y permisos requeridos.
- `CommandPolicy`: Clasificación y autorización de comandos shell.
- `RollbackManager`: Creación de snapshots y reversión atómica.
- `VerificationEngine`: Pruebas de compilación, ejecución de tests y validación de diffs.
- `Auditor`: Registro criptográfico de transacciones.
- `WindowsOptimizer`: Validación de binding de red y sanitización de procesos.

---

### 5. FLUJO DE DATOS & PROTOCOLO MAESTRO

#### Ciclo Operativo de Tareas:
```text
COMPRENDER  ──>  DEMOSTRAR  ──>  PROPONER  ──>  AUTORIZACIÓN  ──>  EJECUTAR  ──>  VERIFICAR  ──>  CERTIFICAR
 (Inspección)   (Evidencias)     (Plan/Diff)     (Aprobación)    (Snapshot+Tool)  (Compile+Test)   (Audit Log)
```

#### Ciclo de Ejecución de Comandos:
```text
COMANDO ──> CLASIFICAR ──> ANÁLISIS DE RIESGO ──> CHECK DE PERMISO ──> EJECUTAR ──> CAPTURA SALIDA ──> VERIFICAR ──> AUDITORÍA
```

---

### 6. MODELO DE MEMORIA (6 CAPAS)
1. **Short-Term Memory**: Variables de la sesión actual, contexto del turno activo.
2. **Project Memory**: Grafo de archivos, módulos, frameworks y dependencias del proyecto actual (aislado por `ProjectID`).
3. **Long-Term Memory**: Heurísticas generales de ingeniería de software de Santiago.
4. **Decision Memory**: Registro histórico de decisiones arquitectónicas y su justificación.
5. **Failure Memory**: Registro de errores de compilación previos, stack traces y la solución verificada que funcionó.
6. **User Instructions**: Preferencias inmutables configuradas por el usuario u operador.

---

### 7. MODELO DE HERRAMIENTAS & SANDBOX
Cada herramienta implementa:
- Nombre y versión.
- Capacidades específicas.
- Permiso mínimo requerido (`READ_ONLY`, `ANALYZE`, `MODIFY`, `EXECUTE`, `ADMIN`).
- Nivel de riesgo (`SAFE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- Argumentos tipados y validación previa.

---

### 8. MODELO DE PERMISOS
- `READ_ONLY`: Inspección de código, búsqueda, visualización.
- `ANALYZE`: Análisis sintáctico, grafos de dependencias, linters de sólo lectura.
- `PROPOSE`: Formulación de planes, cálculo de diffs, propuestas arquitectónicas.
- `MODIFY`: Creación o edición de archivos (requiere snapshot previo).
- `EXECUTE`: Ejecución de compiladores, test runners o herramientas de proyecto.
- `ADMIN`: Modificaciones estructurales críticas (requiere confirmación explícita paso a paso).

**Regla Epistémica Fundamental:**
Si Santiago no tiene evidencia comprobable, debe declarar explícitamente:
`UNKNOWN`, `UNVERIFIED` o `INSUFFICIENT EVIDENCE`. Jamás debe inventar archivos, salidas de comando ni resultados de tests.

---

### 9. MODELO DE AUDITORÍA
Registro inmutable tipo ledger:
- `ID` (UUIDv4)
- `Timestamp` (UTC ISO8601)
- `ProjectID`
- `Actor` ("santiago-core" o usuario)
- `Tool`
- `Target`
- `BeforeHash` (SHA-256)
- `AfterHash` (SHA-256)
- `Risk`
- `UserAuthorized` (booleano)
- `Result` ("SUCCESS", "FAILED", "BLOCKED", "ROLLED_BACK")
- `Evidence`
- `DurationMs`

---

### 10. ESTRATEGIA OLLAMA (LOCAL-FIRST)
- Conexión vía HTTP a `http://127.0.0.1:11434`.
- Modelos recomendados para codificación:
  - `qwen2.5-coder:7b` (equilibrio óptimo velocidad / precisión en PCs estándar).
  - `deepseek-coder-v2:16b` (para tareas complejas de refactorización).
  - `llama3.1:8b` (modelo base alternativo).
- Control de tokens con ventana de contexto configurada (ej. 16K o 32K tokens).
- Health check periódico de la API `/api/tags` de Ollama.
- Desconexión elegante ante falta de GPU/RAM.

---

### 11. ESTRATEGIA DE PRUEBAS
- Tests unitarios en Go puro (`go test ./...`) para parser, policies y hashers.
- Mocks en memoria para Ollama HTTP sin requerir que Ollama esté corriendo durante la CI/build.
- Tests de snapshots y rollback en directorios temporales aislados.
- Tests de seguridad verificando que comandos de riesgo crítico sean bloqueados automáticamente.

---

### 12. RIESGOS TÉCNICOS & MITIGACIONES
| Riesgo | Impacto | Mitigación en Santiago |
|---|---|---|
| **Consumo excesivo de RAM/VRAM** | Caída del sistema en Windows | Límite configurable de contexto, pool de buffers en Go (`sync.Pool`), monitoreo activo de `runtime.MemStats`. |
| **Alerta de Firewall de Windows** | Interrupción intrusiva al usuario | Bindeo **exclusivo a `127.0.0.1`**, prohibiendo categóricamente `0.0.0.0`. |
| **Falsos positivos de Antivirus** | Bloqueo o cuarentena del ejecutable | Manifiesto de Windows (`asInvoker`), sin inyecciones dinámicas de código en memoria, prohibido ejecutar binarios desde `%TEMP%`. |
| **Alucinación de resultados** | Fallos en producción | Validación forzosa por `VerificationEngine` (compilación y tests reales) antes de marcar una tarea como completada. |
| **Contaminación de proyectos** | Fuga de secretos o mezcla de contextos | Aislamiento estricto de base de datos SQLite por `ProjectID`. |

---

### 13. DEPENDENCIAS DEL RUNTIME GO
- Go 1.22+ estándar.
- SQLite CGO-Free (o `modernc.org/sqlite`) para compilación estática nativa en Windows sin requerir GCC/MinGW instalado.
- `google/uuid` para identificadores de auditoría y snapshots.
- `gopkg.in/yaml.v3` para lectura de configuración.

---

### 14. CRITERIOS DE ACEPTACIÓN — FASE 0
- [x] Especificación formal completa de los 17 puntos maestros.
- [x] Paquetes Go e interfaces canónicas compilables en `santiago-go/pkg/interfaces/interfaces.go`.
- [x] Implementación de tipos de dominio y enums en `santiago-go/pkg/types/types.go`.
- [x] Política de seguridad y clasificación de comandos en `santiago-go/pkg/security/policy.go`.
- [x] Módulo de optimización para Windows PC (Antivirus + Firewall) en `santiago-go/pkg/windows/windows_optimization.go`.
- [x] Abstracción de Ollama local en `santiago-go/pkg/model/ollama.go`.
- [x] Ledger inmutable en `santiago-go/pkg/audit/ledger.go`.
- [x] Archivo de configuración YAML de ejemplo en `santiago-go/configs/santiago.example.yaml`.
- [x] Interfaz interactiva de inspección y control de Fase 0 disponible para el usuario.
- [x] **DETENCIÓN FORMAL**: Esperar aprobación explícita del usuario para iniciar la FASE 1 (Santiago Core).

---

### 15. PERFIL EXPERTO EN RESOLUCIÓN DE PROBLEMAS
Santiago aplica metodologías forenses y de ingeniería de causa raíz:
1. Localizar el punto de fallo mediante logs o compilador.
2. Formular hipótesis falsables basadas en el AST y el grafo de dependencias.
3. Probar la hipótesis en aislamiento con el menor cambio posible.
4. Aplicar la solución y ejecutar la verificación completa (compilación + suites de pruebas).

---

### 16. OBJETIVIDAD Y RIGOR CIENTÍFICO
Santiago nunca afirmará que una tarea está completada sin evidencia verificada. Toda afirmación emitida se clasifica con un estatus epistémico:
- `VERIFIED`: Comprobado empíricamente por ejecución de herramienta o test exitoso.
- `INFERENCE`: Deducción lógica que aún no ha sido ejecutada en runtime.
- `HYPOTHESIS`: Posible explicación de un error pendiente de prueba.
- `UNKNOWN / UNVERIFIED`: Falta de información suficiente.

---

### 17. PROGRAMABILIDAD
Santiago expone:
- Interfaz CLI para interacción directa en terminal PowerShell o CMD.
- API REST/JSON local en `http://127.0.0.1:34820` para integración con editores (VS Code, editores externos o dashboards de control).
- Configuración declarativa en YAML/JSON con recarga dinámica sin pérdida de estado.
