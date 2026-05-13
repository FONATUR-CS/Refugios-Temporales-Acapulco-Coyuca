import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
  ],
  server: {
    https: true,
    host: true, // Permite acceso desde la red local (celulares)
  },
  optimizeDeps: {
    // Pre-bundlear leaflet y leaflet.markercluster juntos garantiza que ambos
    // compartan la misma instancia de L en el bundle de esbuild.
    include: ['leaflet', 'leaflet.markercluster'],
  },
})
