import { bilingual as b } from './competition';
import { partnerBrandProfiles } from './partner-brands';

/**
 * Institutions named in FIC's archived exchange/resource network. This is not
 * a competition sponsorship list or a confirmed 2026 appointment. Retain that
 * provenance in data rather than placing an audit paragraph on the cards.
 * Owner confirmed permission for all displayed marks and public publication
 * on 2026-09-07. This does not establish a sponsorship or a 2026 appointment.
 */
const additionalLogoPermission = {
  usageStatus: 'project-owner-confirmed',
  permissionConfirmedOn: '2026-09-07',
} as const;

const stateStreet = partnerBrandProfiles[1];

export const ficIndustry = [
  {
    id: 'pingAn',
    name: b('Ping An Group', '平安集团'),
    website: 'https://www.pingan.cn/index.shtml',
    ...additionalLogoPermission,
    logo: {
      src: '/partner-logos/ping-an.svg',
      width: 238,
      height: 38,
      sourcePage: 'https://www.pingan.cn/about/brand-spirit.shtml',
      originalImageUrl:
        'https://www.pingan.cn/app_series/pingancn/assets/img/logo_nav.svg',
      sha256:
        'e6c0d17f1a5f74edc8247c350d191aa8ccc75b38d64f6c61523e39986b6f4436',
    },
  },
  {
    id: 'ccb',
    name: b('China Construction Bank', '中国建设银行'),
    website: 'https://www.ccb.com/',
    ...additionalLogoPermission,
    logo: {
      src: '/partner-logos/ccb.png',
      width: 200,
      height: 40,
      sourcePage: 'https://en.ccb.com/en/home/indexv3.html',
      originalImageUrl:
        'https://image4.ccb.com/cn/home/company/v3/images/img/20150828_1440745919/20151201084052927594.png',
      sha256:
        'e0eb33430eb24b7844480172a7186181cf7a4d0cd393cb584137c0cefb6c43b6',
    },
  },
  {
    id: 'cic',
    name: b('China Investment Corporation', '中投公司'),
    website: 'https://www.china-inv.cn/chinainven/home/',
    ...additionalLogoPermission,
    logo: {
      src: '/partner-logos/cic.jpg',
      width: 400,
      height: 131,
      sourcePage: 'https://www.china-inv.cn/chinainven/home/',
      originalImageUrl:
        'https://www.china-inv.cn/chinainven/xhtml/images/public/logo.jpg',
      sha256:
        '47fbb5d62c9394842f6feb37759ed9fddc667c0d5b934d41b925faa04f410d66',
    },
  },
  {
    id: 'stateStreet',
    name: b('State Street Bank', '道富银行'),
    website: 'https://www.statestreet.com/us/en',
    usageStatus: stateStreet.usageStatus,
    permissionConfirmedOn: stateStreet.permissionConfirmedOn,
    logo: stateStreet.logo,
  },
  {
    id: 'swissRe',
    name: b('Swiss Re', '瑞士再保险'),
    website: 'https://www.swissre.com/',
    ...additionalLogoPermission,
    logo: {
      src: '/partner-logos/swiss-re.jpg',
      width: 5039,
      height: 1189,
      sourcePage: 'https://www.swissre.com/media/electronic-press-kit.html',
      originalImageUrl:
        'https://www.swissre.com/dam/jcr%3A677cb3f5-a53d-4bf3-bf91-8018afbaa59b/SR_Logo_CMYK_Lake.2024-03-14-11-57-00.jpg',
      sha256:
        '72ff60fd535b035c17ac140e0494798cd1281a462b4f696761d35c739ff5bff4',
    },
  },
  {
    id: 'moodys',
    name: b('Moody’s', '穆迪'),
    website: 'https://www.moodys.com/',
    ...additionalLogoPermission,
    logo: {
      src: '/partner-logos/moodys.png',
      width: 4086,
      height: 1129,
      sourcePage: 'https://www.moodys.com/web/en/us/media-relations.html',
      originalImageUrl:
        'https://www.moodys.com/web/en/us/site-assets/moodysmediakit.zip',
      originalArchiveEntry: "1. Moody's Logos/mdy_logo_rgb_MoodysBlue (1).png",
      sha256:
        '7433c714bd02fa38e3fcd0c5c6c9e85a063449f18a9d4d0a168436c041ebdb3a',
    },
  },
] as const;
