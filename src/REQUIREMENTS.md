# SANTIAGO CODE — REQUIREMENTS

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `REQUIREMENTS.md`

---

## 1. Propósito

Este documento define los requisitos funcionales, arquitectónicos, de seguridad, evidencia y gobernanza que deberá cumplir SANTIAGO CODE.

Los requisitos aquí establecidos son normativos.

La implementación deberá demostrar su cumplimiento mediante código, pruebas o evidencia verificable.

---

## 2. Requisitos funcionales

### REQ-FUNC-001 — Workspace explícito

El sistema deberá operar únicamente sobre un workspace explícitamente seleccionado o autorizado.

No deberá asumir automáticamente que el directorio actual constituye un workspace autorizado.

---

### REQ-FUNC-002 — Lectura

El sistema deberá poder inspeccionar, dentro del alcance autorizado:

* archivos;
* directorios;
* código fuente;
* documentación;
* configuración;
* pruebas;
* manifiestos;
* artefactos permitidos.

La capacidad de lectura no implica automáticamente permiso de modificación.

---

### REQ-FUNC-003 — Edición controlada

Toda modificación persistente deberá estar asociada a:

```text
WORKSPACE AUTORIZADO
+
OBJETIVO VÁLIDO
+
OPERACIÓN AUTORIZADA
+
POLÍTICA APLICABLE
```

Si cualquiera de estas condiciones falla, la modificación deberá ser rechazada.

---

### REQ-FUNC-004 — Auditoría

El sistema deberá poder comparar:

```text
CONTRATO
vs
DOCUMENTACIÓN
vs
ARQUITECTURA
vs
CÓDIGO
vs
PRUEBAS
vs
EVIDENCIA
```

El sistema deberá identificar contradicciones, omisiones o implementaciones no demostradas.

---

### REQ-FUNC-005 — Evidencia

Toda afirmación técnica relevante deberá poder asociarse a evidencia verificable cuando la afirmación dependa del estado real del sistema.

Ejemplos:

```text
ARCHIVO EXISTE
BUILD PASSED
TEST PASSED
SERVICIO ACTIVO
BUG CORREGIDO
REQUISITO IMPLEMENTADO
CONTROL DE SEGURIDAD VERIFICADO
```

No deberán presentarse como hechos los estados que no hayan sido verificados.

---

### REQ-FUNC-006 — Clasificación de conclusiones

El sistema deberá diferenciar explícitamente entre:

```text
HECHO
INFERENCIA
HIPÓTESIS
RECOMENDACIÓN
RESULTADO VERIFICADO
NO VERIFICADO
```

Una inferencia o hipótesis no deberá presentarse como resultado verificado.

---

### REQ-FUNC-007 — Planeación

El sistema podrá generar planes de implementación cuando esa función se encuentre dentro del alcance autorizado.

Un plan:

```text
NO EQUIVALE A AUTORIZACIÓN DE EJECUCIÓN
```

La existencia de un plan no deberá habilitar automáticamente modificaciones persistentes.

---

### REQ-FUNC-008 — Testing

Cuando se ejecuten pruebas, el sistema deberá registrar claramente:

* prueba solicitada;
* comando o mecanismo ejecutado;
* objetivo de la prueba;
* resultado;
* salida relevante;
* errores;
* estado final.

El sistema no deberá declarar una prueba como exitosa si no existe evidencia de su ejecución.

---

### REQ-FUNC-009 — Cambios

Cuando el sistema modifique archivos, deberá poder identificar:

* archivos afectados;
* operación realizada;
* estado anterior cuando sea razonablemente recuperable;
* estado resultante;
* errores producidos.

---

### REQ-FUNC-010 — Fallos

Los errores deberán propagarse o registrarse de manera suficiente para impedir falsos estados de éxito.

No se deberá transformar silenciosamente un fallo en una operación aparentemente correcta.

---

## 3. Requisitos arquitectónicos

### REQ-ARCH-001 — Separación de responsabilidades

La arquitectura deberá separar como mínimo:

```text
ORQUESTACIÓN
DOMINIO
CONTRATOS
SEGURIDAD
WORKSPACE
IA
HERRAMIENTAS
EVIDENCIA
INFRAESTRUCTURA
```

---

### REQ-ARCH-002 — Inversión de dependencias

