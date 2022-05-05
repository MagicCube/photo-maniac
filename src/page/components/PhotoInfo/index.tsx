import { useCallback, useEffect } from 'react';

import type { Photo } from '@/types';
import { formatCategoryName } from '@/util/category';

export interface PhotoInfoProps {
  data: Photo | null;
}

export function PhotoInfo({ data }: PhotoInfoProps) {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      console.info(event.key);
      if (event.key.toLowerCase() === 'v' && data?.legacyId) {
        event.preventDefault();
        window.open(`https://500px.com/photo/${data.legacyId}/`);
      }
    },
    [data]
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, true);
    return () => {
      window.removeEventListener('keydown', handleKeydown, true);
    };
  }, [handleKeydown]);
  if (data) {
    const locationURL = new URL(`https://www.google.com/maps/search/?q=`);
    if (data.location) {
      locationURL.searchParams.set('q', data.location);
    }
    return (
      <div className="pm-photo-info">
        <a
          className="pm-photo-info-name"
          rel="noopener noreferrer"
          target="_blank"
          href={`https://500px.com/photo/${data.legacyId}/`}
        >
          {data.name}
        </a>
        <div className="pm-photo-info-details">
          <span>
            <a
              className="pm-photo-info-photographer"
              rel="noopener noreferrer"
              target="_blank"
              href={`https://500px.com/p/${data.photographer.username}/`}
            >
              {data.photographer.displayName}
            </a>
          </span>
          {data.location ? (
            <span>
              <a
                className="pm-photo-info-location"
                rel="noopener noreferrer"
                target="_blank"
                href={locationURL.toString()}
              >
                {data.location}
              </a>
            </span>
          ) : null}
          <span className="pm-photo-info-category">
            #{formatCategoryName(data.category)}
          </span>
        </div>
      </div>
    );
  }
  return null;
}
