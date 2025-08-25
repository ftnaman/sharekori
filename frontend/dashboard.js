document.addEventListener("DOMContentLoaded", async () => {
  const addItemForm = document.getElementById("addItemForm");
  const itemsContainer = document.getElementById("itemsContainer");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeMessage = document.getElementById("welcomeMessage");

  const BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000`;

  // Logout
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in first!");
    window.location.href = "login.html";
    return;
  }

  let user;
  try {
    const res = await fetch(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    user = await res.json();
    welcomeMessage.textContent = `Welcome, ${user.name.split(" ")[0]}!`;
  } catch (err) {
    console.error(err);
    alert("Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  // Add Item
  addItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addItemForm);
    try {
      const res = await fetch(`${BASE_URL}/api/items/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        addItemForm.reset();
        fetchUserItems();
      } else alert(data.error || "Failed to add item");
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  });

  // Fetch user items
  async function fetchUserItems() {
    try {
      const res = await fetch(`${BASE_URL}/api/items/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch items");
      const items = await res.json();

      itemsContainer.innerHTML = "";
      if (items.length === 0) {
        itemsContainer.innerHTML = "<p>No items found.</p>";
        return;
      }

      items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item-card");
        div.innerHTML = `
          <img src="${item.image_url ? BASE_URL + item.image_url : ''}">
          <div>
            <h4>${item.title}</h4>
            <p>${item.item_description || "No description"}</p>
            <p>Rent: ${item.rent_per_day ? item.rent_per_day + " ৳/day" : "Not specified"}</p>
          </div>
          <button class="remove-btn" data-id="${item.id}">Remove Listing</button>
        `;
        itemsContainer.appendChild(div);
      });

      // Remove item
      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!confirm("Are you sure to remove?")) return;
          const itemId = btn.dataset.id;
          try {
            const res = await fetch(`${BASE_URL}/api/items/${itemId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchUserItems();
            else alert("Failed to remove");
          } catch (err) {
            console.error(err);
            alert("Failed to remove item");
          }
        });
      });

    } catch (err) {
      console.error(err);
      itemsContainer.innerHTML = "<p>Failed to load items.</p>";
    }
  }

  fetchUserItems();
});