# Historical photographs: publication record

## Project confirmation 2026-09-06

After reviewing the local archive samples and being told that the photographs were not yet published, the project owner explicitly confirmed in the current project conversation on 2026-09-06:

> 没问题的 这些都可以 上传吧

The confirmation is recorded as project-owner approval to publish the 13 photographs already integrated into the 2019 and 2024 sample archives on the current website/public preview and its existing GitHub repository. This is the evidence basis used in `content/archive-media-approved.json`; it is **not** a claim that the assistant independently obtained a separate licence from the original publisher, verified all underlying rights, or identified a photographer.

Approved scope:

- `cd80-2019-01` through `cd80-2019-08`: the eight captioned university team photographs from the old official 2019 annual page.
- `cd80-2024-01` through `cd80-2024-05`: the five event photographs from the SWUFE News seventh-edition report.
- Only the existing faithful, aspect-ratio-preserving WebP full/thumbnail derivatives are published: 26 files in `public/history-media/`. No upscaling, retouching, watermark removal, generated reconstruction or facial identification was used.

Excluded: 27 other old-year image references, the uncollected Queen’s image candidate, original articles/PDFs, raw original-image research copies, local review manifests and the complete research package. They are not added to the public build or repository.

Source links and school associations remain evidence-based. The 2019 HTML table explicitly names the schools beside their photographs; no photograph is assigned to Dragon Search. The 2024 photographs have no verified individual school/project association. Data Queens remains a team name, with its product name unknown.

`credit` records a source attribution, not an invented photographer/rights-holder credit. The original pages do not identify photographers; `photographer` remains null. Any later specific attribution or rights restriction must be incorporated before further reuse.

## Presentation update 2026-09-07

At the project owner's request, public image tiles and the public image viewer no longer display audit captions, source-credit lines or original-image links. They retain the photographs, accessible image descriptions and viewing controls; the editorial tiles also retain their year. All provenance, school/project associations, null photographer fields and approval records remain unchanged in the manifest and exported source/material records. Explicitly private local-review media still show review and source details. No photo pixels, embedded logos or watermarks were altered.

## Editorial exception 2026-09-07

The subsequently adopted editorial review explicitly asks for a caption and
publisher attribution on the existing incubator launch photograph in Partners.
That single placement of `cd80-2024-05` now displays “Launch of the Chengdu 80
Incubator, 2024.” (and its Chinese equivalent), plus a SWUFE News source link.
This is a publisher/source attribution; no photographer has been identified or
invented. All other gallery placements retain their image-only presentation.
No image bytes, associations, permission gates or rights records changed. Media
use conditions remain in the separate `/media/#usage` section.


## Owner 2024 photo collection 2026-09-08

The project owner provided the desktop “成都八零” photo collection, confirmed that these photographs document the 2024 edition, requested their website placement and a 90-second highlights film, and then requested filing them under the 2024 subfolder. This is the authorization for this batch on the existing website/public preview and GitHub repository, and for editing/exporting the photo film. It does not establish a separate publisher licence or identify the photographer.

All 30 original JPG files were moved, with file names and SHA-256 hashes unchanged, into the owner's `成都八零/2024` folder. One exact duplicate (`WUL01672(1).JPG`) remains preserved beside `WUL01672.JPG`; only one derivative pair is published. The 2018–2021 MP4 and the incomplete forum-video download remain outside the 2024 folder and are not used as 2024 footage.

The 29 unique photos use IDs beginning `cd80-2024-owner-`, `sourceKind: owner-supplied`, empty public source URLs, and this section as their permission evidence. `docs/2024-photo-inventory.json` records source file names, original hashes, dimensions and caption/category decisions. Public metadata does not contain local file paths. Full WebP derivatives have a 2400-pixel long edge and thumbnails an 800-pixel long edge; all preserve the complete frame.

The Hong Kong University Apollo and SWUFE FinFlare award pictures have school labels visible on the stage backdrop and retain `projectId: null`. The 2024 Apollo image is not assigned to the 2023 Apollo record. Other photographs are not assigned to a specific university/team based on faces or similar clothes. The new incubator launch photograph has its event clearly printed on the backdrop; it also appears in the site's incubator section.

The original 13 archive photographs remain approved under the earlier dated confirmation. This collection adds 29, for 42 archive photographs (8 from 2019 and 34 from 2024). City collaboration photographs remain in their separate manifest.
