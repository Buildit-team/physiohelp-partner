import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3002,
    hmr: {
      host: '127.0.0.1.nip.io',
      port: 3002,
    },
    allowedHosts: ['.nip.io'],
  },
  preview: {
    host: true,
    port: 3002,
  }
})
