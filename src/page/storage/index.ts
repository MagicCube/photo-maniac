import type { Photo } from '@/types';

import { localPhotos } from '@/cached-data/local-photos';

export async function nextPhoto(): Promise<Photo | null> {
  try {
    const store = await chrome.storage.local.get(['photo.next']);
    if (store && store['photo.next']) {
      return store['photo.next'];
    }
  } catch {}
  return localPhotos[Math.floor(Math.random() * localPhotos.length)];
}
