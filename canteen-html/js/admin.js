// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard initialized');
    
    // Initialize theme
    initializeTheme();
    
    // Load initial data
    loadMenuItems();
    loadOrders();
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up sidebar toggle for mobile
    setupSidebarToggle();

    // Attach Add Menu Item button event listener on page load
    attachAddMenuItemBtnListener();
});

// Initialize theme based on user preference or system setting
function initializeTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle button icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Add event listener to toggle theme
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button icon
            this.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
    
    // Set admin user information
    setAdminUserInfo();
}

// Set admin user information including name and avatar
function setAdminUserInfo() {
    if (isLoggedIn()) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const adminNameElement = document.getElementById('headerAdminName');
        const adminAvatarElement = document.getElementById('headerAdminAvatar');
        
        if (adminNameElement) {
            const displayName = user.firstName ? `${user.firstName} ${user.lastName}` : user.username;
            adminNameElement.textContent = displayName;
        }
        
        if (adminAvatarElement && adminAvatarElement.querySelector('span')) {
            // Set the avatar initial based on the user's name
            const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 
                          (user.username ? user.username.charAt(0).toUpperCase() : 'A');
            adminAvatarElement.querySelector('span').textContent = initial;
        }
    }
}

// Tab navigation functionality
function setupTabNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const contentSections = document.querySelectorAll('.admin-content');
    const pageTitle = document.getElementById('pageTitle');
    
    console.log('Found nav items:', navItems.length);
    console.log('Found content sections:', contentSections.length);
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('Clicked on tab:', tabId);
            
            // Update active tab
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected content
            contentSections.forEach(section => {
                if (section.id === tabId) {
                    section.classList.add('active');
                    console.log('Activated section:', tabId);
                    // Update page title
                    if (pageTitle) {
                        pageTitle.textContent = section.querySelector('h2').textContent;
                    }
                    // Attach Add Menu Item button event listener if menu-management tab is activated
                    if (tabId === 'menu-management') {
                        setupMenuManagement(); // Call setupMenuManagement here
                    }
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
    
    // View all links
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            const tabElement = document.querySelector(`.sidebar-nav li[data-tab="${tabId}"]`);
            if (tabElement) {
                tabElement.click();
            }
        });
    });
}

// Display admin user information - REMOVED to prevent duplicate display
// This function was causing the admin user to be displayed twice


// Setup event listeners

function setupEventListeners() {
    // Admin logout
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Menu management
    setupMenuManagement();
    
    // Order management
    setupOrderManagement();
    
    // User management
    setupUserManagement();
    
    // Reports
    setupReports();
    
    // Modal close buttons
    const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
}

// Menu Management
function setupMenuManagement() {
    // Category filter
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            categoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterMenuItemsByCategory(category);
        });
    });
    
    // Add menu item button
    const addMenuItemBtn = document.getElementById('addMenuItemBtn');
    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', function() {
            openModal('addMenuItemModal');
        });
    }
    
    // Add menu item form
    const addMenuItemForm = document.getElementById('addMenuItemForm');
    if (addMenuItemForm) {
        addMenuItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addMenuItem();
        });
    }
}

// Load menu items
function loadMenuItems() {
    console.log('Loading menu items...');
    const menuItemsGrid = document.getElementById('menuItemsGrid');
    if (!menuItemsGrid) {
        console.error('Menu items grid not found!');
        return;
    }
    
    // Clear existing items
    menuItemsGrid.innerHTML = '';
    
    // Get menu items
    const menuItems = getMenuItems();
    console.log('Retrieved menu items:', menuItems.length);
    
    // Add items as cards
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-category', item.category);
        
        // Truncate description if too long
        const shortDescription = item.description.length > 100 
            ? item.description.substring(0, 100) + '...' 
            : item.description;
        
        card.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/300x180'}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-details">
                <div class="menu-item-header">
                    <div>
                        <h3 class="menu-item-name">${item.name}</h3>
                        <p class="menu-item-category">${getCategoryLabel(item.category)}</p>
                    </div>
                    <div class="menu-item-price">₦${item.price.toLocaleString()}</div>
                </div>
                <p class="menu-item-description">${shortDescription}</p>
                <div class="menu-item-footer">
                    <span class="status-badge ${item.available ? 'completed' : 'cancelled'}">
                        ${item.available ? 'Available' : 'Unavailable'}
                    </span>
                    <div class="menu-item-actions">
                        <button class="action-btn edit-btn" onclick="editMenuItem(${item.id})" title="Edit Item">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteMenuItem(${item.id})" title="Delete Item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        menuItemsGrid.appendChild(card);
    });
    
    console.log('Menu items loaded successfully');
    
    // Make sure the Add New Item button is visible and working
    const addMenuItemBtn = document.getElementById('addMenuItemBtn');
    if (addMenuItemBtn) {
        console.log('Add Menu Item button found');
        // Ensure it has the click event
        addMenuItemBtn.addEventListener('click', function() {
            console.log('Add Menu Item button clicked');
            openModal('addMenuItemModal');
        });
    } else {
        console.error('Add Menu Item button not found!');
    }
}

