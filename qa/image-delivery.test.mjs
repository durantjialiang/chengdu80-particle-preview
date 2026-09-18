import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

async function filesIn(directory) {
  const groups = await Promise.all(
    (await readdir(directory, { withFileTypes: true })).map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesIn(path) : [path];
    }),
  );
  return groups.flat();
}

void test('public images use real WebP bitmaps within the delivery budget', async () => {
  const files = await filesIn('public');
  assert.deepEqual(
    files.filter((file) => /\.(?:png|jpe?g)$/i.test(file)),
    [],
  );
  const webp = files.filter((file) => file.endsWith('.webp'));
  assert.ok(
    webp.length > 300,
    'Do not reduce traffic by dropping the existing archive',
  );
  let total = 0;
  for (const file of files) total += (await stat(file)).size;
  assert.ok(total < 24 * 1024 * 1024, `Public assets exceed 24 MiB: ${total}`);
  for (const file of webp) {
    const bytes = await readFile(file);
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', file);
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', file);
    const budget = file.endsWith('-thumb.webp') ? 64 * 1024 : 320 * 1024;
    assert.ok(
      bytes.length <= budget,
      `${file}: ${bytes.length} bytes exceeds ${budget}`,
    );
  }
});
