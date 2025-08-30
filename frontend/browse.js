document.addEventListener("DOMContentLoaded", async () => {
  const host = window.location.hostname || 'localhost';
  const protocol = window.location.protocol.startsWith('http') ? window.location.protocol : 'http:';
  const BASE_URL = `${protocol}//${host}:5000`;
  const searchForm = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("resultsContainer");
  const searchCategory = document.getElementById("searchCategory");
  const searchKeyword = document.getElementById("searchKeyword");
  const searchCondition = document.getElementById("searchCondition");
  
  // Pagination elements
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const paginationInfo = document.getElementById("paginationInfo");
  
  // Pagination state
  let currentPage = 1;
  let itemsPerPage = 8;
  let totalItems = 0;
  let allItems = [];
  let totalPages = 0;

  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const keywordParam = urlParams.get('keyword');
  const conditionParam = urlParams.get('condition');

  // Set form values from URL parameters if they exist
  if (categoryParam) {
    searchCategory.value = categoryParam;
    document.querySelector('.search-section h2').textContent = `Browse ${categoryParam}`;
  }
  if (keywordParam) searchKeyword.value = keywordParam;
  if (conditionParam) searchCondition.value = conditionParam;

  // Function to render a subset of items based on current page
  function renderItems(items) {
    // Store all items for pagination
    allItems = items || [];
    totalItems = allItems.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Update pagination UI
    updatePaginationControls();
    
    // Clear the container
    resultsContainer.innerHTML = "";
    
    // Handle empty results
    if (!items || items.length === 0) {
      resultsContainer.innerHTML = "<p>No items found.</p>";
      return;
    }
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    // Get items for current page
    const currentItems = allItems.slice(startIndex, endIndex);
    
    // Render current page items
    currentItems.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("item-card");

      div.innerHTML = `
        <div class="item-image">
          <img src="${BASE_URL}/api/items/${item.id}/image" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns='+\''+\'http://www.w3.org/2000/svg'+\''+\' width='+\''+\'400'+\''+\' height='+\''+\'300'+\''+\'><rect width='+\''+\'100%25'+\''+\' height='+\''+\'100%25'+\''+\' fill='+\''+\'%23e5e7eb'+\''+\'/><text x='+\''+\'50%25'+\''+\' y='+\''+\'50%25'+\''+\' dominant-baseline='+\''+\'middle'+\''+\' text-anchor='+\''+\'middle'+\''+\' fill='+\''+\'%236b7280'+\''+\' font-size='+\''+\'20'+\''+\'>No Image</text></svg>'" alt="${item.title}">
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

      resultsContainer.appendChild(div);
    });
    
    // Update pagination info text
    updatePaginationInfo(startIndex, endIndex);
  }
  
  // Function to update pagination controls
  function updatePaginationControls() {
    // Clear existing page number buttons except Previous and Next
    const paginationUl = document.querySelector('.pagination');
    const pageItems = document.querySelectorAll('.pagination .page-item:not(#prevPageBtn):not(#nextPageBtn)');
    pageItems.forEach(item => item.remove());
    
    // Disable/enable Previous button
    if (currentPage <= 1) {
      prevPageBtn.classList.add('disabled');
      prevPageBtn.querySelector('a').setAttribute('aria-disabled', 'true');
    } else {
      prevPageBtn.classList.remove('disabled');
      prevPageBtn.querySelector('a').removeAttribute('aria-disabled');
    }
    
    // Disable/enable Next button
    if (currentPage >= totalPages || totalPages === 0) {
      nextPageBtn.classList.add('disabled');
      nextPageBtn.querySelector('a').setAttribute('aria-disabled', 'true');
    } else {
      nextPageBtn.classList.remove('disabled');
      nextPageBtn.querySelector('a').removeAttribute('aria-disabled');
    }
    
    // Add page number buttons
    // Show max 5 page numbers with current page in the middle when possible
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (i === currentPage) li.classList.add('active');
      
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.href = '#';
      a.textContent = i;
      a.dataset.page = i;
      
      a.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = parseInt(e.target.dataset.page);
        renderItems(allItems); // Re-render with new page
      });
      
      li.appendChild(a);
      paginationUl.insertBefore(li, nextPageBtn);
    }
  }
  
  // Function to update pagination info text
  function updatePaginationInfo(startIndex, endIndex) {
    if (totalItems === 0) {
      paginationInfo.textContent = 'No items found';
    } else {
      paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalItems} items`;
    }
  }

  async function searchItems(params = {}) {
    try {
      // Reset to first page when performing a new search
      currentPage = 1;
      
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.category) queryParams.append('category', params.category);
      if (params.condition) queryParams.append('condition', params.condition);
      
      const res = await fetch(`${BASE_URL}/api/items/search?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const items = await res.json();
      renderItems(items);
      
      // Update page title to reflect search
      const searchSectionH2 = document.querySelector('.search-section h2');
      if (searchSectionH2) {
        searchSectionH2.textContent = `${items.length} ${params.category ? params.category + ' ' : ''}Items Found`;
      }
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = "<p>Search failed.</p>";
      if (paginationInfo) {
        paginationInfo.textContent = 'Error loading items';
      }
    }
  }

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const keyword = searchKeyword.value;
    const category = searchCategory.value;
    const condition = searchCondition.value;

    // Update URL with search parameters without reloading the page
    const url = new URL(window.location);
    if (keyword) url.searchParams.set('keyword', keyword);
    else url.searchParams.delete('keyword');
    
    if (category) url.searchParams.set('category', category);
    else url.searchParams.delete('category');
    
    if (condition) url.searchParams.set('condition', condition);
    else url.searchParams.delete('condition');
    
    window.history.pushState({}, '', url);

    searchItems({ keyword, category, condition });
  });

  // Add event listeners for pagination buttons
  prevPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderItems(allItems);
    }
  });

  nextPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderItems(allItems);
    }
  });

  // Initial search based on URL parameters
  searchItems({
    keyword: keywordParam,
    category: categoryParam,
    condition: conditionParam
  });
});