// Filter menu items by category
function filterMenuItemsByCategory(category) {
    const menuItems = document.querySelectorAll('.menu-item-card');
    
    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show message if no items in category
    const visibleItems = document.querySelectorAll('.menu-item-card[style=""]');
    const menuItemsGrid = document.getElementById('menuItemsGrid');
    
    if (visibleItems.length === 0 && menuItemsGrid) {
        const noItemsMessage = document.createElement('div');
        noItemsMessage.className = 'no-items-message';
        noItemsMessage.innerHTML = `
            <i class="fas fa-utensils"></i>
            <p>No items found in this category</p>
        `;
        menuItemsGrid.appendChild(noItemsMessage);
    } else {
        const existingMessage = document.querySelector('.no-items-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Get menu items
function getMenuItems() {
    // Try to get menu items from localStorage
    const storedItems = localStorage.getItem('menuItems');
    
    if (storedItems) {
        try {
            return JSON.parse(storedItems);
        } catch (error) {
            console.error('Error parsing stored menu items:', error);
            // If there's an error, fall back to default items
        }
    }
    
    // Default menu items if none in localStorage
    const defaultItems = [
        {
            id: 1,
            name: 'Jollof Rice & Chicken',
            category: 'main',
            price: 1500,
            description: 'Spicy jollof rice served with grilled chicken',
            image: '../images/jollof-rice.jpg',
            available: true
        },
        {
            id: 2,
            name: 'Fried Rice & Fish',
            category: 'main',
            price: 1800,
            description: 'Delicious fried rice served with grilled fish',
            image: '../images/fried-rice.jpg',
            available: true
        },
        {
            id: 3,
            name: 'Egusi Soup & Pounded Yam',
            category: 'main',
            price: 2000,
            description: 'Traditional egusi soup served with pounded yam',
            image: '../images/egusi-soup.jpg',
            available: true
        },
        {
            id: 4,
            name: 'Moin Moin',
            category: 'sides',
            price: 500,
            description: 'Steamed bean pudding',
            image: '../images/moin-moin.jpg',
            available: true
        },
        {
            id: 5,
            name: 'Chicken Sandwich',
            category: 'main',
            price: 1200,
            description: 'Grilled chicken sandwich with lettuce and tomatoes',
            image: '../images/sandwich.jpg',
            available: true
        },
        {
            id: 6,
            name: 'Fruit Salad',
            category: 'desserts',
            price: 800,
            description: 'Fresh fruit salad with yogurt',
            image: '../images/fruit-salad.jpg',
            available: true
        },
        {
            id: 7,
            name: 'Chapman',
            category: 'drinks',
            price: 600,
            description: 'Refreshing chapman drink',
            image: '../images/chapman.jpg',
            available: false
        }
    ];
    
    // Store default items in localStorage for future use
    localStorage.setItem('menuItems', JSON.stringify(defaultItems));
    
    return defaultItems;
}

// Get category label
function getCategoryLabel(category) {
    const categories = {
        'main': 'Main Dish',
        'sides': 'Side Dish',
        'drinks': 'Drink',
        'desserts': 'Dessert'
    };
    
    return categories[category] || category;
}

// Add menu item
function addMenuItem() {
    const form = document.getElementById('addMenuItemForm');
    if (!form) return;
    
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const description = document.getElementById('itemDescription').value.trim();
    const imageUrl = document.getElementById('itemImage').value.trim();
    const available = document.getElementById('itemAvailable').checked;
    
    // Validate form
    let hasErrors = false;
    let errorMessage = '';
    
    if (!name) {
        hasErrors = true;
        errorMessage += 'Item name is required. ';
        highlightField('itemName');
    }
    
    if (!category) {
        hasErrors = true;
        errorMessage += 'Category is required. ';
        highlightField('itemCategory');
    }
    
    if (isNaN(price) || price <= 0) {
        hasErrors = true;
        errorMessage += 'Price must be a positive number. ';
        highlightField('itemPrice');
    }
    
    if (!description) {
        hasErrors = true;
        errorMessage += 'Description is required. ';
        highlightField('itemDescription');
    }
    
    if (hasErrors) {
        showNotification(errorMessage, 'error');
        return;
    }
    
    // Get existing menu items to determine new ID
    const menuItems = getMenuItems();
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    
    // Create new menu item
    const newItem = {
        id: newId,
        name: name,
        category: category,
        price: price,
        description: description,
        image: imageUrl || 'https://via.placeholder.com/50',
        available: available
    };
    
    // In a real application, this would send data to the server
    // For demo purposes, we'll add it to our local array and update localStorage
    menuItems.push(newItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Close modal
    closeAllModals();
    
    // Show success message
    showNotification(`Menu item "${name}" added successfully`, 'success');
    
    // Reset form
    form.reset();
    resetFieldHighlights();
    
    // Reload menu items
    loadMenuItems();
}

// Highlight field with error
function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error-field');
        field.addEventListener('input', function() {
            this.classList.remove('error-field');
        }, { once: true });
    }
}

// Reset field highlights
function resetFieldHighlights() {
    const fields = document.querySelectorAll('.error-field');
    fields.forEach(field => {
        field.classList.remove('error-field');
    });
}

// Edit menu item
function editMenuItem(id) {
    // Get the menu item
    const menuItems = getMenuItems();
    const item = menuItems.find(item => item.id === id);
    
    if (!item) {
        showNotification('Menu item not found', 'error');
        return;
    }
    
    // Get the form
    const form = document.getElementById('addMenuItemForm');
    if (!form) return;
    
    // Update modal title
    const modalTitle = document.querySelector('#addMenuItemModal .modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Menu Item';
    }
    
    // Update submit button text
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Update Item';
    }
    
    // Fill form with item data
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemImage').value = item.image;
    document.getElementById('itemAvailable').checked = item.available;
    
    // Store item ID in form for reference
    form.setAttribute('data-edit-id', id);
    
    // Update form submission handler
    form.onsubmit = function(e) {
        e.preventDefault();
        updateMenuItem(id);
    };
    
    // Open modal
    openModal('addMenuItemModal');
}

// Update menu item
function updateMenuItem(id) {
    const form = document.getElementById('addMenuItemForm');
    if (!form) return;
    
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const description = document.getElementById('itemDescription').value.trim();
    const imageUrl = document.getElementById('itemImage').value.trim();
    const available = document.getElementById('itemAvailable').checked;
    
    // Validate form
    let hasErrors = false;
    let errorMessage = '';
    
    if (!name) {
        hasErrors = true;
        errorMessage += 'Item name is required. ';
        highlightField('itemName');
    }
    
    if (!category) {
        hasErrors = true;
        errorMessage += 'Category is required. ';
        highlightField('itemCategory');
    }
    
    if (isNaN(price) || price <= 0) {
        hasErrors = true;
        errorMessage += 'Price must be a positive number. ';
        highlightField('itemPrice');
    }
    
    if (!description) {
        hasErrors = true;
        errorMessage += 'Description is required. ';
        highlightField('itemDescription');
    }
    
    if (hasErrors) {
        showNotification(errorMessage, 'error');
        return;
    }
    
    // Get menu items
    const menuItems = getMenuItems();
    const itemIndex = menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        showNotification('Menu item not found', 'error');
        return;
    }
    
    // Update menu item
    menuItems[itemIndex] = {
        ...menuItems[itemIndex],
        name: name,
        category: category,
        price: price,
        description: description,
        image: imageUrl || 'https://via.placeholder.com/50',
        available: available
    };
    
    // Save updated menu items
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Reset form
    form.reset();
    resetFieldHighlights();
    form.removeAttribute('data-edit-id');
    
    // Reset form submission handler
    form.onsubmit = function(e) {
        e.preventDefault();
        addMenuItem();
    };
    
    // Reset modal title
    const modalTitle = document.querySelector('#addMenuItemModal .modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Menu Item';
    }
    
    // Reset submit button text
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Add Item';
    }
    
    // Close modal
    closeAllModals();
    
    // Show success message
    showNotification(`Menu item "${name}" updated successfully`, 'success');
    
    // Reload menu items
    loadMenuItems();
}

