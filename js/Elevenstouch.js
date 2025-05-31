// =====================
// MOBILE MENU TOGGLE
// =====================
const menuIcon = document.getElementById('menu-icon');
const navContainer = document.getElementById('nav-container');
const body = document.body;

// Toggle menu
menuIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Important to prevent immediate close
    navContainer.classList.toggle('active');
    body.classList.toggle('no-scroll');
});

// Prevent clicks inside nav from closing it
navContainer.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Close the menu when clicking anywhere outside
document.addEventListener('click', () => {
    if (navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        body.classList.remove('no-scroll');
    }
});

// Close menu when clicking on any link inside
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navContainer.classList.remove('active');
        body.classList.remove('no-scroll');
    });
});



const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i'); 
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// =====================
// SHOPPING CART SYSTEM
// =====================
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₦0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        
        if (!item.price) {
            console.error(`Product with ID ${item.id} is missing a price.`);
            return;
        }

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button class="decrement" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increment" data-id="${item.id}">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}">Remove</span>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `₦${total.toLocaleString()}`;

    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', incrementQuantity);
    });

    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', decrementQuantity);
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

function incrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

function decrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function showCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartIcon.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
cartOverlay.addEventListener('click', hideCart);

// =====================
// WISHLIST FUNCTIONALITY
// =====================
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const wishlistOverlay = document.getElementById('wishlist-overlay');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistItemsContainer = document.getElementById('wishlist-items');

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(e) {
    const productId = parseInt(e.target.closest('.wishlist-btn').getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push(product);
        updateWishlist();
        alert(`${product.title} has been added to your wishlist!`);
    } else {
        alert(`${product.title} is already in your wishlist.`);
    }
}

function removeFromWishlist(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlist();
}

function updateWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    wishlistItemsContainer.innerHTML = '';

    // Update the wishlist count badge
    const wishlistCount = document.querySelector('.wishlist-count');
    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p>Your wishlist is empty</p>';
        return;
    }

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="wishlist-item-details">
                <h4 class="wishlist-item-title">${item.title}</h4>
                <p class="wishlist-item-price">₦${item.price.toLocaleString()}</p>
                <span class="remove-wishlist-item" data-id="${item.id}">Remove</span>
            </div>
        `;
        wishlistItemsContainer.appendChild(wishlistItem);
    });

    document.querySelectorAll('.remove-wishlist-item').forEach(btn => {
        btn.addEventListener('click', removeFromWishlist);
    });
}

function showWishlist() {
    wishlistSidebar.classList.add('active');
    wishlistOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideWishlist() {
    wishlistSidebar.classList.remove('active');
    wishlistOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', addToWishlist);
});

wishlistOverlay.addEventListener('click', hideWishlist);
closeWishlist.addEventListener('click', hideWishlist);





function shareWishlist() {
    const wishlistLink = `${window.location.origin}/wishlist.html?items=${encodeURIComponent(JSON.stringify(wishlist))}`;
    navigator.clipboard.writeText(wishlistLink);
    alert('Wishlist link copied to clipboard!');
}

//document.querySelector('.share-wishlist-btn').addEventListener('click', shareWishlist);

// =====================
// PRODUCT DATA
// =====================
let products = [];

async function loadProductsFromServer() {
    try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        products = data;
        displayProducts(); // or loadNewArrivals(), etc.
    } catch (err) {
        console.error('Failed to load products:', err);
    }
}


// =====================
// PRODUCT RENDERING
// =====================
function renderProduct(product) {
    let badge = '';
    if (product.new) {
        badge = '<span class="product-badge new">New</span>';
    } else if (product.tags?.includes('bestseller')) {
        badge = '<span class="product-badge bestseller">Bestseller</span>';
    } else if (product.tags?.includes('sale')) {
        badge = '<span class="product-badge sale">Sale</span>';
    }

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${badge}
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
            <button class="wishlist-btn" data-id="${product.id}">
                    <i class="fa-regular fa-heart"></i>
                    </button>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₦${product.price.toLocaleString()}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>                
                <a href="product-detail.html?id=${product.id}" class="view-details-btn">View Details</a>
            </div>
        </div>
    `;
}

// =====================
// Review FUNCTIONS
// =====================
const reviews = JSON.parse(localStorage.getItem('reviews')) || {};

function loadReviews(productId) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = '';
    const productReviews = reviews[productId] || [];

    if (productReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }

    productReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <p>${review.text}</p>
            <p>Rating: ${'⭐'.repeat(review.rating)}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
}

document.getElementById('review-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
    const text = document.getElementById('review-text').value;
    const rating = parseInt(document.getElementById('review-rating').value);

    if (!reviews[productId]) reviews[productId] = [];
    reviews[productId].push({ text, rating });

    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviews(productId);
    e.target.reset();
    alert('Review submitted!');
});

