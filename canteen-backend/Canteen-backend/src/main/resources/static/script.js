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
                window.location.href = 'checkout.html';
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

let menuItems = [];

// Load menu items from backend
async function loadMenuItems() {
    const menuItemsContainer = document.querySelector('.menu-items');
    if (!menuItemsContainer) return;
    menuItemsContainer.innerHTML = '<div style="text-align:center;padding:2em;">Loading menu...</div>';
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Could not fetch menu items');
        const data = await response.json();
        // Only show available items
        menuItems = data.filter(item => item.available);
        menuItemsContainer.innerHTML = '';
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
    } catch (error) {
        menuItemsContainer.innerHTML = '<div style="text-align:center;color:red;">Failed to load menu. Please try again later.</div>';
        console.error('Error loading menu:', error);
    }
}

// Create menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-category', item.category);
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.imageUrl}" alt="${item.name}">
        </div>
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-title">${item.name}</h3>
                <div class="menu-item-price">₦${item.price.toLocaleString()}</div>
            </div>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-actions">
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
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
    const item = menuItems.find(item => item.id === itemId);
    
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.imageUrl,
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
    // Use IDs of frequent items that exist in menuItems
    const frequentIds = [1, 7, 8]; // Adjust these IDs as needed
    return menuItems.filter(item => frequentIds.includes(item.id));
}

function createQuickOrderItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'quick-order-item';
    
    // Use a placeholder image if the image is not available
    const imageSrc = item.imageUrl || 'https://via.placeholder.com/80';
    
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
