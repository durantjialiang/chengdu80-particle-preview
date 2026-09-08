'use client';
import {
  Component,
  lazy,
  Suspense,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useInView } from 'framer-motion';
import { getUniversity, type UniversityId } from '@/content/network';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { bilingual as b } from '@/content/competition';
import { universityName, universityLocation } from '@/content/university-i18n';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import { useUniversityNetwork } from '@/hooks/use-university-network';
import {
  explorerNodes,
  filterUniversities,
  networkYears,
  universitySpotlight,
  type NetworkYear,
} from '@/lib/university-explorer';
import UniversitySpotlight from './UniversitySpotlight';
import { UniversityLogo } from './UniversityLogo';
import UniversityDetailPanel from './UniversityDetailPanel';
import { Photo, Viewer } from '@/components/site/ArchiveGallery';
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
  compact = false,
}: {
  standalone?: boolean;
  forceReducedMotion?: boolean;
  staticPreview?: boolean;
  compact?: boolean;
}) {
  const { t, href, language } = useSiteLanguage();
  const mapPanel = useRef<HTMLDivElement>(null);
  const inView = useInView(mapPanel, { margin: '100px' });
  const {
    lowPower,
    reducedMotion: systemReducedMotion,
    pageVisible,
  } = useScenePreferences();
  const reducedMotion = systemReducedMotion || forceReducedMotion;
  const selection = useUniversityNetwork(reducedMotion);
  const [query, setQuery] = useState('');
  const [cityId, setCityId] = useState<UniversityId | null>(null);
  const [eventViewer, setEventViewer] = useState<number | null>(null);
  const filtered = useMemo(
    () => filterUniversities(selection.year, query),
    [selection.year, query],
  );
  const nodes = useMemo(() => explorerNodes(filtered), [filtered]);
  const cityMembers =
    nodes.find((node) => node.id === cityId)?.universityIds ?? [];
  const visibleUniversities = compact
    ? [
        ...filtered.filter((u) => u.id === selection.selectedId),
        ...filtered.filter((u) => u.id !== selection.selectedId),
      ].slice(0, 6)
    : filtered;
  const select = (id: UniversityId) => {
    selection.selectUniversity(id);
    setCityId(null);
  };
  const mapSelection = {
    nodes,
    focusId: selection.focusId,
    highlightedId: filtered.some((u) => u.id === selection.highlightedId)
      ? selection.highlightedId
      : null,
    selectedId: selection.selectedId,
    onNodeHover: (id: UniversityId | null) => {
      const members = nodes.find((n) => n.id === id)?.universityIds ?? [];
      selection.setNodeHover(
        members.includes(selection.selectedId)
          ? selection.selectedId
          : (members[0] ?? null),
      );
    },
    onNodeSelect: (id: UniversityId) => {
      const members = nodes.find((n) => n.id === id)?.universityIds ?? [];
      if (members.length === 1) select(members[0]);
      else if (members.length > 1) setCityId(id);
    },
  };
  const eventPhotos = universitySpotlight(
    selection.selectedId,
    selection.year,
  ).eventPhotos;
  const changeYear = (year: NetworkYear) => {
    selection.setYear(year);
    setCityId(null);
    setEventViewer(null);
  };
  const explorerHref =
    href('/global-network/') +
    (selection.year === 'all' ? '' : '&year=' + selection.year) +
    '&university=' +
    selection.selectedId;
  return (
    <section
      id="global-network"
      className={styles.network}
      data-standalone={standalone}
      data-compact={compact}
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
              'Explore the universities, teams and ideas that meet in Chengdu.',
              '在这里，探索汇聚成都的高校、团队与创意。',
            ),
          )}
        </p>
        {!standalone && (
          <a className={styles.pageLink} href={explorerHref}>
            {t(b('Open network explorer', '探索完整高校网络'))} ↗
          </a>
        )}
      </header>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <strong>{getUniversity(selection.selectedId).shortName}</strong>{' '}
        {universityLocation(getUniversity(selection.selectedId), language)} /{' '}
        {selection.year === 'all'
          ? t(b('All years', '全部年份'))
          : selection.year}
      </div>
      <div className={styles.filters} data-particle-reading-region>
        <label>
          {t(b('Edition', '赛事年份'))}
          <select
            aria-label={t(b('Edition', '赛事年份'))}
            value={selection.year}
            onChange={(e) =>
              changeYear(
                e.target.value === 'all'
                  ? 'all'
                  : (Number(e.target.value) as NetworkYear),
              )
            }
          >
            {networkYears.map((year) => (
              <option key={year} value={year}>
                {year === 'all'
                  ? t(b('All years', '全部年份'))
                  : year === 2025
                    ? t(b('2025 · Not held', '2025 · 未举办'))
                    : year === 2026
                      ? t(b('2026 · Roster pending', '2026 · 名单待公布'))
                      : year}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.searchLabel}>
          {t(b('Find a university', '查找高校'))}
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCityId(null);
            }}
            placeholder={t(
              b('Name, abbreviation or city', '学校名称、简称或城市'),
            )}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setQuery('');
            changeYear('all');
          }}
        >
          {t(b('Clear filters', '清除筛选'))}
        </button>
      </div>
      {filtered.length === 0 && (
        <p className={styles.emptyRecord} aria-live="polite">
          {t(
            selection.year === 2025
              ? b('The competition was not held in 2025.', '2025年未举办赛事。')
              : selection.year === 2026
                ? b(
                    'The 2026 university roster has not been announced.',
                    '2026年高校名单待公布。',
                  )
                : b(
                    'No matching university records. Try another year or search.',
                    '暂无匹配高校记录，请调整年份或搜索。',
                  ),
          )}
        </p>
      )}
      {query.trim() && !filtered.some((u) => u.id === selection.selectedId) && (
        <div
          className={styles.emptyRecord}
          data-search-selection-mismatch
          aria-live="polite"
        >
          <p>
            {universityName(getUniversity(selection.selectedId), language)} /{' '}
            {t(
              b(
                'Your selected university is outside the search results. Its profile remains selected.',
                '当前选中的高校不在搜索结果中，右侧保留其资料。',
              ),
            )}
          </p>
          <button type="button" onClick={() => setQuery('')}>
            {t(b('Clear search', '清除搜索'))}
          </button>
        </div>
      )}
      <div className={styles.workspace} data-particle-reading-region>
        <div ref={mapPanel} className={styles.mapPanel} data-particle-no-force>
          <div className={styles.mapHeading}>
            <span>{t(b('UNIVERSITIES × CHENGDU', '高校 × 成都'))}</span>
            <span className={styles.hubMark}>SWUFE × FIC</span>
          </div>
          <div
            className={styles.globe}
            data-network-node-count={nodes.reduce(
              (n, node) => n + node.universityIds.length,
              0,
            )}
          >
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
                    active={
                      inView &&
                      pageVisible &&
                      !selection.detailId &&
                      eventViewer === null
                    }
                    network={mapSelection}
                  />
                )}
              </Suspense>
            </GlobeLoadBoundary>
          </div>
          {cityMembers.length > 1 && (
            <div
              className={styles.cityMenu}
              aria-label={t(b('Universities in this city', '选择本城市高校'))}
            >
              <p>{t(b('Choose a university', '选择高校'))}</p>
              {cityMembers.map((id) => (
                <button key={id} type="button" onClick={() => select(id)}>
                  {universityName(getUniversity(id), language)}
                </button>
              ))}
              <button type="button" onClick={() => setCityId(null)}>
                {t(b('Close', '关闭'))}
              </button>
            </div>
          )}
          <div className={styles.mapFooter}>
            <button type="button" onClick={() => selection.focusOn('swufe')}>
              {t(b('Return to Chengdu', '回到成都'))} ↗
            </button>
            <span>
              {filtered.length}{' '}
              {t(
                selection.year === 'all'
                  ? b('universities recorded', '所已收录高校')
                  : b(
                      'universities recorded in this edition',
                      '所该届已收录高校',
                    ),
              )}
            </span>
          </div>
        </div>
        <UniversitySpotlight
          key={selection.selectedId + ':' + selection.year}
          universityId={selection.selectedId}
          year={selection.year}
          compact={compact}
          onYear={changeYear}
          onLocate={() => selection.focusOn(selection.selectedId)}
          onDetails={() => selection.showDetails(selection.selectedId)}
        />
      </div>
      <div className={styles.directory} data-particle-reading-region>
        <div className={styles.directoryHeading}>
          <h3>{t(b('University directory', '高校目录'))}</h3>
          <span>
            {visibleUniversities.length} / {filtered.length}
          </span>
        </div>
        <div
          className={styles.compactGrid}
          aria-label={t(b('University cards', '高校卡片'))}
        >
          {visibleUniversities.map((university) => (
            <button
              key={university.id}
              type="button"
              className={styles.directoryButton}
              data-university={university.id}
              aria-pressed={selection.selectedId === university.id}
              onMouseEnter={() => selection.setCardHover(university.id)}
              onMouseLeave={() => selection.setCardHover(null)}
              onFocus={() => selection.setCardHover(university.id)}
              onBlur={() => selection.setCardHover(null)}
              onClick={() => select(university.id)}
            >
              <UniversityLogo university={university} />
              <strong>{universityName(university, language)}</strong>
              <span>{universityLocation(university, language)}</span>
            </button>
          ))}
        </div>
        {compact && (
          <a className={styles.pageLink} href={explorerHref}>
            {t(b('Explore all university records', '查看完整高校目录'))} ↗
          </a>
        )}
      </div>
      {!compact && eventPhotos.length > 0 && (
        <section
          className={styles.eventPhotos}
          data-particle-reading-region
          aria-labelledby="network-event-title"
        >
          <h3 id="network-event-title">
            {selection.year} / {t(b('Inside the event', '本届现场'))}
          </h3>
          <div>
            {eventPhotos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setEventViewer(index)}
                aria-label={
                  t(b('Enlarge event photograph', '放大现场照片')) +
                  ' ' +
                  (index + 1)
                }
              >
                <Photo image={photo} />
              </button>
            ))}
          </div>
        </section>
      )}
      {eventViewer !== null && eventPhotos.length > 0 && (
        <Viewer
          items={eventPhotos}
          initial={eventViewer}
          onClose={() => setEventViewer(null)}
        />
      )}
      {selection.detailId && (
        <UniversityDetailPanel
          university={getUniversity(selection.detailId)}
          onClose={selection.closeDetails}
        />
      )}
    </section>
  );
}
