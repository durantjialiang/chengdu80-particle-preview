import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const { chromium } = await import(
  process.env.PARTICLE80_PLAYWRIGHT ?? 'playwright'
);
const output = resolve(
  process.env.PARTICLE80_OUTPUT ?? 'qa/artifacts/particle80-circulation',
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PARTICLE80_BROWSER,
});
const errors = [];
const url =
  process.env.PARTICLE80_URL ?? 'http://127.0.0.1:4174/qa/particle80.html';
const checks = [];
try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: `${output}/recording`,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await desktop.newPage();
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(url);
  await page.getByText('SWUFE', { exact: true }).waitFor();
  await page.getByText('FIC', { exact: true }).waitFor();
  await page.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('100%'),
  );
  const field = page.locator('[data-particles]');
  assert.equal(await field.getAttribute('data-state'), 'animated');
  assert.equal(await field.getAttribute('data-particles'), '4800');
  assert.equal(await field.getAttribute('data-structures'), '2400');
  assert.equal(await field.getAttribute('data-flows'), '1200');
  assert.equal(await field.getAttribute('data-ambient'), '864');
  assert.equal(await field.getAttribute('data-highlights'), '336');
  assert.equal(await field.getAttribute('data-accents'), '96');
  assert.equal(await field.getAttribute('data-beacons'), '24');
  assert.equal(await field.getAttribute('data-view-scale'), '1.534');
  const swufeBefore = await page
    .getByText('SWUFE', { exact: true })
    .boundingBox();
  await page.screenshot({ path: `${output}/desktop-1440x900.png` });
  const formedFrame = await field
    .locator('canvas')
    .evaluate((c) => c.toDataURL());
  await page.waitForTimeout(1800);
  assert.notEqual(
    await field.locator('canvas').evaluate((c) => c.toDataURL()),
    formedFrame,
  );
  checks.push({
    check:
      '50/25/18/7 roles, 2% accent budget; formed field continues circulating',
  });
  const box = await field.boundingBox();
  const scale = Math.min(box.width / 8.4, box.height / 4.6);
  await page.mouse.move(
    box.x + box.width / 2 - 1.1 * scale,
    box.y + box.height / 2 - 0.8 * scale,
    { steps: 25 },
  );
  await page.waitForFunction(
    () =>
      Number(
        document
          .querySelector('[data-pointer-strength]')
          ?.getAttribute('data-pointer-strength'),
      ) > 0.9,
    null,
    { timeout: 5000 },
  );
  const displaced = Number(await field.getAttribute('data-pointer-strength'));
  assert.deepEqual(
    await page.getByText('SWUFE', { exact: true }).boundingBox(),
    swufeBefore,
  );
  await page.screenshot({ path: `${output}/desktop-pointer-interaction.png` });
  await page.mouse.move(12, 12, { steps: 20 });
  await page.waitForFunction(
    () =>
      Number(
        document
          .querySelector('[data-pointer-strength]')
          ?.getAttribute('data-pointer-strength'),
      ) === 0,
  );
  checks.push({
    check:
      'pointer force activates/releases; labels remain stationary (spring recovery is unit-tested)',
    displaced,
    recovered: await field.getAttribute('data-pointer-strength'),
  });
  const video = page.video();
  await desktop.close();
  await video.saveAs(`${output}/formation-push-recover.webm`);

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const smallDesktop = await context.newPage();
  await smallDesktop.goto(url);
  await smallDesktop.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('100%'),
  );
  assert.ok(
    await smallDesktop
      .getByRole('button', { name: 'Explore Chengdu 80' })
      .isVisible(),
  );
  checks.push({ check: '1366x768 labels / CTA present' });
  await smallDesktop.screenshot({ path: `${output}/desktop-1366x768.png` });
  await smallDesktop.setViewportSize({ width: 1920, height: 1080 });
  await smallDesktop.screenshot({ path: `${output}/desktop-1920x1080.png` });
  await smallDesktop.reload();
  await smallDesktop.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('100%'),
  );
  assert.equal(
    await smallDesktop
      .locator('[data-intro-duration]')
      .getAttribute('data-intro-duration'),
    '1.4',
  );
  checks.push({
    check: 'repeat visit',
    duration: await smallDesktop
      .locator('[data-intro-duration]')
      .getAttribute('data-intro-duration'),
  });
  await smallDesktop
    .getByRole('button', { name: 'Explore Chengdu 80' })
    .click();
  await smallDesktop.waitForSelector('[data-intro-finished="true"]');
  assert.equal(await smallDesktop.locator('[data-particles]').count(), 0);
  await smallDesktop
    .getByRole('heading', { name: 'Build the Future of Finance.' })
    .waitFor();
  checks.push({ check: 'globe handoff removes particle renderer' });
  await context.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobile.newPage();
  mobilePage.on('pageerror', (error) => errors.push(String(error)));
  await mobilePage.goto(url);
  await mobilePage.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('100%'),
  );
  assert.equal(
    await mobilePage.locator('[data-particles]').getAttribute('data-particles'),
    '600',
  );
  assert.ok(
    Number(await mobilePage.locator('[data-dpr]').getAttribute('data-dpr')) <=
      1,
  );
  const cta = await mobilePage
    .getByRole('button', { name: 'Explore Chengdu 80' })
    .boundingBox();
  assert.ok(cta.y + cta.height <= 844);
  assert.equal(
    await mobilePage.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await mobilePage.screenshot({ path: `${output}/mobile-390x844.png` });
  checks.push({
    check: '390x844, 600 particles, DPR1, visible CTA, no overflow',
  });
  await mobilePage.emulateMedia({ reducedMotion: 'reduce' });
  await mobilePage.waitForSelector('[data-state="static"]');
  await mobilePage.screenshot({ path: `${output}/mobile-reduced-motion.png` });
  checks.push({ check: 'live reduced-motion switches to static complete 80' });
  await mobile.close();

  const fallback = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const fallbackPage = await fallback.newPage();
  await fallbackPage.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await fallbackPage.goto(url);
  await fallbackPage.waitForSelector('[data-state="fallback"]');
  await fallbackPage.waitForFunction(() =>
    document.querySelector('output')?.textContent.includes('100%'),
  );
  await fallbackPage.screenshot({
    path: `${output}/mobile-canvas-fallback.png`,
  });
  checks.push({
    check: 'Canvas unavailable: complete SVG and settled callback',
  });
  await fallback.close();
  const recovery = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const recoveryPage = await recovery.newPage();
  await recoveryPage.goto(url);
  await recoveryPage.emulateMedia({ reducedMotion: 'reduce' });
  await recoveryPage.waitForSelector('[data-state="static"]');
  await recoveryPage.emulateMedia({ reducedMotion: 'no-preference' });
  await recoveryPage.waitForSelector('[data-state="animated"]');
  assert.match(
    await recoveryPage.locator('output').innerText(),
    /Formation 100%/,
  );
  await recoveryPage
    .locator('canvas')
    .first()
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event('contextlost', { cancelable: true })),
    );
  await recoveryPage.waitForSelector('[data-state="fallback"]');
  assert.match(
    await recoveryPage.locator('output').innerText(),
    /100%.*Settled/,
  );
  await recoveryPage
    .locator('canvas')
    .first()
    .evaluate((canvas) => canvas.dispatchEvent(new Event('contextrestored')));
  await recoveryPage.waitForSelector('[data-state="animated"]');
  assert.match(
    await recoveryPage.locator('output').innerText(),
    /100%.*Settled/,
  );
  checks.push({
    check:
      'early reduced-motion toggle and context event recovery never restart formation',
  });
  await recovery.close();
  assert.deepEqual(errors, []);
  await writeFile(
    `${output}/browser-results.json`,
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ output, checks, errors }, null, 2));
} finally {
  await browser.close();
}
