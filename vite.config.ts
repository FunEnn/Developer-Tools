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
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on("error", (err) => {
            console.log("代理错误:", err);
          });
          proxy.on("proxyReq", (_, req) => {
            console.log("发送请求:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("收到响应:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  base: "/",
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          markdown: ["react-markdown", "react-syntax-highlighter"],
          ui: ["lucide-react"],
        },
      },
    },
    // 启用代码压缩
    minify: "terser",
    // 配置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 配置预加载
  optimizeDeps: {
    include: ["react", "react-dom", "react-markdown"],
  },
});
