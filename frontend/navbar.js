// components/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("navbar-container");
  if (!el) return;
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;

  el.innerHTML = `
    <nav class="navbar navbar-expand-lg sk-navbar bg-white">
      <div class="container">
        <a class="navbar-brand fw-bold" href="homepage.html">
          <img src="sharekori_logo.png" alt="sharekori" style="height:52px;vertical-align:middle">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#skNav"
                aria-controls="skNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="skNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="homepage.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="browse.html">Browse</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="catDrop" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categories
              </a>
              <ul class="dropdown-menu" aria-labelledby="catDrop">
                <li><a class="dropdown-item" href="browse.html?category=Electronics">Electronics</a></li>
                <li><a class="dropdown-item" href="browse.html?category=Equipment">Equipment</a></li>
                <li><a class="dropdown-item" href="browse.html?category=Furniture">Furniture</a></li>
                <li><a class="dropdown-item" href="browse.html?category=Vehicles">Vehicles</a></li>
                <li><a class="dropdown-item" href="browse.html?category=Books%20%26%20Media">Books & Media</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="how-it-works.html">How it works</a></li>
          </ul>

          <div class="d-flex gap-2" id="navAuthButtons">
            <!-- Auth buttons will be dynamically inserted here -->
          </div>
        </div>
      </div>
    </nav>
  `;

  // Set auth buttons based on login status
  const authButtonsContainer = el.querySelector('#navAuthButtons');
  if (authButtonsContainer) {
    if (isLoggedIn) {
      authButtonsContainer.innerHTML = `
        <a href="dashboard.html" class="btn btn-primary">Dashboard</a>
        <a href="dashboard.html" class="btn btn-success">Share an item</a>
        <button id="navLogoutBtn" class="btn btn-outline-danger">Logout</button>
      `;
      
      // Add logout functionality
      setTimeout(() => {
        const logoutBtn = el.querySelector('#navLogoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            window.location.href = 'homepage.html';
          });
        }
      }, 0);
    } else {
      authButtonsContainer.innerHTML = `
        <a href="login.html" class="btn btn-outline-primary">Log in</a>
        <a href="register.html" class="btn btn-primary">Register</a>
      `;
    }
  }

  // Highlight active page
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  el.querySelectorAll("a.nav-link, .navbar-brand").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href && href === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // Let other scripts know navbar is ready (optional)
  document.dispatchEvent(new CustomEvent("sk:navbar-ready"));
});