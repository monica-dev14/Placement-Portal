import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Indha '/api' request-ah ellam backend-ku thalli vidum
      '/api': {
        target: '${import.meta.env.VITE_API_URL}',
        changeOrigin: true,
      }
    }
  }
})