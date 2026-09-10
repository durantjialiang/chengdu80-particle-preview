import { publicArchiveImages } from './archive-media';

export const recap2021PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2021-owner-'))
  .map((image) => image.id);
