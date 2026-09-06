/** Post-build check: local-review files, URLs and originals must not enter static output. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import { createHash } from 'node:crypto';
import routes from '../content/site-routes.json' with { type: 'json' };
import approvedImages from '../content/archive-media-approved.json' with { type: 'json' };

const output = resolve('out/particle-preview');
const reviewRoot = process.argv[2] ? resolve(process.argv[2]) : null;
const forbiddenHashes = new Set();
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const approvedIds = new Set(approvedImages.map((i) => i.id));
const allowedPaths = new Map();
for (const image of approvedImages) {
  assert.equal(image.usageStatus, 'approved');
  assert.ok(
    image.permission.newWebsite &&
      image.permission.publicPreview &&
      image.permission.evidenceRef,
  );
  for (const path of [image.localAssetPath, image.thumbnailPath]) {
    assert.match(path, /^\/history-media\/[a-z0-9-]+\.webp$/);
    allowedPaths.set(
      path,
      hash(await readFile(resolve('public', path.slice(1)))),
    );
  }
}
if (reviewRoot) {
  const images = JSON.parse(
    await readFile(resolve(reviewRoot, 'review-media.json'), 'utf8'),
  );
  for (const image of images) {
    if (image.originalSha256) forbiddenHashes.add(image.originalSha256);
    if (!approvedIds.has(image.id))
      for (const key of ['localAssetPath', 'thumbnailPath'])
        forbiddenHashes.add(
          hash(await readFile(resolve(reviewRoot, image[key]))),
        );
  }
}
let files = 0;
let approvedFiles = 0;
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    assert.equal(entry.isSymbolicLink(), false, path);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    const local = relative(output, path);
    assert.doesNotMatch(
      local,
      /review-media|source-pages|research\/|node_modules\/|(?:^|\/)\.env|\.pem$/i,
    );
    const bytes = await readFile(path);
    if (local.startsWith('history-media/')) {
      assert.ok(allowedPaths.has('/' + local), `unlisted image: ${local}`);
      assert.equal(hash(bytes), allowedPaths.get('/' + local));
      approvedFiles++;
    }
    assert.equal(
      forbiddenHashes.has(hash(bytes)),
      false,
      `private photo bytes in ${local}`,
    );
    if (
      ['.js', '.html', '.css', '.json', '.txt', '.md'].includes(extname(path))
    ) {
      assert.doesNotMatch(
        bytes.toString('utf8'),
        /\/_history-review\/|review-media\.json|research\/history-migration|\/Users\/jaylen\//,
        local,
      );
    }
    files++;
  }
}
await walk(output);
assert.equal(approvedFiles, allowedPaths.size);
for (const route of routes) {
  const html = await readFile(
    resolve(output, route.path.slice(1), 'index.html'),
    'utf8',
  );
  assert.match(html, /<title>/);
}
console.log(
  JSON.stringify(
    {
      staticFiles: files,
      approvedHistoryPhotos: approvedImages.length,
      approvedDerivativeFiles: approvedFiles,
      archiveAndContentRoutes: routes.length,
      privatePhotoHashesChecked: forbiddenHashes.size,
      privatePhotoMatches: 0,
      privateURLsOrLocalPaths: 0,
      note: 'Static artifact check only; not a browser rendering test.',
    },
    null,
    2,
  ),
);
