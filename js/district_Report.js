// Search & Filter
document.getElementById('searchInput').addEventListener('input', filterTable);
document.getElementById('districtFilter').addEventListener('change', filterTable);
document.getElementById('statusFilter').addEventListener('change', filterTable);

function filterTable() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const district = document.getElementById('districtFilter').value;
  const status = document.getElementById('statusFilter').value;

  const rows = document.querySelectorAll('#reportsTable tbody tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const matchesSearch = cells[1].textContent.toLowerCase().includes(search);
    const matchesDistrict = !district || cells[1].textContent === district;
    const matchesStatus = !status || cells[5].textContent.trim() === status;

    row.style.display = (matchesSearch && matchesDistrict && matchesStatus) ? '' : 'none';
  });
}

// Add Report
document.getElementById('addReportForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('New District Report Added (simulate saving to database)');
  this.reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById('addReportModal'));
  modal.hide();
});