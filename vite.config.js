import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    charset: 'utf8',
    chunkSizeWarningLimit: 1000,
  },
})