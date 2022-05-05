import type {
  Message,
  PhotosUpdatedEventPayload,
  UpdatePhotosCommandPayload,
} from '@/messaging';
import { MessageService } from '@/messaging';
import { queryPhotos } from '@/graphql/queries';
import { StorageService } from '@/storage';
import type { Photo } from '@/types';
import { getCategoryName } from '@/util/category';
import { getFeatureName } from '@/util/feature';
import { shuffle } from '@/util/shuffle';

import { PrefetchService } from './PrefetchService';

class PhotoServiceImpl {
  readonly photos: {
    all: Photo[];
    stack: Photo[];
    recent: Photo[];
  } = {
    all: [],
    stack: [],
    recent: [],
  };

  constructor() {
    MessageService.subscribe('photomaniac.commands.nextPhoto', () => {
      this.prefetchNextPhoto();
    });
    MessageService.subscribe(
      'photomaniac.commands.updatePhotos',
      (message: Message<UpdatePhotosCommandPayload>) => {
        this.updatePhotos({
          initiatedByCommand: true,
          tabId: message.payload?.tabId,
        });
      }
    );
  }

  async start() {
    await this._loadFromStorage();
    await this.updatePhotos();
    setInterval(() => {
      this.updatePhotos();
    }, 60 * 60 * 1000);
  }

  async updatePhotos(
    options: { initiatedByCommand?: boolean; tabId?: number } = {}
  ) {
    await StorageService.update();
    const feature = StorageService.data.feature;
    const categories = StorageService.data.categories;
    console.info(
      `Updating ${getFeatureName(feature)} photos of [${categories
        .map((c) => getCategoryName(c))
        .join(', ')}]...`
    );
    const params = {
      feature,
      filters: [
        { key: 'CATEGORY', value: categories.join(',') },
        { key: 'FOLLOWERS_COUNT', value: 'gte:0' },
      ],
      count: 200,
    };
    let result: Awaited<ReturnType<typeof queryPhotos>> = {
      photos: [],
      hasNextPage: true,
    };
    const photosFromServer: Photo[] = [];
    while (result.hasNextPage && photosFromServer.length < 200) {
      result = await queryPhotos({
        ...params,
        cursor: result.endCursor,
      });
      const filteredPhotos = result.photos.filter(
        (photo) => !photo.notSafeForWork && photo.width / photo.height >= 1
      );
      photosFromServer.push(...filteredPhotos);
    }
    this.photos.all = photosFromServer;
    this.photos.stack = [...photosFromServer];
    await this._saveToLocalStorage();
    this._shuffle();
    console.info(`${photosFromServer.length} photos updated from 500px.`);
    await this.prefetchNextPhoto();
    if (options.initiatedByCommand) {
      MessageService.publish<PhotosUpdatedEventPayload>({
        type: 'photomaniac.events.photosUpdated',
        payload: {
          tabId: options.tabId,
        },
      });
    }
  }

  async prefetchNextPhoto() {
    await StorageService.update();
    if (this.photos.stack.length === 0) {
      this.photos.stack = shuffle([...this.photos.all]);
    }
    let nextPhoto = this.photos.stack.pop();
    while (nextPhoto && StorageService.data.blacklist.includes(nextPhoto.id)) {
      nextPhoto = this.photos.stack.pop();
    }
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
      this.photos.recent = results.recentPhotos;
      console.info(
        `${this.photos.all.length} photos loaded from local storage.`
      );
      this._shuffle();
    }
  }

  private async _saveToLocalStorage() {
    await StorageService.saveAllPhotos(this.photos.all);
    console.info(`${this.photos.stack.length} photos saved to local storage.`);
  }

  private _shuffle() {
    shuffle(this.photos.all);
    shuffle(this.photos.stack);
  }
}

export const PhotoService = new PhotoServiceImpl();
