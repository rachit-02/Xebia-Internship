import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: path.resolve(root, './src'),
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
    },
  },
  plugins: [
    {
      name: 'redirect-root-to-dashboard',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url === '/' || request.url === '/index.html') {
            response.statusCode = 302;
            response.setHeader('Location', '/src/index.html');
            response.end();
            return;
          }

          next();
        });
      },
    },
    react(),
    tailwindcss(),
  ],
});