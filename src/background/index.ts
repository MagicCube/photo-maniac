import { StorageService } from '@/storage';

import { PhotoService } from './PhotoService';

async function main() {
  await StorageService.instance.update();
  PhotoService.instance.start();
}

main();
