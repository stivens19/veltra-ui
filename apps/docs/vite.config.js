import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@veltra-ui/vanilla-js': path.resolve(import.meta.dirname, '../../packages/vanilla-js/src/index.ts')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        dashboard1: path.resolve(import.meta.dirname, 'dashboard1.html'),
        index2: path.resolve(import.meta.dirname, 'index2.html'),
        index3: path.resolve(import.meta.dirname, 'index3.html'),
        widgets: path.resolve(import.meta.dirname, 'widgets.html'),
        forms: path.resolve(import.meta.dirname, 'forms.html'),
        formsGeneral: path.resolve(import.meta.dirname, 'forms-general.html'),
        formsAdvanced: path.resolve(import.meta.dirname, 'forms-advanced.html'),
        formsValidation: path.resolve(import.meta.dirname, 'forms-validation.html'),
        tables: path.resolve(import.meta.dirname, 'tables.html'),
        tablesSimple: path.resolve(import.meta.dirname, 'tables-simple.html'),
        tablesDatatables: path.resolve(import.meta.dirname, 'tables-datatables.html'),
        tablesJsgrid: path.resolve(import.meta.dirname, 'tables-jsgrid.html'),
        layoutTopNav: path.resolve(import.meta.dirname, 'layout-top-nav.html'),
        layoutTopNavSidebar: path.resolve(import.meta.dirname, 'layout-top-nav-sidebar.html'),
        layoutBoxed: path.resolve(import.meta.dirname, 'layout-boxed.html'),
        layoutFixedSidebar: path.resolve(import.meta.dirname, 'layout-fixed-sidebar.html'),
        layoutFixedNavbar: path.resolve(import.meta.dirname, 'layout-fixed-navbar.html'),
        layoutCollapsedSidebar: path.resolve(import.meta.dirname, 'layout-collapsed-sidebar.html'),
        uiGeneral: path.resolve(import.meta.dirname, 'ui-general.html'),
        uiIcons: path.resolve(import.meta.dirname, 'ui-icons.html'),
        uiButtons: path.resolve(import.meta.dirname, 'ui-buttons.html'),
        uiModals: path.resolve(import.meta.dirname, 'ui-modals.html'),
        uiNavbarTabs: path.resolve(import.meta.dirname, 'ui-navbar-tabs.html'),
        calendar: path.resolve(import.meta.dirname, 'calendar.html'),
        calendarTeam: path.resolve(import.meta.dirname, 'calendar-team.html'),
        calendarWorkload: path.resolve(import.meta.dirname, 'calendar-workload.html'),
        kanban: path.resolve(import.meta.dirname, 'kanban.html'),
        pagesInvoice: path.resolve(import.meta.dirname, 'pages-invoice.html'),
        pagesProfile: path.resolve(import.meta.dirname, 'pages-profile.html'),
        pagesProjects: path.resolve(import.meta.dirname, 'pages-projects.html'),
        pagesEcommerce: path.resolve(import.meta.dirname, 'pages-ecommerce.html'),
        pagesPos: path.resolve(import.meta.dirname, 'pages-pos.html'),
        pagesLogin: path.resolve(import.meta.dirname, 'pages-login.html'),
        pagesRegister: path.resolve(import.meta.dirname, 'pages-register.html'),
        pagesLockscreen: path.resolve(import.meta.dirname, 'pages-lockscreen.html'),
        pagesForgotPassword: path.resolve(import.meta.dirname, 'pages-forgot-password.html'),
        pagesContacts: path.resolve(import.meta.dirname, 'pages-contacts.html'),
        pagesPricing: path.resolve(import.meta.dirname, 'pages-pricing.html'),
        pagesFaq: path.resolve(import.meta.dirname, 'pages-faq.html'),
        pageStart: path.resolve(import.meta.dirname, 'page-start.html'),
        docs: path.resolve(import.meta.dirname, 'docs.html'),
        pages404: path.resolve(import.meta.dirname, 'pages-404.html'),
        pages500: path.resolve(import.meta.dirname, 'pages-500.html'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'main') {
            return 'js/veltra.js';
          }
          return 'js/chunks/[name].js';
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || (assetInfo.names && assetInfo.names[0]) || '';
          if (name.endsWith('.css')) {
            return 'css/veltra.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
