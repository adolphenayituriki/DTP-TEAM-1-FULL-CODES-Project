document.getElementById("trackForm").addEventListener("submit", function(e) {
      e.preventDefault();

      const district = document.getElementById("district").value;
      const sector = document.getElementById("sector").value;
      const code = document.getElementById("deliveryCode").value;

      document.getElementById("results").innerHTML = `
            <div class="alert alert-info shadow-sm">
            <strong><i class="fa-solid fa-spinner fa-spin me-2"></i>Searching...</strong><br>
            District: ${district}<br>
            Sector: ${sector}<br>
            ${code ? "Delivery Code: " + code : ""}
            </div>
      `;
    //i will add PHP or API logic here
});
