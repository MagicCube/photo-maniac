import { useCallback, useEffect } from 'react';

import { StorageService } from '@/storage';
import type { Photo } from '@/types';

import { showMessage } from './Message';

export function useShortcutKeys({ photo }: { photo: Photo | null }) {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (photo) {
        if (
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey
        ) {
          switch (event.key.toLowerCase()) {
            case 'b':
              // Add to blacklist
              event.preventDefault();
              StorageService.addToBlacklist(photo);
              showMessage('Added to blacklist');
              break;
            case 'f':
              // Toggle fullscreen
              event.preventDefault();
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
              break;
            case 'v':
              // Visit 500px.com to see the detail of the photo.
              event.preventDefault();
              window.open(`https://500px.com/photo/${photo.legacyId}/`);
              break;
          }
        }
      }
    },
    [photo]
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, true);
    return () => {
      window.removeEventListener('keydown', handleKeydown, true);
    };
  }, [handleKeydown]);
}
