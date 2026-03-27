import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Indha '/api' request-ah ellam backend-ku thalli vidum
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})