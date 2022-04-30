import { StorageService } from '@/storage';

import { PhotoService } from './PhotoService';

async function main() {
  await StorageService.instance.update();
  PhotoService.instance.start();
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('image-cache').then((cache) => {
      return cache.match(event.request.url).then((cachedResponse) => {
        if (cachedResponse) {
          console.info('Cached request', event.request.url);
        }
        return cachedResponse?.clone() || fetch(event.request);
      });
    })
  );
});

main();
