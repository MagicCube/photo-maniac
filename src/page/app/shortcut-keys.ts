import { useCallback, useEffect } from 'react';

import type { Photo } from '@/types';
import { StorageService } from '@/storage';

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
              event.preventDefault();
              StorageService.addToBlacklist(photo);
              break;
            case 'v':
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
