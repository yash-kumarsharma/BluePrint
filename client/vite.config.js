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
          // Group 3D graphics libraries (Three.js, R3F, Drei)
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-3d';
          }
          // Group Data Visualization (Recharts)
          if (id.includes('recharts') || id.includes('d3')) {
            return 'vendor-charts';
          }
          // Group Motion & Animation (Framer Motion)
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          // Group other heavy node_modules (Axios, Lucide, etc.)
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
