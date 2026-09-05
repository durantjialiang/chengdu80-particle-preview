'use client';

import { useSyncExternalStore } from 'react';

function lowPowerSnapshot() {
  const device = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    window.matchMedia('(max-width: 767px)').matches ||
    device.hardwareConcurrency <= 4 ||
    (device.deviceMemory ?? 8) <= 4 ||
    Boolean(device.connection?.saveData)
  );
}
function subscribePower(onChange: () => void) {
  const query = window.matchMedia('(max-width: 767px)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const motionSnapshot = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const visibilitySnapshot = () => document.visibilityState === 'visible';
const serverPower = () => false;
const serverVisibility = () => true;

export function useScenePreferences() {
  const lowPower = useSyncExternalStore(
    subscribePower,
    lowPowerSnapshot,
    serverPower,
  );
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    visibilitySnapshot,
    serverVisibility,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    serverPower,
  );
  return { lowPower, pageVisible, reducedMotion };
}
