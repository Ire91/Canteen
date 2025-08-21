/**
 * Union Bank Canteen - Login Functionality
 * Handles user authentication with the backend server
 */

// API configuration
const API_BASE_URL = 'http://localhost:8082/api';
const AUTH_ENDPOINT = `${API_BASE_URL}/auth/login`;

// DOM Elements
let loginForm, loginButton, togglePassword, passwordInput, rememberMe, loadingOverlay;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing login page...');
    
    // Initialize elements
    loginForm = document.getElementById('loginForm');
    loginButton = document.getElementById('loginButton');
    togglePassword = document.getElementById('togglePassword');
    passwordInput = document.getElementById('password');
    rememberMe = document.getElementById('rememberMe');
    loadingOverlay = document.getElementById('loadingOverlay');

    // Initialize theme
    initializeTheme();

    // Clear any existing auth state if we're on the login page
    if (window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/login')) {
        console.log('On login page, clearing any existing auth state...');
        clearAuthState();
    }

    // Setup event listeners
    setupEventListeners();
    
    // Check authentication status
    checkAuth();
    
    // Hide loading overlay after page is fully loaded
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    // Add input listeners to clear error messages
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', clearErrorMessage);
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', clearErrorMessage);
    }
    
    console.log('Login page initialization complete');
});

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Safely sets the error message if the element exists
 */
function setErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = message ? 'block' : 'none';
        errorMessage.setAttribute('role', 'alert');
        if (message) {
            // Auto-hide after 5 seconds
            if (errorMessage._timeout) clearTimeout(errorMessage._timeout);
            errorMessage._timeout = setTimeout(() => {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
            }, 5000);
        } else {
            if (errorMessage._timeout) clearTimeout(errorMessage._timeout);
        }
    }
}

function clearErrorMessage() {
    setErrorMessage('');
}

/**
 * Handles the login form submission
 * @param {Event} event - The form submission event
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginButton = document.getElementById('loginButton');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Reset error message
    setErrorMessage('');
    
    // Show loading state
    loadingOverlay.style.display = 'flex';
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    
    // Basic validation
    if (!username || !password) {
        setErrorMessage('Please enter both username and password');
        setLoading(false);
        return;
    }
    
    try {
        // Show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        
        console.log('Sending login request...');
        console.log('Request body:', { username, password: '***' });
        
        // Call the login API
        let data;
        try {
            const response = await fetch('http://localhost:8082/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    username: username,
                    password: password
                })
            });

            // Try to parse JSON, even for error responses
            try {
                data = await response.json();
            } catch (jsonErr) {
                data = {};
            }

            if (!response.ok) {
                setErrorMessage(data.message || 'Login failed');
                console.log('Error message to display:', data.message);
                setLoading(false);
                return;
            }
            
            // Store tokens
            storeAuthData(data, rememberMe);

            // Fetch user info using access token
            const accessToken = data.token; // <-- FIXED: use 'token' from backend response
            let userInfo;
            try {
                const userInfoResponse = await fetch('http://localhost:8082/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                userInfo = await userInfoResponse.json();
                if (!userInfoResponse.ok) {
                    throw new Error(userInfo.message || 'Failed to fetch user info');
                }
            } catch (err) {
                setErrorMessage('Failed to fetch user info after login');
                setLoading(false);
                return;
            }

            // Store user info in storage
            const storage = rememberMe ? localStorage : sessionStorage;
            const user = {
                username: userInfo.username,
                roles: [userInfo.role], // role is a string, wrap in array for consistency
                name: userInfo.name || userInfo.username
            };
            storage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            if (userInfo.role && userInfo.role.toLowerCase() === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
            
        } catch (networkErr) {
            setErrorMessage('Network error. Please try again.');
            setLoading(false);
            return;
        }
    } catch (error) {
        console.error('Login error:', error);
        setErrorMessage(error.message || 'An error occurred during login');
        showStatusMessage(error.message || 'An error occurred during login', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Stores authentication data in the appropriate storage
 * @param {Object} data - The authentication response data
 * @param {boolean} remember - Whether to use localStorage (true) or sessionStorage (false)
 */
