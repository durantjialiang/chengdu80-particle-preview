import { publicArchiveImages } from './archive-media';

export const recap2023PhotoIds = publicArchiveImages
  .filter((image) => image.id.startsWith('cd80-2023-owner-'))
  .map((image) => image.id);
