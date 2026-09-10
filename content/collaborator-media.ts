import approvedImages from './collaborator-media-approved.json';
import { isPubliclyUsable, type ArchiveImage } from './archive-media';

// Forum photographs have their own collection; competition-year albums stay separate.
export const collaboratorImages = approvedImages as readonly ArchiveImage[];
export const publicCollaboratorImages =
  collaboratorImages.filter(isPubliclyUsable);
