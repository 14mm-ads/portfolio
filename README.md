# 14mm Advertising — Campaign Archive

A cinematic portfolio archive built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide icons, and React Router. It works as a static demo without a backend; an optional Supabase connection enables private project, video, and brand management in the `/admin` portal. No analytics, cookies, or advertising trackers are enabled.

> The archive contains 30 fictional demo films associated with 50 fictional demo brands. Replace or remove them before presenting the site as real agency work.
> Landscape thumbnails and players use 16:9 framing; vertical thumbnails and players use 9:16 framing, including at mobile breakpoints.
> The full archive uses a responsive CSS-column masonry layout so portrait and landscape cards form a Pinterest-style browsing wall.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm. Vite 6 works on supported modern Node releases.
- No backend is required to run the static demo.
- Supabase credentials and the SQL setup below are required to use the admin portal and persist edits.

## Install and run

From this folder:

```sh
npm install
npm run dev
```

Vite prints a local URL, normally `http://localhost:5173/portfolio/`.

## Deploy to GitHub Pages

This project is configured for the repository `14mm-ads/portfolio` and the URL `https://14mm-ads.github.io/portfolio/`.

1. Push this project to the `portfolio` repository under the `14mm-ads` GitHub account.
2. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.
3. Push to the `main` branch (or run the **Deploy to GitHub Pages** workflow manually from the Actions tab). The workflow builds the site and publishes `dist/`; it also includes an SPA fallback for direct project links.
4. Open `https://14mm-ads.github.io/portfolio/` after the workflow completes.

The Vite base path, client-side routes, asset paths, canonical metadata, robots file, and sitemap are configured for this GitHub Pages URL. The custom agency website remains a contact link and is not the portfolio hosting domain.

## Checks and production build

```sh
npm run typecheck
npm run build
npm run preview
```

The production site is generated in `dist/`. Build output is static and can be deployed to a static host.

## Admin portal and Supabase setup

The admin portal at `/portfolio/admin` lets allowlisted staff add, edit, and remove projects, brands, and shared dropdown options. It also records project, brand, and option changes for the last 30 days. Project and brand data is public to read; all database and media writes are restricted by Supabase row-level security to explicitly allowlisted administrators. With no Supabase configuration, the portfolio continues to use its local demo data and the portal displays setup instructions.

1. Create a Supabase project. In **Project Settings → API**, copy the project URL and publishable/anon key.
2. For local testing, copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. In the Supabase SQL Editor, run `supabase/migrations/20261024000000_portfolio_admin.sql`, then run `supabase/migrations/20261123000000_admin_options_and_change_log.sql`.
4. In Supabase **Authentication → Providers → Email**, keep public sign-ups disabled. Create each administrator under **Authentication → Users**. Copy the new user’s UUID, then explicitly allowlist that account in SQL:

   ```sql
   insert into public.admin_users (user_id)
   values ('SUPABASE_AUTH_USER_UUID');
   ```

   Remove access by deleting that user’s row from `public.admin_users`. The website checks the allowlist after sign-in, and row-level security enforces it for database and storage writes.
5. In GitHub, open the `14mm-ads/portfolio` repository and go to **Settings → Secrets and variables → Actions**. Add repository secrets named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, using the Supabase project URL and publishable/anon key. The Pages workflow injects these only during the build. They are browser-visible credentials; never use or expose a service-role/secret key in a `VITE_` variable.
6. In Supabase **Authentication → URL Configuration**, set the site URL to `https://14mm-ads.github.io/portfolio/` and add it as an allowed redirect URL.
7. Push a commit or run **Deploy to GitHub Pages** from the repository’s Actions tab to rebuild the deployed site with Supabase enabled. Visit `https://14mm-ads.github.io/portfolio/admin` and sign in with the allowlisted account. For an empty project, choose **Import demo archive** to seed the fictional projects and brands; otherwise add your own.

