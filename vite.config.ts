import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { referenceAssets } from './scripts/reference-assets.mjs'

export default defineConfig({
  plugins: [react(), referenceAssets()],
  server: {
    host: '127.0.0.1',
    port: 5177,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 5177,
    strictPort: true,
  },
})
