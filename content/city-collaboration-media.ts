import { isPubliclyUsable, type ArchiveImage } from './archive-media';
import { bilingual as b } from './competition';

/** Separate from competition albums: forum and district meetings are not contest photos. */
const permission: ArchiveImage['permission'] = {
  newWebsite: true,
  publicPreview: true,
  basis: 'project-owner-confirmation',
  confirmedAt: '2026-09-08',
  evidenceRef: 'docs/city-collaboration.md#photo-authorization-2026-09-08',
};

export const cityCollaborationImages: readonly ArchiveImage[] = [
  {
    id: 'city-forum-2022',
    albumId: 'international-fintech-forum-2022',
    sourcePage: 'https://fic.swufe.edu.cn/info/1027/1003.htm',
    originalImageUrl:
      'https://fic.swufe.edu.cn/__local/7/80/F6/2ED81D42B6EC68E73251D7EA3B1_27965F16_1CC6A.jpg?e=.jpg',
    eventYear: 2022,
    caption: b(
      'The 2022 International Fintech Forum, co-hosted by SWUFE, Wenjiang District and the municipal financial regulator.',
      '2022国际金融科技论坛现场，由西财、温江区政府与市金融监管局联合主办。',
    ),
    universityId: null,
    projectId: null,
    imageType: 'event-recap',
    photographer: null,
    credit: '西南财经大学金融科技国际联合实验室 / SWUFE FIC',
    usageStatus: 'approved',
    permission,
    localAssetPath: '/history-media/city-forum-2022-full.webp',
    thumbnailPath: '/history-media/city-forum-2022-thumb.webp',
    width: 1080,
    height: 720,
  },
  {
    id: 'city-forum-2023',
    albumId: 'international-fintech-forum-2023',
    sourcePage: 'https://www.swufe.edu.cn/info/1048/23202.htm',
    originalImageUrl:
      'https://www.swufe.edu.cn/__local/F/F0/76/7D23D978B901566790955A0BC60_F09FF387_3BFED.jpg?e=.jpg',
    eventYear: 2023,
    caption: b(
      'The 2023 International Fintech Forum, co-hosted by SWUFE, the municipal financial regulator and Wenjiang District.',
      '2023国际金融科技论坛现场，由西财、市金融监管局与温江区政府联合主办。',
    ),
    universityId: null,
    projectId: null,
    imageType: 'event-recap',
    photographer: null,
    credit: '西南财经大学 · 金融学院、中国金融研究院 / SWUFE',
    usageStatus: 'approved',
    permission,
    localAssetPath: '/history-media/city-forum-2023-full.webp',
    thumbnailPath: '/history-media/city-forum-2023-thumb.webp',
    width: 1262,
    height: 842,
  },
  {
    id: 'city-qingyang-2024',
    albumId: 'qingyang-swufe-collaboration-2024',
    sourcePage: 'https://www.swufe.edu.cn/info/1048/20632.htm',
    originalImageUrl:
      'https://www.swufe.edu.cn/__local/C/63/BB/123CBB0C0CDA81C977EF9AB948F_48562319_4287A.jpg?e=.jpg',
    eventYear: 2024,
    caption: b(
      'The Qingyang district delegation and SWUFE at their school–district cooperation meeting on 6 June 2024.',
      '2024年6月6日，青羊区代表与西南财经大学校地合作座谈现场。',
    ),
    universityId: null,
    projectId: null,
    imageType: 'event-recap',
    photographer: null,
    credit: '西南财经大学 · 国内合作与发展处 / SWUFE',
    usageStatus: 'approved',
    permission,
    localAssetPath: '/history-media/city-qingyang-2024-full.webp',
    thumbnailPath: '/history-media/city-qingyang-2024-thumb.webp',
    width: 1600,
    height: 1066,
  },
  {
    id: 'city-financial-office-2024',
    albumId: 'chengdu80-financial-work-office-2024',
    sourcePage: 'https://news.swufe.edu.cn/info/1003/109791.htm',
    originalImageUrl:
      'https://news.swufe.edu.cn/__local/7/FC/1C/DC6395BAFB3DC308D2EB62EE7E5_9A8AB042_309B3.jpg',
    eventYear: 2024,
    caption: b(
      'Liang Qizhou, then Executive Deputy Director of the Office of the Chengdu Municipal Financial Work Commission, addresses the seventh Chengdu 80 on 30 October 2024.',
      '2024年10月30日，时任中共成都市委金融工作委员会办公室常务副主任梁其洲在第七届成都八零致辞。',
    ),
    universityId: null,
    projectId: null,
    imageType: 'speech',
    photographer: null,
    credit: '西南财经大学新闻网 / SWUFE News',
    usageStatus: 'approved',
    permission,
    localAssetPath: '/history-media/city-financial-office-2024-full.webp',
    thumbnailPath: '/history-media/city-financial-office-2024-thumb.webp',
    width: 1800,
    height: 1200,
  },
];

export const publicCityImages =
  cityCollaborationImages.filter(isPubliclyUsable);
