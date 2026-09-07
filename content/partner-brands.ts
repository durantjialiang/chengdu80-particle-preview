import { bilingual as b } from './competition';

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
