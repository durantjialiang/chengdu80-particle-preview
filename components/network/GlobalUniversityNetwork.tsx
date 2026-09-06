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
  documentedUniversities,
} from '@/content/network';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { bilingual as b } from '@/content/competition';
import { universityLocation } from '@/content/university-i18n';
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
  const { t, href, language } = useSiteLanguage();
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
        <p className={styles.eyebrow}>
          CHENGDU 80 / {t(b('GLOBAL UNIVERSITY NETWORK', '全球高校网络'))}
        </p>
        <h2 id="network-title">
          {t(b('Global minds.', '全球创意，'))}
          <br />
          <span>{t(b('One point of convergence.', '汇聚成都。'))}</span>
        </h2>
        <p>
          {t(
            b(
              'From university ideas to fintech innovation. Converging in Chengdu.',
              '从高校创想到金融科技创新，在成都相遇。',
            ),
          )}
        </p>
        {!standalone ? (
          <a className={styles.pageLink} href={href('/global-network/')}>
            {t(b('Open network explorer', '探索高校网络'))}{' '}
            <ArrowUpRight size={16} />
          </a>
        ) : null}
      </header>
      <div className={styles.workspace} data-particle-reading-region>
        <div ref={mapPanel} className={styles.mapPanel} data-particle-no-force>
          <div className={styles.mapHeading}>
            <span>{t(b('EXPLORE THE CONNECTIONS', '探索高校连接'))}</span>
            <span className={styles.hubMark}>
              {t(b('HUB / CHENGDU', '汇聚点 / 成都'))}
            </span>
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
                ? t(b('THE CONVERGENCE POINT', '汇聚点'))
                : t(b('SELECTED UNIVERSITY', '当前高校'))}
            </span>
            <strong>
              {selected.shortName}
              {selected.id !== 'swufe' ? (
                <>
                  <ArrowDownLeft size={18} />
                  <span>{t(b('Chengdu', '成都'))}</span>
                </>
              ) : (
                <span> / {t(b('Chengdu', '成都'))}</span>
              )}
            </strong>
            <span>
              {universityLocation(selected, language)} ·{' '}
              {selected.relationshipType === 'ecosystem'
                ? t(
                    b(
                      'SWUFE ecosystem exchange · not confirmed participation',
                      '西财生态交流 · 参赛尚未确认',
                    ),
                  )
                : selected.verification === 'documented'
                  ? t(b('Historical competition record', '历史赛事记录'))
                  : t(b('Participation not verified', '参赛尚未核实'))}
            </span>
          </div>
          <div className={styles.mapFooter}>
            <span>
              {t(
                b('Hover a card. Select a node.', '悬停卡片，或选择地球节点。'),
              )}
            </span>
            <span>SWUFE × FIC</span>
          </div>
        </div>
        <div className={styles.directory}>
          <div className={styles.directoryHeading}>
            <h3>{t(b('University directory', '高校目录'))}</h3>
            <span>
              {documentedUniversities.length}{' '}
              {t(b('documented records', '条有来源记录'))}
            </span>
          </div>
          <div
            className={styles.grid}
            aria-label={t(b('University cards', '高校卡片'))}
          >
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
          {t(b('Historical competition link', '历史赛事连接'))}
        </span>
        <span>
          <i />
          {t(b('Wider SWUFE ecosystem exchange', '西财生态交流'))}
        </span>
      </div>
      <div className={styles.notice} data-particle-reading-region>
        <p>
          {t(
            b(
              'Selected historical records, not a confirmed 2026 roster or a complete archive.',
              '精选历史记录，不是2026确认名单，也不是完整档案。',
            ),
          )}
        </p>
        <details className={styles.auditNotes}>
          <summary>{t(b('Sources & record notes', '资料来源与说明'))}</summary>
          <p>
            {t(
              b(
                'Each university links to its evidence. Pins show approximate campus locations, not travel records. Dashed routes mean ecosystem exchange, not confirmed competition participation. Publication dates and event dates are kept separate.',
                '每所高校详情均列出依据。节点是近似校区位置，不表示历史行程；虚线仅代表生态交流，不代表已确认参赛。报道日期与赛事日期分别记录。',
              ),
            )}
          </p>
        </details>
      </div>
      {selection.detailId ? (
        <UniversityDetailPanel
          university={getUniversity(selection.detailId)}
          onClose={selection.closeDetails}
        />
      ) : null}
    </section>
  );
}
