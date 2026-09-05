export type UniversityId = 'nus' | 'hku' | 'tsinghua' | 'queens';
export type CityNode = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isOrigin: boolean;
  showOnLowPower: boolean;
  universityIds: readonly UniversityId[];
};
export type University = {
  id: UniversityId;
  name: string;
  shortName: string;
  mark: string;
  location: string;
  cityId: string;
  editions: readonly number[];
  sourceUrl: string;
};

// Historical participation only. Never infer a confirmed 2026 invitation or partnership.
export const universities: readonly University[] = [
  {
    id: 'nus',
    name: 'National University of Singapore',
    shortName: 'NUS',
    mark: 'NUS',
    location: 'Singapore',
    cityId: 'singapore',
    editions: [2018, 2020, 2023],
    sourceUrl: 'https://www.comp.nus.edu.sg/news/2020-chengdu80-win/',
  },
  {
    id: 'hku',
    name: 'The University of Hong Kong',
    shortName: 'HKU',
    mark: 'HKU',
    location: 'Hong Kong',
    cityId: 'hong-kong',
    editions: [2019, 2023],
    sourceUrl:
      'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
  },
  {
    id: 'tsinghua',
    name: 'Tsinghua University',
    shortName: 'Tsinghua',
    mark: 'THU',
    location: 'Beijing, China',
    cityId: 'beijing',
    editions: [2021, 2022, 2023],
    sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
  },
  {
    id: 'queens',
    name: 'Queen’s University',
    shortName: 'Queen’s',
    mark: 'Q',
    location: 'Kingston, Canada',
    cityId: 'kingston',
    editions: [2023, 2024],
    sourceUrl:
      'https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/',
  },
];

// Approximate city-centre coordinates for a decorative globe, not campus geolocation.
const locations = [
  {
    id: 'chengdu',
    name: 'Chengdu',
    latitude: 30.5728,
    longitude: 104.0668,
    isOrigin: true,
    showOnLowPower: true,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    isOrigin: false,
    showOnLowPower: true,
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    latitude: 22.3193,
    longitude: 114.1694,
    isOrigin: false,
    showOnLowPower: false,
  },
  {
    id: 'beijing',
    name: 'Beijing',
    latitude: 39.9042,
    longitude: 116.4074,
    isOrigin: false,
    showOnLowPower: false,
  },
  {
    id: 'kingston',
    name: 'Kingston',
    latitude: 44.2312,
    longitude: -76.486,
    isOrigin: false,
    showOnLowPower: true,
  },
] as const;

// The Hero and Global Network page consume these exact same records.
export const globeNodes: readonly CityNode[] = locations.map((location) => ({
  ...location,
  universityIds: universities
    .filter((university) => university.cityId === location.id)
    .map((university) => university.id),
}));

export function getUniversity(id: UniversityId): University {
  const university = universities.find((record) => record.id === id);
  if (!university) throw new Error(`Unknown university: ${id}`);
  return university;
}

export const networkNotice =
  'A selection of universities represented in documented editions. Historical participation does not imply a confirmed place in the 2026 competition.';
