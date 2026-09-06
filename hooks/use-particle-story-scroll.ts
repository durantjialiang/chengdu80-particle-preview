'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { createParticleStory, sampleParticleStory } from '@/lib/particle-story';

/** One passive, coalesced layout update per scroll frame; no React frame state. */
export function useParticleStoryScroll({ host, hero, composition, content, reduced }: {
  host: RefObject<HTMLDivElement | null>; hero: RefObject<HTMLElement | null>;
  composition: RefObject<HTMLDivElement | null>; content: RefObject<HTMLDivElement | null>; reduced: boolean;
}) {
  const story = useRef(createParticleStory());
  const restoredInitialLocation = useRef(false);
  /* oxlint-disable react/react-compiler -- This effect owns an imperative DOM/ref renderer bridge; no props or render-time state are mutated. */
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const next = sampleParticleStory(rect.top, rect.bottom, window.innerHeight, reduced);
      Object.assign(story.current, next, { contentWidth: content.current?.getBoundingClientRect().width ?? 0 });
      element.style.setProperty('--story-identity', String(next.identityOpacity));
      element.style.setProperty('--story-particles', String(next.particleStageVisibility));
      element.dataset.spread = next.spreadProgress.toFixed(4);
      element.dataset.storyVisible = String(next.inView);
      // The background retains the original composition's measured footprint.
      const heroRect = hero.current?.getBoundingClientRect();
      const fieldRect = composition.current?.getBoundingClientRect();
      if (heroRect && fieldRect) {
        element.style.setProperty('--story-height', `${heroRect.height}px`);
        element.style.setProperty('--particle-top', `${fieldRect.top - heroRect.top}px`);
        element.style.setProperty('--particle-height', `${fieldRect.height}px`);
      }
      story.current.listeners.forEach((listener) => listener());
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    for (const target of [element, hero.current, composition.current, content.current]) if (target) resize?.observe(target);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    // React mounts after the browser's first fragment lookup. Honor an explicit
    // fresh-navigation anchor once; never override reload/back restored positions.
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const anchor = window.location.hash;
    if (!restoredInitialLocation.current && navigation?.type === 'navigate' && window.scrollY === 0 &&
      (anchor === '#event-introduction' || anchor === '#global-network')) {
      document.getElementById(anchor.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    restoredInitialLocation.current = true;
    update();
    return () => {
      cancelAnimationFrame(frame); resize?.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
    };
  }, [host, hero, composition, content, reduced]);
  /* oxlint-enable react/react-compiler */
  return story;
}
