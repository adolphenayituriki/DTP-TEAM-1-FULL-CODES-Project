// Line Chart: Aid Distribution Trend
const ctxTrend = document.getElementById('trendChart').getContext('2d');
new Chart(ctxTrend, {
      type: 'line',
      data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
            datasets: [{
                  label: 'Aid Distributed (kg)',
                  data: [4000, 6000, 7500, 9000, 12000, 15000, 18000, 20000, 0, 0 , 0 , 0],
                  borderColor: '#0d6efd',
                  backgroundColor: 'rgba(13, 110, 253, 0.2)',
                  fill: true,
                  tension: 0.3
            }]
      },
      options: {
            responsive: true,
            plugins: { legend: { display: false } }
      }
});

// Doughnut Chart: Verified vs Pending
const ctxStatus = document.getElementById('statusChart').getContext('2d');
new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
            labels: ['Verified', 'Pending', 'Failed'],
            datasets: [{
                  data: [39000, 6000, 1200],
                  backgroundColor: ['#198754', '#ffc107', '#e41111ff']
            }]
      },
      options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
      }
});