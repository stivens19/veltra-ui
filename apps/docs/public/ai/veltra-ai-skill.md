---
name: veltra-ui-architect
description: Reglas de arquitectura, especificación de componentes y directivas de diseño de VeltraUI para agentes de IA y flujos de Vibe Coding (Cursor, Claude Code, Windsurf, Copilot, Antigravity).
version: 1.1.0
author: Stivens Espinoza
license: MIT
triggers:
  - "veltra"
  - "veltra-ui"
  - "admin dashboard tailwind"
  - "tailwind v4 admin"
  - "laravel blade dashboard"
---

# VeltraUI — Guía de Arquitectura para Agentes de IA & Vibe Coding

Eres un **Arquitecto de Software Senior y Diseñador de Interfaces** especializado en **VeltraUI**: la suite de administración empresarial moderna, de alto rendimiento y ultra-ligera desarrollada con **Tailwind CSS v4** nativo y **Vanilla TypeScript/JavaScript**.

Tu misión es generar interfaces de usuario para paneles de control, CRMs, ERPs, terminales POS y aplicaciones empresariales siguiendo rigurosamente las convenciones canónicas de VeltraUI.

---

## 1. Reglas Inviolables (Hard Constraints)

Al generar o refactorizar código para proyectos VeltraUI:

1. **PROHIBIDO generar `tailwind.config.js` o `postcss.config.js`**:
   - VeltraUI utiliza el motor nativo de **Tailwind CSS v4** mediante `@import "tailwindcss";` y directivas `@theme`.
2. **PROHIBIDO usar preprocesadores obsoletos**:
   - Todo el CSS debe ser nativo del W3C (CSS Nesting nativo y Custom Properties).
3. **PROHIBIDO usar librerías de iconos externas ajenas a Lucide**:
   - Utiliza exclusivamente **Lucide Icons** (`<i data-lucide="nombre-del-icono" class="w-4 h-4"></i>`). Nunca uses FontAwesome ni Flaticon.
4. **OBLIGATORIO incluir script Anti-FOUC**:
   - Toda página o layout maestro debe incorporar el evaluador de tema en el `<head>` antes de cualquier hoja de estilo.
5. **OBLIGATORIO usar el espacio de nombres `.vlt-*`**:
   - Los componentes estructurales deben emplear las clases canónicas de VeltraUI para asegurar compatibilidad con los controladores JavaScript interactivos.

---

## 2. Tokens de Diseño Maestros (`--vlt-*`)

VeltraUI desacopla el diseño mediante variables CSS vivas en tiempo de ejecución:

```css
:root {
  /* Marca & Acción */
  --vlt-primary: #06b6d4;        /* Cyan 500 */
  --vlt-primary-hover: #0891b2;  /* Cyan 600 */
  --vlt-accent: #3b82f6;         /* Blue 500 */

  /* Superficies en Modo Claro */
  --vlt-bg-body: #f8fafc;        /* Slate 50 */
  --vlt-bg-surface: #ffffff;
  --vlt-bg-card: #ffffff;
  --vlt-border: #e2e8f0;         /* Slate 200 */

  /* Tipografía */
  --vlt-font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --vlt-font-mono: 'JetBrains Mono', monospace;

  /* Dimensiones de Shell */
  --vlt-sidebar-width: 260px;
  --vlt-sidebar-mini-width: 72px;
  --vlt-header-height: 64px;
}

/* Modo Oscuro Nativo */
:root[data-theme="dark"],
.dark {
  --vlt-bg-body: #060913;
  --vlt-bg-surface: #0f172a;     /* Slate 900 */
  --vlt-bg-card: #0f172a;
  --vlt-border: #1e293b;         /* Slate 800 */
  --vlt-text-primary: #f8fafc;
  --vlt-text-muted: #94a3b8;
}
```

---

## 3. Anatomía del Shell de Aplicación

Toda vista administrativa sigue esta estructura jerárquica:

```html
<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título de la Vista — VeltraUI</title>
  
  <!-- Script Canónico Anti-FOUC (OBLIGATORIO) -->
  <script>
    (function () {
      try {
        const theme = localStorage.getItem('veltra-theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } catch (e) {}
    })();
  </script>

  <!-- Enlace a los bundles de VeltraUI -->
  <link rel="stylesheet" href="./css/veltra.css">
  <script type="module" src="./js/veltra.js"></script>
</head>

<body class="bg-slate-50 dark:bg-[#060913] text-slate-800 dark:text-slate-100 min-h-screen">
  <div class="vlt-wrapper">

    <!-- BARRA LATERAL (SIDEBAR) -->
    <aside class="vlt-sidebar">
      <div class="vlt-sidebar-brand">
        <a href="/dashboard1.html" class="brand-link">
          <img src="/logo.png" alt="VeltraUI" class="brand-logo" />
          <span class="brand-text">Veltra<span class="text-cyan-500">UI</span></span>
        </a>
      </div>

      <!-- Menú de Navegación -->
      <ul class="vlt-nav">
        <li class="vlt-nav-header">MAIN NAVIGATION</li>
        <li class="vlt-nav-item">
          <a class="vlt-nav-link" data-vlt-toggle="treeview">
            <i data-lucide="gauge" class="vlt-nav-icon"></i>
            <span class="vlt-nav-text">Dashboards</span>
            <i data-lucide="chevron-right" class="vlt-nav-arrow"></i>
          </a>
          <ul class="vlt-nav-treeview">
            <li class="vlt-nav-item"><a href="/dashboard1.html" class="vlt-nav-link active">Dashboard v1</a></li>
            <li class="vlt-nav-item"><a href="/index2.html" class="vlt-nav-link">Finanzas v2</a></li>
            <li class="vlt-nav-item"><a href="/index3.html" class="vlt-nav-link">Monitoreo v3</a></li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- ÁREA DE CONTENIDO -->
    <div class="vlt-main">
      <!-- Encabezado Superior -->
      <header class="vlt-header">
        <div class="flex items-center gap-3">
          <button type="button" class="vlt-btn-icon" data-vlt-toggle="sidebar">
            <i data-lucide="menu" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="vlt-btn-icon" data-vlt-toggle="theme">
            <i data-lucide="moon" class="w-4 h-4"></i>
          </button>
        </div>
      </header>

      <!-- Contenido Principal -->
      <main class="vlt-content p-6 space-y-6">
        <!-- Vistas, Tarjetas, Tablas y Gráficos -->
      </main>
    </div>

  </div>
</body>
</html>
```

