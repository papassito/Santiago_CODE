# SANTIAGO CODE — CONFIGURATION PROTOCOLS

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/operations/CONFIGURATION.md`

---

## 1. Fuentes de Configuración Autorizadas

SANTIAGO CODE administra sus parámetros lógicos de forma descentralizada para evitar riesgos de inyección de variables externas. La configuración se lee exclusivamente de:
* Archivos locales de configuración en formato JSON ubicados bajo la raíz autorizada.
* Tokens criptográficos efímeros inyectados en memoria por el Vault Enclave (`:34823`).

Se prohibe terminantemente documentar valores secretos reales, claves de red de producción o headers en texto claro dentro de este archivo.

---

## 2. Comportamiento ante Configuración Inválida

Si un archivo de configuración obligatorio falta en el workspace o si un parámetro contiene valores corruptos o fuera del rango seguro, el sistema disparará la detención segura de la secuencia de arranque.

```text
INVALID REQUIRED CONFIGURATION ──► FAIL CLOSED
```

El error de configuración reportará de inmediato la severidad `CRITICAL` y abortará la inicialización de sockets del Gateway Router, evitando que el sistema quede expuesto en estados vulnerables o desprotegidos.

## 3. Prohibición de Almacenamiento de Secretos

Queda estrictamente prohibido colocar claves API, contraseñas de sistemas locales o llaves privadas de cifrado de forma plana dentro de archivos de configuración JSON o código fuente. 

Cualquier valor de secreto debe ser derivado dinámicamente mediante handshakes autenticados con el Vault Enclave en tiempo de ejecución.
