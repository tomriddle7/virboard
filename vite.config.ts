import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const __dirname = path.resolve();

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.indexOf("node_modules") !== -1) {
              const module = id.split("node_modules/").pop();
              if (module) {
                return `vendor-${module.split("/")[0]}`;
              } else {
                return 'vendor-unknown';
              }
            }
          },
        }
      }
    },
    base: '/',
  };
})
