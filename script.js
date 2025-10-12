// إدارة السلة باستخدام localStorage
// ====================================

// الحصول على السلة من localStorage
function getCart() {
    try {
        const cart = localStorage.getItem('elixir_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('خطأ في قراءة السلة:', error);
        return [];
    }
}

// حفظ السلة في localStorage
function saveCart(cart) {
    try {
        localStorage.setItem('elixir_cart', JSON.stringify(cart));
        updateCartCount();
    } catch (error) {
        console.error('خطأ في حفظ السلة:', error);
        showNotification('⚠️ حدث خطأ في حفظ السلة', 'error');
    }
}

// تحديث عداد السلة في شريط التنقل
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        // إضافة تأثير بصري عند التحديث
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'pulse 2s infinite';
        }, 10);
    });
}

// إضافة منتج إلى السلة
function addToCart(name, price, quantityInputId, imageUrl) {
    const quantityInput = quantityInputId ? document.getElementById(quantityInputId) : null;
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    // التحقق من صحة الكمية
    if (quantity <= 0 || isNaN(quantity)) {
        showNotification('⚠️ يرجى إدخال كمية صحيحة', 'warning');
        return;
    }
    
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        
        // التحقق من تطبيق العرض وإظهار رسالة تهنئة
        if (existingItem.quantity >= 3) {
            const sets = Math.floor(existingItem.quantity / 3);
            showNotification(`🎉 هنيئًا لك! حصلت على ${sets} منتج مجاني! (اشترِ 2 واحصل على 1 مجانًا)`, 'success');
        } else {
            showNotification(`✅ تم تحديث الكمية! (${existingItem.quantity} قطعة)`, 'success');
        }
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: quantity,
            image: imageUrl || 'https://via.placeholder.com/100x100?text=منتج'
        });
        showNotification('✅ تمت إضافة المنتج إلى السلة بنجاح!', 'success');
    }
    
    saveCart(cart);
    
    // إعادة تعيين حقل الكمية
    if (quantityInput) {
        quantityInput.value = 1;
    }
}

// إضافة من صفحة Hero
function addToCartFromHero() {
    addToCart(
        'مربى الثوم والتين بزيت الزيتون',
        45,
        null,
        'https://images.unsplash.com/photo-1599909533730-f9d5f7d7b7f5?w=100&h=100&fit=crop'
    );
}

