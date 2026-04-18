import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Canteen Connect',
        short_name: 'Canteen',
        description: 'Campus Dining, Reimagined',
        theme_color: '#E8E0D4',
        background_color: '#E8E0D4',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],

  server: {
    port: 5173,
  },

  build: {
    outDir: mode === 'production' ? 'dist' : '../backend/public',
    emptyOutDir: true,
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
}))
