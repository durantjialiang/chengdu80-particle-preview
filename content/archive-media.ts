import type { Localized } from './competition';
import type { UniversityId } from './universities';
import approvedImages from './archive-media-approved.json';

export type ImageType =
  | 'event-recap'
  | 'event-group'
  | 'speech'
  | 'work-session'
  | 'team-photo'
  | 'award-ceremony'
  | 'product-interface'
  | 'challenge-document';
export type UsageStatus =
  | 'pending-permission'
  | 'approved'
  | 'restricted'
  | 'needs-replacement';
export type ArchiveImage = {
  id: string;
  albumId: string;
  sourcePage: string;
  originalImageUrl: string;
  eventYear: number;
  caption: Localized;
  universityId: UniversityId | null;
  projectId: string | null;
  imageType: ImageType;
  photographer: string | null;
  credit: string;
  usageStatus: UsageStatus;
  permission: {
    newWebsite: boolean;
    publicPreview: boolean;
    evidenceRef: string;
    basis?: 'project-owner-confirmation';
    confirmedAt?: string;
  } | null;
  localAssetPath: string | null;
  thumbnailPath: string | null;
  width: number;
  height: number;
  privateReview?: boolean;
};

/** Publication is opt-in per image, not inferred from an accessible source URL. */
export function isPubliclyUsable(image: ArchiveImage): boolean {
  const localPath = (value: string | null) =>
    Boolean(
      value &&
      /^\/history-media\/[a-z0-9/_-]+\.(webp|avif|png|jpe?g)$/i.test(value),
    );
  return (
    image.usageStatus === 'approved' &&
    !image.privateReview &&
    image.permission?.newWebsite === true &&
    image.permission.publicPreview === true &&
    Boolean(image.permission.evidenceRef.trim()) &&
    localPath(image.localAssetPath) &&
    localPath(image.thumbnailPath) &&
    Number.isFinite(image.width) &&
    Number.isFinite(image.height) &&
    image.width > 0 &&
    image.height > 0
  );
}

// The project owner approved these 13 sample-page photographs on 2026-09-06.
// This records that confirmation, not an independently issued publisher licence.
// Pending candidates and research originals remain outside the public checkout.
export const archiveImages = approvedImages as readonly ArchiveImage[];
export const publicArchiveImages = archiveImages.filter(isPubliclyUsable);
export const imageFit = (type: ImageType) =>
  type === 'event-recap' ? 'cover' : 'contain';
