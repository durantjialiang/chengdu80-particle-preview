# Chengdu 80 particle preview

An isolated interactive review of the SWUFE + FIC → CHENGDU 80 particle field.
This repository does not deploy or replace the existing Chengdu 80 website.

## Run locally

Requires Node.js 22.13+ and npm.

```sh
npm ci
npm run dev
```

The development entry is http://127.0.0.1:4174/qa/particle80.html.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Review the interaction

Watch SWUFE and FIC contribute particles to a shared spatial field. Move the
pointer through the light to gently displace particles, then watch them settle.
Use Replay to restart the sequence and the globe transition control to review
the optional handoff. Mobile quality and reduced-motion preferences are supported.

The particle field uses spring forces, damping, inertia and procedural noise;
60% of particles anchor the silhouette, 22% circulate within its fixed volumes,
and 18% are nearby/background ambient dust. The upper and lower 8 loops flow in
opposite directions; the 0 has an independent slower clockwise flow. Cool-white,
icy-blue and gray-blue roles are accented by only 2% champagne highlights.
Rendering uses one lightweight Canvas and a cached color atlas, not one mesh per
particle. The optional globe uses React Three Fiber and Three.js.

## Deploy to Vercel

Import this repository as a Vite project. `vercel.json` supplies the build command
and `out/particle-preview` output directory. No environment variables or backend
are required. The site is marked `noindex, nofollow` for review purposes; this is
not access protection. Keep the GitHub repository private if source privacy is
desired, while allowing public access to this standalone deployed preview.

The existing dependency versions and lockfile are retained from the working site.

## Component documentation

- [Particle field API](components/Particle80.README.md)
- [Intro lifecycle and integration](components/Particle80Intro.README.md)

Competition facts in shared content configuration are not newly verified by this
preview. Do not treat placeholder metrics or draft copy as organizer-confirmed.
