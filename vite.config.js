import {
  defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "monaco": ["@monaco-editor/react"],
          'ui': ['@radix-ui/react-tabs', '@radix-ui/react-dialog']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  }
})