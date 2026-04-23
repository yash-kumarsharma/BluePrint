import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Manual chunk splitting to eliminate the 500kB warning and optimize load times
        manualChunks(id) {
          // Group heavy libraries (Three, Recharts, Framer) to optimize build and reduce JS bloat
          if (id.includes('three') || id.includes('recharts') || id.includes('framer-motion')) {
            return 'vendor-visuals';
          }
          if (id.includes('node_modules')) {
            return 'vendor-core';
          }
        },
      },
    },
    // Increase the threshold slightly to 1000kb if needed, but our splitting should handle it
    chunkSizeWarningLimit: 1000,
  },
})
