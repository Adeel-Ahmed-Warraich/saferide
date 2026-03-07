import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true,
    proxy: {
      // Any request to /api/* in dev gets forwarded to the Express server.
      // This means ChatbotWidget's fetch('/api/chat') works on both:
      //   • Dev:        Vite (3000) → proxy → Express (8090) → Anthropic
      //   • Production: same origin, no proxy needed at all
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});