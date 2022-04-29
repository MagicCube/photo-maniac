import type { Photo } from '@/types';

export interface PhotoViewProps {
  data: Photo | null;
}

export function PhotoView({ data: photo }: PhotoViewProps) {
  if (photo) {
    return (
      <div
        className="photoView"
        style={{
          backgroundImage: `url(${photo?.images[0].webpUrl})`,
        }}
      ></div>
    );
  } else {
    return null;
  }
}
