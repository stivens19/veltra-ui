/**
 * VeltraUI Interactive Enterprise Kanban Engine
 * High-performance vanilla JS Kanban with drag & drop, column counters,
 * subtask checklists, search, filtering by member/priority, and localStorage persistence.
 */

const KANBAN_STORAGE_KEY = 'veltra_kanban_tasks_v1';

const TEAM_MEMBERS = {
  stivens: { name: 'Stivens Espinoza', avatar: '/avatar.jpg', role: 'Lead Architect' },
  sarah: { name: 'Sarah Bullock', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', role: 'Frontend Lead' },
  john: { name: 'John Pierce', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', role: 'Backend Engineer' },
  alex: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', role: 'UI/UX Designer' }
};

const DEFAULT_TASKS = [
  {
    id: 'kb-1',
    col: 'todo',
    title: 'Refactorizar animaciones de Dropdown',
    desc: 'Asegurar compatibilidad con dispositivos móviles y transiciones suaves con desenfoque de fondo.',
    priority: 'Media',
    priorityColor: 'amber',
    tags: ['UI/UX', 'Frontend'],
    assignees: ['sarah'],
    subtasks: [
      { text: 'Añadir backdrop-blur-xs', done: true },
      { text: 'Optimizar cierre al pulsar fuera', done: false },
      { text: 'Pruebas táctiles en iPhone y Android', done: false }
    ],
    commentsCount: 3,
    attachmentsCount: 1,
    dueDate: '16 Nov'
  },
  {
    id: 'kb-2',
    col: 'todo',
    title: 'Diseñar especificación de Tokens Veltra',
    desc: 'Documentar variables CSS y variantes para modo oscuro en Figma y Storybook.',
    priority: 'Baja',
    priorityColor: 'slate',
    tags: ['Figma', 'Tokens'],
    assignees: ['alex'],
    subtasks: [
      { text: 'Auditoría de contrastes WCAG AA', done: false },
      { text: 'Exportar paleta en JSON', done: false }
    ],
    commentsCount: 1,
    attachmentsCount: 2,
    dueDate: '20 Nov'
  },
  {
    id: 'kb-3',
    col: 'in_progress',
    title: 'Integración de Filtros y Búsqueda en Vivo',
    desc: 'Implementar debounce y paginación en DataTables para optimizar búsquedas masivas de +5000 registros.',
    priority: 'Alta',
    priorityColor: 'rose',
    tags: ['DataTables', 'Perf'],
    assignees: ['stivens', 'john'],
    subtasks: [
      { text: 'Escribir algoritmo de ordenamiento', done: true },
      { text: 'Exportar a CSV y Excel', done: true },
      { text: 'Acciones en bloque seleccionadas', done: false }
    ],
    commentsCount: 6,
    attachmentsCount: 3,
    dueDate: 'Hoy'
  },
  {
    id: 'kb-4',
    col: 'in_progress',
    title: 'Validación en vivo de Formularios con Máscara',
    desc: 'Formateo automático de tarjeta de crédito, número telefónico internacional y cálculo de fortaleza.',
    priority: 'Alta',
    priorityColor: 'cyan',
    tags: ['Forms', 'Validation'],
    assignees: ['sarah', 'stivens'],
    subtasks: [
      { text: 'Máscara de teléfono internacional', done: true },
      { text: 'Tag chips dinámicos estilo Select2', done: true },
      { text: 'Indicador de seguridad de contraseña', done: false }
    ],
    commentsCount: 4,
    attachmentsCount: 0,
    dueDate: '14 Nov'
  },
  {
    id: 'kb-5',
    col: 'review',
    title: 'Auditoría de Accesibilidad WCAG AA',
    desc: 'Verificar ratios de contraste en estados deshabilitados y etiquetas aria-live en alertas.',
    priority: 'Media',
    priorityColor: 'amber',
    tags: ['A11y', 'QA'],
    assignees: ['alex', 'sarah'],
    subtasks: [
      { text: 'Revisar navegación con tabulador', done: true },
      { text: 'Corregir textos muted a slate-500', done: true }
    ],
    commentsCount: 8,
    attachmentsCount: 2,
    dueDate: '13 Nov'
  },
  {
    id: 'kb-6',
    col: 'done',
    title: 'Implementar Sidebar Fijo con Scroll Aislado',
    desc: 'Bloqueo del logo superior y avatar, mientras la lista de navegación tiene scroll custom con barra cyan de 4px.',
    priority: 'Completado',
    priorityColor: 'emerald',
    tags: ['Core', 'Layout'],
    assignees: ['stivens'],
    subtasks: [
      { text: 'Fijar header con height: 100vh', done: true },
      { text: 'Añadir scrollbar personalizada', done: true }
    ],
    commentsCount: 5,
    attachmentsCount: 4,
    dueDate: 'Ayer'
  },
  {
    id: 'kb-7',
    col: 'done',
    title: 'Compilación de Estilos SCSS en Vite',
    desc: 'Automatización del build de @veltra-ui/core-styles con Tailwind v4 sin utilities huérfanas.',
    priority: 'Completado',
    priorityColor: 'emerald',
    tags: ['Build', 'Vite'],
    assignees: ['john'],
    subtasks: [
      { text: 'Configurar cssCodeSplit', done: true },
      { text: 'Exportar dist/veltra.css', done: true }
    ],
    commentsCount: 2,
    attachmentsCount: 1,
    dueDate: '10 Nov'
  }
];

export class VeltraKanban {
  constructor() {
    this.tasks = this.loadTasks();
    this.searchQuery = '';
    this.filterPriority = 'all';
    this.filterMember = null;
    this.draggedTaskId = null;
    this.currentActiveTask = null;

    this.initDOM();
    this.bindEvents();
    this.render();
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem(KANBAN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [...DEFAULT_TASKS];
    } catch (e) {
      return [...DEFAULT_TASKS];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (e) {}
  }

  initDOM() {
    this.board = document.getElementById('vlt-kanban-board');
    this.searchInput = document.getElementById('kb-search-input');
    this.priorityFilters = document.querySelectorAll('[data-kb-priority]');
    this.memberFilters = document.querySelectorAll('[data-kb-member]');
    this.btnNewTask = document.getElementById('btn-new-task');

    // Modals & Slide-over
    this.taskModal = document.getElementById('kb-task-modal');
    this.slideOver = document.getElementById('kb-slide-over');
    this.slideOverBackdrop = document.getElementById('kb-slide-backdrop');
    this.slideOverClose = document.getElementById('kb-slide-close');
  }

  bindEvents() {
    // Search filter
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Priority filter pills
    this.priorityFilters.forEach(pill => {
      pill.addEventListener('click', () => {
        this.priorityFilters.forEach(p => p.classList.remove('bg-cyan-50', 'text-cyan-600', 'font-bold', 'border-cyan-200'));
        pill.classList.add('bg-cyan-50', 'text-cyan-600', 'font-bold', 'border-cyan-200');
        this.filterPriority = pill.getAttribute('data-kb-priority');
        this.render();
      });
    });

    // Member filter avatars
    this.memberFilters.forEach(avatarBtn => {
      avatarBtn.addEventListener('click', () => {
        const mId = avatarBtn.getAttribute('data-kb-member');
        if (this.filterMember === mId) {
          this.filterMember = null;
          avatarBtn.classList.remove('ring-2', 'ring-cyan-500', 'scale-110');
        } else {
          this.memberFilters.forEach(b => b.classList.remove('ring-2', 'ring-cyan-500', 'scale-110'));
          avatarBtn.classList.add('ring-2', 'ring-cyan-500', 'scale-110');
          this.filterMember = mId;
        }
        this.render();
      });
    });

    // Open New Task Modal
    if (this.btnNewTask) {
      this.btnNewTask.addEventListener('click', () => this.openNewTaskModal('todo'));
    }

    // Slide-over close handlers
    if (this.slideOverClose) {
      this.slideOverClose.addEventListener('click', () => this.closeSlideOver());
    }
    if (this.slideOverBackdrop) {
      this.slideOverBackdrop.addEventListener('click', () => this.closeSlideOver());
    }

    // Column plus buttons
    document.querySelectorAll('[data-col-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const colId = btn.getAttribute('data-col-add');
        this.openNewTaskModal(colId);
      });
    });

    // Save modal task
    const saveTaskBtn = document.getElementById('btn-save-task');
    if (saveTaskBtn) {
      saveTaskBtn.addEventListener('click', () => this.saveNewTask());
    }
  }

  getFilteredTasks() {
    return this.tasks.filter(t => {
      // Search
      if (this.searchQuery) {
        const inTitle = t.title.toLowerCase().includes(this.searchQuery);
        const inDesc = t.desc.toLowerCase().includes(this.searchQuery);
        const inTags = t.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
        if (!inTitle && !inDesc && !inTags) return false;
      }

      // Priority
      if (this.filterPriority !== 'all') {
        if (this.filterPriority === 'alta' && t.priority !== 'Alta') return false;
        if (this.filterPriority === 'media' && t.priority !== 'Media') return false;
        if (this.filterPriority === 'baja' && t.priority !== 'Baja') return false;
        if (this.filterPriority === 'completado' && t.priority !== 'Completado') return false;
      }

      // Member
      if (this.filterMember) {
        if (!t.assignees.includes(this.filterMember)) return false;
      }

      return true;
    });
  }

  render() {
    const columns = [
      { id: 'todo', title: 'Por Hacer', dot: 'bg-slate-400' },
      { id: 'in_progress', title: 'En Progreso', dot: 'bg-cyan-500' },
      { id: 'review', title: 'En Revisión / QA', dot: 'bg-amber-500' },
      { id: 'done', title: 'Completado', dot: 'bg-emerald-500' }
    ];

    const filtered = this.getFilteredTasks();

    columns.forEach(col => {
      const colCards = filtered.filter(t => t.col === col.id);
      
      // Update badge count
      const badge = document.getElementById(`count-${col.id}`);
      if (badge) badge.textContent = colCards.length;

      // Update list
      const listEl = document.getElementById(`list-${col.id}`);
      if (listEl) {
        listEl.innerHTML = colCards.map(t => this.renderCardHtml(t)).join('');
      }
    });

    this.bindDragDrop();
    this.bindCardClicks();

    if (window.lucide) window.lucide.createIcons();
  }

  renderCardHtml(t) {
    const doneSubtasks = t.subtasks ? t.subtasks.filter(s => s.done).length : 0;
    const totalSubtasks = t.subtasks ? t.subtasks.length : 0;
    const progressPct = totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : 0;

    // Assignee avatars
    const avatarsHtml = t.assignees.map(mId => {
      const mem = TEAM_MEMBERS[mId];
      if (!mem) return '';
      return `<img class="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-800" src="${mem.avatar}" title="${mem.name}" alt="${mem.name}" />`;
    }).join('');

    // Tags
    const tagsHtml = t.tags.map(tag => `
      <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
        ${tag}
      </span>
    `).join('');

    // Priority badge
    let priorityBadgeClass = 'vlt-badge-slate';
    if (t.priorityColor === 'rose') priorityBadgeClass = 'vlt-badge-danger';
    if (t.priorityColor === 'cyan') priorityBadgeClass = 'vlt-badge-cyan';
    if (t.priorityColor === 'amber') priorityBadgeClass = 'vlt-badge-warning';
    if (t.priorityColor === 'emerald') priorityBadgeClass = 'vlt-badge-success';

    return `
      <div class="vlt-kanban-card" draggable="true" data-task-id="${t.id}">
        
        <!-- Top: Tags & Priority -->
        <div class="card-top">
          <div class="flex flex-wrap items-center gap-1">
            ${tagsHtml}
          </div>
          <span class="vlt-badge ${priorityBadgeClass} text-[10px] shrink-0 font-bold">${t.priority}</span>
        </div>

        <!-- Title & Desc -->
        <div>
          <h4 class="card-title">${t.title}</h4>
          ${t.desc ? `<p class="card-desc mt-1">${t.desc}</p>` : ''}
        </div>

        <!-- Subtasks Progress Bar -->
        ${totalSubtasks > 0 ? `
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span class="flex items-center gap-1"><i data-lucide="check-square" class="w-3 h-3 text-cyan-500"></i>Subtareas</span>
              <span class="font-mono">${doneSubtasks}/${totalSubtasks}</span>
            </div>
            <div class="card-progress-bar">
              <div class="progress-fill ${progressPct === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}" style="width: ${progressPct}%;"></div>
            </div>
          </div>
        ` : ''}

        <!-- Bottom: Assignees & Metrics -->
        <div class="card-bottom">
          <div class="flex items-center -space-x-1.5">
            ${avatarsHtml}
          </div>

          <div class="card-metrics">
            ${t.commentsCount > 0 ? `<span><i data-lucide="message-square" class="w-3 h-3"></i>${t.commentsCount}</span>` : ''}
            ${t.attachmentsCount > 0 ? `<span><i data-lucide="paperclip" class="w-3 h-3"></i>${t.attachmentsCount}</span>` : ''}
            <span class="font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <i data-lucide="calendar" class="w-3 h-3"></i>${t.dueDate}
            </span>
          </div>
        </div>

      </div>
    `;
  }

  bindDragDrop() {
    const cards = document.querySelectorAll('.vlt-kanban-card');
    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.draggedTaskId = card.getAttribute('data-task-id');
        e.dataTransfer.setData('text/plain', this.draggedTaskId);
        card.classList.add('dragging');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedTaskId = null;
      });
    });

    const columns = document.querySelectorAll('.vlt-kanban-column');
    columns.forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('drag-over');
      });

      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');

        const taskId = this.draggedTaskId || e.dataTransfer.getData('text/plain');
        const targetColId = col.getAttribute('data-col-id');

        if (taskId && targetColId) {
          const task = this.tasks.find(t => t.id === taskId);
          if (task && task.col !== targetColId) {
            task.col = targetColId;
            if (targetColId === 'done') {
              task.priority = 'Completado';
              task.priorityColor = 'emerald';
              if (task.subtasks) task.subtasks.forEach(s => s.done = true);
            }
            this.saveTasks();
            this.render();
          }
        }
      });
    });
  }

  bindCardClicks() {
    document.querySelectorAll('.vlt-kanban-card').forEach(card => {
      card.addEventListener('click', () => {
        const taskId = card.getAttribute('data-task-id');
        this.openSlideOver(taskId);
      });
    });
  }

  openSlideOver(taskId) {
    const t = this.tasks.find(x => x.id === taskId);
    if (!t || !this.slideOver) return;

    this.currentActiveTask = t;

    document.getElementById('slide-task-title').textContent = t.title;
    document.getElementById('slide-task-desc').textContent = t.desc || 'Sin descripción detallada';
    document.getElementById('slide-task-due').textContent = t.dueDate;

    const colSelect = document.getElementById('slide-task-col-select');
    if (colSelect) colSelect.value = t.col;

    // Subtasks Checklist
    const checkContainer = document.getElementById('slide-task-subtasks');
    if (checkContainer) {
      if (t.subtasks && t.subtasks.length > 0) {
        checkContainer.innerHTML = t.subtasks.map((st, idx) => `
          <label class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" ${st.done ? 'checked' : ''} class="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" data-subtask-idx="${idx}" />
            <span class="${st.done ? 'line-through text-slate-400' : 'font-medium'}">${st.text}</span>
          </label>
        `).join('');

        checkContainer.querySelectorAll('[data-subtask-idx]').forEach(chk => {
          chk.addEventListener('change', (e) => {
            const idx = parseInt(e.target.getAttribute('data-subtask-idx'), 10);
            t.subtasks[idx].done = e.target.checked;
            this.saveTasks();
            this.render();
            this.openSlideOver(t.id);
          });
        });
      } else {
        checkContainer.innerHTML = `<p class="text-xs text-slate-400">Sin subtareas.</p>`;
      }
    }

    // Delete Task
    const delBtn = document.getElementById('btn-delete-task');
    if (delBtn) {
      delBtn.onclick = () => {
        if (confirm(`¿Eliminar la tarea "${t.title}"?`)) {
          this.tasks = this.tasks.filter(x => x.id !== t.id);
          this.saveTasks();
          this.closeSlideOver();
          this.render();
        }
      };
    }

    // Update Column from Select
    if (colSelect) {
      colSelect.onchange = (e) => {
        t.col = e.target.value;
        if (t.col === 'done') {
          t.priority = 'Completado';
          t.priorityColor = 'emerald';
        }
        this.saveTasks();
        this.render();
      };
    }

    this.slideOver.classList.add('is-open');
    if (window.lucide) window.lucide.createIcons();
  }

  closeSlideOver() {
    if (this.slideOver) {
      this.slideOver.classList.remove('is-open');
    }
  }

  openNewTaskModal(colId = 'todo') {
    if (!this.taskModal) return;
    document.getElementById('modal-new-title').value = '';
    document.getElementById('modal-new-desc').value = '';
    document.getElementById('modal-new-col').value = colId;
    document.getElementById('modal-new-priority').value = 'Media';
    document.getElementById('modal-new-due').value = '18 Nov';

    this.taskModal.classList.remove('hidden');
    this.taskModal.classList.add('flex');
  }

  closeNewTaskModal() {
    if (!this.taskModal) return;
    this.taskModal.classList.add('hidden');
    this.taskModal.classList.remove('flex');
  }

  saveNewTask() {
    const title = document.getElementById('modal-new-title').value.trim();
    if (!title) return;

    const desc = document.getElementById('modal-new-desc').value.trim();
    const col = document.getElementById('modal-new-col').value;
    const priority = document.getElementById('modal-new-priority').value;
    const due = document.getElementById('modal-new-due').value.trim() || 'Pronto';

    let priorityColor = 'amber';
    if (priority === 'Alta') priorityColor = 'rose';
    if (priority === 'Baja') priorityColor = 'slate';
    if (priority === 'Completado') priorityColor = 'emerald';

    const newTask = {
      id: 'kb-' + Date.now(),
      col: col,
      title: title,
      desc: desc,
      priority: priority,
      priorityColor: priorityColor,
      tags: ['Feature'],
      assignees: ['stivens'],
      subtasks: [
        { text: 'Diseño e implementación inicial', done: false }
      ],
      commentsCount: 0,
      attachmentsCount: 0,
      dueDate: due
    };

    this.tasks.push(newTask);
    this.saveTasks();
    this.closeNewTaskModal();
    this.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vlt-kanban-board')) {
    window.veltraKanban = new VeltraKanban();
  }
});

