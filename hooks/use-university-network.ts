'use client';
import { useCallback, useEffect, useState } from 'react';
import type { UniversityId } from '@/content/network';
import {
  readNetworkView,
  networkViewUrl,
  type NetworkView,
  type NetworkYear,
} from '@/lib/university-explorer';

/** Persistent selection drives content; transient hover never owns the camera. */
export function useUniversityNetwork(_reducedMotion: boolean) {
  const [view, setView] = useState<NetworkView>(() =>
    readNetworkView(
      typeof window === 'undefined' ? '' : window.location.search,
    ),
  );
  const [focusId, setFocusId] = useState<UniversityId>(view.selectedId);
  const [cardHover, setCardHover] = useState<UniversityId | null>(null);
  const [nodeHover, setNodeHover] = useState<UniversityId | null>(null);
  const [detailId, setDetailId] = useState<UniversityId | null>(null);
  const clearHover = useCallback(() => {
    setCardHover(null);
    setNodeHover(null);
  }, []);
  const commit = useCallback(
    (next: NetworkView) => {
      setView(next);
      clearHover();
      const url = networkViewUrl(window.location.href, next);
      if (
        url !==
        window.location.pathname + window.location.search + window.location.hash
      ) {
        window.history.pushState(window.history.state, '', url);
      }
    },
    [clearHover],
  );
  useEffect(() => {
    const restore = () => {
      const next = readNetworkView(window.location.search);
      setView(next);
      setFocusId(next.selectedId);
      setDetailId(null);
      clearHover();
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [clearHover]);
  const selectUniversity = useCallback(
    (id: UniversityId) => {
      commit({ ...view, selectedId: id });
      setFocusId(id);
    },
    [view, commit],
  );
  const setYear = useCallback(
    (year: NetworkYear) => commit({ ...view, year }),
    [view, commit],
  );
  const showDetails = useCallback((id: UniversityId) => setDetailId(id), []);
  const closeDetails = useCallback(() => setDetailId(null), []);
  return {
    ...view,
    focusId,
    detailId,
    highlightedId: nodeHover ?? cardHover ?? view.selectedId,
    setCardHover,
    setNodeHover,
    selectUniversity,
    selectFromNode: selectUniversity,
    setYear,
    focusOn: setFocusId,
    showDetails,
    closeDetails,
  };
}
