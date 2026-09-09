import { publicArchiveImages } from './archive-media';

export const recap2024PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2024-owner-'))
  .map((image) => image.id);
