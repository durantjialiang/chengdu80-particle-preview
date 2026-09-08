// User-requested real browser QA; external runtime, no new site dependency.
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
const observe = (p) => {
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
};
const countNodes = (p) =>
  p
    .locator('[data-network-node-count]')
    .getAttribute('data-network-node-count');
const selected = (p) =>
  p.locator('[data-spotlight]').getAttribute('data-spotlight');
const layout = async (p, label) => {
  const result = await p.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    broken: [...document.images]
      .filter(
        (i) =>
          i.getBoundingClientRect().width > 0 &&
          i.complete &&
          i.naturalWidth === 0,
      )
      .map((i) => i.src),
  }));
  assert.ok(
    result.scroll <= result.width + 1,
    JSON.stringify({ label, ...result }),
  );
  assert.deepEqual(result.broken, []);
  checks.push({ label, ...result });
};
let failure;
try {
  // The recording uses real navigation, native controls and page.mouse movements.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: output, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  observe(page);
  await page.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => {
      const cursor = document.createElement('div');
      cursor.id = 'qa-cursor';
      cursor.style.cssText =
        'position:fixed;left:-30px;top:-30px;width:14px;height:14px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px #0008;pointer-events:none;z-index:2147483647';
      document.body.append(cursor);
      addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 7 + 'px';
        cursor.style.top = e.clientY - 7 + 'px';
      });
    });
  });
  await page.goto(base + '/global-network/?lang=zh&year=2019&university=nus');
  await page.locator('[data-spotlight-project="proscope-2019"]').waitFor();
  await page
    .locator('[data-network-explorer="true"][data-spatial-ready="true"]')
    .waitFor({ timeout: 20000 });
  await page.waitForTimeout(1500);
  assert.match(
    await page.locator('[data-spotlight] img').last().getAttribute('src'),
    /cd80-2019-03/,
  );
  assert.equal(await countNodes(page), '8');
  await page.locator('[data-spotlight]').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: output + '/desktop-2019-nus.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: '放大团队照片', exact: true }).click();
  await page.locator('dialog[open]').waitFor();
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape');
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('2023');
  assert.equal(await selected(page), 'nus');
  assert.equal(
    await page.locator('[data-spotlight] img[src*="history-media"]').count(),
    0,
  );
  assert.match(
    await page.locator('[data-spotlight]').innerText(),
    /NUSight|NUS Finovators/,
  );
  await page.locator('[data-spotlight]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('all');
  await page.locator('[data-university="nus"]').scrollIntoViewIfNeeded();
  const photo = await page
    .locator('[data-spotlight] img')
    .last()
    .getAttribute('src');
  const cards = page.locator('[data-university]');
  for (let i = 0; i < 10; i++) {
    await cards.nth(i).hover();
    assert.equal(await selected(page), 'nus');
    assert.equal(
      await page
        .locator('[data-focused-university]')
        .getAttribute('data-focused-university'),
      'nus',
    );
    assert.equal(
      await page.locator('[data-spotlight] img').last().getAttribute('src'),
      photo,
    );
  }
  checks.push({
    label:
      'Ten real card hovers: selection, camera target and photograph unchanged',
  });
  await page.locator('[data-university="queens"]').click();
  assert.equal(await selected(page), 'queens');
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('2024');
  assert.equal(
    await page.locator('[data-spotlight] img[src*="history-media"]').count(),
    0,
  );
  assert.match(
    await page.locator('[data-spotlight]').innerText(),
    /Data Queens/,
  );
  assert.equal(
    await page
      .locator('section[aria-labelledby="network-event-title"] img')
      .count(),
    3,
  );
  await page.locator('[data-spotlight]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({
    path: output + '/desktop-2024-queens.png',
    fullPage: true,
  });
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('2021');
  assert.match(
    await page.locator('[data-spotlight]').innerText(),
    /此年份暂无已收录记录/,
  );
  assert.equal(await page.locator('[data-spotlight-project]').count(), 0);
  await page.getByRole('searchbox').fill('Zurich');
  assert.equal(await countNodes(page), '1');
  assert.equal(await page.locator('[data-university="eth"]').count(), 0);
  await page.locator('[data-university="uzh"]').click();
  await page.getByRole('button', { name: '在地球上查看', exact: true }).click();
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('all');
  await page.locator('[data-network-node-count]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.locator('button[data-node][data-universities="eth,uzh"]').click();
  await page
    .getByRole('button', { name: '苏黎世联邦理工学院', exact: true })
    .click();
  assert.equal(await selected(page), 'eth');
  await page.getByRole('searchbox').fill('no-such-university');
  assert.equal(await countNodes(page), '0');
  assert.equal(
    await page.locator('[data-search-selection-mismatch]').count(),
    1,
  );
  await page.getByRole('button', { name: '清除筛选', exact: true }).click();
  assert.equal(await countNodes(page), '18');
  for (const year of ['2025', '2026']) {
    await page
      .getByRole('combobox', { name: '赛事年份', exact: true })
      .selectOption(year);
    assert.equal(await countNodes(page), '0');
    assert.equal(await page.locator('[data-university]').count(), 0);
  }
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('2020');
  await page.locator('[data-university="unsw"]').click();
  assert.match(await page.locator('[data-spotlight]').innerText(), /线上参赛/);
  await page
    .getByRole('combobox', { name: '赛事年份', exact: true })
    .selectOption('2019');
  await page.locator('[data-university="nus"]').click();
  await page.reload();
  await page.locator('[data-spotlight-project="proscope-2019"]').waitFor();
  assert.equal(await selected(page), 'nus');
  await page.locator('[data-university="hku"]').click();
  await page.goBack();
  assert.equal(await selected(page), 'nus');
  await page.goForward();
  assert.equal(await selected(page), 'hku');
  await page
    .locator('.network-page-navigation')
    .getByRole('button', { name: 'EN', exact: true })
    .click();
  assert.match(page.url(), /year=2019/);
  assert.match(page.url(), /university=hku/);
  assert.match(page.url(), /lang=en/);
  await layout(
    page,
    'Desktop 1440x900 actual WebGL, URL/back/forward/language',
  );
  checks.push({
    label:
      '2019 NUS; 2023 NUS; 2024 Queens; 2021 Zurich; 2020 UNSW; 2025/26 empty; grouped city selection',
  });
  await context.close();
  await page.video().saveAs(output + '/network-interaction-demo.webm');

  for (const [width, height] of [
    [1920, 1080],
    [390, 844],
    [320, 740],
  ]) {
    for (const lang of ['zh', 'en']) {
      const ctx = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
        isMobile: width < 600,
        hasTouch: width < 600,
      });
      const p = await ctx.newPage();
      observe(p);
      await p.goto(
        base + '/global-network/?lang=' + lang + '&year=2019&university=nus',
      );
      await p.locator('[data-spotlight-project="proscope-2019"]').waitFor();
      await p.locator('[data-spotlight]').scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await layout(p, width + 'x' + height + ' ' + lang + ' reduced motion');
      await p.screenshot({
        path: output + '/network-' + width + '-' + lang + '.png',
        fullPage: true,
      });
      await p.locator('[data-university="hku"]').focus();
      await p.keyboard.press('Enter');
      assert.equal(await selected(p), 'hku');
      await p.locator('[data-university="nus"]').click();
      await p
        .getByRole('button', {
          name: lang === 'zh' ? '放大团队照片' : 'Enlarge team photograph',
          exact: true,
        })
        .click();
      await p.locator('dialog[open]').waitFor();
      await p.keyboard.press('Escape');
      await p.locator('[data-spotlight-project] h5 a').click();
      assert.match(p.url(), /winners\/proscope-2019/);
      await p.goBack();
      assert.equal(await selected(p), 'nus');
      await ctx.close();
    }
  }
  // Explicit SVG fallback and compact homepage contract.
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const p = await ctx.newPage();
  observe(p);
  await p.goto(
    base + '/global-network/?lang=zh&year=2021&university=uzh&renderer=svg',
  );
  await p.locator('[data-network-node-count] svg').waitFor();
  assert.equal(await p.locator('[data-network-node-count] canvas').count(), 0);
  assert.equal(await p.locator('[data-node="eth"]').count(), 0);
  await p.locator('g[data-node="uzh"]').focus();
  await p.keyboard.press('Enter');
  assert.equal(await selected(p), 'uzh');
  await p.screenshot({ path: output + '/fallback-390.png', fullPage: true });
  for (const id of ['funder-2018', 'proscope-2019', 'nusight-2023']) {
    const response = await p.goto(base + '/winners/' + id + '/?lang=zh');
    assert.equal(response.status(), 200);
    await p.locator('h1').waitFor();
    await p.reload();
    await layout(p, 'Direct project route ' + id);
  }
  await p.goto(base + '/?lang=zh&motion=reduced');
  await p.locator('#global-network').waitFor();
  assert.ok(
    (await p.locator('#global-network [data-university]').count()) <= 6,
  );
  assert.ok(
    (await p.locator('#global-network [data-spotlight-project]').count()) <= 1,
  );
  await ctx.close();
  assert.deepEqual(errors, []);
} catch (error) {
  failure = String(error);
} finally {
  await browser.close();
  await writeFile(
    output + '/browser-results.json',
    JSON.stringify({ base, checks, errors, failure: failure ?? null }, null, 2),
  );
}
if (failure) throw new Error(failure);
console.log(
  JSON.stringify(
    { checks: checks.length, errors: errors.length, output },
    null,
    2,
  ),
);
