'use client';
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useInView } from 'framer-motion';
import {
  getUniversity,
  universities,
  type UniversityId,
} from '@/content/network';
import { useSiteLanguage } from '@/hooks/use-site-language';
import { bilingual as b } from '@/content/competition';
import { universityName, universityLocation } from '@/content/university-i18n';
import { useScenePreferences } from '@/hooks/use-scene-preferences';
import { useUniversityNetwork } from '@/hooks/use-university-network';
import {
  explorerNodes,
  filterUniversities,
  networkYears,
  networkViewUrl,
  regionFocusUniversity,
  universitySpotlight,
  type NetworkYear,
} from '@/lib/university-explorer';
import { networkRegions, type NetworkRegion } from '@/content/network-regions';
import { useNetworkTour } from '@/hooks/use-network-tour';
import UniversitySpotlight from './UniversitySpotlight';
import { UniversityLogo } from './UniversityLogo';
import UniversityDetailPanel from './UniversityDetailPanel';
import { Photo, Viewer } from '@/components/site/ArchiveGallery';
import StaticNetwork from '@/components/Hero/StaticNetwork';
import styles from './Network.module.css';
import controls from './NetworkControls.module.css';

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
  const tourInView = useInView(mapPanel, { margin: '0px' });
  const {
    lowPower,
    reducedMotion: systemReducedMotion,
    pageVisible,
  } = useScenePreferences();
  const reducedMotion = systemReducedMotion || forceReducedMotion;
  const selection = useUniversityNetwork(reducedMotion);
  const [cityId, setCityId] = useState<UniversityId | null>(null);
  const [eventViewer, setEventViewer] = useState<number | null>(null);
  const params =
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(window.location.search);
  const explicitView = Boolean(
    params &&
    ['university', 'year', 'region', 'query', 'q'].some((key) =>
      params.has(key),
    ),
  );
  const tour = useNetworkTour({
    inView: tourInView,
    pageVisible,
    reducedMotion,
    autoStart: !explicitView,
    selectUniversity: selection.selectUniversity,
  });
  const stopTour = tour.stop;
  const selectUniversity = selection.selectUniversity;
  useEffect(() => {
    const cancelTour = () => stopTour('filter');
    window.addEventListener('popstate', cancelTour);
    return () => window.removeEventListener('popstate', cancelTour);
  }, [stopTour]);
  const filtered = useMemo(
    () => filterUniversities(selection.year, selection.query, selection.region),
    [selection.year, selection.query, selection.region],
  );
  const regionCounts = useMemo(
    () =>
      Object.fromEntries(
        networkRegions.map((region) => [
          region,
          filterUniversities(selection.year, selection.query, region).length,
        ]),
      ) as Record<NetworkRegion, number>,
    [selection.year, selection.query],
  );
  const nodes = useMemo(
    () => explorerNodes(filtered, selection.year),
    [filtered, selection.year],
  );
  const cityMembers =
    nodes.find((node) => node.id === cityId)?.universityIds ?? [];
  const compactDefaultIds: readonly UniversityId[] = [
    'swufe',
    'nus',
    'berkeley',
    'toronto',
    'eth',
    'unsw',
  ];
  const compactDefaults = compactDefaultIds
    .map((id) => universities.find((university) => university.id === id))
    .filter((university): university is (typeof universities)[number] =>
      Boolean(university),
    );
  const hasFilters =
    selection.year !== 'all' ||
    selection.region !== 'all' ||
    selection.query.trim().length > 0;
  const visibleUniversities = compact
    ? (hasFilters ? filtered : compactDefaults).slice(0, 6)
    : filtered;
  useEffect(() => {
    if (!filtered.length || filtered.some((u) => u.id === selection.selectedId))
      return;
    const nextId =
      regionFocusUniversity(selection.region, filtered) ?? filtered[0]?.id;
    if (nextId && nextId !== selection.selectedId)
      selectUniversity(nextId, { replace: true });
  }, [filtered, selection.region, selection.selectedId, selectUniversity]);
  const select = (id: UniversityId) => {
    tour.stop('card');
    selection.selectUniversity(id);
    setCityId(null);
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 900px)').matches
    ) {
      window.requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>('[data-spotlight]')
          ?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
      });
    }
  };
  const changeRegion = (region: NetworkRegion) => {
    tour.stop('filter');
    const next = filterUniversities(selection.year, selection.query, region);
    const nextId = next.some((u) => u.id === selection.selectedId)
      ? selection.selectedId
      : (regionFocusUniversity(region, next, universities) ??
        selection.selectedId);
    selection.setView({
      year: selection.year,
      region,
      query: selection.query,
      selectedId: nextId,
    });
    selection.focusOn(nextId);
    setCityId(null);
  };
  const changeQuery = (value: string) => {
    tour.stop('search');
    selection.setQuery(value);
    setCityId(null);
  };
  const mapSelection = {
    nodes,
    focusId: selection.focusId,
    highlightedId: filtered.some((u) => u.id === selection.highlightedId)
      ? selection.highlightedId
      : null,
    selectedId: selection.selectedId,
    focusRevision: selection.focusRevision,
    onInteraction: () => tour.stop('globe'),
    onNodeHover: (id: UniversityId | null) => {
      const members = nodes.find((n) => n.id === id)?.universityIds ?? [];
      selection.setNodeHover(
        members.includes(selection.selectedId)
          ? selection.selectedId
          : (members[0] ?? null),
      );
    },
    onNodeSelect: (id: UniversityId) => {
      tour.stop('node');
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
    tour.stop('filter');
    selection.setYear(year);
    setCityId(null);
    setEventViewer(null);
  };
  const explorerHref = networkViewUrl(
    new URL(href('/global-network/'), 'https://chengdu80.invalid').href,
    selection,
  );
  const replayTour = () => {
    tour.stop('filter');
    if (hasFilters) {
      selection.setView(
        {
          year: 'all',
          region: 'all',
          query: '',
          selectedId: 'swufe',
        },
        { replace: true },
      );
      selection.focusOn('swufe');
      setCityId(null);
    }
    tour.replay();
  };
  return (
    <section
      id="global-network"
      className={styles.network}
      data-standalone={standalone}
      data-compact={compact}
      data-reduced-motion={reducedMotion}
      data-tour-state={tour.state}
      data-tour-step={tour.stepId}
      data-tour-stop={tour.stopReason ?? undefined}
      aria-labelledby="network-title"
      onKeyDownCapture={() => tour.stop('keyboard')}
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
              'Explore the universities connected through Chengdu 80 competitions, academic visits and forum exchanges.',
              '探索通过成都八零赛事、学者来访与论坛交流建立联系的高校。',
            ),
          )}
        </p>
        {!standalone && (
          <a className={styles.pageLink} href={explorerHref}>
            {t(b('Open network explorer', '探索完整高校网络'))} ↗
          </a>
        )}
        <div className={controls.tourRow}>
          <button
            type="button"
            className={controls.tourButton}
            onClick={replayTour}
            disabled={reducedMotion}
          >
            {t(
              hasFilters
                ? b(
                    'Take a global tour · clear filters',
                    '开始全球巡游 · 清除筛选',
                  )
                : b('Take a global tour', '开始全球巡游'),
            )}
          </button>
          <span className={controls.tourStatus} aria-live="polite">
            {tour.state === 'paused'
              ? t(b('Tour paused', '巡游已暂停'))
              : tour.state === 'running'
                ? t(b('Global tour in progress', '全球巡游进行中'))
                : tour.state === 'complete'
                  ? t(b('Tour complete', '巡游完成'))
                  : null}
          </span>
        </div>
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
          {t(b('Year', '年份'))}
          <select
            aria-label={t(b('Year', '年份'))}
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
            value={selection.query}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder={t(
              b('Name, abbreviation or city', '学校名称、简称或城市'),
            )}
          />
        </label>
        <fieldset className={controls.regionBar}>
          <legend className={controls.regionLabel}>
            {t(b('Explore by region', '按地区探索'))}
          </legend>
          <div className={controls.regionButtons}>
            {networkRegions.map((region) => {
              const label =
                region === 'all'
                  ? b('All regions', '全部地区')
                  : region === 'asia'
                    ? b('Asia', '亚洲')
                    : region === 'europe'
                      ? b('Europe', '欧洲')
                      : region === 'north-america'
                        ? b('North America', '北美洲')
                        : b('Oceania', '大洋洲');
              return (
                <button
                  key={region}
                  type="button"
                  className={controls.regionButton}
                  aria-pressed={selection.region === region}
                  onClick={() => changeRegion(region)}
                >
                  {t(label)}{' '}
                  <span className={controls.regionCount}>
                    {regionCounts[region]}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={() => {
            tour.stop('filter');
            selection.setView({
              year: 'all',
              region: 'all',
              query: '',
              selectedId: selection.selectedId,
            });
            setCityId(null);
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
          {filtered.length > 0 && (
            <div
              className={styles.connectionReadout}
              data-particle-reading-region
            >
              <button
                type="button"
                className={controls.profileLink}
                onClick={() => {
                  tour.stop('card');
                  selection.showDetails(selection.selectedId);
                }}
              >
                {universityName(getUniversity(selection.selectedId), language)}{' '}
                · {t(b('Explore university profile', '查看高校资料'))} ↗
              </button>
            </div>
          )}
          <div className={styles.mapFooter}>
            <button
              type="button"
              onClick={() => {
                tour.stop('card');
                selection.focusOn('swufe');
              }}
            >
              {t(b('Return to Chengdu', '回到成都'))} ↗
            </button>
            <span>
              {filtered.length}{' '}
              {t(
                selection.year === 'all'
                  ? b('universities recorded', '所已收录高校')
                  : b(
                      'universities connected in this year',
                      '所该年交流与参赛高校',
                    ),
              )}
            </span>
          </div>
        </div>
        {filtered.length > 0 && (
          <UniversitySpotlight
            key={selection.selectedId + ':' + selection.year}
            universityId={selection.selectedId}
            year={selection.year}
            compact={compact}
            onYear={changeYear}
            onLocate={() => {
              tour.stop('card');
              selection.focusOn(selection.selectedId);
            }}
            onDetails={() => {
              tour.stop('card');
              selection.showDetails(selection.selectedId);
            }}
          />
        )}
      </div>
      <div className={styles.directory} data-particle-reading-region>
        <div className={styles.directoryHeading}>
          <h3>
            {t(
              b(
                'Universities across competitions & academic exchange',
                '赛事与学术交流合作高校',
              ),
            )}
          </h3>
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
            {t(b('Explore all universities', '探索全部高校'))} ↗
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
