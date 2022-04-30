import { MessageService } from '@/messaging';
import { StorageService } from '@/storage';
import type { Photo } from '@/types';
import { getCategoryName } from '@/util/category';
import { getFeatureName } from '@/util/feature';
import { shuffle } from '@/util/shuffle';
import { PrefetchService } from './PrefetchService';

import { queryPhotos } from './queries';

class PhotoServiceImpl {
  readonly photos: {
    all: Photo[];
    stack: Photo[];
  } = {
    all: [],
    stack: [],
  };

  constructor() {
    this._loadFromStorage();
    MessageService.subscribe('photomaniac.commands.nextPhoto', () => {
      this.prefetchNextPhoto();
    });
    MessageService.subscribe('photomaniac.commands.updatePhotos', () => {
      this.updatePhotos();
    });
  }

  start() {
    this.updatePhotos();
    setInterval(() => {
      this.updatePhotos();
    }, 30 * 60 * 1000);
  }

  async updatePhotos() {
    await StorageService.update();
    const feature = StorageService.data.feature;
    const categories = StorageService.data.categories;
    console.info(
      `Updating ${getFeatureName(feature)} photos of [${categories
        .map((c) => getCategoryName(c))
        .join(', ')}]...`
    );
    const photosFromServer = await queryPhotos({
      feature,
      filters: [
        { key: 'CATEGORY', value: categories.join(',') },
        { key: 'FOLLOWERS_COUNT', value: 'gte:0' },
      ],
      count: 200,
    });
    const filteredPhotos = photosFromServer.filter(
      (photo) => !photo.notSafeForWork && photo.width / photo.height >= 1
    );
    this.photos.all = filteredPhotos;
    this.photos.stack = [...filteredPhotos];
    await this._saveToLocalStorage();
    this._shuffle();
    console.info(
      `${filteredPhotos.length}/${photosFromServer.length} photos updated from 500px.`
    );
    await this.prefetchNextPhoto();
    MessageService.publish('photomaniac.events.photosUpdated');
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
    await PrefetchService.prefetch(url);
    await StorageService.saveNextPhoto(photo);
  }

  private async _loadFromStorage() {
    const results = StorageService.data;
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
    StorageService.saveAllPhotos(this.photos.all);
    console.info(`${this.photos.stack.length} photos saved to local storage.`);
  }

  private _shuffle() {
    shuffle(this.photos.all);
    shuffle(this.photos.stack);
  }
}

export const PhotoService = new PhotoServiceImpl();
