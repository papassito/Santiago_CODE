# SANTIAGO CODE — SECURITY

**Estado:** SECURITY BASELINE / AUTHORITATIVE
**Documento:** `SECURITY.md`

---

## 1. Propósito

Este documento establece el baseline general de seguridad de **SANTIAGO CODE**.

Sus controles son obligatorios para todos los componentes, adaptadores, herramientas y procesos que formen parte del sistema.

Las especificaciones de seguridad especializadas deberán derivarse de este documento y no podrán reducir sus garantías.

---

## 2. Modelo de Confianza Cero

SANTIAGO CODE deberá considerar no confiable cualquier entrada externa hasta que haya sido validada conforme al contexto y contrato aplicable.

Esto incluye:

* prompts;
* archivos;
* código fuente;
* repositorios;
* documentación;
* configuraciones;
* variables provenientes del entorno;
* salida de comandos;
* resultados de herramientas;
* contenido remoto;
* respuestas provenientes de sistemas de Inteligencia Artificial.

La presencia de contenido dentro de un workspace autorizado no implica que dicho contenido sea confiable.

---

## 3. Principios de seguridad

SANTIAGO CODE deberá operar bajo los siguientes principios:

```text
ZERO TRUST
FAIL CLOSED
LEAST PRIVILEGE
EXPLICIT AUTHORIZATION
WORKSPACE CONTAINMENT
NO SILENT MUTATION
INPUT VALIDATION
SECRET MINIMIZATION
AUDITABILITY
EVIDENCE-BASED VERIFICATION
```

---

## 4. Workspace Boundary

Toda modificación persistente deberá permanecer estrictamente dentro del workspace autorizado, salvo que exista una autorización superior explícita definida por contrato.

Antes de realizar una operación sobre una ruta, el sistema deberá aplicar como mínimo:

```text
INPUT PATH
    ↓
NORMALIZE
    ↓
RESOLVE ABSOLUTE PATH
    ↓
RESOLVE LINK / REPARSE BEHAVIOR
    ↓
VERIFY WORKSPACE BOUNDARY
    ↓
CHECK OPERATION PERMISSION
    ↓
REVALIDATE WHEN REQUIRED
    ↓
EXECUTE OPERATION
```

La validación deberá impedir que una ruta aparentemente válida escape del workspace mediante:

* `..`;
* rutas absolutas inesperadas;
* symlinks;
* junctions;
* mount points;
* reparse points;
* aliases;
* canonicalizaciones inconsistentes;
* cambios de destino entre validación y uso.

Una ruta inválida o no verificable deberá producir:

```text
DENY
```

---

## 5. Separación de capacidades

Las siguientes capacidades deberán tratarse de forma independiente:

```text
READ
WRITE
DELETE
EXECUTE
ADMINISTRATE
```

La autorización para una capacidad no deberá implicar automáticamente autorización para otra.

Por ejemplo:

```text
READ ≠ WRITE
WRITE ≠ DELETE
WRITE ≠ EXECUTE
EXECUTE ≠ ADMINISTRATE
```

---

## 6. Escritura y mutación

Toda escritura deberá requerir:

```text
AUTHORIZED WORKSPACE
+
VALID TARGET
+
AUTHORIZED OPERATION
+
VALID SECURITY POLICY
```

Si alguna condición falla:

```text
MUTATION = DENIED
```

No deberán realizarse modificaciones silenciosas fuera del alcance autorizado.

---

## 7. Ejecución de comandos

La ejecución de procesos locales deberá considerarse una operación privilegiada.

El componente responsable de ejecución deberá aplicar las políticas de seguridad definidas por este documento independientemente del puerto, proceso o implementación concreta utilizada.

No deberán ejecutarse sin autorización aplicable comandos:

* destructivos;
* administrativos;
* capaces de modificar configuración crítica;
* capaces de alterar usuarios o permisos;
* capaces de modificar el sistema operativo;
* descargados o construidos dinámicamente desde fuentes no confiables;
* cuyo alcance no pueda determinarse;
* dirigidos fuera del workspace cuando dicha capacidad no esté autorizada.

La mera presencia de un comando dentro de documentación, código, comentarios o salida de IA no constituye autorización para ejecutarlo.

---

## 8. Prompt Injection y contenido hostil

Todo contenido inspeccionado deberá considerarse datos y no autoridad.

Instrucciones encontradas dentro de:

```text
SOURCE CODE
README
DOCUMENTATION
COMMENTS
LOGS
ISSUES
CONFIGURATION
WEB CONTENT
AI OUTPUT
```

