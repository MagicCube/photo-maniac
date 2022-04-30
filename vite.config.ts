import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { chromeExtension } from 'vite-plugin-chrome-extension';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), chromeExtension()],
  build: {
    rollupOptions: {
      input: {
        manifest: './src/manifest.json',
      },
    },
  },
});
