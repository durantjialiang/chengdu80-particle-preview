import type { University } from './universities';

/** Regions used by the network explorer. The source of truth is the country
 * recorded on each university; no university-id list is maintained here. */
export const networkRegions = [
  'all',
  'asia',
  'europe',
  'north-america',
  'oceania',
] as const;

export type NetworkRegion = (typeof networkRegions)[number];

/** Country names are kept in the same form as content/universities.ts. */
export const networkRegionByCountry: Readonly<Record<string, NetworkRegion>> = {
  China: 'asia',
  'China · Hong Kong SAR': 'asia',
  Singapore: 'asia',
  Israel: 'asia',
  Switzerland: 'europe',
  France: 'europe',
  'United States': 'north-america',
  Canada: 'north-america',
  Australia: 'oceania',
};

export function regionForCountry(
  country: string,
): Exclude<NetworkRegion, 'all'> | null {
  const region = networkRegionByCountry[country];
  return region === 'all' || !region ? null : region;
}

export function regionForUniversity(
  university: Pick<University, 'country'>,
): Exclude<NetworkRegion, 'all'> | null {
  return regionForCountry(university.country);
}

/** A preferred representative makes a region click useful while the data
 * filter still decides whether that university is available in the selected
 * edition/search result. */
export const regionRepresentativeIds = {
  asia: 'nus',
  europe: 'eth',
  'north-america': 'toronto',
  oceania: 'unsw',
} as const;
