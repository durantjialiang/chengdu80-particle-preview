/** Shared by Hero, explorer and cards. Historical records are not a 2026 roster.
 * Coordinates are approximate campus pins for an illustrative map, not surveyed boundaries.
 */
import { academicInstitutionForUniversity } from './academic-institutions';
import {
  confirmed2024Awards,
  confirmed2019Awards,
  edition2024Source,
  bookletAwardsByYear,
  anniversarySource,
} from './history-evidence';
export type RelationshipType =
  | 'participant'
  | 'winner'
  | 'organizer'
  | 'academic'
  | 'ecosystem';
export type UniversityId =
  | 'swufe'
  | 'tsinghua'
  | 'pku'
  | 'sjtu'
  | 'uestc'
  | 'sustech'
  | 'cqu'
  | 'hku'
  | 'nus'
  | 'berkeley'
  | 'uchicago'
  | 'ucsd'
  | 'gatech'
  | 'toronto'
  | 'queens'
  | 'eth'
  | 'uzh'
  | 'tau'
  | 'emlyon'
  | 'unsw';
export type Evidence = { title: string; url: string; years: readonly number[] };
export type Achievement = {
  year: number | null;
  reportedYear?: number;
  name: string;
  sourceUrl: string;
  projectId?: string;
};
export type University = {
  id: UniversityId;
  name: string;
  shortName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  logo: string | null;
  website: string;
  participationYears: readonly number[];
  awards: readonly Achievement[];
  projects: readonly Achievement[];
  relationshipType: RelationshipType;
  verification: 'documented' | 'pending';
  evidence: readonly Evidence[];
  recordNote: string;
  recordNoteZh?: string;
  logoSource?: string;
  logoSurface?: 'dark' | 'light';
};
export const universitySources = {
  history: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
  edition2021: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
  edition2022: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
  edition2023: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
  nus2020: 'https://www.comp.nus.edu.sg/news/2020-chengdu80-win/',
  berkeley2018: 'https://cd80.swufe.edu.cn/info/1081/1051.htm',
  nus2019Computing: 'https://www.comp.nus.edu.sg/news/2019-chengdu80/',
  nus2023Computing:
    'https://www.comp.nus.edu.sg/bytes/2023-chengdu80-global-fintech-competition/',
  hku2023:
    'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
  queens2024:
    'https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/',
  booklet:
    'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
  about: 'https://cd80.swufe.edu.cn/ABOUT.htm',
  nus2018: 'https://www.comp.nus.edu.sg/news/2018-chengdu-80-competition/',
  nus2019:
    'https://msba.nus.edu.sg/news/msba-students-win-first-runners-up-title-at-chengdu-80-fintech-competition-2019/',
  nus2023:
    'https://msba.nus.edu.sg/news/nus-msba-students-clinches-first-runner-up-at-fintech80-chengdu-hackathon/',
  emlyon: 'https://www.em-lyon.com.cn/news/view/530',
} as const;
const universityRecords: readonly University[] = [
  {
    id: 'swufe',
    name: 'Southwestern University of Finance and Economics',
    shortName: 'SWUFE',
    city: 'Chengdu',
    country: 'China',
    latitude: 30.688,
    longitude: 103.815,
    logo: '/university-logos/swufe-logo.png',
    website: 'https://www.swufe.edu.cn/',
    participationYears: [2018, 2019, 2020, 2021, 2022, 2023],
    awards: [
      {
        year: 2018,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2019,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2020,
        name: '领先者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2021,
        name: '领先者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2022,
        name: 'Leader Award',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
      },
    ],
    projects: [],
    relationshipType: 'organizer',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2018, 2019, 2020, 2021],
      },
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'Chengdu hub. SWUFE is a documented host. Participation years here refer to its university team, not every year it hosted.',
    logoSource: 'https://www.swufe.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'tsinghua',
    name: 'Tsinghua University',
    shortName: 'Tsinghua',
    city: 'Beijing',
    country: 'China',
    latitude: 40.003,
    longitude: 116.326,
    logo: '/university-logos/tsinghua-logo.png',
    website: 'https://www.tsinghua.edu.cn/',
    participationYears: [2018, 2019, 2020, 2021, 2022, 2023],
    awards: [
      {
        year: 2018,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2019,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2020,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2021,
        name: '开创者奖',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
      {
        year: 2022,
        name: '开创者奖',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
    ],
    projects: [
      {
        year: 2021,
        name: 'Panda',
        projectId: 'panda',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
      {
        year: 2022,
        name: 'Giraffe',
        projectId: 'giraffe',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
    ],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title: 'SWUFE historical participation and awards review',
        url: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
        years: [2021, 2022],
      },
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2018, 2019, 2020, 2021],
      },
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.tsinghua.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'pku',
    name: 'Peking University',
    shortName: 'Peking',
    city: 'Beijing',
    country: 'China',
    latitude: 39.992,
    longitude: 116.305,
    logo: '/university-logos/pku-logo.png',
    website: 'https://www.pku.edu.cn/',
    participationYears: [2018, 2019],
    awards: [
      {
        year: 2018,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2019,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'SWUFE historical participation and awards review',
        url: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
        years: [],
      },
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2018, 2019],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.pku.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'sjtu',
    name: 'Shanghai Jiao Tong University',
    shortName: 'SJTU',
    city: 'Shanghai',
    country: 'China',
    latitude: 31.025,
    longitude: 121.438,
    logo: '/university-logos/sjtu-logo-white.png',
    website: 'https://www.sjtu.edu.cn/',
    participationYears: [2019],
    awards: [
      {
        year: 2019,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2019],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.sjtu.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'uestc',
    name: 'University of Electronic Science and Technology of China',
    shortName: 'UESTC',
    city: 'Chengdu',
    country: 'China',
    latitude: 30.752,
    longitude: 103.924,
    logo: '/university-logos/uestc-logo.png',
    website: 'https://www.uestc.edu.cn/',
    participationYears: [2020, 2021, 2022, 2023],
    awards: [
      {
        year: 2020,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2021,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2022,
        name: 'Innovator Award',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2020, 2021],
      },
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.uestc.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'sustech',
    name: 'Southern University of Science and Technology',
    shortName: 'SUSTech',
    city: 'Shenzhen',
    country: 'China',
    latitude: 22.599,
    longitude: 113.999,
    logo: '/university-logos/sustech-logo-en.png',
    website: 'https://www.sustech.edu.cn/',
    participationYears: [2018, 2020, 2022, 2023],
    awards: [
      {
        year: 2018,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2020,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2022,
        name: 'Leader Award',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2018, 2020],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.sustech.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'cqu',
    name: 'Chongqing University',
    shortName: 'Chongqing',
    city: 'Chongqing',
    country: 'China',
    latitude: 29.563,
    longitude: 106.47,
    logo: '/university-logos/cqu-logo.png',
    website: 'https://www.cqu.edu.cn/',
    participationYears: [2020, 2021],
    awards: [
      {
        year: 2020,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
      {
        year: 2021,
        name: '创新者奖',
        sourceUrl:
          'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title:
          'Official fifth-anniversary booklet · awards table, printed pages 61–62',
        url: 'https://cd80.swufe.edu.cn/dfiles/14076/chengdoubalingwuzhounianzhuankan.pdf',
        years: [2020, 2021],
      },
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.cqu.edu.cn/',
    logoSurface: 'dark',
  },
  {
    id: 'hku',
    name: 'The University of Hong Kong',
    shortName: 'HKU',
    city: 'Hong Kong',
    country: 'China · Hong Kong SAR',
    latitude: 22.283,
    longitude: 114.137,
    logo: '/university-logos/hku.svg',
    website: 'https://www.hku.hk/',
    participationYears: [2019, 2021, 2022, 2023],
    awards: [
      {
        year: 2019,
        name: '开创者奖',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
      {
        year: 2021,
        name: 'Innovator Award',
        sourceUrl: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
      },
      {
        year: 2022,
        name: 'Innovator Award',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
      },
      {
        year: 2023,
        name: 'Pioneer Award',
        sourceUrl:
          'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
      },
    ],
    projects: [
      {
        year: 2019,
        name: 'Dragon Search',
        projectId: 'dragon-search',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
      {
        year: 2023,
        name: 'Apollo · team',
        projectId: 'apollo-2023',
        sourceUrl:
          'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
      },
    ],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title: 'SWUFE historical participation and awards review',
        url: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
        years: [2019],
      },
      {
        title: 'Official university competition report',
        url: 'https://www.cs.hku.hk/news-events/news-and-announcements/20231106-chengdu80-pioneer-award-2023',
        years: [2023],
      },
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.hku.hk/',
    logoSurface: 'light',
  },
  {
    id: 'nus',
    name: 'National University of Singapore',
    shortName: 'NUS',
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.296,
    longitude: 103.776,
    logo: '/university-logos/nus.jpg',
    website: 'https://www.nus.edu.sg/',
    participationYears: [2018, 2019, 2020, 2021, 2023],
    awards: [
      {
        year: 2018,
        name: '开创者奖',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
      {
        year: 2019,
        name: 'First runner-up · Pioneer Award',
        sourceUrl:
          'https://msba.nus.edu.sg/news/msba-students-win-first-runners-up-title-at-chengdu-80-fintech-competition-2019/',
      },
      {
        year: 2020,
        name: 'First place · Trailblazer Award',
        sourceUrl: 'https://www.comp.nus.edu.sg/news/2020-chengdu80-win/',
      },
      {
        year: 2021,
        name: 'Innovator Award',
        sourceUrl: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
      },
      {
        year: 2023,
        name: 'First runner-up',
        sourceUrl:
          'https://msba.nus.edu.sg/news/nus-msba-students-clinches-first-runner-up-at-fintech80-chengdu-hackathon/',
      },
    ],
    projects: [
      {
        year: 2018,
        name: 'NuShadow',
        projectId: 'nushadow',
        sourceUrl: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
      },
      {
        year: 2019,
        name: 'ProScope',
        projectId: 'proscope-2019',
        sourceUrl:
          'https://msba.nus.edu.sg/news/msba-students-win-first-runners-up-title-at-chengdu-80-fintech-competition-2019/',
      },
      {
        year: 2020,
        name: 'Pisces',
        projectId: 'pisces',
        sourceUrl: 'https://www.comp.nus.edu.sg/news/2020-chengdu80-win/',
      },
      {
        year: 2023,
        name: 'NUSight',
        projectId: 'nusight-2023',
        sourceUrl:
          'https://msba.nus.edu.sg/news/nus-msba-students-clinches-first-runner-up-at-fintech80-chengdu-hackathon/',
      },
    ],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title: 'SWUFE historical participation and awards review',
        url: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
        years: [2018, 2020],
      },
      {
        title: 'Official university competition report',
        url: 'https://www.comp.nus.edu.sg/news/2020-chengdu80-win/',
        years: [2020],
      },
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
      {
        title: 'NUS · 2018 competition report',
        url: 'https://www.comp.nus.edu.sg/news/2018-chengdu-80-competition/',
        years: [2018],
      },
      {
        title: 'NUS · 2019 first runner-up',
        url: 'https://msba.nus.edu.sg/news/msba-students-win-first-runners-up-title-at-chengdu-80-fintech-competition-2019/',
        years: [2019],
      },
      {
        title: 'NUS · 2023 first runner-up',
        url: 'https://msba.nus.edu.sg/news/nus-msba-students-clinches-first-runner-up-at-fintech80-chengdu-hackathon/',
        years: [2023],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.nus.edu.sg/',
    logoSurface: 'light',
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    shortName: 'UC Berkeley',
    city: 'Berkeley',
    country: 'United States',
    latitude: 37.872,
    longitude: -122.258,
    logo: '/university-logos/uc-berkeley.png',
    website: 'https://www.berkeley.edu/',
    participationYears: [2018, 2019, 2020],
    awards: [
      {
        year: 2019,
        name: 'Pioneer (2019 official recap wording)',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1071.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'SWUFE–CDAR 2021 forum · Robert M. Anderson keynote',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3386.htm',
        years: [2021],
      },
      {
        title: '2019 annual detail · Berkeley named below its team photograph',
        url: 'https://cd80.swufe.edu.cn/info/1031/1091.htm',
        years: [2019],
      },
      {
        title: '2019 official results · Berkeley, Pioneer (source wording)',
        url: 'https://cd80.swufe.edu.cn/info/1081/1071.htm',
        years: [2019],
      },
      {
        title: 'SWUFE historical participation and awards review',
        url: 'https://lab.swufe.edu.cn/info/1035/1020.htm',
        years: [],
      },
      {
        title: 'NUS · 2018 competition report',
        url: 'https://www.comp.nus.edu.sg/news/2018-chengdu-80-competition/',
        years: [2018],
      },
      {
        title: 'NUS · 2020 competitor record',
        url: 'https://www.comp.nus.edu.sg/news/2020-chengdu80-win/',
        years: [2020],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://brand.berkeley.edu/visual-identity/logos/',
    logoSurface: 'dark',
  },
  {
    id: 'uchicago',
    name: 'University of Chicago',
    shortName: 'UChicago',
    city: 'Chicago',
    country: 'United States',
    latitude: 41.7897,
    longitude: -87.5997,
    logo: '/university-logos/uchicago.svg',
    logoSource: 'https://creative.uchicago.edu/logos-and-identity-elements/',
    logoSurface: 'light',
    website: 'https://www.uchicago.edu/',
    participationYears: [],
    awards: [],
    projects: [],
    relationshipType: 'academic',
    verification: 'documented',
    evidence: [
      {
        title:
          '2019 SWUFE–CDAR International FinTech Forum · Lars Peter Hansen keynote',
        url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
        years: [2019],
      },
      {
        title: 'Chicago Booth · Lars Peter Hansen faculty profile',
        url: 'https://www.chicagobooth.edu/faculty/directory/h/lars-hansen',
        years: [],
      },
      {
        title:
          'UChicago official campus map · representative Hyde Park campus pin',
        url: 'https://maps.uchicago.edu/',
        years: [],
      },
    ],
    recordNote:
      'Lars Peter Hansen delivered a keynote at the 2019 SWUFE–CDAR forum alongside Chengdu 80. This record describes academic exchange; no university-team competition entry is inferred.',
    recordNoteZh:
      '汉森在与成都八零同期举行的2019 SWUFE–CDAR论坛发表主旨演讲。本条记录学术交流经历，不据此推定校队参赛。',
  },
  {
    id: 'ucsd',
    name: 'University of California San Diego',
    shortName: 'UC San Diego',
    city: 'San Diego',
    country: 'United States',
    latitude: 32.878353,
    longitude: -117.231842,
    logo: '/university-logos/ucsd.svg',
    logoSource: 'https://brand.ucsd.edu/logos/primary-campus-logo/index.html',
    logoSurface: 'light',
    website: 'https://www.ucsd.edu/',
    participationYears: [],
    awards: [],
    projects: [],
    relationshipType: 'academic',
    verification: 'documented',
    evidence: [
      {
        title:
          '2019 SWUFE–CDAR International FinTech Forum · Joel Sobel invited talk',
        url: 'https://cd80.swufe.edu.cn/info/1051/1121.htm',
        years: [2019],
      },
      {
        title: 'UC San Diego · Economics faculty directory',
        url: 'https://economics.ucsd.edu/faculty-and-research/faculty-profiles/index.html',
        years: [],
      },
      {
        title:
          'UC San Diego official directions · Central Campus Station landmark pin',
        url: 'https://ah.ucsd.edu/about/directions.html',
        years: [],
      },
    ],
    recordNote:
      'Joel Sobel was an invited speaker at the 2019 SWUFE–CDAR forum. This record describes academic exchange; no university-team competition entry is inferred.',
    recordNoteZh:
      '乔尔·索拜尔受邀参加2019 SWUFE–CDAR论坛。本条记录学术交流经历，不据此推定校队参赛。',
  },
  {
    id: 'gatech',
    name: 'Georgia Institute of Technology',
    shortName: 'Georgia Tech',
    city: 'Atlanta',
    country: 'United States',
    latitude: 33.775,
    longitude: -84.396,
    logo: '/university-logos/georgia-tech.svg',
    website: 'https://www.gatech.edu/',
    participationYears: [2018],
    awards: [],
    projects: [],
    relationshipType: 'participant',
    verification: 'documented',
    evidence: [
      {
        title: 'NUS · 2018 competition report',
        url: 'https://www.comp.nus.edu.sg/news/2018-chengdu-80-competition/',
        years: [2018],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.gatech.edu/',
    logoSurface: 'dark',
  },
  {
    id: 'toronto',
    name: 'University of Toronto',
    shortName: 'Toronto',
    city: 'Toronto',
    country: 'Canada',
    latitude: 43.662,
    longitude: -79.395,
    logo: '/university-logos/toronto.svg',
    website: 'https://www.utoronto.ca/',
    participationYears: [2019],
    awards: [
      {
        year: 2019,
        name: 'Innovator (2019 official recap wording)',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1071.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title:
          '2019 annual detail · University of Toronto named below its team photograph',
        url: 'https://cd80.swufe.edu.cn/info/1031/1091.htm',
        years: [2019],
      },
      {
        title: '2019 official results · Toronto, Innovator (source wording)',
        url: 'https://cd80.swufe.edu.cn/info/1081/1071.htm',
        years: [2019],
      },
      {
        title: 'Official Chengdu 80 historical university directory',
        url: 'https://cd80.swufe.edu.cn/ABOUT.htm',
        years: [],
      },
    ],
    recordNote:
      'The 2019 annual detail explicitly names Toronto; the later 2019 recap records Innovator using its English wording. Other individual participation years and project names remain unconfirmed.',
    recordNoteZh:
      '2019年度详情明确列出多伦多大学，独立回顾记载Innovator奖项，保留该英文原文而不套用其他年份的冲突翻译。其他具体参赛年份和产品专名仍未核实。',
    logoSource: 'https://www.utoronto.ca/',
    logoSurface: 'dark',
  },
  {
    id: 'queens',
    name: 'Queen’s University',
    shortName: 'Queen’s',
    city: 'Kingston',
    country: 'Canada',
    latitude: 44.226,
    longitude: -76.495,
    logo: '/university-logos/queens.svg',
    website: 'https://www.queensu.ca/',
    participationYears: [2022, 2023, 2024],
    awards: [
      {
        year: 2022,
        name: 'Innovator Award',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
      },
      {
        year: 2024,
        name: '开创者奖',
        sourceUrl: edition2024Source.url,
      },
    ],
    projects: [
      {
        year: 2024,
        name: 'Data Queens · team',
        projectId: 'data-queens-report',
        sourceUrl:
          'https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/',
        reportedYear: 2024,
      },
    ],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title: 'Official university competition report',
        url: 'https://www.cs.queensu.ca/news/2024/11/26/data-queens-brings-home-1st-place-trophy-from-the-fintech-hackathon-in-china/',
        years: [2024],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'SWUFE confirms Queen’s highest award in the 2024 seventh edition. The university team report is cross-linked by institution, award, insurance challenge and publication context; its body alone does not explicitly date the edition. The product name is not established.',
    recordNoteZh:
      '西财正式报道确认女王大学获2024第七届最高奖项。团队专文按学校、奖项、保险赛题与发表背景交叉关联，不能仅凭专文正文确定届次。产品专名仍未明确。',
    logoSource: 'https://www.queensu.ca/',
    logoSurface: 'dark',
  },
  {
    id: 'eth',
    name: 'ETH Zurich',
    shortName: 'ETH Zurich',
    city: 'Zurich',
    country: 'Switzerland',
    latitude: 47.376,
    longitude: 8.548,
    logo: '/university-logos/eth-zurich.svg',
    website: 'https://ethz.ch/',
    participationYears: [2022, 2023],
    awards: [
      {
        year: 2022,
        name: 'Innovator Award',
        sourceUrl: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'Official 2023 event recap',
        url: 'https://cd80.swufe.edu.cn/info/1081/1821.htm',
        years: [2023],
      },
      {
        title: 'Official fifth-edition recap · 2022',
        url: 'https://cd80.swufe.edu.cn/info/1081/1831.htm',
        years: [2022],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://ethz.ch/',
    logoSurface: 'light',
  },
  {
    id: 'uzh',
    name: 'University of Zurich',
    shortName: 'UZH',
    city: 'Zurich',
    country: 'Switzerland',
    latitude: 47.374,
    longitude: 8.55,
    logo: '/university-logos/university-of-zurich.svg',
    website: 'https://www.uzh.ch/',
    participationYears: [2021],
    awards: [
      {
        year: 2021,
        name: 'Leader Award',
        sourceUrl: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://www.uzh.ch/',
    logoSurface: 'light',
  },
  {
    id: 'tau',
    name: 'Tel Aviv University',
    shortName: 'Tel Aviv',
    city: 'Tel Aviv',
    country: 'Israel',
    latitude: 32.114,
    longitude: 34.804,
    logo: '/university-logos/tel-aviv-university.png',
    website: 'https://english.tau.ac.il/',
    participationYears: [2021],
    awards: [
      {
        year: 2021,
        name: 'Innovator Award',
        sourceUrl: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
      },
    ],
    projects: [],
    relationshipType: 'winner',
    verification: 'documented',
    evidence: [
      {
        title: 'SWUFE School of Finance · 2021 competition report',
        url: 'https://jinrong.swufe.edu.cn/info/1100/3387.htm',
        years: [2021],
      },
    ],
    recordNote:
      'Selected documented editions, not an exhaustive participation history.',
    logoSource: 'https://english.tau.ac.il/',
    logoSurface: 'light',
  },
  {
    id: 'emlyon',
    name: 'emlyon business school',
    shortName: 'emlyon',
    city: 'Lyon',
    country: 'France',
    latitude: 45.732,
    longitude: 4.836,
    logo: '/university-logos/emlyon-business-school.svg',
    website: 'https://em-lyon.com/',
    participationYears: [2022],
    awards: [],
    projects: [],
    relationshipType: 'participant',
    verification: 'documented',
    evidence: [
      {
        title:
          'Official booklet · PDF p.70 / printed p.63 · 2022 EMLYON Business School participant roster',
        url: universitySources.booklet,
        years: [2022],
      },
      {
        title: 'Official 2022 recap · Lyon School of Business online team',
        url: universitySources.edition2022,
        years: [2022],
      },
      {
        title: 'emlyon · joint fintech forum with SWUFE (2021)',
        url: 'https://www.em-lyon.com.cn/news/view/530',
        years: [],
      },
    ],
    recordNote:
      '2022 online participant: the official booklet explicitly pairs 法国里昂商学院 with EMLYON Business School, cross-checked against the event recap’s Lyon School of Business. No award or named project is established.',
    recordNoteZh:
      '2022线上参赛高校。专刊将“法国里昂商学院”与“EMLYON Business School”并列，和年度报道的“Lyon School of Business”交叉核对。尚未核实奖项或具名项目。',
    logoSource: 'https://em-lyon.com/',
    logoSurface: 'dark',
  },
  {
    id: 'unsw',
    name: 'University of New South Wales',
    shortName: 'UNSW',
    city: 'Sydney',
    country: 'Australia',
    latitude: -33.917689,
    longitude: 151.231022,
    logo: '/university-logos/unsw.png',
    logoSource: 'https://www.unsw.edu.au/',
    logoSurface: 'light',
    website: 'https://www.unsw.edu.au/',
    participationYears: [2020],
    awards: [],
    projects: [],
    relationshipType: 'participant',
    verification: 'documented',
    evidence: [
      {
        title:
          'Official booklet · PDF pp.42,44 / printed pp.35,37 · 2020 participant roster',
        url: universitySources.booklet,
        years: [2020],
      },
      {
        title: 'UNSW official name',
        url: 'https://www.unsw.edu.au/assurance-integrity/legal-compliance/access-to-information',
        years: [],
      },
      {
        title:
          'UNSW official Kensington campus map · representative map-centre pin',
        url: 'https://www.unsw.edu.au/maps/campus-maps',
        years: [],
      },
    ],
    recordNote:
      'The official booklet lists 新南威尔士大学 among the 2020 participants. No individual award or named project is established. The approximate pin follows the official Kensington campus map centre; logo reuse permission is not supplied.',
    recordNoteZh:
      '官方专刊明确列入2020参赛高校。尚未核实具体奖项或具名项目。地图节点采用官方Kensington主校区地图中心的近似坐标；本轮未取得标识复用许可，使用文字显示。',
  },
];
// One evidence-backed award registry feeds both the edition archive and campus records.
export const universities: readonly University[] = universityRecords.map(
  (original) => {
    // Fill only genuinely missing edition records from the shared award pages.
    // Do not normalize existing source-specific English award terminology.
    const additions = Object.entries({
      ...bookletAwardsByYear,
      2019: confirmed2019Awards,
    }).flatMap(([year, awards]) =>
      awards
        .filter(
          (a) =>
            a.universityIds.includes(original.id) &&
            !original.awards.some((existing) => existing.year === Number(year)),
        )
        .map((a) => ({
          year: Number(year),
          name: a.label.zh,
          sourceUrl: anniversarySource.url,
        })),
    );
    let university: University = additions.length
      ? {
          ...original,
          participationYears: [
            ...new Set([
              ...original.participationYears,
              ...additions.map((a) => a.year),
            ]),
          ].sort((a, b) => a - b),
          awards: [...original.awards, ...additions].sort(
            (a, b) => (a.year ?? 0) - (b.year ?? 0),
          ),
          evidence: [
            ...original.evidence,
            {
              title: anniversarySource.title.en,
              url: anniversarySource.url,
              years: additions.map((a) => a.year),
            },
          ],
          relationshipType:
            original.relationshipType === 'organizer' ? 'organizer' : 'winner',
        }
      : original;
    if (university.id === 'berkeley')
      university = {
        ...university,
        projects: [
          ...university.projects,
          {
            year: 2018,
            name: 'funder',
            projectId: 'funder-2018',
            sourceUrl: universitySources.berkeley2018,
          },
        ],
        evidence: [
          ...university.evidence,
          {
            title: 'Berkeley funder · 2018 project report',
            url: universitySources.berkeley2018,
            years: [2018],
          },
        ],
      };
    if (university.id === 'nus')
      university = {
        ...university,
        evidence: [
          ...university.evidence,
          {
            title: 'NUS Computing · ProScope',
            url: universitySources.nus2019Computing,
            years: [2019],
          },
          {
            title: 'NUS Computing · NUSight / NUS Finovators',
            url: universitySources.nus2023Computing,
            years: [2023],
          },
        ],
      };
    const result = confirmed2024Awards.find((award) =>
      award.universityIds.includes(university.id),
    );
    if (!result) return university;
    return {
      ...university,
      participationYears: [
        ...new Set([...university.participationYears, 2024]),
      ].sort((a, b) => a - b),
      awards: [
        ...university.awards.filter(
          (a) => !(a.year === 2024 && a.name === result.label.zh),
        ),
        { year: 2024, name: result.label.zh, sourceUrl: edition2024Source.url },
      ],
      evidence: [
        ...university.evidence,
        {
          title: edition2024Source.title.en,
          url: edition2024Source.url,
          years: [2024],
        },
      ],
      relationshipType:
        university.relationshipType === 'organizer' ? 'organizer' : 'winner',
    };
  },
);
export const relationshipLabels: Record<RelationshipType, string> = {
  organizer: 'Organizer',
  winner: 'Award recipient',
  participant: 'Participant',
  academic: 'Academic exchange',
  ecosystem: 'Ecosystem exchange',
};
/** Map filters include dated academic exchanges without adding competition entries. */
export const universityConnectionYears = (university: University) =>
  [
    ...new Set([
      ...university.participationYears,
      ...(academicInstitutionForUniversity(university.id)?.years ?? []),
    ]),
  ].sort((a, b) => a - b);
export const documentedUniversities = universities.filter(
  (u) => u.verification === 'documented',
);
export const networkNotice =
  'Selected source-linked historical records, not a confirmed 2026 roster or a complete archive. Pins show approximate campus locations. Dashed routes indicate wider SWUFE ecosystem exchanges, not confirmed Chengdu 80 participation.';
export function getUniversity(id: UniversityId): University {
  const university = universities.find((record) => record.id === id);
  if (!university) throw new Error(`Unknown university: ${id}`);
  return university;
}
