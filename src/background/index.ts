import type { Message } from '@/messaging';
import { StorageService } from '@/storage';

import { PhotoService } from './PhotoService';

async function main() {
  chrome.runtime.onMessage.addListener(
    (
      message: unknown,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: unknown) => void
    ) => {
      if (message && typeof message === 'object' && (message as any).type) {
        const type = (message as any).type;
        if (type.startsWith('photomaniac.')) {
          handleMessage(message as Message, sendResponse);
        }
      }
    }
  );
  await StorageService.instance.update();
  PhotoService.instance.start();
}

function handleMessage(
  message: Message,
  sendResponse: (response: unknown) => void
) {
  if (message.type === 'photomaniac.commands.nextPhoto') {
    PhotoService.instance.prefetchNextPhoto();
    sendResponse({
      successful: true,
    });
  } else if (message.type === 'photomaniac.commands.updatePhotos') {
    PhotoService.instance.updatePhotos();
    sendResponse({
      successful: true,
    });
  }
}

main();
