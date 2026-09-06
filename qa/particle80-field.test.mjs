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
    fieldColorIndex,
    fieldOrbitAngle,
    fieldStarScale,
    FIELD_ACCENT_START,
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
  await test('deterministic 50/25/18/7 roles, five size tiers, three optics and 2% champagne budget', () => {
    for (const count of [180, 360, 600, 900, 1400, 2800, 4800, 9600]) {
      const f = createParticleField(count),
        again = createParticleField(count);
      assert.deepEqual(f, again);
      assert.equal(
        f.role.filter((x) => x === 0).length,
        Math.round(count * 0.5),
      );
      assert.equal(
        f.role.filter((x) => x === 1).length,
        Math.round(count * 0.25),
      );
      assert.equal(
        f.role.filter((x) => x === 2).length,
        Math.round(count * 0.18),
      );
      assert.equal(
        f.role.filter((x) => x === 3).length,
        count -
          Math.round(count * 0.5) -
          Math.round(count * 0.25) -
          Math.round(count * 0.18),
      );
      assert.equal(
        f.accent.filter((x) => x === 1).length,
        Math.round(count * 0.02),
      );
      assert.equal(
        f.beacon.filter((x) => x === 1).length,
        Math.round(count * 0.005),
      );
      for (const [bin, ratio] of [
        [0, 0.55],
        [1, 0.25],
        [2, 0.12],
        [3, 0.06],
      ])
        assert.equal(
          f.sizeClass.filter((x) => x === bin).length,
          Math.round(count * ratio),
        );
      const radii = [
        [0.35, 0.7],
        [0.7, 1.15],
        [1.15, 1.75],
        [1.75, 2.5],
        [2.5, 4],
      ];
      for (let i = 0; i < count; i++) {
        const [min, max] = radii[f.sizeClass[i]];
        assert.ok(f.size[i] >= min && f.size[i] <= max);
        assert.ok(FIELD_PALETTE[f.color[i]]);
        assert.equal(f.color[i] >= FIELD_ACCENT_START, f.accent[i] === 1);
        assert.equal(f.loop[i] === 255, f.role[i] === 2);
        if (f.beacon[i]) {
          assert.equal(f.sizeClass[i], 4, 'Beacons reuse rare large stars');
          assert.equal(f.optical[i], 2);
          assert.notEqual(f.role[i], 2, 'Ambient dust cannot become a beacon');
        }
      }
      for (const optical of [0, 1, 2]) assert.ok(f.optical.includes(optical));
      // Luminance includes emitter area, not alpha alone: tiny dust stays faint.
      const energy = Array.from(
        f.size,
        (radius, i) => radius * radius * f.opacity[i],
      ).sort((a, b) => a - b);
      assert.ok(
        energy[Math.floor(count * 0.95)] > energy[Math.floor(count * 0.5)] * 6,
      );
      assert.ok(energy[Math.floor(count * 0.5)] < 0.3);
      assert.ok(f.opacity.filter((x) => x > 0.7).length < count * 0.08);
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
    assert.equal(fieldBudget(1e8, true), 900);
    assert.equal(fieldBudget(1e8, false), 9600);
    assert.equal(fieldBudget(NaN, false), 9600);
    assert.equal(fieldBudget(NaN, true), 900);
  });
  await test('equal-distance phases cover ellipse long sides, with seamless signed wrapping', () => {
    const tau = Math.PI * 2;
    for (let loop = 0; loop < 3; loop++) {
      const lane = FIELD_LOOPS[loop],
        segments = [];
      for (let i = 0; i < 128; i++) {
        const a = fieldOrbitAngle(loop, (i * tau) / 128);
        const b = fieldOrbitAngle(loop, ((i + 1) * tau) / 128);
        segments.push(
          Math.hypot(
            lane.rx * (Math.cos(b) - Math.cos(a)),
            lane.ry * (Math.sin(b) - Math.sin(a)),
          ),
        );
      }
      assert.ok(Math.max(...segments) / Math.min(...segments) < 1.01);
      assert.ok(
        Math.abs(
          fieldOrbitAngle(loop, -0.15) - fieldOrbitAngle(loop, tau - 0.15),
        ) < 1e-6,
      );
    }
  });
  await test('coloured large stars stay sparse; optical scaling never enlarges dust or ambient', () => {
    for (const count of [180, 900, 9600]) {
      const field = createParticleField(count);
      const largeGold = Array.from(field.accent).filter(
        (accent, i) => accent && field.sizeClass[i] === 4,
      ).length;
      assert.equal(largeGold, Math.round(Math.round(count * 0.02) * 0.25));
      assert.ok(field.accent.some((accent, i) => accent && field.beacon[i]));
      assert.ok(
        field.color.some(
          (color, i) =>
            color >= 16 &&
            color < FIELD_ACCENT_START &&
            field.sizeClass[i] >= 3,
        ),
      );
      for (let i = 0; i < count; i++) {
        const scale = fieldStarScale(
          field.role[i],
          field.sizeClass[i],
          field.color[i],
        );
        assert.ok(scale >= 1 && scale <= 1.3);
        if (
          field.role[i] === 2 ||
          field.sizeClass[i] < 3 ||
          field.color[i] < 16
        )
          assert.equal(scale, 1);
      }
    }
    assert.equal(fieldStarScale(3, 4, 20), 1.3);
    assert.equal(fieldStarScale(3, 4, 30), 1.3);
    assert.equal(fieldStarScale(1, 3, 20), 1.16);
    for (const color of FIELD_PALETTE.slice(FIELD_ACCENT_START)) {
      const channels = color.match(/[0-9a-f]{2}/g).map((v) => parseInt(v, 16));
      assert.ok(
        channels[0] - channels[2] >= 70,
        'Gold must retain a coloured shoulder, not an off-white ramp',
      );
    }
  });
  await test('jittered per-size strata cover every loop without empty initial sectors', () => {
    const tau = Math.PI * 2;
    for (const count of [600, 900, 4800, 9600]) {
      const f = createParticleField(count);
      for (let loop = 0; loop < 3; loop++) {
        const bins = Array(12).fill(0);
        for (let i = 0; i < count; i++)
          if (f.loop[i] === loop) {
            const phase = ((f.orbitPhase[i] % tau) + tau) % tau;
            bins[Math.min(11, Math.floor((phase / tau) * 12))]++;
          }
        const mean = bins.reduce((sum, n) => sum + n, 0) / bins.length;
        assert.ok(
          Math.min(...bins) / mean > (count <= 900 ? 0.6 : 0.9),
          `loop ${loop} count ${count}: ${bins.join(',')}`,
        );
      }
    }
  });
  await test('all structural trajectories move; independent lanes with rare counter-current', () => {
    const f = createParticleField(1400);
    const positions = f.position.slice();
    for (const time of [0, 8, 27, 1800]) {
      setFieldTargets(f, time, 1, layout, 0);
      const before = f.targetPosition.slice();
      setFieldTargets(f, time + 0.05, 1, layout, 0);
      for (let i = 0; i < f.count; i++) {
        const k = i * 3;
        if (f.role[i] !== 2) {
          const loop = FIELD_LOOPS[f.loop[i]];
          const ax = before[k] - loop.x,
            ay = before[k + 1] - loop.y;
          const bx = f.targetPosition[k] - loop.x,
            by = f.targetPosition[k + 1] - loop.y;
          // Formation reference also moves, but does not own living phase.
          assert.ok(Math.hypot(bx - ax, by - ay) > 0.000001);
          assert.ok(Math.abs(bx) <= loop.rx + 0.45);
          assert.ok(Math.abs(by) <= loop.ry + 0.45);
          assert.ok(Math.abs(f.targetPosition[k + 2]) < 0.9);
        }
      }
    }
    assert.deepEqual(f.position, positions); // Attractors never teleport live positions.
    const speeds = [...new Set(f.orbitSpeed.filter((x) => x !== 0))];
    assert.ok(speeds.length > 30); // No synchronized marquee phase/rate.
    const counter = f.orbitSpeed.filter(
      (speed, i) =>
        f.loop[i] < 3 &&
        Math.sign(speed) !== Math.sign(FIELD_LOOPS[f.loop[i]].speed),
    );
    assert.ok(counter.length > 0 && counter.length < f.count * 0.035);
    for (const role of [0, 1, 3])
      for (const loop of [0, 1, 2])
        for (const side of [-1, 1])
          assert.ok(
            f.role.some(
              (r, i) => r === role && f.loop[i] === loop && f.side[i] === side,
            ),
          );
  });
  await test('EVERY particle moves in XY and depth; quiet field remains alive without pointer or noise', () => {
    const f = createParticleField(180);
    setFieldTargets(f, 8, 1, layout, 0);
    initializeField(f);
    const initial = f.position.slice();
    for (let frame = 0; frame < 360; frame++) {
      const time = 8 + frame / 60;
      setFieldTargets(f, time, 1, layout, 0);
      integrateField(f, 1 / 60, time, off, quiet);
    }
    for (let i = 0; i < f.count; i++) {
      const k = i * 3;
      assert.ok(
        Math.hypot(
          f.position[k] - initial[k],
          f.position[k + 1] - initial[k + 1],
        ) > 0.003,
        `XY frozen ${i}`,
      );
      assert.ok(
        Math.abs(f.position[k + 2] - initial[k + 2]) > 0.00001,
        `depth frozen ${i}`,
      );
      if (f.role[i] !== 2) {
        assert.ok(Math.hypot(f.velocity[k], f.velocity[k + 1]) > 0.001);
        const lane = FIELD_LOOPS[f.loop[i]];
        const cross =
          (f.position[k] - lane.x) * f.velocity[k + 1] -
          (f.position[k + 1] - lane.y) * f.velocity[k];
        assert.equal(Math.sign(cross), Math.sign(f.orbitSpeed[i]));
        const width =
          f.orbitWidth[i] +
          Math.sin((8 + 359 / 60) * 0.33 + f.noiseSeed[i]) * 0.016;
        const radial = Math.hypot(
          (f.position[k] - lane.x) / (lane.rx + width),
          (f.position[k + 1] - lane.y) / (lane.ry + width),
        );
        assert.ok(Math.abs(radial - 1) < 0.06, `orbit tube error ${radial}`);
      }
    }
  });
  await test('color is a spatially coherent field; upper 8 cool, lower 8 warmer, no ID-random color', () => {
    for (const loop of [0, 1, 2]) {
      const lane = FIELD_LOOPS[loop];
      for (let theta = 0; theta < 6.2; theta += 0.2) {
        const x = lane.x + lane.rx * Math.cos(theta),
          y = lane.y + lane.ry * Math.sin(theta);
        const color = fieldColorIndex(loop, x, y, 0, 12, false);
        assert.ok(
          Math.abs(
            color -
              fieldColorIndex(loop, x + 0.001, y + 0.001, 0.001, 12.001, false),
          ) <= 1,
        );
      }
    }
    assert.ok(
      fieldColorIndex(0, -1, -0.5, 0, 0, false) >
        fieldColorIndex(1, -1, 0.5, 0, 0, false),
    );
  });
  await test('phase freedom: tangential disturbance rejoins the orbit rather than a seeded point', () => {
    const a = createParticleField(180),
      b = createParticleField(180);
    for (const f of [a, b]) {
      setFieldTargets(f, 8, 1, layout, 0);
      initializeField(f);
    }
    const i = 12,
      k = i * 3,
      lane = FIELD_LOOPS[a.loop[i]];
    const theta =
      Math.atan2(
        (b.position[k + 1] - lane.y) / (lane.ry + b.orbitWidth[i]),
        (b.position[k] - lane.x) / (lane.rx + b.orbitWidth[i]),
      ) + 0.55;
    b.position[k] = lane.x + (lane.rx + b.orbitWidth[i]) * Math.cos(theta);
    b.position[k + 1] = lane.y + (lane.ry + b.orbitWidth[i]) * Math.sin(theta);
    for (let frame = 0; frame < 600; frame++)
      for (const f of [a, b]) {
        const t = 8 + frame / 60;
        setFieldTargets(f, t, 1, layout, 0);
        integrateField(f, 1 / 60, t, off, quiet);
      }
    assert.ok(
      Math.hypot(
        a.position[k] - b.position[k],
        a.position[k + 1] - b.position[k + 1],
      ) > 0.12,
      'phase was locked back to original target',
    );
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
  await test('actual pointer impulse rejoins a moving orbit with residual phase, not a frozen target', () => {
    const control = createParticleField(360),
      pushed = createParticleField(360);
    for (const f of [control, pushed]) {
      setFieldTargets(f, 8, 1, layout, 0);
      initializeField(f);
    }
    const radiusError = (f, time) => {
      let total = 0,
        count = 0;
      for (let i = 0; i < f.count; i++)
        if (f.loop[i] === 0) {
          const lane = FIELD_LOOPS[0],
            k = i * 3;
          const width =
            f.orbitWidth[i] + Math.sin(time * 0.33 + f.noiseSeed[i]) * 0.016;
          total += Math.abs(
            Math.hypot(
              (f.position[k] - lane.x) / (lane.rx + width),
              (f.position[k + 1] - lane.y) / (lane.ry + width),
            ) - 1,
          );
          count++;
        }
      return total / count;
    };
    let peak = 0,
      after = 0;
    for (let frame = 0; frame < 600; frame++) {
      const time = 8 + frame / 60;
      for (const f of [control, pushed]) {
        setFieldTargets(f, time, 1, layout, 0);
        integrateField(
          f,
          1 / 60,
          time,
          f === pushed && frame >= 120 && frame < 240
            ? { x: -1.2, y: -0.55, strength: 1 }
            : off,
          { ...config, noiseStrength: 0 },
        );
      }
      const excess = radiusError(pushed, time) - radiusError(control, time);
      if (frame >= 120 && frame < 270) peak = Math.max(peak, excess);
      if (frame === 599) after = excess;
    }
    assert.ok(peak > 0.03, `pointer did not disturb orbit: ${peak}`);
    assert.ok(
      Math.abs(after) < 0.008,
      `normal recovery did not settle: ${after}`,
    );
    const phaseDistance = pushed.position.reduce(
      (sum, v, i) => sum + (v - control.position[i]) ** 2,
      0,
    );
    assert.ok(
      phaseDistance > 0.03,
      'particles snapped back to their pre-pointer phase',
    );
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
    // Living coordinates may differ tangentially from the formation reference.
    assert.ok(b.position.every((v) => Number.isFinite(v) && Math.abs(v) < 5));
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
  simulate(FIELD_DEFAULTS.particleCount, 60, 8);
  console.log(
    `Physics-only ${FIELD_DEFAULTS.particleCount}-particle / 480-frame simulation: ${Math.round(performance.now() - start)} ms (not browser FPS).`,
  );
} finally {
  await server.close();
}
