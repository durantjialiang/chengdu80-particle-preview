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
