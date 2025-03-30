
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page when loaded
    initPage();
});

function initPage() {
    // Load user data
    loadUserData();
    
    // Initialize shopping cart counter
    updateCartCounter();
    
    // Initialize card hover effects
    initCardHoverEffects();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Protect images from right-click
    disableImageRightClick();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup registration modal
    setupRegisterModal();
    
    // Setup logout button
    setupLogoutButton();
    
    // Setup WhatsApp button
    setupWhatsAppButton();
    
    // Setup product add-to-cart events
    setupProductEvents();

        // Setup navbot buttons
        setupNavbotButtons();
}

// ==================== User Registration System ====================

function setupRegisterModal() {
    const registerBtn = document.getElementById('userRegisterBtn');
    const saveBtn = document.getElementById('saveUserBtn');
    const cancelBtn = document.querySelector('#registerModal .btn-secondary');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    
    // Open registration modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const userData = getUserData();
            
            if (userData) {
                // If user is registered, show their data
                document.getElementById('userName').value = userData.name;
                document.getElementById('phoneNumber').value = userData.phone;
                imagePreview.style.backgroundImage = `url(${userData.avatar})`;
            } else {
                // If not registered, reset form fields
                resetRegisterForm();
            }
            
            registerModal.show();
        });
    }
    
    // Handle image selection
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagePreview.style.backgroundImage = `url(${event.target.result})`;
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    
    // Save user data
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const name = document.getElementById('userName').value.trim();
            const phone = document.getElementById('phoneNumber').value.trim();
            const avatar = imagePreview.style.backgroundImage.replace('url("', '').replace('")', '');
            
            if (validateUserData(name, phone)) {
                const userData = {
                    name: name,
                    phone: phone,
                    avatar: avatar
                };
                
                saveUserData(userData);
                updateUserUI(userData);
                registerModal.hide();
                showToast('Your data has been saved successfully', 'success');
            }
        });
    }
    
    // Cancel registration
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            resetRegisterForm();
        });
    }
}

function validateUserData(name, phone) {
    if (!name) {
        showToast('Please enter your full name', 'error');
        return false;
    }
    
    if (!phone) {
        showToast('Please enter your phone number', 'error');
        return false;
    }
    
    if (!/^[0-9]{10,15}$/.test(phone)) {
        showToast('Invalid phone number format', 'error');
        return false;
    }
    
    return true;
}
// ==================== Logout Functionality ====================

function setupLogoutButton() {
    const logoutBtn = document.getElementById('userLogoutBtn');
    
    if (logoutBtn) {
        // Initially hide the logout button if no user is logged in
        const userData = getUserData();
        logoutBtn.style.display = userData ? 'block' : 'none';
        
        logoutBtn.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem('userData');
            
            // Update UI
            updateUserUI(null);
            
            // Hide the logout button
            logoutBtn.style.display = 'none';
            
            // Show success message
            showToast('تم تسجيل الخروج بنجاح', 'success');
            
            // Close the offcanvas menu if open
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasRight'));
            if (offcanvas) {
                offcanvas.hide();
            }
        });
    }
}

