import { publicArchiveImages } from './archive-media';

export const recap2019PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2019-owner-'))
  .map((image) => image.id);
