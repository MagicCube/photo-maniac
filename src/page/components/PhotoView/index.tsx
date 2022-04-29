import type { Photo } from '@/types';

export interface PhotoViewProps {
  data: Photo | null;
}

export function PhotoView({ data }: PhotoViewProps) {
  if (data) {
    const url = data?.images[0].webpUrl;
    return <img className="pm-photo-view" src={url} />;
  }
  return null;
}
