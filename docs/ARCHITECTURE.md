# SANTIAGO CODE — ARCHITECTURE

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/architecture/ARCHITECTURE.md`

---

## 1. Patrón Hexagonal y Desacoplamiento Estricto

**SANTIAGO CODE** implementa una arquitectura hexagonal pura (Puertos y Adaptadores) acoplada de forma determinista para garantizar un desarrollo libre de dependencias cruzadas y modularizado localmente.

El núcleo de negocio (Domain) define Interfaces abstractas (Ports) a través de las cuales se comunica con el sistema operativo, base de datos, redes locales y motores de inteligencia artificial. Los módulos concretos (Adapters) implementan estas interfaces.

La dirección de acoplamiento de dependencias estáticas se rige de manera obligatoria por el principio de entrada hacia el núcleo de dominio:

```text
CORE (Domain/Governance) ──► CONTRACTS / PORTS (Abstracts) ──► ADAPTERS (Infrastructure)
```

Ningún componente de la lógica central del sistema puede importar directamente detalles del sistema de archivos, red local, sockets o librerías de infraestructura concretas.

---

## 2. Los 4 Micro-Daemons Locales (The Swarm)

La plataforma no delega su ejecución en una única gran aplicación monolítica. En su lugar, el sistema se orquesta distribuyendo responsabilidades críticas en un enjambre de micro-servicios autónomos en Go que operan exclusivamente en interfaces locales:

```text
                       [ SANTIAGO STUDIO UI ]
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
  [:34820]                  [:34821]                  [:34822]
Gateway Router             RAG AST Memory          Runner Daemon
       │                         │                         │
       └─────────────────────────┼─────────────────────────┘
                                 ▼
                            [:34823]
                         Vault Enclave
```

### 2.1. Santiago Gateway Router (`:34820`)
* **Tecnología**: Go 1.22 + GGUF Engine.
* **Responsabilidad**: Orquestar la inferencia local de baja latencia (Ghost Text sub-50ms) y actuar como proxy reverso seguro.

### 2.2. Santiago RAG AST Memory (`:34821`)
* **Tecnología**: Go + Tree-sitter + HNSW Vector Graph.
* **Responsabilidad**: Análisis sintáctico del código del workspace, indización de símbolos del AST de forma incremental y resolución del grafo de dependencias en RAM.

### 2.3. Santiago Runner Daemon (`:34822`)
* **Tecnología**: Go + Linux Namespaces / Isolated PTY.
* **Responsabilidad**: Creación de pseudo-terminales (PTY) aisladas, sandbox de ejecución de compiladores, linters y capturador de códigos de salida reales.

### 2.4. Santiago Vault Enclave (`:34823`)
* **Tecnología**: Go + ChaCha20-Poly1305 + Argon2id.
* **Responsabilidad**: Almacenamiento seguro del estado sensible y de los hashes de auditoría en memoria protegida, aislando las claves de variables de entorno globales.

---

## 3. Modelo de Seguridad Interproceso (Vault Tokens)

Para mitigar vectores de ataque propios de servicios locales, tales como **DNS Rebinding** o **WebSocket Hijacking**, los micro-daemons implementan:

1. **Tokens de Sesión de Corta Duración**: Al arrancar, el Vault Enclave (`:34823`) genera un par de llaves asimétricas y distribuye tokens criptográficos efímeros a los daemons Gateway y Runner.
2. **Validación de Origen Estricta**: Cada llamada RPC local en los puertos `:34820-34823` exige la cabecera `X-Santiago-Token` derivada criptográficamente.
3. **CORS / Referer Restrictions**: Se bloquean conexiones que no provengan explícitamente de los puertos autorizados del editor o la extensión de Santiago.

---

## 4. Trazabilidad del AST de Mutaciones

Antes de que el Runner de Santiago aplique un parche en el sistema de archivos local (`ACTUAR`), se ejecuta el validador estático:

```text
     [ PARCHE DE CÓDIGO ]
               │
               ▼
     [ Tree-sitter Parser ]
               │
               ├─► ¿Contiene violaciones del Mutation Contract? ──► [ ABORT ]
               │
               └─► ¿Introduce importaciones de red no declaradas? ─► [ ABORT ]
               │
               ▼
     [ ESCRITURA EN DISCO ]
```

---

## 5. Invariantes de la Arquitectura

* **Invariante 1**: Ningún daemon puede abrir conexiones a sockets remotos externos sin emitir una alerta crítica al Audit Trail.
* **Invariante 2**: El estado de salud de todos los daemons debe consultarse de forma periódica en un bucle continuo de 10 segundos para garantizar la resiliencia reactiva de la interfaz de usuario.
* **Invariante 3**: Los adaptadores de infraestructura jamás deben instanciar lógica de dominio de forma directa; la comunicación debe ser mediada a través de las abstracciones definidas en `COMPONENTS.md`.

---

## 6. Regla de Cierre

> El enjambre de micro-daemons de Santiago constituye un perímetro cerrado de ejecución de procesos locales y autogobernados. Ninguna abstracción de interfaz o editor externo de código puede obligar a un micro-daemon a delegar su autoridad o relajar sus controles criptográficos.