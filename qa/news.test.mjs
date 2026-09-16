import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

await test('News articles preserve dated records, valid sources and complete destinations', async () => {
  const server = await createServer({
    configFile: 'qa/particle80.vite.config.ts',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { newsArticles, newsCategories } =
      await server.ssrLoadModule('/content/news.ts');
    const { navigation } = await server.ssrLoadModule('/content/navigation.ts');
    const { publicArchiveImages } = await server.ssrLoadModule(
      '/content/archive-media.ts',
    );
    const { publicCollaboratorImages } = await server.ssrLoadModule(
      '/content/collaborator-media.ts',
    );
    const { NewsPage, NewsArticlePage } = await server.ssrLoadModule(
      '/components/site/News.tsx',
    );
    const routes = JSON.parse(
      await readFile('content/site-routes.json', 'utf8'),
    );
    const images = [...publicArchiveImages, ...publicCollaboratorImages];
    const approved = new Set(
      images.flatMap((image) => [image.localAssetPath, image.thumbnailPath]),
    );
    approved.add('/video-posters/behind-the-scenes.jpg');
    assert.equal(newsArticles.length, 2);
    assert.deepEqual(
      newsArticles.map((a) => a.id),
      ['hansen-2019', 'anderson-2019'],
    );
    assert.equal(newsCategories.length, 1);
    assert.equal(
      navigation[
        navigation.findIndex((item) => item.href === '/competition') + 1
      ].href,
      '/news',
    );
    const index = renderToString(React.createElement(NewsPage));
    assert.equal((index.match(/data-news-card=/g) ?? []).length, 2);

    const { pressReports, pressCategories } = await server.ssrLoadModule(
      '/content/press-coverage.ts',
    );
    assert.ok(pressReports.length >= 8);
    assert.equal(
      new Set(pressReports.map((r) => r.id)).size,
      pressReports.length,
    );
    assert.equal(
      new Set(pressReports.map((r) => r.url)).size,
      pressReports.length,
    );
    assert.equal(
      (index.match(/data-press-card=/g) ?? []).length,
      pressReports.length,
    );
    assert.equal(pressCategories.length, 3);
    const sourceAudit = JSON.parse(
      await readFile('docs/press-coverage-sources.json', 'utf8'),
    );
    for (const report of pressReports) {
      assert.ok(pressCategories.some((c) => c.id === report.category));
      assert.equal(new URL(report.url).protocol, 'https:');
      assert.ok(
        !report.url.includes('spm_id') && !report.url.includes('policyId'),
      );
      const audit = sourceAudit.reports.find((r) => r.id === report.id);
      assert.ok(audit && audit.url === report.url, report.id);
      for (const value of [report.publisher, report.title, report.summary])
        assert.ok(value.zh && value.en);
      if (report.publishedAt)
        assert.match(report.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(report.eventYear >= 2018 && report.eventYear <= 2024);
      const escaped = report.url.replaceAll('&', '&amp;');
      assert.ok(
        index.includes(
          `href="${escaped}" target="_blank" rel="noopener noreferrer"`,
        ),
        report.id,
      );
      assert.ok(!routes.some((r) => r.path === `/news/${report.id}/`));
    }
    const team = pressReports.find((r) => r.id === 'datapi-tsinghua-2021');
    assert.equal(team.category, 'community');
    assert.equal(team.eventYear, 2021);
    assert.equal(team.publishedAt, '2023-03-29');
    assert.equal(team.originalPublishedAt, '2021-07-26');
    const redirects = JSON.parse(
      await readFile('vercel.json', 'utf8'),
    ).redirects;
    for (const [id, destination] of [
      ['competition-2023', '/history/2023/'],
      ['competition-2024', '/history/2024/'],
      ['incubator-2024', '/partners/'],
      ['discoverer-feature', '/media/#videos'],
    ]) {
      assert.ok(!routes.some((r) => r.path === `/news/${id}/`));
      assert.ok(
        redirects.some(
          (r) => r.source === `/news/${id}/` && r.destination === destination,
        ),
      );
    }
    for (const article of newsArticles) {
      const route = routes.find((item) => item.path === `/news/${article.id}/`);
      assert.ok(route, article.id);
      assert.equal(route.title, article.title.en);
      assert.equal(route.zh, article.title.zh);
      assert.equal(route.image, article.cover.src);
      assert.ok(approved.has(article.cover.src), article.cover.src);
      assert.ok((await stat('public' + article.cover.src)).isFile());
      assert.ok(article.cover.width > 0 && article.cover.height > 0);
      assert.ok(article.paragraphs.length >= 3);
      for (const value of [
        article.title,
        article.summary,
        article.dateLabel,
        article.cover.alt,
        ...article.paragraphs,
      ])
        assert.ok(value.en && value.zh);
      assert.ok(newsCategories.some((item) => item.id === article.category));
      if (article.id !== 'discoverer-feature') {
        assert.equal(article.historical, true);
        assert.match(article.dateLabel.en, /2019|2023|2024/);
        assert.match(article.dateLabel.zh, /2019|2023|2024/);
      }
      assert.ok(article.links.some((link) => link.url.startsWith('https://')));
      for (const link of article.links) {
        if (link.url.startsWith('/')) {
          const path =
            new URL(link.url, 'https://example.test').pathname.replace(
              /\/$/,
              '',
            ) + '/';
          assert.ok(
            path === '/' ||
              path === '/global-network/' ||
              routes.some((item) => item.path === path),
            link.url,
          );
        } else assert.equal(new URL(link.url).protocol, 'https:');
      }
      const html = renderToString(
        React.createElement(NewsArticlePage, { article }),
      );
      assert.match(html, new RegExp(`data-news-article="${article.id}"`));
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      assert.doesNotMatch(html, /<video\b|<iframe\b|href="(?:#|undefined)"/);
      assert.match(html, /target="_blank" rel="noopener noreferrer"/);
    }
  } finally {
    await server.close();
  }
});
