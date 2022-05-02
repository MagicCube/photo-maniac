import { useEffect, useState } from 'react';

import { StorageService } from '@/storage';
import type { Photo } from '@/types';

export interface RecentPhotosPage {
  onPhotoSelect: (photo: Photo) => void;
  onNavigateHome: () => void;
}

export function RecentPhotosPage({
  onPhotoSelect,
  onNavigateHome,
}: RecentPhotosPage) {
  const [photos, setPhotos] = useState<Photo[]>(
    StorageService.data.recentPhotos
  );
  useEffect(() => {
    StorageService.update().then(() => {
      setPhotos(StorageService.data.recentPhotos);
    });
  }, []);
  return (
    <div className="page">
      <header>
        <div className="breadcrumbs">
          <a onClick={onNavigateHome}>Home</a>
          <span>Recent Photos</span>
        </div>
      </header>
      <main>
        {photos.length > 1 ? (
          <ul className="pm-photo-list">
            {photos.map((photo, i) =>
              i > 0 && i < 3 * 4 + 1 ? (
                <li key={photo.id}>
                  <a
                    style={{
                      backgroundImage: `url(${photo.images[0].webpUrl})`,
                    }}
                    onClick={() => onPhotoSelect(photo)}
                  />
                </li>
              ) : null
            )}
          </ul>
        ) : (
          <div className="hint">Hoops, seems like no photo here.</div>
        )}
      </main>
    </div>
  );
}