// عرض إشعار محسّن
function showNotification(message, type = 'success') {
    // إزالة الإشعارات السابقة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ====================================
// صفحة السلة
// ====================================

// عرض محتويات السلة
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        // إخفاء محتوى السلة وإظهار رسالة السلة الفارغة
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }
    
    // إظهار محتوى السلة وإخفاء رسالة السلة الفارغة
    if (cartContent) cartContent.style.display = 'flex';
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item fade-in" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=منتج'">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">${item.price} درهم / قطعة</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" 
                       onchange="updateQuantityInput(${item.id}, this.value)" 
                       class="quantity-input-cart">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                <span class="item-total-price">${(item.price * item.quantity).toFixed(2)} درهم</span>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="حذف">🗑️</button>
        </div>
    `).join('');
    
    updateCartSummary();
}

// تحديث كمية منتج في السلة
function updateQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    if (item.quantity > 10) {
        item.quantity = 10;
        showNotification('⚠️ الحد الأقصى للكمية هو 10', 'warning');
    }
    
    // التحقق من تطبيق العرض
    if (item.quantity >= 3 && change > 0) {
        const sets = Math.floor(item.quantity / 3);
        showNotification(`🎉 هنيئًا لك! حصلت على ${sets} منتج مجاني!`, 'success');
    }
    
    saveCart(cart);
    displayCart();
}

// تحديث الكمية من حقل الإدخال
function updateQuantityInput(itemId, newQuantity) {
    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (!item) return;
    
    const quantity = parseInt(newQuantity);
    
    if (isNaN(quantity) || quantity <= 0) {
        showNotification('⚠️ يرجى إدخال كمية صحيحة', 'warning');
        displayCart();
        return;
    }
    
    if (quantity > 10) {
        item.quantity = 10;
        showNotification('⚠️ الحد الأقصى للكمية هو 10', 'warning');
    } else {
        item.quantity = quantity;
    }
    
    // التحقق من تطبيق العرض
    if (item.quantity >= 3) {
        const sets = Math.floor(item.quantity / 3);
        showNotification(`🎉 هنيئًا لك! حصلت على ${sets} منتج مجاني!`, 'success');
    }
    
    saveCart(cart);
    displayCart();
}

// حذف منتج من السلة
function removeFromCart(itemId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(updatedCart);
    displayCart();
    showNotification('✅ تم حذف المنتج من السلة', 'success');
}

// تحديث ملخص السلة
function updateCartSummary() {
    const cart = getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // تطبيق عرض "اشترِ 2 واحصل على 1" - عند شراء 3 منتجات، يحصل على 1 مجانًا
    // أي: 3 منتجات بسعر 2 (90 درهم بدلاً من 135 درهم)
    let discount = 0;
    let freeItems = 0;
    const jamItems = cart.find(item => item.name.includes('مربى الثوم والتين'));
    if (jamItems && jamItems.quantity >= 3) {
        // حساب عدد المنتجات المجانية: لكل 3 منتجات، واحد منها مجاني
        freeItems = Math.floor(jamItems.quantity / 3);
        discount = freeItems * jamItems.price;
    }
    
    const total = subtotal - discount;
    
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const promoDiscountElement = document.getElementById('promoDiscount');
    const promoRow = document.getElementById('promoRow');
    
    if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} درهم`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)} درهم`;
    
    if (promoRow && promoDiscountElement) {
        if (discount > 0) {
            promoRow.style.display = 'flex';
            promoDiscountElement.textContent = `-${discount.toFixed(2)} درهم`;
            
            // إضافة رسالة تهنئة في ملخص السلة
            let congratsMessage = document.getElementById('congratsMessage');
            if (!congratsMessage) {
                congratsMessage = document.createElement('div');
                congratsMessage.id = 'congratsMessage';
                congratsMessage.className = 'congrats-message';
                congratsMessage.innerHTML = `🎉 هنيئًا لك! حصلت على ${freeItems} منتج مجاني!`;
                promoRow.parentElement.insertBefore(congratsMessage, promoRow);
            } else {
                congratsMessage.innerHTML = `🎉 هنيئًا لك! حصلت على ${freeItems} منتج مجاني!`;
            }
        } else {
            promoRow.style.display = 'none';
            const congratsMessage = document.getElementById('congratsMessage');
            if (congratsMessage) congratsMessage.remove();
        }
    }
}

// الانتقال إلى صفحة الدفع
function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('⚠️ السلة فارغة! أضف منتجات أولاً', 'warning');
        return;
    }
    window.location.href = 'checkout.html';
}

// ====================================
// صفحة الدفع
// ====================================

// عرض ملخص الطلب في صفحة الدفع
function displayCheckoutSummary() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!orderItemsContainer) return;
    
    if (cart.length === 0) {
        showNotification('⚠️ السلة فارغة! سيتم إعادة توجيهك...', 'warning');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70x70?text=منتج'">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">الكمية: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${(item.price * item.quantity).toFixed(2)} درهم</div>
        </div>
    `).join('');
    
    updateCheckoutSummary();
}

