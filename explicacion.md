# Guía de Uso y Portabilidad de VeltraUI: De HTML/CSS/JS a React, Angular y Laravel

Esta guía explica en detalle cómo está organizado **VeltraUI**, cómo usar los archivos compilados que vienen en `dist/`, la recomendación de usar **Live Server**, y cómo puedes tomar los componentes HTML, CSS y JS para usarlos directamente en proyectos web estáticos o migrarlos a frameworks modernos como **React**, **Angular**, **Vue** o **Laravel**.

---

## 1. Uso de la Carpeta `dist/` y Recomendación de Live Server

Si descargaste la carpeta `dist/` o compartes los archivos compilados con tu equipo o clientes, encontrarás todas las plantillas HTML maquetadas, hojas de estilo CSS e imágenes listas para usar.

### ¿Por qué se debe usar Live Server al abrir la carpeta `dist/`?
Aunque los estilos CSS y la maquetación visual cargan al abrir los archivos HTML con doble clic directo, los navegadores modernos (Chrome, Edge, Firefox, Safari) cuentan con una estricta política de seguridad llamada **CORS** que **bloquea la ejecución de módulos JavaScript (`<script type="module">`)** cuando se ejecutan bajo el protocolo local de disco `file:///`.

Para que todas las interactividades funcionen al 100% (gráficos dinámicos de Chart.js, animaciones de menús, modales y renderizado reactivo de iconos Lucide), se debe servir la carpeta `dist/` mediante un servidor local:

#### Opciones para ejecutar con Live Server:
1. **Extensión Live Server de VS Code (Recomendada para la mayoría)**:
   - Abre la carpeta `dist` en Visual Studio Code.
   - Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.
   - Se abrirá automáticamente en tu navegador en `http://127.0.0.1:5500/index.html`.
2. **Mediante Node / npx (Sin instalar nada)**:
   ```bash
   # Dentro de la carpeta dist:
   npx serve .
   ```
3. **Mediante Python (Si tienes Python instalado)**:
   ```bash
   # Dentro de la carpeta dist:
   python -m http.server 3000
   ```
4. **Desde el repositorio con pnpm**:
   ```bash
   pnpm docs:preview
   ```

---

## 2. ¿Dónde están los archivos de la suite?

Al compilar el proyecto (`pnpm build:all`), encuentras los bundles standalone en:

| Tipo | Ubicación del Archivo | Para qué sirve |
| :--- | :--- | :--- |
| **CSS Compilado** | `packages/core-styles/dist/veltra.css` | Hoja de estilos completa con Tailwind v4, variables CSS y los 17 componentes. |
| **JS Módulo (ESM)** | `packages/vanilla-js/dist/veltra.es.js` | Para proyectos modernos que usan `import { VeltraUI } from '...'` (Vite, Next.js, Angular, Vue). |
| **JS Global (UMD)** | `packages/vanilla-js/dist/veltra.umd.js` | Para proyectos HTML puros mediante la etiqueta clásica `<script src="...">`. |
| **Tipos TypeScript** | `packages/vanilla-js/dist/index.d.ts` | Definiciones TypeScript para autocompletado en React y Angular. |
| **39 Páginas HTML** | `apps/docs/*.html` (o `apps/docs/dist/`) | Las plantillas completas listas para copiar (Dashboards, POS, Kanban, Tablas, Forms, etc.). |

---

## 3. ¿Por qué no veo un archivo `tailwind.css` y necesito instalar Tailwind en mi proyecto?

Esta es una duda muy común al trabajar con **Tailwind CSS v4**:

### A. ¿Por qué no existe un archivo `tailwind.css`?
En versiones antiguas (Tailwind v3), siempre existía un archivo `tailwind.css` con las directivas `@tailwind base; @tailwind components; @tailwind utilities;` y un `tailwind.config.js`.

En **Tailwind CSS v4 todo cambió para ser más limpio y rápido**:
1. Ya no existe `tailwind.config.js`.
2. Todo se resume a una sola línea nativa: `@import "tailwindcss";` dentro de `style.css` y `main.css`.
3. Al compilar con Vite (`pnpm build:all`), el compilador escanea todo el HTML y genera un **único archivo CSS final** que ya tiene todo Tailwind procesado adentro:
   👉 `packages/core-styles/dist/veltra.css`.

---

### B. Si lo meto en un proyecto Laravel o React: ¿El proyecto de destino ya debe tener Tailwind o no?

Tienes **dos opciones**, y ambas son 100% válidas según las necesidades de tu arquitectura:

---

