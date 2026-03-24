// Name of the Cache.
const CACHE = "cacheV1";

// Select files for caching.
let urlsToCache = [
    "/",
    "/sharedassets5.resource",
    "/sharedassets14.resource",
    "/sharedassets414.resource",
    "/sharedassets412.resource",
    "/sharedassets10.resource",
    "/sharedassets8.resource",
    "/sharedassets13.resource",
    "/sharedassets413.resource",
    "/index.html",
    "/sharedassets410.resource",
    "/manifest.json",
    "/sharedassets16.resource",
    "/index.png",
    "/sharedassets400.resource",
    "/sharedassets411.resource",
    "/sharedassets416.resource",
    "/Build/hktruffled.wasm.part2",
    "/Build/hktruffled.data.part24",
    "/Build/hktruffled.framework.js",
    "/Build/hktruffled.data.part15",
    "/Build/hktruffled.data.part6",
    "/Build/hktruffled.data.part43",
    "/Build/hktruffled.data.part8",
    "/Build/hktruffled.data.part18",
    "/Build/hktruffled.data.part1",
    "/Build/hktruffled.data.part9",
    "/Build/hktruffled.data.part14",
    "/Build/hktruffled.data.part20",
    "/Build/hktruffled.data.part3",
    "/Build/hktruffled.data.part37",
    "/Build/hktruffled.loader.js",
    "/Build/hktruffled.data.part22",
    "/Build/hktruffled.data.part30",
    "/Build/hktruffled.data.part45",
    "/Build/hktruffled.data.part17",
    "/Build/hktruffled.data.part44",
    "/Build/hktruffled.data.part41",
    "/Build/hktruffled.data.part19",
    "/Build/hktruffled.data.part25",
    "/Build/hktruffled.data.part5",
    "/Build/hktruffled.data.part27",
    "/Build/hktruffled.data.part31",
    "/Build/hktruffled.data.part26",
    "/Build/hktruffled.data.part29",
    "/Build/hktruffled.data.part38",
    "/Build/hktruffled.data.part23",
    "/Build/hktruffled.data.part36",
    "/Build/hktruffled.data.part32",
    "/Build/hktruffled.data.part42",
    "/Build/hktruffled.data.part11",
    "/Build/hktruffled.data.part10",
    "/Build/hktruffled.data.part39",
    "/Build/hktruffled.data.part28",
    "/Build/hktruffled.data.part40",
    "/Build/hktruffled.data.part4",
    "/Build/hktruffled.data.part7",
    "/Build/hktruffled.data.part21",
    "/Build/hktruffled.wasm.part1",
    "/Build/hktruffled.data.part13",
    "/Build/hktruffled.data.part34",
    "/Build/hktruffled.data.part16",
    "/Build/hktruffled.data.part35",
    "/Build/hktruffled.data.part2",
    "/Build/hktruffled.data.part12",
    "/Build/hktruffled.data.part33",
    "/StreamingAssets/BuildMetadata.json"
];

// Cache all the selected items once application is installed.
self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then(async (cache) => {
            console.log("Caching started.");
            for (const url of urlsToCache) {
                try {
                    await cache.add(url);
                } catch (err) {
                    console.warn("Failed to cache:", url);
                }
            }
        })
    );
});

// Whenever a resource is requested, return if its cached else fetch the resource from server.
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
const fetchPromise = fetch(event.request).then((networkResponse) => {
    if (
        event.request.method === "GET" &&
        networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type === "basic"
    ) {
        caches.open(CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
        });
    }

    return networkResponse;
});

            return response || fetchPromise;
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});
