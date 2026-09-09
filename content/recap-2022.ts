import { publicArchiveImages } from './archive-media';

export const recap2022PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2022-owner-'))
  .map((image) => image.id);
