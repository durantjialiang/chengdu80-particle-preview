/** Source/SSR/HTTP checks only. This does not claim browser, layout or pointer QA. */
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

const directory = process.argv[2];
const origin = process.argv[3] ?? 'http://127.0.0.1:4182';
if (!directory || new URL(origin).hostname !== '127.0.0.1')
  throw new Error(
    'Pass the private manifest directory and a loopback review URL',
  );
const root = resolve(directory);
const images = JSON.parse(
  await readFile(resolve(root, 'review-media.json'), 'utf8'),
);
process.env.CHENGDU80_HISTORY_REVIEW_DIR = root;
const server = await createServer({
  logLevel: 'error',
  configFile: 'qa/particle80.vite.config.ts',
  mode: 'history-review',
  cacheDir: 'node_modules/.vite-history-review-check',
  server: {
    host: '127.0.0.1',
    middlewareMode: true,
    hmr: false,
    ws: false,
    watch: null,
  },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
const results = {
  kind: 'data/SSR/HTTP validation; NOT visual browser QA',
  images: images.length,
  assets: 0,
  years: [],
  approved: 0,
  errors: [],
};
try {
  const { editions, projects } = await server.ssrLoadModule(
    '/content/archive.ts',
  );
  const { universities } = await server.ssrLoadModule(
    '/content/universities.ts',
  );
  const { HistoryPage, WinnersPage } = await server.ssrLoadModule(
    '/components/site/ArchivePages.tsx',
  );
  assert.equal(new Set(images.map((i) => i.id)).size, images.length);
  for (const image of images) {
    const edition = editions.find((e) => e.year === image.eventYear);
    assert.ok(edition?.media.includes(image.id), image.id);
    assert.equal(image.albumId, `edition-${image.eventYear}`);
    assert.ok(image.caption.en && image.caption.zh && image.credit);
    assert.ok(image.width > 0 && image.height > 0);
    assert.equal(image.usageStatus, 'pending-permission');
    assert.equal(image.permission, null);
    if (image.universityId)
      assert.ok(
        universities.some(
          (u) =>
            u.id === image.universityId &&
            u.participationYears.includes(image.eventYear),
        ),
      );
    if (image.projectId)
      assert.ok(
        projects.some(
          (p) =>
            p.projectId === image.projectId &&
            p.year === image.eventYear &&
            p.universityId === image.universityId,
        ),
      );
    for (const [key, variant] of [
      ['localAssetPath', 'full'],
      ['thumbnailPath', 'thumb'],
    ]) {
      const path = resolve(root, image[key]);
      assert.ok(path.startsWith(root + sep));
      assert.ok((await stat(path)).size > 0);
      const response = await fetch(
        `${origin}/_history-review/${image.id}/${variant}.webp`,
      );
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-type'), 'image/webp');
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      assert.match(response.headers.get('x-robots-tag'), /noindex/);
      const bytes = new Uint8Array(await response.arrayBuffer());
      assert.ok(bytes.length > 0);
      results.assets++;
    }
  }
  for (const year of [2019, 2024]) {
    const html = renderToString(React.createElement(HistoryPage, { year }));
    const count = images.filter((i) => i.eventYear === year).length;
    assert.equal(
      (html.match(/<img /g) ?? []).length,
      count + 1,
      'cover plus album',
    );
    assert.match(html, /Local photo review/);
    assert.match(html, /loading="lazy"/);
    assert.match(html, /width="\d+" height="\d+"/);
    const response = await fetch(`${origin}/history/${year}/?lang=zh`);
    assert.equal(response.status, 200);
    results.years.push({
      year,
      photos: count,
      ssrPhotoElements: count + 1,
      routeStatus: response.status,
    });
  }
  for (const projectId of ['dragon-search', 'data-queens-report']) {
    const html = renderToString(
      React.createElement(WinnersPage, { projectId }),
    );
    assert.doesNotMatch(
      html,
      /_history-review/,
      'do not borrow annual photographs as project photos',
    );
  }
  const publicMode = await createServer({
    logLevel: 'error',
    configFile: 'qa/particle80.vite.config.ts',
    mode: 'public-preview',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { default: data } = await publicMode.ssrLoadModule(
      'virtual:history-review-media',
    );
    assert.deepEqual(data, []);
    const { HistoryPage: PublicHistory } = await publicMode.ssrLoadModule(
      '/components/site/ArchivePages.tsx',
    );
    for (const year of [2019, 2024])
      assert.doesNotMatch(
        renderToString(React.createElement(PublicHistory, { year })),
        /_history-review|<img /,
      );
  } finally {
    await publicMode.close();
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  await server.close();
}
