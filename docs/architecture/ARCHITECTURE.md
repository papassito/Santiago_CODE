# SANTIAGO CODE — SYSTEM ARCHITECTURE

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/architecture/ARCHITECTURE.md`

---

## 1. Patrón Hexagonal Soberano

**SANTIAGO CODE** implementa una arquitectura desacoplada basada en puertos y adaptadores. La lógica central del sistema se mantiene agnóstica de los entornos de ejecución visuales o de red:

```text id="arch-hex-flow"
SANTIAGO ENGINE (Core) ──► PORTS (internal/contracts) ──► ADAPTERS (Localhost loopback)
```

---

## 2. Aislamiento de SANTIAGO ENGINE

El motor de Santiago opera de manera autónoma e independiente de cualquier IDE o interfaz de usuario. Al arrancar, expone micro-servicios distribuidos en interfaces locales protegidas:

* **Santiago Gateway Router (`:34820`)**: Expone la interfaz RPC segura para consumo de `CASA DE SANTIAGO` y `SANTIAGO VS CODE EXTENSION`.
* **Santiago RAG AST Memory (`:34821`)**: Analiza la jerarquía estática de código del workspace de forma incremental.
* **Santiago Runner Daemon (`:34822`)**: Ejecuta compiladores y pruebas lógicas dentro de entornos de sandbox locales.
* **Santiago Vault Enclave (`:34823`)**: Custodia los secretos y tokens efímeros necesarios para firmar las llamadas locales inter-daemons.

---

## 3. Interfaz del Subsistema SANTIAGO VOICE (Opcional)

El módulo de voz (`SANTIAGO VOICE`) se vincula de forma externa mediante handshakes controlados por tokens asimétricos generados por el Vault Enclave. Las intenciones reconocidas a través del modelo Whisper local se parsean de forma previa en el motor para evitar comandos destructivos no deseados.

---

## 4. Independencia de CASA DE SANTIAGO

`CASA DE SANTIAGO` es un entorno gráfico propietario de desarrollo. Se comunica con el motor exclusivamente mediante solicitudes HTTP locales autenticadas con la cabecera `X-Santiago-Token`.

* No requiere la presencia de Visual Studio Code ni sus librerías asociadas en memoria.
* Satisface las capacidades de un editor moderno (Monaco Editor integrado, file explorer modular y consola PTY interactiva).

---

## 5. Regla de Cierre

> El acoplamiento estrecho o la dependencia cíclica entre los módulos de visualización y el motor está prohibido. El sistema mantiene una separación limpia de responsabilidades garantizada por el modelo de gobernanza documental de Santiago.
