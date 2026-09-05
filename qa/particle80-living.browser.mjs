import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const { chromium } = await import(
  process.env.PARTICLE80_PLAYWRIGHT ?? 'playwright'
);
const output = resolve(
  process.env.PARTICLE80_OUTPUT ?? 'qa/artifacts/particle80-living',
);
await mkdir(output, { recursive: true });
const url =
  process.env.PARTICLE80_URL ?? 'http://127.0.0.1:4174/qa/particle80.html';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PARTICLE80_BROWSER,
});
const errors = [],
  checks = [];
const observe = (page) => {
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
};
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [320, 740],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: width < 650,
      hasTouch: width < 650,
    });
    const page = await context.newPage();
    observe(page);
    await page.clock.install();
    await page.goto(url + '?fieldDebug=telemetry');
    await page.waitForFunction(() => window.__particle80Debug);
    await page.clock.runFor(12000);
    const a = await page.evaluate(() => window.__particle80Debug.snapshot());
    await page.clock.runFor(3000);
    const b = await page.evaluate(() => window.__particle80Debug.snapshot());
    assert.equal(b.flowMix, 1);
    const groups = [];
    for (const role of [0, 1, 2, 3]) {
      const movements = [],
        depths = [],
        speeds = [];
      for (let i = 0; i < b.role.length; i++)
        if (b.role[i] === role) {
          const k = i * 3;
          movements.push(
            Math.hypot(
              b.position[k] - a.position[k],
              b.position[k + 1] - a.position[k + 1],
            ),
          );
          depths.push(Math.abs(b.position[k + 2] - a.position[k + 2]));
          speeds.push(Math.hypot(b.velocity[k], b.velocity[k + 1]));
        }
      assert.ok(
        Math.min(...movements) > 0.0001,
        `frozen XY: width ${width}, role ${role}`,
      );
      assert.ok(
        Math.min(...depths) > 0.000001,
        `frozen depth: width ${width}, role ${role}`,
      );
      const mean = (v) => v.reduce((s, x) => s + x, 0) / v.length;
      groups.push({
        role,
        count: movements.length,
        minXY: Math.min(...movements),
        meanXY: mean(movements),
        minDepth: Math.min(...depths),
        meanSpeed: mean(speeds),
      });
    }
    assert.ok(
      groups[1].meanSpeed > groups[0].meanSpeed * 2,
      'motion scales collapsed',
    );
    const directions = [];
    for (const loop of [0, 1, 2]) {
      let sum = 0,
        n = 0;
      const [cx, cy] =
        loop === 0 ? [-0.87, -0.53] : loop === 1 ? [-0.87, 0.52] : [0.87, 0];
      for (let i = 0; i < b.role.length; i++)
        if (b.loop[i] === loop) {
          sum +=
            (b.position[i * 3] - cx) * b.velocity[i * 3 + 1] -
            (b.position[i * 3 + 1] - cy) * b.velocity[i * 3];
          n++;
        }
      assert.equal(Math.sign(sum), loop === 1 ? -1 : 1);
      directions.push(sum / n);
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    const cta = await page
      .getByRole('button', { name: 'Explore Chengdu 80' })
      .boundingBox();
    assert.ok(cta && cta.y + cta.height <= height);
    await page.screenshot({ path: `${output}/${width}-living.png` });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForSelector('[data-state="static"]');
    const still = await page
      .locator('[data-particles] canvas')
      .evaluate((c) => c.toDataURL());
    await page.clock.runFor(2000);
    assert.equal(
      still,
      await page
        .locator('[data-particles] canvas')
        .evaluate((c) => c.toDataURL()),
    );
    await page.screenshot({ path: `${output}/${width}-reduced-motion.png` });
    checks.push({
      width,
      height,
      groups,
      directions,
      reducedMotion: 'static complete',
      overflow: false,
    });
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  observe(page);
  await page.goto(url + '?fieldDebug=telemetry');
  await page.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('100%'),
  );
  await page.waitForTimeout(3000);
  const perf = await page.evaluate(() =>
    window.__particle80Debug.snapshot().frameCosts.sort((a, b) => a - b),
  );
  checks.push({
    performance: 'real Chromium draw+physics CPU cost; not physical GPU FPS',
    samples: perf.length,
    medianMs: perf[Math.floor(perf.length * 0.5)],
    p95Ms: perf[Math.floor(perf.length * 0.95)],
  });
  for (const mode of ['roles', 'vectors', 'flow']) {
    await page.goto(url + '?fieldDebug=' + mode);
    await page.waitForFunction(() =>
      document.querySelector('output')?.textContent.includes('100%'),
    );
    assert.equal(
      await page.locator('[data-field-debug]').getAttribute('data-field-debug'),
      mode,
    );
    await page.screenshot({ path: `${output}/dev-${mode}.png` });
  }
  await context.close();
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await writeFile(
    `${output}/living-browser-results.json`,
    JSON.stringify({ checks, errors }, null, 2),
  );
}
console.log(JSON.stringify({ checks, errors }, null, 2));
