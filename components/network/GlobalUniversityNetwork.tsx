'use client';

import {
  Component,
  lazy,
  Suspense,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useInView } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import {
  universities,
  getUniversity,
  networkNotice,
  documentedUniversities,
} from '@/content/network';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import { useUniversityNetwork } from '@/hooks/use-university-network';
import UniversityCard from './UniversityCard';
import UniversityDetailPanel from './UniversityDetailPanel';
import StaticNetwork from '@/components/Hero/StaticNetwork';
import styles from './Network.module.css';

const Globe = lazy(() => import('@/components/Globe'));
class GlobeLoadBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function GlobalUniversityNetwork({
  standalone = false,
  forceReducedMotion = false,
  staticPreview = false,
}: {
  standalone?: boolean;
  forceReducedMotion?: boolean;
  staticPreview?: boolean;
}) {
  const host = useRef<HTMLElement>(null);
  const mapPanel = useRef<HTMLDivElement>(null);
  const inView = useInView(mapPanel, { margin: '100px' });
  const {
    lowPower,
    reducedMotion: systemReducedMotion,
    pageVisible,
  } = useScenePreferences();
  const reducedMotion = systemReducedMotion || forceReducedMotion;
  const selection = useUniversityNetwork(reducedMotion);
  const selected = getUniversity(selection.highlightedId);
  const mapSelection = useMemo(
    () => ({
      focusId: selection.focusId,
      highlightedId: selection.highlightedId,
      selectedId: selection.selectedId,
      onNodeHover: selection.setNodeHover,
      onNodeSelect: selection.selectFromNode,
    }),
    [
      selection.focusId,
      selection.highlightedId,
      selection.selectedId,
      selection.setNodeHover,
      selection.selectFromNode,
    ],
  );
  return (
    <section
      ref={host}
      id="global-network"
      className={styles.network}
      data-standalone={standalone}
      data-reduced-motion={reducedMotion}
      aria-labelledby="network-title"
    >
      <header className={styles.header} data-particle-reading-region>
        <p className={styles.eyebrow}>CHENGDU 80 / GLOBAL UNIVERSITY NETWORK</p>
        <h2 id="network-title">
          Global minds.
          <br />
          <span>One point of convergence.</span>
        </h2>
        <p>
          From university ideas to fintech innovation. Converging in Chengdu.
        </p>
        {!standalone ? (
          <a
            className={styles.pageLink}
            href={
              import.meta.env.DEV
                ? '/qa/global-network.html'
                : '/global-network/'
            }
          >
            Open network explorer <ArrowUpRight size={16} />
          </a>
        ) : null}
      </header>
      <div className={styles.workspace} data-particle-reading-region>
        <div ref={mapPanel} className={styles.mapPanel} data-particle-no-force>
          <div className={styles.mapHeading}>
            <span>EXPLORE THE CONNECTIONS</span>
            <span className={styles.hubMark}>HUB / CHENGDU</span>
          </div>
          <div className={styles.globe}>
            <GlobeLoadBoundary
              fallback={<StaticNetwork network={mapSelection} />}
            >
              <Suspense fallback={<StaticNetwork network={mapSelection} />}>
                {staticPreview ? (
                  <StaticNetwork network={mapSelection} />
                ) : (
                  <Globe
                    lowPower={lowPower}
                    reducedMotion={reducedMotion}
                    active={inView && pageVisible && !selection.detailId}
                    network={mapSelection}
                  />
                )}
              </Suspense>
            </GlobeLoadBoundary>
          </div>
          <div
            className={styles.connectionReadout}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className={styles.readoutLabel}>
              {selected.id === 'swufe'
                ? 'THE CONVERGENCE POINT'
                : 'SELECTED UNIVERSITY'}
            </span>
            <strong>
              {selected.shortName}
              {selected.id !== 'swufe' ? (
                <>
                  <ArrowDownLeft size={18} />
                  <span>Chengdu</span>
                </>
              ) : (
                <span> / Chengdu</span>
              )}
            </strong>
            <span>
              {selected.city} ·{' '}
              {selected.relationshipType === 'ecosystem'
                ? 'SWUFE ecosystem exchange · not confirmed participation'
                : selected.verification === 'documented'
                  ? 'Historical competition record'
                  : 'Participation not verified'}
            </span>
          </div>
          <div className={styles.mapFooter}>
            <span>Hover a card. Select a node.</span>
            <span>SWUFE × FIC</span>
          </div>
        </div>
        <div className={styles.directory}>
          <div className={styles.directoryHeading}>
            <h3>University directory</h3>
            <span>{documentedUniversities.length} documented records</span>
          </div>
          <div className={styles.grid} aria-label="University cards">
            {universities.map((university, index) => (
              <UniversityCard
                key={university.id}
                university={university}
                index={index}
                reducedMotion={reducedMotion}
                selected={selection.selectedId === university.id}
                highlighted={selection.highlightedId === university.id}
                register={(element) => {
                  if (element)
                    selection.cards.current.set(university.id, element);
                  else selection.cards.current.delete(university.id);
                }}
                onHover={(hovering) =>
                  selection.setCardHover(hovering ? university.id : null)
                }
                onDetails={() => selection.showDetails(university.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.legend} data-particle-reading-region>
        <span>
          <i />
          Historical competition link
        </span>
        <span>
          <i />
          Wider SWUFE ecosystem exchange
        </span>
      </div>
      <p className={styles.notice} data-particle-reading-region>{networkNotice}</p>
      {selection.detailId ? (
        <UniversityDetailPanel
          university={getUniversity(selection.detailId)}
          onClose={selection.closeDetails}
        />
      ) : null}
    </section>
  );
}
