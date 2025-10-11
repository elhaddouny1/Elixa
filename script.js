// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Create mailto link with form data
        const subject = encodeURIComponent('استفسار من موقع Elixir Naturel Maroc');
        const body = encodeURIComponent(
            `الاسم: ${name}\n` +
            `البريد الإلكتروني: ${email}\n` +
            `رقم الهاتف: ${phone || 'غير محدد'}\n\n` +
            `الرسالة:\n${message}`
        );
        
        window.location.href = `mailto:elhaddouny@hotmail.com?subject=${subject}&body=${body}`;
        
        // Show success message
        alert('شكراً لتواصلك معنا! سيتم فتح برنامج البريد الإلكتروني الخاص بك لإرسال الرسالة.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature').forEach(feature => {
    feature.style.opacity = '0';
    feature.style.transform = 'translateY(30px)';
    feature.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(feature);
});

// Add click handler to CTA button
const ctaButton = document.querySelector('.btn-primary');
if (ctaButton && ctaButton.textContent.includes('اطلب الآن')) {
    ctaButton.addEventListener('click', function() {
        // Scroll to contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Add sticky navigation on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.position = 'sticky';
        nav.style.top = '0';
        nav.style.backgroundColor = 'rgba(240, 248, 232, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        nav.style.padding = '15px 0';
        nav.style.zIndex = '1000';
        nav.style.transition = 'all 0.3s ease';
    } else {
        nav.style.position = 'relative';
        nav.style.backgroundColor = 'transparent';
        nav.style.boxShadow = 'none';
        nav.style.padding = '0';
    }
});
