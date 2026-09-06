import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'vite';
import * as THREE from 'three';
import React from 'react';
import { renderToString } from 'react-dom/server';

await test('shared university ecosystem contracts', async (t) => {
  const server = await createServer({
    configFile: 'qa/particle80.vite.config.ts',
    server: { middlewareMode: true, hmr: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const { universities, globeNodes, getUniversity } =
      await server.ssrLoadModule('/content/network.ts');
    const { siteContent } = await server.ssrLoadModule('/content/site.ts');
    const { networkCities, networkRoutes, latLon, universityOrientation } =
      await server.ssrLoadModule('/components/Hero/geometry.ts');
    const { RADIUS } = await server.ssrLoadModule(
      '/components/Hero/scene-config.ts',
    );
    await t.test(
      'all 17 requested institutions have unique shared records and real bounded coordinates',
      () => {
        const ids = [
          'swufe',
          'tsinghua',
          'pku',
          'sjtu',
          'uestc',
          'sustech',
          'cqu',
          'hku',
          'nus',
          'berkeley',
          'gatech',
          'toronto',
          'queens',
          'eth',
          'uzh',
          'tau',
          'emlyon',
        ];
        assert.deepEqual(
          universities.map((u) => u.id),
          ids,
        );
        assert.equal(new Set(ids).size, 17);
        assert.equal(siteContent.cities, globeNodes);
        for (const u of universities) {
          const node = globeNodes.find((n) => n.id === u.id);
          assert.ok(node, u.id);
          assert.equal(node.latitude, u.latitude);
          assert.equal(node.longitude, u.longitude);
          assert.ok(Math.abs(u.latitude) <= 90 && Math.abs(u.longitude) <= 180);
          assert.equal(getUniversity(u.id), u);
          assert.ok(u.evidence.length > 0);
          assert.ok(
            ['participant', 'winner', 'organizer', 'ecosystem'].includes(
              u.relationshipType,
            ),
          );
        }
        assert.deepEqual(
          globeNodes.filter((n) => n.isOrigin).map((n) => n.id),
          ['swufe'],
        );
      },
    );
    await t.test(
      'every displayed participation year and achievement has evidence; publication dates stay separate',
      () => {
        for (const u of universities) {
          assert.deepEqual(
            [...new Set(u.participationYears)].sort((a, b) => a - b),
            u.participationYears,
          );
          for (const year of u.participationYears)
            assert.ok(
              u.evidence.some((e) => e.years.includes(year)),
              `${u.id} ${year}`,
            );
          for (const a of [...u.awards, ...u.projects]) {
            assert.ok(
              u.evidence.some((e) => e.url === a.sourceUrl),
              `${u.id} ${a.name}`,
            );
            if (a.year !== null)
              assert.ok(u.participationYears.includes(a.year));
            else assert.ok(Number.isInteger(a.reportedYear));
          }
        }
        assert.deepEqual(getUniversity('toronto').participationYears, []);
        assert.equal(getUniversity('emlyon').relationshipType, 'ecosystem');
        assert.deepEqual(getUniversity('emlyon').participationYears, []);
        assert.ok(
          getUniversity('queens').awards.some(
            (a) => a.year === null && a.reportedYear === 2024,
          ),
        );
        assert.equal(
          globeNodes.find((n) => n.id === 'emlyon').isEcosystem,
          true,
        );
      },
    );
    await t.test(
      'logos are local original assets and outbound URLs stay on official university/event domains',
      async () => {
        const allowed = [
          'swufe.edu.cn',
          'tsinghua.edu.cn',
          'pku.edu.cn',
          'sjtu.edu.cn',
          'uestc.edu.cn',
          'sustech.edu.cn',
          'cqu.edu.cn',
          'hku.hk',
          'nus.edu.sg',
          'berkeley.edu',
          'gatech.edu',
          'utoronto.ca',
          'queensu.ca',
          'ethz.ch',
          'uzh.ch',
          'tau.ac.il',
          'em-lyon.com',
          'em-lyon.com.cn',
        ];
        for (const u of universities) {
          assert.match(u.logo, /^\/university-logos\/[a-z-]+\.(svg|png|jpg)$/);
          assert.ok((await stat(`public${u.logo}`)).size > 100);
          for (const url of [u.website, ...u.evidence.map((e) => e.url)]) {
            const parsed = new URL(url);
            assert.equal(parsed.protocol, 'https:');
            assert.ok(
              allowed.some(
                (domain) =>
                  parsed.hostname === domain ||
                  parsed.hostname.endsWith('.' + domain),
              ),
              url,
            );
          }
          if (u.logo.endsWith('.svg'))
            assert.doesNotMatch(
              await readFile(`public${u.logo}`, 'utf8'),
              /<script|onload=|javascript:/i,
            );
        }
      },
    );
    await t.test(
      'all campus selections rotate to the visible camera-facing hemisphere',
      () => {
        for (const low of [false, true])
          for (const u of universities) {
            const view = new THREE.Vector3(
              -0.62,
              0.46,
              low ? 5.95 : 6.45,
            ).normalize();
            const orientation = universityOrientation(
              u.latitude,
              u.longitude,
              view,
            );
            const normal = latLon(u.latitude, u.longitude, 1).applyQuaternion(
              orientation,
            );
            assert.ok(normal.dot(view) > 0.99999, u.id);
            assert.ok(Math.abs(orientation.length() - 1) < 1e-10);
            const campusNormal = latLon(u.latitude, u.longitude, 1);
            const north = new THREE.Vector3(0, 1, 0)
              .addScaledVector(campusNormal, -campusNormal.y)
              .normalize()
              .applyQuaternion(orientation);
            const screenUp = new THREE.Vector3(0, 1, 0)
              .addScaledVector(view, -view.y)
              .normalize();
            assert.ok(north.dot(screenUp) > 0.99999, `${u.id} north up`);
          }
      },
    );
    await t.test(
      'close campuses have non-overlapping bounded labels without moving geographic anchors',
      async () => {
        const { placeNetworkLabels } = await server.ssrLoadModule(
          '/lib/network-labels.ts',
        );
        for (const [width, height] of [
          [684, 424],
          [352, 295],
          [282, 295],
        ]) {
          const anchors = Array.from({ length: 10 }, (_, i) => ({
            id: String(i),
            x: width / 2 + (i % 2) * 2,
            y: height / 2,
            width: i ? 90 : 145,
            visibility: 1,
            labelX: 0,
            labelY: 0,
          }));
          const before = anchors.map((a) => [a.x, a.y]);
          assert.equal(placeNetworkLabels(anchors, width, height), anchors);
          anchors.forEach((a, i) => {
            assert.deepEqual([a.x, a.y], before[i]);
            assert.ok(a.labelX >= 0 && a.labelX + a.width <= width);
            assert.ok(a.labelY >= 0 && a.labelY + 32 <= height);
            for (const b of anchors.slice(0, i))
              assert.ok(
                a.labelX + a.width <= b.labelX ||
                  b.labelX + b.width <= a.labelX ||
                  a.labelY + 32 <= b.labelY ||
                  b.labelY + 32 <= a.labelY,
                `${width} overlap ${a.id}/${b.id}`,
              );
          });
        }
      },
    );
    await t.test(
      'every university route terminates at the same SWUFE hub and never crosses through the sphere',
      () => {
        for (const low of [false, true]) {
          assert.equal(
            networkCities(low, true).length,
            17,
            'mobile explorer retains all schools',
          );
          const cities = networkCities(low, true);
          const routes = networkRoutes(low, true);
          assert.equal(routes.length, 16);
          const origin = cities.find((c) => c.isOrigin);
          const start = latLon(
            origin.latitude,
            origin.longitude,
            RADIUS + 0.026,
          );
          routes.forEach((curve, index) => {
            const dest = cities.filter((c) => !c.isOrigin)[index];
            assert.ok(curve.getPointAt(0).distanceTo(start) < 1e-8);
            assert.ok(
              curve
                .getPointAt(1)
                .distanceTo(
                  latLon(dest.latitude, dest.longitude, RADIUS + 0.026),
                ) < 1e-8,
            );
            for (let j = 0; j <= 80; j++) {
              const p = curve.getPointAt(j / 80);
              assert.ok(p.toArray().every(Number.isFinite));
              assert.ok(p.length() > RADIUS);
            }
          });
        }
      },
    );
    await t.test(
      'all 17 cards and details SSR without browser APIs; unknown records are not fabricated',
      async () => {
        const { default: Card } = await server.ssrLoadModule(
          '/components/network/UniversityCard.tsx',
        );
        const { default: Detail } = await server.ssrLoadModule(
          '/components/network/UniversityDetailPanel.tsx',
        );
        for (const u of universities) {
          const html = renderToString(
            React.createElement(Card, {
              university: u,
              highlighted: false,
              selected: false,
              reducedMotion: true,
              index: 0,
              register: () => {},
              onHover: () => {},
              onDetails: () => {},
            }),
          );
          assert.ok(html.includes(`data-university="${u.id}"`));
          assert.match(html, /aria-haspopup="dialog"/);
          assert.match(html, /rel="noopener noreferrer"/);
          const panel = renderToString(
            React.createElement(Detail, { university: u, onClose: () => {} }),
          );
          assert.match(panel, /aria-labelledby="university-detail-title"/);
        }
        assert.throws(() => getUniversity('imaginary-university'));
      },
    );
  } finally {
    await server.close();
  }
});