function storeAuthData(data, remember) {
    const storage = remember ? localStorage : sessionStorage;
    
    // Store tokens
    storage.setItem('accessToken', data.token); // <-- FIXED: use 'token' from backend response
    storage.setItem('refreshToken', data.refreshToken);
    
    // Store user data
    const user = {
        username: data.username,
        roles: data.roles || [],
        name: data.name || data.username
    };
    storage.setItem('user', JSON.stringify(user));
    
    // Store authentication method
    storage.setItem('authMethod', remember ? 'local' : 'session');
}

/**
 * Sets the loading state of the form
 * @param {boolean} isLoading - Whether the form is loading
 */
function setLoading(isLoading) {
    if (loadingOverlay) {
        loadingOverlay.style.display = isLoading ? 'flex' : 'none';
    }
    
    if (loginButton) {
        loginButton.disabled = isLoading;
        loginButton.innerHTML = isLoading 
            ? '<i class="fas fa-spinner fa-spin"></i> Signing in...' 
            : 'Sign In';
    }
}

/**
 * Shows a status message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showStatusMessage(message, type = 'info') {
    const statusMessage = document.getElementById('statusMessage');
    if (!statusMessage) return;
    
    // Clear any existing timeout
    if (statusMessage.timeoutId) {
        clearTimeout(statusMessage.timeoutId);
    }
    
    // Set message and styles
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide after delay (longer for errors)
    const delay = type === 'error' ? 10000 : 5000;
    statusMessage.timeoutId = setTimeout(hideStatusMessage, delay);
}

/**
 * Hides the status message
 */
function hideStatusMessage() {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.style.display = 'none';
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
        
        // Clear any existing timeout
        if (statusMessage.timeoutId) {
            clearTimeout(statusMessage.timeoutId);
            delete statusMessage.timeoutId;
        }
    }
}

/**
 * Initializes the theme based on user preference
 */
function initializeTheme() {
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let savedTheme = localStorage.getItem('theme');
    
    // If no saved theme, use system preference
    if (!savedTheme) {
        savedTheme = prefersDarkScheme ? 'dark' : 'light';
        localStorage.setItem('theme', savedTheme);
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    updateThemeIcon(newTheme);
    
    // Show feedback
    showStatusMessage(`Switched to ${newTheme} mode`, 'success');
}

/**
 * Updates the theme toggle icon based on current theme
 * @param {string} theme - The current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    
    // Toggle between sun and moon icons
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggle.setAttribute('title', 'Switch to light mode');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggle.setAttribute('title', 'Switch to dark mode');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

/**
 * Clears any existing authentication state
 */
function clearAuthState() {
    console.log('Clearing authentication state...');
    // Clear all auth-related data from both storage locations
    ['user', 'accessToken', 'refreshToken', 'authMethod'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });    
    // Clear any auth headers
    if (window.axios && window.axios.defaults) {
        delete window.axios.defaults.headers.common['Authorization'];
    }
    delete window.authToken;
}

/**
 * Checks if user is already authenticated and redirects if needed
 */
function checkAuth() {
    // Skip auth check if we're on the login page
    if (window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/login')) {
        console.log('On login page, skipping auth check');
        return;
    }
    
    console.log('Checking authentication status...');
    
    // Check for user data in both storage locations
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const localToken = localStorage.getItem('accessToken');
    const sessionToken = sessionStorage.getItem('accessToken');
    
    console.log('Local storage - user:', localUser ? 'exists' : 'not found');
    console.log('Session storage - user:', sessionUser ? 'exists' : 'not found');
    console.log('Local storage - token:', localToken ? 'exists' : 'not found');
    console.log('Session storage - token:', sessionToken ? 'exists' : 'not found');
    
    // Only redirect if both user and token exist in the same storage
    if ((localUser && localToken) || (sessionUser && sessionToken)) {
        console.log('User is already authenticated, redirecting to dashboard...');
        // Set auth header for future requests
        if (localToken) {
            setAuthHeader(localToken);
        } else if (sessionToken) {
            setAuthHeader(sessionToken);
        }
        // Small timeout to allow console logs to be visible
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    } else {
        console.log('User is not authenticated, showing login form');
        // Clear any existing auth state
        clearAuthState();
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.endsWith('/login')) {
            window.location.href = 'login.html';
        } else {
            // Ensure login form is visible
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.style.display = 'block';
            }
            // Hide loading overlay if it's still showing
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }
    }
}
