document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Display user information
    displayUserInfo();
    
    // User dropdown toggle
    const userProfileLink = document.getElementById('userProfileLink');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userProfileLink && userDropdown) {
        userProfileLink.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.toggle('active');
            
            // Close notification dropdown if open
            if (notificationDropdown && notificationDropdown.classList.contains('active')) {
                notificationDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfileLink.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Notification system functionality
    const notificationLink = document.getElementById('notificationLink');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllReadLink = document.querySelector('.mark-all-read');
    
    if (notificationLink && notificationDropdown) {
        notificationLink.addEventListener('click', function(e) {
            e.preventDefault();
            notificationDropdown.classList.toggle('active');
            
            // Close user dropdown if open
            if (userDropdown && userDropdown.classList.contains('active')) {
                userDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationLink.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('active');
            }
        });
        
        // Mark all as read functionality
        if (markAllReadLink) {
            markAllReadLink.addEventListener('click', function(e) {
                e.preventDefault();
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                });
                
                // Update badge count
                notificationBadge.textContent = '0';
                notificationBadge.style.display = 'none';
            });
        }
    }
    
    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            body.classList.toggle('mobile-menu-open');
        });
    }
    
    // Menu category filter
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter menu items
            filterMenuItems(category);
        });
    });
    
    // Load menu items
    loadMenuItems();
    
    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartPreview = document.getElementById('cartPreview');
    const closeCart = document.getElementById('closeCart');
    const clearCart = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Open cart
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            cartPreview.classList.add('open');
        });
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartPreview.classList.remove('open');
        });
    }
    
    // Clear cart
    if (clearCart) {
        clearCart.addEventListener('click', function() {
            clearCartItems();
        });
    }
    
    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (getCartItems().length > 0) {
                // Show spinner overlay
                const overlay = document.getElementById('checkoutLoadingOverlay');
                if (overlay) overlay.style.display = 'flex';
                // Simulate loading, then navigate
                setTimeout(() => {
                    window.location.href = 'checkout.html';
                }, 800); // 0.8s spinner for UX
            } else {
                alert('Your cart is empty!');
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send this data to the server
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send this data to the server
            // For now, we'll just show a success message
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }
});

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme icon
    updateThemeIcon(savedTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
    
    // Update theme icon
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Load menu items from localStorage if available, else use static
function getMenuItemsForUser() {
  const stored = localStorage.getItem('menuItems');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback to static
    }
  }
  // Static fallback
  return [
    {
      id: 1,
      name: 'Jollof Rice',
      price: 1200,
      description: 'Classic Nigerian jollof rice served with fried plantain and chicken.',
      image: '../images/Yam-and-Egg-Sauce.jpg',
      category: 'lunch'
    },
    {
      id: 2,
      name: 'Yam & Egg Sauce',
      price: 1000,
      description: 'Boiled yam served with spicy egg sauce.',
      image: '../images/Yam-and-Egg-Sauce.jpg',
      category: 'breakfast'
    },
    {
      id: 3,
      name: 'Efo Riro',
      price: 1500,
      description: 'Rich spinach stew with assorted meats, served with rice or swallow.',
      image: '../images/vllkyt4avanla6cf5.jpg',
      category: 'lunch'
    },
    {
      id: 4,
      name: 'Moi Moi',
      price: 800,
      description: 'Steamed bean pudding, perfect as a side or main.',
      image: '../images/LOGO.jpeg',
      category: 'snacks'
    },
    {
      id: 5,
      name: 'Fried Rice',
      price: 1200,
      description: 'Nigerian fried rice with mixed veggies and chicken.',
      image: '../images/LOGO.jpeg',
      category: 'lunch'
    },
    {
      id: 6,
      name: 'Pounded Yam & Egusi',
      price: 1800,
      description: 'Soft pounded yam served with rich egusi soup.',
      image: '../images/LOGO.jpeg',
      category: 'dinner'
    }
  ];
}

// Load menu items
function loadMenuItems() {
    const menuItemsContainer = document.querySelector('.menu-items');
    
    if (!menuItemsContainer) return;
    
    menuItemsContainer.innerHTML = '';
    
    const menuItems = getMenuItemsForUser();
    
    menuItems.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuItemsContainer.appendChild(menuItemElement);
    });
    
    // Add event listeners to add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
    
    // Add event listeners to favorite buttons
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            toggleFavorite(itemId);
            this.classList.toggle('active');
        });
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-category', item.category);
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-title">${item.name}</h3>
                <div class="menu-item-price">₦${item.price.toLocaleString()}</div>
            </div>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-actions">
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                <button class="favorite-btn" data-id="${item.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return menuItem;
}

