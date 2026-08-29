# Umoya Wellness Spa

Marketing website for **Umoya Wellness Spa** - an RN-led med spa in South Salt Lake, Utah
(founder: Cheryl Johnson, RN-BSN-FAACM). Node.js + Express + EJS, vanilla JS + GSAP,
with a custom cursor and a canvas "breath" mist effect as the signature interaction.

## Setup

```bash
npm install
npm run dev     # dev server with auto-restart (node --watch)
npm start       # production start
```

Runs at **http://localhost:3070** (configurable via `PORT` in `.env` - copy `.env.example`).

## Folder structure

```
server.js                  Express app - view engine, middleware, route mounting
routes/
  index.js                 Home, About, Packages, Learn More, News, sitemap, robots
  services.js              /services hub + /services/:slug detail pages
  contact.js               /contact page + POST handler (email or local JSON fallback)
  booking.js               /book form + Stripe Checkout Session creation
  stripeWebhook.js         Stripe webhook - source of truth for a paid deposit
  availability.js          /api/availability - open slots from Google Calendar
data/
  site.js                  Brand, contact info, hours, socials, deposit amount, nav
  services.js              Service catalog (single source for routes, nav, footer)
  packages.js              Package cards
  testimonials.js          Paraphrased Google reviews
  faq.js / news.js         FAQ + journal placeholder content
  submissions/             Contact form submissions land here when SMTP is unset
lib/
  mailer.js                Nodemailer wrapper - SMTP send, falls back to JSON file
  jsonStore.js             Appends submissions/bookings to local JSON files
  googleCalendar.js        Service-account auth, freebusy query, event creation
  availability.js          Business hours + slot math (Luxon, America/Denver)
views/
  layout.ejs               Shared shell (head/SEO, canvases, preloader, scripts)
  partials/                header, footer, logo (inline SVG, 3 variants)
  pages/                   One EJS file per page
public/
  css/tokens.css           Design tokens - palette, type scale, spacing, motion
  css/base.css             Reset, section theming, buttons, utilities
  css/components/          One file per component
  js/smoke.js              Cursor-driven mist/breath canvas effect (signature)
  js/cursor.js             Custom gold ring/dot lerp cursor with hover labels
  js/reveal.js             Scroll reveals + markup-preserving text splitting
  js/...                   nav, magnetic buttons, parallax, tilt, forms, etc.
  assets/images/           Stock placeholders - see "Swapping in real content"
scripts/
  fetch-real-images.sh     Re-downloads the Unsplash placeholder set
```

## Swapping in real content

- **Photography** - every `<img>` using a placeholder is marked with a
  `<!-- PLACEHOLDER: ... -->` comment in the views. Drop real photos into
  `public/assets/images/...` under the same filenames (or update the paths in
  `data/services.js` and the views).
- **Booking** - every Book Now button site-wide links to `/book`, which creates a
  Stripe Checkout Session for the deposit amount set in `data/site.js`
  (`booking.depositAmount`, currently `$30`). Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
  in `.env` to enable it; without them `/book` still renders but shows "payments
  temporarily unavailable." The webhook in `routes/stripeWebhook.js` is the
  source of truth for a paid deposit and emails a notification to
  `CONTACT_TO_EMAIL`.
- **Contact form + booking notification email** - set the `SMTP_*` vars in `.env`
  to send real email via Nodemailer; until then, submissions/bookings append to
  `data/submissions/*.json`. See the `TODO` in `routes/contact.js` for wiring a
  CRM instead.
- **Business info** (hours, phone, address, Instagram) - all in `data/site.js`.
- **Packages/pricing** - cards intentionally say "Book to inquire about pricing";
  add a `price` field in `data/packages.js` and render it in
  `views/pages/packages.ejs` when real pricing is confirmed.

## Google Calendar integration (live availability + auto-synced appointments)

`/book` shows real open slots from Cheryl's Google Calendar and, once the
deposit is paid, writes the confirmed appointment straight onto it - no manual
back-and-forth. This is a service-account integration (no login flow, no
refresh tokens):

1. Create a Google Cloud project, enable the **Google Calendar API**, and
   create a service account (**IAM & Admin > Service Accounts**).
2. Create a JSON key for it (**Keys > Add Key > Create new key > JSON**).
3. Share the target calendar with the service account's email
   (`...@project-id.iam.gserviceaccount.com`), granting **Make changes to
   events** under **Settings and sharing > Share with specific people or
   groups**.
