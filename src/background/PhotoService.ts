import type { Message } from '@/messaging';
import { StorageService } from '@/storage';
import type { Photo } from '@/types';
import { shuffle } from '@/util/shuffle';

import { queryPhotos } from './queries';

export class PhotoService {
  static readonly instance = new PhotoService();

  readonly photos: {
    all: Photo[];
    stack: Photo[];
  } = {
    all: [],
    stack: [],
  };

  constructor() {
    this._loadFromStorage();
  }

  start() {
    this.updatePhotos();
    setInterval(() => {
      this.updatePhotos();
    }, 30 * 60 * 1000);
  }

  async updatePhotos() {
    console.info('Updating photos...');
    await StorageService.instance.update();
    const categories = StorageService.instance.data.categories;
    const photosFromServer = await queryPhotos({
      feature: 'editors',
      filters: [
        { key: 'CATEGORY', value: categories.join(',') },
        { key: 'FOLLOWERS_COUNT', value: 'gte:0' },
      ],
      count: 200,
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
    await this.prefetchNextPhoto();
    await chrome.runtime.sendMessage({
      type: 'photomaniac.events.photosUpdated',
    } as Message);
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
    await StorageService.instance.saveNextPhoto(photo);
  }

  private async _loadFromStorage() {
    const results = StorageService.instance.data;
    if (results) {
      this.photos.all = results.allPhotos;
      this.photos.stack = [...results.allPhotos];
      console.info(
        `${this.photos.all.length} photos loaded from local storage.`
      );
      this._shuffle();
    }
  }

  private async _saveToLocalStorage() {
    StorageService.instance.saveAllPhotos(this.photos.all);
    console.info(`${this.photos.stack.length} photos saved to local storage.`);
  }

  private _shuffle() {
    shuffle(this.photos.all);
    shuffle(this.photos.stack);
  }
}