// Filter menu items by category
function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Cart functionality
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCartItems(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function addToCart(itemId) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }
    
    const cart = getCartItems();
    const item = getMenuItemsForUser().find(item => item.id === itemId);
    
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    saveCartItems(cart);
    
    // Open cart preview
    const cartPreview = document.getElementById('cartPreview');
    if (cartPreview) {
        cartPreview.classList.add('open');
    }
}

function updateCartDisplay() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotal) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₦0.00';
        return;
    }
    
    let total = 0;
    
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `₦${total.toLocaleString()}`;
    
    // Add event listeners to quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(itemId, -1);
        });
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(itemId, 1);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeCartItem(itemId);
        });
    });
}

function updateCartItemQuantity(itemId, change) {
    const cart = getCartItems();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    saveCartItems(cart);
}

function removeCartItem(itemId) {
    const cart = getCartItems();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCartItems(updatedCart);
}

function clearCartItems() {
    localStorage.removeItem('cart');
    updateCartDisplay();
}

// Favorites functionality
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(itemId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(itemId);
    
    if (index === -1) {
        favorites.push(itemId);
    } else {
        favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
}

// Login functionality
function login(username, password) {
    // In a real application, you would validate credentials against a database
    // For now, we'll use hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('user', JSON.stringify({
            username: username,
            name: 'Admin User',
            role: 'admin'
        }));
        return true;
    } else if (username === 'user' && password === 'user123') {
        sessionStorage.setItem('user', JSON.stringify({
            username: username,
            name: 'Regular User',
            role: 'user'
        }));
        return true;
    }
    
    return false;
}

function isLoggedIn() {
    return sessionStorage.getItem('user') !== null;
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Check if user is logged in
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Check if user is admin
function checkAdmin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    if (user.role !== 'admin') {
        window.location.href = 'index.html';
    }
}

// Display user information in the header
function displayUserInfo() {
    if (isLoggedIn()) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userFullName = document.getElementById('userFullName');
        const userRole = document.getElementById('userRole');
        const userDepartment = document.getElementById('userDepartment');
        const adminDashboardLink = document.getElementById('adminDashboardLink');
        
        if (userNameDisplay) {
            userNameDisplay.textContent = user.name ? user.name.split(' ')[0] : user.username;
        }
        
        if (userFullName) {
            userFullName.textContent = user.name || user.username;
        }
        
        if (userRole) {
            userRole.textContent = user.role === 'admin' ? 'Administrator' : 'Staff Member';
        }
        
        if (userDepartment) {
            userDepartment.textContent = user.department || 'Union Bank';
        }
        
        // Show admin dashboard link for admin users
        if (adminDashboardLink && user.role === 'admin') {
            adminDashboardLink.style.display = 'flex';
        }
        
        // Load quick order items if on home page
        if (document.getElementById('quickOrderItems')) {
            loadQuickOrderItems();
        }
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Quick Order functionality
function loadQuickOrderItems() {
    const quickOrderItems = document.getElementById('quickOrderItems');
    const emptyQuickOrder = document.getElementById('emptyQuickOrder');
    
    // Get user's order history or frequently ordered items
    // For demo purposes, we'll use a few sample items
    const frequentItems = getFrequentlyOrderedItems();
    
    if (frequentItems.length > 0) {
        // Hide the empty state
        if (emptyQuickOrder) {
            emptyQuickOrder.style.display = 'none';
        }
        
        // Create elements for each frequent item
        frequentItems.forEach(item => {
            const itemElement = createQuickOrderItem(item);
            quickOrderItems.appendChild(itemElement);
        });
    }
}

function getFrequentlyOrderedItems() {
    // In a real application, this would fetch from the server
    // For demo purposes, we'll return some sample items
    return [
        {
            id: 3,
            name: 'Jollof Rice & Chicken',
            price: 1500,
            image: '../images/jollof-rice.jpg'
        },
        {
            id: 7,
            name: 'Chicken Sandwich',
            price: 1200,
            image: '../images/sandwich.jpg'
        },
        {
            id: 12,
            name: 'Fruit Salad',
            price: 800,
            image: '../images/fruit-salad.jpg'
        }
    ];
}

function createQuickOrderItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'quick-order-item';
    
    // Use a placeholder image if the image is not available
    const imageSrc = item.image || 'https://via.placeholder.com/80';
    
    itemElement.innerHTML = `
        <img src="${imageSrc}" alt="${item.name}">
        <div class="quick-order-item-name">${item.name}</div>
        <div class="quick-order-item-price">₦${item.price.toLocaleString()}</div>
        <button class="quick-order-btn" onclick="quickAddToCart(${item.id})">
            <i class="fas fa-bolt"></i> Quick Order
        </button>
    `;
    
    return itemElement;
}

function quickAddToCart(itemId) {
    // Add the item to cart and show a confirmation
    addToCart(itemId);
    
    // Show a notification
    showNotification('Item added to cart', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to the document
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after a delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