// =====================
// PRODUCT DISPLAY FUNCTIONS
// =====================
function loadNewArrivals() {
    const newArrivalsContainer = document.getElementById('featured-products');
    const newProducts = products.filter(p => p.newArrival); 

    if (!newArrivalsContainer) return;

    newArrivalsContainer.innerHTML = ''; 

    newProducts.forEach(product => {
        newArrivalsContainer.innerHTML += renderProduct(product);
    });

    addEventListenersToProducts(); 
}

function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    featuredContainer.innerHTML = '';
    
    products.slice(0, 5).forEach(product => {
        featuredContainer.innerHTML += renderProduct(product);
    });
    
    addEventListenersToProducts();
}

function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; 

    products.forEach(product => {
        productGrid.innerHTML += renderProduct(product);
    });

    addEventListenersToProducts(); 
}

function filterProductsByCategory(category) {
    const productGrid = document.getElementById('product-grid') || document.getElementById('featured-products');
    if (!productGrid) return;

    productGrid.innerHTML = ''; 
    const filteredProducts = products.filter(product => product.category === category);

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p>No products found in this category.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        productGrid.innerHTML += renderProduct(product);
    });

    addEventListenersToProducts();
}


function addEventListenersToProducts() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', addToWishlist);
    });
}


// =====================
// FILTER FUNCTIONS
// =====================
// Global filter state
const filters = {
    price: 50000, 
    size: null,
    color: null,
};

// Filter products by price
function filterByPrice(maxPrice) {
    filters.price = parseInt(maxPrice);
    console.log(`Filtering by max price: ₦${filters.price}`);
}

// Filter products by size
function filterBySize(size) {
    filters.size = size;
    console.log(`Filtering by size: ${filters.size}`);
}

// Filter products by color
function filterByColor(color) {
    filters.color = color;
    console.log(`Filtering by color: ${filters.color}`);
}

// Apply all filters
function applyFilters() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; 

    function searchProducts(query) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;
    
        productGrid.innerHTML = ''; 
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p>No products match your search.</p>';
            return;
        }
    
        filteredProducts.forEach(product => {
            productGrid.innerHTML += renderProduct(product);
        });
    
        addEventListenersToProducts();
    }
    
    document.querySelector('.search-input').addEventListener('input', function () {
        searchProducts(this.value);
    });

    // Filter products based on the selected criteria
    const filteredProducts = products.filter(product => {
        const matchesPrice = product.price <= filters.price;
        const matchesSize = !filters.size || product.sizes?.includes(filters.size);
        const matchesColor = !filters.color || product.colors?.includes(filters.color);

        return matchesPrice && matchesSize && matchesColor;
    });

    // Render filtered products
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            productGrid.innerHTML += renderProduct(product);
        });
    } else {
        productGrid.innerHTML = '<p>No products match the selected filters.</p>';
    }

    addEventListenersToProducts();
}

// Reset all filters
function resetAllFilters() {
    filters.price = 50000; 
    filters.size = null;
    filters.color = null;

    // Reset UI elements
    document.getElementById('price-slider').value = 50000;
    document.querySelectorAll('.size-options button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.color-options button').forEach(button => button.classList.remove('active'));

    // Display all products
    displayProducts();
}

// =====================
// SHOP PAGE FUNCTIONALITY
// =====================
function setupShopFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersSidebar = document.getElementById('filters-sidebar');
    
    if (!filterToggle || !filtersSidebar) return;
    
    filterToggle.addEventListener('click', function() {
        filtersSidebar.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });
    
    document.addEventListener('click', function(e) {
        if (!filtersSidebar.contains(e.target) && e.target !== filterToggle) {
            filtersSidebar.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
}

    // Sort products based on the selected criteria
function sortProducts(criteria) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    let sortedProducts = [...products]; 

    if (criteria === 'price-low') {
        sortedProducts.sort((a, b) => a.price - b.price); 
    } else if (criteria === 'price-high') {
        sortedProducts.sort((a, b) => b.price - a.price); 
    } else if (criteria === 'newest') {
        sortedProducts.sort((a, b) => b.id - a.id); 
    }

    // Clear and render sorted products
    productGrid.innerHTML = '';
    sortedProducts.forEach(product => {
        productGrid.innerHTML += renderProduct(product);
    });

    addEventListenersToProducts(); 
}
    
    document.getElementById('sort')?.addEventListener('change', function () {
    sortProducts(this.value);
});
    
    document.getElementById('price-slider')?.addEventListener('input', function() {
        filterByPrice(this.value);
    });
    
    document.querySelectorAll('.filter-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            filterByCategory(this.textContent);
        });
    });
    
    document.querySelectorAll('.size-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBySize(this.textContent);
        });
    });
    
    document.querySelectorAll('.color-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

        
    document.querySelector('.apply-filters')?.addEventListener('click', function() {
        filtersSidebar.classList.remove('active');
        body.classList.remove('no-scroll');
    });
    
    document.querySelector('.reset-filters')?.addEventListener('click', resetAllFilters);

    setupShopFilters
// =====================
// CAROUSEL FUNCTIONALITY
// =====================
function startCarousel() {
    const carousel = document.querySelector('.carousel');
    const productCards = document.querySelectorAll('.carousel .product-card');
    let scrollAmount = 0;

    if (!carousel || productCards.length === 0) return; 

    const productWidth = productCards[0].offsetWidth + 30; 

    setInterval(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        if (scrollAmount >= maxScroll) {
            scrollAmount = 0; 
        } else {
            scrollAmount += productWidth; 
        }

        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    }, 3000); // Adjust the interval (3000ms = 3 seconds)
}

