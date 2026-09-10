// End-to-end acceptance for the September 2026 global university experience.
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
const observe = (page) => page.on('pageerror', (e) => errors.push(String(e)));
const ids = (page) =>
  page
    .locator('[data-university]')
    .evaluateAll((els) => els.map((el) => el.dataset.university));
const waitSelected = (page, id) =>
  page.waitForFunction(
    (id) =>
      document
        .querySelector('[data-spotlight]')
        ?.getAttribute('data-spotlight') === id,
    id,
  );
const region = (page, name) =>
  page.getByRole('button', { name: new RegExp('^' + name + '(?:\\s|$)') });
const layout = async (page, label) => {
  const result = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    broken: [...document.images]
      .filter(
        (i) =>
          i.getBoundingClientRect().width > 0 && i.complete && !i.naturalWidth,
      )
      .map((i) => i.src),
  }));
  assert.ok(
    result.scroll <= result.width + 1,
    JSON.stringify({ label, ...result }),
  );
  assert.deepEqual(result.broken, [], label);
  checks.push({ label, ...result });
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  observe(page);
  await page.goto(base + '/?lang=en');
  await page.locator('#global-network [data-university]').first().waitFor();
  assert.deepEqual(await ids(page), [
    'swufe',
    'nus',
    'berkeley',
    'toronto',
    'eth',
    'unsw',
  ]);
  const order = await page.evaluate(() =>
    [
      'organizers',
      'global-network',
      'featured-projects',
      'inside-the-challenge',
      'people',
      'news-next',
    ].map((id) => ({
      id,
      y: document.getElementById(id).getBoundingClientRect().top + scrollY,
    })),
  );
  assert.deepEqual(
    order.map((e) => e.y),
    order.map((e) => e.y).sort((a, b) => a - b),
  );
  checks.push({
    label: 'Homepage early globe and six schools across four regions',
    order,
  });
  await page.goto(base + '/global-network/?lang=en&university=nus');
  await page.locator('[data-spotlight-project="nusight-2023"]').waitFor();
  assert.equal((await ids(page)).length, 20);
  assert.match(
    await page.locator('[data-spotlight] figcaption').innerText(),
    /2019/,
  );
  assert.match(
    await page.locator('[data-spotlight-project]').innerText(),
    /2023/,
  );
  assert.doesNotMatch(
    await page.locator('[data-spotlight]').innerText(),
    /No project profile|photograph to follow/,
  );
  await page.locator('[data-network-node-count]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await layout(
    page,
    'Desktop NUS profile with independent photo/project years',
  );
  await page.screenshot({ path: output + '/desktop-nus.png' });
  await region(page, 'Europe').click();
  assert.deepEqual((await ids(page)).sort(), ['eth', 'uzh', 'emlyon'].sort());
  await page
    .getByRole('combobox', { name: 'Year', exact: true })
    .selectOption('2021');
  await page.getByRole('searchbox').fill('Zurich');
  await waitSelected(page, 'uzh');
  assert.deepEqual(await ids(page), ['uzh']);
  assert.equal(
    await page
      .locator('[data-network-node-count]')
      .getAttribute('data-network-node-count'),
    '1',
  );
  await page.reload();
  await waitSelected(page, 'uzh');
  assert.deepEqual(await ids(page), ['uzh']);
  assert.equal(await page.getByRole('searchbox').inputValue(), 'Zurich');
  await page
    .getByRole('button', { name: 'Clear filters', exact: true })
    .click();
  await region(page, 'North America').click();
  await page
    .getByRole('combobox', { name: 'Year', exact: true })
    .selectOption('2019');
  assert.deepEqual((await ids(page)).sort(), [
    'berkeley',
    'toronto',
    'uchicago',
    'ucsd',
  ]);
  await page.locator('[data-university="berkeley"]').click();
  await waitSelected(page, 'berkeley');
  await page.locator('[data-university="toronto"]').click();
  await waitSelected(page, 'toronto');
  await page.goBack();
  await waitSelected(page, 'berkeley');
  await page.goForward();
  await waitSelected(page, 'toronto');
  checks.push({
    label:
      'Region/year/query intersection, selected identity, reload, browser history',
  });
  await page
    .getByRole('button', { name: 'Clear filters', exact: true })
    .click();
  await region(page, 'Oceania').click();
  await waitSelected(page, 'unsw');
  assert.deepEqual(await ids(page), ['unsw']);
  assert.match(await page.locator('[data-spotlight]').innerText(), /2020/);
  for (const year of ['2025', '2026']) {
    await page
      .getByRole('combobox', { name: 'Year', exact: true })
      .selectOption(year);
    assert.equal((await ids(page)).length, 0);
    assert.equal(await page.locator('[data-spotlight-project]').count(), 0);
  }
  assert.match(
    await page.locator('#global-network').innerText(),
    /2026 university roster has not been announced/,
  );
  checks.push({
    label: 'Oceania record and distinct 2025/2026 empty editions',
  });
  await context.close();

  for (const width of [390, 320]) {
    for (const lang of ['zh', 'en']) {
      const ctx = await browser.newContext({
        viewport: { width, height: 844 },
        reducedMotion: 'reduce',
        isMobile: true,
        hasTouch: true,
      });
      const p = await ctx.newPage();
      observe(p);
      await p.goto(base + '/global-network/?lang=' + lang + '&university=nus');
      await p.locator('[data-spotlight-project="nusight-2023"]').waitFor();
      await p.locator('[data-university="berkeley"]').click();
      await waitSelected(p, 'berkeley');
      await p.locator('[data-spotlight]').scrollIntoViewIfNeeded();
      await layout(p, `Mobile ${width}px ${lang}`);
      await p.screenshot({ path: output + `/mobile-${width}-${lang}.png` });
      await p.locator('[data-university="nus"]').focus();
      await p.keyboard.press('Enter');
      await waitSelected(p, 'nus');
      await p
        .getByRole('button', {
          name: lang === 'zh' ? '放大团队照片' : 'Enlarge team photograph',
          exact: true,
        })
        .click();
      await p.locator('dialog[open]').waitFor();
      await p.keyboard.press('Escape');
      assert.equal(await p.locator('dialog[open]').count(), 0);
      await ctx.close();
    }
  }
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
  JSON.stringify({ checks: checks.length, errors: errors.length, output }),
);
