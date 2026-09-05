'use client';

import { useCallback, useState } from 'react';
import type { Particle80State } from '@/components/Particle80';

/** The renderer reports phase changes and 4% progress steps, not every frame. */
export function useParticleIntro() {
  const [state, setState] = useState<Particle80State>({
    introStarted: false,
    formationProgress: 0,
    settled: false,
    interactionEnabled: false,
  });
  const onStateChange = useCallback(
    (next: Particle80State) => setState(next),
    [],
  );
  return { ...state, onStateChange };
}