Media is stored in the public `campaign-media` bucket so project pages can stream it without visitor sign-in. Only allowlisted administrators can upload, update, or delete objects. Uploads use resumable 6 MB chunks with retry and progress reporting. Uploading a video without an existing poster creates and saves a JPEG poster from its first frame; posters can also be supplied manually. The migration caps individual files at 500 MB and allows MP4/WebM video, JPEG/PNG/WebP images, and WebVTT captions. Respect your Supabase storage/bandwidth plan and use compressed web delivery encodes. Media replacements remove the previous managed object after saving.

The **Options** tab manages shared sector, category, campaign, format, language, platform, orientation, and tag choices. Brand sector uses the shared sector list; brand tagline, description, and other descriptive fields remain free text. Credits and project summary remain free text. The **Change log** tab shows the editor identity, timestamp, entity, action, and changed values for projects, brands, and dropdown options over the previous 30 days. Audit entries are written by database triggers and are visible only to allowlisted administrators.

Project and brand edits are written to Supabase and loaded by the public archive. The demo data remains in `src/data/projects.ts` as the local fallback and as the content imported by the first-run seed button. The schema is described by the SQL migration; no server/service key is needed in the browser.

## Project structure

```text
src/
  components/       Reusable navigation, featured work, filter, brand, media, and admin components
  context/          Shared portfolio data state and refresh
  config/site.ts    Agency identity, contact links, canonical URL, analytics placeholder
  data/
    projects.ts     Local demo records and generated filter options
    brands.ts       Brand index generated from project records
    portfolioRepository.ts  Supabase project/brand/media operations
  lib/              Supabase client and typed database shape
  pages/            Archive, individual project, and private admin routes
  index.css         Design tokens, responsive styling, focus, and reduced-motion support
supabase/
  migrations/       Database schema, allowlist-based RLS, and media bucket policies
public/
  images/
    posters/        Original fictional-demo poster artwork
  videos/
    landscape/      Add cleared landscape MP4s here
    vertical/       Add cleared portrait MP4s here
    thumbnails/     Optional video thumbnails
```

## Replace demo content

With Supabase connected, use `/admin` for everyday content changes. The local files below remain useful for offline edits and supply the demo archive seed.

### Add or edit a project

Edit `src/data/projects.ts`. Each record includes:

- `id`, `slug`, `title`, `brand`, `brandLogo`, optional `isDemo`
- `sector`, `businessCategory`, `language`, `year`
- `campaignType`, `adFormat`, `platform`, `orientation`, `duration`
- `videoSrc`, `posterSrc`, `captionSrc`, `featured`
- `associatedBrands`, `description`, `credits`, `tags`, `accentColor`

Use a unique lowercase `slug`; it becomes `/work/<slug>`. Set `videoSrc` to a public path such as `/videos/landscape/demo-brand-festive-offer-tamil-landscape.mp4`. Set `captionSrc` to a WebVTT path (for example `/videos/captions/demo-brand-en.vtt`) to expose captions in the native player. Set `videoSrc: null` for a poster-only view.

Filter choices and the brand index are generated from this file; no UI edits are needed when adding records. Use `associatedBrands` when one film features a partner brand so it appears in brand search and the index. Use explicit `Demo Brand 51` naming for new fictional identities, and keep the demo badge/description until approved real work replaces them.

### Add a brand

Add the brand name and its project record(s) to `src/data/projects.ts`. The brand index in `src/data/brands.ts` is generated from project data. Put an approved logo under `public/images/brands/` and set `brandLogo` if you choose to add logo rendering later; text-only placeholder identities are used by default.

### Replace posters

Add a licensed, optimized image under `public/images/posters/` and update that record’s `posterSrc`. Keep an intentional aspect ratio that matches `orientation`. Recommended source dimensions: 1920×1080 landscape, 1080×1920 vertical, 1200×1200 square. Export WebP or AVIF for photographs; use SVG for original vector artwork.

## Replace video

No video binaries are included: a sample with a verified creator, source page, and license suitable for redistribution could not be confirmed for this build. The project pages retain graceful poster-based missing-file states, and no fictional or copyrighted ads are used as video samples.

