import { publicArchiveImages } from './archive-media';

export const recap2020PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2020-owner-'))
  .map((image) => image.id);
