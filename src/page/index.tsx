import { createRoot } from 'react-dom/client';

import { StorageService } from '@/storage';

import { App } from './app';

async function main() {
  await StorageService.update();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(document.getElementById('pm-root')!);
  root.render(<App />);
}

main();
