# Host and historical international partner identities

## Scope

The Partners & Impact page now features UC Berkeley CDAR and State Street Bank as
clickable institutional cards, replacing the previous 2019 notice. Both marks and
names are part of a single native link to the respective official website, opened
in a new tab. The SWUFE / Jiaozi host block now also includes official identifying
marks and homepage links. Historical role records, sources, particles and the
global university explorer are unchanged.

The section explicitly describes **historical international co-hosts** and the
2019 second edition. It does not assert current sponsorship, an exclusive
relationship, a 2026 appointment, or endorsement of this preview by either brand.
The dated source remains in the existing 2019 partnership timeline:
https://www.cdjzjk.com/news/show?articleId=2013070358905884672

## Permission

On 2026-09-07, the project owner answered that they **already have permission for
both logos** when specifically asked about use on the new website and the public
preview. `content/partner-brands.ts` records this as `project-owner-confirmed`, not
as a separately inspected legal approval or an unrestricted public license. No
approval documents, credentials or private contacts are included in the build.

Brand guidance reviewed during asset research:

- https://brand.berkeley.edu/visual-identity/logos/
- https://investors.statestreet.com/files/doc_downloads/2024/Compliance_Global_Standard-of-Conduct-English.pdf
  (page 47: external promotional use requires prior brand approval).

Keep the source marks without recoloring, filters, redraws, cropping, logo
rearrangement, or added effects. Raster marks are delivered as WebP derivatives
for the website; their source URLs and original-file hashes remain in the
metadata, while the checked-in `sha256` values identify the WebP bytes. White
presentation areas retain clear space and legibility on the site's dark
background. Hover styling applies to the surrounding card, not the marks.
Rights remain with the respective owners.

## Source records, WebP delivery and official destinations

| Organization     | Official website / source page          | Source download (history) | Web delivery                             | Source dimensions | Web dimensions |
| ---------------- | --------------------------------------- | ------------------------- | ---------------------------------------- | ----------------- | -------------- |
| UC Berkeley CDAR | https://cdar.econ.berkeley.edu/         | `cdar.png`                | `public/partner-logos/cdar.webp`         | 291 × 151         | 291 × 151      |
| State Street     | https://www.statestreet.com/us/en/about | `state-street.svg`       | `public/partner-logos/state-street.svg`  | viewBox 576 × 158 | viewBox 576 × 158 |

Original URLs, source SHA-256 values and WebP derivative SHA-256 values are
centralized in `content/partner-brands.ts`. CDAR's static site uses an encoded
`%3F` and `%26` in the actual image filename; these are retained exactly, not
changed into a query string. The State Street SVG is served by its current
official website; no archived logo was recreated.

The original source downloads are recorded through `sourcePath` and
`sourceSha256`; they are not described as byte-identical to the WebP delivery
files. CDAR is not enlarged beyond its source CSS width; State Street remains
vector. Both have reserved dimensions, lazy loading and asynchronous decoding.
Source and permission notes live here instead of adding audit copy to the public
cards.

## Validation boundary

Automated checks cover delivered checksums, WebP/SVG path formats,
official-domain destinations, native links, safe new-tab attributes, local
assets, and dated historical roles. The
cards stack below 760px, retain keyboard focus outlines, and suppress hover
translation for reduced motion. A browser screenshot or manual interaction test
is not implied by these source/SSR checks.

## SWUFE and Chengdu Jiaozi host identities — 2026-09-08

The shared host block is used on the homepage, About and Partners pages. Each
host's logo and existing name are inside one native, keyboard-accessible anchor,
with `target="_blank"`, `rel="noopener noreferrer"` and a bilingual new-tab label.
The existing names and historical role text are retained. No new relationship or
endorsement is asserted. The project owner's existing authorization to publish
company marks is recorded as `project-owner-confirmed`; no private approval
documents are included.

| Organization                           | Official destination      | Source download (history) | Web delivery                                  | Web dimensions |
| -------------------------------------- | ------------------------- | ------------------------- | --------------------------------------------- | -------------- |
| SWUFE | https://www.swufe.edu.cn/ | Text only; mark withdrawn on 2026-09-15 | — | — |
| Chengdu Jiaozi Financial Holding Group | https://www.cdjzjk.com/   | `chengdu-jiaozi.png` | `public/partner-logos/chengdu-jiaozi.webp` | 376 × 50 |

SWUFE uses its school name as text only; its mark has been removed from public assets at the project owner's request. Jiaozi's white wordmark and gold
symbol were downloaded unchanged from its official homepage's header asset:
https://www.cdjzjk.com/_nuxt/logo-b.Br5iWYEW.png
The official header module `https://www.cdjzjk.com/_nuxt/BVSyvsR9.js` references
this original. The small 42 × 40 site icon was not used.

SHA-256 values, source history, delivered dimensions, original source and
destination are recorded in `hostBrandProfiles` in `content/partner-brands.ts`.
The white-on-transparent WebP derivative uses a dark presentation area, clear
space and `object-fit: contain`, without recoloring, cropping or enlarging the
source. The original source hash is kept in `sourceSha256`; `sha256` matches the
checked-in WebP. Dimensions are reserved and images use lazy loading and
asynchronous decoding. The two-column layout retains the
existing single-column breakpoint. Audit metadata stays in code and this document,
not in the public cards.

Regression coverage checks delivered asset hashes, WebP/SVG path formats, reuse
of the SWUFE university asset, direct official links, accessible new-tab
attributes, image-before-name ordering and both languages across all three
placements. These are source and
server-rendered markup checks, not browser screenshot or click tests.

For this revision, `npm run typecheck`, `npm run lint`, all 58 tests,
`npm run build` and `git diff --check` passed. The existing Globe bundle-size
warning remains; particle rendering and dependencies were not changed.