// Delete menu item
function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
        return;
    }
    
    // Get menu items
    const menuItems = getMenuItems();
    const itemIndex = menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        showNotification('Menu item not found', 'error');
        return;
    }
    
    // Get item name for notification
    const itemName = menuItems[itemIndex].name;
    
    // Remove item from array
    menuItems.splice(itemIndex, 1);
    
    // Save updated menu items
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Show success message
    showNotification(`Menu item "${itemName}" deleted successfully`, 'success');
    
    // Reload menu items
    loadMenuItems();
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Menu category filter
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter
            categoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            filterMenuItemsByCategory(category);
        });
    });
    
    // Order status filter
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            filterOrdersByStatus(this.value);
        });
    }
    
    // Order date filter
    const orderDateFilter = document.getElementById('orderDateFilter');
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', function() {
            filterOrdersByDate(this.value);
        });
    }
    
    // Refresh orders button
    const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', loadOrders);
    }
}

// Setup sidebar toggle for all screen sizes
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const container = document.querySelector('.admin-container');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle && sidebar) {
        // Toggle sidebar when hamburger button is clicked
        sidebarToggle.addEventListener('click', function() {
            console.log('Sidebar toggle clicked');
            sidebar.classList.toggle('active');
            
            // Toggle the container class for desktop layout
            if (container) {
                container.classList.toggle('sidebar-visible');
            }
            
            // Toggle overlay for mobile
            if (overlay) {
                overlay.classList.toggle('active');
            }
            
            // Prevent scrolling when sidebar is open on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            }
            
            // Update toggle button icon
            this.innerHTML = sidebar.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close sidebar when overlay is clicked
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            if (container) {
                container.classList.remove('sidebar-visible');
            }
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Update toggle button icon
            if (sidebarToggle) {
                sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Close sidebar when a menu item is clicked
    const menuItems = document.querySelectorAll('.sidebar-nav li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // On mobile, close the sidebar when a menu item is clicked
            if (window.innerWidth <= 768) {
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                if (container) {
                    container.classList.remove('sidebar-visible');
                }
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
                
                // Update toggle button icon
                if (sidebarToggle) {
                    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
}

// Get orders from storage or return empty array
function getOrders() {
    try {
        const ordersData = localStorage.getItem('orders');
        if (ordersData) {
            return JSON.parse(ordersData);
        }
    } catch (error) {
        console.error('Error retrieving orders:', error);
    }
    return [];
}

// Create sample orders for demonstration
function createSampleOrders() {
    const sampleOrders = [
        {
            id: 1001,
            customer: 'John Doe',
            department: 'Finance',
            date: new Date().toISOString(),
            status: 'completed',
            total: 3500,
            items: [
                { id: 1, name: 'Jollof Rice', price: 1500, quantity: 1 },
                { id: 2, name: 'Chicken', price: 2000, quantity: 1 }
            ]
        },
        {
            id: 1002,
            customer: 'Jane Smith',
            department: 'HR',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            status: 'pending',
            total: 2000,
            items: [
                { id: 3, name: 'Fried Rice', price: 1500, quantity: 1 },
                { id: 4, name: 'Beef', price: 500, quantity: 1 }
            ]
        },
        {
            id: 1003,
            customer: 'Michael Johnson',
            department: 'IT',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'processing',
            total: 4500,
            items: [
                { id: 5, name: 'Sandwich', price: 1200, quantity: 2 },
                { id: 6, name: 'Fruit Salad', price: 800, quantity: 1 },
                { id: 7, name: 'Coffee', price: 500, quantity: 2 }
            ]
        }
    ];
    
    // Save to localStorage for persistence
    try {
        localStorage.setItem('orders', JSON.stringify(sampleOrders));
    } catch (error) {
        console.error('Error saving sample orders:', error);
    }
    
    return sampleOrders;
}

// Helper function to get status label
function getStatusLabel(status) {
    const statusLabels = {
        'pending': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusLabels[status] || 'Unknown';
}

// Order Management
function setupOrderManagement() {
    // Status filter
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            filterOrdersByStatus(this.value);
        });
    }
    
    // Date filter
    const orderDateFilter = document.getElementById('orderDateFilter');
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', function() {
            filterOrdersByDate(this.value);
        });
    }
    
    // Refresh button
    const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', function() {
            loadOrders();
            showNotification('Orders refreshed', 'info');
        });
    }
    
    // Update order button
    const updateOrderBtn = document.getElementById('updateOrderBtn');
    if (updateOrderBtn) {
        updateOrderBtn.addEventListener('click', function() {
            updateOrder();
        });
    }
    
    // Cancel order button
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', function() {
            cancelOrder();
        });
    }
}

