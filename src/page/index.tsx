import { createRoot } from 'react-dom/client';

import { App } from './app';

function main() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(document.getElementById('pm-root')!);
  root.render(<App />);
}

main();
