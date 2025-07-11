import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['pdfjs-dist', 'buffer']
  },
  define: {
    global: 'globalThis',
    Buffer: ['buffer', 'Buffer']
  },
  worker: {
    format: 'es'
  }
});