// Real browser checks for the tour lifecycle, camera selection and static fallback.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const { chromium } = await import(
  process.env.NETWORK_PLAYWRIGHT ??
    '/Users/jaylen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
);
const base = process.argv[2] ?? 'http://127.0.0.1:4186';
if (!process.argv[3]) throw new Error('Supply a non-public output directory');
const output = resolve(process.argv[3]);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.NETWORK_BROWSER ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const checks = [],
  errors = [];
let failure;
const state = (p) =>
  p.locator('#global-network').getAttribute('data-tour-state');
const waitState = (p, s) =>
  p.waitForFunction(
    (s) => document.querySelector('#global-network')?.dataset.tourState === s,
    s,
  );
const replay = async (p) => {
  await p.getByRole('button', { name: /^Take a global tour/ }).click();
  await p.locator('[data-network-node-count]').scrollIntoViewIfNeeded();
  await p.mouse.move(0, 0);
  await waitState(p, 'running');
};
try {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'no-preference',
  });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(base + '/?lang=en');
  await p.locator('#global-network').waitFor();
  assert.equal(await state(p), 'idle');
  await p.mouse.move(0, 0);
  await p.locator('[data-network-node-count]').scrollIntoViewIfNeeded();
  await waitState(p, 'running');
  const initialHistory = await p.evaluate(() => history.length);
  const stops = [];
  for (const id of ['swufe', 'nus', 'eth', 'toronto', 'berkeley', 'swufe']) {
    await p.waitForFunction(
      (id) =>
        document.querySelector('#global-network')?.dataset.tourStep === id &&
        document
          .querySelector('[data-spotlight]')
          ?.getAttribute('data-spotlight') === id,
      id,
      { timeout: 7000 },
    );
    await p.waitForTimeout(600);
    assert.equal(
      await p
        .locator('[data-focused-university]')
        .getAttribute('data-focused-university'),
      id,
    );
    assert.equal(
      await p
        .locator('[data-university][aria-pressed="true"]')
        .getAttribute('data-university'),
      id,
    );
    stops.push(id);
    if (['nus', 'eth', 'berkeley'].includes(id))
      await p.screenshot({ path: output + '/tour-' + id + '.png' });
  }
  await waitState(p, 'complete');
  assert.equal(await p.evaluate(() => history.length), initialHistory);
  checks.push({
    label:
      'Automatic first-entry 24-second tour, camera/card/directory sync, no extra history',
    stops,
  });
  await replay(p);
  const initialNodeBox = await p
    .locator('button[data-node="swufe"]')
    .boundingBox();
  const box = await p.locator('[data-network-node-count]').boundingBox();
  await p.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.6);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.6, {
    steps: 8,
  });
  await p.mouse.up();
  await waitState(p, 'stopped');
  const held = await p
    .locator('[data-spotlight]')
    .getAttribute('data-spotlight');
  await p.waitForTimeout(4200);
  assert.equal(
    await p.locator('[data-spotlight]').getAttribute('data-spotlight'),
    held,
  );
  await p
    .getByRole('button', { name: 'Return to Chengdu ↗', exact: true })
    .click();
  await p.mouse.move(0, 0);
  await p.waitForTimeout(1800);
  const restoredNodeBox = await p
    .locator('button[data-node="swufe"]')
    .boundingBox();
  const restoredGlobeBox = await p
    .locator('[data-network-node-count]')
    .boundingBox();
  assert.ok(
    Math.abs(
      restoredNodeBox.x - restoredGlobeBox.x - (initialNodeBox.x - box.x),
    ) < 8 &&
      Math.abs(
        restoredNodeBox.y - restoredGlobeBox.y - (initialNodeBox.y - box.y),
      ) < 8,
    JSON.stringify({ initialNodeBox, box, restoredNodeBox, restoredGlobeBox }),
  );
  checks.push({
    label:
      'Pointer drag stops automatic school changes; same-target Return to Chengdu resets orientation',
  });
  await replay(p);
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await waitState(p, 'paused');
  const pausedStep = await p
    .locator('#global-network')
    .getAttribute('data-tour-step');
  await p.waitForTimeout(4200);
  assert.equal(
    await p.locator('#global-network').getAttribute('data-tour-step'),
    pausedStep,
  );
  await p.locator('[data-network-node-count]').scrollIntoViewIfNeeded();
  await waitState(p, 'running');
  await p.getByRole('searchbox').fill('NUS');
  await waitState(p, 'stopped');
  await p.waitForTimeout(500);
  assert.equal(
    await p.locator('[data-spotlight]').getAttribute('data-spotlight'),
    'nus',
  );
  checks.push({ label: 'Offscreen pause/resume and search takeover' });
  await replay(p);
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await waitState(p, 'stopped');
  assert.equal(
    await p.getByRole('button', { name: /^Take a global tour/ }).isDisabled(),
    true,
  );
  checks.push({ label: 'Live reduced-motion preference stops tour' });
  await ctx.close();

  const fallback = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  await fallback.addInitScript(() => {
    const original = Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      'getContext',
    ).value;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).includes('webgl')) return null;
      return original.call(this, type, ...args);
    };
  });
  const q = await fallback.newPage();
  await q.goto(base + '/global-network/?lang=en&university=eth');
  await q.locator('[data-network-node-count] svg').waitFor();
  await q.locator('[data-university="uzh"]').click();
  await q.waitForFunction(
    () =>
      document
        .querySelector('[data-spotlight]')
        ?.getAttribute('data-spotlight') === 'uzh',
  );
  await q.getByRole('searchbox').fill('Zurich');
  assert.equal(await q.locator('[data-university]').count(), 2);
  await q.locator('g[data-node="eth"]').focus();
  await q.keyboard.press('Enter');
  await q.getByRole('button', { name: 'ETH Zurich', exact: true }).click();
  assert.equal(
    await q.locator('[data-spotlight]').getAttribute('data-spotlight'),
    'eth',
  );
  await q.locator('[data-network-node-count]').scrollIntoViewIfNeeded();
  await q.screenshot({ path: output + '/fallback-mobile.png' });
  assert.ok(
    await q.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  checks.push({
    label:
      'Unavailable WebGL retains SVG keyboard/city selection and all school records',
  });
  await fallback.close();
  assert.deepEqual(errors, []);
} catch (error) {
  failure = String(error);
} finally {
  await browser.close();
  await writeFile(
    output + '/tour-results.json',
    JSON.stringify({ base, checks, errors, failure: failure ?? null }, null, 2),
  );
}
if (failure) throw new Error(failure);
console.log(
  JSON.stringify({ checks: checks.length, errors: errors.length, output }),
);
