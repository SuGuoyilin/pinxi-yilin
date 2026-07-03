const Charts = {
  _instances: {},

  destroy(id) {
    if (this._instances[id]) {
      this._instances[id].destroy();
      delete this._instances[id];
    }
  },

  renderFeeBar(canvasId, data) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || data.length === 0) return;
    const colors = ['#667eea', '#e94560', '#4facfe', '#43e97b', '#fa709a', '#f093fb', '#ffd93d'];
    this._instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: '月度费用（元）',
          data: data.map(d => d.fee),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => '¥' + v.toLocaleString() }
          }
        }
      }
    });
  },

  renderVolumeBar(canvasId, data) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx || data.length === 0) return;
    const colors = ['#667eea', '#e94560', '#4facfe', '#43e97b', '#fa709a', '#f093fb', '#ffd93d'];
    this._instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: '月总接待量',
          data: data.map(d => d.volume),
          backgroundColor: data.map((_, i) => colors[i % colors.length]),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  },

  renderTrendLine(canvasId, records, year) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const monthlyMap = {};
    for (const r of records) {
      if (!r.calculated) continue;
      if (year && r.year !== year) continue;
      const key = `${r.year}-${String(r.month).padStart(2, '0')}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + r.calculated.total;
    }

    const sortedKeys = Object.keys(monthlyMap).sort();
    if (sortedKeys.length === 0) return;

    this._instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedKeys,
        datasets: [{
          label: label || '总费用（元）',
          data: sortedKeys.map(k => monthlyMap[k]),
          borderColor: '#e94560',
          backgroundColor: 'rgba(233,69,96,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => '¥' + v.toLocaleString() }
          }
        }
      }
    });
  },

  renderProjectTrend(canvasId, records, projectName) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const sorted = records.sort((a, b) => (a.year * 12 + a.month) - (b.year * 12 + b.month)).slice(-12);
    if (sorted.length === 0) return;

    this._instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sorted.map(r => `${r.year}-${String(r.month).padStart(2, '0')}`),
        datasets: [
          {
            label: '总费用',
            data: sorted.map(r => r.calculated.total),
            borderColor: '#e94560',
            yAxisID: 'y'
          },
          {
            label: '总接待量',
            data: sorted.map(r => r.calculated.totalVolume),
            borderColor: '#4facfe',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            ticks: { callback: v => '¥' + v.toLocaleString() }
          },
          y1: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }
};
