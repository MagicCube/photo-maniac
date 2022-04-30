import { useCallback, useEffect, useState } from 'react';

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
  const update = useCallback(() => {
    StorageService.instance.update().then(() => {
      setPhoto(StorageService.instance.data.nextPhoto);
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
  }, []);
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
  return (
    <div className="pm-app">
      <div className="pm-photo-view-container">
        <PhotoView data={photo} />
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
