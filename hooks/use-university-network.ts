'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { UniversityId } from '@/content/network';
import type { NetworkRegion } from '@/content/network-regions';
import {
  readNetworkView,
  networkViewUrl,
  type NetworkView,
  type NetworkYear,
} from '@/lib/university-explorer';

/** Persistent selection drives content; transient hover never owns the camera. */
export function useUniversityNetwork(_reducedMotion: boolean) {
  const [view, setViewState] = useState<NetworkView>(() =>
    readNetworkView(
      typeof window === 'undefined' ? '' : window.location.search,
    ),
  );
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const [focusId, setFocusId] = useState<UniversityId>(view.selectedId);
  const [focusRevision, setFocusRevision] = useState(0);
  const [cardHover, setCardHover] = useState<UniversityId | null>(null);
  const [nodeHover, setNodeHover] = useState<UniversityId | null>(null);
  const [detailId, setDetailId] = useState<UniversityId | null>(null);
  const clearHover = useCallback(() => {
    setCardHover(null);
    setNodeHover(null);
  }, []);
  const focus = useCallback((id: UniversityId) => {
    setFocusId(id);
    setFocusRevision((revision) => revision + 1);
  }, []);
  const commit = useCallback(
    (
      nextOrUpdate: NetworkView | ((current: NetworkView) => NetworkView),
      mode: 'push' | 'replace' = 'push',
    ) => {
      const next =
        typeof nextOrUpdate === 'function'
          ? nextOrUpdate(viewRef.current)
          : nextOrUpdate;
      viewRef.current = next;
      setViewState(next);
      clearHover();
      const url = networkViewUrl(window.location.href, next);
      if (
        url !==
        window.location.pathname + window.location.search + window.location.hash
      ) {
        window.history[mode === 'replace' ? 'replaceState' : 'pushState'](
          window.history.state,
          '',
          url,
        );
      }
    },
    [clearHover],
  );
  useEffect(() => {
    const restore = () => {
      const next = readNetworkView(window.location.search);
      viewRef.current = next;
      setViewState(next);
      focus(next.selectedId);
      setDetailId(null);
      clearHover();
    };
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [clearHover, focus]);
  const selectUniversity = useCallback(
    (id: UniversityId, options?: { replace?: boolean }) => {
      commit(
        (current) => ({ ...current, selectedId: id }),
        options?.replace ? 'replace' : 'push',
      );
      focus(id);
    },
    [commit, focus],
  );
  const setYear = useCallback(
    (year: NetworkYear, options?: { replace?: boolean }) =>
      commit(
        (current) => ({ ...current, year }),
        options?.replace ? 'replace' : 'push',
      ),
    [commit],
  );
  const setRegion = useCallback(
    (region: NetworkRegion, options?: { replace?: boolean }) =>
      commit(
        (current) => ({ ...current, region }),
        options?.replace ? 'replace' : 'push',
      ),
    [commit],
  );
  const setQuery = useCallback(
    (query: string, options?: { replace?: boolean }) =>
      commit(
        (current) => ({ ...current, query }),
        options?.replace === false ? 'push' : 'replace',
      ),
    [commit],
  );
  const setView = useCallback(
    (next: NetworkView, options?: { replace?: boolean }) =>
      commit(next, options?.replace ? 'replace' : 'push'),
    [commit],
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
    setRegion,
    setQuery,
    setView,
    focusRevision,
    focusOn: focus,
    showDetails,
    closeDetails,
  };
}
