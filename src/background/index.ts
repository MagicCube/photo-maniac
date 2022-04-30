import { StorageService } from '@/storage';
import { CacheService } from './CacheService';

import { PhotoService } from './PhotoService';

async function main() {
  await StorageService.update();
  PhotoService.start();
}

self.addEventListener('fetch', (event) => {
  event.respondWith(CacheService.resolveResponse(event.request.url));
});

main();
