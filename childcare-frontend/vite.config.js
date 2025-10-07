// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,                 // ให้ frontend วิ่งที่ 5173
    proxy: {
      '/api': {
        target: 'http://localhost:5174', // ชี้ไป backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
