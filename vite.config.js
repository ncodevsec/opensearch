import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        // Forces the entry file name to be index.js
        entryFileNames: 'assets/index.js',
        // Forces split chunks (if any) to use a predictable template
        chunkFileNames: 'assets/[name].js',
        // Forces CSS and other assets to use index.[ext]
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          // Fallback for other assets (images, fonts, etc.)
          return 'assets/[name].[ext]';
        }
      }
    }
  },
})
