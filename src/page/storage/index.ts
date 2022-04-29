import type { Photo } from '@/types';

import { localPhotos } from './local-photos';

export async function nextPhoto(): Promise<Photo | null> {
  const store = await chrome.storage.local.get(['photo.next']);
  if (store && store['photo.next']) {
    return store['photo.next'];
  }
  return localPhotos[Math.floor(Math.random() * localPhotos.length)];
}
