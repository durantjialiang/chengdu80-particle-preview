import { bilingual as b, type Localized } from './competition';
import {
  collaborators,
  type SpeechVideoLinks,
} from './collaborators';

export type VideoLibraryItem = {
  id: string;
  year: Localized;
  title: Localized;
  description: Localized;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  durationSeconds: number;
  links: SpeechVideoLinks;
  /** Editorial provenance retained with the item for future media audits. */
  provenance: Localized;
};

function collaboratorVideos(id: string): SpeechVideoLinks {
  const person = collaborators.find((item) => item.id === id);
  if (!person?.speechVideos) {
    throw new Error(`Missing speech-video links for collaborator: ${id}`);
  }
  return person.speechVideos;
}

const bilibiliProvenance = b(
  'Video URL supplied by the project owner; title and poster confirmed through the Bilibili API on 15 September 2026.',
  '视频链接由项目负责人提供；标题与封面经B站API于2026年9月15日确认。',
);

// The four Bilibili URLs were supplied by the project owner. Bilibili API
// responses confirmed the titles, posters and durations on 2026-09-15.
// YouTube and X links remain null until their uploads are available.
export const videoLibrary: readonly VideoLibraryItem[] = [
  {
    id: 'hansen-forum',
    year: b('Forum highlights', '论坛回顾'),
    title: b(
      'Nobel laureate and financial technology | International FinTech Forum',
      '诺奖学者与金融科技｜国际金融科技论坛回顾',
    ),
    description: b(
      'Academic talks and exchanges at the International FinTech Forum.',
      '国际金融科技论坛的学术分享与交流影像。',
    ),
    poster: '/video-posters/hansen-forum.jpg',
    posterWidth: 1920,
    posterHeight: 1080,
    durationSeconds: 231,
    links: collaboratorVideos('lars-peter-hansen'),
    provenance: bilibiliProvenance,
  },
  {
    id: 'anderson-forum',
    year: b('2019', '2019'),
    title: b(
      'Robert M. Anderson | 2019 International FinTech Forum',
      'Robert Anderson｜2019国际金融科技论坛现场',
    ),
    description: b(
      'Remarks and forum moments from the 2019 International FinTech Forum.',
      '2019年论坛现场发言与会场片段。',
    ),
    poster: '/video-posters/anderson-forum.jpg',
    posterWidth: 1280,
    posterHeight: 720,
    durationSeconds: 324,
    links: collaboratorVideos('robert-anderson'),
    provenance: bilibiliProvenance,
  },
  {
    id: 'behind-the-scenes',
    year: b('Documentary', '赛事专题'),
    title: b(
      'Inside Chengdu 80: Financial Technology Innovation Behind the Scenes | FIC',
      '走进成都八零：金融科技创新的台前幕后｜《发现者》专题｜FIC',
    ),
    description: b(
      'A look at teams, collaboration and project showcases behind the competition.',
      '从团队备赛、协作到项目展示，回看赛事背后的工作。',
    ),
    poster: '/video-posters/behind-the-scenes.jpg',
    posterWidth: 1920,
    posterHeight: 1080,
    durationSeconds: 901,
    links: {
      bilibili: 'https://www.bilibili.com/video/BV13Fen6YEXj/',
      youtube: null,
      x: null,
    },
    provenance: bilibiliProvenance,
  },
  {
    id: 'chengdu80-2018-2021',
    year: b('2018–2021', '2018—2021'),
    title: b(
      'Chengdu 80, 2018–2021: A retrospective',
      '2018—2021成都80回顾',
    ),
    description: b(
      'A visual retrospective of Chengdu 80 teams, demos and exchanges from 2018 to 2021.',
      '回看2018—2021年成都八零的团队协作、路演与展示。',
    ),
    poster: '/video-posters/chengdu80-2018-2021.jpg',
    posterWidth: 1920,
    posterHeight: 1080,
    durationSeconds: 241,
    links: {
      bilibili: 'https://www.bilibili.com/video/BV1UUen6fEgd/',
      youtube: null,
      x: null,
    },
    provenance: bilibiliProvenance,
  },
];
