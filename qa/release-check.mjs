import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import routes from '../content/site-routes.json' with { type: 'json' };
const output = new URL('../out/particle-preview/', import.meta.url);
const base = process.argv[2];
const paths = ['/', '/global-network/', ...routes.map(r => r.path)];
const rows = [];
for (const path of [...paths, '/404.html']) {
  const file = new URL(path === '/404.html' ? '404.html' : path.slice(1) + 'index.html', output);
  const html = await readFile(file, 'utf8');
  assert.match(html, /noindex, nofollow/);
  for (const [,asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) assert.ok((await stat(new URL(asset.slice(1),output))).isFile(),asset);
  if (base && path !== '/404.html') {
    const response = await fetch(new URL(path,base), {signal:AbortSignal.timeout(20000)});
    assert.equal(response.status,200,path);
    const deployed = await response.text();
    const scripts = [...html.matchAll(/src="(\/assets\/[^"?#]+\.js)"/g)].map(m=>m[1]);
    for (const script of scripts) assert.ok(deployed.includes(script), `Stale deployment ${path} ${script}`);
    rows.push({path,status:response.status,title:deployed.match(/<title>(.*?)<\/title>/)?.[1]});
  }
}
const html = await readFile(new URL('index.html',output),'utf8');
const particleAsset = html.match(/src="(\/assets\/particle80-[^"?#]+\.js)"/)?.[1];
if (base && particleAsset) {
  const response=await fetch(new URL(particleAsset,base),{signal:AbortSignal.timeout(20000)});
  const bytes=Buffer.from(await response.arrayBuffer());
  const local=await readFile(new URL(particleAsset.slice(1),output));
  assert.deepEqual(bytes,local,'Published particle asset differs from validated build');
  rows.push({asset:particleAsset,sha256:createHash('sha256').update(bytes).digest('hex')});
}
if (base) for (const path of ['/not-a-real-page/', '/assets/not-a-real-file.js']) {
  const response=await fetch(new URL(path,base),{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,404,path);
  rows.push({path,status:response.status});
}
const files = await readdir(output,{recursive:true});
const forbidden = files.filter(f=>/(?:^|\/)(?:\.env[^/]*|node_modules|docs|\.git)(?:\/|$)|\.(?:pdf|pem)$/i.test(f));
assert.deepEqual(forbidden,[], 'Private or unapproved files in public output');
console.log(JSON.stringify({checkedAt:new Date().toISOString(),base:base??'local files',routes:paths.length,privateFiles:forbidden,rows},null,2));
