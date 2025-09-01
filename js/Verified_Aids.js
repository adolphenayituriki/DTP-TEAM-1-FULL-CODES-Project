// Search & Filter
document.getElementById('searchInput').addEventListener('input', filterTable);
document.getElementById('districtFilter').addEventListener('change', filterTable);
document.getElementById('statusFilter').addEventListener('change', filterTable);

function filterTable() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const district = document.getElementById('districtFilter').value;
  const status = document.getElementById('statusFilter').value;

  const rows = document.querySelectorAll('#verifiedTable tbody tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const matchesSearch = cells[1].textContent.toLowerCase().includes(search) ||
                          cells[2].textContent.toLowerCase().includes(search);
    const matchesDistrict = !district || cells[2].textContent === district;
    const matchesStatus = !status || cells[6].textContent.trim() === status;

    if (matchesSearch && matchesDistrict && matchesStatus) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Add Verified Aid
document.getElementById('addVerifiedForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('New Verified Aid Added (simulate saving to database)');
  this.reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById('addVerifiedModal'));
  modal.hide();
});