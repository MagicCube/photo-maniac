import type { Photo } from '@/types';
import { shuffle } from '@/util/shuffle';

import { queryPhotos } from './queries';

export class PhotoService {
  readonly photos: {
    all: Photo[];
    stack: Photo[];
  } = {
    all: [],
    stack: [],
  };

  constructor() {
    this._loadFromLocalStorage();
    this.updatePhotos();
  }

  start() {
    setInterval(() => {
      this.updatePhotos();
    }, 30 * 60 * 1000);
  }

  async updatePhotos() {
    console.info('Updating photos...');
    const photosFromServer = await queryPhotos({
      feature: 'editors',
      filters: [
        { key: 'CATEGORY', value: '29' },
        { key: 'FOLLOWERS_COUNT', value: 'gte:0' },
      ],
      count: 100,
    });
    const filteredPhotos = photosFromServer.filter(
      (photo) => photo.width / photo.height > 1.2
    );
    this.photos.all = filteredPhotos;
    this.photos.stack = [...filteredPhotos];
    await this._saveToLocalStorage();
    this._shuffle();
    console.info(
      `${filteredPhotos.length}/${photosFromServer.length} photos updated from 500px.`
    );
    this.prefetchNextPhoto();
  }

  async prefetchNextPhoto() {
    if (this.photos.stack.length === 0) {
      this.photos.stack = shuffle([...this.photos.all]);
    }
    const nextPhoto = this.photos.stack.pop();
    if (nextPhoto) {
      await this._prefetchPhoto(nextPhoto);
    }
  }

  private async _prefetchPhoto(photo: Photo) {
    const url = photo.images[0].webpUrl;
    console.info(`Prefetching ${url}...`);
    try {
      await fetch(url);
    } catch {}
    await chrome.storage.local.set({
      'photo.next': photo,
    });
  }

  private async _loadFromLocalStorage() {
    const results = await chrome.storage.local.get(['photos.all']);
    if (results) {
      this.photos.all = results['photos.all'] || [];
      this.photos.stack = [...this.photos.all];
      console.info(
        `${this.photos.all.length} photos loaded from local storage.`
      );
      this._shuffle();
    }
  }

  private async _saveToLocalStorage() {
    await chrome.storage.local.set({
      'photos.all': this.photos.all,
    });
    console.info(`${this.photos.stack.length} photos saved to local storage.`);
  }

  private _shuffle() {
    shuffle(this.photos.all);
    shuffle(this.photos.stack);
  }
}
