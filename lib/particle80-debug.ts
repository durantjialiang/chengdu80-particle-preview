import {
  FIELD_LOOPS,
  FIELD_POINTER_RADIUS,
  type ParticleField,
  type FieldPointer,
} from './particle80-field';

export type FieldDebugMode = 'off' | 'roles' | 'vectors' | 'flow' | 'telemetry';
const roleColors = ['#70c1ff', '#92e6bb', '#b2a3ff', '#ffc886'];

/** Called only inside a development guard; eliminated from production bundles. */
export function createFieldDebug(field: ParticleField, mode: FieldDebugMode) {
  const frameCosts = new Float32Array(180);
  let cursor = 0,
    frameTime = 0;
  const pointerSnapshot = { x: 0, y: 0, strength: 0 };
  const api = {
    // Arrays are copied only on an explicit QA/developer request, never per frame.
    snapshot: () => ({
      time: frameTime,
      flowMix: field.flowMix,
      spreadMix: field.spreadMix,
      sideTarget: Array.from(field.sideTarget),
      pointer: { ...pointerSnapshot },
      position: Array.from(field.position),
      velocity: Array.from(field.velocity),
      role: Array.from(field.role),
      loop: Array.from(field.loop),
      color: Array.from(field.color),
      optical: Array.from(field.optical),
      size: Array.from(field.size),
      opacity: Array.from(field.opacity),
      targetPosition: Array.from(field.targetPosition),
      orbitSpeed: Array.from(field.orbitSpeed),
      orbitWidth: Array.from(field.orbitWidth),
      frameCosts: Array.from(frameCosts).filter((v) => v > 0),
    }),
  };
  const target = window as typeof window & { __particle80Debug?: typeof api };
  target.__particle80Debug = api;
  return {
    draw(
      ctx: CanvasRenderingContext2D,
      pointer: FieldPointer,
      width: number,
      height: number,
      scale: number,
      time: number,
      cost: number,
    ) {
      frameCosts[cursor++ % frameCosts.length] = cost;
      frameTime = time;
      pointerSnapshot.x = pointer.x;
      pointerSnapshot.y = pointer.y;
      pointerSnapshot.strength = pointer.strength;
      if (mode === 'telemetry') return;
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < field.count; i++) {
        const k = i * 3;
        const perspective =
          6.5 / (6.5 - Math.max(-2.5, Math.min(2.5, field.position[k + 2])));
        const x = width / 2 + field.position[k] * perspective * scale;
        const y = height / 2 + field.position[k + 1] * perspective * scale;
        ctx.strokeStyle = ctx.fillStyle = roleColors[field.role[i]];
        ctx.globalAlpha = 0.75;
        if (mode === 'roles') {
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (i % 17 === 0) {
          let vx = field.velocity[k],
            vy = field.velocity[k + 1];
          if (mode === 'flow' && field.loop[i] < 3) {
            const lane = FIELD_LOOPS[field.loop[i]];
            vx =
              (-(field.position[k + 1] - lane.y) *
                field.orbitSpeed[i] *
                lane.rx) /
              lane.ry;
            vy =
              ((field.position[k] - lane.x) * field.orbitSpeed[i] * lane.ry) /
              lane.rx;
          }
          const dx = vx * scale * 0.6,
            dy = vy * scale * 0.6;
          const a = Math.atan2(dy, dx);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + dx, y + dy);
          ctx.lineTo(
            x + dx - Math.cos(a - 0.5) * 4,
            y + dy - Math.sin(a - 0.5) * 4,
          );
          ctx.moveTo(x + dx, y + dy);
          ctx.lineTo(
            x + dx - Math.cos(a + 0.5) * 4,
            y + dy - Math.sin(a + 0.5) * 4,
          );
          ctx.stroke();
        }
      }
      ctx.strokeStyle = '#aebed0';
      ctx.globalAlpha = 0.3 + pointer.strength * 0.6;
      ctx.beginPath();
      ctx.arc(
        width / 2 + pointer.x * scale,
        height / 2 + pointer.y * scale,
        FIELD_POINTER_RADIUS * scale,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = '12px system-ui';
      ctx.fillStyle = '#d7e4f2';
      ctx.fillText(
        'DEV ONLY · structure / flow / ambient / highlight',
        16,
        height - 16,
      );
      ctx.restore();
    },
    dispose() {
      if (target.__particle80Debug === api) delete target.__particle80Debug;
    },
  };
}
