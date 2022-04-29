import { useEffect, useState } from 'react';

import type { Message } from '@/messaging';
import type { Photo } from '@/types';

import { nextPhoto } from '../../storage';

export function PhotoView() {
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
    <div
      className="photoView"
      style={{
        backgroundImage: `url(${photo?.images[0].webpUrl})`,
      }}
    ></div>
  );
}
