import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(
  process.env.NETWORK_PLAYWRIGHT ??
    '/Users/jaylen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
);
const base = process.argv[2] ?? 'http://127.0.0.1:4192';
const output = process.argv[3];
if (!output) throw new Error('Supply a non-public output directory');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const checks = [],
  errors = [];
try {
  for (const [width, lang, motion] of [
    [390, 'zh', 'no-preference'],
    [390, 'en', 'reduce'],
    [320, 'zh', 'reduce'],
    [1440, 'en', 'reduce'],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: motion,
      isMobile: width < 600,
      hasTouch: width < 600,
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(
      base + '/global-network/?lang=' + lang + '&university=toronto',
    );
    const spot = page.locator('[data-spotlight]');
    await spot.waitFor();
    await page.locator('[data-network-map]').scrollIntoViewIfNeeded();
    await page
      .locator('[data-spatial-ready="true"]')
      .waitFor({ timeout: 20000 });
    // Start below the map, just as a visitor reading a school profile would.
    await page.locator('[data-university="toronto"]').click();
    const locate = spot.getByRole('button', {
      name: lang === 'zh' ? '在地球上查看' : 'Locate on globe',
      exact: true,
    });
    await locate.scrollIntoViewIfNeeded();
    await locate.click();
    await page.waitForTimeout(motion === 'reduce' ? 250 : 2000);
    const layout = await page.evaluate(() => {
      const map = document.querySelector('[data-network-map]');
      const globe = document.querySelector('[data-network-node-count]');
      const rect = globe.getBoundingClientRect();
      const nodes = [...globe.querySelectorAll('button[data-node]')]
        .filter(
          (b) => getComputedStyle(b.parentElement).visibility === 'visible',
        )
        .map((b) => {
          const r = b.getBoundingClientRect();
          return {
            id: b.dataset.node,
            selected: b.dataset.selected === 'true',
            x: r.x - rect.x,
            y: r.y - rect.y,
            width: r.width,
            height: r.height,
          };
        });
      return {
        mapTop: map.getBoundingClientRect().top,
        globe: {
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        },
        scrollWidth: document.documentElement.scrollWidth,
        viewport: innerWidth,
        focus: document.activeElement === map,
        selected: document.querySelector('[data-focused-university]').dataset
          .focusedUniversity,
        nodes,
      };
    });
    assert.equal(layout.selected, 'toronto');
    assert.equal(layout.focus, true);
    assert.ok(
      layout.mapTop >= 70 && layout.mapTop < 130,
      JSON.stringify(layout),
    );
    assert.ok(layout.globe.bottom <= 900, JSON.stringify(layout));
    assert.ok(layout.scrollWidth <= width + 1);
    assert.ok(layout.nodes.some((n) => n.selected));
    for (const n of layout.nodes) {
      assert.ok(
        n.x >= 0 && n.x + n.width <= layout.globe.width + 1,
        JSON.stringify(n),
      );
      assert.ok(
        n.y >= 0 && n.y + n.height <= layout.globe.height + 1,
        JSON.stringify(n),
      );
    }
    for (let i = 0; i < layout.nodes.length; i++)
      for (let j = i + 1; j < layout.nodes.length; j++) {
        const a = layout.nodes[i],
          b = layout.nodes[j];
        assert.ok(
          !(
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
          ),
          JSON.stringify({ a, b }),
        );
      }
    if (width < 600) assert.ok(layout.nodes.length <= 4);
    await page.screenshot({ path: output + `/globe-${width}-${lang}.png` });
    await spot.scrollIntoViewIfNeeded();
    await spot.locator('img').first().waitFor();
    assert.match(await spot.locator('figcaption').innerText(), /2019/);
    await page.screenshot({ path: output + `/profile-${width}-${lang}.png` });
    checks.push({ width, lang, motion, ...layout });
    if (width === 1440) {
      for (const id of ['eth', 'hku', 'berkeley']) {
        await page.locator(`[data-university="${id}"]`).click();
        await spot.scrollIntoViewIfNeeded();
        await page.screenshot({ path: output + `/profile-${id}.png` });
      }
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await writeFile(
    output + '/results.json',
    JSON.stringify({ checks, errors }, null, 2),
  );
}
console.log(JSON.stringify({ passed: checks.length, errors }));
