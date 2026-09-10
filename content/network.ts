import { documentedUniversities, type UniversityId } from './universities';
export {
  universities,
  documentedUniversities,
  getUniversity,
  networkNotice,
  relationshipLabels,
} from './universities';
export type {
  University,
  UniversityId,
  RelationshipType,
} from './universities';
export type CityNode = {
  id: UniversityId;
  /** Stable grouping key; university IDs and campus coordinates remain separate. */
  cityId?: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  isOrigin: boolean;
  isEcosystem: boolean;
  showOnLowPower: boolean;
  universityIds: readonly UniversityId[];
};
// No second geographic registry: all nodes, including the SWUFE hub, use university records.
export const globeNodes: readonly CityNode[] = documentedUniversities.map(
  (university) => ({
    id: university.id,
    name: university.shortName,
    city: university.city,
    latitude: university.latitude,
    longitude: university.longitude,
    isOrigin: university.id === 'swufe',
    isEcosystem: ['ecosystem', 'academic'].includes(
      university.relationshipType,
    ),
    showOnLowPower: [
      'swufe',
      'nus',
      'hku',
      'queens',
      'eth',
      'berkeley',
      'uchicago',
      'ucsd',
    ].includes(university.id),
    universityIds: [university.id],
  }),
);