function resetRegisterForm() {
    document.getElementById('userName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('imageUpload').value = '';
    document.getElementById('imagePreview').style.backgroundImage = 'url("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")';
}

function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function loadUserData() {
    const userData = getUserData();
    if (userData) {
        updateUserUI(userData); // This will update all elements including the header icon
    }
}

function updateUserUI(userData) {
    updateHeaderUserIcon(userData); // Update header icon
    
    const registerBtn = document.getElementById('userRegisterBtn');
    const headerRegisterBtn = document.getElementById('headeruserRegisterBtn');
    const userAvatarIcon = document.getElementById('userAvatarIcon');
    const logoutBtn = document.getElementById('userLogoutBtn');
    const headerLogoutBtn = document.getElementById('headeruserLogoutBtn');
    
    if (userData) {
        // Update registration button in sidebar (مع الصورة)
        if (registerBtn) {
            registerBtn.innerHTML = `
                <img src="${userData.avatar}" class="user-avatar-img" alt="User profile">
                <span class="user-name">${userData.name}</span>
            `;
            registerBtn.classList.add('user-logged-in');
        }
        
        // Update registration button in navbot (الاسم فقط بدون صورة)
        if (headerRegisterBtn) {
            headerRegisterBtn.innerHTML = `
                <span class="user-name">${userData.name}</span>
            `;
            headerRegisterBtn.classList.add('user-logged-in');
        }
        
        // Update large icon in sidebar
        if (userAvatarIcon) {
            userAvatarIcon.style.backgroundImage = `url(${userData.avatar})`;
            userAvatarIcon.classList.add('avatar-has-image');
        }
        
        // Show logout buttons
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (headerLogoutBtn) headerLogoutBtn.style.display = 'block';
    } else {
        // Reset if not logged in
        if (registerBtn) {
            registerBtn.innerHTML = 'تسجيل';
            registerBtn.classList.remove('user-logged-in');
        }
        
        if (headerRegisterBtn) {
            headerRegisterBtn.innerHTML = 'تسجيل';
            headerRegisterBtn.classList.remove('user-logged-in');
        }
        
        if (userAvatarIcon) {
            userAvatarIcon.style.backgroundImage = '';
            userAvatarIcon.classList.remove('avatar-has-image');
        }
        
        // Hide logout buttons
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (headerLogoutBtn) headerLogoutBtn.style.display = 'none';
    }
}

function updateHeaderUserIcon(userData) {
    const userIconContainer = document.querySelector('.user');
    if (!userIconContainer) return;
    
    if (userData && userData.avatar) {
        // If user is registered and has an avatar
        userIconContainer.innerHTML = `
            <img src="${userData.avatar}" class="user-avatar-img" alt="User profile">
        `;
        userIconContainer.classList.add('user-has-avatar');
    } else {
        // If not registered or no avatar
        userIconContainer.innerHTML = `
            <i class="bi bi-person-fill"></i>
        `;
        userIconContainer.classList.remove('user-has-avatar');
    }
}

// ==================== Shopping Cart System ====================

function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-counter').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function addToCart(productId, productName, price = 0) {
    let cart = getCart();
    let existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    updateCartCounter();
    showToast(`${productName} added to cart`, 'success');
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCounter();
}

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ==================== UI Effects ====================

function initCardHoverEffects() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
        });
    }
}

function disableImageRightClick() {
    document.querySelectorAll('img:not(.allow-right-click)').forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showToast('Image saving is not allowed', 'info');
        });
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== WhatsApp Integration ====================

function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-button');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const userData = getUserData();
            let message = 'Hello, I\'m interested in your products';
            
            if (userData) {
                message += `\n\nName: ${userData.name}`;
                message += `\nPhone: ${userData.phone}`;
            }
            
            const cart = getCart();
            if (cart.length > 0) {
                message += '\n\nSelected products:';
                cart.forEach(item => {
                    message += `\n- ${item.name} (${item.quantity}x)`;
                });
            }
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/966536297906?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
}

// ==================== Product Management ====================

function setupProductEvents() {
    // Add products to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice) || 0;
            
            addToCart(productId, productName, productPrice);
        });
    });
    
    // Show product details
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            showProductDetails(productId);
        });
    });
}

function showProductDetails(productId) {
    // Here you would fetch product details from database or data source
    console.log('Showing product details:', productId);
}

// ==================== Notification System ====================

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Close toast on click
    toast.querySelector('.toast-close').addEventListener('click', () => {
        hideToast(toast);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideToast(toast);
    }, 5000);
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
}
function setupNavbotButtons() {
    // Handle register button in navbot
    const headerRegisterBtn = document.getElementById('headeruserRegisterBtn');
    const headerLogoutBtn = document.getElementById('headeruserLogoutBtn');
    
    if (headerRegisterBtn) {
        headerRegisterBtn.addEventListener('click', function() {
            const userData = getUserData();
            
            if (userData) {
                // If user is registered, show their data
                document.getElementById('userName').value = userData.name;
                document.getElementById('phoneNumber').value = userData.phone;
                document.getElementById('imagePreview').style.backgroundImage = `url(${userData.avatar})`;
            } else {
                // If not registered, reset form fields
                resetRegisterForm();
            }
        });
    }
    
    // Handle logout button in navbot
    if (headerLogoutBtn) {
        // Initially hide the logout button if no user is logged in
        const userData = getUserData();
        headerLogoutBtn.style.display = userData ? 'block' : 'none';
        
        headerLogoutBtn.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem('userData');
            
            // Update UI
            updateUserUI(null);
            
            // Hide the logout button in both places
            headerLogoutBtn.style.display = 'none';
            const sidebarLogoutBtn = document.getElementById('userLogoutBtn');
            if (sidebarLogoutBtn) {
                sidebarLogoutBtn.style.display = 'none';
            }
            
            // Show success message
            showToast('تم حذف البيانات بنجاح', 'success');
        });
    }
}
