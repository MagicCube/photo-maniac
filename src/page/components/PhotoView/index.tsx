import { useEffect, useState } from 'react';

import type { Photo } from '@/types';

export interface PhotoViewProps {
  data: Photo | null;
}

export function PhotoView({ data }: PhotoViewProps) {
  const [hasError, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [data]);
  const handleError = () => {
    setError(true);
  };
  if (data) {
    const url = data?.images[0].webpUrl;
    return (
      <img
        className="pm-photo-view"
        src={url}
        style={{ display: hasError ? 'none' : undefined }}
        onError={handleError}
      />
    );
  }
  return null;
}
