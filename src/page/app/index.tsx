import { useEffect, useState } from 'react';

import type { Photo } from '@/types';
import type { Message } from '@/messaging';

import { nextPhoto } from '../storage';
import { PhotoView } from '../components/PhotoView';

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
    </div>
  );
}
