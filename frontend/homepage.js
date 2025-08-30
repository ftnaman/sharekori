document.addEventListener("DOMContentLoaded", async () => {
  const host = window.location.hostname || 'localhost';
  const protocol = window.location.protocol.startsWith('http') ? window.location.protocol : 'http:';
  const BASE_URL = `${protocol}//${host}:5000`;
  const searchForm = document.getElementById("searchForm");
  
  // Typewriter effect
  const typewriterElement = document.getElementById("typewriter");
  const phrases = [
    "Find Items to Rent",
    "Save Money, Rent Instead",
    "Discover Local Rentals",
    "Rent What You Need",
    "Share Your Items"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      // Deleting text
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster when deleting
    } else {
      // Typing text
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal speed when typing
    }
    
    // If completed typing the phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at the end
    }
    
    // If completed deleting the phrase
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing next phrase
    }
    
    setTimeout(typeWriter, typingSpeed);
  }
  
  // Start the typewriter effect
  typeWriter();

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
          <img src="${BASE_URL}/api/items/${item.id}/image" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns='+'\''+\'http://www.w3.org/2000/svg'+'\''+\' width='+'\''+\'400'+'\''+\' height='+'\''+\'300'+'\''+\'><rect width='+'\''+\'100%25'+'\''+\' height='+'\''+\'100%25'+'\''+\' fill='+'\''+\'%23e5e7eb'+'\''+\'/><text x='+'\''+\'50%25'+'\''+\' y='+'\''+\'50%25'+'\''+\' dominant-baseline='+'\''+\'middle'+'\''+\' text-anchor='+'\''+\'middle'+'\''+\' fill='+'\''+\'%236b7280'+'\''+\' font-size='+'\''+\'20'+'\''+\'>No Image</text></svg>'" alt="${item.title}">
        </div>
        <div class="item-info">
          <h4 class="item-title">${item.title}</h4>
          <div class="item-meta">
            <div class="item-rent">${item.rent_per_day ? item.rent_per_day + " ৳/day" : "Not specified"}</div>
            <div class="item-condition">${item.item_condition || "Not specified"}</div>
          </div>
        </div>
      `;

      div.addEventListener("click", () => {
        window.location.href = `item.html?id=${item.id}`;
      });

      featuredContainer.appendChild(div);
    });
  }

  async function fetchFeaturedProducts() {
    try {
      const res = await fetch(`${BASE_URL}/api/items/featured`);
      if (!res.ok) throw new Error("Failed to fetch featured items");
      const items = await res.json();
      renderItems(items);
    } catch (err) {
      console.error(err);
      featuredContainer.innerHTML = "<p>Failed to load featured products.</p>";
    } finally {
      // ✅ Hide preloader after load attempt
      document.querySelector(".preloader-wrapper").style.display = "none";
    }
  }

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const keyword = document.getElementById("searchKeyword").value;
    const category = document.getElementById("searchCategory").value;

    try {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append('keyword', keyword);
      if (category) queryParams.append('category', category);
      
      // Redirect to browse page with search parameters
      window.location.href = `browse.html?${queryParams.toString()}`;
    } catch (err) {
      console.error(err);
      featuredContainer.innerHTML = "<p>Search failed.</p>";
    }
  });

  fetchFeaturedProducts();
});