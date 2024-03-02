// service-worker.js

const CACHE_NAME = "video-cache";
const VIDEO_URL =
  "/bg-video/3457_particles_blue_animation_Background4fVidevo.mov";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.add(VIDEO_URL);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return the cached video
      if (response) {
        return response;
      }
      // Not in cache - fetch the video from the network
      return fetch(event.request);
    })
  );
});
