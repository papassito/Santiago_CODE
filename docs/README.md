# SANTIAGO CODE — SPECIALIZED DOCUMENTATION INDEX

**Estado:** FOUNDATION / AUTHORITATIVE
**Documento:** `docs/README.md`

---

## 1. Propósito del Directorio

El directorio `docs/` contiene toda la documentación técnica especializada que complementa y detalla las directrices del núcleo normativo del proyecto.

```text
docs/ = SPECIALIZED DOCUMENTATION
```

La documentación especializada detalla e implementa reglas dentro de sus dominios específicos de manera subordinada a los documentos maestros de la raíz.

```text
SPECIALIZED DOCUMENTATION DOES NOT OVERRIDE AUTHORITATIVE MASTER DOCUMENTATION
```

## 2. Jerarquía de Subdirectorios

La estructura canónica de `docs/` según `SITEMAP.md` es la siguiente:
* **`architecture/`**: Define capas, puertos, adaptadores y Architectural Decision Records (ADR).
* **`contracts/`**: Especifica contratos derivados (Agente, Workspace, Herramientas, Proveedor de IA).
* **`security/`**: Modelo de amenazas y el esquema formal de permisos del sistema.
* **`governance/`**: Trazabilidad documental y matriz de alineación con contratos.
* **`evidence/`**: Políticas sobre captura, validez y descarte de evidencia de ejecución real.
* **`development/`**: Prácticas de build, testing, logging y control de errores.
* **`operations/`**: Manuales de instalación local, configuración y recuperación ante fallos.
