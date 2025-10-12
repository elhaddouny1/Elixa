// Service Worker لـ Elixir Naturel Maroc PWA
const CACHE_NAME = 'elixir-naturel-v1';
const urlsToCache = [
  '/Elixa/',
  '/Elixa/index.html',
  '/Elixa/shop.html',
  '/Elixa/cart.html',
  '/Elixa/checkout.html',
  '/Elixa/styles.css',
  '/Elixa/script.js'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('تم فتح الذاكرة المؤقتة');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف الذاكرة المؤقتة القديمة:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// استرجاع الموارد من الذاكرة المؤقتة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إرجاع الملف من الذاكرة المؤقتة إذا كان موجودًا
        if (response) {
          return response;
        }
        // جلب الملف من الشبكة إذا لم يكن في الذاكرة المؤقتة
        return fetch(event.request);
      })
  );
});

