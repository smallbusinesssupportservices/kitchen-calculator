import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: ' https://aed5-24-125-95-94.ngrok-free.app',
        changeOrigin: true
      }
    }
  },
  base: '/',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})