document.addEventListener('DOMContentLoaded', function() {
    // تحميل بيانات المستخدم وعربة التسوق عند بدء التشغيل
    loadUserData();
    updateCartCounter();
    
    // تهيئة جميع مكونات الصفحة
    initCardHoverEffects();
    setupMobileMenu();
    disableImageRightClick();
    setupSmoothScrolling();
    setupRegisterModal();
    setupWhatsAppButton();
});

// ==================== نظام تسجيل المستخدم ====================

function setupRegisterModal() {
    const registerBtn = document.getElementById('userRegisterBtn');
    const saveBtn = document.getElementById('saveUserBtn');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const registerModal = document.getElementById('registerModal');
    
    // فتح المودال عند الضغط على تسجيل
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const userData = getUserData();
            const modal = new bootstrap.Modal(registerModal);
            
            if (userData) {
                document.getElementById('userName').value = userData.name;
                document.getElementById('phoneNumber').value = userData.phone;
                imagePreview.style.backgroundImage = `url(${userData.avatar})`;
            } else {
                // إعادة تعيين الحقول إذا لم يكن هناك مستخدم مسجل
                document.getElementById('userName').value = '';
                document.getElementById('phoneNumber').value = '';
                imagePreview.style.backgroundImage = 'url("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")';
            }
            
            modal.show();
        });
    }
    
    // تغيير صورة المستخدم
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
            
            if (name && phone) {
                const userData = {
                    name: name,
                    phone: phone,
                    avatar: avatar
                };
                
                saveUserData(userData);
                updateUserUI(userData);
                
                // إغلاق المودال
                const modal = bootstrap.Modal.getInstance(registerModal);
                modal.hide();
                
                showToast('تم حفظ بيانات المستخدم بنجاح');
            } else {
                showToast('الرجاء إدخال جميع البيانات المطلوبة');
            }
        });
    }
}

// حفظ بيانات المستخدم في localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// جلب بيانات المستخدم من localStorage
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// تحميل بيانات المستخدم عند بدء التشغيل
function loadUserData() {
    const userData = getUserData();
    if (userData) {
        updateUserUI(userData);
    }
}

// تحديث واجهة المستخدم ببياناته
function updateUserUI(userData) {
    const registerBtn = document.getElementById('userRegisterBtn');
    const userAvatarIcon = document.getElementById('userAvatarIcon');
    
    if (userData) {
        // تحديث زر التسجيل ليعرض بيانات المستخدم
        if (registerBtn) {
            registerBtn.innerHTML = `
                <span class="user-info-name">${userData.name}</span>
                <img src="${userData.avatar}" class="user-info-avatar" alt="صورة المستخدم">
            `;
            registerBtn.classList.add('user-info-container');
        }
        
        // تحديث الأيقونة لتعرض صورة المستخدم
        if (userAvatarIcon) {
            userAvatarIcon.style.backgroundImage = `url(${userData.avatar})`;
            userAvatarIcon.classList.remove('bi-person-circle');
            userAvatarIcon.style.fontSize = '0';
        }
    } else {
        // إعادة تعيين الزر إذا لم يكن هناك مستخدم مسجل
        if (registerBtn) {
            registerBtn.innerHTML = 'تسجيل';
            registerBtn.classList.remove('user-info-container');
        }
        
        // إعادة تعيين الأيقونة
        if (userAvatarIcon) {
            userAvatarIcon.style.backgroundImage = '';
            userAvatarIcon.classList.add('bi-person-circle');
            userAvatarIcon.style.fontSize = '3rem';
        }
    }
}



// ==================== تأثيرات البطاقات ====================

function initCardHoverEffects() {
    const cards = document.querySelectorAll('.col-md-4 .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        card.addEventListener('click', function() {
            const productId = this.dataset.productId || 'prod-' + Math.random().toString(36).substr(2, 9);
            const productName = this.querySelector('h4')?.textContent || 'منتج غير معروف';
            addToCart(productId, productName);
        });
    });
}

// ==================== القائمة المتنقلة ====================

function setupMobileMenu() {
    const menuButton = document.querySelector('.bi-list');
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }
}

// ==================== حماية الصور ====================

function disableImageRightClick() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showToast('نعتذر، حفظ الصور غير متاح');
        });
    });
}

// ==================== التمرير السلس ====================

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== زر واتساب ====================

function setupWhatsAppButton() {
    const whatsappButton = document.querySelector('.icon_whats');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            const userData = getUserData();
            let message = 'مرحباً، أنا مهتم بالمنتجات التي تقدمونها';
            
            if (userData) {
                message += `\nاسمي: ${userData.name}`;
                if (userData.phone) {
                    message += `\nرقم هاتفي: ${userData.phone}`;
                }
            }
            
            const encodedMessage = encodeURIComponent(message);
            this.querySelector('a').href = `https://api.whatsapp.com/send?phone=966536297906&text=${encodedMessage}`;
        });
    }
}

