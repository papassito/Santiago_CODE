# SANTIAGO CODE — PERFORMANCE

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `PERFORMANCE.md`

---

## 1. Propósito

Este documento establece los principios, requisitos y criterios de rendimiento de **SANTIAGO CODE**.

El objetivo de rendimiento no será maximizar velocidad a costa de seguridad, integridad, trazabilidad o verificación.

La prioridad fundamental será:

```text
CORRECTNESS
      ↓
SECURITY
      ↓
INTEGRITY
      ↓
TRACEABILITY
      ↓
PERFORMANCE
```

Una optimización nunca deberá invalidar una garantía establecida por una autoridad superior.

---

## 2. Principio fundamental

SANTIAGO CODE deberá utilizar los recursos disponibles de manera eficiente sin degradar comportamiento contractual.

```text
FASTER
      ≠
CORRECT
```

y:

```text
PERFORMANCE
      ✕
MUST NOT BYPASS
      ↓
SECURITY
AUTHORIZATION
VALIDATION
AUDIT
EVIDENCE
```

Una operación más rápida que omita controles obligatorios será `NON-COMPLIANT`.

---

## 3. Alcance

Las reglas de rendimiento aplican, cuando corresponda, a:

* Agent Engine;
* Governance Engine;
* Workspace Engine;
* Contract Engine;
* Planning Engine;
* AI Engine;
* Tool Engine;
* Audit Engine;
* Evidence Engine;
* Security Engine;
* acceso a archivos;
* análisis de código;
* ejecución de herramientas;
* procesos locales;
* persistencia;
* comunicación entre componentes;
* interfaces de usuario;
* tareas concurrentes.

---

## 4. Métricas

El rendimiento deberá evaluarse mediante métricas observables.

Las métricas podrán incluir:

```text
LATENCY
THROUGHPUT
CPU USAGE
MEMORY USAGE
DISK I/O
QUEUE DEPTH
CONCURRENCY
STARTUP TIME
RESPONSE TIME
EXECUTION TIME
RESOURCE CONTENTION
```

Una afirmación de mejora de rendimiento deberá identificar la métrica evaluada.

```text
"FASTER"
      ↓
REQUIRES
      ↓
MEASURED METRIC
```

---

## 5. Baseline

Toda optimización significativa deberá compararse contra un baseline identificable cuando se pretenda demostrar una mejora.

Conceptualmente:

```text
BASELINE
      ↓
CHANGE
      ↓
MEASUREMENT
      ↓
COMPARISON
      ↓
RESULT
```

Sin baseline o medición suficiente:

```text
PERFORMANCE IMPROVEMENT
      =
NOT VERIFIED
```

---

## 6. Latencia

Los componentes deberán evitar latencia innecesaria.

Las operaciones costosas deberán identificarse cuando afecten significativamente al flujo principal.

La reducción de latencia no deberá eliminar:

* validación;
* autorización;
* resolución segura de rutas;
* controles de seguridad;
* captura obligatoria de evidencia;
* manejo correcto de errores.

```text
LOW LATENCY
      ≠
BYPASS CONTROLS
```

---

## 7. Uso de CPU

Los componentes deberán evitar consumo innecesario o sostenido de CPU.

Deberán evitarse, salvo justificación explícita:

* ciclos de espera activa;
* polling agresivo innecesario;
* recomputación evitable;
* análisis repetido de datos sin cambios;
* serialización repetitiva innecesaria;
* procesos huérfanos;
* tareas duplicadas.

Cuando una operación intensiva sea necesaria, su alcance deberá permanecer controlado.

---

## 8. Memoria

SANTIAGO CODE deberá administrar la memoria de forma acotada y predecible.

Deberán evitarse:

* crecimiento ilimitado de colecciones;
* cachés sin política de límite;
* listeners no liberados;
* referencias retenidas innecesariamente;
* buffers ilimitados;
* acumulación indefinida de resultados;
* carga completa de recursos cuando pueda utilizarse procesamiento incremental seguro.

