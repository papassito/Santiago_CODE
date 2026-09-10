# SANTIAGO CODE — BUILD GUIDELINES

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/development/BUILD.md`

---

## 1. Prerrequisitos de Construcción Local

La compilación y el enlace de la suite de micro-daemons de **SANTIAGO CODE** se realizan sin dependencias externas ni servidores de integración remotos.
* **Compilador**: Go 1.22 o superior.
* **CGO**: Requerido exclusivamente para enlazar de forma estática las interfaces nativas de C++ de Tree-sitter y GGUF.
* **Herramientas**: Git expuesto localmente en la variable de entorno `PATH`.

Se prohibe de forma expresa la introducción de instaladores, frameworks o compiladores cruzados externos que no se encuentren presentes o autorizados en el baseline.

---

## 2. Procedimiento de Compilación Estática

Para compilar el binario completo de la plataforma en la raíz del workspace, el Runner Daemon (`:34822`) ejecutará de forma aislada:

```bash
go build -ldflags="-s -w" -o ./bin/santiago ./cmd/santiago
```

## 3. Certificación de Construcción Exitosa

Un manual o descripción escrita del build no demuestra el funcionamiento real en la máquina host.

```text
BUILD COMMAND DOCUMENTED ≠ BUILD PASSED
```

El estado de compilación exitosa (`SC-EXE-002`) requiere de forma obligatoria que el compilador de Go retorne un código de salida igual a cero y el binario resultante sea verificado en memoria por el Vault Enclave (`:34823`).
