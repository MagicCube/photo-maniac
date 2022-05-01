import { StorageService } from '@/storage';

import { PhotoService } from './services';

async function main() {
  await StorageService.update();
  await PhotoService.start();
}

main();
