# News: university and media coverage — 2026-09-16

The owner requested that News primarily link to coverage published by universities and media. The index now presents 11 original-source links: four university reports, six media reports and one participating-team account. University reports appear first. Every card links directly to its publisher in a new tab; there are no internally rewritten articles for these reports.

The two guest retrospectives (Lars Peter Hansen and Robert Anderson, 2019) remain in a separate section below the source collection. The four previous locally compiled News stories are removed. Their old routes redirect to the relevant competition archive, partnerships or media page, preserving previous links. Existing annual archives, photos, video links and other website sections remain available.

## Sources and dates

- content/press-coverage.ts holds the bilingual card content. docs/press-coverage-sources.json records the reviewed source URLs, publication dates and attribution.
- NUS Computing and NUS MSBA publish the 2019 and 2023 team reports. HKU Computer Science's official news index confirms 6 November 2023 for its Apollo report. Queen's School of Computing reports the 2024 Data Queens result; its article has no explicit publication date, so the card only identifies the event year and does not infer a date from the URL.
- China Daily, People's Daily Online, Hong Kong Commercial Daily, Sichuan Online and Phoenix are labelled by publisher, not collectively as foreign media. Phoenix credits Huaxia Morning Post.
- The Tencent Cloud Community entry is by DataPi THU and cites DataAge. It describes the 2021 event, originally published 26 July 2021, and reposted 29 March 2023. It is labelled as a team story, not Tencent editorial coverage or an official university press release.
- The owner's concatenated Hong Kong Commercial Daily and Tencent URLs were split; tracking parameters were removed. Unknown repost domains from search screenshots are not included. The China News screenshot was not included because a stable direct article could not be confirmed.

Only short bilingual summaries and headlines are presented; the publishers retain their original articles and images. No new third-party logos, images or local videos are hosted. Source-language labels make the destination language clear. Existing approved guest photos are reused.

qa/news.test.mjs verifies source links, classification, dates, guest routes, safe external links and retired-route redirects. Browser checks cover mobile/desktop layouts, filtering, language switching, original-source navigation and retained guest details.