```text
UNBOUNDED MEMORY GROWTH
      =
PERFORMANCE DEFECT
```

Cuando además pueda comprometer disponibilidad:

```text
UNBOUNDED MEMORY GROWTH
      ↓
SECURITY / AVAILABILITY RISK
```

---

## 9. Recursos

Todo recurso adquirido deberá poseer un ciclo de vida definido.

Esto incluye:

* archivos;
* procesos;
* conexiones;
* sockets;
* streams;
* watchers;
* subscriptions;
* handles;
* workers;
* temporizadores;
* buffers;
* recursos de herramientas.

Conceptualmente:

```text
ACQUIRE
      ↓
USE
      ↓
RELEASE
```

La liberación deberá ocurrir también ante errores cuando sea técnicamente aplicable.

---

## 10. Procesamiento incremental

Cuando resulte apropiado, los componentes deberán preferir procesamiento incremental sobre carga indiscriminada de información.

Ejemplos:

```text
STREAM
CHUNK
PAGE
BATCH
INDEX
CACHE
```

La estrategia seleccionada deberá preservar la corrección del resultado.

Una optimización incremental no podrá omitir información requerida por el contrato de la operación.

---

## 11. Workspace

El análisis del workspace deberá evitar recorridos innecesarios.

Cuando corresponda, podrán aplicarse:

* filtros;
* exclusiones;
* índices;
* cachés;
* detección de cambios;
* procesamiento incremental;
* límites explícitos;
* cancelación.

Los filtros de rendimiento no deberán excluir silenciosamente archivos requeridos para una operación autorizada.

```text
PERFORMANCE FILTER
      ≠
AUTHORITY FILTER
```

---

## 12. Archivos grandes

Los archivos grandes deberán tratarse de manera controlada.

Cuando sea técnicamente posible, deberán evitarse cargas completas innecesarias en memoria.

El sistema podrá aplicar:

```text
SIZE LIMIT
STREAMING
CHUNKING
PARTIAL READ
INDEXED ACCESS
```

Si una limitación impide completar correctamente una operación:

```text
RESULT
      =
PARTIAL
```

o:

```text
RESULT
      =
NOT VERIFIED
```

según corresponda.

Nunca deberá presentarse como resultado completo.

---

## 13. Directorios grandes

Los workspaces con grandes cantidades de archivos deberán procesarse de forma que se evite:

* bloqueo prolongado innecesario;
* crecimiento ilimitado de memoria;
* recorridos repetitivos completos;
* análisis duplicado;
* saturación de I/O.

Cuando se utilicen exclusiones, estas deberán ser explícitas y compatibles con el objetivo de la operación.

---

## 14. Caché

La caché podrá utilizarse para reducir trabajo repetitivo.

Toda caché deberá considerar:

```text
KEY
VALUE
VALIDITY
INVALIDATION
LIFETIME
SIZE LIMIT
```

Una caché no deberá convertirse en fuente de autoridad.

```text
CACHE
      ≠
SOURCE OF TRUTH
```

Cuando exista riesgo de información obsoleta:

```text
REVALIDATE
```

La optimización mediante caché no deberá producir resultados presentados como actuales cuando su vigencia no pueda demostrarse.

---

## 15. Concurrencia

La concurrencia podrá utilizarse cuando produzca una mejora verificable y preserve la corrección.

Toda ejecución concurrente deberá considerar:

* race conditions;
* deadlocks;
* starvation;
* acceso concurrente a estado mutable;
* orden de operaciones;
* cancelación;
* límites de paralelismo;
* manejo de errores;
* consistencia de evidencia.

```text
CONCURRENT
      ≠
UNCONTROLLED
```

---

## 16. Paralelismo

El sistema no deberá asumir que mayor paralelismo implica mayor rendimiento.

```text
MORE WORKERS
      ≠
MORE PERFORMANCE
```

