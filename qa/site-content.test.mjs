import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
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
    const { editions, publicEditions, projects, sources } =
      await server.ssrLoadModule('/content/archive.ts');
    const routes = JSON.parse(
      await readFile('content/site-routes.json', 'utf8'),
    );
    const { universities } = await server.ssrLoadModule(
      '/content/universities.ts',
    );
    await t.test(
      'city relationships preserve evidence, roles and approved photo boundaries',
      async () => {
        const {
          cityInstitutions,
          cityCollaborationSources,
          citySceneImageIds,
        } = await server.ssrLoadModule('/content/city-collaboration.ts');
        const { publicArchiveImages, isPubliclyUsable } =
          await server.ssrLoadModule('/content/archive-media.ts');
        const { partnerEditions } = await server.ssrLoadModule(
          '/content/ecosystem.ts',
        );
        assert.equal(cityInstitutions.length, 5);
        assert.equal(new Set(cityInstitutions.map((item) => item.id)).size, 5);
        assert.deepEqual(
          cityInstitutions.map((item) => item.relationship),
          [
            'co-building',
            'forum-co-host',
            'district-collaboration',
            'forum-co-host',
            'event-engagement',
          ],
        );
        for (const institution of cityInstitutions) {
          for (const field of ['name', 'role', 'summary']) {
            assert.ok(institution[field].en && institution[field].zh);
            assert.doesNotMatch(
              institution[field].en + institution[field].zh,
              /2026|赞助商|sponsor/i,
            );
          }
          assert.ok(institution.sourceIds.length > 0);
          for (const id of institution.sourceIds) {
            const source = cityCollaborationSources[id];
            assert.ok(new URL(source.url).hostname.endsWith('swufe.edu.cn'));
            assert.ok(source.eventDate < source.published);
          }
          if (institution.website) {
            const url = new URL(institution.website);
            assert.equal(url.protocol, 'https:');
            assert.ok(url.hostname.endsWith('.gov.cn'));
          }
          assert.ok(
            !JSON.stringify(partnerEditions).includes(institution.id),
            'City entities do not become competition hosts',
          );
        }
        assert.equal(cityInstitutions.filter((item) => item.website).length, 3);
        assert.match(cityInstitutions[3].summary.zh, /当时/);
        const { publicCityImages } = await server.ssrLoadModule(
          '/content/city-collaboration-media.ts',
        );
        assert.equal(publicCityImages.length, 5);
        assert.equal(cityInstitutions.filter((item) => item.photo).length, 4);
        for (const institution of cityInstitutions.filter(
          (item) => item.photo,
        )) {
          const photo = publicCityImages.find(
            (image) => image.id === institution.photo.imageId,
          );
          assert.ok(photo && isPubliclyUsable(photo), institution.id);
          assert.ok(
            institution.sourceIds.some(
              (id) => cityCollaborationSources[id].url === photo.sourcePage,
            ),
          );
          await readFile(`public${photo.localAssetPath}`);
          await readFile(`public${photo.thumbnailPath}`);
        }
        const officePhoto = publicCityImages.find(
          (image) => image.id === 'city-financial-office-2024',
        );
        assert.match(
          officePhoto.originalImageUrl,
          /DC6395BAFB3DC308D2EB62EE7E5/,
        );
        assert.match(officePhoto.caption.zh, /梁其洲/);

        for (const id of citySceneImageIds) {
          const photo = publicArchiveImages.find((image) => image.id === id);
          assert.ok(photo && isPubliclyUsable(photo));
          assert.equal(photo.eventYear, 2024);
          assert.equal(photo.universityId, null);
          assert.equal(photo.projectId, null);
          await readFile(`public${photo.localAssetPath}`);
        }
      },
    );
    await t.test(
      'city collaboration renders bilingual photo-led content without audit clutter',
      async () => {
        const { cityInstitutions } = await server.ssrLoadModule(
          '/content/city-collaboration.ts',
        );
        const { default: CityCollaboration } = await server.ssrLoadModule(
          '/components/site/CityCollaboration.tsx',
        );
        const { PartnersPage } = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
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
          for (const language of ['en', 'zh']) {
            Object.defineProperty(globalThis, 'location', {
              value: { search: `?lang=${language}` },
              configurable: true,
            });
            const render = (Component) =>
              renderToString(
                React.createElement(
                  SiteLanguageProvider,
                  null,
                  React.createElement(Component),
                ),
              );
            const html = render(CityCollaboration);
            const page = render(PartnersPage);
            assert.equal(
              (page.match(/id="city-collaboration"/g) ?? []).length,
              1,
            );
            assert.match(html, /aria-labelledby="city-collaboration-title"/);
            assert.equal((html.match(/<img\b/g) ?? []).length, 7);
            assert.equal((html.match(/<button\b/g) ?? []).length, 7);
            assert.equal(
              (html.match(/loading="lazy" decoding="async"/g) ?? []).length,
              7,
            );
            assert.equal(
              (html.match(/width="1800" height="1200"/g) ?? []).length,
              3,
            );
            assert.doesNotMatch(
              html,
              /<figcaption|<details|<summary|资料来源与说明|Sources &amp; record notes/,
            );
            assert.doesNotMatch(
              html,
              /<dialog/,
              'Viewer mounts only after a photo is selected',
            );
            for (const institution of cityInstitutions) {
              const card = html.match(
                new RegExp(
                  `<article[^>]*data-city-institution="${institution.id}"[\\s\\S]*?<\\/article>`,
                ),
              )?.[0];
              assert.ok(card, institution.id);
              assert.ok(card.includes(institution.role[language]));
              if (institution.photo) {
                assert.match(card, /<img\b/);
                assert.ok(card.includes(institution.photo.label[language]));
              }

              if (institution.website) {
                assert.ok(card.includes(`href="${institution.website}"`));
                assert.match(card, /target="_blank" rel="noopener noreferrer"/);
              } else
                assert.doesNotMatch(card, /<a\b/, 'No guessed department URL');
            }
          }
        } finally {
          if (previousWindow)
            Object.defineProperty(globalThis, 'window', previousWindow);
          else delete globalThis.window;
          if (previousLocation)
            Object.defineProperty(globalThis, 'location', previousLocation);
          else delete globalThis.location;
        }
        const css = await readFile(
          'components/site/CityCollaboration.module.css',
          'utf8',
        );
        assert.match(css, /@media \(max-width: 640px\)/);
        assert.match(
          css,
          /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/,
        );
        assert.match(css, /object-fit: contain/);
        assert.match(css, /:focus-visible/);
        assert.doesNotMatch(
          css,
          /animation:|transition:|filter:|object-fit: cover/,
        );
      },
    );
    await t.test(
      'homepage type scales without replacing content, navigation or particle behavior',
      async () => {
        const navigationCss = await readFile(
          'components/site/Site.module.css',
          'utf8',
        );
        const editorialCss = await readFile(
          'components/site/Editorial.module.css',
          'utf8',
        );
        const introCss = await readFile(
          'components/Particle80Intro.module.css',
          'utf8',
        );
        assert.match(
          navigationCss,
          /\.navigation\[data-embedded='true'\]\s*\{[^}]*font-size: clamp\(/,
        );
        assert.match(
          navigationCss,
          /@media \(max-width: 76rem\)\s*\{\s*\.desktopNav\s*\{\s*display: none/,
        );
        assert.match(
          navigationCss,
          /\.languages button\s*\{[^}]*min-height: 2\.75rem/,
        );
        assert.match(
          editorialCss,
          /\.essentials strong\s*\{[^}]*font-size: clamp\([^;]*rem[^;]*vw/,
        );
        assert.match(editorialCss, /\.essentialLinks\s*\{[^}]*flex-wrap: wrap/);
        assert.match(
          editorialCss,
          /\.essentialLinks a\s*\{[^}]*max-width: 100%/,
        );
        assert.match(
          editorialCss,
          /\.essentialLinks a\s*\{[^}]*min-height: 3rem/,
        );
        assert.match(introCss, /min-height: clamp\(18rem, 46svh, 27\.5rem\)/);
        assert.match(introCss, /max-height: 700px/);
        assert.match(introCss, /env\(safe-area-inset-bottom\)/);
        const acronymRules = [
          ...introCss.matchAll(/\.acronym\s*\{([^}]+)\}/g),
        ].map((match) => match[1]);
        assert.equal(
          acronymRules.length,
          3,
          'Shared desktop, tablet and phone type rules',
        );
        assert.match(acronymRules[0], /font-weight: 600/);
        assert.match(acronymRules[0], /white-space: nowrap/);
        const sizes = acronymRules.map((rule) => {
          const match = rule.match(
            /font-size: clamp\(([\d.]+)rem, ([\d.]+)vw, ([\d.]+)rem\)/,
          );
          assert.ok(match, 'Type remains fluid with rem bounds');
          return match.slice(1).map(Number);
        });
        const acronymSize = (width) => {
          const [min, vw, max] = sizes[width <= 640 ? 2 : width <= 900 ? 1 : 0];
          return Math.max(min * 16, Math.min((width * vw) / 100, max * 16));
        };
        for (const width of [1366, 1440, 1920, 2560, 3277, 3840]) {
          const previous = Math.max(36, Math.min(width * 0.0335, 56));
          assert.ok(
            acronymSize(width) >= previous * 1.4,
            `${width}px desktop is visibly larger`,
          );
          assert.ok(
            acronymSize(width) <= 128,
            'Ultra-wide size has a controlled ceiling',
          );
        }
        for (const width of [320, 360, 390, 640, 768, 900])
          assert.ok(
            acronymSize(width) >= 36 && acronymSize(width) <= 48,
            `${width}px uses compact type`,
          );
        assert.match(introCss, /\.identity\s*\{[^}]*top: calc\(50% - 40px\)/);
        assert.match(introCss, /\.identity\s*\{[^}]*top: 27px/);
        const { SiteNavigation } = await server.ssrLoadModule(
          '/components/site/SiteChrome.tsx',
        );
        const { HeroEssentials } = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        const { SiteLanguageProvider } = await server.ssrLoadModule(
          '/hooks/use-site-language.tsx',
        );
        const render = (component, props) =>
          renderToString(
            React.createElement(
              SiteLanguageProvider,
              null,
              React.createElement(component, props),
            ),
          );
        const nav = render(SiteNavigation, { embedded: true });
        const essentials = render(HeroEssentials);
        assert.match(nav, /data-embedded="true"/);
        assert.match(nav, /<dialog/);
        assert.match(nav, /aria-haspopup="dialog"/);
        assert.match(nav, /aria-label="Language"/);
        assert.match(essentials, /80 hours\. Real fintech challenges\./);
        for (const route of ['competition', 'winners']) {
          assert.ok(essentials.includes(`href="/${route}/?lang=en"`));
        }
        assert.equal((essentials.match(/<a\b/g) ?? []).length, 2);
      },
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
          if (name === 'HomeBeforeNetwork') {
            assert.match(html, /id="organizers"/);
            assert.doesNotMatch(
              html,
              /id="(?:featured-projects|inside-the-challenge|people)"/,
            );
          }
          if (name === 'HomeAfterNetwork') {
            const sequence = [
              'featured-projects',
              'inside-the-challenge',
              'people',
              'beyond-80',
              'news-next',
            ];
            const positions = sequence.map((id) => html.indexOf(`id="${id}"`));
            assert.ok(positions.every((position) => position >= 0));
            assert.deepEqual(
              positions,
              [...positions].sort((a, b) => a - b),
            );
          }
          if (name === 'PartnersPage') {
            assert.match(html, /The partnerships behind Chengdu 80/);
            assert.match(html, /Partnership milestones/);
            for (const story of e.impactStories) {
              assert.ok(!html.includes(story.locator.en));
              assert.equal(
                html.split(story.description.en).length - 1,
                1,
                'Each initiative is told once',
              );
              assert.ok(html.includes(`href="#${story.id}"`));
              assert.ok(html.includes(`id="${story.id}"`));
            }
            assert.doesNotMatch(
              html,
              /ORGANIZATION BY EDITION|The right role, in the right year\.|their dated roles|These are documented historical roles|A wider horizon|We do not promise|not a count of incubated|#requests|data-fic-company|UAE Chinese Business Council/,
            );
            for (const edition of e.partnerEditions) {
              assert.ok(
                edition.milestone.title.zh && edition.milestone.summary.zh,
              );
              assert.ok(html.includes(edition.milestone.title.en));
              if (![2021, 2024].includes(edition.year))
                assert.ok(html.includes(edition.milestone.summary.en));
            }
          }
          if (
            ['HomeBeforeNetwork', 'AboutPage', 'PartnersPage'].includes(name)
          ) {
            if (name === 'HomeBeforeNetwork') {
              assert.equal(
                (html.match(/<small>JOINT HOST<\/small>/g) ?? []).length,
                2,
              );
              assert.match(html, /<strong>SWUFE<\/strong>/);
            } else {
              assert.equal(
                (
                  html.match(/<small>Joint hosts · 2023 \/ 2024<\/small>/g) ??
                  []
                ).length,
                2,
              );
              assert.match(
                html,
                /<strong>Southwestern University of Finance and Economics<\/strong>/,
              );
            }
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
          'panda',
          'giraffe',
          'apollo-2023',
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
      'host identities reuse original logos and link both logo and name to official homepages',
      async () => {
        const { hostBrandProfiles } = await server.ssrLoadModule(
          '/content/partner-brands.ts',
        );
        const pages = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        const { SiteLanguageProvider } = await server.ssrLoadModule(
          '/hooks/use-site-language.tsx',
        );
        assert.deepEqual(Object.keys(hostBrandProfiles), ['swufe', 'jiaozi']);
        assert.equal(
          hostBrandProfiles.swufe.website,
          'https://www.swufe.edu.cn/',
        );
        assert.equal(
          hostBrandProfiles.jiaozi.website,
          'https://www.cdjzjk.com/',
        );
        assert.equal(
          hostBrandProfiles.swufe.logo.src,
          universities.find((u) => u.id === 'swufe').logo,
        );
        for (const profile of Object.values(hostBrandProfiles)) {
          const original = await readFile(`public${profile.logo.src}`);
          assert.equal(
            createHash('sha256').update(original).digest('hex'),
            profile.logo.sha256,
          );
          assert.equal(profile.usageStatus, 'project-owner-confirmed');
          assert.equal(
            profile.logo.surface,
            'dark',
            'White original marks need a dark surface',
          );
          assert.ok(profile.logo.width > 0 && profile.logo.height > 0);
        }
        const previousWindow = Object.getOwnPropertyDescriptor(
          globalThis,
          'window',
        );
        const previousLocation = Object.getOwnPropertyDescriptor(
          globalThis,
          'location',
        );
        try {
          // SSR-only language inputs; these checks do not imply browser interaction QA.
          Object.defineProperty(globalThis, 'window', {
            value: {},
            configurable: true,
          });
          for (const language of ['en', 'zh']) {
            Object.defineProperty(globalThis, 'location', {
              value: { search: `?lang=${language}` },
              configurable: true,
            });
            for (const name of [
              'HomeBeforeNetwork',
              'AboutPage',
              'PartnersPage',
            ]) {
              const html = renderToString(
                React.createElement(
                  SiteLanguageProvider,
                  null,
                  React.createElement(pages[name]),
                ),
              );
              for (const [id, profile] of Object.entries(hostBrandProfiles)) {
                const card = html.match(
                  new RegExp(`<a[^>]*data-host="${id}"[^>]*>[\\s\\S]*?<\\/a>`),
                )?.[0];
                assert.ok(card, `${name}/${language}/${id}`);
                assert.ok(card.includes(`href="${profile.website}"`));
                assert.match(card, /target="_blank" rel="noopener noreferrer"/);
                assert.match(card, /aria-label="[^"]+"/);
                assert.ok(card.includes(`src="${profile.logo.src}"`));
                assert.ok(
                  card.includes(
                    `width="${profile.logo.width}" height="${profile.logo.height}"`,
                  ),
                );
                assert.match(card, /loading="lazy" decoding="async"/);
                assert.ok(
                  card.indexOf('<img ') < card.indexOf('<strong>'),
                  'Logo precedes the name',
                );
                assert.equal(
                  (card.match(/<a\b/g) ?? []).length,
                  1,
                  'One native keyboard target for logo and name',
                );
                assert.doesNotMatch(
                  card,
                  /访问官方网站|Visit official website/,
                );
              }
            }
          }
        } finally {
          if (previousWindow)
            Object.defineProperty(globalThis, 'window', previousWindow);
          else delete globalThis.window;
          if (previousLocation)
            Object.defineProperty(globalThis, 'location', previousLocation);
          else delete globalThis.location;
        }
        const css = await readFile(
          'components/site/Editorial.module.css',
          'utf8',
        );
        assert.match(css, /\.hostLogo img\s*\{[^}]*object-fit: contain/);
        assert.match(css, /\.partner:focus-visible\s*\{[^}]*outline:/);
        assert.doesNotMatch(
          css.match(/\.hostLogo img\s*\{([^}]+)\}/)?.[1] ?? '',
          /filter:|transform:/,
        );
      },
    );
    await t.test(
      'international partner identities use official logos, direct links and historical roles',
      async () => {
        const { partnerBrandProfiles } = await server.ssrLoadModule(
          '/content/partner-brands.ts',
        );
        const { partnerEditions } = await server.ssrLoadModule(
          '/content/ecosystem.ts',
        );
        const { PartnersPage } = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        const html = renderToString(React.createElement(PartnersPage));
        assert.deepEqual(
          partnerBrandProfiles.map((profile) => profile.id),
          ['cdar', 'stateStreet'],
        );
        assert.match(html, /Historical international co-hosts/);
        for (const profile of partnerBrandProfiles) {
          assert.match(
            new URL(profile.website).hostname,
            /(^|\.)(berkeley\.edu|statestreet\.com)$/,
          );
          assert.ok(
            profile.years.every((year) =>
              partnerEditions.some(
                (edition) =>
                  edition.year === year && edition.hosts.includes(profile.id),
              ),
            ),
          );
          assert.ok(profile.years.every((year) => year < 2026));
          const logo = await readFile(`public${profile.logo.src}`);
          assert.ok(logo.length > 100);
          assert.equal(
            createHash('sha256').update(logo).digest('hex'),
            profile.logo.sha256,
          );
          assert.equal(profile.usageStatus, 'project-owner-confirmed');
          assert.equal(profile.permissionConfirmedOn, '2026-09-07');
          assert.ok(profile.logo.width > 0 && profile.logo.height > 0);
          assert.ok(profile.logo.sourcePage.startsWith('https://'));
          assert.ok(profile.logo.originalImageUrl.startsWith('https://'));
          const card = html.match(
            new RegExp(
              `<a[^>]*data-organization="${profile.id}"[^>]*>[\\s\\S]*?<\\/a>`,
            ),
          )?.[0];
          assert.ok(card, profile.id);
          assert.ok(card.includes(`href="${profile.website}"`));
          assert.match(card, /target="_blank"/);
          assert.match(card, /rel="noopener noreferrer"/);
          assert.ok(card.includes(`src="${profile.logo.src}"`));
          assert.match(card, /<h3>/);
          assert.doesNotMatch(card, /访问官方网站|Visit official website/);
        }
      },
    );
    await t.test(
      'FIC exchange cards wrap original logos and names in official homepage links',
      async () => {
        const { ficIndustry } = await server.ssrLoadModule(
          '/content/ecosystem.ts',
        );
        const { AboutPage } = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        const html = renderToString(React.createElement(AboutPage));
        const network = html.match(
          /<div id="fic-network"[\s\S]*?<\/section>/,
        )?.[0];
        assert.ok(network);
        assert.match(network, /The wider FIC exchange network/);
        assert.doesNotMatch(
          network,
          /The archived FIC introduction|sponsor list|confirmed 2026|旧FIC介绍/,
        );
        assert.equal((network.match(/data-fic-company=/g) ?? []).length, 6);
        const hosts = {
          pingAn: 'www.pingan.cn',
          ccb: 'www.ccb.com',
          cic: 'www.china-inv.cn',
          stateStreet: 'www.statestreet.com',
          swissRe: 'www.swissre.com',
          moodys: 'www.moodys.com',
        };
        assert.deepEqual(
          ficIndustry.map((company) => company.id),
          Object.keys(hosts),
        );
        for (const company of ficIndustry) {
          assert.equal(company.usageStatus, 'project-owner-confirmed');
          assert.equal(company.permissionConfirmedOn, '2026-09-07');
          assert.equal(new URL(company.website).hostname, hosts[company.id]);
          assert.equal(new URL(company.website).protocol, 'https:');
          const card = network.match(
            new RegExp(
              `<a[^>]*data-fic-company="${company.id}"[^>]*>[\\s\\S]*?<\\/a>`,
            ),
          )?.[0];
          assert.ok(card, company.id);
          assert.ok(card.includes(`href="${company.website}"`));
          assert.match(card, /target="_blank"/);
          assert.match(card, /rel="noopener noreferrer"/);
          assert.match(card, /Official website \(opens in a new tab\)/);
          assert.ok(card.includes(`src="${company.logo.src}"`));
          assert.match(card, /loading="lazy"/);
          assert.match(card, /decoding="async"/);
          assert.ok(company.name.zh && company.name.en);
          assert.ok(card.includes(company.name.en));
          assert.ok(card.indexOf('<img') < card.indexOf('<h4'));
          assert.ok(company.logo.width > 0 && company.logo.height > 0);
          const original = await readFile(`public${company.logo.src}`);
          assert.equal(
            createHash('sha256').update(original).digest('hex'),
            company.logo.sha256,
          );
          if (company.logo.src.endsWith('.svg')) {
            assert.doesNotMatch(
              original.toString(),
              /<script|<foreignObject|\bonload=|javascript:/i,
            );
          }
        }
      },
    );
    await t.test(
      'Media keeps visitor resources and rights terms without the internal checklist',
      async () => {
        const { MediaPage } = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        const { ecosystemSources } = await server.ssrLoadModule(
          '/content/ecosystem.ts',
        );
        const { schoolRequests } = await server.ssrLoadModule(
          '/content/editorial-requests.ts',
        );
        const html = renderToString(React.createElement(MediaPage));
        assert.doesNotMatch(
          html,
          /id="requests"|What is still to be confirmed|Open source|approved archive photographs|redistribution package|No cleared video/,
        );
        for (const item of schoolRequests)
          assert.ok(!html.includes(item.text.en));
        assert.doesNotMatch(html, /<video\b|<source\b|<track\b|<iframe\b|id="videos"|href="#videos"|\/videos\//);
        assert.doesNotMatch(html, /Download the film|90-second photo film|Coming soon/);
        assert.ok(html.indexOf('id="photos"') < html.indexOf('id="resources"'));
        const { default: VideoChannel } = await server.ssrLoadModule('/components/site/VideoChannel.tsx');
        assert.equal(renderToString(React.createElement(VideoChannel)), '');
        const channel = renderToString(React.createElement(VideoChannel, { url: 'https://www.youtube.com/@example' }));
        assert.match(channel, /Watch on YouTube/);
        assert.match(channel, /target="_blank" rel="noopener noreferrer"/);
        assert.doesNotMatch(channel, /<video|<iframe/);
        assert.ok(html.includes('/history/2022/'));
        assert.ok(html.includes('/history/2020/'));
        assert.ok(html.includes('/history/2019/'));
        assert.ok(html.includes('/history/2018/'));
        assert.ok(html.includes('/history/2023/'));
        assert.ok(html.includes('/history/2024/'));
        assert.match(html, /View the publication \(PDF\)/);
        assert.match(html, /View historical rules/);
        assert.match(html, /Read the article/);
        assert.match(html, /Media use/);
        assert.match(html, /original publisher and relevant rights holders/);
        for (const id of [
          'anniversary',
          'rules',
          'report2024',
          'report2023',
          'report2020',
        ])
          assert.ok(html.includes(ecosystemSources[id].url));
      },
    );
    await t.test(
      'Media year and category links render the selected album in both languages',
      async () => {
        const { MediaPage } = await server.ssrLoadModule(
          '/components/site/EcosystemContent.tsx',
        );
        const { SiteLanguageProvider } = await server.ssrLoadModule(
          '/hooks/use-site-language.tsx',
        );
        const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
        const previousLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
        try {
          Object.defineProperty(globalThis, 'window', { value: {}, configurable: true });
          for (const language of ['en', 'zh']) {
            for (const [query, count] of [
              ['year=2018', 16],
              ['year=2019', 28],
              ['year=2020', 13],
              ['year=2020&type=awards', 3],
              ['year=2023', 25],
              ['year=2024', 34],
              ['year=2024&type=awards', 2],
              ['year=2024&type=teams', 3],
              ['year=2022', 1],
              ['year=2022&type=events', 1],
              ['year=2022&type=awards', 0],
            ]) {
              Object.defineProperty(globalThis, 'location', {
                value: { search: `?lang=${language}&${query}` },
                configurable: true,
              });
              const html = renderToString(
                React.createElement(SiteLanguageProvider, null, React.createElement(MediaPage)),
              );
              const gallery = html.slice(html.indexOf('id="photos"'), html.indexOf('id="resources"'));
              assert.equal((gallery.match(/<figure\b/g) ?? []).length, count, `${language}/${query}`);
              assert.doesNotMatch(gallery, /src="[^"]+-full\.webp"/);
              assert.ok(html.includes(language === 'zh' ? '照片档案' : 'Photo archive'));
            }
          }
        } finally {
          if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
          else delete globalThis.window;
          if (previousLocation) Object.defineProperty(globalThis, 'location', previousLocation);
          else delete globalThis.location;
        }
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
        for (const e of publicEditions)
          assert.ok(routes.some((r) => r.path === `/history/${e.year}/`));
        assert.ok(!routes.some((r) => r.path === '/history/2025/'));
        assert.ok(!publicEditions.some((e) => e.year === 2025));
        assert.equal(editions.find((e) => e.year === 2025).status, 'not-held');
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
        assert.equal(second.media.length, 28);
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
        assert.equal(publicArchiveImages.length, 117);
        assert.equal(
          publicArchiveImages.filter((i) => i.eventYear === 2019).length,
          28,
        );
        assert.equal(
          publicArchiveImages.filter((i) => i.eventYear === 2024).length,
          34,
        );
        for (const item of publicArchiveImages) {
          assert.ok(item.caption.en && item.caption.zh && item.credit);
          if (item.sourceKind === 'owner-supplied') {
            assert.equal(item.sourcePage, '');
            assert.equal(item.originalImageUrl, '');
            assert.ok([2018, 2019, 2020, 2022, 2023, 2024].includes(item.eventYear));
            assert.match(
              item.permission.evidenceRef,
              item.eventYear === 2018
                ? /owner-2018-photo-publication-2026-09-10/
                : item.eventYear === 2019
                ? /owner-2019-photo-publication-2026-09-09/
                : item.eventYear === 2020
                ? /owner-2020-photo-publication-2026-09-09/
                : item.eventYear === 2022
                ? /owner-2022-photo-publication-2026-09-09/
                : item.eventYear === 2023
                  ? /owner-2023-and-2024-photo-publication-2026-09-09/
                  : /owner-2024-photo-collection-2026-09-08/,
            );
          } else {
            assert.match(item.sourcePage, /^https:\/\//);
            assert.match(item.originalImageUrl, /^https:\/\//);
            if (item.eventYear === 2024) assert.equal(item.universityId, null);
          }
          assert.equal(item.permission.basis, 'project-owner-confirmation');
          assert.equal(item.projectId, null);
          assert.equal(item.photographer, null);
          assert.equal(isPubliclyUsable(item), true);
          assert.ok(
            (await readFile(`public${item.localAssetPath}`)).length > 0,
          );
          assert.ok((await readFile(`public${item.thumbnailPath}`)).length > 0);
        }

        const ownerPhotos = publicArchiveImages.filter(
          (image) => image.sourceKind === 'owner-supplied',
        );
        assert.equal(ownerPhotos.length, 104);
        assert.equal(ownerPhotos.filter((photo) => photo.eventYear === 2018).length, 16);
        assert.equal(editions.find((edition) => edition.year === 2018).coverImageId, 'cd80-2018-owner-img-1754');
        assert.equal(ownerPhotos.filter((photo) => photo.eventYear === 2019).length, 20);
        assert.equal(editions.find((edition) => edition.year === 2019).coverImageId, 'cd80-2019-owner-1c9a6519');
        assert.equal(ownerPhotos.filter((photo) => photo.eventYear === 2020).length, 13);
        assert.equal(editions.find((edition) => edition.year === 2020).coverImageId, 'cd80-2020-owner-dn6v7222');
        assert.equal(ownerPhotos.filter((photo) => photo.eventYear === 2022).length, 1);
        const poster2022 = ownerPhotos.find((photo) => photo.eventYear === 2022);
        assert.equal(poster2022.imageType, 'event-poster');
        assert.equal(imageFit(poster2022.imageType), 'contain');
        assert.equal(editions.find((edition) => edition.year === 2022).coverImageId, poster2022.id);
        assert.equal(ownerPhotos.filter((photo) => photo.eventYear === 2023).length, 25);
        const inventory = JSON.parse(
          await readFile('docs/2024-photo-inventory.json', 'utf8'),
        );
        assert.equal(new Set(inventory.map((photo) => photo.sha256)).size, 29);
        for (const photo of ownerPhotos) {
          const edition = editions.find((item) => item.year === photo.eventYear);
          assert.ok(edition.media.includes(photo.id));
        }
        assert.equal(editions.find((edition) => edition.year === 2023).coverImageId, 'cd80-2023-owner-yfy-3743');
        assert.deepEqual(
          ownerPhotos
            .filter((photo) => photo.universityId)
            .map((photo) => [photo.id, photo.universityId]),
          [
            ['cd80-2024-owner-wul01672', 'hku'],
            ['cd80-2024-owner-wul01857', 'swufe'],
          ],
        );
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
            if (item.originalImageUrl)
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
          assert.doesNotMatch(
            html,
            /<details|Sources &amp; record notes|资料来源与说明/,
          );
        }
      },
    );
    await t.test(
      'winner cards and project headers reuse the correct university logo in both languages',
      async () => {
        const { WinnerCard, WinnersPage } = await server.ssrLoadModule(
          '/components/site/ArchivePages.tsx',
        );
        const { SiteLanguageProvider } = await server.ssrLoadModule(
          '/hooks/use-site-language.tsx',
        );
        const logoSource = await readFile(
          'components/network/UniversityLogo.tsx',
          'utf8',
        );
        assert.doesNotMatch(logoSource, /framer-motion|UniversityCard|three/);
        assert.equal(
          universities.find((u) => u.id === 'hku').logoSurface,
          'light',
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
          // SSR-only language input, not a real browser or interaction test.
          Object.defineProperty(globalThis, 'window', {
            value: {},
            configurable: true,
          });
          for (const language of ['en', 'zh']) {
            Object.defineProperty(globalThis, 'location', {
              value: { search: `?lang=${language}` },
              configurable: true,
            });
            const render = (component, props) =>
              renderToString(
                React.createElement(
                  SiteLanguageProvider,
                  null,
                  React.createElement(component, props),
                ),
              );
            const listing = render(WinnersPage);
            assert.doesNotMatch(
              listing,
              /Browse documented prototypes, teams and awards|查找有来源的原型、团队与获奖记录|This is a selected archive, not a complete ranking|这是精选档案，不是完整排名/,
            );
            assert.equal(
              (listing.match(/data-project-university=/g) ?? []).length,
              projects.length,
            );
            for (const project of projects) {
              const university = universities.find(
                (u) => u.id === project.universityId,
              );
              assert.ok(university?.logo, project.projectId);
              assert.ok(
                (await readFile(`public${university.logo}`)).length > 0,
              );
              const card = render(WinnerCard, { project });
              assert.ok(
                card.includes(`data-project-university="${university.id}"`),
              );
              const anchor = card.match(/<a\b[^>]*>[\s\S]*?<\/a>/)?.[0];
              assert.ok(
                anchor?.includes(
                  `href="/winners/${project.projectId}/?lang=${language}"`,
                ),
              );
              assert.ok(anchor.includes(`src="${university.logo}"`));
              assert.match(anchor, /<h3>/);
              assert.equal(
                (card.match(/<a\b/g) ?? []).length,
                1,
                'Logo and title share one keyboard target',
              );
              assert.ok(
                card.includes(`data-surface="${university.logoSurface}"`),
              );
              assert.ok(
                card.includes(language === 'zh' ? '官方标识' : 'official logo'),
              );
              assert.match(card, /loading="lazy"/);
              assert.match(card, /width="144" height="48"/);
              const detail = render(WinnersPage, {
                projectId: project.projectId,
              });
              const header = detail.slice(0, detail.indexOf('<h1'));
              assert.ok(
                header.includes(`data-project-university="${university.id}"`),
              );
              assert.ok(header.includes(`src="${university.logo}"`));
              assert.doesNotMatch(header, /<canvas|WebGLRenderer/);
            }
          }
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
    await t.test(
      'annual project features share ten bilingual studies and booklet awards without inventing later products',
      async () => {
        const { HistoryPage, WinnersPage } = await server.ssrLoadModule(
          '/components/site/ArchivePages.tsx',
        );
        const { SiteLanguageProvider } = await server.ssrLoadModule(
          '/hooks/use-site-language.tsx',
        );
        const { projectStudies } = await server.ssrLoadModule(
          '/content/project-studies.ts',
        );
        const expected = {
          2018: [
            ['nus'],
            ['hku', 'berkeley'],
            ['gatech', 'pku', 'swufe', 'sustech', 'tsinghua'],
          ],
          2019: [
            ['hku'],
            ['berkeley', 'nus'],
            ['pku', 'swufe', 'tsinghua', 'toronto', 'sjtu'],
          ],
          2020: [
            ['nus'],
            ['uzh', 'swufe'],
            ['tsinghua', 'uestc', 'sustech', 'hku', 'cqu'],
          ],
          2021: [
            ['tsinghua'],
            ['swufe', 'uzh'],
            ['nus', 'hku', 'uestc', 'cqu', 'tau'],
          ],
        };
        const sourcePages = { 2018: 20, 2019: 36, 2020: 46, 2021: 56 };
        for (const [year, groups] of Object.entries(expected)) {
          const edition = editions.find((e) => e.year === Number(year));
          assert.deepEqual(
            edition.awardResults.map((r) => [...r.universityIds]),
            groups,
          );
          assert.equal(
            new Set(edition.awardResults.flatMap((r) => r.universityIds)).size,
            8,
          );
          for (const result of edition.awardResults) {
            assert.equal(result.sourceRef, 'booklet');
            assert.equal(result.sourcePage, sourcePages[year]);
          }
        }
        assert.equal(
          projects.find((p) => p.projectId === 'apollo-2023').projectName,
          null,
        );
        assert.equal(
          projects.find((p) => p.projectId === 'data-queens-report')
            .projectName,
          null,
        );
        assert.equal(Object.keys(projectStudies).length, 10);
        const boardAsset = await readFile(
          'public/award-records/2018-2019-awards.webp',
        );
        assert.equal(boardAsset.toString('ascii', 0, 4), 'RIFF');
        assert.equal(boardAsset.toString('ascii', 8, 12), 'WEBP');

        const previousWindow = Object.getOwnPropertyDescriptor(
          globalThis,
          'window',
        );
        const previousLocation = Object.getOwnPropertyDescriptor(
          globalThis,
          'location',
        );
        const escapeHtml = (value) =>
          renderToString(React.createElement('span', null, value)).replace(
            /^<span>|<\/span>$/g,
            '',
          );
        try {
          Object.defineProperty(globalThis, 'window', {
            value: {},
            configurable: true,
          });
          for (const language of ['zh', 'en']) {
            Object.defineProperty(globalThis, 'location', {
              value: { search: `?lang=${language}` },
              configurable: true,
            });
            const render = (component, props) =>
              renderToString(
                React.createElement(
                  SiteLanguageProvider,
                  null,
                  React.createElement(component, props),
                ),
              );
            const listing = render(HistoryPage);
            const winners = render(WinnersPage);
            assert.equal(
              (winners.match(/data-award-university=/g) ?? []).length,
              16,
            );
            assert.equal(
              (listing.match(/data-award-university=/g) ?? []).length,
              16,
            );
            assert.ok(
              winners.indexOf('id="award-rolls"') <
                winners.indexOf('id="project-archive"'),
            );
            for (const year of [2018, 2019]) {
              const edition = editions.find((e) => e.year === year);
              const detail = render(HistoryPage, { year });
              assert.ok(
                detail.indexOf('id="awards"') <
                  detail.indexOf('data-edition-project='),
              );
              for (const html of [listing, winners, detail]) {
                for (const award of edition.awardResults) {
                  const group = html.match(
                    new RegExp(
                      `data-award-group="${award.id}"[\\s\\S]*?</section>`,
                    ),
                  )?.[0];
                  assert.ok(group, `${year} ${award.id} must be visible`);
                  assert.ok(group.includes(escapeHtml(award.label[language])));
                  assert.equal(
                    (group.match(/data-award-university=/g) ?? []).length,
                    award.universityIds.length,
                  );
                  for (const id of award.universityIds) {
                    assert.ok(group.includes(`data-award-university="${id}"`));
                    assert.ok(
                      group.includes(
                        `href="/global-network/?year=${year}&amp;university=${id}&amp;lang=${language}#university-card-${id}"`,
                      ),
                    );
                    const university = universities.find((u) => u.id === id);
                    assert.ok(university.participationYears.includes(year));
                    assert.ok(university.awards.some((a) => a.year === year));
                  }
                }
              }
              for (const html of [winners, detail])
                assert.ok(
                  html.includes('href="/award-records/2018-2019-awards.webp"'),
                );
            }

            assert.equal(
              (listing.match(/data-edition-project=/g) ?? []).length,
              10,
            );
            assert.equal(
              (listing.match(/data-compact="true"/g) ?? []).length,
              10,
            );
            for (const project of projects) {
              const study = projectStudies[project.projectId];
              const edition = editions.find((e) => e.year === project.year);
              const detail = render(HistoryPage, { year: project.year });
              const caseStudy = render(WinnersPage, {
                projectId: project.projectId,
              });
              assert.ok(
                listing.includes(
                  `href="/history/${project.year}/?lang=${language}#project-${project.projectId}"`,
                ),
              );
              assert.ok(
                listing.includes(escapeHtml(project.summary[language])),
              );
              assert.ok(detail.includes(`id="project-${project.projectId}"`));
              assert.ok(
                detail.includes(
                  `href="/winners/${project.projectId}/?lang=${language}"`,
                ),
              );
              assert.ok(detail.includes(escapeHtml(study.solution[language])));
              assert.ok(detail.includes(escapeHtml(study.technical[language])));
              assert.ok(
                caseStudy.includes(escapeHtml(study.solution[language])),
              );
              assert.ok(study.features.length >= 2);
              assert.equal(study.technicalSteps.length, 3);
              const expectedBasis = [
                'giraffe',
                'apollo-2023',
                'data-queens-report',
              ].includes(project.projectId)
                ? 'interpretation'
                : 'documented-design';
              for (const html of [detail, caseStudy]) {
                assert.doesNotMatch(
                  html,
                  /资料来源与说明|Sources &amp; record notes/,
                );
                assert.ok(
                  html.includes(`data-technical-basis="${expectedBasis}"`),
                );
                if (expectedBasis === 'interpretation')
                  assert.ok(
                    html.includes(
                      language === 'zh'
                        ? '非原团队已披露的实现细节'
                        : 'not a disclosed team implementation',
                    ),
                  );
                for (const step of study.technicalSteps) {
                  // Short official reports support concise steps, not padded implementation claims.
                  const conciseSource = [
                    'funder-2018',
                    'proscope-2019',
                    'nusight-2023',
                  ].includes(project.projectId);
                  assert.ok(
                    step.description.zh.length >= (conciseSource ? 12 : 50),
                  );
                  assert.ok(html.includes(escapeHtml(step.title[language])));
                  assert.ok(
                    html.includes(escapeHtml(step.description[language])),
                  );
                }
              }
              for (const feature of study.features) {
                assert.ok(detail.includes(escapeHtml(feature[language])));
                assert.ok(caseStudy.includes(escapeHtml(feature[language])));
              }
              const ids = [...detail.matchAll(/\sid="([^"]+)"/g)].map(
                (m) => m[1],
              );
              assert.equal(
                new Set(ids).size,
                ids.length,
                'Annual page IDs must be unique',
              );
              const university = universities.find(
                (u) => u.id === project.universityId,
              );
              assert.ok(detail.includes(`src="${university.logo}"`));
              assert.ok(
                !detail.includes(escapeHtml(edition.dateNote[language])),
                'Internal date notes are not rendered as public disclosures',
              );
              assert.ok(
                !listing.includes(escapeHtml(edition.dateNote[language])),
                'Timeline leads with projects, not audit notes',
              );
              for (const award of edition.awardResults ?? []) {
                assert.ok(detail.includes(`data-award-group="${award.id}"`));
                for (const universityId of award.universityIds) {
                  assert.ok(
                    detail.includes(
                      `href="/global-network/?year=${edition.year}&amp;university=${universityId}&amp;lang=${language}#university-card-${universityId}"`,
                    ),
                  );
                }
              }
            }
            assert.doesNotMatch(listing, /2025|未举办|Not held/);
            const lastHeld = render(HistoryPage, { year: 2024 });
            const upcoming = render(HistoryPage, { year: 2026 });
            for (const html of [listing, upcoming])
              assert.doesNotMatch(
                html,
                /资料来源与说明|Sources &amp; record notes/,
              );
            const { default: UniversityDetail } = await server.ssrLoadModule(
              '/components/network/UniversityDetailPanel.tsx',
            );
            for (const university of universities) {
              const panel = render(UniversityDetail, {
                university,
                onClose: () => {},
              });
              assert.doesNotMatch(
                panel,
                /<details|资料来源与说明|Sources &amp; record notes/,
              );
              assert.ok(panel.includes(`href="${university.website}"`));
            }
            assert.doesNotMatch(lastHeld, /2025/);
            assert.doesNotMatch(upcoming, /2025/);
            assert.ok(lastHeld.includes(`/history/2026/?lang=${language}`));
            assert.ok(upcoming.includes(`/history/2024/?lang=${language}`));
            for (const year of [2026]) {
              assert.doesNotMatch(
                render(HistoryPage, { year }),
                /data-edition-project=|data-award-group=/,
              );
            }
          }
        } finally {
          if (previousWindow)
            Object.defineProperty(globalThis, 'window', previousWindow);
          else delete globalThis.window;
          if (previousLocation)
            Object.defineProperty(globalThis, 'location', previousLocation);
          else delete globalThis.location;
        }
        const css = await readFile(
          'components/site/EditionProjectShowcase.module.css',
          'utf8',
        );
        assert.match(css, /@media \(max-width: 42rem\)/);
        assert.match(css, /grid-template-columns: 1fr/);
        assert.match(css, /:focus-visible/);
        assert.doesNotMatch(css, /animation:|transform:|canvas/);
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
        const competitionHtml = renderToString(
          React.createElement(Competition),
        );
        const formatSection = competitionHtml.match(
          /<section\b[^>]*id="format"[^>]*>[\s\S]*?<\/section>/,
        )?.[0];
        assert.ok(formatSection);
        assert.match(formatSection, /HISTORICAL FORMAT/);
        assert.equal((formatSection.match(/<li\b/g) ?? []).length, 5);
        assert.doesNotMatch(formatSection, /<p\b|<a\b/);
        const competitionSource = await readFile(
          'components/site/CompetitionPage.tsx',
          'utf8',
        );
        assert.doesNotMatch(
          competitionSource,
          /A typical historical sequence|以下为历史赛制的典型流程|Historical source: NUS Computing|历史来源：新加坡国立大学计算机学院/,
        );
        for (const html of [
          competitionHtml,
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
          assert.doesNotMatch(
            html,
            /Sources &amp; record notes|资料来源与说明/,
          );
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