#### OPCIÓN 1: Tu proyecto NO TIENE Tailwind (Modo Plug & Play / Cero Instalación)
> **Respuesta:** **NO, no necesitas instalar Tailwind en tu proyecto.**
> Como VeltraUI ya te entrega el archivo compilado `veltra.css`, ese archivo **ya contiene todo Tailwind y todos los componentes pre-compilados**.

##### Paso a paso en React (Vite / Next.js / CRA):
1. **Copiar el archivo compilado:**
   Toma `packages/core-styles/dist/veltra.css` (o desde `dist/assets/veltra.css`) y pégalo en tu proyecto en:
   `src/assets/veltra.css`.
2. **Importar en el archivo de arranque:**
   En tu archivo raíz `src/main.jsx` (o `src/App.tsx` / `app/layout.tsx`):
   ```jsx
   import './assets/veltra.css';
   ```
3. **Usar cualquier componente:**
   Pega cualquier componente HTML de VeltraUI (por ejemplo `<div className="vlt-card">...</div>` o botones con utilidades) y todos los estilos, colores, modo oscuro y tipografías se aplicarán de inmediato sin requerir configuración de Tailwind en tu proyecto.

##### Paso a paso en Laravel (Blade):
1. **Copiar a la carpeta pública de Laravel:**
   Copia `packages/core-styles/dist/veltra.css` en:
   `public/css/veltra.css`.
   *(Opcional: Si deseas los controladores JS de modales/sidebar, copia `packages/vanilla-js/dist/veltra.umd.js` a `public/js/veltra.js`)*.
2. **Cargar en tu Layout Blade (`resources/views/layouts/app.blade.php`):**
   ```blade
   <!DOCTYPE html>
   <html lang="es">
   <head>
       <meta charset="UTF-8">
       <link rel="stylesheet" href="{{ asset('css/veltra.css') }}">
   </head>
   <body>
       @yield('content')
       <script defer src="{{ asset('js/veltra.js') }}"></script>
   </body>
   </html>
   ```
3. **¡Listo sin compilador!**
   Tus vistas Blade pueden usar cualquier clase de VeltraUI y utilidades de Tailwind sin necesidad de instalar Node.js ni ejecutar `npm run dev`.

---

#### OPCIÓN 2: Tu proyecto SÍ TIENE Tailwind v4 (Modo Compilador Activo)
> **Respuesta:** Ideal si tu aplicación ya usa Vite + Tailwind v4 y deseas que el motor JIT compile **nuevas clases utilitarias arbitrarias** (como `p-[13px]`, `w-[340px]`, `bg-[#06b6d4]`) en vivo mientras consumes los componentes de VeltraUI.

##### Paso a paso en React + Vite + Tailwind v4:
1. **Instalar Tailwind v4 y el plugin Vite:**
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```
2. **Configurar `vite.config.js`:**
   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
     plugins: [tailwindcss(), react()],
   });
   ```
3. **Importar en tu CSS raíz (`src/index.css`):**
   ```css
   @import "tailwindcss";
   @import "./assets/veltra.css"; /* o @import "@veltra-ui/core-styles"; */
   ```
4. **Ejecutar el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   El compilador de Tailwind detectará todas las clases usadas en tus archivos `.jsx` o `.tsx` y las compilará al vuelo junto con VeltraUI.

##### Paso a paso en Laravel 11 / 12 + Vite + Tailwind v4:
1. **Instalar dependencias en Laravel:**
   ```bash
   npm install tailwindcss @tailwindcss/vite --save-dev
   ```
2. **Configurar `vite.config.js` de Laravel:**
   ```javascript
   import { defineConfig } from 'vite';
   import laravel from 'laravel-vite-plugin';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
       plugins: [
           laravel({
               input: ['resources/css/app.css', 'resources/js/app.js'],
               refresh: true,
           }),
           tailwindcss(),
       ],
   });
   ```
3. **Importar en `resources/css/app.css`:**
   Copia el archivo fuente de Veltra o el bundle a `resources/css/veltra.css` y agrega:
   ```css
   @import "tailwindcss";
   @import "./veltra.css";
   ```
4. **Cargar Vite en tu Layout Blade (`resources/views/layouts/app.blade.php`):**
   ```blade
   <head>
       @vite(['resources/css/app.css', 'resources/js/app.js'])
   </head>
   ```
5. **Ejecutar el compilador:**
   ```bash
   npm run dev
   ```
   Cualquier clase de Tailwind v4 que agregues en tus archivos `.blade.php` será compilada automáticamente por Vite.

---

### Resumen Rápido:

