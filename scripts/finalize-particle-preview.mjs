import assert from 'node:assert/strict';
import { copyFile, readFile, stat, mkdir } from 'node:fs/promises';

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
console.log(
  'Standalone particle preview ready: out/particle-preview/index.html',
);
