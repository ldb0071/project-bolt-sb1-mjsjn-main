import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/backend/venv/**',
        '**/backend/__pycache__/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/.idea/**',
        '**/.vscode/**'
      ]
    }
  }
});
