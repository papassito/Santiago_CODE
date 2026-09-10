# SANTIAGO CODE — AI PROVIDER CONTRACT

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/contracts/AI_PROVIDER_CONTRACT.md`

---

## 1. Independencia del Proveedor (Provider-Neutrality)

La lógica del núcleo (Domain Core) de **SANTIAGO CODE** interactúa con las capacidades de procesamiento de lenguaje a través del puerto de abstracción de IA, garantizando un acoplamiento nulo con marcas, modelos de lenguaje, API keys o endpoints externos de terceros.

La sustitución de adaptadores o la caída en la disponibilidad del proveedor configurado no alterará en ningún escenario los contratos de gobernanza y seguridad aplicados sobre el sistema de archivos del host.

---

## 2. Inferencia Confinada y Clasificación de Datos

La inferencia se orquesta localmente a través de adaptadores locales en los puertos del enjambre (`:34820`). Antes de transmitir cualquier fragmento de información al motor de inferencia, los datos se clasifican obligatoriamente:
* **`PUBLIC` / `INTERNAL` / `CONFIDENTIAL`**: Datos lógicos relativos a documentación o estructuras del AST.
* **`SECRET`**: Credenciales de bases de datos, claves de cifrado o llaves del Vault.

```text
SECRET DATA IS BLOCKED FROM LLM INPUT
```

Bajo ninguna justificación técnica se enviarán secretos de la plataforma o del host al contexto del prompt del modelo de lenguaje.

## 3. Estado de Desconfianza por Defecto

Toda sugerencia de código, respuesta en lenguaje natural o plan de acción generado por el modelo de IA se clasifica como propuesta no validada.

```text
AI OUTPUT = UNTRUSTED OUTPUT UNTIL VALIDATED
```

Antes de que cualquier propuesta en formato de parche de código sea aplicada por el Runner Daemon, se parseará y auditará mediante análisis estático de AST (Tree-sitter) en la capa de seguridad.
