const leaderForm = document.getElementById('leaderForm');
const leaderTableBody = document.getElementById('leaderTableBody');

leaderForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('leaderName').value;
  const email = document.getElementById('leaderEmail').value;
  const phone = document.getElementById('leaderPhone').value;
  const role = document.getElementById('leaderRole').value;

  const newRow = document.createElement('tr');
  const rowCount = leaderTableBody.rows.length + 1;
  newRow.innerHTML = `
    <td>${rowCount}</td>
    <td>${name}</td>
    <td>${email}</td>
    <td>${phone}</td>
    <td>${role}</td>
    <td>
      <button class="btn btn-warning btn-sm"><i class="fa-solid fa-pen"></i></button>
      <button class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  leaderTableBody.appendChild(newRow);
  leaderForm.reset();
  document.querySelector('#leaderModal .btn-close')?.click();
});