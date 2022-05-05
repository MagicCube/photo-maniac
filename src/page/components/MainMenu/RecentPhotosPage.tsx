import { useEffect, useState } from 'react';

import { StorageService } from '@/storage';
import type { Photo } from '@/types';

export interface RecentPhotosPage {
  onPhotoSelect: (photo: Photo) => void;
}

export function RecentPhotosPage({ onPhotoSelect }: RecentPhotosPage) {
  const [photos, setPhotos] = useState<Photo[]>(
    StorageService.data.recentPhotos
  );
  useEffect(() => {
    StorageService.update().then(() => {
      console.info('RecentPhotosPage: useEffect', StorageService.data);
      setPhotos(StorageService.data.recentPhotos);
    });
  }, []);
  return (
    <div className="page">
      <header>
        <h3>Recent Photos</h3>
      </header>
      <main>
        {photos.length > 0 ? (
          <ul className="pm-photo-list">
            {photos.map((photo) => (
              <li key={photo.id}>
                <a
                  style={{
                    backgroundImage: `url(${photo.images[0].webpUrl})`,
                  }}
                  onClick={() => onPhotoSelect(photo)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="hint">Hoops, seems like no photo here.</div>
        )}
      </main>
    </div>
  );
}
