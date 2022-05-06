import { logger } from '@/logging';

const CACHE_NAME = 'photo-maniac-prefetch';

class PrefetchServiceImpl {
  constructor() {
    self.addEventListener('fetch', (event: FetchEvent) => {
      event.respondWith(this.resolve(event.request.url));
    });
  }

  async resolve(url: string) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      logger.info('Cached request', url);
    }
    return cachedResponse?.clone() || fetch(url);
  }

  async prefetch(url: string) {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(url);
    await cache.put(url, response);
    return response;
  }
}

export const PrefetchService = new PrefetchServiceImpl();
