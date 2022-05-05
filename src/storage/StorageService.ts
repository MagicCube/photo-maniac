import { CACHED_PHOTOS } from '@/cached-data/all-photos';
import type { Photo } from '@/types';
import { shuffle } from '@/util/shuffle';

interface StoredData {
  feature: string;
  categories: number[];
  allPhotos: Photo[];
  recentPhotos: Photo[];
  blacklist: string[];
  nextPhoto: Photo | null;
}

const TMP_NEXT_PHOTO =
  CACHED_PHOTOS[Math.floor(Math.random() * CACHED_PHOTOS.length)];
const DEFAULT_DATA: StoredData = {
  feature: 'editors',
  categories: [29, 13, 27, 30],
  allPhotos: shuffle(CACHED_PHOTOS),
  recentPhotos: [TMP_NEXT_PHOTO],
  blacklist: [],
  nextPhoto: TMP_NEXT_PHOTO,
};

class StorageServiceImpl {
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

  async addToRecent(photo: Photo) {
    await this.update();
    const recentPhotos = this.data.recentPhotos;
    if (recentPhotos.find((p) => p.id === photo.id)) {
      return;
    }
    recentPhotos.unshift(photo);
    while (recentPhotos.length > 12) {
      recentPhotos.pop();
    }
    await this._saveToStorage('recentPhotos');
  }

  async addToBlacklist(photo: Photo) {
    await this.update();
    if (this.data.blacklist.find((id) => id === photo.id)) {
      return;
    }
    this.data.blacklist.push(photo.id);
    await this._saveToStorage('blacklist');
  }

  async update() {
    await this._loadFromStorage();
  }

  private async _loadFromStorage() {
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
    if (localData.recentPhotos) {
      this._data.recentPhotos = localData.recentPhotos;
    } else if (this._data.nextPhoto) {
      this._data.recentPhotos = [];
    }
    if (localData.blacklist) {
      this._data.blacklist = localData.blacklist;
    } else if (this._data.nextPhoto) {
      this._data.blacklist = [];
    }
  }

  private async _saveToStorage(key: keyof StoredData) {
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

export const StorageService = new StorageServiceImpl();
