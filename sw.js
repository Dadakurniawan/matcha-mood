/* Service worker Matcha untukmu.
   Naikkan VERSION setiap kali Anda deploy perubahan agar cache lama dibersihkan. */
const VERSION = 'v1.0.0';
const CACHE = 'matcha-' + VERSION;
const PRECACHE = [
  '/', '/index.html', '/config.js', '/js/app.js',
  '/css/style.css', '/css/fonts.css', '/manifest.webmanifest',
  '/fonts/fredoka-latin-500-normal.woff2', '/fonts/fredoka-latin-600-normal.woff2',
  '/fonts/nunito-latin-400-normal.woff2', '/fonts/nunito-latin-700-normal.woff2',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png', '/icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('matcha-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Halaman: coba jaringan dulu, jatuh ke cache jika offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('/index.html', copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Aset lain (termasuk foto): tampilkan cache dulu, perbarui di belakang layar
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(res => {
        if (res && res.ok) c.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