// Load orders
function loadOrders() {
    console.log('Loading orders...');
    const ordersGrid = document.getElementById('ordersGrid');
    if (!ordersGrid) {
        console.error('Orders grid not found!');
        return;
    }

    // Clear existing orders
    ordersGrid.innerHTML = '';

    // Get orders or create sample data if none exists
    let orders = getOrders();
    
    // If no orders or getOrders function doesn't exist, create sample data
    if (!orders || !Array.isArray(orders)) {
        console.log('Creating sample order data');
        orders = createSampleOrders();
    }
    
    console.log('Retrieved orders:', orders.length);

    if (orders.length === 0) {
        const noOrdersMessage = document.createElement('div');
        noOrdersMessage.className = 'no-items-message';
        noOrdersMessage.innerHTML = `
            <i class="fas fa-receipt"></i>
            <p>No orders found</p>
        `;
        ordersGrid.appendChild(noOrdersMessage);
        return;
    }

    // Add orders as cards
    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.setAttribute('data-id', order.id);
        card.setAttribute('data-status', order.status);
        card.setAttribute('data-date', order.date);

        // Format date
        const orderDate = new Date(order.date || new Date());
        const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Safely access properties with null checks
        const customerName = order.customer || 'Unknown Customer';
        const customerDept = order.department || 'N/A';
        const orderTotal = order.total ? `₦${order.total.toLocaleString()}` : 'N/A';
        const orderStatus = order.status || 'pending';
        const orderItems = order.items && Array.isArray(order.items) ? order.items : [];
        
        // Format items text safely
        let itemsText = 'No items';
        if (orderItems.length > 0) {
            if (orderItems.length > 2) {
                const item1 = orderItems[0].name || 'Item 1';
                const item2 = orderItems[1].name || 'Item 2';
                itemsText = `${item1}, ${item2} +${orderItems.length - 2} more`;
            } else {
                itemsText = orderItems.map(item => item.name || 'Unnamed Item').join(', ');
            }
        }
        
        card.innerHTML = `
            <div class="order-header">
                <div class="order-id">#${order.id}</div>
                <span class="status-badge ${orderStatus}">${getStatusLabel(orderStatus)}</span>
            </div>
            <div class="order-details">
                <div class="order-customer">
                    <div class="order-customer-name">${customerName}</div>
                    <div class="order-customer-dept">${customerDept}</div>
                </div>
                <div class="order-info">
                    <div class="order-info-item">
                        <span class="order-info-label">Date & Time</span>
                        <span class="order-info-value">${formattedDate}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="order-info-label">Total</span>
                        <span class="order-info-value">${orderTotal}</span>
                    </div>
                </div>
                <div class="order-items-count">
                    <i class="fas fa-utensils"></i> ${orderItems.length} item(s): ${itemsText}
                </div>
                <div class="order-footer">
                    <div class="order-actions">
                        <button class="action-btn view-btn" onclick="viewOrder(${order.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="updateOrderStatus(${order.id})" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="cancelOrder(${order.id})" title="Cancel Order">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        ordersGrid.appendChild(card);
    });

    console.log('Orders loaded successfully');
}

// Filter orders by status
function filterOrdersByStatus(status) {
    const orders = document.querySelectorAll('.order-card');
    
    orders.forEach(order => {
        if (status === 'all' || order.getAttribute('data-status') === status) {
            order.style.display = '';
        } else {
            order.style.display = 'none';
        }
    });
    
    // Show message if no orders with selected status
    const visibleOrders = document.querySelectorAll('.order-card[style=""]');
    const ordersGrid = document.getElementById('ordersGrid');
    
    if (visibleOrders.length === 0 && ordersGrid) {
        const noOrdersMessage = document.querySelector('.no-items-message');
        if (!noOrdersMessage) {
            const newMessage = document.createElement('div');
            newMessage.className = 'no-items-message';
            newMessage.innerHTML = `
                <i class="fas fa-receipt"></i>
                <p>No orders found with ${status === 'all' ? 'any' : status} status</p>
            `;
            ordersGrid.appendChild(newMessage);
        }
    } else {
        const existingMessage = document.querySelector('.no-items-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Filter orders by date
function filterOrdersByDate(date) {
    const orders = document.querySelectorAll('.order-card');
    
    if (!date) {
        // If no date selected, show all
        orders.forEach(order => {
            order.style.display = '';
        });
        
        // Remove any 'no orders' message
        const existingMessage = document.querySelector('.no-items-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        return;
    }
    
    // Format selected date to YYYY-MM-DD for comparison
    const selectedDate = new Date(date);
    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
    
    orders.forEach(order => {
        const orderDate = order.getAttribute('data-date');
        const formattedOrderDate = new Date(orderDate).toISOString().split('T')[0];
        
        if (formattedOrderDate === formattedSelectedDate) {
            order.style.display = '';
        } else {
            order.style.display = 'none';
        }
    });
    
    // Show message if no orders on selected date
    const visibleOrders = document.querySelectorAll('.order-card[style=""]');
    const ordersGrid = document.getElementById('ordersGrid');
    
    if (visibleOrders.length === 0 && ordersGrid) {
        const noOrdersMessage = document.querySelector('.no-items-message');
        if (!noOrdersMessage) {
            const newMessage = document.createElement('div');
            newMessage.className = 'no-items-message';
            const formattedDateForDisplay = selectedDate.toLocaleDateString();
            newMessage.innerHTML = `
                <i class="fas fa-calendar-times"></i>
                <p>No orders found for ${formattedDateForDisplay}</p>
            `;
            ordersGrid.appendChild(newMessage);
        }
    } else {
        const existingMessage = document.querySelector('.no-items-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Get orders
function getOrders() {
    // Try to get orders from localStorage
    const storedOrders = localStorage.getItem('orders');
    
    if (storedOrders) {
        try {
            return JSON.parse(storedOrders);
        } catch (error) {
            console.error('Error parsing stored orders:', error);
            // If there's an error, fall back to default orders
        }
    }
    
    // Default orders if none in localStorage
    const defaultOrders = [
        {
            id: 'ORD-2025-1234',
            customer: 'John Doe',
            department: 'Finance',
            date: '2025-05-22',
            time: '10:30 AM',
            items: [
                { name: 'Jollof Rice & Chicken', price: 1500, quantity: 1 },
                { name: 'Chapman', price: 600, quantity: 1 },
                { name: 'Fruit Salad', price: 800, quantity: 1 }
            ],
            total: 2900,
            status: 'pending',
            notes: ''
        },
        {
            id: 'ORD-2025-1233',
            customer: 'Jane Smith',
            department: 'HR',
            date: '2025-05-22',
            time: '09:45 AM',
            items: [
                { name: 'Fried Rice & Fish', price: 1800, quantity: 1 },
                { name: 'Moin Moin', price: 500, quantity: 1 },
                { name: 'Chapman', price: 600, quantity: 1 }
            ],
            total: 2900,
            status: 'processing',
            notes: 'No spicy food please'
        },
        {
            id: 'ORD-2025-1232',
            customer: 'Robert Johnson',
            department: 'IT',
            date: '2025-05-21',
            time: '12:15 PM',
            items: [
                { name: 'Chicken Sandwich', price: 1200, quantity: 1 },
                { name: 'Fruit Salad', price: 800, quantity: 1 }
            ],
            total: 2000,
            status: 'completed',
            notes: ''
        },
        {
            id: 'ORD-2025-1231',
            customer: 'Emily Davis',
            department: 'Marketing',
            date: '2025-05-21',
            time: '01:30 PM',
            items: [
                { name: 'Egusi Soup & Pounded Yam', price: 2000, quantity: 1 },
                { name: 'Chapman', price: 600, quantity: 1 },
                { name: 'Fruit Salad', price: 800, quantity: 1 }
            ],
            total: 3400,
            status: 'completed',
            notes: 'Extra meat please'
        },
        {
            id: 'ORD-2025-1230',
            customer: 'Michael Wilson',
            department: 'Operations',
            date: '2025-05-20',
            time: '11:00 AM',
            items: [
                { name: 'Jollof Rice & Chicken', price: 1500, quantity: 1 },
                { name: 'Chapman', price: 600, quantity: 1 }
            ],
            total: 2100,
            status: 'cancelled',
            notes: 'Cancelled by customer'
        }
    ];
    
    // Store default orders in localStorage for future use
    localStorage.setItem('orders', JSON.stringify(defaultOrders));
    
    return defaultOrders;
}

// Get status label
function getStatusLabel(status) {
    const statuses = {
        'pending': 'Pending',
        'processing': 'Processing',
        'ready': 'Ready for Pickup',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    
    return statuses[status] || status;
}

// View order
function viewOrder(id) {
    // In a real application, this would fetch the order from the server
    // For demo purposes, we'll use the sample orders
    const orders = getOrders();
    const order = orders.find(o => o.id === id);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Populate modal with order details
    document.getElementById('orderIdDisplay').textContent = order.id;
    document.getElementById('orderDateDisplay').textContent = `${order.date}, ${order.time}`;
    document.getElementById('orderCustomerDisplay').textContent = order.customer;
    document.getElementById('orderDepartmentDisplay').textContent = order.department;
    document.getElementById('orderStatusSelect').value = order.status;
    document.getElementById('orderTotalDisplay').textContent = `₦${order.total.toLocaleString()}`;
    document.getElementById('orderNotes').value = order.notes;
    
    // Populate order items
    const orderItemsTableBody = document.getElementById('orderItemsTableBody');
    orderItemsTableBody.innerHTML = '';
    
    order.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>${item.quantity}</td>
            <td>₦${(item.price * item.quantity).toLocaleString()}</td>
        `;
        
        orderItemsTableBody.appendChild(row);
    });
    
    // Store order ID in modal for reference
    document.getElementById('orderModal').setAttribute('data-order-id', order.id);
    
    // Open modal
    openModal('orderModal');
}

