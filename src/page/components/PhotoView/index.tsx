import type { Photo } from '@/types';

export interface PhotoViewProps {
  photo: Photo | null;
}

export function PhotoView({ photo }: PhotoViewProps) {
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
