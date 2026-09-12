import assert from 'node:assert/strict';
import { test } from 'node:test';
import { access } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

await test('international network polish preserves dated records and clear identities', async (t) => {
  const server = await createServer({
    configFile: 'qa/particle80.vite.config.ts',
    cacheDir: 'node_modules/.vite-polish-tests',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { universities } = await server.ssrLoadModule(
      '/content/universities.ts',
    );
    const { universityRelationships } = await server.ssrLoadModule(
      '/content/university-relationships.ts',
    );
    const { collaborators } = await server.ssrLoadModule(
      '/content/collaborators.ts',
    );
    const { default: Spotlight } = await server.ssrLoadModule(
      '/components/network/UniversitySpotlight.tsx',
    );
    await t.test(
      'all 20 universities have local official marks and matching light or dark surfaces',
      async () => {
        assert.equal(universities.length, 20);
        for (const university of universities) {
          assert.ok(university.logo, university.id);
          assert.ok(university.logoSource, university.id);
          await access('public' + university.logo);
        }
        assert.equal(
          universities.find((u) => u.id === 'toronto').logoSurface,
          'dark',
        );
        assert.equal(
          universities.find((u) => u.id === 'sustech').logoSurface,
          'dark',
        );
        assert.equal(
          universities.find((u) => u.id === 'tau').logoSurface,
          'light',
        );
      },
    );
    await t.test(
      'faculty affiliations do not invent team participation and CDAR remains explicit',
      () => {
        for (const id of ['uchicago', 'ucsd']) {
          const university = universities.find((u) => u.id === id);
          assert.equal(university.participationYears.length, 0);
          assert.deepEqual(
            universityRelationships(university).map((r) => r.id),
            ['visitor'],
          );
        }
        const berkeley = universityRelationships(
          universities.find((u) => u.id === 'berkeley'),
        );
        assert.deepEqual(
          berkeley.map((r) => r.id),
          ['participant', 'forum', 'visitor'],
        );
        assert.match(berkeley.find((r) => r.id === 'forum').label.zh, /CDAR/);
      },
    );
    await t.test(
      'actual activity years are distinct from honors and image years',
      () => {
        const expected = {
          'lars-peter-hansen': [2019],
          'joel-sobel': [2019],
          'robert-anderson': [2019, 2021],
          'brady-haran': [2019],
        };
        for (const person of collaborators) {
          assert.deepEqual(
            person.activities.map((a) => a.year),
            expected[person.id],
          );
          for (const activity of person.activities) {
            assert.ok(
              activity.event.en &&
                activity.event.zh &&
                activity.format.en &&
                activity.format.zh,
            );
            assert.ok(activity.source.url.startsWith('https://'));
          }
        }
        assert.match(
          collaborators.find((p) => p.id === 'brady-haran').activities[0].event
            .zh,
          /交子创新讲坛/,
        );
        assert.doesNotMatch(
          collaborators.find((p) => p.id === 'brady-haran').role.en,
          /Professor/i,
        );
      },
    );
    await t.test(
      'each university spotlight has exactly one representative item and a full-profile action',
      () => {
        for (const university of universities) {
          const html = renderToString(
            React.createElement(Spotlight, {
              universityId: university.id,
              year: 'all',
              compact: false,
              onLocate() {},
              onDetails() {},
            }),
          );
          assert.equal(
            (html.match(/data-spotlight-feature=/g) ?? []).length,
            1,
            university.id,
          );
          assert.match(html, /Explore university profile/);
          assert.doesNotMatch(
            html,
            /GEOGRAPHIC CONNECTION|地理连接|Product name not established|产品专名尚未明确/,
          );
        }
      },
    );
    await t.test(
      'home excerpts omit internal archive notes while detail evidence remains',
      async () => {
        const { HomeBeforeNetwork, HomeAfterNetwork } =
          await server.ssrLoadModule('/components/site/EcosystemContent.tsx');
        const html = renderToString(
          React.createElement(
            React.Fragment,
            null,
            React.createElement(HomeBeforeNetwork),
            React.createElement(HomeAfterNetwork),
          ),
        );
        assert.match(html, /Academic exchange in Chengdu/);
        assert.match(
          html,
          /eight university teams gathered in Chengdu for an 80-hour financial research-discovery challenge/,
        );
        assert.doesNotMatch(
          html,
          /Global minds|team not identified|product name is not established|产品专名尚未明确|具体团队未确认|photographs document participation|合影展示参赛者|not assumed award identities|不据此推断获奖身份|not a ranking|不作为全赛事排名/,
        );
        const { projects } = await server.ssrLoadModule('/content/archive.ts');
        const { confirmed2022Awards, confirmed2024Awards } =
          await server.ssrLoadModule('/content/history-evidence.ts');
        for (const project of projects)
          assert.doesNotMatch(
            project.awardLabel.en,
            /[\u3400-\u9fff]/,
            project.projectId,
          );
        for (const award of [...confirmed2022Awards, ...confirmed2024Awards])
          assert.doesNotMatch(award.label.en, /[\u3400-\u9fff]/, award.id);
        assert.match(
          projects.find((p) => p.projectId === 'data-queens-report')
            .verificationNote.en,
          /Trailblazer Award.*first place.*Queen’s article/,
        );

        const { default: Detail } = await server.ssrLoadModule(
          '/components/network/UniversityDetailPanel.tsx',
        );
        const { SiteLanguageProvider } = await server.ssrLoadModule(
          '/hooks/use-site-language.tsx',
        );
        const previousWindow = Object.getOwnPropertyDescriptor(
          globalThis,
          'window',
        );
        const previousLocation = Object.getOwnPropertyDescriptor(
          globalThis,
          'location',
        );
        try {
          Object.defineProperty(globalThis, 'window', {
            value: {},
            configurable: true,
          });
          Object.defineProperty(globalThis, 'location', {
            value: { search: '?lang=zh' },
            configurable: true,
          });
          const berkeleyPanel = renderToString(
            React.createElement(
              SiteLanguageProvider,
              null,
              React.createElement(Detail, {
                university: universities.find((u) => u.id === 'berkeley'),
                onClose() {},
              }),
            ),
          );
          assert.match(berkeleyPanel, /领先者奖/);
          assert.match(berkeleyPanel, /2019官方结果 · 伯克利，Pioneer/);
          assert.doesNotMatch(
            berkeleyPanel,
            /official recap wording|source wording/,
          );
        } finally {
          if (previousWindow)
            Object.defineProperty(globalThis, 'window', previousWindow);
          else delete globalThis.window;
          if (previousLocation)
            Object.defineProperty(globalThis, 'location', previousLocation);
          else delete globalThis.location;
        }
      },
    );
  } finally {
    await server.close();
  }
});
