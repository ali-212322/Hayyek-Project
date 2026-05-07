import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const cssVarsPlugin = {
  name: 'inject-css-vars',
  transformIndexHtml(html) {
    return html.replace(
      '<head>',
      `<head>
  <style>
    :root {
      --gd: #2D6A4F;
      --gm: #40916C;
      --gf: #52B788;
      --gl: #D8F3DC;
      --cream: #FAFAF7;
      --white: #FFFFFF;
      --sand: #F2EFE9;
      --ink: #1A1A2E;
      --muted: #6B7280;
      --light: #9CA3AF;
      --border: #E5E7EB;
      --warn: #F59E0B;
      --err: #EF4444;
      --info: #3B82F6;
    }
  </style>`
    )
  }
}

export default defineConfig({
  plugins: [react(), cssVarsPlugin],
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
})
