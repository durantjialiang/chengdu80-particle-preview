'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { createOpeningBridge, sampleOpening, type OpeningConfig, type OpeningFrame } from '@/lib/brand-opening';

export function useBrandOpening(config: OpeningConfig, options: {
  active: boolean; reduced: boolean; hasDestination: boolean;
  host: RefObject<HTMLDivElement | null>; onProgress?: (frame: OpeningFrame) => void;
  onComplete?: () => void;
}) {
  const bridge = useRef(createOpeningBridge());
  const clock = useRef({ elapsed: 0, exitAt: null as number | null, requested: false, completed: false });
  const settings = useRef({ config, ...options });
  const wakeRef = useRef<() => void>(() => {});
  const [state, setState] = useState<OpeningFrame['state']>('INTRO_IDLE');
  useEffect(() => { settings.current = { config, ...options }; wakeRef.current(); });
  useEffect(() => {
    let frameId = 0;
    let previous = 0;
    let inView = true;
    let reported = '';
    const run = (now: number) => {
      frameId = 0;
      const s = settings.current;
      if (!s.active || document.hidden || !inView) { previous = 0; return; }
      const dt = previous ? Math.min((now - previous) / 1000, 0.06) : 0;
      previous = now;
      const timer = clock.current;
      timer.elapsed += dt;
      const automaticAt = s.config.leadInDuration + s.config.formationDuration + s.config.settleDuration + s.config.holdDuration;
      const wantsExit = s.hasDestination && (timer.requested || (s.config.autoTransitionEnabled && timer.elapsed >= automaticAt));
      // A slow/failed WebGL boot never sends particles into an empty destination.
      if (wantsExit && bridge.current.ready && timer.exitAt === null) timer.exitAt = timer.elapsed;
      const next = sampleOpening(timer.elapsed, { ...s.config, autoTransitionEnabled: false }, timer.exitAt, s.reduced);
      bridge.current.frame = next;
      const host = s.host.current;
      if (host) {
        host.dataset.introState = next.state;
        host.dataset.interactionOwner = next.interactionOwner;
        host.dataset.formation = next.formationProgress.toFixed(3);
        host.dataset.dissolve = next.dissolveProgress.toFixed(3);
        host.dataset.globeReveal = next.globeRevealProgress.toFixed(3);
        host.style.setProperty('--opening-departure', String(next.dissolveProgress));
        host.style.setProperty('--opening-reveal', String(next.globeRevealProgress));
        host.style.setProperty('--opening-transition', String(next.transitionProgress));
      }
      const signature = `${next.state}:${Math.round(next.formationProgress * 20)}:${Math.round(next.holdProgress * 20)}:${Math.round(next.dissolveProgress * 20)}:${Math.round(next.globeRevealProgress * 20)}:${Math.round(next.activationProgress * 20)}`;
      if (signature !== reported) { reported = signature; setState(next.state); s.onProgress?.(next); }
      if (next.state === 'GLOBE_ACTIVE') {
        if (!timer.completed) { timer.completed = true; s.onComplete?.(); }
        return;
      }
      if (next.state === 'HOLDING_80' && next.holdProgress >= 1 && !s.config.autoTransitionEnabled && !timer.requested) { previous = 0; return; }
      frameId = requestAnimationFrame(run);
    };
    const wake = () => { if (!frameId && !clock.current.completed) frameId = requestAnimationFrame(run); };
    wakeRef.current = wake;
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView) wake(); }, { threshold: 0.01 });
    if (options.host.current) observer.observe(options.host.current);
    document.addEventListener('visibilitychange', wake);
    wake();
    return () => { cancelAnimationFrame(frameId); wakeRef.current = () => {}; observer.disconnect(); document.removeEventListener('visibilitychange', wake); };
  }, [options.active, options.host]);
  const requestHandoff = () => { clock.current.requested = true; wakeRef.current(); };
  return { bridge, state, requestHandoff };
}
