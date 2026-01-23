import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

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
