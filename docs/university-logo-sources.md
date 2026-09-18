# University logo sources

Updated 2026-09-18. SVG files are retained original university assets; four raster
marks are delivered as WebP derivatives generated from the recorded source
downloads. The source URLs and original-file hashes remain in
`public/university-logos/ASSET_SOURCES.md`; WebP files have their own hashes and
dimensions. At the project owner's request, mainland universities are now shown
by name only. Their standalone logo files have been removed from the public assets
and all shared university records use `logo: null` for those institutions. The
owner explicitly asked to retain the University of Hong Kong logo alongside the
12 foreign university logos.

| Record | Web asset | Official source | Source dimensions | Web dimensions | Surface |
|---|---|---|---|---|---|
| Toronto | `/university-logos/toronto.svg` | https://www.utoronto.ca/themes/custom/bootstrap_uoft/logo.svg | viewBox 576 × 158 | viewBox 576 × 158 | Dark: original white mark |
| Chicago | `/university-logos/uchicago.svg` | https://creative.uchicago.edu/logos-and-identity-elements/ — University-Logo.zip | source SVG | source SVG | Light: original maroon mark |
| UC San Diego | `/university-logos/ucsd.svg` | https://brand.ucsd.edu/logos/primary-campus-logo/index.html — uc-san-diego-logo-kit-042425.zip | source SVG | source SVG | Light: original blue/gold mark |
| UNSW | `/university-logos/unsw.webp` | https://www.unsw.edu.au/content/dam/images/graphics/logos/unsw/unsw_0.png | 330 × 140 | 330 × 140 | Light: official primary mark |
| Berkeley | `/university-logos/uc-berkeley.webp` | https://brand.berkeley.edu/wp-content/uploads/2024/08/logo-variations-thumbnail-gold-blue-1.png | 4101 × 2626 | 960 × 615 | Original blue canvas with gold wordmark; CSS fills the tile without clipping the wordmark |
| Tel Aviv University | `/university-logos/tel-aviv-university.webp` | https://english.tau.ac.il/sites/default/files/TAU_Logo_HomePage_Eng.png | 200 × 110 | 200 × 110 | Light: original black mark |
| NUS | `/university-logos/nus.webp` | https://www.nus.edu.sg/images/default-source/identity-images/fullcolorlogo.jpg | 242 × 118 | 242 × 118 | Light: original full-color mark |

All other retained marks have their existing official source in
`content/universities.ts` and remain SVG files, including HKU. The shared logo
tile preserves image aspect ratio. Chicago's supplied artwork includes
additional clear space, compensated within the tile with a modest CSS scale.
Berkeley's WebP derivative preserves the original blue canvas and gold wordmark;
CSS reduces the outer blue canvas while preserving the full centered mark and
clear space. Tel Aviv's black mark uses a light surface. No artwork is
recolored. University roles and academic exchanges remain dated historical
records, not a confirmed 2026 roster.
