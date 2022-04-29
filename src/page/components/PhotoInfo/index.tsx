import type { Photo } from '@/types';

export interface PhotoInfoProps {
  data: Photo | null;
}

export function PhotoInfo({ data }: PhotoInfoProps) {
  if (data) {
    const locationURL = new URL(`https://www.google.com/maps/search/?q=`);
    if (data.location) {
      locationURL.searchParams.set('q', data.location);
    }
    if (data)
      return (
        <div className="pm-photo-info">
          <a
            className="pm-photo-info-name"
            target="_blank"
            href={`https://500px.com/photo/${data.legacyId}/`}
          >
            {data.name}
          </a>
          {data.location ? (
            <a
              className="pm-photo-info-location"
              target="_blank"
              href={locationURL.toString()}
            >
              {data.location}
            </a>
          ) : null}
        </div>
      );
  }
  return null;
}
