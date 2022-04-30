import { CACHED_PHOTOS } from '@/cached-data/photos';
import type { Photo } from '@/types';
import { shuffle } from '@/util/shuffle';

interface StoredData {
  allPhotos: Photo[];
  nextPhoto: Photo | null;
  categories: number[];
}

export class StorageService {
  static readonly instance = new StorageService();

  private _data: StoredData = {
    allPhotos: [],
    nextPhoto: null,
    categories: [],
  };

  get data() {
    return this._data;
  }

  async saveAllPhotos(photos: Photo[]) {
    this._data.allPhotos = photos;
    await this._saveToStorage('allPhotos');
  }

  async saveNextPhoto(photo: Photo) {
    this._data.nextPhoto = photo;
    await this._saveToStorage('nextPhoto');
  }

  async saveCategories(categoryIds: number[]) {
    this._data.categories = categoryIds;
    await this._saveToStorage('categories');
  }

  async update() {
    await this._loadFromStorage();
  }

  async _loadFromStorage() {
    if (!supportStorage()) {
      this._data = {
        allPhotos: shuffle(CACHED_PHOTOS),
        nextPhoto:
          CACHED_PHOTOS[Math.floor(Math.random() * CACHED_PHOTOS.length)],
        categories: [29, 13, 27, 30],
      };
      return;
    }
    const localData = (await chrome.storage.local.get(
      Object.keys(this._data)
    )) as StoredData;
    const syncData = (await chrome.storage.sync.get(
      Object.keys(this._data)
    )) as StoredData;
    if (localData.allPhotos) {
      this._data.allPhotos = localData.allPhotos;
    } else {
      this._data.allPhotos = CACHED_PHOTOS;
    }
    if (localData.nextPhoto) {
      this._data.nextPhoto = localData.nextPhoto;
    } else if (localData.allPhotos?.length) {
      this._data.nextPhoto = this._data.allPhotos[0];
    }
    // Sync Data
    if (syncData.categories) {
      this._data.categories = syncData.categories;
    } else {
      this._data.categories = [29, 13, 27, 30];
    }
  }

  async _saveToStorage(key: keyof StoredData) {
    if (supportStorage()) {
      if (key === 'categories') {
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
