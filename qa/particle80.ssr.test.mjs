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
    const { createParticleField, FIELD_PALETTE, FIELD_DEFAULTS } =
      await server.ssrLoadModule('/lib/particle80-field.ts');
    const fallbackCount = FIELD_DEFAULTS.mobileCount;
    const fallbackRoles = createParticleField(fallbackCount).role;
    const render = (props) =>
      renderToStaticMarkup(createElement(Particle80, props));
    const first = render({});
    assert.equal(first, render({}));
    // Brightness remains render-only in the accessible SVG fallback, too.
    const circles = (preset) =>
      [
        ...render({ motion: 'still', brightnessPreset: preset }).matchAll(
          /<circle[^>]+>/g,
        ),
      ].map(([tag]) => tag);
    const baseline = circles('baseline'),
      brighter = circles('B');
    assert.equal(baseline.length, brighter.length);
    for (let i = 0; i < baseline.length; i++) {
      assert.equal(
        baseline[i].replace(/opacity="[^"]+"/, ''),
        brighter[i].replace(/opacity="[^"]+"/, ''),
      );
      if (fallbackRoles[i % fallbackCount] === 2)
        assert.equal(baseline[i], brighter[i]);
    }
    assert.notDeepEqual(baseline, brighter);
    assert.match(first, /<svg/);
    assert.match(first, /<canvas/);
    assert.match(first, /data-view-scale="1"/);
    const enlarged = render({ motion: 'still', viewScale: 1.534 });
    assert.match(enlarged, /data-view-scale="1.534"/);
    assert.equal(
      [...enlarged.matchAll(/ r="([^"]+)"/g)].map((m) => m[1]).join(','),
      [...render({ motion: 'still' }).matchAll(/ r="([^"]+)"/g)]
        .map((m) => m[1])
        .join(','),
      'Display magnification must not enlarge the fallback light points',
    );
    assert.notEqual(enlarged, render({ motion: 'still' }));
    assert.match(render({ viewScale: 99 }), /data-view-scale="1.8"/);
    assert.match(render({ viewScale: NaN }), /data-view-scale="1"/);
    const fills = [...first.matchAll(/fill="(#[0-9a-f]{6})"/g)].map(
      (m) => m[1],
    );
    assert.ok(
      new Set(fills).size >= 12,
      'spatial color field remains visible in fallback',
    );
    assert.ok(fills.every((color) => FIELD_PALETTE.includes(color)));
    assert.match(first, /aria-hidden="true"/);
    // Matching initial cloud plus a formed fallback for reduced motion/context failure.
    assert.equal((first.match(/<circle/g) ?? []).length, fallbackCount * 2);
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
    assert.match(intro, /data-intro-duration="2.2"/);
    assert.match(intro, /data-intro-state="INTRO_IDLE"/);
    assert.match(intro, /data-hold-duration="2.2"/);
    assert.match(intro, /data-dissolve-duration="2.8"/);
    assert.match(intro, /data-globe-reveal-duration="2.6"/);
    assert.match(intro, /data-brightness="B"/);
    assert.match(intro, /data-view-scale="1.72"/);
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
