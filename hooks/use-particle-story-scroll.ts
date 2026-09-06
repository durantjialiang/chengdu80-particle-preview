'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { createParticleStory, sampleParticleStory } from '@/lib/particle-story';

/** Layout controller, not animation clock. One coalesced passive update. */
export function useParticleStoryScroll({ host, hero, composition, content, reduced, mode = 'hero' }: {
  host?: RefObject<HTMLDivElement | null>; hero?: RefObject<HTMLElement | null>;
  composition?: RefObject<HTMLDivElement | null>; content?: RefObject<HTMLDivElement | null>;
  reduced: boolean; mode?: 'hero' | 'ambient';
}) {
  const story = useRef(createParticleStory());
  const restoredInitialLocation = useRef(false);
  /* oxlint-disable react/react-compiler -- Imperative geometry bridge, no React frame state. */
  useEffect(() => {
    const element = host?.current;
    let frame = 0;
    const regions = new Set<Element>();
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const width = document.documentElement.clientWidth;
      const rect = element?.getBoundingClientRect();
      const heroRect = hero?.current?.getBoundingClientRect();
      const next = mode === 'hero' && rect
        ? sampleParticleStory(rect.top, rect.bottom, viewport, reduced, heroRect?.height)
        : { spreadProgress: 1, identityOpacity: 0, heroInView: false, introInView: false, reduced };
      // Dominant visible reading surface, including asymmetric layouts.
      // No per-particle DOM reads. Keep geometry when no block is visible.
      let best = 0, left = story.current.readingLeft, right = story.current.readingRight;
      for (const target of regions) {
        const box = target.getBoundingClientRect();
        const score = Math.max(0, Math.min(box.bottom, viewport * 0.9) - Math.max(box.top, viewport * 0.1));
        if (box.width > 0 && score > best) { best = score; left = box.left; right = box.right; }
      }
      if (right <= left) { left = Math.max(24, (width - 600) / 2); right = width - left; }
      const fieldRect = composition?.current?.getBoundingClientRect();
      Object.assign(story.current, next, { mode, readingLeft: left, readingRight: right, contentWidth: right - left });
      if (heroRect && fieldRect) {
        story.current.compositionTop = fieldRect.top - heroRect.top;
        story.current.compositionHeight = fieldRect.height;
      } else if (mode === 'ambient') {
        story.current.compositionTop = 0;
        story.current.compositionHeight = Math.min(viewport, 540);
      }
      if (element) {
        element.style.setProperty('--story-identity', String(next.identityOpacity));
        element.dataset.spread = next.spreadProgress.toFixed(4);
        element.dataset.heroVisible = String(next.heroInView);
        element.dataset.introVisible = String(next.introInView);
      }
      story.current.listeners.forEach(listener => listener());
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    const discover = () => {
      const current = new Set(document.querySelectorAll('[data-particle-reading-region]'));
      for (const target of regions) if (!current.has(target)) { resize?.unobserve(target); regions.delete(target); }
      for (const target of current) if (!regions.has(target)) { regions.add(target); resize?.observe(target); }
    };
    discover();
    for (const target of [element, hero?.current, composition?.current, content?.current]) if (target) resize?.observe(target);
    // Observe content changes, not particle attributes (which would feed back).
    const mutation = new MutationObserver(() => { discover(); schedule(); });
    const page = document.getElementById('root');
    if (page) mutation.observe(page, { childList: true, subtree: true, characterData: true });
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const anchor = window.location.hash;
    if (!restoredInitialLocation.current && navigation?.type === 'navigate' && window.scrollY === 0 &&
      (anchor === '#event-introduction' || anchor === '#global-network')) {
      document.getElementById(anchor.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    restoredInitialLocation.current = true;
    update();
    return () => {
      cancelAnimationFrame(frame); resize?.disconnect(); mutation.disconnect();
      window.removeEventListener('scroll', schedule, true); window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [host, hero, composition, content, reduced, mode]);
  /* oxlint-enable react/react-compiler */
  return story;
}
