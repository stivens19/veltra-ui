import { VeltraUI, createIcons, icons } from '@veltra-ui/vanilla-js';
import { initDashboardCharts, initV1Charts, initV2Charts, initV3Charts } from './charts.js';
import { initFormsInteractivity } from './forms.js';
import { initDataTables, initJsGrid } from './tables.js';

// View Router & Interactive Demo Controller
document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });

  // Initialize charts for the active page
  initDashboardCharts();

  // Initialize form controls interactivity
  initFormsInteractivity();

  // Initialize interactive DataTables & jsGrid
  initDataTables();
  initJsGrid();

  // Listen to navigation events from treeview controller
  document.addEventListener('veltra:nav', (e) => {
    const { targetId, title, section } = e.detail;

    // Handle special actions
    if (targetId === 'view-layout-collapsed') {
      document.body.classList.toggle('vlt-sidebar-collapsed');
      return;
    }

    if (targetId === 'view-layout-boxed') {
      const wrapper = document.querySelector('.vlt-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('max-w-7xl');
        wrapper.classList.toggle('mx-auto');
        wrapper.classList.toggle('shadow-2xl');
      }
      return;
    }

    // Switch view panels
    const allViews = document.querySelectorAll('[data-view-panel]');
    let targetView = document.querySelector(`[data-view-panel="${targetId}"]`);

    if (!targetView) {
      if (targetId.startsWith('view-ui')) {
        targetView = document.querySelector('[data-view-panel="view-ui-elements"]');
      } else if (targetId.startsWith('view-forms')) {
        targetView = document.querySelector('[data-view-panel="view-forms"]');
      } else if (targetId.startsWith('view-tables')) {
        targetView = document.querySelector('[data-view-panel="view-tables"]');
      } else if (targetId.startsWith('view-mailbox')) {
        targetView = document.querySelector('[data-view-panel="view-mailbox"]');
      }
    }

    if (targetView) {
      allViews.forEach((v) => v.classList.add('hidden'));
      targetView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Initialize charts when corresponding dashboard is revealed
      if (targetId === 'view-dashboard-v1') {
        setTimeout(initV1Charts, 50);
      } else if (targetId === 'view-dashboard-v2') {
        setTimeout(initV2Charts, 50);
      } else if (targetId === 'view-dashboard-v3') {
        setTimeout(initV3Charts, 50);
      }
    } else {
      // Generic fallback view panel
      const genericPanel = document.querySelector('[data-view-panel="generic-view"]');
      if (genericPanel) {
        allViews.forEach((v) => v.classList.add('hidden'));
        genericPanel.classList.remove('hidden');
        const titleEl = genericPanel.querySelector('.view-title');
        const subtitleEl = genericPanel.querySelector('.view-subtitle');
        if (titleEl) titleEl.textContent = title;
        if (subtitleEl) subtitleEl.textContent = `${section} > ${title} demonstration in pure light VeltraUI style.`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Re-render any icons inside the newly shown view
    createIcons({ icons });
  });

  // Simple live search filter in DataTables view
  document.addEventListener('input', (e) => {
    const searchInput = e.target.closest('#datatable-filter');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#datatable-body tr');

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // Search Modal / Command Palette Controller
  const searchModal = document.getElementById('vlt-search-modal');
  const modalInput = document.getElementById('vlt-modal-search-input');
  const searchResults = document.querySelectorAll('#vlt-search-results a');

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('hidden');
    searchModal.classList.add('flex');
    if (modalInput) {
      modalInput.value = '';
      setTimeout(() => modalInput.focus(), 50);
    }
    searchResults.forEach((item) => (item.style.display = ''));
    createIcons({ icons, root: searchModal });
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add('hidden');
    searchModal.classList.remove('flex');
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-vlt-toggle="search-modal"]');
    if (trigger) {
      e.preventDefault();
      openSearchModal();
      return;
    }

    const closeBtn = e.target.closest('[data-vlt-close="search-modal"]');
    if (closeBtn) {
      e.preventDefault();
      closeSearchModal();
      return;
    }

    if (e.target === searchModal) {
      closeSearchModal();
    }
  });

  // Shortcut Ctrl+K / Cmd+K and Escape
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal && !searchModal.classList.contains('hidden')) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === 'Escape') {
      closeSearchModal();
    }
  });

  // Live filter inside Search Modal
  if (modalInput) {
    modalInput.addEventListener('input', () => {
      const q = modalInput.value.toLowerCase().trim();
      searchResults.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // Accordion Controller
  document.addEventListener('click', (e) => {
    const accHeader = e.target.closest('.vlt-accordion-header');
    if (accHeader) {
      e.preventDefault();
      const item = accHeader.closest('.vlt-accordion-item');
      if (item) {
        item.classList.toggle('is-open');
      }
      return;
    }

    // Dismiss Alert
    const alertClose = e.target.closest('.vlt-alert-close');
    if (alertClose) {
      e.preventDefault();
      const alert = alertClose.closest('.vlt-alert');
      if (alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-4px)';
        setTimeout(() => alert.remove(), 200);
      }
      return;
    }

    // Interactive Toast Triggers
    const toastBtn = e.target.closest('[data-toast-type]');
    if (toastBtn && window.veltra?.modal) {
      e.preventDefault();
      const type = toastBtn.getAttribute('data-toast-type') || 'cyan';
      const titles = {
        emerald: 'Operación Exitosa',
        amber: 'Advertencia del Sistema',
        rose: 'Error en la Petición',
        cyan: 'Actualización en Curso'
      };
      const messages = {
        emerald: 'Los cambios fueron persistidos en la base de datos.',
        amber: 'El almacenamiento está al 85% de capacidad.',
        rose: 'No se pudo conectar con el endpoint remoto (500).',
        cyan: 'Se ha sincronizado la versión 1.0.0 de VeltraUI.'
      };
      window.veltra.modal.toast({
        title: titles[type] || 'Notificación',
        message: messages[type] || 'Evento registrado con éxito.',
        type: type,
        duration: 4000
      });
      return;
    }

    // Copy Lucide Icon
    const copyBtn = e.target.closest('[data-copy-icon]');
    if (copyBtn) {
      e.preventDefault();
      const iconName = copyBtn.getAttribute('data-copy-icon');
      const snippet = `<i data-lucide="${iconName}"></i>`;
      navigator.clipboard?.writeText(snippet);
      if (window.veltra?.modal) {
        window.veltra.modal.toast({
          title: 'Icono Copiado',
          message: `Código ${snippet} copiado al portapapeles.`,
          type: 'cyan',
          duration: 2500
        });
      }
      return;
    }

    // Card Refresh / Loading Overlay Simulator
    const refreshBtn = e.target.closest('[data-simulate-refresh]');
    if (refreshBtn) {
      e.preventDefault();
      const card = refreshBtn.closest('.vlt-card');
      if (card) {
        const overlay = card.querySelector('.vlt-card-overlay');
        if (overlay) {
          overlay.classList.remove('hidden');
          setTimeout(() => {
            overlay.classList.add('hidden');
            window.veltra?.modal?.toast({
              title: 'Datos Actualizados',
              message: 'El dataset fue sincronizado exitosamente.',
              type: 'emerald',
              duration: 2500
            });
          }, 1500);
        }
      }
      return;
    }
  });

  // Re-run icons when tabs change
  document.addEventListener('veltra:tab:change', () => {
    createIcons({ icons });
  });

  // Live Icon Search in Icons view
  const iconFilterInput = document.getElementById('vlt-icon-search');
  if (iconFilterInput) {
    iconFilterInput.addEventListener('input', () => {
      const q = iconFilterInput.value.toLowerCase().trim();
      const iconCards = document.querySelectorAll('[data-icon-card]');
      iconCards.forEach((card) => {
        const name = card.getAttribute('data-icon-card') || '';
        card.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  // Interactive Icon Size Slider
  const iconSizeSlider = document.getElementById('vlt-icon-size-slider');
  const iconSizeLabel = document.getElementById('vlt-icon-size-label');
  if (iconSizeSlider) {
    iconSizeSlider.addEventListener('input', () => {
      const size = iconSizeSlider.value;
      if (iconSizeLabel) iconSizeLabel.textContent = `${size}px`;
      document.querySelectorAll('#vlt-icons-container i[data-lucide]').forEach(icon => {
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
      });
    });
  }

  // Drag & Drop File Upload Controller
  const dropzones = document.querySelectorAll('.vlt-dropzone');
  dropzones.forEach((zone) => {
    const fileInput = zone.querySelector('input[type="file"]');
    const previewContainer = document.getElementById(zone.getAttribute('data-preview-target'));

    ['dragenter', 'dragover'].forEach(eventName => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
      });
    });

    zone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files?.length) {
        handleFiles(files, previewContainer);
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files?.length) {
          handleFiles(fileInput.files, previewContainer);
        }
      });
    }
  });

  function handleFiles(files, container) {
    if (!container) return;
    Array.from(files).forEach(file => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const item = document.createElement('div');
      item.className = 'vlt-file-item';
      item.innerHTML = `
        <div class="vlt-file-icon"><i data-lucide="file" class="w-5 h-5 text-cyan-500"></i></div>
        <div class="vlt-file-info">
          <span class="vlt-file-name">${file.name}</span>
          <div class="vlt-file-meta">
            <span>${sizeMb} MB</span>
            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
            <span class="text-emerald-600 font-bold">Listo para procesar</span>
          </div>
        </div>
        <button type="button" class="vlt-file-remove" title="Eliminar"><i data-lucide="x" class="w-4 h-4"></i></button>
      `;
      item.querySelector('.vlt-file-remove').addEventListener('click', () => item.remove());
      container.appendChild(item);
    });
    createIcons({ icons, root: container });
    window.veltra?.modal?.toast({
      title: 'Archivos Detectados',
      message: `${files.length} archivo(s) listo(s) en la cola.`,
      type: 'cyan',
      duration: 3000
    });
  }

  // Drag & Drop Sortable List Controller
  const sortableLists = document.querySelectorAll('.vlt-sortable-list');
  sortableLists.forEach(list => {
    let draggedItem = null;

    list.querySelectorAll('.vlt-sortable-item').forEach(item => {
      item.setAttribute('draggable', 'true');

      item.addEventListener('dragstart', () => {
        draggedItem = item;
        setTimeout(() => item.classList.add('dragging'), 0);
      });

      item.addEventListener('dragend', () => {
        draggedItem?.classList.remove('dragging');
        draggedItem = null;
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
          list.appendChild(draggedItem);
        } else {
          list.insertBefore(draggedItem, afterElement);
        }
      });
    });
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.vlt-sortable-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Interactive Star Rating
  document.addEventListener('click', (e) => {
    const star = e.target.closest('.vlt-rating .star');
    if (star) {
      const ratingGroup = star.closest('.vlt-rating');
      const stars = Array.from(ratingGroup.querySelectorAll('.star'));
      const index = stars.indexOf(star);
      stars.forEach((s, idx) => {
        s.classList.toggle('active', idx <= index);
      });
    }
  });
});
