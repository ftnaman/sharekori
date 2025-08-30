document.addEventListener("DOMContentLoaded", async () => {
  const host = window.location.hostname || 'localhost';
  const protocol = window.location.protocol.startsWith('http') ? window.location.protocol : 'http:';
  const BASE_URL = `${protocol}//${host}:5000`;
  const itemContainer = document.getElementById("itemContainer");
  const rentForm = document.getElementById("rentForm");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const totalCostElement = document.getElementById("totalCost");
  const reviewsContainer = document.getElementById("reviewsContainer");
  let currentItem = null; // Store the current item data
  
  // Get item id from URL
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("id");
  
  if (!itemId) {
    itemContainer.innerHTML = "<p>No item selected.</p>";
    return;
  }

  const token = localStorage.getItem("token");
  // Allow viewing item details without login; only renting requires login

  // Fetch and display item reviews
  async function fetchItemReviews(itemId) {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/item/${itemId}`);
      if (res.ok) {
        const reviews = await res.json();
        if (reviews.length > 0) {
          reviewsContainer.innerHTML = '<h3>Reviews</h3>';
          reviews.forEach(review => {
            reviewsContainer.innerHTML += `
              <div class="review">
                <div class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5-review.stars)}</div>
                <div class="review-comment">${review.comment || 'No comment'}</div>
                <div class="review-author">- ${review.reviewer_name}</div>
              </div>
            `;
          });
        } else {
          reviewsContainer.innerHTML = '<p>No reviews yet</p>';
        }
      } else {
        reviewsContainer.innerHTML = '<p>Failed to load reviews</p>';
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      reviewsContainer.innerHTML = '<p>Error loading reviews</p>';
    }
  }
  
  // Fetch item details
  async function fetchItem() {


    try {
      const res = await fetch(`${BASE_URL}/api/items/${itemId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch item (${res.status}): ${text}`);
      }
      const item = await res.json();
      currentItem = item; // Store the item data for later use

      const avg = item.owner_average_rating != null ? Number(item.owner_average_rating).toFixed(1) : 'N/A';
      const starsCount = Math.round(item.owner_average_rating || 0);
      const stars = '★★★★★'.slice(0, starsCount).padEnd(5, '☆');

      itemContainer.innerHTML = `
        <div class="item-image">
          <img src="${BASE_URL}/api/items/${item.id}/image" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns='+'\''+'http://www.w3.org/2000/svg'+'\''+' width='+'\''+'500'+'\''+' height='+'\''+'300'+'\''+'><rect width='+'\''+'100%25'+'\''+' height='+'\''+'100%25'+'\''+' fill='+'\''+'%23e5e7eb'+'\''+'/><text x='+'\''+'50%25'+'\''+' y='+'\''+'50%25'+'\''+' dominant-baseline='+'\''+'middle'+'\''+' text-anchor='+'\''+'middle'+'\''+' fill='+'\''+'%236b7280'+'\''+' font-size='+'\''+'20'+'\''+'>No Image</text></svg>'" alt="${item.title}">
        </div>
        <div class="item-info">
          <h2>${item.title}</h2>
          <p>${item.item_description || "No description"}</p>
          <div class="item-meta">
            <div class="item-rent">${item.rent_per_day} ৳/day</div>
            <div class="item-condition">${item.item_condition}</div>
          </div>
          <p>Owner: ${item.owner_name}</p>
        </div>
      `;

      const ratingBox = document.getElementById('ratingContainer');
      if (ratingBox) {
        ratingBox.innerHTML = `<div><strong>Owner rating</strong><div class=\"stars\"><span class=\"star\">${stars}</span> (${avg}) • ${item.owner_rating_count || 0} reviews</div></div>`;
      }



      initializeCalendar(itemId);
    } catch (err) {
      console.error('Item load error:', err);
      itemContainer.innerHTML = `<p>Failed to load item. Please check the server is running and the item exists. Error: ${err.message}</p>`;
    }
  }
  
  // Initialize flatpickr calendar
  async function initializeCalendar(itemId) {
    // Get today and tomorrow's date for minimum selectable dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Fetch booked dates for this item
    let bookedDates = [];
    try {
      const res = await fetch(`${BASE_URL}/api/rentals/availability/${itemId}`);
      const bookings = res.ok ? await res.json() : [];
      
      // Create a flat array of all booked dates
      bookings.forEach(booking => {
        const dates = datesInRange(booking.start_date, booking.end_date);
        bookedDates = [...bookedDates, ...Array.from(dates)];
      });
    } catch (err) {
      console.error('Failed to fetch booked dates:', err);
    }
    
    // Initialize start date picker with custom styling for booked dates
    const startDatePicker = flatpickr(startDateInput, {
      minDate: today,
      dateFormat: "Y-m-d",
      disable: bookedDates,
      onChange: function(selectedDates, dateStr) {
        // Update end date minimum when start date changes
        const nextDay = new Date(selectedDates[0]);
        nextDay.setDate(nextDay.getDate() + 1);
        endDatePicker.set('minDate', nextDay);
        
        // If end date is before start date, reset it
        if (endDatePicker.selectedDates[0] && endDatePicker.selectedDates[0] < nextDay) {
          endDatePicker.clear();
        }
        
        calculateTotalCost();
      },
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        // Check if this date is in bookedDates
        const dateStr = dayElem.dateObj.toISOString().slice(0,10);
        if (bookedDates.includes(dateStr)) {
          // Add a class to style booked dates
          dayElem.classList.add("booked-date");
        }
      }
    });
    
    // Initialize end date picker with custom styling for booked dates
    const endDatePicker = flatpickr(endDateInput, {
      minDate: tomorrow,
      dateFormat: "Y-m-d",
      disable: bookedDates,
      onChange: function() {
        calculateTotalCost();
      },
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        // Check if this date is in bookedDates
        const dateStr = dayElem.dateObj.toISOString().slice(0,10);
        if (bookedDates.includes(dateStr)) {
          // Add a class to style booked dates
          dayElem.classList.add("booked-date");
        }
      }
    });
    
    // Add custom CSS for booked dates
    const style = document.createElement('style');
    style.innerHTML = `
      .flatpickr-day.booked-date {
        background-color: #fee2e2 !important;
        color: #b91c1c !important;
        border-color: #fca5a5 !important;
        text-decoration: line-through;
      }
      .flatpickr-day.booked-date:hover {
        background-color: #fecaca !important;
      }
    `;
    document.head.appendChild(style);
    
    // Also render the calendar visualization
    renderCalendar(itemId);
    
    // Function to calculate total cost based on selected dates
    function calculateTotalCost() {
      if (startDatePicker.selectedDates[0] && endDatePicker.selectedDates[0] && currentItem) {
        const startDate = startDatePicker.selectedDates[0];
        const endDate = endDatePicker.selectedDates[0];
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalCost = days * currentItem.rent_per_day;
        totalCostElement.textContent = `Total: ${totalCost} ৳ (${days} days)`;
      } else {
        totalCostElement.textContent = 'Total: 0 ৳';
      }
    }
  }

  fetchItem();
  
  // Fetch reviews for this item
  fetchItemReviews(itemId);

  // Rent Now
  rentForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!token) {
      alert("Please log in to rent items");
      window.location.href = "login.html";
      return;
    }
    
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    try {
      console.log('Creating rental request for item:', itemId, 'with dates:', startDate, 'to', endDate);
      const res = await fetch(`${BASE_URL}/api/rentals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          item_id: itemId,
          start_date: startDate,
          end_date: endDate
        })
      });

      console.log('Rental request response status:', res.status);
      const data = await res.json();
      console.log('Rental request response data:', data);
      if (res.ok) {
        // After rental creation, trigger demo payment
        try {
          const payRes = await fetch(`${BASE_URL}/api/payments/demo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ rental_id: data.rentalId, payment_method: 'demo-gateway' })
          });
          const payData = await payRes.json();
          if (payRes.ok) {
            alert(`Payment completed. Amount: ${payData.amount}`);
            rentForm.reset();
          } else {
            alert(payData.error || 'Payment failed');
          }
        } catch (err) {
          alert('Payment request failed');
        }
      } else {
        alert(data.error || "Failed to request rental");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to request rental");
    }
  });

  function datesInRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    const days = new Set();
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      days.add(d.toISOString().slice(0,10));
    }
    return days;
  }

  async function renderCalendar(itemId) {
    const container = document.getElementById('availability');
    if (!container) return;
    container.innerHTML = '<p>Loading availability…</p>';
    try {
      const res = await fetch(`${BASE_URL}/api/rentals/availability/${itemId}`);
      const bookings = res.ok ? await res.json() : [];

      const booked = new Set();
      bookings.forEach(b => {
        const set = datesInRange(b.start_date, b.end_date);
        set.forEach(d => booked.add(d));
      });

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);

      let html = '<div class="calendar"><div class="cal-grid">';
      for (let d = 1; d <= last.getDate(); d++) {
        const dateStr = new Date(year, month, d).toISOString().slice(0,10);
        const isBooked = booked.has(dateStr);
        html += `<div class="cal-cell ${isBooked ? 'booked' : 'free'}">${d}</div>`;
      }
      html += '</div><div class="legend"><span class="legend-free">■</span> Available <span class="legend-booked">■</span> Booked</div></div>';
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = '';
    }
  }
});