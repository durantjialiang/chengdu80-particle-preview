import {
  universities,
  universityConnectionYears,
  type UniversityId,
} from '@/content/universities';
import { editions, projects, sources } from '@/content/archive';
import { publicArchiveImages } from '@/content/archive-media';
import type { CityNode } from '@/content/network';
import { universityName, universityLocation } from '@/content/university-i18n';
import {
  networkRegions,
  regionForUniversity,
  regionRepresentativeIds,
  type NetworkRegion,
} from '@/content/network-regions';

export type NetworkYear =
  | 'all'
  | 2018
  | 2019
  | 2020
  | 2021
  | 2022
  | 2023
  | 2024
  | 2025
  | 2026;
export const networkYears: readonly NetworkYear[] = [
  'all',
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
  2026,
];
export type NetworkView = {
  year: NetworkYear;
  region: NetworkRegion;
  query: string;
  selectedId: UniversityId;
};
export function filterUniversities(
  year: NetworkYear,
  query = '',
  region: NetworkRegion = 'all',
) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return universities.filter(
    (u) =>
      (year === 'all' || universityConnectionYears(u).includes(year)) &&
      (region === 'all' || regionForUniversity(u) === region) &&
      terms.every((term) =>
        [
          u.name,
          u.shortName,
          u.city,
          u.country,
          universityName(u, 'zh'),
          universityLocation(u, 'zh'),
        ]
          .join(' ')
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}
/** Filter first, group second. The hub is geographic context, not an extra participant. */
export function explorerNodes(
  filtered: readonly (typeof universities)[number][],
  year: NetworkYear = 'all',
): readonly CityNode[] {
  const groups = new Map<string, (typeof universities)[number][]>();
  for (const u of filtered) {
    const key = `${u.country}:${u.city}`;
    groups.set(key, [...(groups.get(key) ?? []), u]);
  }
  const hub = universities.find((u) => u.id === 'swufe')!;
  const nodes: CityNode[] = [...groups.values()].map((members) => {
    const isOrigin = members.some((u) => u.id === hub.id);
    const pin = isOrigin ? hub : members[0];
    return {
      id: pin.id,
      cityId: `${pin.country}:${pin.city}`,
      name: members.length > 1 ? pin.city : members[0].shortName,
      city: pin.city,
      latitude: pin.latitude,
      longitude: pin.longitude,
      isOrigin,
      isEcosystem: members.every((u) =>
        year === 'all'
          ? ['ecosystem', 'academic'].includes(u.relationshipType)
          : !u.participationYears.includes(year),
      ),
      showOnLowPower: true,
      universityIds: members.map((u) => u.id),
    };
  });
  if (!nodes.some((n) => n.isOrigin))
    nodes.unshift({
      id: hub.id,
      cityId: `${hub.country}:${hub.city}`,
      name: 'CHENGDU',
      city: hub.city,
      latitude: hub.latitude,
      longitude: hub.longitude,
      isOrigin: true,
      isEcosystem: false,
      showOnLowPower: true,
      universityIds: [],
    });
  return nodes;
}
export function readNetworkView(search: string): NetworkView {
  const params = new URLSearchParams(search);
  const candidate = Number(params.get('year'));
  const regionCandidate = params.get('region');
  return {
    year: networkYears.includes(candidate as NetworkYear)
      ? (candidate as NetworkYear)
      : 'all',
    region: networkRegions.includes(regionCandidate as NetworkRegion)
      ? (regionCandidate as NetworkRegion)
      : 'all',
    query: (params.get('query') ?? params.get('q') ?? '').trim(),
    selectedId:
      universities.find((u) => u.id === params.get('university'))?.id ??
      'swufe',
  };
}
export function networkViewUrl(current: string, view: NetworkView) {
  const url = new URL(current);
  if (view.year === 'all') url.searchParams.delete('year');
  else url.searchParams.set('year', String(view.year));
  const region = view.region ?? 'all';
  const query = view.query ?? '';
  if (region === 'all') url.searchParams.delete('region');
  else url.searchParams.set('region', region);
  if (query.trim()) url.searchParams.set('query', query.trim());
  else {
    url.searchParams.delete('query');
    url.searchParams.delete('q');
  }
  url.searchParams.set('university', view.selectedId);
  return url.pathname + url.search + url.hash;
}
export function regionFocusUniversity(
  region: NetworkRegion,
  candidates: readonly (typeof universities)[number][],
  fallbackCandidates: readonly (typeof universities)[number][] = universities,
): UniversityId | null {
  if (region === 'all')
    return candidates[0]?.id ?? fallbackCandidates[0]?.id ?? null;
  const preferred = regionRepresentativeIds[region];
  return (
    candidates.find((university) => university.id === preferred)?.id ??
    candidates[0]?.id ??
    fallbackCandidates.find((university) => university.id === preferred)?.id ??
    fallbackCandidates.find(
      (university) => regionForUniversity(university) === region,
    )?.id ??
    null
  );
}
// Per-edition mode, not a claim that every team travelled to Chengdu.
// Source: supplied network research, booklet PDF pp44/54 and the 2022 official recap.
export function participationMode(id: UniversityId, year: NetworkYear) {
  const university = universities.find((u) => u.id === id)!;
  if (year === 'all' || !university.participationYears.includes(year))
    return 'unknown';
  if (year === 2020) return 'online';
  if (year === 2021)
    return ['tsinghua', 'swufe', 'uestc', 'cqu'].includes(id)
      ? 'onsite'
      : 'online';
  if (year === 2022)
    return ['uestc', 'sustech', 'swufe'].includes(id) ? 'onsite' : 'online';
  return 'unknown';
}
export function universitySpotlight(id: UniversityId, year: NetworkYear) {
  const university = universities.find((u) => u.id === id)!;
  const hasRecord =
    year === 'all' || universityConnectionYears(university).includes(year);
  const hasParticipation =
    year === 'all'
      ? university.participationYears.length > 0
      : university.participationYears.includes(year);
  const selectedProjects = hasParticipation
    ? projects
        .filter(
          (p) => p.universityId === id && (year === 'all' || p.year === year),
        )
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    : [];
  const teamPhotos = hasParticipation
    ? publicArchiveImages
        .filter(
          (image) =>
            image.universityId === id &&
            image.imageType === 'team-photo' &&
            (year === 'all' || image.eventYear === year),
        )
        .sort((a, b) => b.eventYear - a.eventYear)
    : [];
  const awards = hasParticipation
    ? editions
        .filter((e) => year === 'all' || e.year === year)
        .flatMap((e) =>
          (e.awardResults ?? [])
            .filter((a) => a.universityIds.includes(id))
            .map((a) => ({
              ...a,
              year: e.year,
              sourceUrl: sources[a.sourceRef].url,
            })),
        )
        .sort((a, b) => b.year - a.year)
    : [];
  // Public event photographs never inherit the selected university's identity.
  const eventPhotos =
    year === 'all'
      ? []
      : publicArchiveImages
          .filter(
            (image) =>
              image.eventYear === year &&
              image.universityId === null &&
              image.projectId === null,
          )
          .slice(0, 3);
  return {
    university,
    hasRecord,
    hasParticipation,
    projects: selectedProjects,
    teamPhoto: teamPhotos[0] ?? null,
    awards,
    eventPhotos,
    mode: participationMode(id, year),
  };
}
