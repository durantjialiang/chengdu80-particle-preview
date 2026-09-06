/** Exports public-source metadata only. No original research media or credentials. */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';

if (!process.argv[2])
  throw new Error(
    'Usage: node scripts/export-editorial-review.mjs /absolute/export/directory',
  );
const destination = resolve(process.argv[2]);
for (const folder of ['public', 'out', 'content']) {
  const local = relative(resolve(folder), destination);
  if (!local || (!local.startsWith('..') && !local.startsWith('/')))
    throw new Error(
      'Use a separate review export directory, not a public build or source directory.',
    );
}
const server = await createServer({
  configFile: 'qa/particle80.vite.config.ts',
  cacheDir: 'node_modules/.vite-editorial-export',
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const data = await server.ssrLoadModule('/content/ecosystem.ts');
  const { projectStudies } = await server.ssrLoadModule(
    '/content/project-studies.ts',
  );
  const photos = JSON.parse(
    await readFile('content/archive-media-approved.json', 'utf8'),
  );
  const sourceRows = Object.entries(data.ecosystemSources).map(
    ([id, source]) => ({
      id,
      title: source.title.zh,
      url: source.url,
      published: source.published ?? '',
      kind: 'original-source',
    }),
  );
  sourceRows.push({
    id: 'hundsun-name',
    title: '恒生电子英文品牌名称核对',
    url: 'https://en.hundsun.com/',
    published: '',
    kind: 'name-verification',
  });
  for (const [id, study] of Object.entries(projectStudies))
    sourceRows.push({
      id: `project-${id}`,
      title: study.evidenceLabel.zh,
      url: study.evidenceUrl,
      published: '',
      kind: 'project-description',
    });
  const csv = (rows, columns) =>
    '\ufeff' +
    [
      columns.join(','),
      ...rows.map((row) =>
        columns
          .map(
            (key) => '"' + String(row[key] ?? '').replaceAll('"', '""') + '"',
          )
          .join(','),
      ),
    ].join('\n') +
    '\n';
  await mkdir(destination, { recursive: true });
  await writeFile(resolve(destination, 'README.md'), await readFile('docs/site-upgrade-2026-09-06.md', 'utf8'));
  await writeFile(
    resolve(destination, 'sources.csv'),
    csv(sourceRows, ['id', 'title', 'url', 'published', 'kind']),
  );
  await writeFile(
    resolve(destination, 'materials.csv'),
    csv(
      photos.map((p) => ({
        ...p,
        caption: p.caption.zh,
        approvalEvidence: p.permission.evidenceRef,
      })),
      [
        'id',
        'sourcePage',
        'originalImageUrl',
        'eventYear',
        'caption',
        'universityId',
        'projectId',
        'imageType',
        'photographer',
        'credit',
        'usageStatus',
        'approvalEvidence',
        'width',
        'height',
        'localAssetPath',
        'thumbnailPath',
      ],
    ),
  );
  await writeFile(
    resolve(destination, 'source-and-material-map.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        branch: execFileSync('git', ['branch', '--show-current'], {
          encoding: 'utf8',
        }).trim(),
        baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
          encoding: 'utf8',
        }).trim(),
        workingTreeHasChanges:
          execFileSync('git', ['status', '--porcelain'], {
            encoding: 'utf8',
          }).trim().length > 0,
        sources: sourceRows,
        partnerEditions: data.partnerEditions,
        impactStories: data.impactStories,
        historicalPeople: data.historicalPeople,
        industryConnections: data.industryConnections,
        photos,
        projectStudies,
      },
      null,
      2,
    ) + '\n',
  );
  await writeFile(
    resolve(destination, 'school-requests.md'),
    [
      '# 成都八零：待学校补充资料',
      '',
      '2026年10月为项目负责人提供的月份；不推断具体日期、届次或名单。历史内容不因此暂停发布。',
      '',
      ...data.schoolRequests.flatMap((item) => [
        `## ${item.title.zh}`,
        '',
        item.text.zh,
        '',
      ]),
      '## 作品配图的具体待办',
      '',
      '- NuShadow：五周年专刊 PDF 第22页 / 印刷第15页。产品配图复用授权待确认。',
      '- Dragon Search：PDF 第38页 / 印刷第31页。产品配图复用授权待确认；现页香港大学合影只标为2019背景影像。',
      '- Pisces：PDF 第48页 / 印刷第41页。产品配图复用授权待确认。',
      '- Data Queens：产品专名、产品截图、完整技术架构及演示/代码入口未确认；现页2024电脑协作图不绑定具体团队。',
      '',
      '现有13张获准公开的历史照片已复用。未新增传播完整专刊、未授权原图、生成肖像或伪造产品图。',
    ].join('\n'),
  );
  console.log(
    JSON.stringify(
      {
        destination,
        sources: sourceRows.length,
        approvedPhotos: photos.length,
        detailedCases: Object.keys(projectStudies).length,
      },
      null,
      2,
    ),
  );
} finally {
  await server.close();
}
