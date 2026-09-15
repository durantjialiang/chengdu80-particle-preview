# News publication — 2026-09-15

The project owner approved a dedicated News / 新闻动态 section after Competition in the shared navigation, with six bilingual stories: Hansen in 2019, Anderson in 2019, the 2023 competition, the 2024 competition, the 2024 incubator launch and the Discoverer documentary feature.

The index highlights one story and offers event, academic exchange, project/collaboration and media categories. Every story has an internal detail route, an approved existing cover, original-source links and relevant existing photos or video destinations. Historical event dates are separate from the date the article was compiled for this website. The documentary's sharing date does not establish its original broadcast date. No unannounced 2026 rules or confirmed guest appointments are inferred.

Edit content/news.ts for stories. When adding or renaming articles, keep content/site-routes.json title, description and cover metadata aligned. qa/news.test.mjs verifies article destinations and approved image references. The default static build emits every /news/ route via the shared content-route registry.

Photos reuse the published competition and academic-collaborator collections; the media feature reuses the already approved Bilibili cover. No new raw source photos or local films are uploaded in this change.
