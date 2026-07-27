import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

console.log("!!! LOADING VITE CONFIG !!!");

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: path.resolve(root, './src'),
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://university-dashboard-backend-9t0x.onrender.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
});