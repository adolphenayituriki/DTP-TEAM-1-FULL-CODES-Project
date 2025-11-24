function showLoginForm(level) {
    document.getElementById('leaderLevel').value = level;
    document.getElementById('loginForLevel').innerText = `Login as ${level} Leader`;
    document.getElementById('selectLevelStep').style.display = 'none';
    document.getElementById('loginFormStep').style.display = 'block';
}

function backToLevelSelect() {
    document.getElementById('selectLevelStep').style.display = 'block';
    document.getElementById('loginFormStep').style.display = 'none';
    document.getElementById('loginResult').innerHTML = '';
}

document.getElementById('leaderLoginForm').addEventListener('submit', function(e){
    e.preventDefault();


    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const level = document.getElementById('leaderLevel').value;
    const resultDiv = document.getElementById('loginResult');

    // DEMO ACCOUNTS
    if (user === "national" && pass === "national123") {
        resultDiv.innerHTML = `<span class='text-success'>Login successful! Welcome, ${level} Leader.</span>`;
        setTimeout(() => {
            window.location.href = "/html/NationalDashboard.html"; 
        }, 1500);
    }
    else if (user === "district" && pass === "district123") {
        resultDiv.innerHTML = `<span class='text-success'>Login successful! Welcome, District Leader.</span>`;
        setTimeout(() => {
            window.location.href = "/html/DISTRICT DASHBOARD/Distict_Dashboard.html";
        }, 1500);
    }
    else if (user === "sector" && pass === "sector123") {
        resultDiv.innerHTML = `<span class='text-success'>Login successful! Welcome, Sector Leader.</span>`;
        setTimeout(() => {
            window.location.href = "/html/Sector_Leader_Dashboard.html"; 
        }, 1500);
    }
    else if (user === "cell" && pass === "cell123") {
        resultDiv.innerHTML = `<span class='text-success'>Login successful! Welcome, Cell Leader.</span>`;
        setTimeout(() => {
            window.location.href = "/html/umujyanama.html"; 
        }, 1500);
    }
    else {
        resultDiv.innerHTML = "<span class='text-danger'>Invalid username or password.</span>";
    }
});
