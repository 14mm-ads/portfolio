# Demo video assets

This folder intentionally contains no video binaries. A licensed, appropriately credited stock sample could not be verified for this build, so no external or fabricated video file is included. All 30 entries and 50 brand identities are fictional demos, not agency campaigns. Until you add media, project pages use their local poster artwork and explain that the demo film is not installed.

## Add videos

- Landscape project films: `public/videos/landscape/`
- Vertical project films: `public/videos/vertical/`
- Showreel: `public/videos/showreel.mp4`
- Poster images: `public/images/posters/`

All 30 project video paths are referenced by `videoSrc` in `src/data/projects.ts`. Copy a legally cleared MP4 to the path recorded for the project; the local route will then serve it. If you choose a different file name, edit only that record's `videoSrc`. Set `videoSrc` to `null` to use the poster-only fallback. Project previews never autoplay; project video begins only after a visitor presses play and starts muted. Native browser controls provide play, pause, volume, progress, captions (when a caption file is supplied), and fullscreen.

For stock use, verify that the source license permits the intended commercial use and redistribution/hosting, and record source page, creator, license, and download date here before adding the asset. Do not use real advertisements or brand campaigns as demo work.

## Production media recommendations

- MP4 with H.264 video and AAC audio; provide WebM only as an optional second source when desired.
- Keep short clips around 5–15 MB where quality permits; encode responsive versions for mobile.
- Use 1920×1080 landscape (16:9) and 1080×1920 vertical (9:16) masters. Deliver smaller widths for mobile when possible.
- Export a matching JPEG or WebP poster frame; posters in this project use SVG demo artwork and should be replaced with licensed campaign stills.
- Keep videos silent until the visitor enables sound. Add WebVTT captions and set `captionSrc` on each record when captions are available.
- Use descriptive filenames such as `demo-brand-festive-offer-tamil-vertical.mp4`.

Folders:

- `landscape/` — landscape project films.
- `vertical/` — portrait project films.
- `thumbnails/` — optional exported film thumbnails.
