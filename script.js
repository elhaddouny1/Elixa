// ====================================
// إدارة السلة باستخدام localStorage
// ====================================

// الحصول على السلة من localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// حفظ السلة في localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// تحديث عداد السلة في شريط التنقل
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// إضافة منتج إلى السلة
function addToCart(name, price, quantityInputId, imageUrl) {
    const quantityInput = document.getElementById(quantityInputId);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: quantity,
            image: imageUrl || 'https://via.placeholder.com/100x100?text=منتج'
        });
    }
    
    saveCart(cart);
    showNotification('تمت إضافة المنتج إلى السلة بنجاح! 🛒');
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

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=منتج'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">السعر: ${item.price} درهم</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <p class="cart-item-total">المجموع: ${item.price * item.quantity} درهم</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeFromCart(${index})">حذف</button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// تحديث الكمية
function updateQuantity(index, change) {
    const cart = getCart();
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    displayCart();
}

// حذف من السلة
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    showNotification('تم حذف المنتج من السلة');
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
    
    document.getElementById('subtotal').textContent = `${subtotal} درهم`;
    document.getElementById('total').textContent = `${total} درهم`;
    
    const promoRow = document.getElementById('promoRow');
    if (discount > 0) {
        promoRow.style.display = 'flex';
        document.getElementById('promoDiscount').textContent = `-${discount} درهم`;
    } else {
        promoRow.style.display = 'none';
    }
}

// الانتقال إلى صفحة الدفع
function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('السلة فارغة! أضف منتجات أولاً');
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
        window.location.href = 'cart.html';
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=منتج'">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">الكمية: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${item.price * item.quantity} درهم</div>
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
    
    document.getElementById('checkoutSubtotal').textContent = `${subtotal} درهم`;
    document.getElementById('shippingCost').textContent = `${shipping} درهم`;
    document.getElementById('taxCost').textContent = `${tax} درهم`;
    document.getElementById('checkoutTotal').textContent = `${total} درهم`;
    
    const promoRow = document.getElementById('checkoutPromoRow');
    if (discount > 0) {
        promoRow.style.display = 'flex';
        document.getElementById('checkoutPromoDiscount').textContent = `-${discount} درهم`;
    } else {
        promoRow.style.display = 'none';
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
        showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('⚠️ البريد الإلكتروني غير صحيح');
        return;
    }
    
    const cart = getCart();
    const orderNumber = '#' + Math.floor(Math.random() * 100000);
    
    // إنشاء تفاصيل الطلب للبريد الإلكتروني
    let orderDetails = `طلب جديد من Elixir Naturel Maroc\n\n`;
    orderDetails += `رقم الطلب: ${orderNumber}\n\n`;
    orderDetails += `معلومات العميل:\n`;
    orderDetails += `الاسم: ${fullName}\n`;
    orderDetails += `البريد: ${email}\n`;
    orderDetails += `الهاتف: ${phone}\n`;
    orderDetails += `المدينة: ${city}\n`;
    orderDetails += `العنوان: ${address}\n\n`;
    orderDetails += `المنتجات:\n`;
    
    cart.forEach(item => {
        orderDetails += `- ${item.name} × ${item.quantity} = ${item.price * item.quantity} درهم\n`;
    });
    
    // إرسال البريد الإلكتروني عبر mailto
    const mailtoLink = `mailto:elhaddoumy@hotmail.com?subject=طلب جديد ${orderNumber}&body=${encodeURIComponent(orderDetails)}`;
    window.location.href = mailtoLink;
    
    // عرض نافذة التأكيد
    setTimeout(() => {
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('confirmationModal').style.display = 'flex';
        
        // مسح السلة
        localStorage.removeItem('cart');
        updateCartCount();
    }, 500);
}

// إغلاق نافذة التأكيد
function closeConfirmation() {
    document.getElementById('confirmationModal').style.display = 'none';
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
        showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // إنشاء رسالة البريد
    let emailBody = `رسالة جديدة من موقع Elixir Naturel Maroc\n\n`;
    emailBody += `الاسم: ${name}\n`;
    emailBody += `البريد: ${email}\n`;
    emailBody += `الهاتف: ${phone || 'غير محدد'}\n\n`;
    emailBody += `الرسالة:\n${message}`;
    
    const mailtoLink = `mailto:elhaddoumy@hotmail.com?subject=رسالة من ${name}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    showNotification('✅ تم إرسال رسالتك بنجاح!');
    form.reset();
}

// ====================================
// عداد العرض الترويجي
// ====================================

function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    
    setInterval(() => {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            hours = 23;
            minutes = 59;
            seconds = 59;
        }
        
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        countdownElement.textContent = formattedTime;
    }, 1000);
}

// ====================================
// تغيير الصورة الرئيسية للمنتج
// ====================================

function changeMainImage(thumbnail) {
    const mainImage = thumbnail.closest('.product-card').querySelector('.product-main-image');
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
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
            const categories = card.dataset.category || '';
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = category === 'all' || categories.includes(category);
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

// ====================================
// Intersection Observer للتأثيرات البصرية
// ====================================

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// ====================================
// القائمة المتحركة للموبايل
// ====================================

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// ====================================
// تهيئة عند تحميل الصفحة
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    startCountdown();
    setupScrollAnimations();
    setupMobileMenu();
    setupShopFilters();
});

