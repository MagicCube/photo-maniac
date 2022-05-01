import { useEffect, useState } from 'react';

import { StorageService } from '@/storage';
import type { Photo } from '@/types';

export function RecentPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>(
    StorageService.data.recentPhotos
  );
  useEffect(() => {
    StorageService.update().then(() => {
      setPhotos(StorageService.data.recentPhotos);
    });
  }, []);
  return (
    <div>
      <header>
        <h3>Recent Photos</h3>
      </header>
      <main>
        {photos.length > 1 ? (
          <ul className="pm-photo-list">
            {photos.map((photo, i) =>
              i > 0 && i < 10 ? (
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
