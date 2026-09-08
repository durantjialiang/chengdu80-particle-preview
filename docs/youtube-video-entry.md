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
