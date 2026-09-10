'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UniversityId } from '@/content/network';

/** The route is intentionally short enough to be noticed without taking over
 * the page. Six four-second stops give a 24-second pass including Chengdu. */
export const GLOBAL_TOUR_STEPS: readonly UniversityId[] = [
  'swufe',
  'nus',
  'eth',
  'toronto',
  'berkeley',
  'swufe',
];
export const GLOBAL_TOUR_STEP_MS = 4_000;

export type NetworkTourState =
  | 'idle'
  | 'running'
  | 'paused'
  | 'complete'
  | 'stopped';
export type NetworkTourStopReason =
  | 'globe'
  | 'node'
  | 'card'
  | 'filter'
  | 'keyboard'
  | 'search'
  | 'unknown';

export function useNetworkTour({
  inView,
  pageVisible,
  reducedMotion,
  autoStart = true,
  selectUniversity,
}: {
  inView: boolean;
  pageVisible: boolean;
  reducedMotion: boolean;
  autoStart?: boolean;
  selectUniversity: (id: UniversityId, options?: { replace?: boolean }) => void;
}) {
  const [state, setState] = useState<NetworkTourState>('idle');
  const [step, setStep] = useState(0);
  const [stopReason, setStopReason] = useState<NetworkTourStopReason | null>(
    null,
  );
  const hasEntered = useRef(false);
  const hasStarted = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const stop = useCallback((reason: NetworkTourStopReason = 'unknown') => {
    // Any real interaction before the map enters the viewport also hands
    // control to the visitor and prevents a later surprise autoplay.
    hasEntered.current = true;
    if (stateRef.current !== 'running' && stateRef.current !== 'paused') return;
    stateRef.current = 'stopped';
    setStopReason(reason);
    setState('stopped');
  }, []);

  const start = useCallback(() => {
    if (reducedMotion) return;
    hasStarted.current = true;
    stateRef.current = 'running';
    setStopReason(null);
    setStep(0);
    setState('running');
    selectUniversity(GLOBAL_TOUR_STEPS[0], { replace: true });
  }, [reducedMotion, selectUniversity]);

  const replay = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (
      !autoStart ||
      reducedMotion ||
      !inView ||
      !pageVisible ||
      hasEntered.current ||
      hasStarted.current
    )
      return;
    hasEntered.current = true;
    start();
  }, [autoStart, inView, pageVisible, reducedMotion, start]);

  useEffect(() => {
    if (state !== 'running' || !inView || !pageVisible) return;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      if (next >= GLOBAL_TOUR_STEPS.length) {
        stateRef.current = 'complete';
        setState('complete');
        return;
      }
      selectUniversity(GLOBAL_TOUR_STEPS[next], { replace: true });
      setStep(next);
    }, GLOBAL_TOUR_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [inView, pageVisible, selectUniversity, state, step]);

  useEffect(() => {
    if (reducedMotion) stop('unknown');
  }, [reducedMotion, stop]);

  return {
    state: state === 'running' && (!inView || !pageVisible) ? 'paused' : state,
    step,
    stepId: GLOBAL_TOUR_STEPS[step],
    stopReason,
    stop,
    start,
    replay,
  };
}
