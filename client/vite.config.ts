import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Твій плагін
import tailwindcss from '@tailwindcss/vite' // Твій плагін
import path from "path"
import { fileURLToPath } from "url" // <-- 1. Потрібно для ES Modules

// 2. Визначаємо __dirname вручну для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // 3. Тепер цей alias спрацює
      "@": path.resolve(__dirname, "./src"),
    },
  },
})