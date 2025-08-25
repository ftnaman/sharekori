document.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000`;
  const itemContainer = document.getElementById("itemContainer");
  const rentForm = document.getElementById("rentForm");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  
  // Get item id from URL
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");
  
  if (!itemId) {
    itemContainer.innerHTML = "<p>No item selected.</p>";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first!");
    window.location.href = "login.html";
    return;
  }

  // Fetch item details
  async function fetchItem() {
    try {
      const res = await fetch(`${BASE_URL}/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch item");
      const item = await res.json();

      itemContainer.innerHTML = `
        <div class="item-image">
          <img src="${item.image_url ? BASE_URL + item.image_url : 'images/placeholder.png'}" alt="${item.title}">
        </div>
        <h2>${item.title}</h2>
        <p>${item.item_description || "No description"}</p>
        <div class="item-meta">
          <div>Rent: ${item.rent_per_day} ৳/day</div>
          <div>Condition: ${item.item_condition}</div>
          <div>Owner: ${item.owner_name}</div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      itemContainer.innerHTML = "<p>Failed to load item.</p>";
    }
  }

  fetchItem();

  // Rent Now
  rentForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/rentals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: itemId,
          start_date: startDate,
          end_date: endDate
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Rental request sent successfully!");
        rentForm.reset();
      } else {
        alert(data.error || "Failed to request rental");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to request rental");
    }
  });
});