El paralelismo deberá permanecer limitado según:

* recursos disponibles;
* naturaleza de la tarea;
* dependencias;
* presión de memoria;
* I/O;
* seguridad;
* estabilidad.

Deberá evitarse la creación ilimitada de workers, goroutines, threads, procesos o tareas equivalentes.

---

## 17. Backpressure

Los productores de trabajo no deberán generar carga ilimitada sobre consumidores incapaces de procesarla.

Cuando exista procesamiento asíncrono o mediante colas deberá contemplarse backpressure.

Conceptualmente:

```text
PRODUCER
      ↓
BOUNDED QUEUE
      ↓
CONSUMER
```

Cuando la capacidad disponible sea insuficiente deberán aplicarse mecanismos explícitos de:

```text
WAIT
REJECT
DEFER
CANCEL
```

según el contrato aplicable.

---

## 18. Colas

Toda cola deberá poseer límites y comportamiento definido.

Una cola no deberá crecer indefinidamente.

Deberán definirse, cuando resulte aplicable:

```text
CAPACITY
ORDER
PRIORITY
TIMEOUT
RETRY POLICY
CANCELLATION
OVERFLOW BEHAVIOR
```

Un desbordamiento no deberá convertirse silenciosamente en pérdida de operaciones.

---

## 19. Timeouts

Las operaciones potencialmente bloqueantes deberán admitir límites temporales cuando resulte técnicamente apropiado.

Ejemplos:

* procesos;
* herramientas;
* comunicación entre componentes;
* proveedores de IA;
* lectura de streams;
* análisis externos;
* operaciones de red autorizadas.

Un timeout deberá producir un estado explícito.

```text
TIMEOUT
      ≠
SUCCESS
```

---

## 20. Cancelación

Las operaciones de larga duración deberán permitir cancelación cuando su naturaleza lo permita.

La cancelación deberá propagarse a los componentes dependientes cuando sea seguro hacerlo.

```text
CANCEL REQUEST
      ↓
STOP NEW WORK
      ↓
PROPAGATE
      ↓
RELEASE RESOURCES
      ↓
REPORT FINAL STATE
```

La cancelación no deberá dejar una mutación persistente en un estado falsamente declarado como completo.

---

## 21. Retries

Los reintentos automáticos deberán ser limitados y explícitos.

```text
RETRY
      ≠
INFINITE LOOP
```

Antes de reintentar una operación deberá considerarse si la operación es:

```text
SAFE TO RETRY
IDEMPOTENT
NON-IDEMPOTENT
UNKNOWN
```

Las operaciones con efectos persistentes no deberán repetirse ciegamente.

---

## 22. I/O

Las operaciones de entrada y salida deberán minimizar trabajo redundante.

Cuando sea apropiado deberán utilizarse:

* buffering controlado;
* batching;
* escritura incremental;
* lectura selectiva;
* reducción de accesos repetidos;
* reutilización segura de recursos.

Las optimizaciones de I/O no deberán comprometer integridad de datos.

---

## 23. Persistencia

Las operaciones persistentes deberán priorizar integridad sobre velocidad.

```text
DATA INTEGRITY
      >
WRITE SPEED
```

Las optimizaciones de persistencia no deberán:

* omitir validaciones;
* ignorar errores;
* declarar éxito antes de conocer el resultado requerido;
* perder trazabilidad obligatoria;
* producir estados parcialmente persistidos presentados como completos.

---

## 24. Logging

El logging deberá proporcionar información suficiente sin convertirse en una fuente innecesaria de degradación.

Deberá evitarse:

* logging redundante masivo;
* serialización costosa innecesaria;
* escritura repetitiva de información idéntica;
* registro indiscriminado de payloads grandes.

La reducción de logging no podrá eliminar eventos requeridos para:

* seguridad;
* auditoría;
* evidencia;
* diagnóstico obligatorio.

