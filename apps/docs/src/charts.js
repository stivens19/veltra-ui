import Chart from 'chart.js/auto';

const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

// Global chart font & tooltip defaults
Chart.defaults.font.family = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.color = '#64748b';

export function initDashboardCharts() {
  initV1Charts();
  initV2Charts();
  initV3Charts();
  initWidgetCharts();
}

export function initWidgetCharts() {
  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 } }
  };

  const s1 = document.getElementById('sparkline-revenue');
  if (s1) {
    destroyChart('sparkline-revenue');
    chartInstances['sparkline-revenue'] = new Chart(s1, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{ data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40], borderColor: '#06b6d4', borderWidth: 2.5, tension: 0.4 }]
      },
      options: sparklineOptions
    });
  }

  const s2 = document.getElementById('sparkline-users');
  if (s2) {
    destroyChart('sparkline-users');
    chartInstances['sparkline-users'] = new Chart(s2, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{ data: [5, 12, 8, 14, 20, 18, 24, 22, 28, 34], borderColor: '#10b981', borderWidth: 2.5, tension: 0.4 }]
      },
      options: sparklineOptions
    });
  }

  const s3 = document.getElementById('sparkline-orders');
  if (s3) {
    destroyChart('sparkline-orders');
    chartInstances['sparkline-orders'] = new Chart(s3, {
      type: 'bar',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{ data: [8, 14, 12, 18, 15, 22, 19, 25, 23, 30], backgroundColor: '#f59e0b', borderRadius: 3 }]
      },
      options: sparklineOptions
    });
  }

  const s4 = document.getElementById('sparkline-conversion');
  if (s4) {
    destroyChart('sparkline-conversion');
    chartInstances['sparkline-conversion'] = new Chart(s4, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{ data: [2.1, 2.4, 2.2, 2.8, 2.7, 3.1, 2.9, 3.4, 3.2, 3.8], borderColor: '#f43f5e', borderWidth: 2.5, tension: 0.4 }]
      },
      options: sparklineOptions
    });
  }
}

export function initV1Charts() {
  // Sales Line/Area Chart v1
  const salesEl = document.getElementById('chart-sales-v1');
  if (salesEl) {
    destroyChart('chart-sales-v1');
    const ctx = salesEl.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    chartInstances['chart-sales-v1'] = new Chart(salesEl, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '2026 Revenue ($)',
            data: [18500, 22400, 20100, 27800, 25600, 32400, 35210, 39100, 42300, 45100, 48900, 54200],
            borderColor: '#06b6d4',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: '2025 Revenue ($)',
            data: [14200, 16800, 18400, 21000, 20500, 24100, 26300, 28900, 31200, 33500, 36000, 40100],
            borderColor: '#cbd5e1',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 11, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 10
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.7)' },
            ticks: {
              callback: (v) => '$' + (v / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  // Traffic by Device Doughnut v1
  const trafficEl = document.getElementById('chart-traffic-v1');
  if (trafficEl) {
    destroyChart('chart-traffic-v1');
    chartInstances['chart-traffic-v1'] = new Chart(trafficEl, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
          {
            data: [55, 35, 10],
            backgroundColor: ['#06b6d4', '#10b981', '#fbbf24'],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }
}

export function initV2Charts() {
  // Monthly Recap Bar Chart v2
  const recapEl = document.getElementById('chart-recap-v2');
  if (recapEl) {
    destroyChart('chart-recap-v2');
    chartInstances['chart-recap-v2'] = new Chart(recapEl, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Actual Revenue',
            data: [19500, 24000, 21500, 29000, 26800, 33500, 35210, 37800, 41200, 44000, 47500, 52000],
            backgroundColor: '#06b6d4',
            borderRadius: 6,
            barPercentage: 0.65,
            categoryPercentage: 0.7
          },
          {
            label: 'Target Goal',
            data: [18000, 20000, 22000, 25000, 25000, 30000, 32000, 35000, 38000, 40000, 45000, 48000],
            backgroundColor: '#e2e8f0',
            borderRadius: 6,
            barPercentage: 0.65,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 11, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.7)' },
            ticks: { callback: (v) => '$' + (v / 1000) + 'k' }
          }
        }
      }
    });
  }

  // Browser Usage Doughnut v2
  const browsersEl = document.getElementById('chart-browsers-v2');
  if (browsersEl) {
    destroyChart('chart-browsers-v2');
    chartInstances['chart-browsers-v2'] = new Chart(browsersEl, {
      type: 'doughnut',
      data: {
        labels: ['Chrome', 'Edge', 'Safari', 'Firefox', 'Others'],
        datasets: [
          {
            data: [62, 18, 12, 6, 2],
            backgroundColor: ['#06b6d4', '#38bdf8', '#10b981', '#f59e0b', '#cbd5e1'],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 10, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }
}

export function initV3Charts() {
  // Store Visitors vs Sales Combo Chart v3
  const storeEl = document.getElementById('chart-store-v3');
  if (storeEl) {
    destroyChart('chart-store-v3');
    chartInstances['chart-store-v3'] = new Chart(storeEl, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            type: 'line',
            label: 'Sales Revenue ($)',
            data: [1420, 1890, 2340, 1980, 2890, 3840, 3870],
            borderColor: '#06b6d4',
            borderWidth: 3,
            tension: 0.35,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            yAxisID: 'y1'
          },
          {
            type: 'bar',
            label: 'Store Visitors',
            data: [420, 560, 680, 610, 890, 1140, 1240],
            backgroundColor: '#e2e8f0',
            borderRadius: 6,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 11, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 10
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(226, 232, 240, 0.7)' },
            title: { display: true, text: 'Visitors', font: { size: 10, weight: 'bold' } }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { display: false },
            ticks: { callback: (v) => '$' + v },
            title: { display: true, text: 'Sales ($)', font: { size: 10, weight: 'bold' } }
          }
        }
      }
    });
  }

  // Categories Polar/Doughnut v3
  const catEl = document.getElementById('chart-categories-v3');
  if (catEl) {
    destroyChart('chart-categories-v3');
    chartInstances['chart-categories-v3'] = new Chart(catEl, {
      type: 'doughnut',
      data: {
        labels: ['Laravel & DDD', '.NET 9 Microservices', 'Tailwind & React', 'DevOps & Architecture'],
        datasets: [
          {
            data: [42, 28, 18, 12],
            backgroundColor: ['#06b6d4', '#0284c7', '#10b981', '#f59e0b'],
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { size: 10, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}% share`
            }
          }
        }
      }
    });
  }
}

