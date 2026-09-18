# Website image delivery

Updated 2026-09-18 at the project owner's request to reduce website size and visitor traffic.

All 315 public bitmap derivatives are WebP. The 12 SVG files remain vector assets; their geometry and bytes are unchanged. No approved photograph, video cover, university record, or retained logo was removed. Mainland university logo exclusions and the owner's explicit HKU-logo exception remain in force.

| Use | Maximum long edge | Encoding |
| --- | ---: | --- |
| Photograph opened in the viewer | 1600 px | WebP quality 74, method 6 |
| Photograph thumbnail | 640 px | WebP quality 66, method 6 |
| Video cover | 960 px | WebP quality 74, method 6 |
| 2018–2019 awards display photograph | 2400 px | WebP quality 82, method 6, to retain small text |
| Bitmap identifying mark | 960 px | Lossless WebP after proportional resizing; transparency retained |

Images are not enlarged. Supplied color profiles are converted to sRGB before metadata removal. Original photography files in the owner's year folders are untouched. The prior deployed files remain recoverable in Git at `477ada6fe2e8a572df1084e6535dca3c886df9ff` and in the v4 deployment archive. Source URLs and historical source hashes describe original material; current derivative hashes describe the website files.

For this batch, public assets fell from 77,250,138 bytes to about 17.73 MB (the exact total also includes the current source-note file). The 150 full/thumbnail pairs remain intact. All 327 image assets remain represented: 315 WebP bitmaps and 12 SVG vectors. Actual visitor traffic also depends on the page, viewport, browser cache, and whether the viewer is opened; this storage reduction is not a claim that every visit previously downloaded all images.

Inline photographs on screens up to 767 px use the thumbnail through a native `picture` source. Wide desktop inline photographs retain the larger derivative. Gallery thumbnails, news cards, and off-screen photographs load lazily. The viewer explicitly loads the selected large image only when opened, including on mobile. News article covers similarly use the mobile thumbnail and desktop large image. Video cards remain external links with local covers, without embedded players or video downloads.

The optimization audit and reproducible one-off conversion script are in the workspace's `outputs/image-optimization-20260918/` directory. The image budget check runs with `node --test qa/image-delivery.test.mjs`. It checks real WebP headers, absence of public PNG/JPEG leftovers, a 24 MiB total public-asset ceiling, and per-file limits of 64 KiB for thumbnails and 320 KiB for other bitmaps. Any future archive expansion should revisit these explicit budgets without silently bypassing them.