// Edit order
function editOrder(id) {
    // Same as view order, but with editable fields
    viewOrder(id);
}

// Update order
function updateOrder() {
    const orderModal = document.getElementById('orderModal');
    const orderId = orderModal.getAttribute('data-order-id');
    const newStatus = document.getElementById('orderStatusSelect').value;
    const notes = document.getElementById('orderNotes').value;
    
    // Get orders
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Update order status and notes
    orders[orderIndex].status = newStatus;
    orders[orderIndex].notes = notes;
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Close modal
    closeAllModals();
    
    // Show success message
    showNotification(`Order ${orderId} updated to ${getStatusLabel(newStatus)}`, 'success');
    
    // Reload orders
    loadOrders();
    
    // Update user's order history if they're logged in
    updateUserOrderHistory(orderId, newStatus);
}

// Update user's order history
function updateUserOrderHistory(orderId, newStatus) {
    // In a real application with a server, this would be handled server-side
    // For this demo, we'll update the user's order history in localStorage
    const userOrdersKey = 'userOrders';
    let userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || {};
    
    // Find the order in all user orders
    Object.keys(userOrders).forEach(userId => {
        const userOrderList = userOrders[userId];
        const orderIndex = userOrderList.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            // Update the order status
            userOrderList[orderIndex].status = newStatus;
            userOrders[userId] = userOrderList;
        }
    });
    
    // Save updated user orders
    localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
}