```text
LESS LOGGING
      ≠
LESS TRACEABILITY
```

---

## 25. Evidence Engine

La captura de evidencia deberá ser proporcional al alcance de la operación.

No deberá recopilarse información ilimitada cuando una evidencia más pequeña sea suficiente.

Conceptualmente:

```text
SUFFICIENT EVIDENCE
      >
MAXIMUM DATA COLLECTION
```

La optimización de evidencia no deberá eliminar información necesaria para verificar la afirmación correspondiente.

---

## 26. Audit Engine

Las auditorías deberán evitar análisis repetidos innecesarios cuando exista evidencia válida y vigente que pueda reutilizarse conforme a política.

Sin embargo:

```text
OLD EVIDENCE
      ≠
CURRENT EVIDENCE
```

Cuando el estado relevante pueda haber cambiado deberá realizarse nueva verificación.

---

## 27. AI Engine

El rendimiento del AI Engine deberá evaluarse independientemente del proveedor concreto.

Podrán medirse:

```text
REQUEST LATENCY
RESPONSE LATENCY
QUEUE TIME
PROCESSING TIME
FAILURE RATE
TIMEOUT RATE
RESOURCE USAGE
```

El sistema no deberá sacrificar:

* validación;
* seguridad;
* protección de secretos;
* clasificación de salida;
* autorización;

para reducir latencia.

---

## 28. Tool Engine

Las herramientas externas deberán ejecutarse con límites de recursos cuando resulte necesario.

Deberán contemplarse:

* timeout;
* cancelación;
* captura controlada de salida;
* tamaño máximo razonable de buffers;
* terminación de procesos;
* cleanup;
* códigos de salida.

Una herramienta que produce salida ilimitada no deberá provocar crecimiento ilimitado de memoria.

---

## 29. Interfaz de usuario

Las operaciones costosas no deberán bloquear innecesariamente la interfaz cuando exista una estrategia segura para ejecutarlas de forma asíncrona.

La interfaz deberá poder distinguir estados como:

```text
IDLE
QUEUED
RUNNING
PARTIAL
SUCCEEDED
FAILED
CANCELLED
NOT VERIFIED
```

La percepción de respuesta de la interfaz no deberá lograrse declarando éxito antes de tiempo.

---

## 30. Startup

El arranque deberá ejecutar únicamente las operaciones necesarias para establecer un estado válido y seguro.

Las tareas no críticas podrán diferirse cuando ello no afecte:

* contratos;
* seguridad;
* configuración obligatoria;
* integridad;
* capacidad de operación correcta.

```text
FAST STARTUP
      ≠
INCOMPLETE INITIALIZATION
```

---

## 31. Degradación controlada

Cuando un componente no crítico presente degradación de rendimiento, el sistema podrá reducir capacidades siempre que el resultado sea explícito.

Ejemplos:

```text
FULL
      ↓
DEGRADED

COMPLETE
      ↓
PARTIAL
```

Nunca:

```text
DEGRADED
      ↓
CLAIM FULL SUCCESS
```

---

## 32. Límites

Los límites operativos deberán configurarse explícitamente cuando exista riesgo de consumo no acotado.

Podrán existir límites para:

```text
FILE SIZE
DIRECTORY SIZE
QUEUE SIZE
OUTPUT SIZE
MEMORY
CONCURRENCY
EXECUTION TIME
RETRY COUNT
BATCH SIZE
CACHE SIZE
```

Los valores concretos deberán definirse en configuración, arquitectura o contratos especializados cuando corresponda.

Este documento no impone valores arbitrarios sin evidencia de necesidad.

---

## 33. Benchmarking

Los benchmarks deberán ejecutarse en condiciones identificables y reproducibles cuando se utilicen como evidencia.

Deberán registrar, cuando corresponda:

```text
VERSION
ENVIRONMENT
HARDWARE
INPUT
CONFIGURATION
WORKLOAD
METRIC
RESULT
TIMESTAMP
```

