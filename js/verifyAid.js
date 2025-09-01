   // Example aid codes database
const aidDatabase = [
      { code: "AID001", status: "Delivered" },
      { code: "AID002", status: "Pending" },
      { code: "AID003", status: "Failed" },
      { code: "AID004", status: "Delivered" },
      { code: "AID005", status: "Delivered" }
      ];

      const verificationHistory = [];
      function verifyAid() {
            const codeInput = document.getElementById('aidCode').value.trim().toUpperCase();
            const resultDiv = document.getElementById('verifyResult');

            if (!codeInput) {
                  resultDiv.textContent = "Please enter an aid code.";
                  resultDiv.className = "error";
                  resultDiv.style.display = "block";
                  return;
            }

            const aidEntry = aidDatabase.find(aid => aid.code === codeInput);

            if (aidEntry) {
                  resultDiv.textContent = `Aid Code ${codeInput} status: ${aidEntry.status}`;
                  resultDiv.className = "success";
                  addToTable(codeInput, aidEntry.status);
            } else {
                  resultDiv.textContent = `Aid Code ${codeInput} not found.`;
                  resultDiv.className = "error";
            }

            resultDiv.style.display = "block";
      }

      function addToTable(code, status) {
            const tableBody = document.getElementById('verificationTableBody');
            const rowIndex = verificationHistory.length + 1;
            const date = new Date().toLocaleDateString();
            verificationHistory.push({ code, status, date });

            const row = document.createElement('tr');
            row.innerHTML = `
                  <td>${rowIndex}</td>
                  <td>${code}</td>
                  <td>${status}</td>
                  <td>${date}</td>
            `;
            tableBody.prepend(row);
}
