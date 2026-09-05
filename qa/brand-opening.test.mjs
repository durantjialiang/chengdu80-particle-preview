import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

await test('brand-opening timeline and render bridge contracts', async (t) => {
  const server = await createServer({ configFile: 'qa/particle80.vite.config.ts', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { openingConfig, sampleOpening, departureProgress, createOpeningBridge } = await server.ssrLoadModule('/lib/brand-opening.ts');
    const { createParticleHandoff } = await server.ssrLoadModule('/lib/particle80-handoff.ts');
    const config = openingConfig();
    await t.test('first-visit boundaries and monotonic bounded progress', () => {
      for (const [time, expected] of [[0,'INTRO_IDLE'],[0.299,'INTRO_IDLE'],[0.3,'FORMING_80'],[2.5,'FORMING_80'],[3.199,'FORMING_80'],[3.2,'HOLDING_80'],[5.399,'HOLDING_80'],[5.4,'DISSOLVING_80'],[7.3,'HANDOFF_TO_GLOBE'],[9.2,'GLOBE_ACTIVE']]) assert.equal(sampleOpening(time,config).state, expected, String(time));
      assert.equal(sampleOpening(2.5, config).formationProgress, 1);
      assert.equal(sampleOpening(2.9, config).pointerWeight, 0);
      assert.equal(sampleOpening(3.2, config).pointerWeight, 1);
      let prev = sampleOpening(0, config);
      for (let time = 0; time < 20; time += .016) {
        const next = sampleOpening(time, config);
        for (const key of ['formationProgress','holdProgress','dissolveProgress','globeRevealProgress','transitionProgress']) { assert.ok(next[key] >= prev[key] && next[key] <= 1 && next[key] >= 0, key); }
        prev = next;
      }
    });
    await t.test('manual hold, early CTA and ownership release', () => {
      const manual = openingConfig({autoTransitionEnabled:false});
      assert.equal(sampleOpening(120, manual).state, 'HOLDING_80');
      for (const at of [0,1,4,120]) {
        assert.equal(sampleOpening(at + .1, manual, at).interactionOwner, 'transition');
        assert.equal(sampleOpening(at + .8, manual, at).pointerWeight, 0);
        assert.equal(sampleOpening(at + 5, manual, at).interactionOwner, 'globe');
      }
    });
    await t.test('mobile, reduced motion and invalid configuration', () => {
      const mobile = openingConfig({},true);
      assert.ok(mobile.formationDuration < config.formationDuration);
      assert.ok(mobile.transitionDuration < config.transitionDuration);
      const reduced = openingConfig({},false,true);
      assert.equal(sampleOpening(0,reduced,null,true).formationProgress,1);
      assert.equal(sampleOpening(0,reduced,null,true).interactionOwner,'none');
      assert.equal(sampleOpening(2,reduced,null,true).state,'GLOBE_ACTIVE');
      for (const value of [NaN, Infinity,-9,0]) {
        const c = openingConfig({formationDuration:value,holdDuration:value,transitionDuration:value,dissolveDuration:value,globeRevealDuration:value});
        for (const at of [0,1,5,100]) assert.ok(Object.values(sampleOpening(at,c)).filter(v=>typeof v==='number').every(Number.isFinite));
      }
    });
    await t.test('runners depart before anchors; curved flights reuse one output', () => {
      assert.equal(departureProgress(0,0,.3),0);
      assert.ok(departureProgress(1,0,.3)>0);
      const bridge = createOpeningBridge(); bridge.projected = true; bridge.nodeCount = 5;
      bridge.targets.fill(300); bridge.frame.dissolveProgress = .4;
      const adapter = createParticleHandoff(32);
      const first = adapter.project(1,1,50,80,bridge,0,0,1440);
      assert.equal(first.departing,true); assert.ok(Number.isFinite(first.x));
      const second = adapter.project(2,2,60,80,bridge,0,0,1440);
      assert.equal(first,second,'no per-particle render allocation');
      bridge.frame.dissolveProgress=1;
      assert.equal(adapter.project(1,1,50,80,bridge,0,0,1440).opacity,0);
    });
  } finally { await server.close(); }
});
