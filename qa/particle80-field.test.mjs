import assert from 'node:assert/strict';
import { test } from 'node:test';
import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

const server = await createServer({
  configFile: 'qa/particle80.vite.config.ts',
  cacheDir: 'node_modules/.vite-particle80-field-tests',
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const {
    createParticleField,
    setFieldTargets,
    initializeField,
    integrateField,
    fieldPoint,
    fieldProgress,
    fieldPhase,
    fieldBudget,
    FIELD_DEFAULTS,
    FIELD_PALETTE,
    FIELD_LOOPS,
    projectField,
  } = await server.ssrLoadModule('/lib/particle80-field.ts');
  const config = { ...FIELD_DEFAULTS, pointerForce: FIELD_DEFAULTS.mouseForce };
  const quiet = { ...config, noiseStrength: 0, pointerForce: 0 };
  const off = { x: 0, y: 0, strength: 0 };
  const layout = { sourceX: 2.65, sourceY: 0 };
  const error = (f) =>
    f.position.reduce(
      (sum, value, i) => sum + (value - f.targetPosition[i]) ** 2,
      0,
    ) / f.position.length;
  function simulate(count, fps, seconds, settings = config) {
    const f = createParticleField(count);
    for (let frame = 0; frame < seconds * fps; frame++) {
      const time = frame / fps;
      setFieldTargets(
        f,
        time,
        fieldProgress(time, undefined, false, 7.2),
        layout,
        0,
      );
      integrateField(f, 1 / fps, time, off, settings);
    }
    return f;
  }
  await test('deterministic 60/22/18 roles, exact size tiers and 2% champagne budget', () => {
    for (const count of [180, 360, 1400, 2200]) {
      const f = createParticleField(count),
        again = createParticleField(count);
      assert.deepEqual(f, again);
      assert.equal(
        f.role.filter((x) => x === 0).length,
        Math.round(count * 0.6),
      );
      assert.equal(
        f.role.filter((x) => x === 1).length,
        Math.round(count * 0.22),
      );
      assert.equal(
        f.role.filter((x) => x === 2).length,
        count - Math.round(count * 0.6) - Math.round(count * 0.22),
      );
      assert.equal(
        f.color.filter((x) => x >= 7).length,
        Math.round(count * 0.02),
      );
      for (const [bin, ratio] of [
        [0, 0.65],
        [1, 0.25],
        [2, 0.08],
      ])
        assert.equal(
          f.sizeClass.filter((x) => x === bin).length,
          Math.round(count * ratio),
        );
      const radii = [
        [0.5, 1],
        [1, 1.75],
        [2, 3],
        [3, 4],
      ];
      for (let i = 0; i < count; i++) {
        const [min, max] = radii[f.sizeClass[i]];
        assert.ok(f.size[i] >= min && f.size[i] <= max);
        assert.ok(FIELD_PALETTE[f.color[i]]);
        if (f.color[i] < 7) {
          assert.ok(
            f.role[i] === 0
              ? f.color[i] < 3
              : f.role[i] === 1
                ? f.color[i] >= 3 && f.color[i] <= 4
                : f.color[i] >= 5,
          );
        }
        assert.equal(f.loop[i] === 255, f.role[i] === 2);
      }
      for (const key of [
        'position',
        'velocity',
        'targetPosition',
        'size',
        'opacity',
        'depth',
        'noiseSeed',
        'orbitPhase',
        'orbitWidth',
        'orbitSpeed',
      ])
        assert.ok(f[key] instanceof Float32Array);
    }
    assert.equal(fieldBudget(1e8, true), 360);
    assert.equal(fieldBudget(1e8, false), 2200);
  });
  await test('stable anchors; independent clockwise / counterclockwise / clockwise lanes', () => {
    const f = createParticleField(1400);
    const positions = f.position.slice();
    for (const time of [0, 8, 27, 1800]) {
      setFieldTargets(f, time, 1, layout, 0);
      const before = f.targetPosition.slice();
      setFieldTargets(f, time + 0.05, 1, layout, 0);
      for (let i = 0; i < f.count; i++) {
        const k = i * 3;
        if (f.role[i] === 0) {
          assert.deepEqual(
            f.targetPosition.slice(k, k + 3),
            f.rest.slice(k, k + 3),
          );
        } else if (f.role[i] === 1) {
          const loop = FIELD_LOOPS[f.loop[i]];
          const ax = before[k] - loop.x,
            ay = before[k + 1] - loop.y;
          const bx = f.targetPosition[k] - loop.x,
            by = f.targetPosition[k + 1] - loop.y;
          assert.equal(Math.sign(ax * by - ay * bx), Math.sign(loop.speed));
          assert.ok(Math.abs(bx) <= loop.rx + 0.22);
          assert.ok(Math.abs(by) <= loop.ry + 0.22);
          assert.ok(Math.abs(f.targetPosition[k + 2]) < 0.65);
        }
      }
    }
    assert.deepEqual(f.position, positions); // Attractors never teleport live positions.
    const speeds = [...new Set(f.orbitSpeed.filter((x) => x !== 0))];
    assert.ok(speeds.length > 30); // No synchronized marquee phase/rate.
    for (const role of [0, 1])
      for (const loop of [0, 1, 2])
        for (const side of [-1, 1])
          assert.ok(
            f.role.some(
              (r, i) => r === role && f.loop[i] === loop && f.side[i] === side,
            ),
          );
  });
  await test('runner circulation is integrated while anchor silhouette stays fixed', () => {
    const f = createParticleField(180);
    setFieldTargets(f, 8, 1, layout, 0);
    initializeField(f);
    for (let frame = 0; frame < 360; frame++) {
      const time = 8 + frame / 60;
      setFieldTargets(f, time, 1, layout, 0);
      integrateField(f, 1 / 60, time, off, quiet);
    }
    for (let i = 0; i < f.count; i++) {
      const k = i * 3;
      if (f.role[i] === 0)
        assert.deepEqual(f.position.slice(k, k + 3), f.rest.slice(k, k + 3));
      if (f.role[i] === 1) {
        assert.ok(Math.hypot(f.velocity[k], f.velocity[k + 1]) > 0.04);
        const lane = FIELD_LOOPS[f.loop[i]];
        const cross =
          (f.position[k] - lane.x) * f.velocity[k + 1] -
          (f.position[k + 1] - lane.y) * f.velocity[k];
        assert.equal(Math.sign(cross), Math.sign(lane.speed));
      }
    }
  });
  await test('pointer response is layered: ambient > runners > anchors, all spring back', () => {
    const f = createParticleField(3);
    f.role.set([0, 1, 2]);
    f.position.fill(0);
    f.targetPosition.fill(0);
    f.velocity.fill(0);
    for (let frame = 0; frame < 90; frame++)
      integrateField(
        f,
        1 / 60,
        frame / 60,
        { x: -0.15, y: 0, strength: 1 },
        { ...config, noiseStrength: 0 },
      );
    assert.ok(f.position[0] > 0 && f.position[0] < f.position[3]);
    assert.ok(f.position[3] < f.position[6] && f.position[6] < 0.5);
    for (let frame = 0; frame < 600; frame++)
      integrateField(f, 1 / 60, frame / 60, off, quiet);
    assert.ok(error(f) < 1e-8);
  });
  await test('two independent source populations converge through a central field, then a thick 80', () => {
    const f = createParticleField(1400);
    let left = 0,
      right = 0;
    for (let i = 0; i < 980; i++) {
      if (f.side[i] < 0) left += f.position[i * 3];
      else right += f.position[i * 3];
    }
    assert.ok(left / 490 < -2.4 && right / 490 > 2.4);
    setFieldTargets(f, 3.9, 0.55, layout, 0);
    assert.ok(Math.max(...f.targetPosition.slice(0, 980 * 3)) < 1.9);
    setFieldTargets(f, 7.2, 1, layout, 0);
    const z = Array.from(
      { length: 980 },
      (_, i) => f.targetPosition[i * 3 + 2],
    );
    assert.ok(Math.max(...z) - Math.min(...z) > 0.7);
    // Both institutions contribute to both numerals, rather than each owning one.
    for (const side of [-1, 1]) {
      assert.ok(
        Array.from({ length: 980 }, (_, i) => i).some(
          (i) => f.side[i] === side && f.rest[i * 3] < -0.2,
        ),
      );
      assert.ok(
        Array.from({ length: 980 }, (_, i) => i).some(
          (i) => f.side[i] === side && f.rest[i * 3] > 0.2,
        ),
      );
    }
    for (const boundary of [0.1, 0.28, 0.56, 0.83, 0.9]) {
      setFieldTargets(f, 3, boundary - 1e-6, layout, 0);
      const before = f.targetPosition.slice();
      setFieldTargets(f, 3, boundary + 1e-6, layout, 0);
      assert.ok(
        Math.max(...f.targetPosition.map((v, i) => Math.abs(v - before[i]))) <
          0.001,
      );
    }
  });
  await test('attractor changes do not teleport particles; velocity, inertia and slight overshoot are real', () => {
    const f = createParticleField(1);
    f.position.fill(0);
    f.velocity.fill(0);
    f.targetPosition.fill(0);
    f.targetPosition[0] = 1;
    integrateField(f, 0, 0, off, quiet);
    assert.equal(f.position[0], 0);
    integrateField(f, 1 / 60, 0, off, quiet);
    assert.ok(f.position[0] > 0 && f.position[0] < 0.02 && f.velocity[0] > 0);
    let peak = 0;
    for (let i = 0; i < 600; i++) {
      integrateField(f, 1 / 60, i / 60, off, quiet);
      peak = Math.max(peak, f.position[0]);
    }
    assert.ok(peak > 1.005 && peak < 1.12, `overshoot ${peak}`);
    assert.ok(error(f) < 1e-8);
  });
  await test('soft pointer disturbance falls off locally and returns with damping', () => {
    const f = createParticleField(2);
    f.position.fill(0);
    f.velocity.fill(0);
    f.targetPosition.fill(0);
    f.position[3] = f.targetPosition[3] = 2;
    const pointer = { x: -0.15, y: 0, strength: 1 };
    for (let i = 0; i < 90; i++)
      integrateField(f, 1 / 60, i / 60, pointer, {
        ...config,
        noiseStrength: 0,
      });
    assert.ok(f.position[0] > 0.025 && f.position[0] < 0.4);
    assert.equal(f.position[3], 2);
    for (let i = 0; i < 480; i++) integrateField(f, 1 / 60, i / 60, off, quiet);
    assert.ok(error(f) < 1e-8);
  });
  await test('formation is frame-rate stable and reaches its rest volume without snapping', () => {
    const a = simulate(180, 30, 10, quiet),
      b = simulate(180, 60, 10, quiet),
      c = simulate(180, 120, 10, quiet);
    const difference = (x, y) =>
      x.position.reduce((s, v, i) => s + (v - y.position[i]) ** 2, 0) /
      x.position.length;
    assert.ok(difference(a, b) < 0.001 && difference(b, c) < 0.001);
    assert.ok(error(b) < 0.002, `end error ${error(b)}`);
  });
  await test('noise keeps the formed field alive while stalls and extreme inputs remain bounded', () => {
    const f = simulate(180, 60, 12);
    assert.ok(f.velocity.some((v) => Math.abs(v) > 0.003));
    const positions = f.position;
    const targets = f.targetPosition;
    for (let i = 0; i < 120; i++)
      integrateField(
        f,
        10,
        i,
        { x: NaN, y: Infinity, strength: 1 },
        {
          springStrength: NaN,
          damping: Infinity,
          noiseStrength: 1e9,
          pointerForce: 1e9,
        },
      );
    assert.equal(f.position, positions);
    assert.equal(f.targetPosition, targets);
    assert.ok(f.position.every((v) => Number.isFinite(v) && Math.abs(v) < 8));
    for (let i = 0; i < f.count; i++)
      assert.ok(Math.hypot(...f.velocity.slice(i * 3, i * 3 + 3)) <= 3.20001);
  });
  await test('static initialization, controlled targets, phase events and projection remain coherent', () => {
    const f = createParticleField(180);
    assert.equal(fieldProgress(0, 0.3, true, 7.2), 1);
    assert.equal(fieldProgress(0, 0.3, false, 7.2), 0.3);
    assert.equal(fieldProgress(7.2, undefined, false, 7.2), 1);
    assert.deepEqual([0, 0.15, 0.4, 0.7, 1].map(fieldPhase), [
      'space',
      'sources',
      'merging',
      'forming',
      'living',
    ]);
    const before = f.position.slice();
    setFieldTargets(f, 0, 1, layout, 0);
    assert.deepEqual(f.position, before); // Scrubbing changes targets, not actual position.
    initializeField(f);
    assert.deepEqual(f.position, f.targetPosition);
    assert.ok(f.velocity.every((v) => v === 0));
    const p = { x: 0, y: 0, z: 0, nx: 0, ny: 0, size: 0, opacity: 0 },
      projected = { x: 0, y: 0, size: 0, opacity: 0 };
    assert.equal(fieldPoint(f, 0, 1, 0, p), p);
    assert.equal(projectField(p, 0, 1, false, projected), projected);
    assert.equal(fieldPoint(f, 0, 1, 1, p).opacity, 0);
  });
  const start = performance.now();
  simulate(1400, 60, 8);
  console.log(
    `Physics-only 1400-particle / 480-frame simulation: ${Math.round(performance.now() - start)} ms (not browser FPS).`,
  );
} finally {
  await server.close();
}
