# Matcha Mood PWA

A small interactive mood-lifting matcha-making game, redesigned from the original standalone HTML.

## Run locally
- Open `index.html` directly for a quick preview (PWA features require localhost or HTTPS).
- Recommended: run a static server, e.g. `npx serve .`.

## Deploy to Vercel
1. Upload this folder to a Git repository.
2. Import the repository in Vercel.
3. Framework preset: **Other**; Build Command: empty; Output Directory: `.`.
4. Deploy. PWA install/offline caching work on HTTPS after the first visit.

## Personalize
- Edit `config.js` for mood messages, ingredient notes, coupons, photos, and secret text.
- Settings button inside the game lets you change default name, letter, and secret message; these are saved locally in the browser.
- Put photo files under `assets/images/`, then add their relative paths to `photos`, for example `['assets/images/photo1.jpg']` in `config.js`.

## PWA behavior
- Service worker caches the core app shell.
- On app updates, the cache version is updated in `sw.js` (`CACHE_NAME`).
- Offline mode is available after the initial successful load; Google Fonts may not be cached, so system fallback fonts are used.
