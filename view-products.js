document.addEventListener("DOMContentLoaded", () => {
  fetch('product2.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    })
    .then((products) => {
      renderProducts(products);

      const searchInput = document.getElementById("search-input");
      searchInput.addEventListener("input", () => handleSearch(products));
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});

function renderProducts(products, isSearched = false) {
  const productList = document.getElementById('product-grid');
  productList.innerHTML = '';

  products.forEach((product) => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-box');

    // Add a special class if these are searched products
    if (isSearched) {
      productItem.classList.add('searched-product');
    }

    // HTML structure for each product
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
          <span class="price">
            $${product.price}
            ${product.discount ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
          </span>
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

    // Add "NEW" badge if the product has `newBadge` set to true
    if (product.newBadge) {
      productHTML = `<div class="new-badge">NEW</div>` + productHTML;
    }

    // Add "DISCOUNT" badge if the product has a discount
    if (product.discount) {
      productHTML = `<div class="new-badge-spc">${product.discount}% OFF</div>` + productHTML;
    }

    // Set the product HTML to the product item
    productItem.innerHTML = productHTML;

    // Append the product item to the product grid
    productList.appendChild(productItem);
  });
}

function handleSearch(products) {
  const query = document.getElementById("search-input").value.trim().toLowerCase();

  // Filter the products based on the search query
  let filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  });

  // Remove duplicates based on `name` and `image`
  const uniqueProducts = [];
  const productSet = new Set();

  filteredProducts.forEach((product) => {
    const uniqueKey = `${product.name}-${product.image}`;
    if (!productSet.has(uniqueKey)) {
      productSet.add(uniqueKey);
      uniqueProducts.push(product);
    }
  });

  // Render searched products with the special style
  renderProducts(uniqueProducts, true);
}
