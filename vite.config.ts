import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
    hmr: {
      host: '127.0.0.1.nip.io',
      port: 3000,
    },
    allowedHosts: ['.nip.io'],
  },
  preview: {
    host: true,
    port: 3000,
  }
})
