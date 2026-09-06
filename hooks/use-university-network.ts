'use client';
import { useCallback, useRef, useState } from 'react';
import type { UniversityId } from '@/content/network';
import { universities } from '@/content/network';

function initialUniversity(): UniversityId {
  if (typeof window === 'undefined') return 'swufe';
  const id = new URLSearchParams(window.location.search).get('university');
  return universities.find((u) => u.id === id)?.id ?? 'swufe';
}

/** One selection owner for the cards, globe and detail panel. Hover never scrolls. */
export function useUniversityNetwork(reducedMotion: boolean) {
  const [selectedId, setSelectedId] = useState<UniversityId>(initialUniversity);
  const [focusId, setFocusId] = useState<UniversityId>(initialUniversity);
  const [cardHover, updateCardHover] = useState<UniversityId | null>(null);
  const [nodeHover, setNodeHover] = useState<UniversityId | null>(null);
  const [detailId, setDetailId] = useState<UniversityId | null>(null);
  const cards = useRef(new Map<UniversityId, HTMLElement>());
  // Keep the inspected campus facing forward when crossing from a card to the map.
  // Resetting on pointer-leave moves labels out from under the approaching cursor.
  const setCardHover = useCallback((id: UniversityId | null) => {
    updateCardHover(id);
    if (id) setFocusId(id);
  }, []);
  const selectFromNode = useCallback(
    (id: UniversityId) => {
      setSelectedId(id);
      setFocusId(id);
      updateCardHover(null);
      setNodeHover(null);
      cards.current.get(id)?.scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    },
    [reducedMotion],
  );
  const showDetails = useCallback((id: UniversityId) => {
    setSelectedId(id);
    setFocusId(id);
    setDetailId(id);
  }, []);
  const closeDetails = useCallback(() => setDetailId(null), []);
  return {
    selectedId,
    highlightedId: nodeHover ?? cardHover ?? focusId,
    focusId,
    detailId,
    cards,
    setCardHover,
    setNodeHover,
    selectFromNode,
    showDetails,
    closeDetails,
  };
}
