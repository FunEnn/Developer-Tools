import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
  base: "/",
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown': ['react-markdown', 'react-syntax-highlighter'],
          'ui': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  },
  // 配置预加载
  optimizeDeps: {
    include: ["react", "react-dom", "react-markdown"],
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
