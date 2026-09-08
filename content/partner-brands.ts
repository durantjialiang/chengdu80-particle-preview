import { bilingual as b } from './competition';

/** Reuse approved identities without changing the recorded co-host relationships. */
export const hostBrandProfiles = {
  swufe: {
    website: 'https://www.swufe.edu.cn/',
    usageStatus: 'project-owner-confirmed',
    logo: {
      src: '/university-logos/swufe-logo.png',
      width: 245,
      height: 180,
      surface: 'dark',
      sourcePage: 'https://www.swufe.edu.cn/',
      reusedFrom: 'content/universities.ts',
      sha256:
        '5d94838bd453e6c7684619a58c7855f677ab411b1669da494c816699c82f1da9',
    },
  },
  jiaozi: {
    website: 'https://www.cdjzjk.com/',
    usageStatus: 'project-owner-confirmed',
    logo: {
      src: '/partner-logos/chengdu-jiaozi.png',
      width: 376,
      height: 50,
      surface: 'dark',
      sourcePage: 'https://www.cdjzjk.com/',
      originalImageUrl: 'https://www.cdjzjk.com/_nuxt/logo-b.Br5iWYEW.png',
      sha256:
        'b297a8b33d84ec30e8e17c61a9745e32b9feb362cf456e32d9392153c4c145b7',
    },
  },
} as const;

/**
 * Official, unmodified identifying marks for documented historical co-hosts.
 * Project owner confirmed permission for the new site AND public preview on
 * 2026-09-07. This is not evidence of a current appointment or endorsement.
 * Keep original marks, clear space, proportions and colors intact.
 */
export const partnerBrandProfiles = [
  {
    id: 'cdar',
    title: b('UC Berkeley CDAR', '加州大学伯克利分校 CDAR'),
    descriptor: b(
      'Consortium for Data Analytics in Risk',
      '国际风险数据分析联盟',
    ),
    website: 'https://cdar.econ.berkeley.edu/',
    years: [2019, 2020, 2021],
    usageStatus: 'project-owner-confirmed',
    permissionConfirmedOn: '2026-09-07',
    logo: {
      src: '/partner-logos/cdar.png',
      width: 291,
      height: 151,
      sourcePage: 'https://cdar.econ.berkeley.edu/',
      originalImageUrl:
        'https://cdar.econ.berkeley.edu/sites/default/files/styles/panopoly_image_original/public/general/cdar_2_logo.png%3Fitok=WoRVIkI4%26timestamp=1580499629',
      sha256:
        '8ea7a078aa131d57dfcfd75fe89780c747cf0132af42eb8d64985aa1fb8f06d5',
    },
  },
  {
    id: 'stateStreet',
    title: b('State Street', '美国道富银行'),
    descriptor: b('State Street Bank', 'State Street Bank'),
    website: 'https://www.statestreet.com/us/en/about',
    years: [2019],
    usageStatus: 'project-owner-confirmed',
    permissionConfirmedOn: '2026-09-07',
    logo: {
      src: '/partner-logos/state-street.svg',
      width: 576,
      height: 158,
      sourcePage: 'https://www.statestreet.com/us/en/about',
      originalImageUrl:
        'https://www.statestreet.com/web/Homepage/images/state-street-logo-final.svg',
      sha256:
        '4b8f52fe7557ab0749b292981b771f0e27f752a8e352193ef72699da0c1abec9',
    },
  },
] as const;
