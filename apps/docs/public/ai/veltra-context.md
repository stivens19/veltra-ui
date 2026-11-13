# VeltraUI — Contexto Integral del Proyecto & Guía de las 39 Plantillas

Este documento proporciona el mapa de contexto definitivo de **VeltraUI (v1.0.0)** para alimentar modelos de lenguaje (LLMs) como Claude 3.7 / 3.5 Sonnet, GPT-4o, Cursor Composer, Windsurf Cascade y GitHub Copilot.

---

## 1. Resumen Ejecutivo del Proyecto

- **Nombre Oficial**: VeltraUI
- **Versión**: 1.0.0 (Release de Producción)
- **Autor**: Stivens Espinoza (<stivens70espinoza@gmail.com>)
- **Repositorio**: [https://github.com/stivens19/veltra-ui](https://github.com/stivens19/veltra-ui)
- **Web Oficial**: [https://veltra-ui.stivensespinoza.dev](https://veltra-ui.stivensespinoza.dev)
- **Licencia**: Permisiva MIT
- **Filosofía**: Cero dependencias pesadas, compilación nativa en Tailwind CSS v4, interactividad pura en TypeScript Vanilla y máxima portabilidad a Laravel Blade, React, Vue o HTML estático.

---

## 2. Catálogo Estructurado de las 39 Plantillas

### 📊 1. Dashboards & Analítica
1. **`dashboard1.html` (Dashboard v1 — Analytics Principal)**:
   - *Propósito*: Panel ejecutivo con métricas de ventas, visitas, tasa de rebote y nuevos pedidos.
   - *Componentes*: 4 Stat Boxes principales con medidores porcentuales, gráfico de líneas de ingresos mensuales (Chart.js), historial de transacciones bancarias recientes y widget de visitantes por país.
2. **`index2.html` (Dashboard v2 — Métricas & Finanzas)**:
   - *Propósito*: Monitoreo corporativo financiero y flujo de caja.
   - *Componentes*: Gráfico de barras de facturación, estado de balance de cuentas, lista de facturas pendientes con badges de cobro y mapa de calor de transacciones.
3. **`index3.html` (Dashboard v3 — Monitoreo de Sistemas & KPI)**:
   - *Propósito*: Infraestructura, servidores y cuotas operativas en tiempo real.
   - *Componentes*: Gráfico circular (Doughnut) de cuotas, barras de progreso de CPU y memoria RAM, tiempo de actividad (uptime) y terminal de registros.

### 💼 2. Módulos de Negocio & Facturación
4. **`pages-pos.html` (Terminal Punto de Venta / POS)**:
   - *Propósito*: Sistema táctil para cobro en mostrador o restaurantes.
   - *Componentes*: Catálogo de productos con filtros rápidos por categoría, panel lateral de ticket de comanda en vivo, desglose de IVA y descuentos, y modal de cobro en efectivo/tarjeta.
5. **`pages-invoice.html` (Factura Comercial Imprimible)**:
   - *Propósito*: Emisión de facturas y recibos oficiales.
   - *Componentes*: Cabecera corporativa con número de factura, tabla de conceptos fiscales, desglose de impuestos y optimización CSS `@media print` para imprimir directo a PDF.
6. **`pages-ecommerce.html` (Catálogo de Productos E-Commerce)**:
   - *Propósito*: Tienda interna o vitrina de artículos.
   - *Componentes*: Cuadrícula de productos con badges de descuento, selector de variantes, galería interactiva y botón de añadir a la cesta.
7. **`pages-projects.html` (Directorio de Proyectos)**:
   - *Propósito*: Seguimiento de proyectos del equipo.
   - *Componentes*: Tarjetas de proyectos con barra de avance porcentual, avatares del equipo asignado, badges de estado (En Progreso, Pendiente, Completado) y fechas límite.
8. **`pages-pricing.html` (Tabla de Precios & Suscripciones)**:
   - *Propósito*: Comparador de planes SaaS (Starter, Pro, Enterprise).
   - *Componentes*: Selector interactivo mensual/anual con descuento, lista de características verificadas y llamada a la acción destacada.
9. **`pages-contacts.html` (Directorio de Contactos)**:
   - *Propósito*: Libreta de clientes y miembros de equipo.
   - *Componentes*: Tarjetas tipo tarjeta de visita con acciones rápidas de llamada, correo y chat.

### 📅 3. Planificación & Metodología Ágil
10. **`kanban.html` (Tablero Kanban Interactivo)**:
    - *Propósito*: Gestión ágil de tareas y sprints.
    - *Componentes*: 4 columnas (Backlog, En Progreso, En Revisión, Finalizado), tarjetas con nivel de prioridad coloreado, avatares de responsables y persistencia local.
11. **`calendar.html` (Calendario General de Eventos)**:
    - *Propósito*: Agenda mensual completa.
    - *Componentes*: Cuadrícula de 7x5 días, creación rápida de eventos con selector de color y panel de citas próximas.
12. **`calendar-team.html` (Calendario de Equipo & Reuniones)**:
    - *Propósito*: Coordinación de videollamadas y reuniones de trabajo.
    - *Componentes*: Enlaces directos a Google Meet / Zoom, avatares de participantes y panel deslizable (Slide-over Inspector).
13. **`calendar-workload.html` (Carga Horaria & Disponibilidad)**:
    - *Propósito*: Control de ocupación y prevención de burnout.
    - *Componentes*: Mapa de calor con horas asignadas por desarrollador/diseñador durante la semana.

### 📝 4. Formularios & Captura de Datos
14. **`forms-general.html` (Formularios Básicos)**:
    - *Componentes*: Inputs de texto, selects nativos, checkboxes, radios, textareas y grupos de inputs con iconos.
15. **`forms-advanced.html` (Formularios Avanzados)**:
    - *Componentes*: Interruptores toggles, selectores flotantes, sliders de rango y zona de arrastre para archivos (Dropzone).
16. **`forms-validation.html` (Validación en Tiempo Real)**:
    - *Componentes*: Campos con estados visuales de error, éxito y advertencia con retroalimentación inmediata.
17. **`forms.html` (Vista Maestra de Formularios)**:
    - *Componentes*: Compendio general de maquetación de formularios complejos en columnas.

### 📑 5. Tablas & Visualización de Datos
18. **`tables-simple.html` (Tablas Limpias)**:
    - *Componentes*: Tablas ligeras con diseño responsive y filas alternadas (striped).
19. **`tables-datatables.html` (DataTables Avanzadas)**:
    - *Componentes*: Tabla con paginación reactiva, filtro de búsqueda instantáneo en cliente, selector de registros por página y exportación.
20. **`tables-jsgrid.html` (Tablas Matriciales jsGrid)**:
    - *Componentes*: Cuadrícula densa para gestión masiva de registros empresariales con edición en línea.
21. **`tables.html` (Vista Maestra de Tablas)**:
    - *Componentes*: Resumen de variantes de tablas con bordes, tarjetas y estados vacíos (empty states).

### 🧩 6. Elementos UI & Micro-Interacciones
22. **`widgets.html` (Widgets Empresariales)**:
    - *Componentes*: Colección de Stat Boxes, barras de progreso de metas, chat interactivo en vivo, perfil flotante y badges.
23. **`ui-general.html` (Elementos Generales)**:
    - *Componentes*: Acordeones interactivos, barras de progreso, alertas estilizadas, badges, chips y skeletons de carga.
24. **`ui-buttons.html` (Botones & Acciones)**:
    - *Componentes*: Variantes cromáticas (primary, success, danger, warning), estados hover/active, loaders y grupos unidos.
25. **`ui-icons.html` (Catálogo de Iconos Lucide)**:
    - *Componentes*: Buscador interactivo en vivo de más de 100 iconos de Lucide con copia directa de marcado SVG.
26. **`ui-modals.html` (Modales & Toasts)**:
    - *Componentes*: Modales con tecla ESC, backdrop blur, cuadros de diálogo de confirmación y notificaciones toast flotantes.
27. **`ui-navbar-tabs.html` (Barras & Pestañas)**:
    - *Componentes*: Pestañas fluidas interactivas (tabs), submenús dropdowns multinivel y selector de idioma.

### 📐 7. Variantes de Shell & Estructura
28. **`page-start.html` (Plantilla Base en Blanco)**:
    - *Componentes*: Estructura mínima con shell lista para comenzar a construir nuevos módulos desde cero.
29. **`layout-top-nav.html` (Layout Navegación Superior)**:
    - *Componentes*: Barra horizontal sin sidebar fijo con menú colapsable tipo drawer para móviles.
30. **`layout-top-nav-sidebar.html` (Layout Híbrido)**:
    - *Componentes*: Barra de menú superior combinada con sidebar a la izquierda.
31. **`layout-boxed.html` (Layout Enmarcado / Boxed)**:
    - *Componentes*: Contenedor centrado con ancho máximo fijo (`max-w-7xl`) y sombra perimetral.
32. **`layout-fixed-sidebar.html` (Sidebar Fijo)**:
    - *Componentes*: Barra lateral fija con scroll independiente del contenido principal.
33. **`layout-fixed-navbar.html` (Navbar Fijo)**:
    - *Componentes*: Encabezado superior persistente (`sticky top-0`) con desenfoque de fondo.
34. **`layout-collapsed-sidebar.html` (Sidebar Mini)**:
    - *Componentes*: Barra lateral reducida a iconos con menú flotante interactivo (flyout) al hacer hover.

### 🔐 8. Autenticación & Errores del Sistema
35. **`pages-login.html` (Inicio de Sesión)**:
    - *Componentes*: Formulario centrado con validación, selector de tema, botón para mostrar/ocultar contraseña y login social.
36. **`pages-register.html` (Registro de Cuenta)**:
    - *Componentes*: Registro con medidor interactivo de fuerza de contraseña y términos de servicio.
37. **`pages-lockscreen.html` (Pantalla de Bloqueo)**:
    - *Componentes*: Reanudación de sesión con avatar, campo de PIN y cambio de usuario.
38. **`pages-forgot-password.html` (Recuperación de Contraseña)**:
    - *Componentes*: Formulario para envío de instrucciones de restablecimiento de contraseña.
39. **`pages-404.html` & `pages-500.html` (Páginas de Error)**:
    - *Componentes*: Ilustraciones limpias con retorno directo a `dashboard1.html`.

---

## 3. Recetas de Prompts para Vibe Coding

Copia y pega estas recetas en Cursor, Windsurf o Claude para generar vistas completas al instante:

### Receta 1: Crear una Vista de Facturación & Suscripciones (SaaS Billing)
```text
Genera una nueva vista administrativa de Facturación y Suscripciones utilizando la arquitectura canónica de VeltraUI con Tailwind CSS v4.
Requisitos:
- Incluye el script canónico Anti-FOUC en el <head> y enlaza css/veltra.css y js/veltra.js.
- Crea 3 Stat Boxes en la parte superior: "Plan Actual" (Pro Anual), "Próximo Cobro" ($120 el 1 de Dic) y "Método de Pago" (Visa terminada en 4242).
- Añade una tarjeta vlt-card con la tabla de historial de facturas (Fecha, Concepto, Monto, Estado "Pagada", y botón para descargar PDF con icono download de Lucide).
- Utiliza la paleta cyan-500 para acentos y soporte completo para modo oscuro (dark:bg-slate-900).
```

### Receta 2: Crear un CRUD con Tabla y Modal de Creación
```text
Genera un módulo de gestión de usuarios para VeltraUI:
Requisitos:
- Encabezado con título "Gestión de Usuarios", botón "+ Nuevo Usuario" con data-vlt-toggle="modal" y buscador en vivo.
- Tabla con avatar, nombre, correo, rol (badge) y menú dropdown de acciones (Editar, Suspender, Eliminar).
- Modal canónico de VeltraUI (vlt-modal) con campos: Nombre, Correo, Selector de Rol, Contraseña y botones de Cancelar y Guardar.
```
