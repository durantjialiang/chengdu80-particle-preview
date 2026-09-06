import assert from 'node:assert/strict';
import { copyFile, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import routes from '../content/site-routes.json' with { type: 'json' };

const output = new URL('../out/particle-preview/', import.meta.url);
const entry = new URL('qa/particle80.html', output);
const html = await readFile(entry, 'utf8');
assert.match(html, /SWUFE \/ FIC/);
assert.doesNotMatch(
  html,
  /(?:localhost|127\.0\.0\.1|\/qa\/particle80-intro\.tsx)/,
);

// Vite's multi-page build retains qa/ in the HTML filename. Publish the same
// built entry at / without changing the established local preview URL.
for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  assert.ok((await stat(new URL(asset.slice(1), output))).isFile());
}
await copyFile(entry, new URL('index.html', output));
await mkdir(new URL('global-network/', output), { recursive: true });
await copyFile(
  new URL('qa/global-network.html', output),
  new URL('global-network/index.html', output),
);
const siteHtml = await readFile(new URL('qa/site.html', output), 'utf8');
const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
for (const route of [
  ...routes,
  { path: '/404.html', title: 'Page not found' },
]) {
  assert.match(route.path, /^(?:\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/|\/404\.html)$/);
  const destination = route.path.endsWith('.html')
    ? route.path.slice(1)
    : route.path.slice(1) + 'index.html';
  const file = new URL(destination, output);
  await mkdir(new URL('.', file), { recursive: true });
  const title = escapeHtml(`${route.title} | Chengdu 80`);
  const description = escapeHtml(
    route.description ??
      `${route.title}: historical records and competition information from Chengdu 80.`,
  );
  const social = `<meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta property="og:url" content="https://chengdu80-particle-preview.vercel.app${route.path}" /><meta name="twitter:card" content="${route.image ? 'summary_large_image' : 'summary'}" />${route.image ? `<meta property="og:image" content="https://chengdu80-particle-preview.vercel.app${route.image}" />` : ''}`;
  await writeFile(
    file,
    siteHtml
      .replace('<title>Chengdu 80</title>', `<title>${title}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"\s*\/>/,
        `<meta name="description" content="${description}" />`,
      )
      .replace('</head>', social + '</head>'),
  );
}
console.log(
  'Standalone particle preview ready: out/particle-preview/index.html',
);
