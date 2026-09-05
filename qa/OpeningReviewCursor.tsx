import { useEffect, useRef } from 'react';

/** Review recording only: marks real pointer events, never synthesizes input. */
export default function OpeningReviewCursor() {
  const marker = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!marker.current) return;
      marker.current.style.transform = `translate3d(${event.clientX - 9}px, ${event.clientY - 9}px, 0)`;
      marker.current.style.opacity = '0.8';
    };
    const leave = () => { if (marker.current) marker.current.style.opacity = '0'; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerout', leave); };
  }, []);
  return <div ref={marker} aria-hidden="true" style={{ position:'fixed', top:0, left:0, width:18, height:18, border:'1px solid #c7deee', borderRadius:'50%', opacity:0, zIndex:100, pointerEvents:'none' }} />;
}
