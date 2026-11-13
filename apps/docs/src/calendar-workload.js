/**
 * VeltraUI Calendar Workload & Productivity Engine
 * Features: Time-block week timeline, workload analytics, and universal .ICS export.
 */

export class WorkloadCalendar {
  constructor() {
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.exportIcsBtn = document.getElementById('btn-export-ics');
    this.addDeepWorkBtn = document.getElementById('btn-add-deep-work');
    this.timeBlocks = document.querySelectorAll('.time-slot-block');
  }

  bindEvents() {
    if (this.exportIcsBtn) {
      this.exportIcsBtn.addEventListener('click', () => this.exportToICS());
    }

    if (this.addDeepWorkBtn) {
      this.addDeepWorkBtn.addEventListener('click', () => {
        alert('¡Bloque de Deep Work de 2 horas reservado para hoy! Tu agenda ha sido protegida contra reuniones.');
      });
    }

    this.timeBlocks.forEach(block => {
      block.addEventListener('click', () => {
        const title = block.querySelector('.font-bold')?.textContent || 'Bloque Horario';
        const time = block.querySelector('.font-mono')?.textContent || '';
        alert(`Bloque seleccionado: ${title}\nHorario: ${time}`);
      });
    });
  }

  exportToICS() {
    // Generate valid RFC-5545 iCalendar payload
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VeltraUI//Calendar SaaS Export v1.0//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:VeltraUI Agenda Semanal',
      'X-WR-TIMEZONE:America/Lima',
      'BEGIN:VEVENT',
      `DTSTAMP:${now}`,
      `UID:veltra-ev-1-${Date.now()}@veltra.io`,
      'DTSTART:20261112T153000',
      'DTEND:20261112T163000',
      'SUMMARY:Demo interactiva con Cliente Corp',
      'DESCRIPTION:Demostración de los nuevos componentes y navegación responsiva de VeltraUI.',
      'LOCATION:Google Meet (https://meet.google.com/xyz-uvwx-rst)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      `DTSTAMP:${now}`,
      `UID:veltra-ev-2-${Date.now()}@veltra.io`,
      'DTSTART:20261118T110000',
      'DTEND:20261118T120000',
      'SUMMARY:Auditoría de Seguridad & Tokens',
      'DESCRIPTION:Revisión de flujos OAuth y validaciones del lado cliente en formularios.',
      'LOCATION:Sala de Juntas B (Piso 4)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'veltraui-agenda-semanal.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('btn-export-ics')) {
    window.veltraWorkloadCalendar = new WorkloadCalendar();
  }
});

