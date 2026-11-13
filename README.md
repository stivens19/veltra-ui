# VeltraUI — Enterprise Admin UI Suite

<p align="left">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.3-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/pnpm-v12-f69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/Templates-39_Pages-06b6d4?style=flat-square" alt="39 Templates" />
</p>

**VeltraUI** es una suite de interfaz de administración empresarial de alto rendimiento, diseñada con **Tailwind CSS v4** nativo y **Vanilla JavaScript**. Ha sido concebida para superar la deuda técnica de plantillas heredadas, prescindiendo por completo de Sass y dependencias pesadas para integrarse sin fricción en proyectos modernos de **Laravel (Blade)**, **React**, **Vue** o **HTML estático**.

---

## 🌟 Características Principales

- **Tailwind CSS v4 Puro (Cero Sass)**: Aprovecha el motor nativo de Tailwind v4 (*Oxide*) y CSS Nesting nativo. Sin preprocesadores heredados, compila en menos de 150 ms.
- **Persistencia de Dark Mode Robusta**: Soporte dual (`data-theme="dark"` y `.dark`) con detección de preferencias del sistema, almacenamiento seguro en `localStorage` y ejecución anti-parpadeo (*Zero FOUC*).
- **39 Plantillas y Módulos Listos para Producción**: Cobertura exhaustiva de dashboards, analítica, punto de venta (POS), facturación imprimible, tableros Kanban, calendarios, autenticación y perfiles.
- **Micro-interacciones Reactivas en Vanilla JS**: Controladores modulares con tipado TypeScript (`.d.ts`) para treeviews colapsables, flyouts flotantes, modales, toasts, tabs, dropdowns y selector de temas.
- **Diseñado para Componentes Blade (Laravel)**: Tokens CSS desacoplados (`--vlt-*`) listos para ser encapsulados en componentes reutilizables como `<x-vlt::card>` o `<x-vlt::stat-box>`.

---

## 📁 Estructura del Monorepo

```bash
veltra-ui/
├── apps/
│   └── docs/                     # Galería de 39 plantillas y documentación interactiva (Vite)
├── packages/
│   ├── core-styles/              # Sistema de diseño, tokens CSS, componentes y layouts en Tailwind v4
│   │   ├── src/
│   │   │   ├── tokens/variables.css
│   │   │   ├── layouts/shell.css
│   │   │   ├── components/*.css  # 17 módulos de componentes nativos
│   │   │   └── main.css
│   │   └── dist/veltra.css       # Bundle CSS final distribuible
│   └── vanilla-js/               # Controladores interactivos en TypeScript (ESM, UMD y .d.ts)
│       ├── src/
│       │   ├── components/*.ts   # sidebar, card, treeview, dropdown, tabs, modal, etc.
│       │   └── index.ts
│       └── dist/                 # veltra.es.js, veltra.umd.js, index.d.ts
├── .gitignore                    # Reglas completas para pnpm, Vite, TypeScript y logs
├── LICENSE                       # Licencia permisiva MIT
├── package.json                  # Configuración raíz de scripts monorepo
├── pnpm-workspace.yaml
└── README.md
```

---

## 🚀 Inicio Rápido

### Requisitos
- **Node.js**: v18.0.0 o superior
- **pnpm**: v9.0.0 o superior (recomendado v12)

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/veltra-ui.git
cd veltra-ui

# 2. Instalar dependencias del monorepo
pnpm install

# 3. Iniciar el entorno de desarrollo interactivo
pnpm docs:dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000) para explorar las 39 páginas en vivo.

### Comandos de Compilación
```bash
# Compilar los paquetes distribuibles (@veltra-ui/core-styles y @veltra-ui/vanilla-js)
pnpm build

# Compilar la suite completa incluyendo las 39 páginas de docs
pnpm build:all
```

---

## 📑 Catálogo de Plantillas Incluidas (39 Páginas)

| Categoría | Páginas y Enlaces |
| :--- | :--- |
| **Dashboards** | `Dashboard v1` (Analítica general), `Dashboard v2` (Métricas de ventas), `Dashboard v3` (Monitoreo de servidores) |
| **Widgets** | `Widgets` (KPI stat boxes, barras de progreso, badges y chat interactivo) |
| **Opciones de Layout** | `Top Navigation` (Con drawer flotante), `Top Nav + Sidebar`, `Boxed Layout`, `Fixed Sidebar`, `Fixed Navbar`, `Collapsed Sidebar` (Modo mini con flyouts) |
| **Plantilla Base** | `Page Start` (Punto de partida en blanco con card de bienvenida sobrio) |
| **UI Elements** | `General`, `Icons` (Lucide interactivo con buscador), `Buttons`, `Modals & Alerts`, `Navbar & Tabs` |
| **Formularios** | `General Elements`, `Advanced Elements` (Pickers, Dropzone), `Validation` |
| **Tablas & Datos** | `Simple Tables`, `DataTables` (Filtro y orden en vivo), `jsGrid` |
| **Calendario** | `Calendario General`, `Equipo & Reuniones`, `Carga Horaria & Heatmap` |
| **Gestión Ágil** | `Kanban Board` (Arrastrar y soltar con persistencia local) |
| **Páginas de Negocio** | `POS Terminal` (Punto de venta táctil con comanda y ticket), `Invoice` (Factura con optimización `@media print`), `Profile`, `Projects`, `E-commerce`, `Contacts`, `Pricing`, `FAQ` |
| **Autenticación (Auth)** | `Login`, `Register` (Medidor interactivo de fuerza de contraseña), `Lockscreen`, `Forgot Password` |
| **Errores** | `Error 404`, `Error 500` (Con traza diagnóstica) |

---

## 🛠️ Integración en Proyectos de Laravel

VeltraUI está preparado para consumirse directamente en Laravel 11/12 con Vite:

1. Importa el archivo compilado en tu `resources/css/app.css`:
   ```css
   @import "@veltra-ui/core-styles";
   ```

2. Registra los controladores interactivos en tu `resources/js/app.js`:
   ```javascript
   import { VeltraUI } from '@veltra-ui/vanilla-js';
   window.veltra = new VeltraUI();
   ```

3. Usa la estructura estándar en tus plantillas Blade (`layouts/app.blade.php`) manteniendo todas las clases `.vlt-*`.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

Desarrollado y mantenido por **Stivens Espinoza** ([stivens70espinoza@gmail.com](mailto:stivens70espinoza@gmail.com)).

