// ================================
// Cache version (update on deploy)
// ================================
const CACHE_NAME = "cache-v2";

// Core files (keep this SMALL)
const CORE_ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/index.png",
    "/Build/hktruffled.loader.js",
    "/Build/hktruffled.framework.js"
];

// Large Unity build files (lazy cached)
const UNITY_ASSETS = [
    "/Build/hktruffled.wasm.part1",
    "/Build/hktruffled.wasm.part2",
    "/Build/hktruffled.data.part1",
    "/Build/hktruffled.data.part2",
    "/Build/hktruffled.data.part3",
    "/Build/hktruffled.data.part4",
    "/Build/hktruffled.data.part5",
    "/Build/hktruffled.data.part6",
    "/Build/hktruffled.data.part7",
    "/Build/hktruffled.data.part8",
    "/Build/hktruffled.data.part9",
    "/Build/hktruffled.data.part10",
    "/Build/hktruffled.data.part11",
    "/Build/hktruffled.data.part12",
    "/Build/hktruffled.data.part13",
    "/Build/hktruffled.data.part14",
    "/Build/hktruffled.data.part15",
    "/Build/hktruffled.data.part16",
    "/Build/hktruffled.data.part17",
    "/Build/hktruffled.data.part18",
    "/Build/hktruffled.data.part19",
    "/Build/hktruffled.data.part20",
    "/Build/hktruffled.data.part21",
    "/Build/hktruffled.data.part22",
    "/Build/hktruffled.data.part23",
    "/Build/hktruffled.data.part24",
    "/Build/hktruffled.data.part25",
    "/Build/hktruffled.data.part26",
    "/Build/hktruffled.data.part27",
    "/Build/hktruffled.data.part28",
    "/Build/hktruffled.data.part29",
    "/Build/hktruffled.data.part30",
    "/Build/hktruffled.data.part31",
    "/Build/hktruffled.data.part32",
    "/Build/hktruffled.data.part33",
    "/Build/hktruffled.data.part34",
    "/Build/hktruffled.data.part35",
    "/Build/hktruffled.data.part36",
    "/Build/hktruffled.data.part37",
    "/Build/hktruffled.data.part38",
    "/Build/hktruffled.data.part39",
    "/Build/hktruffled.data.part40",
    "/Build/hktruffled.data.part41",
    "/Build/hktruffled.data.part42",
    "/Build/hktruffled.data.part43",
    "/Build/hktruffled.data.part44",
    "/Build/hktruffled.data.part45"
];

// ================================
// Install: cache core only
// ================================
self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log("Caching core assets...");

            for (const url of CORE_ASSETS) {
                try {
                    await cache.add(url);
                } catch (err) {
                    console.warn("Failed to cache core:", url);
                }
            }
        })
    );
});

// ================================
// Activate: clean old caches
// ================================
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// ================================
// Fetch: cache-first strategy
// ================================
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // ✅ 1. Return cached immediately
            if (cachedResponse) {
                return cachedResponse;
            }

            // ✅ 2. Otherwise fetch from network
            return fetch(event.request)
                .then((networkResponse) => {
                    // Only cache valid responses
                    if (
                        !networkResponse ||
                        networkResponse.status !== 200
                    ) {
                        return networkResponse;
                    }

                    const responseClone = networkResponse.clone();

                    // ✅ 3. Cache Unity + runtime assets
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    // ✅ 4. Offline fallback
                    if (event.request.mode === "navigate") {
                        return caches.match("/index.html");
                    }
                });
        })
    );
});
