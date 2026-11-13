---
name: veltra-ui-skill
description: Guía de referencia técnica y reglas de arquitectura de VeltraUI para agentes de IA (Cursor, Claude Code, Windsurf, Copilot).
version: 1.0.0
author: Stivens Espinoza
license: MIT
---

# VeltraUI — Skill de Referencia para Agentes de IA & Vibe Coding

Eres un asistente experto en ingeniería de software especializado en **VeltraUI**: la suite de interfaz de administración empresarial ultra-ligera construida con **Tailwind CSS v4** y **Vanilla TypeScript/JavaScript**.

Cuando el usuario te pida construir, refactorizar o extender interfaces basadas en VeltraUI, debes seguir estrictamente las siguientes reglas arquitectónicas:

---

## 1. Principios Fundamentales

1. **Tailwind CSS v4 Nativo**:
   - No generes `tailwind.config.js`. Todo funciona con directivas nativas `@import "tailwindcss";` y `@theme`.
   - Utiliza CSS Nesting estándar del W3C en lugar de preprocesadores obsoletos.

2. **Cero Dependencias Pesadas**:
   - La suite no requiere jQuery, Bootstrap ni preprocesadores Sass.
   - Todas las micro-interacciones interactivas se gestionan mediante `@veltra-ui/vanilla-js` o clases `.vlt-*`.

3. **Arquitectura por Tokens de Diseño (`--vlt-*`)**:
   - Utiliza las variables CSS maestras definidas en el `:root`:
     - Colores de marca: `--vlt-primary: #06b6d4;`, `--vlt-primary-hover: #0891b2;`
     - Superficies: `--vlt-bg-surface`, `--vlt-bg-card`, `--vlt-border-color`
     - Tipografía: `--vlt-font-sans: 'Plus Jakarta Sans', sans-serif;`, `--vlt-font-mono: 'JetBrains Mono', monospace;`

4. **Soporte Dark Mode Anti-FOUC**:
   - Toda página debe incluir el script canónico en el `<head>`:
     ```html
     <script>
       (function() {
         try {
           const savedTheme = localStorage.getItem('veltra-theme') || 'light';
           document.documentElement.setAttribute('data-theme', savedTheme);
           if (savedTheme === 'dark') document.documentElement.classList.add('dark');
           else document.documentElement.classList.remove('dark');
         } catch (e) {}
       })();
     </script>
     ```
   - Utiliza variantes duales: `.dark` y `[data-theme="dark"]`.

---

## 2. Anatomía de Layout Estándar

El esqueleto canónico de una vista de dashboard en VeltraUI es:

```html
<div class="vlt-wrapper">
  <!-- 1. SIDEBAR -->
  <aside class="vlt-sidebar">
    <div class="vlt-sidebar-brand">
      <a href="/dashboard1.html" class="brand-link">
        <img src="/logo.png" alt="VeltraUI" class="brand-logo" />
        <span class="brand-text">Veltra<span class="text-cyan-500">UI</span></span>
      </a>
    </div>

    <!-- Navegación -->
    <ul class="vlt-nav">
      <li class="vlt-nav-header">MAIN NAVIGATION</li>
      <li class="vlt-nav-item">
        <a class="vlt-nav-link" data-vlt-toggle="treeview">
          <i data-lucide="gauge" class="vlt-nav-icon"></i>
          <span class="vlt-nav-text">Dashboard</span>
          <i data-lucide="chevron-right" class="vlt-nav-arrow"></i>
        </a>
        <ul class="vlt-nav-treeview">
          <li class="vlt-nav-item"><a href="/dashboard1.html" class="vlt-nav-link">Dashboard v1</a></li>
          <li class="vlt-nav-item"><a href="/index2.html" class="vlt-nav-link">Dashboard v2</a></li>
          <li class="vlt-nav-item"><a href="/index3.html" class="vlt-nav-link">Dashboard v3</a></li>
        </ul>
      </li>
    </ul>
  </aside>

  <!-- 2. CONTENIDO PRINCIPAL -->
  <div class="vlt-main">
    <!-- Header -->
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

    <!-- Page Content -->
    <main class="vlt-content p-6 space-y-6">
      <!-- Vistas y tarjetas aquí -->
    </main>
  </div>
</div>
```

---

## 3. Catálogo de Componentes Canónicos

### Tarjeta (Card)
```html
<div class="vlt-card">
  <div class="vlt-card-header">
    <h3 class="vlt-card-title">Resumen de Métricas</h3>
    <div class="vlt-card-tools flex items-center gap-1.5">
      <button type="button" class="vlt-tool-btn" data-vlt-card="collapse"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
      <button type="button" class="vlt-tool-btn" data-vlt-card="maximize"><i data-lucide="maximize-2" class="w-3.5 h-3.5"></i></button>
    </div>
  </div>
  <div class="vlt-card-body">
    <!-- Contenido -->
  </div>
</div>
```

### Stat Box (KPI)
```html
<div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
  <div>
    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ventas Totales</p>
    <h4 class="text-2xl font-black text-slate-900 dark:text-white mt-1">$45,280.00</h4>
    <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 mt-2">
      <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +14.8% vs mes anterior
    </span>
  </div>
  <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
    <i data-lucide="dollar-sign" class="w-6 h-6"></i>
  </div>
</div>
```

---

## 4. Iconografía & Scripts
- Utiliza **Lucide Icons** (`data-lucide="nombre-icono"`).
- Para inicializar los iconos en tiempo de ejecución:
  ```javascript
  if (window.lucide) {
    window.lucide.createIcons();
  }
  ```
- No utilices FontAwesome ni Flaticon bajo ninguna circunstancia.

---

## 5. Integración con Laravel Blade
Encapsula los bloques en componentes Blade limpios:
```html
<x-ui.card title="Reporte Financiero">
  <x-ui.stat-box label="Ingresos" value="$12,450" icon="dollar-sign" trend="+8%" />
</x-ui.card>
```
