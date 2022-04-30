import { useCallback, useEffect, useState } from 'react';

import { FALLBACK_PHOTOS } from '@/cached-data/fallback-photos';
import { MessageService } from '@/messaging';
import { StorageService } from '@/storage';
import type { Photo } from '@/types';

import { MainMenu } from '../components/MainMenu';
import { PhotoInfo } from '../components/PhotoInfo';
import { PhotoView } from '../components/PhotoView';

export function App() {
  const [feature, setFeature] = useState<string>('editors');
  const [categories, setCategories] = useState<number[]>([]);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [fallback, setFallback] = useState(false);
  const update = useCallback(() => {
    StorageService.instance.update().then(() => {
      const photo = StorageService.instance.data.nextPhoto;
      console.info(photo);
      document.title = `New Tab${photo?.name && ` - ${photo.name}`}`;
      setPhoto(photo);
      MessageService.instance.publish('photomaniac.commands.nextPhoto');
    });
  }, []);
  useEffect(() => {
    update();
    setFeature(StorageService.instance.data.feature);
    setCategories(StorageService.instance.data.categories);
    MessageService.instance.subscribe(
      'photomaniac.events.photosUpdated',
      update
    );
  }, [update]);
  const handleFeatureChange = useCallback((value: string) => {
    setFeature(value);
    StorageService.instance.saveFeature(value);
  }, []);
  const handleCategoriesChange = useCallback((values: number[]) => {
    setCategories(values);
    StorageService.instance.saveCategories(values);
  }, []);
  const handleUpdate = useCallback(() => {
    MessageService.instance.publish('photomaniac.commands.updatePhotos');
  }, []);
  const handleError = useCallback(() => {
    if (fallback) {
      return;
    }
    setFallback(true);
    const fallbackPhoto =
      FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)];
    setPhoto(fallbackPhoto);
    console.info(fallbackPhoto);
  }, [fallback]);
  return (
    <div className="pm-app">
      <div className="pm-photo-view-container">
        <PhotoView data={photo} onError={handleError} />
      </div>
      <div className="pm-main-menu-container">
        <MainMenu
          feature={feature}
          categories={categories}
          onFeatureChange={handleFeatureChange}
          onCategoriesChange={handleCategoriesChange}
          onUpdateClick={handleUpdate}
        />
      </div>
      <div className="pm-photo-info-container">
        <PhotoInfo data={photo} />
      </div>
    </div>
  );
}
