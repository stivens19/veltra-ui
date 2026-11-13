/**
 * VeltraUI Calendar Team & Virtual Sync Engine
 * Supports Avatar Stacks on events, team member filtering, and Slide-over Inspector Drawer.
 */

const TEAM_MEMBERS = [
  { id: 'stivens', name: 'Stivens Espinoza', avatar: '/avatar.jpg', role: 'Lead Architect' },
  { id: 'sarah', name: 'Sarah Bullock', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', role: 'Frontend Lead' },
  { id: 'john', name: 'John Pierce', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', role: 'Backend Engineer' },
  { id: 'alex', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', role: 'UI/UX Designer' }
];

const TEAM_EVENTS = [
  {
    id: 't-1',
    title: 'Sprint Planning VeltraUI',
    date: '2026-11-04',
    time: '10:00 AM - 11:30 AM',
    category: 'cyan',
    virtual: true,
    meetUrl: 'https://meet.google.com/abc-defg-hij',
    members: ['stivens', 'sarah', 'john'],
    notes: 'Revisión y asignación del sprint backlog para componentes de calendario y data tables.',
    checklist: [
      { text: 'Preparar tickets en Kanban', done: true },
      { text: 'Definir prioridades de release', done: true },
      { text: 'Estimar puntos de historia', done: false }
    ]
  },
  {
    id: 't-2',
    title: 'Demo interactiva con Cliente Corp',
    date: '2026-11-12',
    time: '03:30 PM - 04:30 PM',
    category: 'emerald',
    virtual: true,
    meetUrl: 'https://meet.google.com/xyz-uvwx-rst',
    members: ['stivens', 'sarah', 'alex'],
    notes: 'Demostración de los nuevos componentes y navegación responsiva de VeltraUI.',
    checklist: [
      { text: 'Verificar demo en localhost:3000', done: true },
      { text: 'Preparar diapositivas de arquitectura', done: true },
      { text: 'Grabar sesión en la nube', done: false }
    ]
  },
  {
    id: 't-3',
    title: 'Auditoría de Seguridad & Tokens',
    date: '2026-11-18',
    time: '11:00 AM - 12:00 PM',
    category: 'amber',
    virtual: false,
    room: 'Sala de Juntas B (Piso 4)',
    members: ['stivens', 'john'],
    notes: 'Revisión de flujos OAuth y validaciones del lado cliente en formularios.',
    checklist: [
      { text: 'Exportar logs de prueba', done: true },
      { text: 'Revisar matriz de vulnerabilidades', done: false }
    ]
  },
  {
    id: 't-4',
    title: 'Entrega Sprint Milestone 3',
    date: '2026-11-25',
    time: '05:00 PM - 06:00 PM',
    category: 'rose',
    virtual: true,
    meetUrl: 'https://meet.google.com/mno-pqrs-tuv',
    members: ['stivens', 'sarah', 'john', 'alex'],
    notes: 'Cierre formal de hitos y aprobación para merge en la rama principal.',
    checklist: [
      { text: 'Correr tests de integración', done: true },
      { text: 'Aprobar Pull Request', done: false }
    ]
  },
  {
    id: 't-5',
    title: 'Design Review & UX Alignment',
    date: '2026-11-27',
    time: '02:00 PM - 03:00 PM',
    category: 'indigo',
    virtual: true,
    meetUrl: 'https://meet.google.com/des-ignr-evw',
    members: ['stivens', 'alex'],
    notes: 'Revisión de contrastes accesibles WCAG AA y espaciados de los botones segmentados.',
    checklist: [
      { text: 'Exportar componentes Figma', done: true },
      { text: 'Testear paleta en modo oscuro', done: true }
    ]
  }
];

export class TeamCalendar {
  constructor() {
    this.events = [...TEAM_EVENTS];
    this.currentDate = new Date(2026, 10, 12);
    this.activeFilter = 'all'; // 'all' | 'my' | 'demo' | 'sync'
    this.activeMember = null; // null or memberId
    this.activeEvent = null;

    this.initDOM();
    this.bindEvents();
    this.render();
  }

  initDOM() {
    this.gridBody = document.getElementById('team-cal-grid');
    this.titleEl = document.getElementById('team-cal-title');
    this.slideOver = document.getElementById('team-slide-over');
    this.slideOverBackdrop = document.getElementById('slide-over-backdrop');
    this.slideOverCloseBtn = document.getElementById('slide-over-close');
    this.filterPills = document.querySelectorAll('[data-team-filter]');
    this.memberPills = document.querySelectorAll('[data-member-filter]');
  }

  bindEvents() {
    // Filter by type
    this.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.filterPills.forEach(p => p.classList.remove('bg-cyan-50', 'text-cyan-600', 'font-bold', 'border-cyan-200'));
        pill.classList.add('bg-cyan-50', 'text-cyan-600', 'font-bold', 'border-cyan-200');
        this.activeFilter = pill.getAttribute('data-team-filter');
        this.render();
      });
    });

    // Filter by member
    this.memberPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const memId = pill.getAttribute('data-member-filter');
        if (this.activeMember === memId) {
          this.activeMember = null;
          pill.classList.remove('ring-2', 'ring-cyan-500');
        } else {
          this.memberPills.forEach(p => p.classList.remove('ring-2', 'ring-cyan-500'));
          pill.classList.add('ring-2', 'ring-cyan-500');
          this.activeMember = memId;
        }
        this.render();
      });
    });

    // Close Slide-Over
    if (this.slideOverCloseBtn) {
      this.slideOverCloseBtn.addEventListener('click', () => this.closeSlideOver());
    }
    if (this.slideOverBackdrop) {
      this.slideOverBackdrop.addEventListener('click', () => this.closeSlideOver());
    }

    // Month Navigation
    const prevBtn = document.getElementById('team-prev-btn');
    const nextBtn = document.getElementById('team-next-btn');
    const todayBtn = document.getElementById('team-today-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
      });
    }
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.currentDate = new Date(2026, 10, 12);
        this.render();
      });
    }
  }

  getFilteredEvents() {
    return this.events.filter(ev => {
      // Type filter
      if (this.activeFilter === 'my' && !ev.members.includes('stivens')) return false;
      if (this.activeFilter === 'demo' && ev.category !== 'emerald') return false;
      if (this.activeFilter === 'sync' && ev.category !== 'cyan') return false;

      // Member filter
      if (this.activeMember && !ev.members.includes(this.activeMember)) return false;

      return true;
    });
  }

  render() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const curMonth = months[this.currentDate.getMonth()];
    const curYear = this.currentDate.getFullYear();

    if (this.titleEl) {
      this.titleEl.textContent = `${curMonth} ${curYear}`;
    }

    const filtered = this.getFilteredEvents();

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let html = `
      <div class="vlt-calendar-month">
        <div class="cal-weekday-header">
          <div>DOM</div><div>LUN</div><div>MAR</div><div>MIÉ</div><div>JUE</div><div>VIE</div><div>SÁB</div>
        </div>
        <div class="cal-days-grid">
    `;

    // Filler from previous month
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevMonthDays - x + 1;
      const prevDate = new Date(year, month - 1, dayNum);
      const iso = this.formatDateISO(prevDate);
      html += this.renderDayCell(iso, dayNum, true, false, []);
    }

    // Days of current month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      const iso = this.formatDateISO(d);
      const isToday = (iso === '2026-11-12');
      const dayEvents = filtered.filter(e => e.date === iso);
      html += this.renderDayCell(iso, i, false, isToday, dayEvents);
    }

    // Filler from next month
    const totalCells = firstDayIndex + totalDaysInMonth;
    const nextDays = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
    for (let j = 1; j <= nextDays; j++) {
      const nextDate = new Date(year, month + 1, j);
      const iso = this.formatDateISO(nextDate);
      html += this.renderDayCell(iso, j, true, false, []);
    }

    html += `</div></div>`;
    this.gridBody.innerHTML = html;

    // Attach click listener on events to open Slide-Over Inspector
    this.gridBody.querySelectorAll('[data-team-event-id]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const evId = el.getAttribute('data-team-event-id');
        this.openSlideOver(evId);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  renderDayCell(iso, dayNum, isOther, isToday, dayEvents) {
    let eventsHtml = '';
    dayEvents.forEach(ev => {
      // Find members
      const memberAvatars = ev.members.map(mId => {
        const mem = TEAM_MEMBERS.find(m => m.id === mId);
        return mem ? `<img class="stack-avatar" src="${mem.avatar}" alt="${mem.name}" title="${mem.name}" />` : '';
      }).join('');

      eventsHtml += `
        <div class="vlt-cal-event event-${ev.category} flex items-center justify-between cursor-pointer" 
             data-team-event-id="${ev.id}">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="event-dot"></span>
            ${ev.virtual ? `<i data-lucide="video" class="w-3 h-3 text-cyan-600 shrink-0"></i>` : `<i data-lucide="map-pin" class="w-3 h-3 text-amber-600 shrink-0"></i>`}
            <span class="truncate font-semibold text-[11px]">${ev.title}</span>
          </div>
          <div class="vlt-avatar-stack ml-1 shrink-0">
            ${memberAvatars}
          </div>
        </div>
      `;
    });

    return `
      <div class="cal-day-cell ${isOther ? 'is-other-month' : ''} ${isToday ? 'is-today' : ''}" data-date="${iso}">
        <div class="cal-day-header">
          <span class="cal-day-number">${dayNum}</span>
          ${dayEvents.length > 0 ? `<span class="vlt-badge vlt-badge-cyan text-[9px] py-0 px-1 font-mono">${dayEvents.length}</span>` : ''}
        </div>
        <div class="cal-events-container">
          ${eventsHtml}
        </div>
      </div>
    `;
  }

  openSlideOver(eventId) {
    const ev = this.events.find(e => e.id === eventId);
    if (!ev || !this.slideOver) return;

    this.activeEvent = ev;

    // Fill Slide-Over content
    document.getElementById('slide-title').textContent = ev.title;
    document.getElementById('slide-category-badge').textContent = ev.category.toUpperCase();
    document.getElementById('slide-category-badge').className = `vlt-badge vlt-badge-${ev.category === 'emerald' ? 'success' : ev.category === 'rose' ? 'danger' : ev.category === 'amber' ? 'warning' : 'cyan'}`;
    
    document.getElementById('slide-date').textContent = ev.date;
    document.getElementById('slide-time').textContent = ev.time;
    document.getElementById('slide-notes').textContent = ev.notes || 'Sin descripción';

    // Location / Virtual
    const locBox = document.getElementById('slide-location-box');
    if (ev.virtual) {
      locBox.innerHTML = `
        <div class="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200/80 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center">
              <i data-lucide="video" class="w-4 h-4"></i>
            </div>
            <div>
              <p class="font-bold text-xs text-slate-800">Reunión Virtual (Google Meet)</p>
              <p class="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">${ev.meetUrl}</p>
            </div>
          </div>
          <a href="${ev.meetUrl}" target="_blank" class="vlt-btn vlt-btn-primary text-xs py-1.5 px-3">
            <span>Unirse</span>
          </a>
        </div>
      `;
    } else {
      locBox.innerHTML = `
        <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
            <i data-lucide="map-pin" class="w-4 h-4"></i>
          </div>
          <div>
            <p class="font-bold text-xs text-slate-800">Reunión Presencial</p>
            <p class="text-[11px] text-slate-500">${ev.room || 'Sala principal'}</p>
          </div>
        </div>
      `;
    }

    // Attendees list
    const attendeesEl = document.getElementById('slide-attendees-list');
    attendeesEl.innerHTML = ev.members.map((mId, index) => {
      const mem = TEAM_MEMBERS.find(m => m.id === mId);
      if (!mem) return '';
      return `
        <div class="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-2.5">
            <img class="w-7 h-7 rounded-full object-cover" src="${mem.avatar}" alt="${mem.name}" />
            <div>
              <p class="font-bold text-xs text-slate-800">${mem.name}</p>
              <p class="text-[10px] text-slate-400">${mem.role}</p>
            </div>
          </div>
          <span class="vlt-pill ${index === 0 ? 'vlt-pill-cyan' : 'vlt-pill-emerald'} py-0 px-2 text-[10px]">
            <span class="pill-dot"></span>${index === 0 ? 'Organizador' : 'Confirmado'}
          </span>
        </div>
      `;
    }).join('');

    // Pre-meeting checklist
    const checkEl = document.getElementById('slide-checklist');
    if (ev.checklist && ev.checklist.length > 0) {
      checkEl.innerHTML = ev.checklist.map((item, idx) => `
        <label class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input type="checkbox" ${item.done ? 'checked' : ''} class="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" data-check-idx="${idx}" />
          <span class="${item.done ? 'line-through text-slate-400' : ''}">${item.text}</span>
        </label>
      `).join('');
    } else {
      checkEl.innerHTML = `<p class="text-[11px] text-slate-400">Sin tareas previas.</p>`;
    }

    this.slideOver.classList.add('is-open');
    if (window.lucide) window.lucide.createIcons();
  }

  closeSlideOver() {
    if (this.slideOver) {
      this.slideOver.classList.remove('is-open');
    }
  }

  formatDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('team-cal-grid')) {
    window.veltraTeamCalendar = new TeamCalendar();
  }
});