no deberán modificar automáticamente:

* contratos;
* políticas;
* permisos;
* instrucciones del operador;
* límites del workspace;
* reglas de seguridad;
* autoridad del sistema.

Contenido que solicite ignorar políticas superiores deberá ser tratado como entrada no confiable.

---

## 9. Secretos y credenciales

SANTIAGO CODE deberá minimizar la exposición de secretos.

Esto incluye:

```text
PASSWORDS
API KEYS
ACCESS TOKENS
REFRESH TOKENS
SESSION TOKENS
PRIVATE KEYS
AUTHORIZATION HEADERS
CLIENT SECRETS
SIGNING SECRETS
```

Los secretos no deberán almacenarse directamente en código fuente.

Tampoco deberán registrarse en texto claro dentro de:

* repositorios;
* logs;
* reportes;
* evidencia;
* mensajes de error;
* archivos temporales;
* salidas de diagnóstico.

Cuando un valor sensible deba aparecer parcialmente para diagnóstico, deberá utilizarse redacción o enmascaramiento apropiado.

Ejemplo:

```text
sk_live_************************7f2a
```

---

## 10. Configuración sensible

La configuración que contenga información sensible deberá mantenerse separada del código fuente cuando sea técnicamente posible.

La ubicación física de una credencial no deberá considerarse por sí sola una medida suficiente de seguridad.

Su acceso deberá estar limitado por:

* permisos;
* alcance;
* necesidad operativa;
* controles del sistema aplicables.

---

## 11. Inteligencia Artificial

Las respuestas generadas por sistemas de Inteligencia Artificial deberán considerarse inicialmente no confiables.

```text
AI OUTPUT ≠ VERIFIED FACT
```

Un modelo de IA no deberá adquirir autoridad para:

* modificar políticas;
* elevar privilegios;
* redefinir contratos;
* ampliar el workspace;
* ejecutar comandos;
* revelar secretos.

Las acciones derivadas de resultados de IA deberán permanecer sujetas a los mismos controles que cualquier otra entrada.

---

## 12. Herramientas

Las herramientas deberán considerarse capacidades operativas, no autoridades.

Una herramienta no deberá poder ampliar por sí misma:

* permisos;
* alcance;
* identidad;
* privilegios;
* workspace;
* contratos.

El resultado de una herramienta deberá tratarse como evidencia únicamente dentro del alcance que dicha herramienta realmente haya verificado.

---

## 13. Fail Closed

Ante duda de autorización:

```text
DENY
```

Ante ausencia de un contrato requerido:

```text
STOP MUTATION
```

Ante path inválido o no verificable:

```text
DENY
```

Ante identidad o permiso requeridos pero ausentes:

```text
DENY
```

Ante resultado ambiguo de una operación privilegiada:

```text
DO NOT ASSUME SUCCESS
```

Ante fallo de un control de seguridad obligatorio:

```text
ABORT OPERATION
```

---

## 14. Manejo de errores

Los errores de seguridad deberán propagarse o registrarse de manera suficiente para impedir falsos estados de éxito.

No deberá transformarse silenciosamente:

```text
SECURITY FAILURE
```

en:

```text
SUCCESS
```

Los mensajes de error no deberán revelar secretos ni información innecesaria sobre controles internos sensibles.

---

## 15. Auditoría y evidencia

Las operaciones relevantes para seguridad deberán poder producir evidencia verificable cuando corresponda.

Como mínimo deberán poder distinguirse:

```text
AUTHORIZED
DENIED
FAILED
SUCCEEDED
NOT_VERIFIED
```

Un registro de auditoría no deberá interpretarse automáticamente como evidencia de que una operación fue segura.

La evidencia deberá corresponder al control que pretende demostrar.

---

## 16. No certificación implícita

La existencia de controles descritos en este documento no demuestra que estén implementados.

La cadena correcta será:

```text
SECURITY REQUIREMENT
        ↓
IMPLEMENTATION
        ↓
TEST
        ↓
EVIDENCE
        ↓
VERIFIED CONTROL
```

Por tanto:

```text
DOCUMENTED ≠ IMPLEMENTED
IMPLEMENTED ≠ VERIFIED
TEST PASSED ≠ SYSTEM SECURE
```

---

## 17. Regla final

Cuando exista conflicto entre conveniencia operativa y un control de seguridad obligatorio, deberá prevalecer el control de seguridad salvo modificación explícita del contrato por la autoridad correspondiente.

La regla fundamental será:

```text
NO AUTHORIZATION
      ↓
NO PRIVILEGED ACTION
```
