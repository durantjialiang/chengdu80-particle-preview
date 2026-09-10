import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { stat, readFile } from 'node:fs/promises';

await test('Network V2 filtered identity and archive contracts', async (t) => {
  const server = await createServer({
    configFile: 'qa/particle80.vite.config.ts',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const {
      filterUniversities,
      explorerNodes,
      universitySpotlight,
      readNetworkView,
      networkViewUrl,
    } = await server.ssrLoadModule('/lib/university-explorer.ts');
    const { networkCities, networkRoutes } = await server.ssrLoadModule(
      '/components/Hero/geometry.ts',
    );
    const { publicArchiveImages, isPubliclyUsable } =
      await server.ssrLoadModule('/content/archive-media.ts');
    const { projects, sources } = await server.ssrLoadModule(
      '/content/archive.ts',
    );
    const routes = JSON.parse(
      await readFile('content/site-routes.json', 'utf8'),
    );
    await t.test(
      '2019 NUS exact photograph, ProScope and edition award; no project-photo invention',
      async () => {
        const record = universitySpotlight('nus', 2019);
        assert.equal(record.teamPhoto.id, 'cd80-2019-03');
        assert.equal(record.teamPhoto.projectId, null);
        assert.deepEqual(
          record.projects.map((p) => p.projectId),
          ['proscope-2019'],
        );
        assert.deepEqual(
          record.awards.map((a) => a.id),
          ['2019-pioneer'],
        );
        for (const image of publicArchiveImages) {
          assert.ok(isPubliclyUsable(image));
          await stat('public' + image.localAssetPath);
          await stat('public' + image.thumbnailPath);
        }
        assert.equal(publicArchiveImages.length, 128);
      },
    );
    await t.test(
      '2023 NUS and 2024 Queens do not borrow the 2019 photograph',
      () => {
        const nus = universitySpotlight('nus', 2023),
          queens = universitySpotlight('queens', 2024);
        assert.equal(nus.teamPhoto, null);
        assert.equal(nus.projects[0].projectId, 'nusight-2023');
        assert.equal(nus.projects[0].teamName, 'NUS Finovators');
        assert.equal(nus.awards[0].id, '2023-nus-second');
        assert.equal(queens.teamPhoto, null);
        assert.equal(queens.projects[0].projectName, null);
        assert.equal(queens.eventPhotos.length, 3);
        assert.ok(
          queens.eventPhotos.every(
            (p) =>
              p.universityId === null &&
              p.projectId === null &&
              p.eventYear === 2024,
          ),
        );
      },
    );
    await t.test(
      'filter BEFORE city grouping; live routes, fallback input and directory share membership',
      () => {
        for (const year of [
          'all',
          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024,
          2025,
          2026,
        ]) {
          for (const query of ['', 'Zurich', '成都', 'NUS', 'does-not-exist']) {
            const filtered = filterUniversities(year, query),
              nodes = explorerNodes(filtered);
            assert.deepEqual(
              nodes.flatMap((n) => n.universityIds).sort(),
              filtered.map((u) => u.id).sort(),
            );
            assert.deepEqual(networkCities(false, true, nodes), nodes);
            assert.equal(
              networkRoutes(false, true, nodes).length,
              nodes.filter((n) => !n.isOrigin).length,
            );
          }
        }
        assert.deepEqual(
          explorerNodes(filterUniversities(2021, 'Zurich')).flatMap(
            (n) => n.universityIds,
          ),
          ['uzh'],
        );
        assert.deepEqual(
          explorerNodes(filterUniversities(2022, 'Zurich')).flatMap(
            (n) => n.universityIds,
          ),
          ['eth'],
        );
        assert.deepEqual(
          explorerNodes(filterUniversities('all', 'Zurich')).find(
            (n) => !n.isOrigin,
          ).universityIds,
          ['eth', 'uzh'],
        );
        const beijing = explorerNodes(filterUniversities(2019, '北京')).find(
          (n) => !n.isOrigin,
        );
        assert.deepEqual(beijing.universityIds, ['tsinghua', 'pku']);
        assert.equal(
          beijing.latitude,
          filterUniversities(2019, 'Tsinghua')[0].latitude,
        );
        assert.deepEqual(
          explorerNodes(filterUniversities(2020, 'Chengdu'))[0].universityIds,
          ['swufe', 'uestc'],
        );
        const uestcOnly = explorerNodes(filterUniversities(2020, 'UESTC'));
        assert.equal(uestcOnly.length, 2);
        assert.deepEqual(uestcOnly.find((n) => n.isOrigin).universityIds, []);
        const campus = uestcOnly.find((n) => !n.isOrigin);
        assert.equal(campus.id, 'uestc');
        assert.equal(campus.latitude, 30.752);
        assert.equal(campus.longitude, 103.924);
        assert.equal(networkRoutes(false, true, uestcOnly).length, 1);
        for (const year of [2025, 2026]) {
          assert.equal(filterUniversities(year).length, 0);
          assert.deepEqual(explorerNodes([])[0].universityIds, []);
        }
      },
    );
    await t.test(
      'selected mismatch, modes and missing awards remain explicit',
      () => {
        const mismatch = universitySpotlight('nus', 2022);
        assert.equal(mismatch.hasRecord, false);
        assert.equal(mismatch.teamPhoto, null);
        assert.equal(mismatch.projects.length, 0);
        assert.equal(mismatch.awards.length, 0);
        const unsw = universitySpotlight('unsw', 2020);
        assert.equal(unsw.mode, 'online');
        assert.equal(unsw.awards.length, 0);
        assert.equal(unsw.projects.length, 0);
        assert.equal(universitySpotlight('uzh', 2021).mode, 'online');
        assert.equal(universitySpotlight('tsinghua', 2021).mode, 'onsite');
        assert.equal(filterUniversities('all').length, 20);
        assert.equal(
          filterUniversities('all').reduce(
            (n, u) => n + u.participationYears.length,
            0,
          ),
          58,
        );
      },
    );
    await t.test(
      'academic visits appear on the globe without becoming competition entries',
      async () => {
        const { getUniversity } = await server.ssrLoadModule(
          '/content/universities.ts',
        );
        for (const id of ['uchicago', 'ucsd']) {
          const university = getUniversity(id);
          assert.equal(university.relationshipType, 'academic');
          assert.deepEqual(university.participationYears, []);
          assert.deepEqual(university.awards, []);
          assert.deepEqual(university.projects, []);
          assert.ok(
            filterUniversities(2019, '', 'north-america').some(
              (u) => u.id === id,
            ),
          );
          assert.ok(!filterUniversities(2018).some((u) => u.id === id));
          const node = explorerNodes(filterUniversities('all')).find(
            (n) => n.id === id,
          );
          assert.equal(node.isEcosystem, true);
          const record = universitySpotlight(id, 2019);
          assert.equal(record.hasRecord, true);
          assert.equal(record.hasParticipation, false);
          assert.equal(record.mode, 'unknown');
          assert.equal(record.teamPhoto, null);
          assert.deepEqual(record.awards, []);
          assert.deepEqual(record.projects, []);
          assert.equal(universitySpotlight(id, 2022).hasRecord, false);
          assert.equal(
            readNetworkView(`?university=${id}&year=2019`).selectedId,
            id,
          );
        }
        assert.equal(
          filterUniversities('all').filter((u) => u.id === 'berkeley').length,
          1,
        );
        assert.ok(filterUniversities(2021).some((u) => u.id === 'berkeley'));
        assert.ok(!getUniversity('berkeley').participationYears.includes(2021));
        const berkeleyExchange = universitySpotlight('berkeley', 2021);
        assert.equal(berkeleyExchange.hasRecord, true);
        assert.equal(berkeleyExchange.hasParticipation, false);
        assert.equal(berkeleyExchange.teamPhoto, null);
        assert.deepEqual(berkeleyExchange.awards, []);
        assert.equal(
          explorerNodes(filterUniversities(2021), 2021).find(
            (node) => node.id === 'berkeley',
          ).isEcosystem,
          true,
        );
        assert.equal(
          explorerNodes(filterUniversities(2019), 2019).find(
            (node) => node.id === 'berkeley',
          ).isEcosystem,
          false,
        );
        assert.deepEqual(
          filterUniversities('all', '芝加哥').map((u) => u.id),
          ['uchicago'],
        );
        assert.deepEqual(
          filterUniversities('all', '圣迭戈').map((u) => u.id),
          ['ucsd'],
        );
      },
    );
    await t.test(
      'URLs preserve language, unrelated query and fragment, and sanitize invalid identity',
      () => {
        const url = networkViewUrl(
          'https://example.com/global-network/?lang=zh&keep=yes#map',
          { year: 2019, region: 'all', query: '', selectedId: 'nus' },
        );
        assert.equal(
          url,
          '/global-network/?lang=zh&keep=yes&year=2019&university=nus#map',
        );
        assert.deepEqual(readNetworkView(url.split('?')[1].split('#')[0]), {
          year: 2019,
          region: 'all',
          query: '',
          selectedId: 'nus',
        });
        assert.deepEqual(readNetworkView('?year=bad&university=bad'), {
          year: 'all',
          region: 'all',
          query: '',
          selectedId: 'swufe',
        });
        assert.ok(
          !networkViewUrl('https://example.com/?year=2019&lang=en', {
            year: 'all',
            region: 'all',
            query: '',
            selectedId: 'hku',
          }).includes('year='),
        );
      },
    );
    await t.test(
      'region, year and bilingual keyword filters share geographic membership',
      async () => {
        const { networkRegions, regionForUniversity } =
          await server.ssrLoadModule('/content/network-regions.ts');
        const all = filterUniversities('all');
        assert.ok(all.every((u) => regionForUniversity(u)));
        assert.deepEqual(
          networkRegions.map(
            (region) => filterUniversities('all', '', region).length,
          ),
          [20, 10, 3, 6, 1],
        );
        assert.deepEqual(
          filterUniversities(2021, '苏黎世', 'europe').map((u) => u.id),
          ['uzh'],
        );
        assert.deepEqual(
          filterUniversities(2019, '', 'north-america').map((u) => u.id),
          ['berkeley', 'uchicago', 'ucsd', 'toronto'],
        );
        assert.deepEqual(
          filterUniversities(2020, '', 'oceania').map((u) => u.id),
          ['unsw'],
        );
        assert.equal(filterUniversities(2024, 'NUS', 'europe').length, 0);
        for (const region of networkRegions) {
          assert.equal(filterUniversities(2026, '', region).length, 0);
          const selected = filterUniversities('all', '', region);
          assert.deepEqual(
            explorerNodes(selected)
              .flatMap((n) => n.universityIds)
              .sort(),
            selected.map((u) => u.id).sort(),
          );
        }
        const view = {
          year: 2021,
          region: 'europe',
          query: 'Zurich',
          selectedId: 'uzh',
        };
        const url = networkViewUrl(
          'https://example.com/global-network/?lang=zh#global-network',
          view,
        );
        assert.deepEqual(
          readNetworkView(url.split('?')[1].split('#')[0]),
          view,
        );
        assert.equal(readNetworkView('?region=invalid&query=').region, 'all');
      },
    );
    await t.test(
      'three new routes resolve stable project, year, school and original report',
      () => {
        const expected = {
          'funder-2018': [2018, 'berkeley'],
          'proscope-2019': [2019, 'nus'],
          'nusight-2023': [2023, 'nus'],
        };
        assert.equal(projects.length, 10);
        for (const [id, [year, university]] of Object.entries(expected)) {
          const p = projects.find((p) => p.projectId === id);
          assert.equal(p.year, year);
          assert.equal(p.universityId, university);
          assert.ok(p.sourceRefs.every((ref) => sources[ref]));
          assert.ok(routes.some((r) => r.path === `/winners/${id}/`));
          assert.equal(p.image, null);
          assert.equal(p.demoUrl, null);
          assert.equal(p.awardRank, 2);
        }
      },
    );
  } finally {
    await server.close();
  }
});
