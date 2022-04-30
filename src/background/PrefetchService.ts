const CACHE_NAME = 'photo-maniac-prefetch';

class PrefetchServiceImpl {
  async resolve(url: string) {
    return caches.open(CACHE_NAME).then((cache) => {
      return cache.match(url).then((cachedResponse) => {
        if (cachedResponse) {
          console.info('Cached request', url);
        }
        return cachedResponse?.clone() || fetch(url);
      });
    });
  }

  prefetch(url: string) {
    return caches.open(CACHE_NAME).then((cache) => {
      return fetch(url).then((response) => {
        cache.put(url, response);
        return response;
      });
    });
  }
}

export const PrefetchService = new PrefetchServiceImpl();
