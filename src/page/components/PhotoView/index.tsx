import type { Photo } from '@/types';

export interface PhotoViewProps {
  data: Photo | null;
  onError: () => void;
}

export function PhotoView({ data, onError }: PhotoViewProps) {
  if (data) {
    let url = data?.images[0].webpUrl;
    if (url === 'local') {
      url = `/${data.legacyId}.jpeg`;
    }
    return (
      <img
        className="pm-photo-view"
        src={url}
        onError={() => {
          onError();
        }}
      />
    );
  }
  return null;
}
