import { getUniversity, globeNodes } from '@/content/network';
import { universityLocation, universityName } from '@/content/university-i18n';
import { useSiteLanguage } from '@/hooks/use-site-language';
import type { NetworkInteraction } from './scene-config';

// Static orthographic projection shares the live scene's city data. No WebGL,
// timers, textures, or second map registry is required for the fallback.
function project(
  latitude: number,
  longitude: number,
  centreLat = 20,
  centreLon = 100,
) {
  const lat = (latitude * Math.PI) / 180;
  const lon = ((longitude - centreLon) * Math.PI) / 180;
  const centre = (centreLat * Math.PI) / 180;
  return {
    x: 400 + 246 * Math.cos(lat) * Math.sin(lon),
    y:
      350 -
      246 *
        (Math.cos(centre) * Math.sin(lat) -
          Math.sin(centre) * Math.cos(lat) * Math.cos(lon)),
    visible:
      Math.sin(centre) * Math.sin(lat) +
        Math.cos(centre) * Math.cos(lat) * Math.cos(lon) >
      0,
  };
}

export default function StaticNetwork({
  network,
}: {
  network?: NetworkInteraction;
}) {
  const { language } = useSiteLanguage();
  const focused =
    network?.nodes?.find((city) =>
      city.universityIds.includes(network.focusId!),
    ) ?? globeNodes.find((city) => city.id === network?.focusId);
  const nodes = (network?.nodes ?? globeNodes).map((city) => ({
    ...city,
    point: project(
      city.latitude,
      city.longitude,
      focused?.latitude,
      focused?.longitude,
    ),
  }));
  const origin = nodes.find((city) => city.isOrigin)!;
  const selectedCity = network?.selectedId
    ? (nodes.find((city) => city.universityIds.includes(network.selectedId!)) ??
      null)
    : null;
  const selectedUniversity = network?.selectedId
    ? getUniversity(network.selectedId)
    : null;
  const selectedOrigin =
    network?.selectedId && origin.universityIds.includes(network.selectedId)
      ? getUniversity(network.selectedId)
      : null;
  const selectedBadgeVisible = Boolean(
    network && selectedCity?.point.visible && selectedUniversity,
  );
  const selectedBadgeLeft = selectedCity
    ? Math.min(72, Math.max(3, ((selectedCity.point.x + 14) / 800) * 100))
    : 0;
  const selectedBadgeTop = selectedCity
    ? Math.min(88, Math.max(3, ((selectedCity.point.y - 30) / 700) * 100))
    : 0;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 800 700"
        width="100%"
        height="100%"
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden={network ? undefined : true}
        aria-label={
          network
            ? 'Static university globe. University cards remain available.'
            : undefined
        }
      >
        {network ? (
          <circle
            cx="400"
            cy="350"
            r="246"
            fill="#071524"
            stroke="#76bcd5"
            strokeOpacity=".3"
          />
        ) : null}
        {nodes
          .filter((city) => !city.isOrigin && city.point.visible)
          .map((city) =>
            (() => {
              const hoveredId = network?.highlightedId;
              const highlightedId =
                hoveredId && city.universityIds.includes(hoveredId)
                  ? hoveredId
                  : city.universityIds[0];
              const university = highlightedId
                ? getUniversity(highlightedId)
                : null;
              const selectedId = network?.selectedId;
              const selected = Boolean(
                selectedId && city.universityIds.includes(selectedId),
              );
              const selectedUniversity = selectedId
                ? getUniversity(selectedId)
                : null;
              const highlighted = Boolean(
                network && city.universityIds.includes(network.highlightedId!),
              );
              const displayUniversity = selected
                ? selectedUniversity
                : university;
              const emphasized = selected || highlighted;
              const displayName =
                emphasized && displayUniversity
                  ? universityName(displayUniversity, language)
                  : city.universityIds.length > 1
                    ? `${
                        universityLocation(
                          getUniversity(city.universityIds[0]),
                          language,
                        ).split(' · ')[0]
                      } · ${city.universityIds.length} ${
                        language === 'zh' ? '所高校' : 'universities'
                      }`
                    : language === 'zh' && university
                      ? universityName(university, language)
                      : city.name;
              const accessibleName =
                city.universityIds.length > 1
                  ? `${city.name} · ${city.universityIds.length} universities / ${city.name} · ${city.universityIds.length} 所高校`
                  : university
                    ? `${universityName(university, 'en')} · ${universityLocation(university, 'en')} / ${universityName(university, 'zh')} · ${universityLocation(university, 'zh')}`
                    : city.name;
              return (
                <g
                  key={city.id}
                  data-node={city.id}
                  data-universities={city.universityIds.join(',')}
                  role={network ? 'button' : undefined}
                  tabIndex={network ? 0 : undefined}
                  aria-label={network ? `Select ${accessibleName}` : undefined}
                  aria-pressed={network ? selected : undefined}
                  data-selected={selected}
                  data-highlighted={highlighted}
                  onFocus={() => {
                    network?.onInteraction?.('keyboard');
                    network?.onNodeHover(city.id);
                  }}
                  onBlur={() => network?.onNodeHover(null)}
                  onClick={() => {
                    network?.onInteraction?.('pointer');
                    network?.onNodeSelect(city.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      network?.onInteraction?.('keyboard');
                      network?.onNodeSelect(city.id);
                    }
                  }}
                  style={network ? { cursor: 'pointer' } : undefined}
                >
                  <title>{city.name}</title>
                  <path
                    d={`M${origin.point.x} ${origin.point.y} Q${(origin.point.x + city.point.x) / 2 + 24} ${Math.min(origin.point.y, city.point.y) - 50} ${city.point.x} ${city.point.y}`}
                    display={origin.point.visible ? undefined : 'none'}
                    stroke={
                      selected ? '#d6b783' : highlighted ? '#91c4d1' : '#759ba9'
                    }
                    strokeDasharray={city.isEcosystem ? '5 8' : undefined}
                    strokeOpacity={
                      network
                        ? selected
                          ? '.9'
                          : highlighted
                            ? '.72'
                            : '.16'
                        : '.6'
                    }
                  />
                  <circle
                    cx={city.point.x}
                    cy={city.point.y}
                    r={network ? (selected ? 10 : emphasized ? 9 : 7) : 3}
                    fill={selected ? '#d8b786' : '#b5cbd3'}
                  />
                  {network && selected && selectedUniversity ? (
                    selectedUniversity.logo ? (
                      <>
                        <rect
                          x={city.point.x + 14}
                          y={city.point.y - 41}
                          width="36"
                          height="26"
                          rx="4"
                          fill={
                            selectedUniversity.logoSurface === 'light'
                              ? '#f4f6f8'
                              : '#102331'
                          }
                          stroke="#a6c8d44d"
                          pointerEvents="none"
                        />
                        <image
                          href={selectedUniversity.logo}
                          x={city.point.x + 14}
                          y={city.point.y - 41}
                          width="36"
                          height="26"
                          preserveAspectRatio="xMidYMid meet"
                          pointerEvents="none"
                        />
                      </>
                    ) : (
                      <text
                        x={city.point.x + 16}
                        y={city.point.y - 24}
                        fill="#e4f3f6"
                        fontSize="8"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        {selectedUniversity.shortName}
                      </text>
                    )
                  ) : null}
                  {network ? (
                    <text
                      x={city.point.x + 14}
                      y={city.point.y + 5}
                      fill="#d9edf5"
                      fontSize={emphasized ? '16' : '10'}
                      opacity={emphasized ? 1 : 0.62}
                    >
                      {displayName}
                      {emphasized && displayUniversity ? (
                        <tspan
                          x={city.point.x + 14}
                          dy="15"
                          fill="#8fb4c2"
                          fontSize="10"
                        >
                          {universityLocation(displayUniversity, language)}
                        </tspan>
                      ) : null}
                    </text>
                  ) : null}
                </g>
              );
            })(),
          )}
        {origin.point.visible ? (
          <>
            <circle
              cx={origin.point.x}
              cy={origin.point.y}
              r="18"
              stroke="#caa780"
              strokeOpacity=".24"
            />
            <circle
              cx={origin.point.x}
              cy={origin.point.y}
              r="11"
              stroke="#caa780"
              strokeOpacity=".4"
            />
            <circle
              cx={origin.point.x}
              cy={origin.point.y}
              r="4.5"
              fill="#d5b391"
            />
          </>
        ) : null}
        {network && selectedOrigin && origin.point.visible ? (
          selectedOrigin.logo ? (
            <>
              <rect
                x={origin.point.x + 16}
                y={origin.point.y - 41}
                width="36"
                height="26"
                rx="4"
                fill={
                  selectedOrigin.logoSurface === 'light' ? '#f4f6f8' : '#102331'
                }
                stroke="#caa780"
                strokeOpacity=".64"
                pointerEvents="none"
              />
              <image
                href={selectedOrigin.logo}
                x={origin.point.x + 16}
                y={origin.point.y - 41}
                width="36"
                height="26"
                preserveAspectRatio="xMidYMid meet"
                pointerEvents="none"
              />
            </>
          ) : (
            <text
              x={origin.point.x + 18}
              y={origin.point.y - 24}
              fill="#e4f3f6"
              fontSize="8"
              fontWeight="600"
              pointerEvents="none"
            >
              {selectedOrigin.shortName}
            </text>
          )
        ) : null}
        {/* SVG hit target: native HTML button cannot be a child of SVG. */}
        {network && origin.point.visible && origin.universityIds.length > 0 && (
          <g
            role={network ? 'button' : undefined}
            tabIndex={0}
            data-node={origin.id}
            data-universities={origin.universityIds.join(',')}
            aria-label={
              selectedOrigin
                ? `Select ${universityName(selectedOrigin, 'en')} · ${universityLocation(selectedOrigin, 'en')}`
                : 'Select Chengdu universities'
            }
            onFocus={() => {
              network.onInteraction?.('keyboard');
              network.onNodeHover(origin.id);
            }}
            onBlur={() => network.onNodeHover(null)}
            onClick={() => {
              network.onInteraction?.('pointer');
              network.onNodeSelect(origin.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                network.onInteraction?.('keyboard');
                network.onNodeSelect(origin.id);
              }
            }}
          >
            <circle
              cx={origin.point.x}
              cy={origin.point.y}
              r="24"
              fill="transparent"
              style={{ cursor: 'pointer' }}
            />
          </g>
        )}
        <g fontFamily="ui-monospace, monospace">
          {origin.point.visible ? (
            <>
              <text
                x={origin.point.x - 178}
                y={origin.point.y - 15}
                fill="#d8edf2"
                fontSize="12"
              >
                {language === 'zh' ? '起点 // 成都' : 'ORIGIN // CHENGDU'}
              </text>
              <text
                x={origin.point.x - 178}
                y={origin.point.y + 2}
                fill="#7596a3"
                fontSize="8"
              >
                {language === 'zh'
                  ? '全球金融科技网络'
                  : 'GLOBAL FINTECH NETWORK'}
              </text>
            </>
          ) : null}
        </g>
      </svg>
      {selectedBadgeVisible && selectedUniversity ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `clamp(8px, ${selectedBadgeLeft}%, calc(100% - 244px))`,
            top: `clamp(8px, ${selectedBadgeTop}%, calc(100% - 60px))`,
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: 'min(244px, calc(100% - 16px))',
            padding: '5px 8px 5px 5px',
            boxSizing: 'border-box',
            color: '#edf6fa',
            background: '#07101ded',
            border: '1px solid #d3b17caa',
            borderRadius: 5,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: 12,
            lineHeight: 1.2,
            pointerEvents: 'none',
          }}
        >
          {selectedUniversity.logo ? (
            /* oxlint-disable next/no-img-element -- SVG fallback uses a bounded local Vite asset. */
            <img
              src={selectedUniversity.logo}
              alt=""
              width="36"
              height="30"
              style={{
                display: 'block',
                flex: '0 0 36px',
                width: 36,
                height: 30,
                padding: 3,
                boxSizing: 'border-box',
                objectFit: 'contain',
                background:
                  selectedUniversity.logoSurface === 'light'
                    ? '#f4f6f8'
                    : '#102331',
                border: '1px solid #a6c8d44d',
                borderRadius: 4,
              }}
            />
          ) : (
            /* oxlint-enable next/no-img-element */
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                flex: '0 0 36px',
                width: 36,
                minHeight: 30,
                padding: 3,
                boxSizing: 'border-box',
                color: '#e4f3f6',
                background: '#102331',
                border: '1px solid #a6c8d44d',
                borderRadius: 4,
                fontSize: 8,
                fontWeight: 600,
              }}
            >
              {selectedUniversity.shortName}
            </span>
          )}
          <span style={{ minWidth: 0 }}>
            <strong style={{ display: 'block', fontWeight: 600 }}>
              {universityName(selectedUniversity, language)}
            </strong>
            <small style={{ display: 'block', color: '#8fb4c2', fontSize: 10 }}>
              {universityLocation(selectedUniversity, language)}
            </small>
          </span>
        </div>
      ) : null}
    </div>
  );
}
