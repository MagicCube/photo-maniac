import { useEffect, useState } from 'react';

import { StorageService } from '@/storage';
import type { Photo } from '@/types';

export interface RecentPhotosPage {
  onNavigateHome: () => void;
}

export function RecentPhotosPage({ onNavigateHome }: RecentPhotosPage) {
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
          <h3>
            <a onClick={onNavigateHome}>Home</a>
          </h3>
          <h3>Recent Photos</h3>
        </div>
      </header>
      <main>
        {photos.length > 1 ? (
          <ul className="pm-photo-list">
            {photos.map((photo, i) =>
              i > 0 && i < 4 * 3 + 1 ? (
                <li key={photo.id}>
                  <a
                    style={{
                      backgroundImage: `url(${photo.images[0].webpUrl})`,
                    }}
                    target="_blank"
                    rel="noreferrer"
                    href={`https://500px.com/photo/${photo.legacyId}/`}
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
