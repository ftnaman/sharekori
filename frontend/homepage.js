document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000`;
  const featuredContainer = document.getElementById("featuredContainer");
  const searchForm = document.getElementById("searchForm");

  // Helper: render items
  function renderItems(items) {
    featuredContainer.innerHTML = "";
    if (!items || items.length === 0) {
      featuredContainer.innerHTML = "<p>No items found.</p>";
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item-card");

      div.innerHTML = `
        <div class="item-image">
          <img src="${item.image_url ? BASE_URL + item.image_url : 'images/placeholder.png'}" alt="${item.title}">
        </div>
        <div class="item-info">
          <h4 class="item-title">${item.title}</h4>
          <div class="item-meta">
            <div class="item-rent">
              ${item.rent_per_day ? item.rent_per_day + " ৳/day" : "Not specified"}
            </div>
            <div class="item-condition">
              ${item.item_condition || "Not specified"}
            </div>
          </div>
        </div>
      `;

      div.addEventListener("click", () => {
        window.location.href = `item.html?id=${item.id}`;
      });

      featuredContainer.appendChild(div);
    });
  }

  // ----------------------
  // Fetch featured products
  // ----------------------
  async function fetchFeaturedProducts() {
    try {
      const res = await fetch(`${BASE_URL}/api/items/featured`);
      if (!res.ok) throw new Error("Failed to fetch featured items");
      const items = await res.json();
      renderItems(items);
    } catch (err) {
      console.error(err);
      featuredContainer.innerHTML = "<p>Failed to load featured products.</p>";
    }
  }

  // ----------------------
  // Search form
  // ----------------------
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const keyword = document.getElementById("searchKeyword").value;
    const category = document.getElementById("searchCategory").value;
    const condition = document.getElementById("searchCondition").value;

    try {
      const res = await fetch(
        `${BASE_URL}/api/items/search?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}&condition=${encodeURIComponent(condition)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const items = await res.json();
      renderItems(items);
    } catch (err) {
      console.error(err);
      featuredContainer.innerHTML = "<p>Search failed.</p>";
    }
  });

  // Initial load
  fetchFeaturedProducts();
});

const lines = [
  "Find Items to Rent",
  "Search for Electronics",
  "Looking for Vehicles to Rent?",
  "Rent Tools Easily Anytime",
  "Discover Affordable Rentals Near You"
];

let currentLine = 0;
let currentChar = 0;
let isDeleting = false;
const speed = 100;   // typing speed
const delay = 1500;  // pause before deleting
const target = document.getElementById("typewriter");

function typeWriter() {
  const line = lines[currentLine];

  if (!isDeleting) {
    // typing forward
    target.textContent = line.substring(0, currentChar + 1);
    currentChar++;

    if (currentChar === line.length) {
      isDeleting = true;
      setTimeout(typeWriter, delay);
      return;
    }
  } else {
    // deleting backwards
    target.textContent = line.substring(0, currentChar - 1);
    currentChar--;

    if (currentChar === 0) {
      isDeleting = false;
      currentLine = (currentLine + 1) % lines.length;
    }
  }

  setTimeout(typeWriter, isDeleting ? speed / 2 : speed);
}

// start the animation
typeWriter();