# SANTIAGO CODE — TESTING STRATEGY

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/development/TESTING.md`

---

## 1. Suite de Pruebas de Integración

Para validar que los cambios de código no degradan el baseline de seguridad ni introducen regresiones de latencia, el sistema cuenta con pruebas locales automatizadas bajo el directorio `tests/`:
* **Pruebas de Aislamiento de Red**: Validación del confinamiento y la ausencia absoluta de fuga de telemetría hacia dominios externos públicos.
* **Pruebas de Latencia SLA**: Verificación de que el Gateway Router responde a las peticiones locales de autocompletado en un intervalo inferior a 80 milisegundos en P95.
* **Pruebas de Fronteras del Workspace**: Validación defensiva que inyecta de forma deliberada symlinks corruptos o rutas complejas con `..` para verificar el bloqueo del Security Engine.

---

## 2. Comando de Ejecución

La suite de pruebas se invoca de manera local en un entorno controlado mediante el Runner Daemon con el comando:

```bash
go test -v ./tests/...
```

## 3. Límite de Certificación de Pruebas

Un resultado exitoso en la suite de pruebas unitarias demuestra la corrección exclusiva del alcance cubierto por dichas aserciones lógicas.

```text
TEST PASSED ≠ SYSTEM CERTIFIED
```

No se extrapolará el paso de pruebas lógicas para justificar la omisión de controles criptográficos de red o para degradar de forma silenciosa el baseline de seguridad de `SECURITY.md`.
