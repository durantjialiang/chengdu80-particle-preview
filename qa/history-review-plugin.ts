import {
  createReadStream,
  existsSync,
  readFileSync,
  realpathSync,
  readdirSync,
} from 'node:fs';
import { resolve, sep } from 'node:path';
import type { Plugin } from 'vite';
import {
  publicArchiveImages,
  type ArchiveImage,
} from '../content/archive-media';

/** Fail closed if a pending/orphan photo is accidentally copied to the public media folder. */
export function checkPublicHistoryMedia(publicRoot: string) {
  const root = resolve(publicRoot, 'history-media');
  const allowed = new Set(
    publicArchiveImages.flatMap((image) => [
      image.localAssetPath!,
      image.thumbnailPath!,
    ]),
  );
  const walk = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error('History media cannot be a symlink');
      if (entry.isDirectory()) walk(path);
      else if (
        !allowed.has(
          '/history-media/' +
            path
              .slice(root.length + 1)
              .split(sep)
              .join('/'),
        )
      )
        throw new Error('History photo lacks an approved publication record');
    }
  };
  if (existsSync(root)) walk(root);
  for (const path of allowed) {
    const file = resolve(publicRoot, path.slice(1));
    if (!existsSync(file) || !realpathSync(file).startsWith(root + sep))
      throw new Error(
        'Approved history asset missing or outside public media folder',
      );
  }
}

export function historyPublicationGuard(): Plugin {
  return {
    name: 'history-publication-guard',
    apply: 'build',
    configResolved(config) {
      if (config.publicDir) checkPublicHistoryMedia(config.publicDir);
    },
  };
}

/** Explicit local-only review; pending images are never copied to public or a build. */
export function historyReviewPlugin(
  enabled: boolean,
  directory?: string,
): Plugin {
  const virtualId = 'virtual:history-review-media';
  const files = new Map<string, string>();
  let images: ArchiveImage[] = [];
  if (enabled && directory) {
    const root = realpathSync(directory);
    const manifest = resolve(root, 'review-media.json');
    if (existsSync(manifest)) {
      images = (
        JSON.parse(readFileSync(manifest, 'utf8')) as ArchiveImage[]
      ).map((image) => {
        if (!/^[a-z0-9-]+$/.test(image.id))
          throw new Error('Invalid review image ID');
        const route = (path: string | null, variant: string) => {
          if (!path) return null;
          const full = realpathSync(resolve(root, path));
          if (!full.startsWith(root + sep) || !full.endsWith('.webp'))
            throw new Error('Review asset outside allowlist');
          const url = `/_history-review/${image.id}/${variant}.webp`;
          if (files.has(url)) throw new Error('Duplicate review image ID');
          files.set(url, full);
          return url;
        };
        return {
          ...image,
          privateReview: true,
          localAssetPath: route(image.localAssetPath, 'full'),
          thumbnailPath: route(image.thumbnailPath, 'thumb'),
        };
      });
    }
  }
  return {
    name: 'local-history-review',
    resolveId(id) {
      if (id === virtualId) return '\0' + virtualId;
    },
    load(id) {
      if (id === '\0' + virtualId)
        return `export default ${JSON.stringify(images)}`;
    },
    configureServer(server) {
      if (!enabled || !files.size) return;
      // Prevent accidentally exposing the unapproved photo review on a LAN/public bind.
      if (server.config.server.host !== '127.0.0.1')
        throw new Error('Private history review requires a loopback host');
      server.middlewares.use((req, res, next) => {
        const file = files.get((req.url ?? '').split('?')[0]);
        if (!file) return next();
        if (
          !['GET', 'HEAD'].includes(req.method ?? '') ||
          !/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host ?? '')
        ) {
          res.statusCode = 403;
          res.end();
          return;
        }
        res.setHeader('Content-Type', 'image/webp');
        res.setHeader('Cache-Control', 'private, no-store');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        createReadStream(file)
          .on('error', () => {
            res.statusCode = 404;
            res.end();
          })
          .pipe(res);
      });
    },
  };
}
