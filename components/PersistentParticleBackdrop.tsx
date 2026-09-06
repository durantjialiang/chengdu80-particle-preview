'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Particle80, { type Particle80Props } from './Particle80';
import { useParticleStoryScroll } from '@/hooks/use-particle-story-scroll';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import styles from './PersistentParticleBackdrop.module.css';
const subscribeMount = () => () => {};
const clientMount = () => document.body;
const serverMount = () => null;

/** Single viewport surface, outside all section clipping/stacking contexts.
 * Intro supplies geometry/choreography only. This layer owns the renderer and
 * window-level interaction throughout the document, including its footer.
 */
export default function PersistentParticleBackdrop(props: Particle80Props) {
  const mount = useSyncExternalStore(subscribeMount, clientMount, serverMount);
  useEffect(() => {
    document.body.dataset.particleBackdrop = 'true';
    return () => { delete document.body.dataset.particleBackdrop; };
  }, []);
  return mount ? createPortal(
    <div className={styles.backdrop} data-persistent-particle-backdrop="true" aria-hidden="true">
      <Particle80 {...props} visibilityScope="page" pointerHost={undefined} className={styles.field} />
    </div>, mount,
  ) : null;
}

/** A new static document gets a lighter side field; no Hero or Globe import. */
export function AmbientParticleBackdrop() {
  const { reducedMotion } = useScenePreferences();
  const story = useParticleStoryScroll({ reduced: reducedMotion, mode: 'ambient' });
  return <PersistentParticleBackdrop story={story} introEnabled={false} interactive
    particleCount={1800} brightnessPreset="B" intensity={0.8} speed={0.65} viewScale={1.72} />;
}
