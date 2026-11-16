import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import adminPlugin from './admin-server/vite-plugin-admin.js';

export default defineConfig({
  plugins: [react(), tailwindcss(), adminPlugin()],
  server: {
    // never let the content backups trigger a page reload
    watch: { ignored: ['**/src/content/.backups/**'] },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['motion'],
        },
      },
    },
  },
});