Un benchmark aislado no deberá generalizarse automáticamente a todos los escenarios.

---

## 34. Performance Regression

Una degradación significativa respecto de un baseline establecido deberá clasificarse como regresión cuando exista evidencia suficiente.

Conceptualmente:

```text
BASELINE
      ↓
NEW RESULT
      ↓
MEASURED DEGRADATION
      ↓
PERFORMANCE REGRESSION
```

La existencia de una regresión deberá evaluarse junto con su impacto funcional y operativo.

---

## 35. Optimización

Toda optimización deberá preservar:

```text
CONTRACTS
REQUIREMENTS
SECURITY
ARCHITECTURE
CORRECTNESS
AUDITABILITY
EVIDENCE
```

No deberá aceptarse:

```text
OPTIMIZATION
      ↓
BREAKS CONTRACT
```

Una optimización que altere comportamiento contractual requerirá primero una decisión de gobernanza conforme a `DOCS.md` y `CONTRACTS.md`.

---

## 36. Anti-optimización prematura

No deberán introducirse mecanismos complejos de rendimiento sin una necesidad demostrable cuando aumenten significativamente:

* complejidad;
* superficie de error;
* superficie de ataque;
* dificultad de auditoría;
* dificultad de mantenimiento.

La secuencia preferida será:

```text
CORRECT IMPLEMENTATION
      ↓
MEASURE
      ↓
IDENTIFY BOTTLENECK
      ↓
OPTIMIZE
      ↓
MEASURE AGAIN
      ↓
VERIFY
```

---

## 37. Evidencia de rendimiento

Las afirmaciones de rendimiento deberán clasificarse conforme a la evidencia disponible.

```text
MEASURED
VERIFIED
PARTIAL
NOT VERIFIED
```

No deberá declararse:

```text
FASTER
MORE EFFICIENT
LOWER MEMORY
LOWER LATENCY
HIGHER THROUGHPUT
```

sin mediciones pertinentes cuando dichas expresiones se presenten como resultados verificados.

---

## 38. Relación con seguridad

La disponibilidad forma parte de la postura de seguridad cuando el agotamiento de recursos pueda afectar la operación.

Por tanto deberán considerarse riesgos como:

```text
RESOURCE EXHAUSTION
UNBOUNDED QUEUES
UNBOUNDED MEMORY
PROCESS EXPLOSION
THREAD / WORKER EXPLOSION
DISK EXHAUSTION
LOG FLOODING
OUTPUT FLOODING
```

Los controles correspondientes deberán alinearse con `SECURITY.md`.

---

## 39. Relación con evidencia

Una optimización no deberá reducir la capacidad de demostrar qué ocurrió.

```text
PERFORMANCE
      +
TRACEABILITY
      +
EVIDENCE
```

deberán coexistir.

Si una optimización impide verificar una operación crítica, dicha optimización no deberá considerarse válida.

---

## 40. Autoridad

`PERFORMANCE.md` define criterios de rendimiento dentro de su dominio.

Permanece subordinado a las autoridades superiores aplicables.

```text
CONTRACTS.md
      ↓
REQUIREMENTS.md
      ↓
SECURITY.md
      ↓
ARCHITECTURE.md
      ↓
PERFORMANCE.md
      ↓
IMPLEMENTATION
```

Cuando una regla de rendimiento contradiga una garantía superior:

```text
HIGHER AUTHORITY
      ↓
PREVAILS
```

---

## 41. Regla de cierre

El rendimiento de SANTIAGO CODE deberá optimizarse únicamente después de preservar corrección, seguridad e integridad.

```text
CORRECT
      ↓
SAFE
      ↓
MEASURABLE
      ↓
OPTIMIZABLE
      ↓
VERIFIABLE
```

La regla fundamental será:

```text
NEVER TRADE CORRECTNESS
OR SECURITY
FOR UNVERIFIED PERFORMANCE
```
