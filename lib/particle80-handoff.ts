import { departureProgress, easeOpening, type OpeningBridge } from './brand-opening';

/** Render adapter only. The field still integrates its unchanged flowing orbits. */
export function createParticleHandoff(count: number) {
  const origins = new Float32Array(count * 2);
  const captured = new Uint8Array(count);
  const output = { x: 0, y: 0, opacity: 1, departing: false };
  return {
    project(index: number, role: number, x: number, y: number, bridge: OpeningBridge, left: number, top: number, width: number) {
      output.x = x; output.y = y; output.opacity = 1; output.departing = false;
      const dissolve = bridge.frame.dissolveProgress;
      const t = departureProgress(role, index, dissolve);
      if (t <= 0) return output;
      if (!bridge.projected || bridge.fallback) { output.opacity = 1 - easeOpening(dissolve); return output; }
      // Most anchors hold the number until late; a minority joins the outgoing lanes.
      if (role === 0 && index % 5 !== 0) { output.opacity = 1 - t; return output; }
      const k = index * 2;
      if (!captured[index]) { origins[k] = x; origins[k + 1] = y; captured[index] = 1; }
      const target = role === 3 && index % 7 === 0
        ? index % Math.max(1, bridge.nodeCount)
        : role === 2 ? bridge.atmosphereStart + index % 112 : bridge.routeStart + index % 192;
      const tx = bridge.targets[target * 3] - left;
      const ty = bridge.targets[target * 3 + 1] - top;
      const sx = origins[k], sy = origins[k + 1];
      const side = index % 2 ? 1 : -1;
      const bow = width * (0.035 + (index % 11) * 0.002);
      const cx = (sx + tx) * 0.5 + side * bow;
      const cy = (sy + ty) * 0.5 - bow * (0.35 + (index % 5) * 0.12);
      const u = 1 - t;
      output.x = u * u * sx + 2 * u * t * cx + t * t * tx;
      output.y = u * u * sy + 2 * u * t * cy + t * t * ty;
      // Handoff particles cede luminance to the actual 3D geometry at arrival.
      output.opacity = (1 - easeOpening((t - 0.68) / 0.32)) * (role === 3 ? 1 : 0.85 + 0.15 * u);
      output.departing = true;
      return output;
    },
  };
}
