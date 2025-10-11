// ====================================
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
        showNotification(`✅ تم تحديث الكمية! (${existingItem.quantity} قطعة)`, 'success');
    } else {
        cart.push({
            id: Date.now(), // معرف فريد
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
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 3500);
}

// ====================================
// صفحة السلة
// ====================================

// عرض محتويات السلة
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    if (cartContent) cartContent.style.display = 'grid';
    if (emptyCart) emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/120x120?text=منتج'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">السعر: <strong>${item.price} درهم</strong></p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" aria-label="تقليل الكمية">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)" aria-label="زيادة الكمية">+</button>
                </div>
                <p class="cart-item-total">المجموع: <strong>${(item.price * item.quantity).toFixed(2)} درهم</strong></p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeFromCart(${index})" aria-label="حذف المنتج">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// تحديث الكمية
function updateQuantity(index, change) {
    const cart = getCart();
    
    if (index < 0 || index >= cart.length) {
        showNotification('⚠️ حدث خطأ في تحديث الكمية', 'error');
        return;
    }
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        // تأكيد الحذف
        if (confirm(`هل تريد حذف "${cart[index].name}" من السلة؟`)) {
            cart.splice(index, 1);
            showNotification('✅ تم حذف المنتج من السلة', 'success');
        } else {
            cart[index].quantity = 1; // إعادة الكمية إلى 1
        }
    }
    
    saveCart(cart);
    displayCart();
}

// حذف من السلة
function removeFromCart(index) {
    const cart = getCart();
    
    if (index < 0 || index >= cart.length) {
        showNotification('⚠️ حدث خطأ في حذف المنتج', 'error');
        return;
    }
    
    const itemName = cart[index].name;
    
    if (confirm(`هل تريد حذف "${itemName}" من السلة؟`)) {
        cart.splice(index, 1);
        saveCart(cart);
        displayCart();
        showNotification('✅ تم حذف المنتج من السلة', 'success');
    }
}

