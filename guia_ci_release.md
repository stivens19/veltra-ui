# Guía de CI/CD y Auto-Release: `veltra-ui`

Esta guía documenta los flujos de trabajo automatizados configurados para el monorepo de **`veltra-ui`** (`core-styles`, `vanilla-js` y `docs`) mediante **GitHub Actions**.

---

## 📋 Arquitectura de Automatización

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Desarrollo en rama de trabajo                             │
│    git checkout -b feature/nuevo-estilo-navbar               │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. Commits con estándar Semántico                            │
│    git commit -m "feat: agregar soporte para layout top-nav" │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. Abrir Pull Request (PR) hacia 'main'                      │
│    GitHub Actions (ci.yml) valida:                           │
│    • Instalación con pnpm v12                                │
│    • Compilación de @veltra-ui/core-styles (Tailwind CSS v4) │
│    • Compilación y Typecheck de @veltra-ui/vanilla-js        │
│    • Generación de apps/docs y assets                        │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. Merge del Pull Request en GitHub                          │
│    • Clic en Merge tras recibir el check verde               │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. Auto-Release & Tagging Autónomo (auto-release.yml)        │
│    • Calcula el siguiente Tag SemVer (v1.0.1, v1.1.0, etc.)  │
│    • Compila y empaqueta los assets distribuibles            │
│    • Publica el GitHub Release con Changelog                 │
│    • Adjunta automáticamente:                                │
│      📦 dist/veltra.css                                      │
│      📦 dist/veltra.js                                       │
│      📦 dist/veltra-ui.zip                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚡ Los 2 Workflows de GitHub Actions

| Archivo | Disparador | Propósito |
| :--- | :--- | :--- |
| **`.github/workflows/ci.yml`** | PRs y Push a `main`/`develop` | Compila todos los paquetes y la documentación para asegurar que ningún PR rompa estilos ni tipado. |
| **`.github/workflows/auto-release.yml`** | Push/Merge a `main` | Calcula SemVer, crea el Tag, genera el Release y adjunta los archivos finales para descarga directa. |

---

## ⚙️ Configuración Única en GitHub

Para permitir que el workflow cree tags y publique releases con sus archivos adjuntos:

1. Entra a tu repositorio: **`https://github.com/stivens19/veltra-ui/settings/actions`**
2. Desplázate hasta la sección **Workflow permissions**.
3. Selecciona: 🔘 **Read and write permissions**.
4. Haz clic en **Save**.

---

## 🚀 Guía de Commits Semánticos (Conventional Commits)

GitHub Actions lee el prefijo de tus commits o del título de tu Pull Request para decidir la nueva versión:

| Prefijo de Commit | Tipo de Cambio | Incremento | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`fix:`** | Corrección de bug en CSS o JS | **Patch** | `v1.0.0` ➔ `v1.0.1` |
| **`feat:`** | Nuevo componente, token o funcionalidad | **Minor** | `v1.0.0` ➔ `v1.1.0` |
| **`feat!:`** o **`BREAKING CHANGE:`** | Cambio incompatible con versiones previas | **Major** | `v1.0.0` ➔ `v2.0.0` |
| **`docs:`** o **`chore:`** | Tareas de mantenimiento o documentación | **Patch** | `v1.0.0` ➔ `v1.0.1` |

---

## 📦 Descarga de Assets en Releases

Cada versión publicada en GitHub incluirá automáticamente en la sección de **Assets**:
- `veltra.css`: Hoja de estilos compilada y lista para producción (Tailwind v4).
- `veltra.js`: Bundle interactivo Vanilla JS.
- `veltra-ui.zip`: Paquete completo con plantillas HTML, CSS y JS para descarga en 1 clic.
