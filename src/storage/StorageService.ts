import { CACHED_PHOTOS } from '@/cached-data/photos';
import type { Photo } from '@/types';
import { shuffle } from '@/util/shuffle';

interface StoredData {
  feature: string;
  categories: number[];
  allPhotos: Photo[];
  nextPhoto: Photo | null;
}

const DEFAULT_DATA: StoredData = {
  feature: 'editors',
  categories: [29, 13, 27, 30],
  allPhotos: shuffle(CACHED_PHOTOS),
  nextPhoto: CACHED_PHOTOS[Math.floor(Math.random() * CACHED_PHOTOS.length)],
};

export class StorageService {
  static readonly instance = new StorageService();

  private _data: StoredData = {
    ...DEFAULT_DATA,
  };

  get data() {
    return this._data;
  }

  async saveFeature(feature: string) {
    this._data.feature = feature;
    await this._saveToStorage('feature');
  }

  async saveCategories(categoryIds: number[]) {
    this._data.categories = categoryIds;
    await this._saveToStorage('categories');
  }

  async saveAllPhotos(photos: Photo[]) {
    this._data.allPhotos = photos;
    await this._saveToStorage('allPhotos');
  }

  async saveNextPhoto(photo: Photo) {
    this._data.nextPhoto = photo;
    await this._saveToStorage('nextPhoto');
  }

  async update() {
    await this._loadFromStorage();
  }

  async _loadFromStorage() {
    if (!supportStorage()) {
      this._data = {
        ...DEFAULT_DATA,
      };
      return;
    }
    // Sync Data
    const syncData = (await chrome.storage.sync.get(
      Object.keys(this._data)
    )) as StoredData;
    if (syncData.feature) {
      this._data.feature = syncData.feature;
    } else {
      this._data.feature = DEFAULT_DATA.feature;
    }
    if (syncData.categories) {
      this._data.categories = syncData.categories;
    } else {
      this._data.categories = DEFAULT_DATA.categories;
    }
    // Local Data
    const localData = (await chrome.storage.local.get(
      Object.keys(this._data)
    )) as StoredData;
    if (localData.allPhotos) {
      this._data.allPhotos = localData.allPhotos;
    } else {
      this._data.allPhotos = DEFAULT_DATA.allPhotos;
    }
    if (localData.nextPhoto) {
      this._data.nextPhoto = localData.nextPhoto;
    } else if (localData.allPhotos?.length) {
      this._data.nextPhoto = DEFAULT_DATA.nextPhoto;
    }
  }

  async _saveToStorage(key: keyof StoredData) {
    if (supportStorage()) {
      if (['feature', 'categories'].includes(key)) {
        await chrome.storage.sync.set({ [key]: this._data[key] });
      } else {
        await chrome.storage.local.set({ [key]: this._data[key] });
      }
    }
  }
}

function supportStorage() {
  return chrome.storage?.sync && chrome.storage.local;
}