| Situación | ¿Debes instalar Tailwind en React / Laravel? | ¿Qué archivo usas? |
| :--- | :---: | :--- |
| **Quieres rapidez y cero configuración** | ❌ **NO** | Usas directamente el compilado `veltra.css`. Ya trae todo incluido. |
| **Quieres crear nuevas clases personalizadas de Tailwind en tu proyecto** | ✔️ **SÍ** | Instalas Tailwind v4 en tu proyecto y compilas tus estilos con Vite. |

---

## 3. Modo 1: Uso Clásico en HTML, CSS y JS Puros

Si quieres crear un proyecto web tradicional (o una app PHP sin frameworks de frontend):

### Estructura de tu proyecto:
```text
mi-proyecto/
├── index.html
├── assets/
│   ├── css/
│   │   └── veltra.css         # Copiado desde packages/core-styles/dist/veltra.css
│   └── js/
│       └── veltra.umd.js     # Copiado desde packages/vanilla-js/dist/veltra.umd.js
```

### En tu archivo `index.html`:
```html
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8">
  <title>Mi Panel de Administración</title>

  <!-- 1. Script Anti-Parpadeo (Anti-FOUC) para Modo Oscuro -->
  <script>
    (function() {
      const savedTheme = localStorage.getItem('veltra-theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    })();
  </script>

  <!-- 2. Estilos de VeltraUI -->
  <link rel="stylesheet" href="./assets/css/veltra.css">
  
  <!-- 3. Iconos Lucide (CDN) -->
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="vlt-body">
  <div class="vlt-wrapper">

    <!-- Copias el sidebar desde apps/docs/index.html -->
    <aside class="vlt-sidebar">
      <!-- ... contenido del sidebar ... -->
    </aside>

    <!-- Copias el main y header desde apps/docs/index.html -->
    <div class="vlt-main">
      <header class="vlt-header">
        <button type="button" class="vlt-btn-icon" data-vlt-toggle="sidebar">
          <i data-lucide="menu"></i>
        </button>
        <button type="button" class="vlt-btn-icon" data-vlt-toggle="theme">
          <i data-lucide="sun-medium"></i>
        </button>
      </header>

      <main class="vlt-content">
        <!-- Tus componentes: Stat Boxes, Tablas, Gráficos -->
      </main>
    </div>
  </div>

  <!-- 4. JS interactivo de VeltraUI e inicialización de iconos -->
  <script src="./assets/js/veltra.umd.js"></script>
  <script>
    lucide.createIcons();
    VeltraUI.init();
  </script>
</body>
</html>
```

---

## 4. Modo 2: Cómo llevarlo a React (o Next.js)

En React, lo ideal no es manipular el DOM directamente con selectores `data-vlt-*`, sino aprovechar las clases CSS de VeltraUI y dejar que el estado de React (`useState`) controle la apertura de modales, menús y temas.

### Paso 1: Instalar o importar los estilos
Puedes copiar `veltra.css` a tu carpeta `src/styles/` o importar el paquete:
```javascript
// En src/main.jsx o src/App.jsx (o app/layout.tsx en Next.js)
import './styles/veltra.css';
import 'lucide-react'; // Librería oficial de Lucide para React
```

### Paso 2: Crear Componentes Reactivos
Los componentes HTML de VeltraUI se convierten en componentes React limpios en segundos (solo cambias `class` por `className`):

#### Componente Botón (`Button.jsx`):
```jsx
import React from 'react';

export function Button({ variant = 'primary', children, icon: Icon, ...props }) {
  const variantClasses = {
    primary: 'vlt-btn-primary',
    secondary: 'vlt-btn-secondary',
    success: 'vlt-btn-success',
    danger: 'vlt-btn-danger',
    outline: 'vlt-btn-outline',
  }[variant] || 'vlt-btn-primary';

  return (
    <button className={`vlt-btn ${variantClasses}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
}
```

#### Componente Stat Box (`StatBox.jsx`):
```jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

