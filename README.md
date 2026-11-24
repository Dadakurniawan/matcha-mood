# Matcha untukmu (PWA)

Game kecil bikin matcha pengembali mood. Statis penuh: tanpa build, tanpa dependensi, jalan offline setelah dibuka sekali.

## Struktur
```
index.html            halaman utama
config.js             ← EDIT INI untuk nama, surat, kupon, foto
js/app.js             logika game
css/style.css         tampilan
css/fonts.css         @font-face (font di-host sendiri)
fonts/                Fredoka & Nunito (woff2, lisensi OFL)
icons/                ikon PWA (any + maskable) & apple-touch-icon
foto/                 taruh foto kenangan di sini
manifest.webmanifest  metadata PWA
sw.js                 service worker (offline)
vercel.json           header cache untuk Vercel
```

## Personalisasi
Buka `config.js`. Untuk foto, taruh file di `foto/` lalu isi:
```js
photos: ["/foto/1.jpg", "/foto/2.jpg"],
```
Pakai awalan `/foto/...` (path absolut). Foto ikut di-cache otomatis setelah dilihat sekali.

## Jalankan lokal
```bash
npx serve . -l 3000
```
Buka http://localhost:3000 (service worker hanya aktif di `localhost` atau HTTPS, bukan `file://`).

## Deploy ke Vercel
**Lewat GitHub (disarankan)**
1. Push folder ini ke repo GitHub.
2. vercel.com → Add New → Project → pilih repo.
3. Framework Preset: **Other**. Build Command dan Output Directory dikosongkan. Klik Deploy.

**Lewat CLI**
```bash
npm i -g vercel
vercel        # preview
vercel --prod # produksi
```

## Setiap kali update
Ubah `VERSION` di `sw.js` (misal `v1.0.1`) sebelum deploy, supaya HP yang sudah menginstal mengambil versi terbaru. Tanpa itu, perubahan tetap masuk, tapi baru terlihat pada pembukaan kedua.

## Pasang di HP
- Android/Chrome: tombol **Pasang app** muncul di pojok atas, atau menu ⋮ → Install app.
- iPhone/Safari: tombol Bagikan → **Add to Home Screen**.
