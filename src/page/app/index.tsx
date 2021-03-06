import { useCallback, useEffect, useState } from 'react';

import { FALLBACK_PHOTOS } from '@/cached-data/fallback-photos';
import { logger } from '@/logging';
import type {
  PhotosUpdatedEventPayload,
  UpdatePhotosCommandPayload,
} from '@/messaging';
import { MessageService } from '@/messaging';
import { StorageService } from '@/storage';
import type { Photo } from '@/types';

import { MainMenu } from '../components/MainMenu';
import { PhotoInfo } from '../components/PhotoInfo';
import { PhotoView } from '../components/PhotoView';

import { Message } from './Message';

export function App() {
  const [feature, setFeature] = useState<string>('editors');
  const [categories, setCategories] = useState<number[]>([]);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [fallback, setFallback] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const changePhoto = useCallback((photo: Photo) => {
    setPhoto(photo);
    document.title = `New Tab${photo?.name && ` - ${photo.name}`}`;
    logger.info(`Photo${photo?.name && ` - ${photo.name}`}`, photo);
  }, []);

  const update = useCallback(async () => {
    await StorageService.update();
    const photo = StorageService.data.nextPhoto;
    if (photo) {
      changePhoto(photo);
      await StorageService.addToRecent(photo);
      MessageService.publish('photomaniac.commands.nextPhoto');
    }
  }, [changePhoto]);
  const fallbackToNextPhoto = useCallback(() => {
    if (fallback) {
      return;
    }
    setFallback(true);
    const fallbackPhoto =
      FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)];
    changePhoto(fallbackPhoto);
  }, [changePhoto, fallback]);
  useEffect(() => {
    MessageService.subscribe<PhotosUpdatedEventPayload>(
      'photomaniac.events.photosUpdated',
      async ({ payload }) => {
        const currentTab = await chrome.tabs.getCurrent();
        if (payload && currentTab.id === payload.tabId) {
          update();
          setUpdating(false);
        }
      }
    );
    setFeature(StorageService.data.feature);
    setCategories(StorageService.data.categories);
    if (navigator.onLine) {
      update();
    } else {
      fallbackToNextPhoto();
    }
  }, [fallbackToNextPhoto, update]);
  const handleFeatureChange = useCallback((value: string) => {
    setFeature(value);
    StorageService.saveFeature(value);
  }, []);
  const handleCategoriesChange = useCallback((values: number[]) => {
    setCategories(values);
    StorageService.saveCategories(values);
  }, []);
  const handlePhotoSelect = useCallback(
    (photo: Photo) => {
      changePhoto(photo);
    },
    [changePhoto]
  );
  const handleUpdateClick = useCallback(async () => {
    setUpdating(true);
    const tab = await chrome.tabs.getCurrent();
    MessageService.publish<UpdatePhotosCommandPayload>({
      type: 'photomaniac.commands.updatePhotos',
      payload: {
        tabId: tab.id,
      },
    });
  }, []);
  const handleError = useCallback(() => {
    fallbackToNextPhoto();
  }, [fallbackToNextPhoto]);
  return (
    <div className="pm-app">
      <div className="pm-message-container">
        <Message />
      </div>
      <div className="pm-photo-view-container">
        <PhotoView data={photo} onError={handleError} />
      </div>
      <div className="pm-main-menu-container">
        <MainMenu
          feature={feature}
          categories={categories}
          isUpdating={isUpdating}
          onFeatureChange={handleFeatureChange}
          onCategoriesChange={handleCategoriesChange}
          onPhotoSelect={handlePhotoSelect}
          onUpdateClick={handleUpdateClick}
        />
      </div>
      <div className="pm-photo-info-container">
        <PhotoInfo data={photo} />
      </div>
    </div>
  );
}