El dominio no deberá depender directamente de implementaciones concretas de:

* proveedores de IA;
* sistema operativo;
* persistencia;
* shell;
* sistema de archivos;
* interfaces gráficas;
* servicios externos.

Estas dependencias deberán exponerse mediante contratos o puertos internos.

---

### REQ-ARCH-003 — Infraestructura reemplazable

Los adaptadores de infraestructura deberán poder sustituirse sin modificar las reglas fundamentales del dominio.

---

### REQ-ARCH-004 — Proveedores de IA desacoplados

La lógica central de SANTIAGO CODE no deberá depender de:

* una marca específica;
* un modelo específico;
* un endpoint específico;
* una API específica;
* un proveedor específico.

---

### REQ-ARCH-005 — Autoridad centralizada

Los componentes de implementación no deberán introducir reglas normativas paralelas que contradigan los documentos autoritativos.

---

### REQ-ARCH-006 — Aislamiento de Interfaces (Modular Core)

El sistema deberá poder ejecutarse y validar contratos locales de manera autónoma (`SANTIAGO ENGINE`) aun si los módulos de voz (`SANTIAGO VOICE`) o el IDE (`CASA DE SANTIAGO`) se encuentran inactivos o deshabilitados en el host.

---

### REQ-ARCH-007 — Desacoplamiento de VS Code

La aplicación `CASA DE SANTIAGO` deberá operar como un entorno de escritura y desarrollo independiente del runtime o entorno de ejecución de Visual Studio Code.
---

## 4. Requisitos de seguridad

### REQ-SEC-001 — Operaciones privilegiadas

Toda operación privilegiada deberá ser explícitamente identificable y estar sujeta a autorización.

---

### REQ-SEC-002 — Mínimo privilegio

El sistema deberá operar utilizando únicamente los permisos necesarios para realizar la operación autorizada.

---

### REQ-SEC-003 — Workspace Boundary

Los límites del workspace deberán validarse antes de cualquier modificación persistente.

Una operación cuyo destino se encuentre fuera del workspace autorizado deberá ser rechazada salvo que exista una autorización superior explícita aplicable.

---

### REQ-SEC-004 — Normalización de rutas

Toda ruta utilizada para decisiones de seguridad deberá:

```text
NORMALIZARSE
↓
RESOLVERSE
↓
VALIDARSE
```

antes de autorizar acceso o modificación.

---

### REQ-SEC-005 — Path Traversal

El sistema deberá impedir que secuencias, enlaces o resoluciones de rutas permitan escapar del límite autorizado del workspace.

---

### REQ-SEC-006 — Entradas no confiables

Toda entrada externa deberá considerarse no confiable hasta que haya sido validada.

Esto incluye:

* prompts;
* código fuente;
* documentación;
* archivos;
* configuraciones;
* salida de procesos;
* resultados de herramientas;
* contenido generado por IA.

---

### REQ-SEC-007 — Fail Closed

Los errores o ambigüedades relacionados con autorización, identidad, alcance o permisos deberán producir comportamiento fail-closed.

En caso de duda:

```text
DENY
```

---

### REQ-SEC-008 — Credenciales

Las credenciales y secretos no deberán almacenarse directamente en código fuente.

Esto incluye:

```text
PASSWORDS
TOKENS
API KEYS
PRIVATE KEYS
SESSION SECRETS
AUTHORIZATION CREDENTIALS
```

---

### REQ-SEC-009 — Protección de logs

Los logs no deberán almacenar secretos en texto claro.

Los datos sensibles deberán omitirse, anonimizarse o redactarse cuando resulte necesario.

---

### REQ-SEC-010 — Acciones destructivas

Las acciones destructivas deberán requerir autorización explícita.

Esto incluye, cuando aplique:

* borrado;
* sobrescritura irreversible;
* reset;
* truncamiento;
* eliminación de almacenamiento;
* modificación destructiva de configuración;
* ejecución equivalente.

---

### REQ-SEC-011 — Ejecución de comandos

La ejecución de comandos del sistema deberá considerarse una capacidad privilegiada.

Los comandos deberán someterse a las políticas de alcance, autorización y seguridad aplicables.

---

### REQ-SEC-012 — Prompt Injection