// تحديث ملخص الدفع
function updateCheckoutSummary() {
    const cart = getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // تطبيق عرض "اشترِ 2 واحصل على 1"
    let discount = 0;
    let freeItems = 0;
    const jamItems = cart.find(item => item.name.includes('مربى الثوم والتين'));
    if (jamItems && jamItems.quantity >= 3) {
        freeItems = Math.floor(jamItems.quantity / 3);
        discount = freeItems * jamItems.price;
    }
    
    const shipping = 0; // شحن مجاني داخل آسفي
    const tax = 0; // بدون ضرائب
    const total = subtotal - discount + shipping + tax;
    
    const checkoutSubtotalElement = document.getElementById('checkoutSubtotal');
    const shippingCostElement = document.getElementById('shippingCost');
    const taxCostElement = document.getElementById('taxCost');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    const checkoutPromoDiscountElement = document.getElementById('checkoutPromoDiscount');
    const checkoutPromoRow = document.getElementById('checkoutPromoRow');
    
    if (checkoutSubtotalElement) checkoutSubtotalElement.textContent = `${subtotal.toFixed(2)} درهم`;
    if (shippingCostElement) shippingCostElement.textContent = `مجاني (آسفي فقط)`;
    if (taxCostElement) taxCostElement.textContent = `${tax.toFixed(2)} درهم`;
    if (checkoutTotalElement) checkoutTotalElement.textContent = `${total.toFixed(2)} درهم`;
    
    if (checkoutPromoRow && checkoutPromoDiscountElement) {
        if (discount > 0) {
            checkoutPromoRow.style.display = 'flex';
            checkoutPromoDiscountElement.textContent = `-${discount.toFixed(2)} درهم`;
            
            // إضافة رسالة تهنئة
            let checkoutCongratsMessage = document.getElementById('checkoutCongratsMessage');
            if (!checkoutCongratsMessage) {
                checkoutCongratsMessage = document.createElement('div');
                checkoutCongratsMessage.id = 'checkoutCongratsMessage';
                checkoutCongratsMessage.className = 'congrats-message';
                checkoutCongratsMessage.innerHTML = `🎉 هنيئًا لك! حصلت على ${freeItems} منتج مجاني!`;
                checkoutPromoRow.parentElement.insertBefore(checkoutCongratsMessage, checkoutPromoRow);
            } else {
                checkoutCongratsMessage.innerHTML = `🎉 هنيئًا لك! حصلت على ${freeItems} منتج مجاني!`;
            }
        } else {
            checkoutPromoRow.style.display = 'none';
            const checkoutCongratsMessage = document.getElementById('checkoutCongratsMessage');
            if (checkoutCongratsMessage) checkoutCongratsMessage.remove();
        }
    }
}

