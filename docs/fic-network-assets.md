# FIC exchange-network company cards

## Scope

Six original company marks sit above their bilingual names in About's FIC
section (`/about/?lang=zh#fic-network`). Each whole card is
one native link to the company's official homepage, opening a new tab. The long
public audit paragraph has been removed. The FIC exchange-network heading and
original FIC source link remain. These records have not been promoted to Chengdu
80 sponsorships or 2026 appointments.

The registry is `content/fic-network.ts`, re-exported as `ficIndustry` from the
existing ecosystem module. It records original URLs, dimensions, SHA-256 hashes
and permission status. State Street reuses the existing authorized local mark;
its destination here is the company homepage, not the About page.

## Permission status — owner-confirmed public use

On 2026-09-07, following the request for permission covering the new website and
public preview, the project owner confirmed: “公司标志都公开吧 都是授权了的”.
All six displayed marks are recorded as `project-owner-confirmed`; State Street
retains its earlier confirmation. The five newly collected marks may now be
included in the existing GitHub repository and Vercel preview. This records the
owner's confirmation, not independent verification of a separate licence or a
new sponsorship relationship. Public accessibility and media-kit availability
were not treated as permission. No approval documents are published.

Official conditions encountered during research:

- Ping An: https://www.pingan.cn/other/disclaimer.shtml — written approval for
  trademarks/logos and public reuse.
- CIC: https://www.china-inv.cn/china_inv/home/Terms_of_Use.shtml — prior written
  permission for protected graphics and trademarks.
- CCB: https://www.ccb.com/en/public/v3/20160104_1451872464.html — no affirmative
  logo reuse permission found in the reviewed disclaimer.
- Swiss Re: https://www.swissre.com/terms-of-use.html — restrictions on public or
  commercial reproduction without prior written permission.
- Moody's: https://www.moodys.com/web/en/us/media-relations.html — media/editorial
  use conditions; do not assume these grant use on an event website.

## Original files

| Institution  | Source                                                  | Local file                              | Original dimensions |
| ------------ | ------------------------------------------------------- | --------------------------------------- | ------------------- |
| Ping An      | https://www.pingan.cn/about/brand-spirit.shtml          | `public/partner-logos/ping-an.svg`      | 238 × 38            |
| CCB          | https://en.ccb.com/en/home/indexv3.html                 | `public/partner-logos/ccb.png`          | 200 × 40            |
| CIC          | https://www.china-inv.cn/chinainven/home/               | `public/partner-logos/cic.jpg`          | 400 × 131           |
| State Street | https://www.statestreet.com/us/en/about                 | `public/partner-logos/state-street.svg` | 576 × 158           |
| Swiss Re     | https://www.swissre.com/media/electronic-press-kit.html | `public/partner-logos/swiss-re.jpg`     | 5039 × 1189         |
| Moody's      | https://www.moodys.com/web/en/us/media-relations.html   | `public/partner-logos/moodys.png`       | 4086 × 1129         |

Moody's blue PNG was extracted byte-for-byte from the official media-kit ZIP.
The precise ZIP member is recorded in the registry. No ZIP, private approval
document or access credential is part of the website.

All files retain their original bytes, proportions, colors and built-in spacing.
White presentation areas provide additional clear space. Marks are not cropped,
filtered, traced, recolored or independently animated. The raster CCB logo is
not enlarged beyond its 200px intrinsic width. All images are lazily loaded with
reserved dimensions; the grid switches from three to two to one column. Hover
movement applies only to the card and is disabled for reduced motion.

## Validation boundary

Source/SSR tests check all six identities, official-domain links, both image and
name inside the same anchor, safe new-tab attributes, source checksums, image
dimensions and removal of the requested paragraph. Browser screenshots or manual
pointer/keyboard testing are not implied by these automated checks.

Local validation on 2026-09-07: typecheck, lint, all 54 tests, the production-format
build, public-UI guard and whitespace checks passed. The browser suite covers
About in both languages at 1440×900, 390×844 and 320×740. All six images decoded
successfully in each case, with no horizontal overflow or new console errors.
Image and name clicks were each exercised on State Street and opened its real
homepage in a new tab. The other five destinations were checked as link targets,
not individually navigated in this browser run. See `editorial-review-2026-09-07.md`
for screenshots, full test scope and limitations. The existing approximately
910 KB Globe chunk warning is unchanged.
