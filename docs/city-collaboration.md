# City collaboration — editorial record

Updated 2026-09-08. Scope: the new `/partners/#city-collaboration` section only.
The existing competition hosts, international partner cards, particle renderer,
globe, routes and language switching are unchanged.

## Institutional relationships

- **Chengdu Municipal People's Government — university–city co-building.**
  [SWUFE report](https://www.swufe.edu.cn/info/1048/23222.htm), published
  2023-11-03, records the government/SWUFE joint laboratory and the 2023-10-31
  visit to the laboratory and Chengdu 80 teams. This is not a statement that
  the city government co-hosted the competition.
- **Wenjiang District People's Government — International Fintech Forum co-host.**
  [2022 FIC report](https://fic.swufe.edu.cn/info/1027/1003.htm), published
  2022-11-11, forum opened 2022-11-05; [2023 SWUFE report](https://www.swufe.edu.cn/info/1048/23202.htm),
  published 2023-11-02, forum held 2023-10-28–29. Both name SWUFE, Wenjiang and
  the municipal financial regulator as hosts of the forum, not interchangeable
  hosts of Chengdu 80.
- **Chengdu Municipal Financial Regulatory Bureau — historical forum co-host.**
  Same two forum reports. Retain the name in those reports; do not infer a
  successor institution, current homepage or 2026 sponsorship.
- **Qingyang District People's Government — school–district collaboration.**
  [2021 SWUFE report](https://www.swufe.edu.cn/info/1048/29662.htm), published
  2021-10-27, event 2021-10-22, describes the joint financial innovation district
  initiative; [2024 SWUFE report](https://www.swufe.edu.cn/info/1048/20632.htm),
  published 2024-06-07, meeting 2024-06-06, describes continued projects,
  research translation and talent development. The
  [seventh-edition report](https://news.swufe.edu.cn/info/1003/109791.htm),
  published 2024-10-31, event 2024-10-30, also records a district representative
  attending and presenting awards. Not a competition host designation.
- **Office of the Chengdu Municipal Financial Work Commission — event engagement.**
  The same seventh-edition report records a representative's attendance, speech
  and award presentation. No sponsorship, funding or organizing role is inferred.

All evidence links and dates are retained in `content/city-collaboration.ts` for
maintenance. Public cards use short role-specific copy, without an expandable
source-note panel. Government organizations are shown as names, not fabricated
official seals or badges. No high-tech-zone government relationship was added
on the basis of an event venue alone.

## Photography

Only two existing approved files are reused. No new remote image is published,
and no original image pixels or watermarks were edited:

- `cd80-2024-01`: seventh-edition stage group photograph;
  `/history-media/cd80-2024-01-full.webp` (1800 × 1200).
- `cd80-2024-04`: seventh-edition collaborative workspace;
  `/history-media/cd80-2024-04-full.webp` (1800 × 1200).

Both are SWUFE News images from the seventh-edition report above. Their original
URLs, source credit, photographer unknown fields and project-owner authorization
remain in `content/archive-media-approved.json` and `docs/media-authorization.md`.
They illustrate the overall event, not a specifically identified government
delegation, school or winning team. Neither is presented as a 2022/2023 forum photo.
Native proportions, reserved dimensions and lazy loading are retained. Clicking
either photo opens the shared existing image viewer. Captions remain accessible,
without visible audit text below the images.

## Layout and validation

Desktop: large event image beside the city co-building feature, followed by a
two-column institution grid and a second photo-led story. Tablet collapses the
feature; phones use one column. There is no new animation, post-processing or
dependency. Existing reduced-motion behavior is preserved.

Regression tests cover five stable IDs and their distinct roles, source/date
associations, approved media, Chinese/English server rendering, reserved image
dimensions, lazy loading, external link safety and absence of public audit panels.
Runtime/browser interaction and responsive visual inspection are not implied by
these source/SSR checks; actual executed command results are reported separately.

Executed locally on 2026-09-08: `npm run lint`, `npm run typecheck`, `npm test`
(67/67 passed, including two new city-section regressions), `npm run build`, and
`git diff --check` all passed. The existing Globe chunk-size warning remains.
The local Partners route returned HTTP 200 at port 4186. No new browser
screenshots, responsive viewport runs or photo-click interaction tests were
performed in this iteration. Asset thumbnails were visually inspected before
reuse. No new file download or new media licence is claimed.

## Photo authorization 2026-09-08

The project owner asked to find cooperation photographs for the four city
institution cards and put them on the linked public preview. Their screenshot
explicitly identifies Wenjiang, Qingyang, the municipal financial regulator and
the municipal financial work office. This authorizes the requested site edit
and publication; it is recorded as project-owner confirmation, not an
independently issued publisher licence. Original sources retain their copyright.

The four selected images are recorded in `content/city-collaboration-media.ts`:

| Card                                          | Photograph                                                                                              | Official source                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Wenjiang district government                  | 2022 International Fintech Forum opening, jointly hosted by SWUFE, Wenjiang and the municipal regulator | https://fic.swufe.edu.cn/info/1027/1003.htm    |
| Qingyang district government                  | SWUFE–Qingyang cooperation meeting on 6 June 2024                                                       | https://www.swufe.edu.cn/info/1048/20632.htm   |
| Chengdu Municipal Financial Regulatory Bureau | 2023 International Fintech Forum, jointly hosted with SWUFE and Wenjiang                                | https://www.swufe.edu.cn/info/1048/23202.htm   |
| Municipal Financial Work Commission office    | Liang Qizhou speaking at the seventh Chengdu 80 on 30 October 2024                                      | https://news.swufe.edu.cn/info/1003/109791.htm |

Forum photographs show the co-hosted events and do not identify a specific
representative. The Qingyang photograph documents school–district cooperation,
not a Chengdu 80 competition session. For the financial work office, the source
places image `DC6395BAFB3DC308D2EB62EE7E5_9A8AB042_309B3.jpg` directly before
Liang Qizhou's speech paragraph. The older archive `cd80-2024-03` has a generic caption and a different source
URL. This card uses the exact image URL in the current report and records the
explicit paragraph association, without modifying the older archive record.

Photographs retain their proportions, content and existing watermarks. Each
card shows a short bilingual event/year label and opens the existing viewer.
The two general 2024 scene photographs remain in the surrounding section.

Photo update verification (2026-09-08): typecheck, lint, 67 tests and production build passed. The built Chinese page displayed all four institution photographs, and the financial-work-office photograph opened the shared viewer. Existing globe bundle-size warning remains. Production completion is verified separately after publication.

## Owner supplied stage photo 2026-09-08

The project owner supplied `WUL01538.JPG` and explicitly asked to add it to the
partnership section. Source dimensions are 7008 × 4672; SHA-256 is
`e32b0de2fd21ab066cbdfb7966a11c4bf4f870602328132848466da4b2398141`.
The backdrop explicitly names Liang Qizhou and shows FINTECH80 CHENGDU 2024.
No photographer is inferred and no public source URL is fabricated.

WebP copies at 2400 × 1600 and 640 × 427 retain the entire composition. The
original user file is unchanged and is not added to the repository. A thumbnail
labelled “2024 · 梁其洲致辞全景” supplements the financial-work-office card;
the existing speech photograph remains. Both can be opened in the shared viewer.
This record covers the user's authorization for the requested website and public
preview use, not an independent publisher licence.