1. Obtain agency-owned footage or stock explicitly licensed for commercial use and website hosting.
2. Copy the compressed MP4 into `public/videos/landscape/` for landscape projects or `public/videos/vertical/` for portrait projects.
3. Use a filename such as `demo-brand-festive-offer-tamil-vertical.mp4`.
4. Update only the matching project’s `videoSrc` in `src/data/projects.ts`.
5. Add the matching poster, update `posterSrc`, and add a WebVTT caption track via `captionSrc` when available.
6. Record creator, source/download page, license, and download date in `public/videos/README.md`.

All 30 demo records have an editable local video path; the MP4 files themselves are intentionally not included, so each project shows its local demo poster and a missing-file message until media is added. The `showreel` action expects `/videos/showreel.mp4`. Add that file when an approved showreel is ready. Videos are not autoplayed in the archive, and project playback starts with sound after an explicit play action. Browser-native controls provide pause, progress, volume, captions, and fullscreen. Off-screen players are paused.

### Recommended delivery

- H.264 MP4 with AAC audio; optionally provide WebM if separately tested.
- Keep short previews around 5–15 MB where quality permits; encode smaller mobile-friendly versions.
- Export a poster frame so the project page is useful before playback or when the video is unavailable.
- Avoid autoplaying audio. Deliver captions as WebVTT; the player enables the captions track when `captionSrc` is set.
- Use the naming convention `brand-campaign-format-language-orientation.mp4`.

## Agency details, identity, and styling

- Edit agency name, wordmark path, email, phone, WhatsApp, social links, main website, location, and canonical URL in `src/config/site.ts`.
- The wordmark uses the approved image URL set in `logoPath`; use a local asset under `public/` if you prefer to host it with the site.
- Edit CSS design tokens at the top of `src/index.css` (palette, type families, and surface colors). The teal palette is `#034553`, `#739D9B`, white, and cinematic charcoal.
- Font families are declared in `index.html`. Self-host font files if the eventual privacy policy or hosting environment requires it.
- The current canonical URL is `https://14mm-ads.github.io/portfolio/`. If deploying to a different host or repository path, update `canonicalUrl` in `src/config/site.ts`, the Vite `base` in `vite.config.ts`, and the canonical, structured-data, robots, and sitemap URLs. Update social metadata/OG image as needed.

## Routes and deployment

Project details use individual routes (`/work/<slug>`) rather than an overlay: they are directly linkable, keyboard-friendly, and shareable, and React Router keeps project navigation clear on mobile. Static hosts must rewrite unknown routes to `index.html`.

- **Vercel:** import the repository; Vite is detected automatically. Add a rewrite to `/index.html` for project paths if the platform does not apply SPA fallback automatically.
- **Netlify:** deploy `dist/`; a `public/_redirects` entry `/* /index.html 200` can be added if SPA fallback is not automatic.
- **GitHub Pages:** this repository is configured for `14mm-ads/portfolio`; the Actions workflow publishes the site and provides a `404.html` fallback for direct project links.

## SEO, privacy, and analytics

Page titles, descriptions, Open Graph/Twitter preview metadata, a favicon placeholder, `robots.txt`, a sitemap, and canonical URLs are included. Verify them against the final deployment domain. The archive only shares or loads media when a visitor requests it; no tracking is active.

Optional analytics can be integrated later in `src/App.tsx` behind an explicit consent decision. `analytics.enabled` in `src/config/site.ts` is intentionally false and is a documentation/configuration placeholder, not a tracking switch. Do not enable analytics, cookies, or third-party marketing tags without the agency’s privacy review and required consent.

## Media licensing

Only use owned or appropriately licensed campaign work, images, video, logos, music, and fonts. Check that licenses permit commercial use and hosting/redistribution, retain license evidence, and record provenance in `public/videos/README.md`. Never present the fictional demo projects or stock samples as client work.