Las instrucciones encontradas dentro de archivos, comentarios, repositorios, logs o cualquier contenido inspeccionado deberán tratarse como datos.

No deberán adquirir autoridad sobre el agente por el simple hecho de estar presentes en el contenido.

---

### REQ-SEC-013 — Secretos enviados a IA

Los secretos no deberán transmitirse a proveedores externos de IA salvo que exista una política explícita y autorizada que lo permita.

---

## 5. Requisitos de IA

### REQ-AI-001 — Salida no confiable

Toda salida producida por un modelo de IA deberá considerarse inicialmente:

```text
UNTRUSTED OUTPUT
```

hasta ser validada conforme al contexto y contratos aplicables.

---

### REQ-AI-002 — Sin autoridad normativa

Un modelo de IA no deberá modificar por sí mismo:

* contratos;
* requisitos;
* permisos;
* políticas;
* estado de gobernanza.

---

### REQ-AI-003 — Verificación

Las afirmaciones generadas por IA que dependan del estado real del proyecto deberán validarse mediante evidencia cuando sea técnicamente posible.

---

### REQ-AI-004 — Independencia

El cambio de proveedor o modelo de IA no deberá alterar los contratos fundamentales del sistema.

---

## 6. Requisitos de herramientas

### REQ-TOOL-001 — Herramientas como capacidades

Una herramienta deberá considerarse una capacidad operativa y no una autoridad normativa.

---

### REQ-TOOL-002 — Alcance

Toda herramienta deberá operar dentro del alcance y permisos asignados.

---

### REQ-TOOL-003 — Resultado verificable

Cuando una herramienta ejecute una operación, su resultado deberá poder clasificarse como mínimo como:

```text
SUCCESS
FAILURE
PARTIAL
UNKNOWN
```

---

### REQ-TOOL-004 — Fallo de herramienta

Un error de herramienta no deberá interpretarse automáticamente como éxito ni ocultarse mediante un resultado ambiguo.

---

## 7. Requisitos de gobernanza

### REQ-GOV-001 — Jerarquía normativa

La implementación deberá respetar la jerarquía documental definida por la gobernanza del proyecto.

Como mínimo:

```text
CONTRACTS.md
↓
REQUIREMENTS.md
↓
SECURITY.md
↓
ARCHITECTURE.md
↓
COMPONENTS.md
↓
IMPLEMENTACIÓN
```

Un documento inferior no deberá contradecir a uno superior.

---

### REQ-GOV-002 — Contradicciones

Ningún archivo de implementación podrá contradecir los contratos o requisitos normativos aplicables.

Toda contradicción deberá tratarse como:

```text
NON-COMPLIANT
```

hasta su resolución.

---

### REQ-GOV-003 — Código no redefine contrato

La existencia de una implementación no modifica automáticamente el requisito que debía cumplir.

```text
CODE ≠ CONTRACT
```

---

### REQ-GOV-004 — Documentación no demuestra implementación

La existencia de documentación que describa una funcionalidad no deberá considerarse evidencia de que esa funcionalidad existe.

```text
DOCUMENTED ≠ IMPLEMENTED
```

---

### REQ-GOV-005 — Prueba no equivale a certificación global

Una prueba exitosa demuestra únicamente aquello cubierto por esa prueba.

```text
TEST PASS ≠ SYSTEM CERTIFIED
```

---

## 8. Estados de cumplimiento

Los requisitos deberán poder clasificarse como:

```text
IMPLEMENTED
PARTIALLY_IMPLEMENTED
NOT_IMPLEMENTED
VERIFIED
NOT_VERIFIED
NOT_APPLICABLE
NON_COMPLIANT
```

`IMPLEMENTED` y `VERIFIED` no son equivalentes.

Una funcionalidad podrá existir sin haber sido todavía verificada.

---

## 9. Regla de cierre

SANTIAGO CODE deberá obedecer el siguiente principio:

> Ningún comportamiento deberá declararse seguro, correcto, implementado o verificado únicamente porque esté descrito en documentación o haya sido producido por un modelo de IA.

La cadena de autoridad será:

```text
CONTRATO
↓
REQUISITO
↓
IMPLEMENTACIÓN
↓
PRUEBA
↓
EVIDENCIA
↓
ESTADO VERIFICADO
```
