/**
 * VeltraUI Interactive Calendar Engine
 * Complete VeltraUI draggable calendar with views (Month, Week, Day, Agenda),
 * event creation, drag-and-drop support, persistence, and modals.
 */

const STORAGE_KEY = 'veltra_calendar_events_v1';

// Default Demo Events
const DEFAULT_EVENTS = [
  { id: 'ev-1', title: 'Sprint Planning VeltraUI', date: '2026-11-04', time: '10:00 AM', category: 'cyan', notes: 'Revisión del backlog y arquitectura de nuevos componentes' },
  { id: 'ev-2', title: 'Demo con Cliente Corp', date: '2026-11-12', time: '03:30 PM', category: 'emerald', notes: 'Presentación interactiva de DataTables y formularios en vivo' },
  { id: 'ev-3', title: 'Revisión de Seguridad & RBAC', date: '2026-11-18', time: '11:00 AM', category: 'amber', notes: 'Auditoría de endpoints y sesiones' },
  { id: 'ev-4', title: 'Entrega Sprint Milestone 3', date: '2026-11-25', time: '05:00 PM', category: 'rose', notes: 'Cierre de ciclo y despliegue a staging' },
  { id: 'ev-5', title: 'Design Review & UX Sync', date: '2026-11-27', time: '02:00 PM', category: 'indigo', notes: 'Feedback sobre tokens, contrastes y modos oscuros' }
];

export class VeltraCalendar {
  constructor(containerId = 'vlt-calendar-app') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentDate = new Date(2026, 10, 12); // Default Nov 2026 to match context
    this.currentView = 'month'; // 'month' | 'week' | 'day' | 'agenda'
    this.selectedCategory = 'cyan';
    this.draggedData = null;

