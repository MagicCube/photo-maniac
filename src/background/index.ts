import { StorageService } from '@/storage';
import './PrefetchService';

import { PhotoService } from './PhotoService';

async function main() {
  await StorageService.update();
  PhotoService.start();
}

main();
