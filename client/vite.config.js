import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Standard build without complex chunking to ensure Vercel stability
    chunkSizeWarningLimit: 2000,
  },
})
