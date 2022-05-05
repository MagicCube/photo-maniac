import { useCallback, useEffect, useState } from 'react';

import type { Photo } from '@/types';

export interface PhotoViewProps {
  data: Photo | null;
  onError: () => void;
}

export function PhotoView({ data, onError }: PhotoViewProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const handleFullscreenChange = useCallback(() => {
    setFullscreen(document.fullscreenElement !== null);
  }, []);
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange, true);
    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
        true
      );
    };
  }, [handleFullscreenChange]);
  if (data) {
    let url = data?.images[0].webpUrl;
    if (url === 'local') {
      url = `/${data.legacyId}.jpeg`;
    }
    return (
      <img
        className="pm-photo-view"
        style={{ objectFit: fullscreen ? 'contain' : undefined }}
        src={url}
        onError={() => {
          onError();
        }}
      />
    );
  }
  return null;
}
