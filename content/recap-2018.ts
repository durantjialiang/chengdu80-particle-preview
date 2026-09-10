import { publicArchiveImages } from './archive-media';

export const recap2018PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2018-owner-'))
  .map((image) => image.id);
