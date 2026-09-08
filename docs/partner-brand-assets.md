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

Use the original files without recoloring, filters, redraws, cropping, logo
rearrangement, or added effects. White presentation areas retain clear space and
legibility on the site's dark background. Hover styling applies to the surrounding
card, not the marks. Rights remain with the respective owners.

## Original assets and official destinations

| Organization     | Official website / source page          | Local original                          | Format / dimensions    |
| ---------------- | --------------------------------------- | --------------------------------------- | ---------------------- |
| UC Berkeley CDAR | https://cdar.econ.berkeley.edu/         | `public/partner-logos/cdar.png`         | PNG, 291 × 151         |
| State Street     | https://www.statestreet.com/us/en/about | `public/partner-logos/state-street.svg` | SVG, viewBox 576 × 158 |

Original URLs and SHA-256 checksums are centralized in `content/partner-brands.ts`.
CDAR's static site uses an encoded `%3F` and `%26` in the actual image filename;
these are retained exactly, not changed into a query string. The State Street
SVG is served by its current official website; no archived logo was recreated.

The source files were copied byte-for-byte. CDAR is not enlarged beyond its
original CSS width; State Street remains vector. Both have reserved dimensions,
lazy loading and asynchronous decoding. Source and permission notes live here
instead of adding audit copy to the public cards.

## Validation boundary

Automated checks cover original checksums, official-domain destinations, native
links, safe new-tab attributes, local assets, and dated historical roles. The
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

| Organization                           | Official destination      | Local original                            | Dimensions |
| -------------------------------------- | ------------------------- | ----------------------------------------- | ---------- |
| SWUFE                                  | https://www.swufe.edu.cn/ | `public/university-logos/swufe-logo.png`  | 245 × 180  |
| Chengdu Jiaozi Financial Holding Group | https://www.cdjzjk.com/   | `public/partner-logos/chengdu-jiaozi.png` | 376 × 50   |

SWUFE reuses the approved asset already referenced by `content/universities.ts`;
it is not a duplicate or a new reconstruction. Jiaozi's white wordmark and gold
symbol were downloaded unchanged from its official homepage's header asset:
https://www.cdjzjk.com/_nuxt/logo-b.Br5iWYEW.png
The official header module `https://www.cdjzjk.com/_nuxt/BVSyvsR9.js` references
this original. The small 42 × 40 site icon was not used.

SHA-256 values, natural dimensions, original source and destination are recorded
in `hostBrandProfiles` in `content/partner-brands.ts`. Both white-on-transparent
marks use a dark presentation area, clear space and `object-fit: contain`, without
recoloring, cropping or enlarging the source. Dimensions are reserved and images
use lazy loading and asynchronous decoding. The two-column layout retains the
existing single-column breakpoint. Audit metadata stays in code and this document,
not in the public cards.

Regression coverage checks original asset hashes, reuse of the SWUFE university
asset, direct official links, accessible new-tab attributes, image-before-name
ordering and both languages across all three placements. These are source and
server-rendered markup checks, not browser screenshot or click tests.

For this revision, `npm run typecheck`, `npm run lint`, all 58 tests,
`npm run build` and `git diff --check` passed. The existing Globe bundle-size
warning remains; particle rendering and dependencies were not changed.
