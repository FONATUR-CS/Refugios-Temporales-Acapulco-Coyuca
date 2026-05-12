import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Pre-bundlear leaflet y leaflet.markercluster juntos garantiza que ambos
    // compartan la misma instancia de L en el bundle de esbuild.
    include: ['leaflet', 'leaflet.markercluster'],
  },
})
