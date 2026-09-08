# YouTube video entry

Added 2026-09-08 at the project owner's request. The main desktop/mobile
navigation and footer include Videos / 视频, opening `/media/`. The video
section at `/media/#videos` precedes the existing news and photo resources.

`content/video-channel.ts` is the single destination setting. The owner will
supply the actual YouTube channel or playlist URL later. Until then it is
`null`; visitors see Coming soon / 即将上线 as a status, not a dead button.
When a URL is set, the same component renders an external Watch on YouTube /
前往 YouTube 观看 link with a new-tab label and `noopener noreferrer`.

The existing 2024 awards photograph is a still image explicitly captioned as
such. It is not presented as a playable video or a thumbnail for an uploaded
YouTube film. No fabricated channel, upload, video count or release date is
published, and no external player or YouTube request runs before a click.