// =====================
// AUTH MODAL FUNCTIONALITY
// =====================
const authLink = document.getElementById('auth-link');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.querySelector('.close-auth');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (authLink && authModal) {
    // Open the modal
    authLink.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.add('active');
    });

    // Close the modal
    closeAuth.addEventListener('click', () => {
        authModal.classList.remove('active');
    });

    // Switch between tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Close modal when clicking outside the content
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });
}

// =====================
// USER AUTHENTICATION (LOGIN & REGISTRATION)
// =====================

// Simulated user database
const users = JSON.parse(localStorage.getItem('users')) || [];

// Handle registration
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('input[placeholder="Full Name"]').value;
    const email = e.target.querySelector('input[placeholder="Email"]').value;
    const password = e.target.querySelector('input[placeholder="Password"]').value;

    if (users.some(user => user.email === email)) {
        alert('User already exists. Please log in.');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');
    e.target.reset();
});

// Handle login
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[placeholder="Email"]').value;
    const password = e.target.querySelector('input[placeholder="Password"]').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.name}!`);
        authModal.classList.remove('active');
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// =====================
// NEWSLETTER FORM
// =====================
document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${e.target.querySelector('input').value}!`);
    e.target.reset();
});

// =====================
// SCROLL TO TOP BUTTON
// =====================
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =====================
// INITIALIZATION
// =====================

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWishlist(); 
});

// For product grid
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-grid')) {
        loadProductsFromServer();
        setupShopFilters();
    }
});

// For new arrivals
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-products')) {
        loadNewArrivals();
        startCarousel();
    }
});

// Handle category filtering on shop.html
document.addEventListener('DOMContentLoaded', () => {
    const category = window.location.hash.substring(1); 
    if (category) {
        filterProductsByCategory(category);
    }

    // Handle category button clicks on index.html
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            window.location.href = `shop.html#${category}`;
        });
    });

    // Handle category filtering on shop.html filter links
    document.querySelectorAll('.filter-list a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
});


document.getElementById('sort')?.addEventListener('change', function () {
    sortProducts(this.value);
});

// Setup shop filters
function setupShopFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersSidebar = document.getElementById('filters-sidebar');

    if (!filterToggle || !filtersSidebar) return;

    // Toggle filters sidebar
    filterToggle.addEventListener('click', function () {
        filtersSidebar.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Close filters sidebar when clicking outside
    document.addEventListener('click', function (e) {
        if (!filtersSidebar.contains(e.target) && e.target !== filterToggle) {
            filtersSidebar.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Price slider
    document.getElementById('price-slider')?.addEventListener('input', function () {
        filterByPrice(this.value);
    });

    // Size buttons
    document.querySelectorAll('.size-options button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBySize(this.textContent);
        });
    });

    // Color buttons
    document.querySelectorAll('.color-options button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterByColor(this.style.backgroundColor);
        });
    });

    // Apply filters button
    document.querySelector('.apply-filters')?.addEventListener('click', function () {
        applyFilters();
        filtersSidebar.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    // Reset all filters button
    document.querySelector('.reset-filters')?.addEventListener('click', resetAllFilters);
}

function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    showSpinner();
    setTimeout(hideSpinner, 1000); 
});

function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (!productId) {
        console.error('Product ID is missing in the URL.');
        document.querySelector('.product-details').innerHTML = '<p>Product not found.</p>';
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        document.querySelector('.product-details').innerHTML = '<p>Product not found.</p>';
        return;
    }

    // Populate product details
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-price').textContent = `₦${product.price.toLocaleString()}`;
    document.getElementById('product-units').textContent = `Available Units: ${product.units}`;
    document.getElementById('product-description').textContent = product.description;

    // Populate specifications
    const specifications = document.getElementById('product-specifications');
    specifications.innerHTML = `
        <li><strong>Material:</strong> ${product.material || 'N/A'}</li>
        <li><strong>Colors:</strong> ${product.colors?.join(', ') || 'N/A'}</li>
        <li><strong>Sizes:</strong> ${product.sizes?.join(', ') || 'N/A'}</li>
    `;

    // Add event listener for "Add to Cart" button
    document.getElementById('add-to-cart-btn').addEventListener('click', () => addToCart({ target: { getAttribute: () => product.id } }));
}

// Call the function on product-detail.html
if (window.location.pathname.includes('product-detail.html')) {
    document.addEventListener('DOMContentLoaded', loadProductDetails);
}

     
    
    updateWishlist();
    startCarousel();