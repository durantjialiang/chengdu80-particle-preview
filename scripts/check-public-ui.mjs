/** Check the production artifact, not merely a CSS-hidden developer panel. */
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const directory = 'out/particle-preview/assets';
const scripts = (await readdir(directory)).filter((file) => file.endsWith('.js'));
const source = (await Promise.all(scripts.map((file) => readFile(`${directory}/${file}`, 'utf8')))).join('\n');
for (const label of [
  'Replay intro',
  'Pointer interaction',
  'Intro preview controls',
  'Native scroll story',
]) assert.ok(!source.includes(label), `Production must not contain developer UI: ${label}`);
console.log(`Public UI check passed: ${scripts.length} JavaScript chunks contain no intro review panel or status labels.`);
