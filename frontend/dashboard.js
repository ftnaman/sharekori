document.addEventListener("DOMContentLoaded", async () => {
  const addItemForm = document.getElementById("addItemForm");
  const itemsContainer = document.getElementById("itemsContainer");
  const rentedItemsContainer = document.getElementById("rentedItemsContainer");
  const welcomeMessage = document.getElementById("welcomeMessage");

  const host = window.location.hostname || 'localhost';
  const protocol = window.location.protocol.startsWith('http') ? window.location.protocol : 'http:';
  const BASE_URL = `${protocol}//${host}:5000`;

  // Logout is now handled by the navbar

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
    
    // Fetch user's average rating
    fetchUserRating(user.id);
  } catch (err) {
    console.error(err);
    alert("Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }
  
  // Fetch and display user's average rating
  async function fetchUserRating(userId) {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/user/${userId}/average`);
      if (res.ok) {
        const ratingData = await res.json();
        const userRatingContainer = document.getElementById("userRatingContainer");
        const ratingStars = userRatingContainer.querySelector(".rating-stars");
        const ratingValue = userRatingContainer.querySelector(".rating-value");
        const ratingCount = userRatingContainer.querySelector(".rating-count");
        
        if (ratingData.average_rating) {
          const avgRating = parseFloat(ratingData.average_rating).toFixed(1);
          const starsCount = Math.round(avgRating);
          ratingStars.innerHTML = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
          ratingValue.textContent = avgRating;
          ratingCount.textContent = `(${ratingData.rating_count} reviews)`;
          userRatingContainer.style.display = 'block';
        } else {
          userRatingContainer.style.display = 'none';
        }
      }
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
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
          <img src="${BASE_URL}/api/items/${item.id}/image" onerror="this.src=''">
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

  // Fetch rented items
  async function fetchRentedItems() {
    try {
      const res = await fetch(`${BASE_URL}/api/rentals/my-rentals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch rented items");

      const rentals = await res.json();
      rentedItemsContainer.innerHTML = "";

      if (rentals.length === 0) {
        rentedItemsContainer.innerHTML = "<p>You haven’t rented any items yet.</p>";
        return;
      }

      rentals.forEach(rental => {
        const div = document.createElement("div");
        div.classList.add("rented-card");
        div.innerHTML = `
          <img src="${BASE_URL}/api/items/${rental.item_id}/image" onerror="this.src=''" alt="item">
          <div>
            <h4>${rental.title}</h4>
            <p>${rental.item_description || "No description"}</p>
            <p>Rent: ${rental.rent_per_day} ৳/day</p>
            <p>Rented: ${new Date(rental.start_date).toLocaleDateString()} → ${new Date(rental.end_date).toLocaleDateString()}</p>
            <p>Owner: ${rental.owner_name}</p>
            <div class="rate-owner">
              <label>Rate owner:</label>
              <select class="rating-select">
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <input type="text" class="rating-comment" placeholder="Optional comment"/>
              <button class="submit-rating" data-rental="${rental.rental_id}">Submit</button>
              <span class="rating-status" data-rental="${rental.rental_id}" style="margin-left:8px;"></span>
            </div>
          </div>
        `;
        rentedItemsContainer.appendChild(div);
      });

      // Wire rating submissions
      document.querySelectorAll('.submit-rating').forEach(btn => {
        btn.addEventListener('click', async () => {
          const wrap = btn.closest('.rate-owner');
          const select = wrap.querySelector('.rating-select');
          const comment = wrap.querySelector('.rating-comment').value.trim();
          const ratingVal = Number(select.value);
          if (!ratingVal) {
            alert('Please select a rating between 1 and 5');
            return;
          }
          try {
            const res = await fetch(`${BASE_URL}/api/ratings`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ rental_id: btn.dataset.rental, rating: ratingVal, comment })
            });
            const data = await res.json();
            if (res.ok) {
              // Hide the rating UI once submitted
              wrap.innerHTML = `<span style="color:var(--muted-text)">Thanks! You rated ${ratingVal}/5.</span>`;
            } else {
              alert(data.error || 'Failed to submit rating');
            }
          } catch (err) {
            console.error(err);
            alert('Failed to submit rating');
          }
        });
      });

      // Prefill existing ratings for visibility
      document.querySelectorAll('.rating-status').forEach(async (statusEl) => {
        const rentalId = statusEl.dataset.rental;
        try {
          const res = await fetch(`${BASE_URL}/api/ratings/rental/${rentalId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const wrap = statusEl.closest('.rate-owner');
            // Replace the control with a static message if already rated
            wrap.innerHTML = `<span style="color:var(--muted-text)">Already rated: ${data.rating}/5</span>`;
          } else {
            statusEl.textContent = '';
          }
        } catch (err) {
          statusEl.textContent = '';
        }
      });

    } catch (err) {
      console.error(err);
      rentedItemsContainer.innerHTML = "<p>Failed to load rentals.</p>";
    }
  }


  // Fetch rental requests
  async function fetchRentalRequests() {
    try {
      console.log('Fetching rental requests...');
      const res = await fetch(`${BASE_URL}/api/rentals/item-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Response status:', res.status);
      if (!res.ok) throw new Error("Failed to fetch rental requests");
      const requests = await res.json();
      console.log('Rental requests data:', requests);

      const rentalRequestsContainer = document.getElementById("rentalRequestsContainer");
      console.log('Rental requests container:', rentalRequestsContainer);
      if (!rentalRequestsContainer) {
        console.error('Rental requests container not found!');
        return;
      }
      rentalRequestsContainer.innerHTML = "";

      if (requests.length === 0) {
        rentalRequestsContainer.innerHTML = "<p>No rental requests found.</p>";
        return;
      }

      requests.forEach(request => {
        console.log('Processing request:', request);
        const div = document.createElement("div");
        div.classList.add("request-card");
        const isDelivered = request.delivered_status === 1 || request.delivered_status === true;
        const deliveredStatus = isDelivered ? 
          '<span class="status-delivered">✓ Delivered</span>' : 
          '<span class="status-pending">⏳ Pending</span>';
        
        div.innerHTML = `
          <img src="${BASE_URL}/api/items/${request.item_id}/image" onerror="this.src=''" alt="item">
          <div class="request-info">
            <h4>${request.title}</h4>
            <p>${request.item_description || "No description"}</p>
            <p>Rent: ${request.rent_per_day} ৳/day</p>
            <p>Requested: ${new Date(request.start_date).toLocaleDateString()} → ${new Date(request.end_date).toLocaleDateString()}</p>
            <p>Renter: ${request.renter_name}</p>
            <p>Contact Phone: ${request.renter_phone || 'Not provided'}</p>
            <div class="request-status">
              ${deliveredStatus}
              ${!isDelivered ? 
                `<button class="mark-delivered-btn" data-request="${request.request_id}">Mark as Delivered</button>` : 
                ''
              }
            </div>
          </div>
        `;
        rentalRequestsContainer.appendChild(div);
      });

      // Wire mark as delivered buttons
      document.querySelectorAll('.mark-delivered-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const requestId = btn.dataset.request;
          try {
            const res = await fetch(`${BASE_URL}/api/rentals/mark-delivered/${requestId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            });
            const data = await res.json();
            if (res.ok) {
              // Update the UI to show delivered status
              const requestCard = btn.closest('.request-card');
              const statusDiv = requestCard.querySelector('.request-status');
              statusDiv.innerHTML = '<span class="status-delivered">✓ Delivered</span>';
            } else {
              alert(data.error || 'Failed to mark as delivered');
            }
          } catch (err) {
            console.error(err);
            alert('Failed to mark as delivered');
          }
        });
      });

    } catch (err) {
      console.error(err);
      const rentalRequestsContainer = document.getElementById("rentalRequestsContainer");
      rentalRequestsContainer.innerHTML = "<p>Failed to load rental requests.</p>";
    }
  }

  fetchUserItems();
  fetchRentedItems();
  fetchRentalRequests();
  
  // Add event listener for tab changes to ensure rental requests are loaded when tab is clicked
  document.addEventListener('shown.bs.tab', function (event) {
    if (event.target.id === 'requests-tab') {
      console.log('Rental requests tab clicked, refreshing data...');
      fetchRentalRequests();
    }
  });
});