    this.loadEvents();
    this.initDOM();
    this.bindEvents();
    this.render();
  }

  loadEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.events = stored ? JSON.parse(stored) : [...DEFAULT_EVENTS];
    } catch (e) {
      this.events = [...DEFAULT_EVENTS];
    }
  }

  saveEvents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    } catch (e) {}
  }

  initDOM() {
    this.titleEl = document.getElementById('cal-current-title');
    this.bodyEl = document.getElementById('cal-display-body');
    this.prevBtn = document.getElementById('cal-prev-btn');
    this.nextBtn = document.getElementById('cal-next-btn');
    this.todayBtn = document.getElementById('cal-today-btn');
    this.viewBtns = document.querySelectorAll('[data-cal-view]');

    // External Draggable Sidebar items
    this.draggableContainer = document.getElementById('external-events-list');
    this.removeAfterDropCheck = document.getElementById('drop-remove-check');
    this.createEventInput = document.getElementById('new-event-title');
    this.createEventBtn = document.getElementById('btn-add-external-event');
    this.colorOptions = document.querySelectorAll('[data-color-pick]');

    // Modals
    this.eventModal = document.getElementById('cal-event-modal');
    this.detailsModal = document.getElementById('cal-details-modal');
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.currentView === 'month') {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (this.currentView === 'week') {
          this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() - 1);
        }
        this.render();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (this.currentView === 'month') {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        } else if (this.currentView === 'week') {
          this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() + 1);
        }
        this.render();
      });
    }

    if (this.todayBtn) {
      this.todayBtn.addEventListener('click', () => {
        this.currentDate = new Date(2026, 10, 12);
        this.render();
      });
    }

    // View toggles
    this.viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentView = btn.getAttribute('data-cal-view');
        this.render();
      });
    });

    // Color picker
    this.colorOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        this.colorOptions.forEach(o => o.classList.remove('ring-2', 'ring-cyan-500', 'scale-110'));
        opt.classList.add('ring-2', 'ring-cyan-500', 'scale-110');
        this.selectedCategory = opt.getAttribute('data-color-pick');
      });
    });

    // Add new external draggable event
    if (this.createEventBtn && this.createEventInput) {
      this.createEventBtn.addEventListener('click', () => {
        const title = this.createEventInput.value.trim();
        if (!title) return;
        this.addExternalEvent(title, this.selectedCategory);
        this.createEventInput.value = '';
      });
      this.createEventInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.createEventBtn.click();
        }
      });
    }

    // Bind existing draggable events
    this.bindDraggableItems();
  }

  bindDraggableItems() {
    if (!this.draggableContainer) return;
    const items = this.draggableContainer.querySelectorAll('.vlt-draggable-item');
    items.forEach(item => {
      item.setAttribute('draggable', 'true');
      item.ondragstart = (e) => {
        const title = item.getAttribute('data-event-title') || item.innerText.trim();
        const category = item.getAttribute('data-event-category') || 'cyan';
        this.draggedData = {
          type: 'external',
          title,
          category,
          elementId: item.id
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedData));
        item.classList.add('dragging');
      };
      item.ondragend = () => {
        item.classList.remove('dragging');
      };
    });
  }

  addExternalEvent(title, category) {
    if (!this.draggableContainer) return;
    const id = 'ext-' + Date.now();
    const item = document.createElement('div');
    item.id = id;
    item.className = 'vlt-draggable-item';
    item.setAttribute('data-event-title', title);
    item.setAttribute('data-event-category', category);
    item.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-${category === 'cyan' ? 'cyan-500' : category === 'emerald' ? 'emerald-500' : category === 'amber' ? 'amber-500' : category === 'rose' ? 'rose-500' : 'indigo-500'}"></span>
        <span>${title}</span>
      </span>
      <span class="item-badge bg-${category}-50 text-${category}-700 border border-${category}-200">${category}</span>
    `;
    this.draggableContainer.prepend(item);
    this.bindDraggableItems();
    if (window.lucide) window.lucide.createIcons();
  }

  render() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const curMonth = months[this.currentDate.getMonth()];
    const curYear = this.currentDate.getFullYear();

    if (this.titleEl) {
      if (this.currentView === 'month') {
        this.titleEl.textContent = `${curMonth} ${curYear}`;
      } else if (this.currentView === 'week') {
        this.titleEl.textContent = `Semana de ${curMonth} ${curYear}`;
      } else if (this.currentView === 'day') {
        this.titleEl.textContent = `${this.currentDate.getDate()} de ${curMonth}, ${curYear}`;
      } else {
        this.titleEl.textContent = `Agenda General - ${curMonth} ${curYear}`;
      }
    }

    if (this.currentView === 'month') {
      this.renderMonthView();
    } else if (this.currentView === 'week') {
      this.renderWeekView();
    } else if (this.currentView === 'day') {
      this.renderDayView();
    } else {
      this.renderAgendaView();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let html = `
      <div class="vlt-calendar-month">
        <div class="cal-weekday-header">
          <div>DOM</div><div>LUN</div><div>MAR</div><div>MIÉ</div><div>JUE</div><div>VIE</div><div>SÁB</div>
        </div>
        <div class="cal-days-grid">
    `;

    // Previous month filler days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevMonthDays - x + 1;
      const prevDate = new Date(year, month - 1, dayNum);
      const isoDate = this.formatDateISO(prevDate);
      html += this.renderDayCell(isoDate, dayNum, true, false);
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      const isoDate = this.formatDateISO(d);
      const isToday = (isoDate === '2026-11-12'); // Simulation anchor
      html += this.renderDayCell(isoDate, i, false, isToday);
    }

    // Next month filler days to complete grid (multiples of 7)
    const totalCells = firstDayIndex + totalDaysInMonth;
    const nextDays = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    for (let j = 1; j <= nextDays; j++) {
      const nextDate = new Date(year, month + 1, j);
      const isoDate = this.formatDateISO(nextDate);
      html += this.renderDayCell(isoDate, j, true, false);
    }

    html += `</div></div>`;
    this.bodyEl.innerHTML = html;
    this.bindDropTargets();
  }

  renderDayCell(isoDate, dayNum, isOtherMonth, isToday) {
    const dayEvents = this.events.filter(e => e.date === isoDate);

    let eventsHtml = '';
    dayEvents.forEach(ev => {
      eventsHtml += `
        <div class="vlt-cal-event event-${ev.category}" 
             draggable="true" 
             data-event-id="${ev.id}" 
             title="${ev.title} (${ev.time})">
          <span class="event-dot"></span>
          <span class="truncate">${ev.time ? ev.time + ' ' : ''}${ev.title}</span>
        </div>
      `;
    });

    return `
      <div class="cal-day-cell ${isOtherMonth ? 'is-other-month' : ''} ${isToday ? 'is-today' : ''}" 
           data-date="${isoDate}">
        <div class="cal-day-header pointer-events-none">
          <span class="cal-day-number">${dayNum}</span>
          ${dayEvents.length > 0 ? `<span class="text-[10px] text-slate-400 font-mono">${dayEvents.length}</span>` : ''}
        </div>
        <div class="cal-events-container">
          ${eventsHtml}
        </div>
      </div>
    `;
  }

  renderWeekView() {
    const startOfWeek = new Date(this.currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      weekDays.push(d);
    }

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    let html = `
      <div class="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 p-4 min-h-[450px]">
    `;

    weekDays.forEach((d, idx) => {
      const isoDate = this.formatDateISO(d);
      const isToday = (isoDate === '2026-11-12');
      const dayEvents = this.events.filter(e => e.date === isoDate);

      html += `
        <div class="p-3 bg-white dark:bg-slate-900 flex flex-col cal-day-cell ${isToday ? 'is-today' : ''}" data-date="${isoDate}">
          <div class="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-center">
            <p class="text-[11px] font-bold text-slate-400 uppercase">${dayNames[idx]}</p>
            <p class="text-base font-bold ${isToday ? 'text-cyan-600' : 'text-slate-800 dark:text-white'}">${d.getDate()}</p>
          </div>
          <div class="space-y-2 flex-1">
            ${dayEvents.map(ev => `
              <div class="p-2.5 rounded-xl border event-${ev.category} vlt-cal-event" draggable="true" data-event-id="${ev.id}">
                <div class="flex items-center gap-1.5 font-bold text-xs truncate">
                  <span class="event-dot"></span>
                  <span>${ev.title}</span>
                </div>
                <div class="text-[10px] text-slate-500 mt-1">${ev.time}</div>
              </div>
            `).join('')}
            ${dayEvents.length === 0 ? `<div class="text-center py-6 text-[11px] text-slate-300">Sin eventos</div>` : ''}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.bodyEl.innerHTML = html;
    this.bindDropTargets();
  }

  renderDayView() {
    const isoDate = this.formatDateISO(this.currentDate);
    const dayEvents = this.events.filter(e => e.date === isoDate);

    let html = `
      <div class="p-6 max-w-2xl mx-auto space-y-6">
        <div class="p-5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/60 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-base">Planificación del Día</h3>
            <p class="text-xs text-slate-500 mt-0.5">Fecha seleccionada: <span class="font-bold text-cyan-600 font-mono">${isoDate}</span></p>
          </div>
          <button type="button" class="vlt-btn vlt-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer" id="btn-quick-add-day">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Nuevo Evento</span>
          </button>
        </div>

        <div class="space-y-3">
          ${dayEvents.map(ev => `
            <div class="p-4 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 shadow-xs flex items-start justify-between gap-4 transition-all hover:border-cyan-400">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="vlt-badge vlt-badge-${ev.category === 'emerald' ? 'success' : ev.category === 'rose' ? 'danger' : ev.category === 'amber' ? 'warning' : 'cyan'}">${ev.time || 'Todo el día'}</span>
                  <h4 class="font-bold text-slate-800 dark:text-white text-sm">${ev.title}</h4>
                </div>
                ${ev.notes ? `<p class="text-xs text-slate-500 pl-1">${ev.notes}</p>` : ''}
              </div>
              <button type="button" class="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors" data-delete-id="${ev.id}">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          `).join('')}

          ${dayEvents.length === 0 ? `
            <div class="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-8">
              <i data-lucide="calendar" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
              <p class="text-xs font-semibold text-slate-500">No hay eventos agendados para este día</p>
              <p class="text-[11px] text-slate-400 mt-1">Haz clic en el botón superior o arrastra un evento desde la barra lateral.</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.bodyEl.innerHTML = html;

    const quickAdd = document.getElementById('btn-quick-add-day');
    if (quickAdd) {
      quickAdd.addEventListener('click', () => this.openAddModal(isoDate));
    }

    this.bodyEl.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-delete-id');
        this.deleteEvent(id);
      });
    });
  }

  renderAgendaView() {
    // Sort events by date ascending
    const sorted = [...this.events].sort((a, b) => a.date.localeCompare(b.date));

    // Group by date
    const groups = {};
    sorted.forEach(ev => {
      if (!groups[ev.date]) groups[ev.date] = [];
      groups[ev.date].push(ev);
    });

    let html = `<div class="vlt-calendar-agenda">`;

    Object.keys(groups).forEach(dateStr => {
      const items = groups[dateStr];
      html += `
        <div class="agenda-day-group">
          <div class="agenda-day-title">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-cyan-500"></i>
            <span>${dateStr}</span>
            <span class="vlt-badge vlt-badge-slate text-[10px] ml-auto">${items.length} ${items.length === 1 ? 'evento' : 'eventos'}</span>
          </div>
          <div class="agenda-items-list">
            ${items.map(ev => `
              <div class="agenda-item">
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-${ev.category === 'cyan' ? 'cyan-500' : ev.category === 'emerald' ? 'emerald-500' : ev.category === 'amber' ? 'amber-500' : ev.category === 'rose' ? 'rose-500' : 'indigo-500'}"></span>
                  <div>
                    <p class="font-bold text-xs text-slate-800 dark:text-white">${ev.title}</p>
                    <p class="text-[11px] text-slate-400">${ev.notes || 'Sin descripción adicional'}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[11px] text-slate-500">${ev.time}</span>
                  <button type="button" class="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors" data-delete-id="${ev.id}">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    if (Object.keys(groups).length === 0) {
      html += `<div class="text-center py-12 text-xs text-slate-400">No hay eventos en la agenda.</div>`;
    }

    html += `</div>`;
    this.bodyEl.innerHTML = html;

    this.bodyEl.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        this.deleteEvent(id);
      });
    });
  }

  bindDropTargets() {
    const dayCells = this.bodyEl.querySelectorAll('.cal-day-cell');
    dayCells.forEach(cell => {
      const date = cell.getAttribute('data-date');

      // Click cell to open event creator modal
      cell.addEventListener('click', (e) => {
        // If clicked on an existing event, open details instead
        const eventEl = e.target.closest('.vlt-cal-event');
        if (eventEl) {
          const evId = eventEl.getAttribute('data-event-id');
          this.openDetailsModal(evId);
          return;
        }
        this.openAddModal(date);
      });

      // Drag and drop handlers
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.classList.add('cal-drop-target');
      });

      cell.addEventListener('dragleave', () => {
        cell.classList.remove('cal-drop-target');
      });

      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('cal-drop-target');

        if (!this.draggedData) return;

        if (this.draggedData.type === 'external') {
          // Drop external event from sidebar
          const newEvent = {
            id: 'ev-' + Date.now(),
            title: this.draggedData.title,
            date: date,
            time: '09:00 AM',
            category: this.draggedData.category || 'cyan',
            notes: 'Añadido desde eventos externos'
          };
          this.events.push(newEvent);
          this.saveEvents();

          // Check if "remove after drop" is checked
          if (this.removeAfterDropCheck && this.removeAfterDropCheck.checked && this.draggedData.elementId) {
            const el = document.getElementById(this.draggedData.elementId);
            if (el) el.remove();
          }

          this.draggedData = null;
          this.render();
        } else if (this.draggedData.type === 'internal') {
          // Move existing event
          const ev = this.events.find(x => x.id === this.draggedData.eventId);
          if (ev) {
            ev.date = date;
            this.saveEvents();
          }
          this.draggedData = null;
          this.render();
        }
      });
    });

    // Bind dragstart for internal events inside day cells
    const eventChips = this.bodyEl.querySelectorAll('.vlt-cal-event');
    eventChips.forEach(chip => {
      chip.addEventListener('dragstart', (e) => {
        const evId = chip.getAttribute('data-event-id');
        this.draggedData = {
          type: 'internal',
          eventId: evId
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedData));
        chip.classList.add('dragging');
      });
      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
      });
    });
  }

  openAddModal(prefilledDate) {
    if (!this.eventModal) return;
    const dateInput = document.getElementById('modal-event-date');
    const titleInput = document.getElementById('modal-event-title');
    const timeInput = document.getElementById('modal-event-time');
    const catInput = document.getElementById('modal-event-category');
    const notesInput = document.getElementById('modal-event-notes');

    if (dateInput) dateInput.value = prefilledDate || this.formatDateISO(new Date());
    if (titleInput) titleInput.value = '';
    if (timeInput) timeInput.value = '10:00 AM';
    if (notesInput) notesInput.value = '';

    this.eventModal.classList.remove('hidden');
    this.eventModal.classList.add('flex');

    const saveBtn = document.getElementById('btn-save-modal-event');
    const cancelBtn = document.getElementById('btn-cancel-modal-event');

    const handleSave = () => {
      const title = titleInput.value.trim();
      if (!title) return;
      const newEv = {
        id: 'ev-' + Date.now(),
        title: title,
        date: dateInput.value,
        time: timeInput.value,
        category: catInput ? catInput.value : 'cyan',
        notes: notesInput ? notesInput.value.trim() : ''
      };
      this.events.push(newEv);
      this.saveEvents();
      this.closeModal(this.eventModal);
      this.render();
      saveBtn.removeEventListener('click', handleSave);
    };

    saveBtn.onclick = handleSave;
    cancelBtn.onclick = () => this.closeModal(this.eventModal);
  }

  openDetailsModal(eventId) {
    const ev = this.events.find(x => x.id === eventId);
    if (!ev || !this.detailsModal) return;

    document.getElementById('details-event-title').textContent = ev.title;
    document.getElementById('details-event-date').textContent = ev.date;
    document.getElementById('details-event-time').textContent = ev.time || 'Todo el día';
    document.getElementById('details-event-notes').textContent = ev.notes || 'Sin descripción';

    const catBadge = document.getElementById('details-event-badge');
    if (catBadge) {
      catBadge.textContent = ev.category.toUpperCase();
      catBadge.className = `vlt-badge vlt-badge-${ev.category === 'emerald' ? 'success' : ev.category === 'rose' ? 'danger' : ev.category === 'amber' ? 'warning' : 'cyan'}`;
    }

    this.detailsModal.classList.remove('hidden');
    this.detailsModal.classList.add('flex');

    const delBtn = document.getElementById('btn-delete-details-event');
    const closeBtn = document.getElementById('btn-close-details-event');

    delBtn.onclick = () => {
      this.deleteEvent(ev.id);
      this.closeModal(this.detailsModal);
    };

    closeBtn.onclick = () => this.closeModal(this.detailsModal);
  }

  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    modalEl.classList.remove('flex');
  }

  deleteEvent(id) {
    this.events = this.events.filter(x => x.id !== id);
    this.saveEvents();
    this.render();
  }

  formatDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

// Auto-instantiate when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vlt-calendar-app')) {
    window.veltraCalendar = new VeltraCalendar('vlt-calendar-app');
  }
});

