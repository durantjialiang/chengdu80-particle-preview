import { globeNodes } from '@/content/network';
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
  const focused = globeNodes.find((city) => city.id === network?.focusId);
  const nodes = globeNodes.map((city) => ({
    ...city,
    point: project(
      city.latitude,
      city.longitude,
      focused?.latitude,
      focused?.longitude,
    ),
  }));
  const origin = nodes.find((city) => city.isOrigin)!;
  return (
    <svg
      viewBox="0 0 800 700"
      width="100%"
      height="100%"
      fill="none"
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
        .map((city) => (
          <g
            key={city.id}
            role={network ? 'button' : undefined}
            tabIndex={network ? 0 : undefined}
            aria-label={network ? `Select ${city.name}` : undefined}
            onClick={() => network?.onNodeSelect(city.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                network?.onNodeSelect(city.id);
              }
            }}
            style={network ? { cursor: 'pointer' } : undefined}
          >
            <title>{city.name}</title>
            <path
              d={`M${origin.point.x} ${origin.point.y} Q${(origin.point.x + city.point.x) / 2 + 24} ${Math.min(origin.point.y, city.point.y) - 50} ${city.point.x} ${city.point.y}`}
              stroke="#86cadd"
              strokeDasharray={city.isEcosystem ? '5 8' : undefined}
              strokeOpacity={
                network && network.highlightedId !== city.id ? '.15' : '.6'
              }
            />
            <circle
              cx={city.point.x}
              cy={city.point.y}
              r={network ? 8 : 3}
              fill="#9acddc"
            />
            {network && city.id === network.highlightedId ? (
              <text
                x={city.point.x + 14}
                y={city.point.y + 5}
                fill="#d9edf5"
                fontSize="16"
              >
                {city.name}
              </text>
            ) : null}
          </g>
        ))}
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
      <circle cx={origin.point.x} cy={origin.point.y} r="4.5" fill="#d5b391" />
      <g fontFamily="ui-monospace, monospace">
        <text
          x={origin.point.x - 178}
          y={origin.point.y - 15}
          fill="#d8edf2"
          fontSize="12"
        >
          ORIGIN // CHENGDU
        </text>
        <text
          x={origin.point.x - 178}
          y={origin.point.y + 2}
          fill="#7596a3"
          fontSize="8"
        >
          GLOBAL FINTECH NETWORK
        </text>
      </g>
    </svg>
  );
}
