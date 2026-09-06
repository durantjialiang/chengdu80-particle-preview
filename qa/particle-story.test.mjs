import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ configFile: 'qa/particle80.vite.config.ts', cacheDir: 'node_modules/.vite-story-tests', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { sampleParticleStory, createParticleStory, backgroundCanAnimate, pointerToField } = await server.ssrLoadModule('/lib/particle-story.ts');
  const { particleProjection } = await server.ssrLoadModule('/lib/particle80-projection.ts');
  const { configureSideField, setSideFieldTargets } = await server.ssrLoadModule('/lib/particle80-story-field.ts');
  const { createParticleField, setFieldTargets, initializeField, integrateField, FIELD_DEFAULTS, FIELD_LOOPS } = await server.ssrLoadModule('/lib/particle80-field.ts');
  const config = { ...FIELD_DEFAULTS, pointerForce: FIELD_DEFAULTS.mouseForce };
  const off = { x: 0, y: 0, strength: 0 };
  const layout = {};
  configureSideField(layout, 1440, 560, 130, 600);
  function field() {
    const f = createParticleField(600);
    setFieldTargets(f, 12, 1, { sourceX: 2.65, sourceY: 0 }, 0);
    initializeField(f);
    return f;
  }
  function advance(f, time, progress, pointer = off) {
    setFieldTargets(f, time, 1, { sourceX: 2.65, sourceY: 0 }, 0);
    setSideFieldTargets(f, time, progress, layout);
    integrateField(f, 1 / 60, time, pointer, config);
  }
  await test('absolute scroll is bounded, reversible and independent of elapsed time', () => {
    const states = [0, .25, .5, 1, .5, .25, 0].map(p => sampleParticleStory(-p * 702, 1700 - p * 702, 900));
    assert.deepEqual(states[0], states[6]); assert.deepEqual(states[1], states[5]);
    assert.deepEqual(states[2], states[4]);
    assert.equal(states[3].spreadProgress, 1);
    assert.equal(states[0].identityOpacity, 1); assert.equal(states[3].identityOpacity, 0);
    assert.equal(sampleParticleStory(-2000, -1, 900).introInView, false);
    assert.equal(sampleParticleStory(-950, 850, 900).heroInView, false);
    assert.equal(sampleParticleStory(-950, 850, 900).introInView, true);
    assert.equal(sampleParticleStory(-900, 800, 900, true).spreadProgress, 1);
    assert.equal(sampleParticleStory(-20000, -10000, 900).spreadProgress, 1);
    assert.ok(!('particleStageVisibility' in sampleParticleStory(-20000, -10000, 900)));
  });
  await test('page runtime respects explicit pauses, never original section geometry', () => {
    const page = { enabled: true, visible: true, paused: false, reduced: false, contextAvailable: true };
    for (const top of [0, -900, -4000, -10000]) {
      const story = sampleParticleStory(top, top + 1800, 900);
      assert.equal(backgroundCanAnimate({ ...story, ...page }), true);
    }
    for (const change of [{enabled:false},{visible:false},{paused:true},{reduced:true},{contextAvailable:false}]) assert.equal(backgroundCanAnimate({...page,...change}), false);
  });
  await test('viewport expands without changing original 80 scale, point size or origin', () => {
    for (const width of [1440,390,320]) {
      const story = {...createParticleStory(), compositionTop:103, compositionHeight:540};
      const original = particleProjection(width,540,1.72);
      const full = particleProjection(width,900,1.72,story);
      assert.equal(full.scale,original.scale); assert.equal(full.pointScale,original.pointScale);
      assert.equal(full.originY,373); assert.equal(full.sourceY,original.sourceY);
      assert.equal(particleProjection(width,844,1.72,{...story,spreadProgress:1}).originY,422);
    }
  });
  await test('pointer uses fixed client rect and actual projection, independent of scrollY', () => {
    const target = {x:0,y:0};
    assert.equal(pointerToField(80,700,{left:0,top:0,width:1440,height:900},100,450,target),true);
    assert.deepEqual(target,{x:-6.4,y:2.5});
    assert.equal(pointerToField(80,700,{left:0,top:0,width:1440,height:900},100,450,target),true);
    assert.equal(pointerToField(80,900,{left:0,top:0,width:1440,height:844},100,422,target),false);
  });
  await test('asymmetric reading regions keep deterministic full-height side lanes', () => {
    const f = field(), seeds = f.sideSeed.slice(), local = {};
    configureSideField(local,1440,900,130,880,160,1040,450);
    assert.notEqual(-local.safeLeft,local.safeRight);
    setSideFieldTargets(f,12,1,local);
    let minY=Infinity,maxY=-Infinity;
    for (let i=0;i<f.count;i++) {
      const k=i*3,p=6.5/(6.5-f.sideTarget[k+2]),x=f.sideTarget[k]*p;
      assert.ok(x<=local.safeLeft+.001 || x>=local.safeRight-.001);
      minY=Math.min(minY,f.sideTarget[k+1]*p*130);maxY=Math.max(maxY,f.sideTarget[k+1]*p*130);
    }
    assert.ok(maxY-minY>750); assert.deepEqual(seeds,f.sideSeed);
  });
  await test('zero spread adds no force and preserves all optical identities', () => {
    const a = field(), b = field();
    for (let n = 0; n < 120; n++) {
      const time = 12 + n / 60;
      setFieldTargets(a, time, 1, { sourceX: 2.65, sourceY: 0 }, 0);
      integrateField(a, 1 / 60, time, off, config);
      advance(b, time, 0);
    }
    assert.deepEqual(a.position, b.position); assert.deepEqual(a.velocity, b.velocity);
    for (const key of ['size','opacity','optical','accent','beacon','noiseSeed','sideSeed']) assert.deepEqual(a[key], b[key]);
  });
  await test('side seeds and projected reading corridor survive reversal and resize', () => {
    const f = field();
    setSideFieldTargets(f, 10, 1, layout); const targets = f.sideTarget.slice();
    setSideFieldTargets(f, 11, 0, layout); setSideFieldTargets(f, 10, 1, layout);
    assert.deepEqual(targets, f.sideTarget);
    for (const width of [1440, 390, 320]) {
      const local = {}; configureSideField(local, width, 480, 100, Math.min(600, width - 40));
      setSideFieldTargets(f, 10, 1, local);
      for (let i = 0; i < f.count; i++) {
        const k = i * 3, projectedX = f.sideTarget[k] * 6.5 / (6.5 - f.sideTarget[k + 2]);
        assert.ok(Math.abs(projectedX) >= local.safeHalfWidth - .001);
        assert.ok(Math.abs(projectedX) < local.halfWidth);
      }
    }
  });
  await test('pointer disturbs 0/25/50/100% layouts and recovers into moving side constraints', () => {
    for (const progress of [0,.25,.5,1]) {
      const quiet = field(), pushed = field();
      for (let n = 0; n < 300; n++) { advance(quiet, 12+n/60, progress); advance(pushed, 12+n/60, progress); }
      const x = pushed.position[0] * 6.5 / (6.5-pushed.position[2]);
      const y = pushed.position[1] * 6.5 / (6.5-pushed.position[2]);
      for (let n = 0; n < 30; n++) { advance(quiet, 17+n/60, progress); advance(pushed, 17+n/60, progress, {x:x+.05,y:y+.05,strength:1}); }
      const distance = () => Math.sqrt(pushed.position.reduce((sum,v,i)=>sum+(v-quiet.position[i])**2,0));
      const disturbed = distance(); assert.ok(disturbed > .001, String(progress));
      for (let n = 0; n < 420; n++) { advance(quiet, 17.5+n/60, progress); advance(pushed, 17.5+n/60, progress); }
      if (progress > 0) assert.ok(distance() < disturbed, `recovery at ${progress}`);
      else {
        // An orbit has phase freedom: recovery must not require the old particle ID coordinates.
        let radialError = 0, count = 0;
        for (let i = 0; i < pushed.count; i++) if (pushed.loop[i] < 3) {
          const lane = FIELD_LOOPS[pushed.loop[i]], k = i * 3;
          radialError += Math.abs(Math.hypot((pushed.position[k]-lane.x)/lane.rx, (pushed.position[k+1]-lane.y)/lane.ry)-1);
          count++;
        }
        assert.ok(radialError/count < .25, `rejoins digit orbits ${radialError/count}`);
      }
      if (progress === 1) {
        const error = pushed.position.reduce((sum,v,i)=>sum+(v-pushed.sideTarget[i])**2,0)/pushed.position.length;
        assert.ok(error < .03, `returns to the sides, mean squared error ${error}`);
      }
    }
  });
  await test('fast reversal retains buffers, finite state, and bounded velocity', () => {
    const f = field(), buffers = [f.position,f.velocity,f.sideTarget,f.sideSeed];
    for (let n = 0; n < 900; n++) advance(f, 12+n/60, n % 20 < 10 ? 1 : 0, {x:-3,y:0,strength:.7});
    assert.deepEqual(buffers, [f.position,f.velocity,f.sideTarget,f.sideSeed]);
    assert.ok(f.position.every(Number.isFinite)); assert.ok(f.velocity.every(Number.isFinite));
    assert.ok(f.velocity.every(v=>Math.abs(v)<=3.21));
  });
  await test('published composition has one network and no timed exit or scroll interception', async () => {
    const [entry, hook, intro, scroll] = await Promise.all(['qa/particle80-intro.tsx','hooks/use-brand-opening.ts','components/Particle80Intro.tsx','hooks/use-particle-story-scroll.ts'].map(p=>readFile(p,'utf8')));
    assert.equal((entry.match(/<GlobalUniversityNetwork /g)??[]).length, 1);
    assert.doesNotMatch(entry, /GlobeDestination|handoffContent=|autoTransitionEnabled=\{true\}/);
    assert.doesNotMatch(hook, /requestHandoff|exitAt|GLOBE_ACTIVE/);
    assert.match(intro, /autoTransitionEnabled: false/);
    assert.match(scroll, /passive: true/);
    assert.match(scroll, /navigation\?\.type === 'navigate'/);
    assert.match(scroll, /!restoredInitialLocation.current/);
    assert.doesNotMatch(scroll, /preventDefault|wheel|scrollTo|setState/);
  });
} finally { await server.close(); }
