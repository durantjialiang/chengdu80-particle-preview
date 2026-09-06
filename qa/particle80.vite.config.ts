import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';
import routes from '../content/site-routes.json';

// Separate preview entry: Vinext canonicalizes .html paths, so do not send
// this isolated React playground through the site's App Router middleware.
export default defineConfig(({ mode }) => ({
  root: fileURLToPath(new URL('..', import.meta.url)),
  appType: 'mpa',
  plugins: [react(), {
    name: 'static-preview-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [path, query] = (req.url ?? '/').split('?');
        const normalized = path.replace(/\/$/, '') + '/';
        if (path === '/') req.url = '/qa/particle80.html' + (query ? '?' + query : '');
        else if (normalized === '/global-network/') req.url = '/qa/global-network.html' + (query ? '?' + query : '');
        else if (routes.some(route => route.path === normalized)) req.url = '/qa/site.html' + (query ? '?' + query : '');
        next();
      });
    },
  }],
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
        site: fileURLToPath(new URL('site.html', import.meta.url)),
      },
    },
  },
}));
