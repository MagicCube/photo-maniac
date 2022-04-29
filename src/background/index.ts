import type { Message } from '@/messaging';
import { PhotoService } from './PhotoService';

const photoService = new PhotoService();

function main() {
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
  photoService.start();
}

function handleMessage(
  message: Message,
  sendResponse: (response: unknown) => void
) {
  if (message.type === 'photomaniac.commands.nextPhoto') {
    photoService.prefetchNextPhoto();
    sendResponse({
      successful: true,
    });
  } else if (message.type === 'photomaniac.commands.updatePhotos') {
    photoService.updatePhotos();
    sendResponse({
      successful: true,
    });
  }
}

main();