// تحديث ملخص السلة
function updateCartSummary() {
    const cart = getCart();
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // تطبيق عرض "اشترِ 2 واحصل على 1"
    let discount = 0;
    const jamItems = cart.find(item => item.name.includes('مربى الثوم والتين'));
    if (jamItems && jamItems.quantity >= 2) {
        const freeItems = Math.floor(jamItems.quantity / 2);
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
        } else {
            promoRow.style.display = 'none';
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
    const jamItems = cart.find(item => item.name.includes('مربى الثوم والتين'));
    if (jamItems && jamItems.quantity >= 2) {
        const freeItems = Math.floor(jamItems.quantity / 2);
        discount = freeItems * jamItems.price;
    }
    
    const shipping = 20; // شحن ثابت
    const tax = 0; // بدون ضرائب
    const total = subtotal - discount + shipping + tax;
    
    const checkoutSubtotalElement = document.getElementById('checkoutSubtotal');
    const shippingCostElement = document.getElementById('shippingCost');
    const taxCostElement = document.getElementById('taxCost');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    const checkoutPromoDiscountElement = document.getElementById('checkoutPromoDiscount');
    const checkoutPromoRow = document.getElementById('checkoutPromoRow');
    
    if (checkoutSubtotalElement) checkoutSubtotalElement.textContent = `${subtotal.toFixed(2)} درهم`;
    if (shippingCostElement) shippingCostElement.textContent = `${shipping.toFixed(2)} درهم`;
    if (taxCostElement) taxCostElement.textContent = `${tax.toFixed(2)} درهم`;
    if (checkoutTotalElement) checkoutTotalElement.textContent = `${total.toFixed(2)} درهم`;
    
    if (checkoutPromoRow && checkoutPromoDiscountElement) {
        if (discount > 0) {
            checkoutPromoRow.style.display = 'flex';
            checkoutPromoDiscountElement.textContent = `-${discount.toFixed(2)} درهم`;
        } else {
            checkoutPromoRow.style.display = 'none';
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
    
    if (!fullName || !email || !phone || !city || !address) {
        showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('⚠️ البريد الإلكتروني غير صحيح', 'warning');
        return;
    }
    
    // التحقق من رقم الهاتف
    const phoneRegex = /^[\d\+\-\s\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        showNotification('⚠️ رقم الهاتف غير صحيح', 'warning');
        return;
    }
    
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('⚠️ السلة فارغة!', 'warning');
        return;
    }
    
    const orderNumber = '#' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // حساب الإجمالي
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    let discount = 0;
    const jamItems = cart.find(item => item.name.includes('مربى الثوم والتين'));
    if (jamItems && jamItems.quantity >= 2) {
        const freeItems = Math.floor(jamItems.quantity / 2);
        discount = freeItems * jamItems.price;
    }
    
    const shipping = 20;
    const total = subtotal - discount + shipping;
    
    // إنشاء تفاصيل الطلب للبريد الإلكتروني
    let orderDetails = `طلب جديد من Elixir Naturel Maroc\n\n`;
    orderDetails += `رقم الطلب: ${orderNumber}\n`;
    orderDetails += `التاريخ: ${new Date().toLocaleString('ar-MA')}\n\n`;
    orderDetails += `معلومات العميل:\n`;
    orderDetails += `الاسم: ${fullName}\n`;
    orderDetails += `البريد: ${email}\n`;
    orderDetails += `الهاتف: ${phone}\n`;
    orderDetails += `المدينة: ${city}\n`;
    orderDetails += `العنوان: ${address}\n\n`;
    orderDetails += `المنتجات:\n`;
    orderDetails += `${'='.repeat(50)}\n`;
    
    cart.forEach(item => {
        orderDetails += `${item.name}\n`;
        orderDetails += `  الكمية: ${item.quantity} × ${item.price} درهم = ${(item.price * item.quantity).toFixed(2)} درهم\n`;
    });
    
    orderDetails += `${'='.repeat(50)}\n`;
    orderDetails += `المجموع الفرعي: ${subtotal.toFixed(2)} درهم\n`;
    if (discount > 0) {
        orderDetails += `خصم العرض: -${discount.toFixed(2)} درهم\n`;
    }
    orderDetails += `الشحن: ${shipping.toFixed(2)} درهم\n`;
    orderDetails += `الإجمالي النهائي: ${total.toFixed(2)} درهم\n`;
    
    // إرسال البريد الإلكتروني عبر mailto
    const mailtoLink = `mailto:elhaddoumy@hotmail.com?subject=${encodeURIComponent('طلب جديد ' + orderNumber)}&body=${encodeURIComponent(orderDetails)}`;
    
    // فتح رابط mailto
    window.location.href = mailtoLink;
    
    // عرض نافذة التأكيد
    setTimeout(() => {
        const orderNumberElement = document.getElementById('orderNumber');
        const confirmationModal = document.getElementById('confirmationModal');
        
        if (orderNumberElement) orderNumberElement.textContent = orderNumber;
        if (confirmationModal) confirmationModal.style.display = 'flex';
        
        // مسح السلة
        localStorage.removeItem('elixir_cart');
        updateCartCount();
    }, 500);
}

// إغلاق نافذة التأكيد
function closeConfirmation() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) confirmationModal.style.display = 'none';
    window.location.href = 'index.html';
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
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('⚠️ البريد الإلكتروني غير صحيح', 'warning');
        return;
    }
    
    // إنشاء رسالة البريد
    let emailBody = `رسالة جديدة من موقع Elixir Naturel Maroc\n\n`;
    emailBody += `التاريخ: ${new Date().toLocaleString('ar-MA')}\n\n`;
    emailBody += `الاسم: ${name}\n`;
    emailBody += `البريد: ${email}\n`;
    emailBody += `الهاتف: ${phone || 'غير محدد'}\n\n`;
    emailBody += `الرسالة:\n${message}`;
    
    const mailtoLink = `mailto:elhaddoumy@hotmail.com?subject=${encodeURIComponent('رسالة من ' + name)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    showNotification('✅ تم إرسال رسالتك بنجاح!', 'success');
    form.reset();
}

// ====================================
// عداد العرض الترويجي
// ====================================

function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    // الحصول على الوقت المتبقي من localStorage أو تعيين 24 ساعة
    let endTime = localStorage.getItem('elixir_promo_end');
    if (!endTime) {
        endTime = Date.now() + (24 * 60 * 60 * 1000); // 24 ساعة
        localStorage.setItem('elixir_promo_end', endTime);
    }
    
    function updateTimer() {
        const now = Date.now();
        const remaining = parseInt(endTime) - now;
        
        if (remaining <= 0) {
            // إعادة تعيين العداد
            endTime = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem('elixir_promo_end', endTime);
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        countdownElement.textContent = formattedTime;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ====================================
// تغيير الصورة الرئيسية للمنتج
// ====================================

function changeMainImage(thumbnail) {
    const productCard = thumbnail.closest('.product-card');
    if (!productCard) return;
    
    const mainImage = productCard.querySelector('.product-main-image');
    if (!mainImage) return;
    
    // إزالة التحديد من جميع الصور المصغرة
    const thumbnails = productCard.querySelectorAll('.product-thumbnails img');
    thumbnails.forEach(img => img.style.borderColor = 'transparent');
    
    // تحديد الصورة المصغرة المختارة
    thumbnail.style.borderColor = 'var(--primary-green)';
    
    // تغيير الصورة الرئيسية
    mainImage.src = thumbnail.src.replace('w=100&h=100', 'w=400&h=400');
}

// ====================================
// فلاتر المتجر
// ====================================

function setupShopFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!searchInput || !categoryFilter) return;
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const productCards = document.querySelectorAll('.product-card');
        
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
            const categories = card.dataset.category || '';
            
            const matchesSearch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = category === 'all' || categories.includes(category);
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // عرض رسالة إذا لم يتم العثور على منتجات
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (visibleCount === 0) {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.id = 'noResultsMessage';
                message.className = 'no-results';
                message.innerHTML = '<p>لم يتم العثور على منتجات مطابقة 😔</p>';
                document.qu