// Cancel order
function cancelOrder() {
    const orderModal = document.getElementById('orderModal');
    const orderId = orderModal.getAttribute('data-order-id');
    
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }
    
    // Get orders
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Update order status to cancelled
    orders[orderIndex].status = 'cancelled';
    orders[orderIndex].notes += '\nCancelled by admin on ' + new Date().toLocaleString();
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Close modal
    closeAllModals();
    
    // Show success message
    showNotification(`Order ${orderId} has been cancelled`, 'success');
    
    // Reload orders
    loadOrders();
    
    // Update user's order history
    updateUserOrderHistory(orderId, 'cancelled');
}

// Cancel order from list
function cancelOrderFromList(id) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }
    
    // Get orders
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Update order status to cancelled
    orders[orderIndex].status = 'cancelled';
    orders[orderIndex].notes += '\nCancelled by admin on ' + new Date().toLocaleString();
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success message
    showNotification(`Order ${id} has been cancelled`, 'success');
    
    // Reload orders
    loadOrders();
    
    // Update user's order history
    updateUserOrderHistory(id, 'cancelled');
}

// User Management
function setupUserManagement() {
    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showNotification('User management functionality would open a form to add a new user', 'info');
        });
    }
}

// Load users
function loadUsers() {
    const usersTableBody = document.getElementById('usersTableBody');
    if (!usersTableBody) return;
    
    // Clear existing users
    usersTableBody.innerHTML = '';
    
    // Get users
    const users = getUsers();
    
    // Add users to table
    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', user.id);
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.department}</td>
            <td>${user.role === 'admin' ? 'Administrator' : 'Staff'}</td>
            <td><span class="status-badge ${user.active ? 'completed' : 'cancelled'}">${user.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn ${user.active ? 'delete-btn' : 'view-btn'}" onclick="toggleUserStatus(${user.id})">
                    <i class="fas ${user.active ? 'fa-user-slash' : 'fa-user-check'}"></i>
                </button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

// Get users
function getUsers() {
    // In a real application, this would fetch from the server
    // For demo purposes, we'll return some sample users
    return [
        {
            id: 1,
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@unionbank.com',
            department: 'IT',
            role: 'admin',
            active: true
        },
        {
            id: 2,
            username: 'jdoe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@unionbank.com',
            department: 'Finance',
            role: 'staff',
            active: true
        },
        {
            id: 3,
            username: 'jsmith',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@unionbank.com',
            department: 'HR',
            role: 'staff',
            active: true
        },
        {
            id: 4,
            username: 'rjohnson',
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.johnson@unionbank.com',
            department: 'IT',
            role: 'staff',
            active: true
        },
        {
            id: 5,
            username: 'edavis',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@unionbank.com',
            department: 'Marketing',
            role: 'staff',
            active: true
        },
        {
            id: 6,
            username: 'mwilson',
            firstName: 'Michael',
            lastName: 'Wilson',
            email: 'michael.wilson@unionbank.com',
            department: 'Operations',
            role: 'staff',
            active: false
        }
    ];
}

// Edit user
function editUser(id) {
    // In a real application, this would fetch the user from the server
    // For demo purposes, we'll just show a success message
    showNotification('Edit functionality would open an edit form for user #' + id, 'info');
}

// Toggle user status
function toggleUserStatus(id) {
    // In a real application, this would send a request to the server
    // For demo purposes, we'll just show a success message
    showNotification('User status toggled successfully', 'success');
    
    // Reload users (in a real app, we would update the user in the list)
    loadUsers();
}

// Reports
function setupReports() {
    // Report type filter
    const reportTypeFilter = document.getElementById('reportTypeFilter');
    if (reportTypeFilter) {
        reportTypeFilter.addEventListener('change', function() {
            updateReportView(this.value, document.getElementById('reportPeriodFilter').value);
        });
    }
    
    // Report period filter
    const reportPeriodFilter = document.getElementById('reportPeriodFilter');
    if (reportPeriodFilter) {
        reportPeriodFilter.addEventListener('change', function() {
            updateReportView(document.getElementById('reportTypeFilter').value, this.value);
        });
    }
    
    // Generate report button
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            const reportType = document.getElementById('reportTypeFilter').value;
            const reportPeriod = document.getElementById('reportPeriodFilter').value;
            
            showNotification(`Generated ${reportPeriod} ${reportType} report`, 'success');
        });
    }
}

// Update report view
function updateReportView(type, period) {
    // In a real application, this would update the chart and summary
    // For demo purposes, we'll just show a message
    showNotification(`Updated report view to ${period} ${type} report`, 'info');
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
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

// Attach Add Menu Item button event listener on page load
function attachAddMenuItemBtnListener() {
    const addMenuItemBtn = document.getElementById('addMenuItemBtn');
    if (addMenuItemBtn) {
        // Remove previous listeners by cloning
        const newBtn = addMenuItemBtn.cloneNode(true);
        addMenuItemBtn.parentNode.replaceChild(newBtn, addMenuItemBtn);
        newBtn.addEventListener('click', function() {
            console.log('Add New Item button clicked');
            openModal('addMenuItemModal');
        });
        console.log('Add New Item button listener attached');
    } else {
        console.log('Add New Item button NOT found when trying to attach listener');
    }
}
