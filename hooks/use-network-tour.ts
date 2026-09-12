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
  const manualPaused = useRef(false);
  const stateRef = useRef(state);

  const transition = useCallback((next: NetworkTourState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const stop = useCallback(
    (reason: NetworkTourStopReason = 'unknown') => {
      // Any real interaction before the map enters the viewport also hands
      // control to the visitor and prevents a later surprise autoplay.
      hasEntered.current = true;
      if (stateRef.current !== 'running' && stateRef.current !== 'paused')
        return;
      manualPaused.current = false;
      setStopReason(reason);
      transition('stopped');
    },
    [transition],
  );

  const pause = useCallback(() => {
    if (stateRef.current !== 'running') return;
    manualPaused.current = true;
    setStopReason(null);
    transition('paused');
  }, [transition]);

  const resume = useCallback(() => {
    // A visibility pause leaves the internal state running and therefore
    // resumes from the visibility effect. Only an explicit pause is resumed
    // by this action.
    if (stateRef.current !== 'paused' || !manualPaused.current) return;
    manualPaused.current = false;
    setStopReason(null);
    transition('running');
  }, [transition]);

  const start = useCallback(() => {
    if (reducedMotion) return;
    hasStarted.current = true;
    hasEntered.current = true;
    manualPaused.current = false;
    setStopReason(null);
    setStep(0);
    transition('running');
    selectUniversity(GLOBAL_TOUR_STEPS[0], { replace: true });
  }, [reducedMotion, selectUniversity, transition]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  const replay = useCallback(() => {
    restart();
  }, [restart]);

  useEffect(() => {
    if (
      !autoStart ||
      reducedMotion ||
      !inView ||
      !pageVisible ||
      hasEntered.current ||
      hasStarted.current ||
      manualPaused.current
    )
      return;
    hasEntered.current = true;
    start();
  }, [autoStart, inView, pageVisible, reducedMotion, start]);

  useEffect(() => {
    if (state !== 'running' || !inView || !pageVisible || manualPaused.current)
      return;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      if (next >= GLOBAL_TOUR_STEPS.length) {
        manualPaused.current = false;
        transition('complete');
        return;
      }
      selectUniversity(GLOBAL_TOUR_STEPS[next], { replace: true });
      setStep(next);
    }, GLOBAL_TOUR_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [inView, pageVisible, selectUniversity, state, step, transition]);

  useEffect(() => {
    if (reducedMotion) stop('unknown');
  }, [reducedMotion, stop]);

  return {
    state: state === 'running' && (!inView || !pageVisible) ? 'paused' : state,
    step,
    stepIndex: step,
    stepCount: GLOBAL_TOUR_STEPS.length,
    stepId: GLOBAL_TOUR_STEPS[step],
    stopReason,
    stop,
    pause,
    resume,
    start,
    restart,
    replay,
  };
}
