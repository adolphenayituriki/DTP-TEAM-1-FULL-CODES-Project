// Chart: Leader Distribution
const leaderRoleCtx = document.getElementById('leaderRoleChart').getContext('2d');
new Chart(leaderRoleCtx, {
  type: 'pie',
  data: {
    labels: ['National', 'District', 'Sector', 'Cell'],
    datasets: [{
      data: [5, 50, 500, 5000],
      backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545'],
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }
});

// Chart: Reports Over Time
const reportsOverTimeCtx = document.getElementById('reportsOverTimeChart').getContext('2d');
new Chart(reportsOverTimeCtx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Reports',
      data: [1000, 1500, 1800, 2200, 2500, 3000],
      borderColor: '#0d6efd',
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

// Chart: Verified vs Pending
const reportStatusCtx = document.getElementById('reportStatusChart').getContext('2d');
new Chart(reportStatusCtx, {
  type: 'bar',
  data: {
    labels: ['Verified', 'Pending'],
    datasets: [{
      data: [10200, 1800],
      backgroundColor: ['#198754', '#dc3545']
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  }
});