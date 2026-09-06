'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { createOpeningBridge, sampleOpening, type OpeningConfig, type OpeningFrame } from '@/lib/brand-opening';
import type { ParticleStoryRef } from '@/lib/particle-story';

export function useBrandOpening(config: OpeningConfig, options: {
  active: boolean; reduced: boolean; story: ParticleStoryRef;
  host: RefObject<HTMLDivElement | null>; onProgress?: (frame: OpeningFrame) => void;
}) {
  const bridge = useRef(createOpeningBridge());
  const clock = useRef({ elapsed: 0, formed: false });
  const settings = useRef({ config, ...options });
  const wakeRef = useRef<() => void>(() => {});
  const [state, setState] = useState<OpeningFrame['state']>('INTRO_IDLE');
  useEffect(() => { settings.current = { config, ...options }; wakeRef.current(); });
  useEffect(() => {
    let frameId = 0;
    let previous = 0;
    let reported = '';
    const run = (now: number) => {
      frameId = 0;
      const s = settings.current;
      if (!s.active || document.hidden || !s.story.current.inView) { previous = 0; return; }
      const dt = previous ? Math.min((now - previous) / 1000, 0.06) : 0;
      previous = now;
      const timer = clock.current;
      timer.elapsed += dt;
      const heldAt = s.config.leadInDuration + s.config.formationDuration + s.config.settleDuration;
      // Scroll restoration / early scrolling completes formation, never skips the hero.
      if (s.story.current.spreadProgress > 0.005 || timer.formed || s.reduced) timer.elapsed = Math.max(timer.elapsed, heldAt);
      const next = sampleOpening(timer.elapsed, { ...s.config, autoTransitionEnabled: false }, null, s.reduced);
      bridge.current.frame = next;
      if (next.state === 'HOLDING_80') timer.formed = true;
      const host = s.host.current;
      if (host) {
        host.dataset.introState = next.state;
        host.dataset.interactionOwner = next.interactionOwner;
        host.dataset.formation = next.formationProgress.toFixed(3);
        host.dataset.dissolve = next.dissolveProgress.toFixed(3);
        host.dataset.globeReveal = next.globeRevealProgress.toFixed(3);
      }
      const signature = `${next.state}:${Math.round(next.formationProgress * 20)}:${Math.round(next.holdProgress * 20)}:${Math.round(next.dissolveProgress * 20)}:${Math.round(next.globeRevealProgress * 20)}:${Math.round(next.activationProgress * 20)}`;
      if (signature !== reported) { reported = signature; setState(next.state); s.onProgress?.(next); }
      if (timer.formed) { previous = 0; return; }
      frameId = requestAnimationFrame(run);
    };
    const wake = () => { if (!frameId) frameId = requestAnimationFrame(run); };
    wakeRef.current = wake;
    const listeners = options.story.current.listeners;
    listeners.add(wake);
    document.addEventListener('visibilitychange', wake);
    wake();
    return () => { cancelAnimationFrame(frameId); wakeRef.current = () => {}; listeners.delete(wake); document.removeEventListener('visibilitychange', wake); };
  }, [options.host, options.story]);
  return { bridge, state };
}
