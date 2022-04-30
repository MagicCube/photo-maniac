import { useCallback, useEffect, useState } from 'react';

import { MessageService } from '@/messaging';
import { StorageService } from '@/storage';
import type { Photo } from '@/types';

import { MainMenu } from '../components/MainMenu';
import { PhotoInfo } from '../components/PhotoInfo';
import { PhotoView } from '../components/PhotoView';

export function App() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [categories, setCategories] = useState<number[]>([]);
  const update = useCallback(() => {
    StorageService.instance.update().then(() => {
      setPhoto(StorageService.instance.data.nextPhoto);
      MessageService.instance.publish('photomaniac.commands.nextPhoto');
    });
  }, []);
  useEffect(() => {
    update();
    setCategories(StorageService.instance.data.categories);
    MessageService.instance.subscribe(
      'photomaniac.events.photosUpdated',
      update
    );
  }, []);
  const handleSelectedCategoriesChanged = useCallback(
    (changedSelections: number[]) => {
      setCategories(changedSelections);
      StorageService.instance.saveCategories(changedSelections);
    },
    []
  );
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
          selections={categories}
          onSelectedCategoriesChanged={handleSelectedCategoriesChanged}
          onUpdateClick={handleUpdate}
        />
      </div>
      <div className="pm-photo-info-container">
        <PhotoInfo data={photo} />
      </div>
    </div>
  );
}
