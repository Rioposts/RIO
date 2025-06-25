const CACHE_NAME = "rio-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles/home.css",
  "/scripts/main.js",  // change if using different script files
  "/images/Rio.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate
self.addEventListener("activate", event => {
  console.log("Service Worker activated.");
});

// Fetch
self
