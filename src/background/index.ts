import { StorageService } from '@/storage';
import { PrefetchService } from './PrefetchService';

import { PhotoService } from './PhotoService';

async function main() {
  await StorageService.update();
  PhotoService.start();
}

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(PrefetchService.resolve(event.request.url));
});

main();
