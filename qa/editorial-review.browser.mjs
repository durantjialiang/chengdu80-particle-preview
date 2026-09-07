// Browser acceptance for the user-requested 2026-09-07 editorial review.
// Uses an external Playwright runtime; no application dependency changes.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const { chromium } = await import(
  process.env.EDITORIAL_PLAYWRIGHT ?? 'playwright'
);
const base = process.argv[2] ?? 'http://127.0.0.1:4186';
if (!process.argv[3])
  throw new Error('Supply a non-public screenshot/output directory');
const output = resolve(process.argv[3]);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.EDITORIAL_BROWSER,
});
const checks = [],
  errors = [],
  remoteVisits = [];
const headings = {
  partners: {
    en: 'The partnerships behind Chengdu 80',
    zh: '成都八零背后的合作力量',
  },
  media: {
    en: 'Chengdu 80 in words and photographs',
    zh: '文字与影像中的成都八零',
  },
  about: {
    en: 'Finance meets the people who build.',
    zh: '让金融问题，遇见创造者。',
  },
};
const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
};
const layout = async (page) =>
  page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflowing = [
      ...document.querySelectorAll(
        'main h1, main h2, main h3, main h4, main p, main a, main summary, main img',
      ),
    ]
      .filter(
        (e) =>
          e.getClientRects().length &&
          getComputedStyle(e).visibility !== 'hidden',
      )
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.left < -1 || r.right > width + 1;
      })
      .map((e) => ({
        tag: e.tagName,
        text: (e.textContent || e.getAttribute('src') || '').slice(0, 100),
      }));
    return {
      width,
      scrollWidth: document.documentElement.scrollWidth,
      overflowing,
    };
  });