export function StatBox({ color = 'cyan', title, value, meta, icon: Icon, link = '#' }) {
  return (
    <div className={`vlt-stat-box vlt-stat-box-${color}`}>
      <div className="vlt-stat-box-inner">
        <div className="stat-top">
          <div className="stat-icon-wrapper">
            {Icon && <Icon className="w-6 h-6" />}
          </div>
        </div>
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {meta && <div className="stat-meta"><span>{meta}</span></div>}
      </div>
      <a href={link} className="vlt-stat-box-footer">
        <span>Más información</span>
        <ArrowRight className="w-3.5 h-3.5 footer-arrow" />
      </a>
    </div>
  );
}
```

#### Uso en tu Dashboard de React (`Dashboard.jsx`):
```jsx
import { StatBox } from './components/StatBox';
import { Button } from './components/Button';
import { ShoppingBag, Users, DollarSign, Plus } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Panel Principal</h1>
        <Button variant="primary" icon={Plus}>Nuevo Pedido</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox color="cyan" title="Pedidos" value="1,540" icon={ShoppingBag} meta="+15% este mes" />
        <StatBox color="emerald" title="Ingresos" value="$48,200" icon={DollarSign} meta="Objetivo superado" />
        <StatBox color="amber" title="Usuarios" value="890" icon={Users} meta="Activos hoy" />
      </div>
    </div>
  );
}
```

---

## 5. Modo 3: Cómo llevarlo a Angular (v17 / v18+)

Angular utiliza componentes con plantillas HTML separadas, lo que hace que migrar desde VeltraUI sea casi inmediato.

### Paso 1: Incluir `veltra.css` en `angular.json`
Copia `packages/core-styles/dist/veltra.css` a `src/assets/css/veltra.css` y agrégalo en tu `angular.json`:
```json
"styles": [
  "src/styles.css",
  "src/assets/css/veltra.css"
]
```

### Paso 2: Crear el Componente en Angular
Genera un componente:
```bash
ng g c components/stat-box
```

#### `stat-box.component.ts`:
```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-box.component.html'
})
export class StatBoxComponent {
  @Input() color: 'cyan' | 'emerald' | 'amber' | 'rose' = 'cyan';
  @Input() title: string = '';
  @Input() value: string = '0';
  @Input() meta: string = '';
}
```

#### `stat-box.component.html`:
```html
<div class="vlt-stat-box" [ngClass]="'vlt-stat-box-' + color">
  <div class="vlt-stat-box-inner">
    <div class="stat-top">
      <div class="stat-icon-wrapper">
        <ng-content select="[icon]"></ng-content>
      </div>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-title">{{ title }}</div>
    <div class="stat-meta" *ngIf="meta">
      <span>{{ meta }}</span>
    </div>
  </div>
  <a href="#" class="vlt-stat-box-footer">
    <span>Ver detalles</span>
  </a>
</div>
```

---

## 6. Modo 4: Cómo llevarlo a Laravel (Blade)

Esta es una de las grandes fortalezas de VeltraUI. Al no usar Sass, no tienes que lidiar con compiladores externos en Laravel Vite.

### Paso 1: En tu proyecto Laravel
Instala Tailwind v4 y Vite:
```bash
npm install -D tailwindcss @tailwindcss/vite
```

### Paso 2: Configurar `resources/css/app.css`
Copia la carpeta de estilos o compila `veltra.css` e impórtalo:
```css
@import "tailwindcss";
@import "./veltra.css";
```

### Paso 3: Crear componentes Blade
Crea `resources/views/components/stat-box.blade.php`:
```blade
@props(['color' => 'cyan', 'title', 'value', 'meta' => null])

<div class="vlt-stat-box vlt-stat-box-{{ $color }}">
    <div class="vlt-stat-box-inner">
        <div class="stat-value">{{ $value }}</div>
        <div class="stat-title">{{ $title }}</div>
        @if($meta)
            <div class="stat-meta"><span>{{ $meta }}</span></div>
        @endif
    </div>
    <a href="#" class="vlt-stat-box-footer">
        <span>Más info</span>
    </a>
</div>
```

Úsalo en tus vistas Blade:
```blade
<x-stat-box color="emerald" title="Ventas Totales" value="$35,000" meta="+8% vs ayer" />
```

---

## 7. Resumen de Flujo de Trabajo Recomendado

```
┌────────────────────────────────────────────────────────┐
│             apps/docs/*.html (39 Plantillas)            │
│         Elige la pantalla que necesitas como base      │
└───────────────────────────┬────────────────────────────┘
                            │
               ¿En qué tecnología vas a trabajar?
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ HTML / PHP    │   │ React / Next  │   │ Angular / Vue │
├───────────────┤   ├───────────────┤   ├───────────────┤
│ Copias        │   │ Usas las      │   │ Usas las      │
│ veltra.css    │   │ clases CSS en │   │ clases CSS en │
│ y             │   │ JSX y manejas │   │ templates y   │
│ veltra.umd.js │   │ el estado con │   │ manejas el    │
│ directamente. │   │ useState.     │   │ estado con    │
│ (Live Server) │   │               │   │ Signals/RxJS. │
└───────────────┘   └───────────────┘   └───────────────┘
```

Con este enfoque, **nunca estás atado a un framework particular**. VeltraUI te da la libertad de usar los archivos compilados directos o integrar las clases modulares de Tailwind v4 en cualquier framework moderno con cero fricción.

