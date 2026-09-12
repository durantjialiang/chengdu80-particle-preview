import { bilingual as b, type Localized } from './competition';
import { academicInstitutionForUniversity } from './academic-institutions';
import type { University } from './universities';

/** Historical relationships are cumulative, not a current competition roster. */
export function universityRelationships(university: University) {
  const labels: { id: string; label: Localized }[] = [];
  if (university.relationshipType === 'organizer')
    labels.push({ id: 'host', label: b('Competition host', '赛事主办高校') });
  if (university.participationYears.length)
    labels.push({
      id: 'participant',
      label: b('Past competing university', '历届参赛高校'),
    });
  if (university.id === 'swufe' || university.id === 'berkeley')
    labels.push({
      id: 'forum',
      label:
        university.id === 'berkeley'
          ? b('Forum collaborator · CDAR', '论坛合作单位 · CDAR')
          : b('Forum collaborator', '论坛合作单位'),
    });
  if (academicInstitutionForUniversity(university.id))
    labels.push({
      id: 'visitor',
      label: b('Visiting scholar affiliation', '来访学者所属高校'),
    });
  return labels;
}
