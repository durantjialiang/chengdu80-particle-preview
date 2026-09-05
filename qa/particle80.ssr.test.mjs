import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

await test('Particle80 SSR is deterministic, accessible, and fully disabled on demand', async () => {
  const server = await createServer({
    configFile: 'qa/particle80.vite.config.ts',
    cacheDir: 'node_modules/.vite-particle80-tests',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { default: Particle80 } = await server.ssrLoadModule(
      '/components/Particle80.tsx',
    );
    const render = (props) =>
      renderToStaticMarkup(createElement(Particle80, props));
    const first = render({});
    assert.equal(first, render({}));
    assert.match(first, /<svg/);
    assert.match(first, /<canvas/);
    for (const color of ['#EAF4FF', '#8FDFFF', '#B8C7D9', '#D9B36C'])
      assert.ok(first.includes(color), `SVG fallback preserves ${color}`);
    assert.match(first, /aria-hidden="true"/);
    // Matching initial cloud plus a formed fallback for reduced motion/context failure.
    assert.equal((first.match(/<circle/g) ?? []).length, 720);
    assert.equal(render({ enabled: false }), '');
    assert.match(
      render({ label: 'Chengdu 80 motif' }),
      /role="img" aria-label="Chengdu 80 motif"/,
    );
    assert.match(render({ motion: 'still', active: false }), /<svg/);
    assert.match(render({ motion: 'still' }), /data-static="true"/);
    assert.match(render({ speed: 0 }), /data-static="false"/);
    assert.match(render({ intensity: 0 }), /--particle80-fallback-opacity:0/);
    assert.match(
      render({ dissolveProgress: 1 }),
      /--particle80-fallback-opacity:0/,
    );
    const half = render({
      formationProgress: 0.5,
      dissolveProgress: 0.25,
      intensity: 0.7,
    });
    assert.equal(
      half,
      render({
        formationProgress: 0.5,
        dissolveProgress: 0.25,
        intensity: 0.7,
      }),
    );
    assert.notEqual(
      render({ formationProgress: 0 }),
      render({ formationProgress: 1 }),
    );
    const { default: Intro } = await server.ssrLoadModule(
      '/components/Particle80Intro.tsx',
    );
    const intro = renderToStaticMarkup(createElement(Intro));
    assert.match(intro, /SWUFE/);
    assert.match(intro, /Southwestern University of/);
    assert.match(intro, /Finance and Economics/);
    assert.match(intro, /FIC/);
    assert.match(intro, /Fintech Innovation Center/);
    assert.match(intro, /data-intro-duration="7.2"/);
    assert.match(intro, /Innovation ecosystem/);
    assert.match(
      render({
        formationDuration: 9,
        mouseForce: 2,
        noiseStrength: 0.1,
        glowIntensity: 0.4,
      }),
      /data-intro-duration="9"/,
    );
    assert.equal(intro, renderToStaticMarkup(createElement(Intro)));
    assert.equal(
      renderToStaticMarkup(createElement(Intro, { enabled: false })),
      '',
    );
    assert.match(
      renderToStaticMarkup(
        createElement(Intro, {
          enabled: false,
          handoffContent: createElement('p', null, 'Hero remains available'),
        }),
      ),
      /Hero remains available/,
    );
  } finally {
    await server.close();
  }
});
