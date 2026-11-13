# VeltraUI — Contexto Completo del Proyecto & Catálogo de 39 Plantillas

Este documento proporciona el contexto exhaustivo del ecosistema **VeltraUI (v1.0.0)** para modelos de lenguaje (LLMs) y asistentes de código como Cursor, Claude, Windsurf, ChatGPT y Copilot.

---

## 1. Metadatos del Proyecto

- **Nombre**: VeltraUI
- **Versión**: 1.0.0
- **Autor**: Stivens Espinoza (<stivens70espinoza@gmail.com>)
- **Repositorio Oficial**: [https://github.com/stivens19/veltra-ui](https://github.com/stivens19/veltra-ui)
- **Sitio Web Oficial**: [https://veltra-ui.stivensespinoza.dev](https://veltra-ui.stivensespinoza.dev)
- **Licencia**: MIT (Permisiva para uso personal, comercial y SaaS)
- **Stack Tecnológico**: Tailwind CSS v4, TypeScript Vanilla, Vite 6/8, LightningCSS.

---

## 2. Mapa Exhaustivo de las 39 Plantillas HTML

| Archivo | Título del Módulo | Descripción Funcional y Componentes Clave |
| :--- | :--- | :--- |
| `index.html` | Portada / Landing Page | Presentación oficial, showcase de capturas, selector interactivo de tabs, descargas y zona Vibe Coding. |
| `dashboard1.html` | Dashboard v1 — Analytics | Stat boxes dinámicos, gráficos de Chart.js (ventas mensuales e ingresos), historial de transacciones y resumen de métricas. |
| `index2.html` | Dashboard v2 — Finanzas | Enfoque financiero corporativo con gráfico de barras de ingresos mensuales, flujo de caja y clientes activos. |
| `index3.html` | Dashboard v3 — Monitoreo KPI | Rendimiento de servidores en tiempo real, latencia, conversión de embudos comerciales y uso de CPU. |
| `widgets.html` | Widgets Empresariales | Catálogo interactivo de Stat Boxes, barras de progreso de metas, chat interactivo en vivo, perfil flotante y badges. |
| `page-start.html` | Plantilla Base en Blanco | Estructura mínima con shell lista para comenzar a construir nuevos módulos desde cero. |
| `layout-top-nav.html` | Layout Navegación Superior | Barra de navegación horizontal en el header sin sidebar fijo (con drawer colapsable para móviles). |
| `layout-top-nav-sidebar.html`| Layout Híbrido | Barra de menú superior combinada con sidebar colapsable a la izquierda. |
| `layout-boxed.html` | Layout Enmarcado (Boxed) | Contenedor centrado con ancho máximo fijo (`max-w-7xl`) y sombra perimetral para pantallas ultra anchas. |
| `layout-fixed-sidebar.html` | Sidebar Fijo | Barra lateral con posición fija (`fixed`) e independiente del scroll del contenido central. |
| `layout-fixed-navbar.html` | Navbar Superior Fijo | Encabezado persistente (`sticky top-0`) con sombra y desenfoque backdrop blur. |
| `layout-collapsed-sidebar.html`| Sidebar Mini / Colapsado | Barra lateral reducida a iconos con menú flyout flotante interactivo al hacer hover. |
| `ui-general.html` | Elementos UI Generales | Acordeones interactivos, barras de progreso, alertas estilizadas, badges, chips y skeletons de carga. |
| `ui-buttons.html` | Botones & Grupos | Botones con variantes de color (primary, secondary, danger, warning), estados hover/active, loaders y grupos unidos. |
| `ui-icons.html` | Catálogo de Iconos | Buscador interactivo en vivo de más de 100 iconos de Lucide con previsualización y copia de marcado SVG. |
| `ui-modals.html` | Modales & Diálogos | Modales con cierre por tecla ESC, desenfoque de fondo (backdrop blur), confirmaciones y notificaciones toast flotantes. |
| `ui-navbar-tabs.html` | Barras de Navegación & Pestañas | Pestañas fluidas interactivas (tabs), submenús dropdowns multinivel y selectores de idiomas. |
| `forms-general.html` | Formularios Básicos | Inputs de texto estilizados, selects nativos, checkboxes, radio buttons, textareas y grupos de inputs con iconos. |
| `forms-advanced.html` | Formularios Avanzados | Selectores flotantes, interruptores (toggles), zona de arrastre para archivos (dropzone) y sliders de rango. |
| `forms-validation.html` | Validación en Tiempo Real | Campos con feedback visual de error, éxito y advertencia con mensajes de ayuda y validación nativa HTML5. |
| `tables-simple.html` | Tablas Simples | Tablas con diseño responsive, filas alternadas (striped), bordes sutiles y estados hover de fila. |
| `tables-datatables.html` | DataTables Avanzadas | Tabla con paginación reactiva, filtro de búsqueda instantáneo en cliente, selector de filas por página y ordenamiento. |
| `tables-jsgrid.html` | Tablas Matriciales (jsGrid) | Vista en cuadrícula densa para gestión masiva de registros empresariales con edición en línea. |
| `calendar.html` | Calendario Mensual | Cuadrícula de mes completo con soporte para agregar eventos interactivos y badges de colores por categoría. |
| `calendar-team.html` | Calendario de Equipo | Gestión de reuniones con avatares de participantes, filtros por departamento e inspector deslizable lateral. |
| `calendar-workload.html` | Carga de Trabajo (Heatmap) | Visualización de disponibilidad horaria por miembro del equipo y mapa de calor de ocupación. |
| `kanban.html` | Tablero Kanban Ágil | Tablero con columnas (Por Hacer, En Progreso, Revisión, Hecho), tarjetas con prioridad y persistencia en localStorage. |
| `pages-pos.html` | Terminal Punto de Venta (POS) | Cuadrícula de productos con categorías, ticket de comanda en vivo, cálculo automático de IVA y botón de cobro. |
| `pages-invoice.html` | Factura Comercial Imprimible | Factura con desglose fiscal, formas de pago, optimización para `@media print` y exportación a PDF. |
| `pages-profile.html` | Perfil de Usuario | Portada, avatar, datos de contacto, feed de actividad reciente, pestañas de proyectos y configuración de cuenta. |
| `pages-projects.html` | Directorio de Proyectos | Tarjetas de proyectos con barra de avance porcentual, avatares del equipo asignado, badges de estado y fechas límite. |
| `pages-ecommerce.html` | Catálogo E-Commerce | Cuadrícula de productos con insignias de descuento, galería de imágenes, selector de tallas y botón de añadir al carrito. |
| `pages-contacts.html` | Directorio de Contactos | Tarjetas de presentación tipo tarjeta de visita con acciones rápidas de llamada, correo y chat. |
| `pages-pricing.html` | Tabla de Precios & Planes | Comparador de planes de suscripción (Básico, Pro, Enterprise) con selector anual/mensual y llamada a la acción. |
| `pages-faq.html` | Preguntas Frecuentes (FAQ) | Acordeón de preguntas agrupadas por categoría con buscador de dudas y caja de soporte. |
| `pages-login.html` | Inicio de Sesión (Auth) | Formulario de login centrado con validación, selector de tema, botón de visualización de contraseña y login social. |
| `pages-register.html` | Registro de Cuenta | Registro con medidor interactivo de fuerza de contraseña, aceptación de términos y confirmación reactiva. |
| `pages-lockscreen.html` | Pantalla de Bloqueo | Interfaz de reanudación de sesión con avatar del usuario, campo de PIN/contraseña y opción de cambiar de cuenta. |
| `pages-forgot-password.html` | Recuperación de Contraseña | Formulario para ingresar correo electrónico con instrucciones de restablecimiento y retorno seguro al login. |
| `pages-404.html` | Error 404 No Encontrado | Ilustración vectorial minimalista, mensaje explicativo y botón directo de retorno a `dashboard1.html`. |
| `pages-500.html` | Error 500 del Servidor | Diagnóstico amigable de fallo interno con ID de seguimiento y botón de recarga. |

---

## 3. Guía de Conexión y Rutas de Archivos en Producción

Para enlazar los archivos distribuidos de VeltraUI en cualquier aplicación:

- **Hoja de estilo maestra**: `<link rel="stylesheet" href="./css/veltra.css">`
- **Controladores JavaScript maestros**: `<script type="module" src="./js/veltra.js"></script>`
- **Logotipo oficial**: `<img src="./logo.png" alt="VeltraUI">`
- **Iconos**: Cargar vía Lucide con `<i data-lucide="..."></i>` y ejecutar `lucide.createIcons()`.
