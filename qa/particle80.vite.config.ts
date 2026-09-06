import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

// Separate preview entry: Vinext canonicalizes .html paths, so do not send
// this isolated React playground through the site's App Router middleware.
export default defineConfig(({ mode }) => ({
  root: fileURLToPath(new URL('..', import.meta.url)),
  appType: 'mpa',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('..', import.meta.url)) } },
  css: { postcss: { plugins: [tailwindcss()] } },
  server: { host: '127.0.0.1', port: 4174, strictPort: true },
  build: {
    // Keep the standalone review build separate from the existing Sites build.
    outDir: mode === 'public-preview' ? 'out/particle-preview' : 'dist',
    sourcemap: false,
    rolldownOptions: {
      input: {
        particle80: fileURLToPath(new URL('particle80.html', import.meta.url)),
        network: fileURLToPath(new URL('global-network.html', import.meta.url)),
      },
    },
  },
}));