const observe = (page) => {
  page.on('pageerror', (error) =>
    errors.push({ url: page.url(), type: 'pageerror', text: String(error) }),
  );
  page.on('console', (message) => {
    if (message.type() === 'error')
      errors.push({ url: page.url(), type: 'console', text: message.text() });
  });
};
let failure;
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [320, 740],
  ]) {
    for (const language of ['en', 'zh']) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
        isMobile: width < 600,
        hasTouch: width < 600,
      });
      const page = await context.newPage();
      observe(page);
      for (const route of ['partners', 'media', 'about']) {
        const response = await page.goto(`${base}/${route}/?lang=${language}`);
        assert.equal(response.status(), 200);
        await page
          .getByRole('heading', {
            level: 1,
            name: headings[route][language],
            exact: true,
          })
          .waitFor();
        await settle(page);
        const initial = await layout(page);
        assert.ok(initial.scrollWidth <= width + 1, JSON.stringify(initial));
        assert.deepEqual(
          initial.overflowing,
          [],
          `${route} ${language} ${width}`,
        );
        assert.equal(await page.locator('a[href*="#requests"]').count(), 0);
        const links = await page
          .locator('main a[href]')
          .evaluateAll((nodes) =>
            nodes.map((e) => ({
              href: e.getAttribute('href'),
              target: e.target,
              rel: e.rel,
            })),
          );
        for (const link of links) {
          assert.ok(link.href && link.href !== '#');
          if (link.href.startsWith('https:')) {
            assert.equal(link.target, '_blank');
            assert.ok(
              link.rel.includes('noopener') && link.rel.includes('noreferrer'),
            );
          }
        }
        if (route === 'partners') {
          assert.equal(await page.locator('#roles details').count(), 3);
          const summary = page.locator('#roles summary').first();
          await summary.focus();
          await summary.press('Enter');
          assert.equal(
            await page.locator('#roles details').first().getAttribute('open'),
            '',
          );
          await summary.press('Enter');
          for (const id of ['fintech80x', 'incubator']) {
            await page.locator(`#roles a[href="#${id}"]`).click();
            await page.waitForURL((url) => url.hash === `#${id}`);
            const box = await page.locator(`#${id}`).boundingBox();
            assert.ok(
              box.y >= 60 && box.y < height - 60,
              `Anchor ${id}: ${box.y}`,
            );
          }
          assert.equal(await page.locator('[data-fic-company]').count(), 0);
          await page.locator('#impact').scrollIntoViewIfNeeded();
          if (width !== 320)
            await page.screenshot({
              path: resolve(output, `partners-impact-${language}-${width}.jpg`),
              quality: 85,
            });
          await page.locator('#explore-work a[href*="/winners/"]').click();
          await page.waitForURL(`**/winners/?lang=${language}`);
          await page.getByRole('heading', { level: 1 }).waitFor();
          await page.goBack();
        }
        if (route === 'media') {
          assert.equal(await page.locator('#requests').count(), 0);
          assert.match(await page.locator('#photos output').innerText(), /13/);
          await page.locator('#photos select').nth(0).selectOption('2024');
          assert.match(await page.locator('#photos output').innerText(), /5/);
          await page.locator('#photos select').nth(1).selectOption('teams');
          assert.match(await page.locator('#photos output').innerText(), /^0/);
          await page
            .getByRole('button', {
              name: language === 'en' ? 'Clear filters' : '清除筛选',
              exact: true,
            })
            .click();
          assert.match(await page.locator('#photos output').innerText(), /13/);
          await page.locator('#photos figure button').first().click();
          await page.getByRole('dialog').waitFor();
          await page.keyboard.press('Escape');
          assert.equal(await page.getByRole('dialog').count(), 0);
        }
        if (route === 'about') {
          assert.equal(await page.locator('[data-fic-company]').count(), 6);
          const cards = page.locator('[data-fic-company]');
          for (let i = 0; i < 6; i++) {
            await cards.nth(i).scrollIntoViewIfNeeded();
            const img = cards.nth(i).locator('img');
            await img.evaluate((e) => e.decode());
            assert.ok(await img.evaluate((e) => e.naturalWidth > 0));
          }
          await page.locator('#fic-network').scrollIntoViewIfNeeded();
          if (width !== 320)
            await page.screenshot({
              path: resolve(output, `about-logos-${language}-${width}.jpg`),
              quality: 85,
            });
          if (width === 1440 && language === 'en') {
            for (const child of ['img', 'h4']) {
              const popupPromise = page.waitForEvent('popup');
              await page
                .locator(`[data-fic-company="stateStreet"] ${child}`)
                .click();
              const popup = await popupPromise;
              let loaded = true;
              await popup
                .waitForLoadState('domcontentloaded', { timeout: 10000 })
                .catch(() => {
                  loaded = false;
                });
              assert.equal(
                new URL(popup.url()).hostname,
                'www.statestreet.com',
              );
              remoteVisits.push({
                via: child,
                url: popup.url(),
                domContentLoaded: loaded,
              });
              await popup.close();
            }
          }
        }
        // Exercise the real language switch, not just two independent URLs.
        const other = language === 'en' ? 'zh' : 'en';
        await page
          .getByRole('button', {
            name: other === 'zh' ? '中文' : 'EN',
            exact: true,
          })
          .first()
          .click();
        await page
          .getByRole('heading', {
            level: 1,
            name: headings[route][other],
            exact: true,
          })
          .waitFor();
        assert.equal(new URL(page.url()).searchParams.get('lang'), other);
        await page
          .getByRole('button', {
            name: language === 'zh' ? '中文' : 'EN',
            exact: true,
          })
          .first()
          .click();
        // Load actual lazy images by scrolling before full-page capture.
        const imgs = page.locator('main img');
        for (let i = 0; i < (await imgs.count()); i++) {
          await imgs.nth(i).scrollIntoViewIfNeeded();
          await imgs.nth(i).evaluate((e) => e.decode());
        }
        await page.evaluate(() => scrollTo(0, 0));
        await settle(page);
        const finalLayout = await layout(page);
        assert.ok(finalLayout.scrollWidth <= width + 1);
        assert.deepEqual(finalLayout.overflowing, []);
        if (width !== 320) {
          await page.screenshot({
            path: resolve(output, `${route}-${language}-${width}.jpg`),
            quality: 85,
          });
          await page.screenshot({
            path: resolve(output, `${route}-${language}-${width}-full.jpg`),
            fullPage: true,
            quality: 80,
          });
        }
        checks.push({
          route,
          language,
          width,
          height,
          reducedMotion: true,
          links: links.length,
          layout: finalLayout,
        });
        console.log(`PASS ${route} ${language} ${width}x${height}`);
      }
      await context.close();
    }
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  observe(page);
  await page.goto(`${base}/partners/?lang=en`);
  await page
    .getByRole('heading', { level: 1, name: headings.partners.en })
    .waitFor();
  await page.waitForTimeout(1000);
  checks.push({
    route: 'partners',
    reducedMotion: false,
    layout: await layout(page),
  });
  await context.close();
  assert.deepEqual(errors, []);
} catch (error) {
  failure = String(error.stack ?? error);
  console.error(failure);
  process.exitCode = 1;
} finally {
  await writeFile(
    resolve(output, 'browser-results.json'),
    JSON.stringify(
      {
        testedAt: new Date().toISOString(),
        base,
        browser: browser.version(),
        checks,
        remoteVisits,
        errors,
        failure: failure ?? null,
      },
      null,
      2,
    ),
  );
  await browser.close();
}
