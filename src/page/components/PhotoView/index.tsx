import type { Photo } from '@/types';

export interface PhotoViewProps {
  data: Photo | null;
}

export function PhotoView({ data }: PhotoViewProps) {
  if (data) {
    return (
      <div
        className="pm-photo-view"
        style={{
          backgroundImage: `url(${data?.images[0].webpUrl})`,
        }}
      ></div>
    );
  }
  return null;
}
