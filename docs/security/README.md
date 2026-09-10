# SANTIAGO CODE — SPECIALIZED SECURITY INDEX

**Estado:** SECURITY BASELINE / AUTHORITATIVE
**Documento:** `docs/security/README.md`

---

## 1. Propósito de la Seguridad Especializada

Este subdirectorio contiene los manuales técnicos, análisis de riesgos lógicos y especificaciones formalizadas que detallan el baseline general de seguridad estipulado por `SECURITY.md`.

Su alcance se orienta de manera exclusiva a documentar y detallar el perfil de vulnerabilidades, la matriz de mitigaciones interproceso de los puertos de loopback y el esquema de capacidades independientes del desarrollador en el host local.

---

## 2. Jerarquía de Seguridad

Los análisis y mecanismos técnicos documentados aquí se encuentran permanentemente supeditados al núcleo de seguridad maestro.

```text
SECURITY.md (Raíz) ──► docs/security/* (THREAT_MODEL.md, PERMISSIONS.md)
```

Ninguno de estos documentos puede debilitar, omitir o saltarse de manera silenciosa las garantías del baseline global.

## 3. Reglas de Control Obligatorias

* **Zero Trust**: Se asume de forma proactiva que cualquier entrada de red local o archivo modificado por terceros en el workspace puede albergar payloads de inyección hostiles.
* **Fail Closed**: Ante fallos en la verificación de tokens efímeros locales, caída de micro-daemons o resolución ambigua de rutas, el sistema detendrá inmediatamente la operación física en disco.
