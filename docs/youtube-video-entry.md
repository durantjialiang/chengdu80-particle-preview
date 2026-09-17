# YouTube video entry

Added 2026-09-08 at the project owner's request. The main desktop/mobile
navigation and footer include Videos / 视频, opening `/media/`. The video
section at `/media/#videos` precedes the existing news and photo resources.

`content/video-channel.ts` is the single destination setting. The owner will
supply the actual YouTube channel or playlist URL later. Until then it is
`null`; visitors see Coming soon / 即将上线 as a status, not a dead button.
When a URL is set, the same component renders an external Watch on YouTube /
前往 YouTube 观看 link with a new-tab label and `noopener noreferrer`.

Initially, the 2024 awards photograph was a still image explicitly captioned as
such. It is not presented as a playable video or a thumbnail for an uploaded
YouTube film. No fabricated channel, upload, video count or release date is
published, and no external player or YouTube request runs before a click.


## 2024 photo film, 2026-09-08

The owner subsequently requested a 90-second highlights film from the supplied 2024 photo collection. The video section now offers an actual local MP4 with playback controls, a poster, optional caption tracks and a download link. Caption tracks are off by default because the film has bilingual titles. It is labelled as a photo film, not original event footage. It uses `preload="none"`, never autoplays, and does not contact YouTube.

`content/recap-2024.ts` defines the local video, poster and subtitle paths. The future YouTube channel still uses `content/video-channel.ts`: the label “Chengdu 80 on YouTube” remains visible with Coming soon until the owner supplies the URL. The 2018–2021 retrospective in the supplied folder is not mixed into the 2024 film.

The media page places photographs directly after video, before news/publications. Photo filters support shareable year/type links, and photo grids load thumbnails; opening a picture loads the full derivative.

## English film and new score, 2026-09-09

The owner requested a replacement score and English text throughout the film for sharing on YouTube and X. The final choice is an original cinematic score with a spacious opening, a gradual rhythmic build, an awards-and-group-photo climax and a natural ending. The 90-second v2 edit keeps the same 18 photographs and changes all added titles, chapter labels, corner branding, lower thirds, end card and poster to English. Text captured within the original photographs remains intact.

The media player points to versioned `v2-en` video, poster and English WebVTT files. Its optional caption track is English and is off by default. The website's existing Chinese/English interface is unchanged. The previous v1 assets and local master remain available. No commercial song is included and no social-media upload has been performed.

## Stable picture edit, 2026-09-09

The owner reported continuous shaking in the v2 film. The v3 edit removes the animated zoom/pan filter. Each photograph and its text stay at a fixed size and position, with opacity-only cross-dissolves between scenes. The 90-second timeline and English labels are retained, and the approved cinematic score is copied directly from the v2 master without re-encoding. The player uses a new `v3-stable-en.mp4` URL so cached v2 video cannot be mistaken for the fix; the unchanged English poster and caption track are reused.

## Photo-only publication, 2026-09-09

The owner now requests the 2023 and 2024 photographs on the website and asks to withhold videos. This supersedes the earlier public-player configuration above. The navigation currently reads Photos / 照片. Media opens with the photo archive, supports year/category filters and links to both edition albums.

The local 2024 player and all files under `public/videos/` are removed from the current deployment. Original source videos, edited exports and the previously published file bundle are preserved outside the site checkout. `VideoChannel` retains the owner's future YouTube-link capability, but renders nothing while `content/video-channel.ts` has `youtubeUrl: null`. A configured owner URL will render the external channel entry after the photographs, with no embedded player or background YouTube request.


## Four external video entries, 2026-09-15

The project owner now requests Photos and Videos / 照片与视频 in the shared navigation and four video cards with one cover each. This supersedes the earlier photo-only display for these four specified external videos. Bilibili destinations were supplied directly by the owner: `BV1wEen6nEXe`, `BV12Qen6oE3f`, `BV13Fen6YEXj`, and `BV1UUen6fEgd`. The Bilibili public metadata confirms each title, cover and duration; the uploader is FIC_fintech.

