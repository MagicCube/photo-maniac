import { useCallback, useEffect, useState } from 'react';

import type { Message } from '@/messaging';
import type { Photo } from '@/types';

import { PhotoCategorySelector } from '../components/PhotoCategorySelector';
import { PhotoInfo } from '../components/PhotoInfo';
import { PhotoView } from '../components/PhotoView';
import { nextPhoto } from '../storage';

export function App() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [categories, setCategories] = useState<number[]>([]);
  useEffect(() => {
    nextPhoto().then((photo) => {
      setPhoto(photo);
      if (chrome?.runtime) {
        chrome.runtime.sendMessage({
          type: 'photomaniac.commands.nextPhoto',
        } as Message);
      }
    });
    if (chrome?.storage?.local) {
      chrome.storage.local.get('categories').then((result) => {
        result.categories && setCategories(result.categories);
      });
    }
  }, []);
  const handleCategoryChange = useCallback((changedSelections: number[]) => {
    setCategories(changedSelections);
    if (chrome?.storage) {
      chrome.storage.local.set({ categories: changedSelections });
    }
  }, []);
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
      <div className="pm-photo-category-selector-container">
        <PhotoCategorySelector
          selections={categories}
          onChange={handleCategoryChange}
          onUpdate={handleUpdate}
        />
      </div>
      <div className="pm-photo-info-container">
        <PhotoInfo data={photo} />
      </div>
    </div>
  );
}
