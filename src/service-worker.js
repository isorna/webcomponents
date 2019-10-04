importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Updating SW');
        skipWaiting();
    }
});

// Force production builds
workbox.setConfig({ debug: false });

workbox.routing.registerRoute(
    /\.(?:html|js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            })
        ],
    })
);
/* TODO: REMOVE Google fonts?
// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);
// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);*/

// Workbox build: https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build
workbox.precaching.precacheAndRoute([
  {
    "url": "components/app-icons.js",
    "revision": "94cc8308f8b64c726320c25f7944c2fd"
  },
  {
    "url": "components/app-wrapper.js",
    "revision": "6d9515ea40d951c40d28e1c7d81fdb1e"
  },
  {
    "url": "components/bundle.js",
    "revision": "92aa81ecc2f510025905e8eed3a763e5"
  },
  {
    "url": "components/login-card.js",
    "revision": "c3f5556e1f007f5498db3158adecf4f5"
  },
  {
    "url": "components/notification-bar.js",
    "revision": "5a5c788223bcd942faf6c5976aba84ed"
  },
  {
    "url": "config/environment.js",
    "revision": "dcdf3e56627e605e8298296a9b49f64e"
  },
  {
    "url": "config/navroutes.js",
    "revision": "285db6d71ec9d7a5de7b196fd8a889b9"
  },
  {
    "url": "css/animate.css",
    "revision": "649236ed565a266d3b46e6dd017e15d6"
  },
  {
    "url": "css/app.css",
    "revision": "b48f5e187d6279005ab854ed0dde86b3"
  },
  {
    "url": "css/normalize.css",
    "revision": "b3b3c0fd34c47d9df94dc2b97dc93167"
  },
  {
    "url": "css/nprogress.css",
    "revision": "ae602f480cd018e795d4d0bdbc8d994a"
  },
  {
    "url": "index.html",
    "revision": "1b242e9bf15e7c96e816a8695dd2e864"
  },
  {
    "url": "init.js",
    "revision": "cd9b737d4b2db1c106c664ab33cf3433"
  },
  {
    "url": "lib/install.js",
    "revision": "095ffa5399df4944357f302e75b4d26a"
  },
  {
    "url": "lib/network.js",
    "revision": "71a35020d6c0d55c0f25b79494fd5407"
  },
  {
    "url": "lib/nprogress.js",
    "revision": "dd6bf6ab37f15b144c15182075c2c3b5"
  },
  {
    "url": "lib/reselect.js",
    "revision": "0eccd3609b3391bedad595956f550f3c"
  },
  {
    "url": "lib/router.js",
    "revision": "469b4e2f19c3fcd6ed5f06c1aa2777fc"
  },
  {
    "url": "lib/simplestore.js",
    "revision": "50eed272900903b918d8e3ff432e8a8a"
  }
]);