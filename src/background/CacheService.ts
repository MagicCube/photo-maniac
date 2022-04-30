const CACHE_NAME = 'photo-maniac-images';

class CacheServiceImpl {
  async resolveResponse(url: string) {
    return caches.open(CACHE_NAME).then((cache) => {
      return cache.match(url).then((cachedResponse) => {
        if (cachedResponse) {
          console.info('Cached request', url);
        }
        return cachedResponse?.clone() || fetch(url);
      });
    });
  }

  async cacheResponse(url: string) {
    try {
      return caches.open(CACHE_NAME).then((cache) => {
        fetch(url).then((response) => {
          cache.put(url, response);
          return response;
        });
      });
    } catch {}
  }
}

export const CacheService = new CacheServiceImpl();
