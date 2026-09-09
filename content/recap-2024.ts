import { publicArchiveImages } from './archive-media';
import { bilingual as b } from './competition';

export const recap2024PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2024-owner-'))
  .map((image) => image.id);

export const recap2024Video = {
  title: b('Chengdu 80 · 2024 highlights', '成都八零 · 2024精彩回顾'),
  description: b(
    'A 90-second photo film: conversations, team moments and the awards ceremony from the seventh Chengdu 80.',
    '用90秒照片短片，重温第七届成都八零的现场交流、团队风采与颁奖时刻。',
  ),
  src: '/videos/chengdu80-2024-highlights-v3-stable-en.mp4',
  poster: '/videos/chengdu80-2024-highlights-v2-en-poster.jpg',
  durationSeconds: 90,
  captions: {
    en: '/videos/chengdu80-2024-highlights-v2-en.vtt',
  },
};
