import { useCallback, useEffect, useState } from 'react';

import type { Message } from '@/messaging';
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
      if (chrome?.runtime) {
        chrome.runtime.sendMessage({
          type: 'photomaniac.commands.nextPhoto',
        } as Message);
      }
    });
  }, []);
  useEffect(() => {
    update();
    setCategories(StorageService.instance.data.categories);
    if (chrome?.runtime) {
      chrome.runtime.onMessage.addListener(
        (message: Message, sender, sendResponse) => {
          const { type } = message;
          console.info('Received message:', message);
          if (type === 'photomaniac.events.photosUpdated') {
            update();
            sendResponse({
              successful: true,
            });
          }
        }
      );
    }
  }, []);
  const handleSelectedCategoriesChanged = useCallback(
    (changedSelections: number[]) => {
      setCategories(changedSelections);
      StorageService.instance.saveCategories(changedSelections);
    },
    []
  );
  const handleUpdate = useCallback(() => {
    if (chrome?.runtime) {
      chrome.runtime.sendMessage({
        type: 'photomaniac.commands.updatePhotos',
      } as Message);
    }
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
