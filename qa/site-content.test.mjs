import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

await test('site content and static archive contracts', async (t) => {
  const server = await createServer({ configFile:'qa/particle80.vite.config.ts', cacheDir:'node_modules/.vite-site-tests', server:{middlewareMode:true,hmr:false,watch:null}, appType:'custom', optimizeDeps:{noDiscovery:true,include:[]} });
  try {
    const {currentCompetition:c, year2025, faqs, approvedDownloads} = await server.ssrLoadModule('/content/competition.ts');
    const {editions, projects, sources} = await server.ssrLoadModule('/content/archive.ts');
    const routes = JSON.parse(await readFile('content/site-routes.json','utf8'));
    const {universities} = await server.ssrLoadModule('/content/universities.ts');
    await t.test('2025/2026 do not imply false dates, registration or an edition', () => {
      assert.equal(year2025.status,'not-held'); assert.equal(c.month,10); assert.equal(c.datePrecision,'month');
      for (const key of ['edition','startDate','endDate','applicationUrl','venue','challenge','contact']) assert.equal(c[key],null,key);
      assert.equal(c.confirmationStatus,'project-owner-supplied'); assert.equal(approvedDownloads.length,0);
      assert.equal(new Set(faqs.map(f=>f.id)).size,faqs.length);
      assert.match(faqs.find(f=>f.id==='dates').answer.en,/October 2026/);
    });
    await t.test('all archive records have deep-link build destinations and real source refs', () => {
      for (const e of editions) assert.ok(routes.some(r=>r.path===`/history/${e.year}/`));
      for (const p of projects) {
        assert.ok(routes.some(r=>r.path===`/winners/${p.projectId}/`));
        assert.ok(universities.some(u=>u.id===p.universityId));
        assert.ok(p.sourceRefs.length); p.sourceRefs.forEach(id=>assert.match(sources[id].url,/^https:\/\//));
        assert.equal(p.demoUrl,null); assert.equal(p.repositoryUrl,null);
      }
      assert.equal(projects.find(p=>p.projectId==='data-queens-report').year,null);
      assert.equal(projects.find(p=>p.projectId==='data-queens-report').projectName,null);
      assert.equal(projects.find(p=>p.projectId==='apollo-2023').projectName,null);
      assert.equal(projects.find(p=>p.projectId==='pisces').teamName,null);
      assert.equal(editions.find(e=>e.year===2024).status,'record-only');
      assert.equal(editions.find(e=>e.year===2023).finalDate,'2023-11-02');
      assert.equal(editions.find(e=>e.year===2025).edition,null);
      assert.ok(routes.every(r=>r.path.endsWith('/')));
    });
    await t.test('text pages and all details render without WebGL or browser APIs', async () => {
      const {HistoryPage,WinnersPage}=await server.ssrLoadModule('/components/site/ArchivePages.tsx');
      const {default:Competition}=await server.ssrLoadModule('/components/site/CompetitionPage.tsx');
      for (const html of [renderToString(React.createElement(Competition)), ...editions.map(e=>renderToString(React.createElement(HistoryPage,{year:e.year}))), ...projects.map(p=>renderToString(React.createElement(WinnersPage,{projectId:p.projectId})))]) {
        assert.match(html,/<h1/); assert.doesNotMatch(html,/<canvas|WebGLRenderer/);
      }
      const textEntry = await readFile('qa/site.tsx','utf8');
      assert.doesNotMatch(textEntry,/Particle80|GlobalUniversityNetwork|components\/Globe/);
    });
  } finally { await server.close(); }
});