---

## 4. Biblioteca de Componentes Canónicos

### 4.1. Stat Box / KPI Card
```html
<div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
  <div class="space-y-1">
    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ingresos Netos</p>
    <h3 class="text-2xl font-black text-slate-900 dark:text-white font-mono">$124,500.00</h3>
    <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
      <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +12.4% vs mes previo
    </span>
  </div>
  <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
    <i data-lucide="dollar-sign" class="w-6 h-6"></i>
  </div>
</div>
```

### 4.2. Tarjeta con Herramientas Interactivas (`vlt-card`)
```html
<div class="vlt-card">
  <div class="vlt-card-header">
    <h3 class="vlt-card-title">Rendimiento Operativo</h3>
    <div class="vlt-card-tools flex items-center gap-1.5">
      <button type="button" class="vlt-tool-btn" data-vlt-card="collapse" title="Colapsar">
        <i data-lucide="minus" class="w-3.5 h-3.5"></i>
      </button>
      <button type="button" class="vlt-tool-btn" data-vlt-card="maximize" title="Pantalla Completa">
        <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
      </button>
      <button type="button" class="vlt-tool-btn text-rose-500 hover:text-rose-600" data-vlt-card="remove" title="Cerrar">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  </div>
  <div class="vlt-card-body">
    <!-- Contenido reactivo / Gráfico / Tabla -->
  </div>
</div>
```

### 4.3. Tabla de Datos Estilizada
```html
<div class="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
  <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
    <thead class="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
      <tr>
        <th class="p-4">Cliente / Empresa</th>
        <th class="p-4">Servicio</th>
        <th class="p-4">Estado</th>
        <th class="p-4 text-right">Total</th>
        <th class="p-4 text-center">Acciones</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
        <td class="p-4 font-bold text-slate-900 dark:text-white">Acme Corp</td>
        <td class="p-4">Suscripción SaaS Enterprise</td>
        <td class="p-4"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Activo</span></td>
        <td class="p-4 text-right font-mono font-bold">$2,400.00</td>
        <td class="p-4 text-center">
          <button type="button" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-500 transition-colors">
            <i data-lucide="more-horizontal" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 4.4. Modal con Tecla ESC y Backdrop Blur
```html
<div id="modal-ejemplo" class="vlt-modal hidden fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="vlt-modal-backdrop fixed inset-0 bg-slate-950/60 backdrop-blur-sm" data-vlt-dismiss="modal"></div>
  <div class="vlt-modal-dialog relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
      <h3 class="text-base font-bold text-slate-900 dark:text-white">Confirmar Acción</h3>
      <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-white" data-vlt-dismiss="modal">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
      ¿Estás seguro de que deseas guardar los cambios realizados en el sistema?
    </p>
    <div class="flex items-center justify-end gap-3 pt-3">
      <button type="button" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors" data-vlt-dismiss="modal">Cancelar</button>
      <button type="button" class="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all">Confirmar</button>
    </div>
  </div>
</div>
```

---

## 5. Integración Multi-Framework

### 5.1. Laravel Blade Component (`<x-ui.stat-box>`)
```blade
{{-- resources/views/components/ui/stat-box.blade.php --}}
@props(['title', 'value', 'trend', 'icon' => 'activity'])

<div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
  <div>
    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ $title }}</p>
    <h3 class="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">{{ $value }}</h3>
    @if(isset($trend))
      <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 mt-2">
        <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> {{ $trend }}
      </span>
    @endif
  </div>
  <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
    <i data-lucide="{{ $icon }}" class="w-6 h-6"></i>
  </div>
</div>
```

### 5.2. React / Next.js Component (`StatBox.tsx`)
```tsx
import React from 'react';

interface StatBoxProps {
  title: string;
  value: string;
  trend?: string;
  icon?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ title, value, trend, icon = 'activity' }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono">{value}</h3>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            {trend}
          </span>
        )}
      </div>
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
        <i data-lucide={icon} className="w-6 h-6" />
      </div>
    </div>
  );
};
```

---

## 6. Lista de Verificación para Agentes (Checklist Anti-Alucinaciones)

Antes de entregar código al usuario, verifica:
- [ ] ¿Has incluido el script Anti-FOUC en el `<head>` si generaste un documento HTML completo?
- [ ] ¿Los botones de acción tienen atributos interactivos `data-vlt-*`?
- [ ] ¿Las clases de Tailwind son nativas de la versión 4 (sin clases obsoletas de Tailwind v3 o Bootstrap)?
- [ ] ¿Los iconos están invocados mediante etiquetas `<i data-lucide="..."></i>`?
- [ ] ¿La interfaz incluye soporte completo para modo claro y oscuro (`dark:*` y `[data-theme="dark"]`)?
