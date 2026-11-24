// ==========================================
// 1. DOM ELEMENT SELECTION
// ==========================================

const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const statusMessage = document.getElementById("statusMessage");

const showAllBtn = document.getElementById("showAllBtn");

const showFavoritesBtn = document.getElementById("showFavoritesBtn");

const sectionTitle = document.getElementById("sectionTitle");

const retryContainer = document.getElementById("retryContainer");

const retryBtn = document.getElementById("retryBtn");

const productModal = document.getElementById("productModal");

const closeModal = document.getElementById("closeModal");


// ==========================================
// 2. APPLICATION DATA
// ==========================================

const API_URL = "https://fakestoreapi.com/products";

let products = [];

let showFavoritesOnly = false;


// Retrieve Favorites from Local Storage

function getSavedFavorites() {

    try {

        const savedData = JSON.parse(
            localStorage.getItem("favorites")
        );

        return Array.isArray(savedData) ? savedData : [];

    } catch (error) {

        console.error("Storage Error:", error);

        return [];

    }

}

let favorites = getSavedFavorites();


// ==========================================
// 3. FETCH API DATA
// ==========================================

async function fetchProducts() {

    try {

        retryContainer.hidden = true;

        statusMessage.innerHTML =
            '<div class="loader"></div><p>Loading products...</p>';

        productContainer.innerHTML = "";

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Failed to fetch products");

        }

        const data = await response.json();

        if (!Array.isArray(data)) {

            throw new Error("Invalid API response");

        }

        products = data;

        if (products.length === 0) {

            statusMessage.textContent = "No products available.";

            return;

        }

        statusMessage.textContent = "";

        loadCategories();

        renderProducts();

    }

    catch (error) {

        statusMessage.textContent =
            "Unable to load products. Please try again.";

        retryContainer.hidden = false;

        console.error("API Error:", error);

    }

}


// ==========================================
// 4. LOAD CATEGORIES
// ==========================================

function loadCategories() {

    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    const categories = [
        ...new Set(
            products.map(product => product.category)
        )
    ];

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// ==========================================
// 5. RENDER PRODUCTS
// ==========================================

function renderProducts() {

    productContainer.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedCategory = categoryFilter.value;


    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesFavorites =
            !showFavoritesOnly ||
            favorites.includes(product.id);

        return matchesSearch &&
               matchesCategory &&
               matchesFavorites;

    });


    // Empty State

    if (filteredProducts.length === 0) {

        statusMessage.textContent = "No products found.";

        return;

    }

    statusMessage.textContent = "";


    // Dynamic Product Rendering

    filteredProducts.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";


        // Product Image

        const image = document.createElement("img");

        image.src = product.image;

        image.alt = product.title;

        image.loading = "lazy";


        // Product Title

        const title = document.createElement("h3");

        title.textContent = product.title;


        // Product Category

        const category = document.createElement("p");

        category.className = "category";

        category.textContent = product.category;


        // Product Price

        const price = document.createElement("p");

        price.className = "price";

        price.textContent = "$" + product.price.toFixed(2);


        // Details Button

        const detailsButton = document.createElement("button");

        detailsButton.textContent = "View Details";

        detailsButton.addEventListener("click", () => {

            showProductDetails(product.id);

        });


        // Favorite Button

        const favoriteButton = document.createElement("button");

        favoriteButton.className = "favorite-btn";

        favoriteButton.textContent =
            favorites.includes(product.id)
                ? "❤️ Remove Favorite"
                : "🤍 Add Favorite";

        favoriteButton.addEventListener("click", () => {

            toggleFavorite(product.id);

        });


        // Append Elements

        card.appendChild(image);

        card.appendChild(title);

        card.appendChild(category);

        card.appendChild(price);

        card.appendChild(detailsButton);

        card.appendChild(favoriteButton);

        productContainer.appendChild(card);

    });

}


// ==========================================
// 6. SEARCH FUNCTIONALITY
// ==========================================

searchInput.addEventListener("input", () => {

    renderProducts();

});


// ==========================================
// 7. CATEGORY FILTER
// ==========================================

categoryFilter.addEventListener("change", () => {

    renderProducts();

});


// ==========================================
// 8. SHOW ALL PRODUCTS
// ==========================================

showAllBtn.addEventListener("click", () => {

    showFavoritesOnly = false;

    searchInput.value = "";

    categoryFilter.value = "all";

    sectionTitle.textContent = "Explore Products";

    renderProducts();

});


// ==========================================
// 9. FAVORITE FUNCTIONALITY
// ==========================================

function toggleFavorite(productId) {

    if (favorites.includes(productId)) {

        favorites = favorites.filter(
            id => id !== productId
        );

    }

    else {

        favorites.push(productId);

    }


    // Save to Local Storage

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    renderProducts();

}


// ==========================================
// 10. SHOW FAVORITES
// ==========================================

showFavoritesBtn.addEventListener("click", () => {

    showFavoritesOnly = true;

    searchInput.value = "";

    categoryFilter.value = "all";

    sectionTitle.textContent = "My Favorite Products ❤️";

    renderProducts();

});


// ==========================================
// 11. PRODUCT DETAILS MODAL
// ==========================================

function showProductDetails(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;


    document.getElementById("modalImage").src = product.image;

    document.getElementById("modalTitle").textContent =
        product.title;

    document.getElementById("modalCategory").textContent =
        "Category: " + product.category;

    document.getElementById("modalPrice").textContent =
        "$" + product.price.toFixed(2);

    document.getElementById("modalDescription").textContent =
        product.description;

    document.getElementById("modalRating").textContent =
        "Rating: " + product.rating.rate +
        " / 5 | Reviews: " + product.rating.count;


    productModal.style.display = "flex";

}


// Close Modal Button

closeModal.addEventListener("click", () => {

    productModal.style.display = "none";

});


// Close Modal by Clicking Outside

productModal.addEventListener("click", (event) => {

    if (event.target === productModal) {

        productModal.style.display = "none";

    }

});


// Close Modal with Escape Key

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        productModal.style.display = "none";

    }

});


// ==========================================
// 12. RETRY FUNCTIONALITY
// ==========================================

retryBtn.addEventListener("click", () => {

    fetchProducts();

});


// ==========================================
// 13. INITIALIZE APPLICATION
// ==========================================

fetchProducts();