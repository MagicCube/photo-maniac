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
        jpg01: './src/cached-data/images/1035820682.jpeg',
        jpg02: './src/cached-data/images/1040840447.jpeg',
        jpg03: './src/cached-data/images/1041659849.jpeg',
        jpg04: './src/cached-data/images/1043178573.jpeg',
        jpg05: './src/cached-data/images/1043689616.jpeg',
        jpg06: './src/cached-data/images/1045207685.jpeg',
        jpg07: './src/cached-data/images/1045575313.jpeg',
        jpg08: './src/cached-data/images/1046172723.jpeg',
      },
      output: {
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
