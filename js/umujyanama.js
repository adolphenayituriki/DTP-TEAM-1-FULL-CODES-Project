    let currentUser = null;

    function login() {
      const name = document.getElementById('name').value;
      const sector = document.getElementById('sector').value;
      const cell = document.getElementById('cell').value;
      const password = document.getElementById('password').value;

      if(name && sector && cell && password){
        currentUser = {id: name+"-"+sector+"-"+cell, name, sector, cell};
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDashboard();
      } else {
        alert('Injiza amakuru yose!');
      }
    }

    function showDashboard(){
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      document.getElementById('welcome').innerText = "Murakaza neza, "+currentUser.name;
      loadUserData();
    }

    function logout(){
      localStorage.removeItem('currentUser');
      currentUser = null;
      document.getElementById('login-screen').classList.remove('hidden');
      document.getElementById('dashboard').classList.add('hidden');
    }

    function submitReport(){
      const aidType = document.getElementById('aidType').value;
      const count = document.getElementById('childrenCount').value;
      if(!aidType || !count){ alert('Injiza amakuru yose.'); return; }
      let reports = JSON.parse(localStorage.getItem('reports')) || {};
      if(!reports[currentUser.id]) reports[currentUser.id] = [];
      reports[currentUser.id].push({aidType, count, date: new Date().toLocaleString()});
      localStorage.setItem('reports', JSON.stringify(reports));
      loadUserData();
    }

    function submitRequest(){
      const aid = document.getElementById('requestAid').value;
      const qty = document.getElementById('requestQty').value;
      if(!aid || !qty){ alert('Injiza ibisabwa byose.'); return; }
      let requests = JSON.parse(localStorage.getItem('requests')) || {};
      if(!requests[currentUser.id]) requests[currentUser.id] = [];
      requests[currentUser.id].push({aid, qty, date: new Date().toLocaleString()});
      localStorage.setItem('requests', JSON.stringify(requests));
      loadUserData();
    }

    function sendMessage(){
      const msg = document.getElementById('messageText').value;
      if(!msg){ alert('Andika ubutumwa.'); return; }
      let messages = JSON.parse(localStorage.getItem('messages')) || {};
      if(!messages[currentUser.id]) messages[currentUser.id] = [];
      messages[currentUser.id].push({msg, date: new Date().toLocaleString()});
      localStorage.setItem('messages', JSON.stringify(messages));
      document.getElementById('messageText').value = '';
      loadUserData();
    }

    function loadUserData(){
      let reports = JSON.parse(localStorage.getItem('reports')) || {};
      let requests = JSON.parse(localStorage.getItem('requests')) || {};
      let messages = JSON.parse(localStorage.getItem('messages')) || {};

      const reportList = document.getElementById('reportsList');
      reportList.innerHTML = '';
      (reports[currentUser.id]||[]).forEach(r => {
        reportList.innerHTML += `<li>${r.aidType} - ${r.count} abana (${r.date})</li>`;
      });

      const requestList = document.getElementById('requestsList');
      requestList.innerHTML = '';
      (requests[currentUser.id]||[]).forEach(req => {
        requestList.innerHTML += `<li>${req.aid} - ${req.qty} (${req.date})</li>`;
      });

      const msgList = document.getElementById('messagesList');
      msgList.innerHTML = '';
      (messages[currentUser.id]||[]).forEach(m => {
        msgList.innerHTML += `<li>${m.msg} (${m.date})</li>`;
      });
    }

    window.onload = () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if(user){ currentUser = user; showDashboard(); }
    }