import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

await test('site content and static archive contracts', async (t) => {
  const server = await createServer({
    configFile: 'qa/particle80.vite.config.ts',
    cacheDir: 'node_modules/.vite-site-tests',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const {
      currentCompetition: c,
      year2025,
      faqs,
      approvedDownloads,
    } = await server.ssrLoadModule('/content/competition.ts');
    const { editions, projects, sources } = await server.ssrLoadModule(
      '/content/archive.ts',
    );
    const routes = JSON.parse(
      await readFile('content/site-routes.json', 'utf8'),
    );
    const { universities } = await server.ssrLoadModule(
      '/content/universities.ts',
    );
    await t.test(
      'editorial routes, dated partnerships and case studies stay evidence-linked',
      async () => {
        const e = await server.ssrLoadModule('/content/ecosystem.ts');
        const { projectStudies, projectDirectionById } =
          await server.ssrLoadModule('/content/project-studies.ts');
        const { publicArchiveImages } = await server.ssrLoadModule(
          '/content/archive-media.ts',
        );
        const pages = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        for (const path of ['/about/', '/partners/', '/media/'])
          assert.ok(routes.some((route) => route.path === path));
        for (const name of [
          'AboutPage',
          'PartnersPage',
          'MediaPage',
          'HomeBeforeNetwork',
          'HomeAfterNetwork',
          'HeroEssentials',
        ]) {
          const html = renderToString(React.createElement(pages[name]));
          assert.ok(
            html.length > (name === 'HeroEssentials' ? 200 : 500),
            name,
          );
          if (name === 'HeroEssentials')
            assert.match(html, /Competition guide/);
          if (
            ['HomeBeforeNetwork', 'AboutPage', 'PartnersPage'].includes(name)
          ) {
            assert.equal(
              (html.match(/<small>JOINT HOST<\/small>/g) ?? []).length,
              2,
            );
            assert.match(html, /<strong>SWUFE<\/strong>/);
            assert.match(
              html,
              /<strong>Chengdu Jiaozi Financial Holding Group<\/strong>/,
            );
            assert.doesNotMatch(
              html,
              /JOINT HOST ·|<p>(Southwestern University of Finance and Economics|Chengdu Jiaozi Financial Holding Group)<\/p>/,
            );
          }
          assert.doesNotMatch(html, /Page in preparation|>Soon</);
        }
        assert.equal(
          e.impactStories.find((s) => s.id === 'fintech80x').year,
          '2021',
        );
        assert.deepEqual(e.partnerEditions.find((p) => p.year === 2023).hosts, [
          'swufe',
          'jiaozi',
        ]);
        assert.ok(
          e.partnerEditions.every(
            (p) => p.year < 2026 && e.ecosystemSources[p.source],
          ),
        );
        assert.ok(
          e.historicalPeople.every(
            (p) => p.year < 2026 && e.ecosystemSources[p.source],
          ),
        );
        for (const id of [
          'nushadow',
          'dragon-search',
          'pisces',
          'data-queens-report',
        ]) {
          const study = projectStudies[id];
          assert.ok(projects.some((p) => p.projectId === id));
          assert.ok(projectDirectionById[id]);
          for (const field of [
            'problem',
            'users',
            'solution',
            'technical',
            'evidenceLabel',
          ]) {
            assert.ok(
              study[field].en.length > 10 && study[field].zh.length > 5,
            );
          }
          assert.match(study.evidenceUrl, /^https:\/\//);
          if (study.contextImageId) {
            const image = publicArchiveImages.find(
              (i) => i.id === study.contextImageId,
            );
            assert.ok(image);
            assert.equal(
              image.projectId,
              null,
              'Context photo must not be relabelled a product image',
            );
            assert.equal(
              image.eventYear,
              projects.find((p) => p.projectId === id).year,
            );
            assert.ok(study.contextNote.en && study.contextNote.zh);
          }
        }
        assert.ok(
          e.sceneImageIds.every((id) =>
            publicArchiveImages.some((i) => i.id === id),
          ),
        );
      },
    );
    await t.test(
      '2025/2026 do not imply false dates, registration or an edition',
      () => {
        assert.equal(year2025.status, 'not-held');
        assert.equal(c.month, 10);
        assert.equal(c.datePrecision, 'month');
        for (const key of [
          'edition',
          'startDate',
          'endDate',
          'applicationUrl',
          'venue',
          'challenge',
          'contact',
        ])
          assert.equal(c[key], null, key);
        assert.equal(c.confirmationStatus, 'project-owner-supplied');
        assert.equal(approvedDownloads.length, 0);
        assert.equal(new Set(faqs.map((f) => f.id)).size, faqs.length);
        assert.match(
          faqs.find((f) => f.id === 'dates').answer.en,
          /October 2026/,
        );
      },
    );
    await t.test(
      'all archive records have deep-link build destinations and real source refs',
      () => {
        for (const e of editions)
          assert.ok(routes.some((r) => r.path === `/history/${e.year}/`));
        for (const p of projects) {
          assert.ok(routes.some((r) => r.path === `/winners/${p.projectId}/`));
          assert.ok(universities.some((u) => u.id === p.universityId));
          assert.ok(p.sourceRefs.length);
          p.sourceRefs.forEach((id) =>
            assert.match(sources[id].url, /^https:\/\//),
          );
          assert.equal(p.demoUrl, null);
          assert.equal(p.repositoryUrl, null);
        }
        assert.equal(
          projects.find((p) => p.projectId === 'data-queens-report').year,
          2024,
        );
        assert.ok(
          projects
            .find((p) => p.projectId === 'data-queens-report')
            .verificationNote.zh.includes('产品专名'),
        );
        assert.equal(
          projects.find((p) => p.projectId === 'data-queens-report')
            .projectName,
          null,
        );
        assert.equal(
          projects.find((p) => p.projectId === 'data-queens-report')
            .editionAwardId,
          '2024-kaichuangzhe',
        );
        assert.equal(
          projects.find((p) => p.projectId === 'apollo-2023').projectName,
          null,
        );
        assert.equal(
          projects.find((p) => p.projectId === 'pisces').teamName,
          null,
        );
        const seventh = editions.find((e) => e.year === 2024);
        assert.equal(seventh.status, 'held');
        assert.equal(seventh.edition, 7);
        assert.equal(seventh.finalDate, '2024-10-30');
        assert.equal(sources.event2024.publishedDate, '2024-10-31');
        for (const key of [
          'startDate',
          'endDate',
          'developmentStart',
          'developmentEnd',
        ])
          assert.equal(seventh[key], null);
        assert.equal(
          seventh.challenge.zh,
          '重定义汽车保险：来自智能驾驶的挑战',
        );
        assert.equal(
          seventh.awardResults.flatMap((a) => a.universityIds).length,
          8,
        );
        assert.equal(
          editions.find((e) => e.year === 2023).finalDate,
          '2023-11-02',
        );
        const second = editions.find((e) => e.year === 2019);
        assert.equal(second.finalDate, '2019-11-03');
        assert.equal(second.startDate, null);
        assert.equal(second.sourceRefs[0], 'event2019');
        assert.equal(second.media.length, 8);
        assert.equal(sources.event2019.publishedDate, '2019-11-16');
        assert.equal(sources.recap2019.publishedDate, '2020-09-23');
        assert.equal(editions.find((e) => e.year === 2025).edition, null);
        assert.ok(routes.every((r) => r.path.endsWith('/')));
      },
    );
    await t.test(
      'disabled local-review plugin never reads a private manifest and rejects LAN exposure',
      async () => {
        const { historyReviewPlugin } = await server.ssrLoadModule(
          '/qa/history-review-plugin.ts',
        );
        const plugin = historyReviewPlugin(
          false,
          '/does-not-exist/private-history',
        );
        const id = plugin.resolveId('virtual:history-review-media');
        assert.equal(plugin.load(id), 'export default []');
        const config = await readFile('qa/particle80.vite.config.ts', 'utf8');
        assert.match(
          config,
          /command === 'serve' && mode === 'history-review'/,
        );
        const source = await readFile('qa/history-review-plugin.ts', 'utf8');
        assert.match(source, /server\.config\.server\.host !== '127\.0\.0\.1'/);
        assert.match(source, /full\.startsWith\(root \+ sep\)/);
      },
    );
    await t.test(
      'unapproved files in the public history media folder fail the build guard',
      async () => {
        const { checkPublicHistoryMedia } = await server.ssrLoadModule(
          '/qa/history-review-plugin.ts',
        );
        const fixture = await mkdtemp(join(tmpdir(), 'cd80-media-gate-test-'));
        try {
          assert.throws(
            () => checkPublicHistoryMedia(fixture),
            /Approved history asset missing/,
          );
          await mkdir(join(fixture, 'history-media'));
          await writeFile(
            join(fixture, 'history-media', 'unapproved.webp'),
            'test fixture, not an image',
          );
          assert.throws(
            () => checkPublicHistoryMedia(fixture),
            /lacks an approved/,
          );
        } finally {
          await rm(fixture, { recursive: true, force: true });
        }
      },
    );
    await t.test(
      'image publication requires explicit dual-scope permission, never merely a public source',
      async () => {
        const { publicArchiveImages, isPubliclyUsable, imageFit } =
          await server.ssrLoadModule('/content/archive-media.ts');
        assert.equal(publicArchiveImages.length, 13);
        assert.equal(
          publicArchiveImages.filter((i) => i.eventYear === 2019).length,
          8,
        );
        assert.equal(
          publicArchiveImages.filter((i) => i.eventYear === 2024).length,
          5,
        );
        for (const item of publicArchiveImages) {
          assert.ok(item.caption.en && item.caption.zh && item.credit);
          assert.match(item.sourcePage, /^https:\/\//);
          assert.match(item.originalImageUrl, /^https:\/\//);
          if (item.eventYear === 2024) assert.equal(item.universityId, null);
          assert.equal(item.permission.basis, 'project-owner-confirmation');
          assert.equal(item.projectId, null);
          assert.equal(item.photographer, null);
          assert.equal(isPubliclyUsable(item), true);
          assert.ok(
            (await readFile(`public${item.localAssetPath}`)).length > 0,
          );
          assert.ok((await readFile(`public${item.thumbnailPath}`)).length > 0);
        }
        const image = {
          usageStatus: 'approved',
          permission: {
            newWebsite: true,
            publicPreview: true,
            evidenceRef: 'written-grant-id',
          },
          localAssetPath: '/history-media/approved-full.webp',
          thumbnailPath: '/history-media/approved-thumb.webp',
          width: 1200,
          height: 800,
        };
        assert.equal(isPubliclyUsable(image), true);
        for (const patch of [
          { usageStatus: 'pending-permission' },
          { permission: null },
          { privateReview: true },
          { permission: { ...image.permission, publicPreview: false } },
          { permission: { ...image.permission, newWebsite: false } },
          { permission: { ...image.permission, evidenceRef: ' ' } },
          { localAssetPath: '/_history-review/test/full.webp' },
          { localAssetPath: '/history-media/../secret.webp' },
          { width: 0 },
        ])
          assert.equal(
            isPubliclyUsable({ ...image, ...patch }),
            false,
            JSON.stringify(patch),
          );
        for (const type of ['team-photo', 'event-group', 'product-interface'])
          assert.equal(imageFit(type), 'contain');
        const { default: localImages } = await server.ssrLoadModule(
          'virtual:history-review-media',
        );
        assert.deepEqual(localImages, []);
      },
    );
    await t.test(
      'public photos are image-only while provenance and private-review details remain intact',
      async () => {
        const { publicArchiveImages } = await server.ssrLoadModule(
          '/content/archive-media.ts',
        );
        const { default: Gallery, Viewer } = await server.ssrLoadModule(
          '/components/site/ArchiveGallery.tsx',
        );
        const { default: Editorial } = await server.ssrLoadModule(
          '/components/site/EditorialMedia.tsx',
        );
        const items = publicArchiveImages.filter((i) => i.eventYear === 2024);
        const views = [
          React.createElement(Editorial, { ids: items.map((i) => i.id) }),
          React.createElement(Gallery, { year: 2024 }),
          React.createElement(Gallery, { year: 2024, coverOnly: true }),
          React.createElement(Viewer, { items, initial: 0, onClose: () => {} }),
        ];
        for (const view of views) {
          const html = renderToString(view);
          assert.match(html, /<img[^>]+alt="[^"]+"/);
          assert.doesNotMatch(
            html,
            /<figcaption|Captions follow the source context|Photographer not credited/,
          );
          for (const item of items) {
            assert.ok(!html.includes(item.credit));
            assert.ok(!html.includes(item.originalImageUrl));
          }
        }
        const viewer = renderToString(views[3]);
        assert.match(viewer, /aria-labelledby="archive-viewer-caption"/);
        assert.match(viewer, /srOnly[^>]*><h3 id="archive-viewer-caption"/);
        for (const control of [
          'Close image viewer',
          'Previous image',
          'Next image',
        ])
          assert.ok(viewer.includes(control));
        const privateViewer = renderToString(
          React.createElement(Viewer, {
            items: [{ ...items[0], privateReview: true }],
            initial: 0,
            onClose: () => {},
          }),
        );
        assert.match(privateViewer, /reuse permission pending|Source article/);
      },
    );
    await t.test(
      'documented university projects use stable internal records and a separate original source',
      async () => {
        const { default: Detail } = await server.ssrLoadModule(
          '/components/network/UniversityDetailPanel.tsx',
        );
        for (const id of ['hku', 'queens', 'nus', 'tsinghua']) {
          const u = universities.find((u) => u.id === id);
          const html = renderToString(
            React.createElement(Detail, { university: u, onClose: () => {} }),
          );
          for (const p of u.projects.filter((p) => p.projectId))
            assert.ok(html.includes(`/winners/${p.projectId}/`), p.projectId);
          assert.match(html, /<details/);
        }
      },
    );
    await t.test(
      'text pages and all details render without WebGL or browser APIs',
      async () => {
        const { HistoryPage, WinnersPage } = await server.ssrLoadModule(
          '/components/site/ArchivePages.tsx',
        );
        const { default: Competition } = await server.ssrLoadModule(
          '/components/site/CompetitionPage.tsx',
        );
        for (const html of [
          renderToString(React.createElement(Competition)),
          ...editions.map((e) =>
            renderToString(React.createElement(HistoryPage, { year: e.year })),
          ),
          ...projects.map((p) =>
            renderToString(
              React.createElement(WinnersPage, { projectId: p.projectId }),
            ),
          ),
        ]) {
          assert.match(html, /<h1/);
          assert.doesNotMatch(html, /<canvas|WebGLRenderer/);
        }
        const textEntry = await readFile('qa/site.tsx', 'utf8');
        assert.doesNotMatch(
          textEntry,
          /Particle80|GlobalUniversityNetwork|components\/Globe/,
        );
      },
    );
  } finally {
    await server.close();
  }
});
