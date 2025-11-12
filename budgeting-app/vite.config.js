import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      external: ['@radix-ui/react-slot', '@radix-ui/react-slot@1.1.2'],
    },
  },
})
