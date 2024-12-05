const viewProductsButton = document.getElementById("viewProductsButton");


viewProductsButton.addEventListener("click", function() {
  window.location.href = "view-products.html";
});

/*Moblie menu*/
// Select Elements
const hamburgerIcon = document.querySelector('.hamburger-icon');
const closeIcon = document.querySelector('.close-icon');
const mobileMenuDropdown = document.querySelector('.mobile-menu-dropdown');

// Toggle Mobile Menu Visibility
function toggleMenu(show) {
  mobileMenuDropdown.classList.toggle('show', show);
  hamburgerIcon.style.display = show ? 'none' : 'block';
  closeIcon.style.display = show ? 'block' : 'none';
}

// Add Event Listeners
hamburgerIcon.addEventListener('click', () => toggleMenu(true));
closeIcon.addEventListener('click', () => toggleMenu(false));

// Handle Screen Resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 740) {
    toggleMenu(false); // Ensure mobile menu is hidden on larger screens
    hamburgerIcon.style.display = 'none'; // Hide hamburger icon
    closeIcon.style.display = 'none'; // Hide close icon
  } else {
    hamburgerIcon.style.display = 'block'; // Show hamburger icon
  }
});

// products listing


document.addEventListener("DOMContentLoaded", () => {
  // Fetch product data from JSON
  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch JSON data");
      }
      return response.json();
    })
    .then((data) => {
      renderProducts(data);

      const searchInput = document.getElementById("search-input");
      const searchButton = document.getElementById("search-button");

      // Event Listener for Search Button Click
      searchButton.addEventListener("click", () => {
        handleSearch(data);
      });

      // Event Listener for "Enter" key
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleSearch(data);
        }
      });

      // Event Listener for "Home" link in breadcrumbs
      setupHomeLink(data);
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
});

// Render Products to the Page
function renderProducts(products, isSearched = false) {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-box");

    // Add a special class for searched products
    if (isSearched) {
      productItem.classList.add("searched-product");
    }

    // Create product HTML structure
    let productHTML = `
      <div class="product-container">
        <div class="imageo">
          <div class="bgcontainer">
            <img src="${product.image}" alt="${product.name}" />
          </div>
        </div>
        <div class="imagecontainer">
          <div class="iconimg wishlist">
            <img src="assets/images/wishlist.svg" alt="wishlist icon" />
          </div>
          <div class="iconimg quick-view">
            <img src="assets/images/Quick View.svg" alt="quick view icon" />
          </div>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
      <div class="contents">
        <h6>${product.name}</h6>
        <div class="line">
          <span class="price">$${product.price}</span>
          <div class="rating">
            <img src="assets/images/Three Star.svg" alt="star" />
            <span>(${product.reviews})</span>
          </div>
        </div>
        ${product.colors.length > 0 ? 
          `<div class="color-options">${product.colors.map(color => `<div class="color-circle color-${color}"></div>`).join('')}</div>` 
          : ''}
      </div>
    `;

    // Add the "new" badge if the product has the `newBadge` property set to true
    if (product.newBadge) {
      productHTML = `
        <div class="new-badge">NEW</div>
        ${productHTML}
      `;
    }

    // Insert the HTML into the product box
    productItem.innerHTML = productHTML;

    // Append the product item to the grid
    productGrid.appendChild(productItem);
  });
}
// Handle Search Functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-btn");

  // Show/hide the clear button based on input field content
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
      clearBtn.style.display = "block"; // Show the clear button
    } else {
      clearBtn.style.display = "none"; // Hide the clear button
    }
  });

  // Clear the search input when the "X" button is clicked
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none"; // Hide the clear button again
  });
});

function handleSearch(products) {
  const query = document.getElementById("search-input").value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  });

  if (filteredProducts.length > 0) {
    // Hide specific sections
    hideSections();

    // Show breadcrumbs
    showBreadcrumbs();

    // Render the filtered products
    renderProducts(filteredProducts, true);
  } else {
    alert("No products found for your search. 🥲");
  }
}




// Reset to Default Functionality via "Home" Link
function setupHomeLink(products) {
  const homeLink = document.querySelector(".clicks .grey-color");

  homeLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default page reload

    // Show the hidden sections
    showSections();

    // Hide the breadcrumbs
    hideBreadcrumbs();

    // Render all products (default state)
    renderProducts(products);
  });
}

// Show 'div.clicks'
function showBreadcrumbs() {
  const breadcrumbs = document.querySelector(".clicks");
  breadcrumbs.style.display = "block";
}

// Hide 'div.clicks'
function hideBreadcrumbs() {
  const breadcrumbs = document.querySelector(".clicks");
  breadcrumbs.style.display = "none";
}

// Hide specific sections
function hideSections() {
  document.querySelector("div.banner").style.display = "none";
  document.querySelector("section.categories-section").style.display = "none";
  document.querySelector("div.btn").style.display = "none";
  document.querySelector("div.connection").style.display = "none";
}

// Show specific sections
function showSections() {
  document.querySelector("div.banner").style.display = "";
  document.querySelector("section.categories-section").style.display = "block";
  document.querySelector("div.btn").style.display = "block";
  document.querySelector("div.connection").style.display = "flex"; // Assuming it's a flex container
}