4. Set three env vars from that JSON key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   (`client_email`), `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (`private_key`), and
   `GOOGLE_CALENDAR_ID` (the calendar's address, e.g. `umoyahelp@gmail.com`
   for a primary calendar). For the private key, prefer base64-encoding it
   (`node -e "console.log(Buffer.from(require('./key.json').private_key).toString('base64'))"`)
   over pasting the raw multi-line PEM - hosting-panel env var UIs can mangle
   backslashes/newlines on paste, which breaks PEM parsing at runtime
   (`lib/googleCalendar.js` auto-detects either format).

Without these three vars, `/book` automatically falls back to plain
"Preferred Date" / "Preferred Time" text fields (the pre-calendar behavior)
and no events are created - nothing breaks, it just loses the live-availability
feature. Business hours, appointment length (`lib/availability.js`), and the
14-day booking window are all adjustable constants in that file.

## SEO

- **Canonical host/protocol** - `app.set('trust proxy', 1)` in `server.js` makes
  Express read Hostinger's `X-Forwarded-Proto` header, so the canonical tag,
  sitemap, robots.txt, and `og:url` all correctly resolve to `https://`
  instead of `http://`. A redirect middleware (also in `server.js`) 301s
  `myumoyaspa.com` → `www.myumoyaspa.com` and strips trailing slashes, so the
  site has exactly one canonical URL per page.
- **Structured data** - a site-wide `MedicalBusiness` JSON-LD block lives in
  `views/layout.ejs`. Per-page schema (`Service` + `FAQPage` on
  `/services/:slug`, `FAQPage` on `/learn-more`, `BlogPosting` on
  `/news/:slug`, `BreadcrumbList` on every secondary page) is passed as a
  `structuredData` array from the route (see `routes/services.js`,
  `routes/index.js`) and rendered by the same block in `layout.ejs`. **Don't
  put `<script>` JSON-LD directly in a `views/pages/*.ejs` file** -
  `express-ejs-layouts`' `extractScripts` option silently drops inline
  `<script>` tags (no `src`) from page views; only `layout.ejs` itself is
  safe for inline scripts.
- **Breadcrumbs** - `views/partials/breadcrumbs.ejs` renders the visible trail
  and `lib/breadcrumbs.js#breadcrumbList()` builds the matching
  `BreadcrumbList` JSON-LD from the same `{ name, url }` array (a route passes
  `breadcrumbs` as a view local, then feeds the same array into
  `breadcrumbList(res.locals.siteOrigin, crumbs)` inside `structuredData`).
  Wired into every secondary page except `/book` (kept breadcrumb-free as a
  conversion funnel).
- **News detail pages** - `/news/:slug` (`routes/index.js`, `views/pages/
  news-detail.ejs`) gives each `data/news.js` entry a real permalink with full
  body copy, replacing the old index-only cards. Add a new article by adding
  a `{ slug, title, date, excerpt, body: [...] }` entry; no new route/view
  needed.
- **Google Search Console / Tag Manager** - set `GOOGLE_SITE_VERIFICATION`
  (the HTML-tag verification value) and/or `GTM_CONTAINER_ID` (`GTM-XXXXXXX`)
  in `.env` to enable them; both are no-ops when unset. GA4 is configured as
  a tag *inside* the Tag Manager container (not embedded separately in code)
  to avoid double-counting pageviews.
- `/sitemap.xml` and `/robots.txt` are generated dynamically in
  `routes/index.js`, not static files.
- **Self-hosted fonts** - `public/fonts/*.woff2` + `public/css/fonts.css`
  replace the Google Fonts `<link>` (which cost two render-blocking
  round-trips: the CSS file, then the font file itself). Only 3 files are
  needed because Google actually serves Inter and Playfair Display as
  *variable* fonts even for "static" weight requests - each file covers a
  weight range (`font-weight: 300 700` etc.) rather than one file per
  weight. Latin subset only, since the site has no non-Latin content; if a
  design change ever needs a weight/style outside the ranges already
  declared in `fonts.css`, re-fetch `https://fonts.googleapis.com/css2?family=...`
  with a browser user-agent to find the new variable-font URL rather than
  adding individual static-weight files.
- **WebP images** - every `.jpg`/`.png` in `public/assets/images/` has a
  `.webp` twin (51% smaller on average), served via
  `<picture><source type="image/webp">` with the original JPG as the
  `<img>` fallback. `final-cta-bg.jpg`'s CSS `background-image` uses
  `image-set()` for the same fallback pattern. **After adding or replacing
  any image, run `node scripts/convert-images-to-webp.js`** to regenerate
  the `.webp` twin - it isn't automatic. `sharp` (used only by that script)
  is a devDependency, not needed at runtime.
- **Compressed hero video** - `public/assets/video/hero.mp4` (the
  autoplaying, muted homepage background loop) is re-encoded at CRF 30
  (3.09MB -> 0.92MB, no visible quality loss at the size/dimming it's
  actually displayed at). **After replacing the footage, run
  `node scripts/compress-hero-video.js path/to/new-footage.mp4`** rather
  than dropping the raw export straight in. `ffmpeg-static` (used only by
  that script) is a devDependency, not needed at runtime.

## Accessibility & motion

- `prefers-reduced-motion` disables the cursor, mist effect, preloader, page
  transitions, and reveal animations (content renders immediately).
- Touch devices get the native cursor and no cursor canvas.
- Keyboard: skip link, focus-visible outlines, Escape closes the mobile menu,
  dropdowns open on focus-within.