Only the four static cover images and external links are published on the website. Clicking a cover or a platform link opens the corresponding external video. No video files, embedded players or automatic playback are added. YouTube and X / Twitter are non-clickable pending labels until their individual video URLs are supplied. The two academic-collaborator entries reuse the existing Hansen and Anderson speech links.

`content/video-library.ts` contains the bilingual library entries; `docs/video-library-sources.json` records the source cover URLs and hashes. Covers under `public/video-posters/` are the original images of these owner-specified uploads, retained without modification. Annual photo albums and local edited video masters are unchanged.

## Instagram video destinations — 2026-09-16

The owner requested Instagram alongside Bilibili, YouTube and X on all four video-library cards. All four Instagram URLs are currently null and render as non-clickable “Instagram · Link pending / 链接待补充”. Each can be replaced with the owner's actual video URL later; Hansen and Anderson retain their shared link data in content/collaborators.ts, and the other two entries are configured in content/video-library.ts. Existing Bilibili links and covers are unchanged.


## YouTube uploads linked — 2026-09-16

The owner supplied channel UC5jSyryWdN-jP0LN-xTDedg (FIC | Fintech Innovation Center, @fic80) and confirmed that all four videos were uploaded. The channel's public video list contains four matching titles and durations; all four titles and authors were additionally confirmed with YouTube oEmbed. Individual watch URLs are recorded in docs/video-library-sources.json. The website uses direct video links for each card, and the Hansen/Anderson links are shared with their homepage and partnership profiles.

The external channel entry is displayed between the video library and photo archive. Its unique youtube-channel anchor avoids colliding with the existing videos anchor. Four direct X post destinations are now recorded in `docs/video-library-sources.json` and connected to the corresponding cards; Instagram remains pending. There are no embedded players, additional hosted media, or automatic YouTube requests.

## X post destinations — 2026-09-16

The owner supplied the public X profile [Ficfintech / @Fic_Swufe](https://x.com/Fic_Swufe). The public profile showed four posts whose visible titles matched the four video entries. The website uses the individual post URLs as the X destinations:

- Nobel Laureates & Fintech / forum highlights: [X post](https://x.com/Fic_Swufe/status/2100133583377862999)
- Robert Anderson at the 2019 International Fintech Forum: [X post](https://x.com/Fic_Swufe/status/2100133381128515928)
- Inside Chengdu 80 documentary: [X post](https://x.com/Fic_Swufe/status/2100133524208857566)
- 2018–2021 recap: [X post](https://x.com/Fic_Swufe/status/2100133687136555117)

Each public post displayed a YouTube share card or external YouTube link. The records therefore describe these as YouTube shares and retain the X post URL, rather than claiming that the media is hosted natively by X. The account name, visible title, link target and matching video entry were checked in the public browser view on 2026-09-16; no login or account interaction was performed. Instagram destinations remain to be supplied by the owner.


## Instagram and Bilibili account entries — 2026-09-17

The owner supplied [Instagram @ficfintech80](https://www.instagram.com/ficfintech80/) and requested the Bilibili uploader account from [BV13Fen6YEXj](https://www.bilibili.com/video/BV13Fen6YEXj/). The normal browser video page identifies **FIC_fintech** and links to [Bilibili account 3546637056084549](https://space.bilibili.com/3546637056084549/). Both account entries now appear in “Follow Chengdu 80 / 关注成都八零”, alongside YouTube and X.

The Instagram public profile confirms **Fic (@ficfintech80)** and a Fintech Innovation Center (FIC) bio. Its public grid exposed three untitled Reel links, but opening a Reel required login. The individual videos therefore remain unmapped: no Reel is assigned based only on a thumbnail or upload order. The four video-library cards and the Hansen/Anderson profile cards use an explicitly labelled “Instagram profile / Instagram 主页” link to the owner-supplied account. Verified individual destinations can later replace the profile fallback through the existing shared video data. No media upload, platform login or account interaction was performed.
