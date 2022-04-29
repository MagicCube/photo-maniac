import { useEffect, useState } from 'react';

import type { Message } from '@/messaging';
import type { Photo } from '@/types';

import { PhotoInfo } from '../components/PhotoInfo';
import { PhotoView } from '../components/PhotoView';
import { nextPhoto } from '../storage';

export function App() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  useEffect(() => {
    nextPhoto().then((photo) => {
      setPhoto(photo);
      chrome.runtime.sendMessage({
        type: 'photomaniac.commands.nextPhoto',
      } as Message);
    });
  }, []);
  return (
    <div className="pm-app">
      <div className="pm-photo-view-container">
        <PhotoView data={photo} />
      </div>
      <div className="pm-photo-info-container">
        <PhotoInfo data={photo} />
      </div>
    </div>
  );
}