// معالجة إتمام الطلب
function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // التحقق من الحقول المطلوبة
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const city = formData.get('city');
    const address = formData.get('address');
    const paymentMethod = formData.get('paymentMethod');
    
    if (!fullName || !email || !phone || !city || !address) {
        showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    
    // التحقق من أن المدينة هي آسفي
    if (city.trim().toLowerCase() !== 'آسفي' && city.trim().toLowerCase() !== 'اسفي' && city.trim().toLowerCase() !== 'safi') {
        showNotification('⚠️ التوصيل حاليًا متاح في مدينة آسفي فقط', 'warning');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('⚠️ البريد الإلكتروني غير صحيح', 'warning');
        return;
    }
    
    // التحقق من رقم الهاتف
    const phoneRegex = /^[0-9+\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('⚠️ رقم الهاتف غير صحيح', 'warning');
        return;
    }
    
    // التحقق من طريقة الدفع
    if (paymentMethod === 'online') {
        showNotification('⚠️ الدفع الإلكتروني غير متوفر حاليًا. يرجى اختيار الدفع عند الاستلام', 'warning');
        return;
    }
    
    const cart = getCart();
    
    // حساب الإجمالي
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // تطبيق الخصم
    let discount = 0;
    let freeItems = 0;
    const jamItems = cart.find(item => item.name.includes('مربى الثوم والتين'));
    if (jamItems && jamItems.quantity >= 3) {
        freeItems = Math.floor(jamItems.quantity / 3);
        discount = freeItems * jamItems.price;
    }
    
    const shipping = 0;
    const total = subtotal - discount + shipping;
    
    // إنشاء تفاصيل الطلب للبريد الإلكتروني
    let orderDetails = `طلب جديد من Elixir Naturel Maroc\n\n`;
    orderDetails += `معلومات العميل:\n`;
    orderDetails += `الاسم: ${fullName}\n`;
    orderDetails += `البريد الإلكتروني: ${email}\n`;
    orderDetails += `الهاتف: ${phone}\n`;
    orderDetails += `المدينة: ${city}\n`;
    orderDetails += `العنوان: ${address}\n`;
    orderDetails += `طريقة الدفع: ${paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'دفع إلكتروني'}\n\n`;
    
    orderDetails += `تفاصيل الطلب:\n`;
    cart.forEach(item => {
        orderDetails += `- ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} درهم\n`;
    });
    
    orderDetails += `\nالمجموع الفرعي: ${subtotal.toFixed(2)} درهم\n`;
    if (discount > 0) {
        orderDetails += `الخصم (${freeItems} منتج مجاني): -${discount.toFixed(2)} درهم\n`;
    }
    orderDetails += `الشحن: مجاني (آسفي)\n`;
    orderDetails += `الإجمالي: ${total.toFixed(2)} درهم\n`;
    
    // إرسال البريد الإلكتروني (باستخدام mailto)
    const mailtoLink = `mailto:elhaddouny@hotmail.com?subject=طلب جديد من ${fullName}&body=${encodeURIComponent(orderDetails)}`;
    window.location.href = mailtoLink;
    
    // إظهار رسالة نجاح
    showNotification('✅ تم إرسال طلبك بنجاح! سنتواصل معك قريبًا', 'success');
    
    // مسح السلة بعد 3 ثوانٍ
    setTimeout(() => {
        localStorage.removeItem('elixir_cart');
        window.location.href = 'index.html';
    }, 3000);
}

// ====================================
// صفحة المتجر
// ====================================

// البحث والفلترة في المتجر
function setupShopFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('categoryFilter')?.value || 'all';
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const productCategories = card.getAttribute('data-category') || '';
        
        const matchesSearch = productName.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || productCategories.includes(selectedCategory);
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// تغيير الصورة الرئيسية للمنتج
function changeMainImage(thumbnail) {
    const mainImage = thumbnail.closest('.product-images').querySelector('.product-main-image');
    if (mainImage) {
        mainImage.src = thumbnail.src.replace('w=100&h=100', 'w=400&h=400');
    }
}

// ====================================
// نموذج الاتصال
// ====================================

function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showNotification('⚠️ يرجى ملء جميع الحقول', 'warning');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('⚠️ البريد الإلكتروني غير صحيح', 'warning');
        return;
    }
    
    // إرسال البريد الإلكتروني
    const mailtoLink = `mailto:elhaddouny@hotmail.com?subject=رسالة من ${name}&body=${encodeURIComponent(`الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`)}`;
    window.location.href = mailtoLink;
    
    showNotification('✅ تم إرسال رسالتك بنجاح!', 'success');
    form.reset();
}

// ====================================
// مؤقت العد التنازلي
// ====================================

function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        
        const diff = midnight - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ====================================
// شريط التنقل المتجاوب
// ====================================

function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// ====================================
// التهيئة عند تحميل الصفحة
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // تحديث عداد السلة
    updateCartCount();
    
    // بدء مؤقت العد التنازلي
    startCountdown();
    
    // إعداد القائمة المتجاوبة
    setupMobileMenu();
    
    // إعداد فلاتر المتجر
    setupShopFilters();
    
    // إعداد نموذج الدفع
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
        displayCheckoutSummary();
    }
    
    // إعداد نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // عرض السلة في صفحة السلة
    if (document.getElementById('cartItems')) {
        displayCart();
    }
    
    // تأثيرات التمرير
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

