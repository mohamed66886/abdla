document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الصفحة عند التحميل
    initPage();
});

function initPage() {
    // تحميل بيانات المستخدم
    loadUserData();
    
    // تهيئة عداد عربة التسوق
    updateCartCounter();
    
    // تهيئة تأثيرات البطاقات
    initCardHoverEffects();
    
    // تهيئة القائمة المتنقلة
    setupMobileMenu();
    
    // حماية الصور من النقر الأيمن
    disableImageRightClick();
    
    // تهيئة التمرير السلس
    setupSmoothScrolling();
    
    // تهيئة مودال التسجيل
    setupRegisterModal();
    
    // تهيئة زر واتساب
    setupWhatsAppButton();
    
    // تهيئة أحداث إضافة المنتجات للسلة
    setupProductEvents();
}

// ==================== نظام تسجيل المستخدم ====================

function setupRegisterModal() {
    const registerBtn = document.getElementById('userRegisterBtn');
    const saveBtn = document.getElementById('saveUserBtn');
    const cancelBtn = document.querySelector('#registerModal .btn-secondary');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    
    // فتح مودال التسجيل
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const userData = getUserData();
            
            if (userData) {
                // إذا كان مستخدم مسجل، عرض بياناته
                document.getElementById('userName').value = userData.name;
                document.getElementById('phoneNumber').value = userData.phone;
                imagePreview.style.backgroundImage = `url(${userData.avatar})`;
            } else {
                // إذا كان غير مسجل، إعادة تعيين الحقول
                resetRegisterForm();
            }
            
            registerModal.show();
        });
    }
    
    // إدارة اختيار الصورة
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
    
    // حفظ بيانات المستخدم
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
                showToast('تم حفظ بياناتك بنجاح', 'success');
            }
        });
    }
    
    // إلغاء التسجيل
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            resetRegisterForm();
        });
    }
}

function validateUserData(name, phone) {
    if (!name) {
        showToast('الرجاء إدخال الاسم الكامل', 'error');
        return false;
    }
    
    if (!phone) {
        showToast('الرجاء إدخال رقم الهاتف', 'error');
        return false;
    }
    
    if (!/^[0-9]{10,15}$/.test(phone)) {
        showToast('رقم الهاتف غير صحيح', 'error');
        return false;
    }
    
    return true;
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
        updateUserUI(userData);
    }
}

function updateUserUI(userData) {
    const registerBtn = document.getElementById('userRegisterBtn');
    const userAvatarIcon = document.getElementById('userAvatarIcon');
    
    if (userData) {
        // تحديث زر التسجيل
        if (registerBtn) {
            registerBtn.innerHTML = `
                <img src="${userData.avatar}" class="user-avatar-img" alt="صورة المستخدم">
                <span class="user-name">${userData.name}</span>
            `;
            registerBtn.classList.add('user-logged-in');
        }
        
        // تحديث أيقونة المستخدم
        if (userAvatarIcon) {
            userAvatarIcon.style.backgroundImage = `url(${userData.avatar})`;
            userAvatarIcon.classList.add('avatar-has-image');
        }
    } else {
        // إعادة تعيين إذا لم يكن مسجلاً
        if (registerBtn) {
            registerBtn.innerHTML = 'تسجيل الدخول';
            registerBtn.classList.remove('user-logged-in');
        }
        
        if (userAvatarIcon) {
            userAvatarIcon.style.backgroundImage = '';
            userAvatarIcon.classList.remove('avatar-has-image');
        }
    }
}

// ==================== نظام عربة التسوق ====================

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
    showToast(`تم إضافة ${productName} إلى السلة`, 'success');
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

// ==================== تأثيرات الواجهة ====================

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
            showToast('حفظ الصور غير متاح', 'info');
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

// ==================== تكامل واتساب ====================

function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-button');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const userData = getUserData();
            let message = 'مرحباً، أنا مهتم بالمنتجات لديكم';
            
            if (userData) {
                message += `\n\nالاسم: ${userData.name}`;
                message += `\nالهاتف: ${userData.phone}`;
            }
            
            const cart = getCart();
            if (cart.length > 0) {
                message += '\n\nالمنتجات المختارة:';
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

// ==================== إدارة المنتجات ====================

function setupProductEvents() {
    // إضافة منتجات للسلة
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice) || 0;
            
            addToCart(productId, productName, productPrice);
        });
    });
    
    // عرض تفاصيل المنتج
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            showProductDetails(productId);
        });
    });
}

function showProductDetails(productId) {
    // هنا يمكن جلب تفاصيل المنتج من قاعدة البيانات أو مصدر البيانات
    console.log('عرض تفاصيل المنتج:', productId);
}

// ==================== نظام الإشعارات ====================

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // إظهار الإشعار
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // إغلاق الإشعار عند النقر
    toast.querySelector('.toast-close').addEventListener('click', () => {
        hideToast(toast);
    });
    
    // إخفاء الإشعار تلقائياً بعد 5 ثواني
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