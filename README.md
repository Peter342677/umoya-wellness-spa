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
data/
  site.js                  Brand, contact info, hours, socials, deposit amount, nav
  services.js              Service catalog (single source for routes, nav, footer)
  packages.js              Package cards
  testimonials.js          Paraphrased Google reviews
  faq.js / news.js         FAQ + journal placeholder content
  submissions/             Contact form submissions land here when SMTP is unset
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
  Stripe Checkout Session for the `$50` deposit set in `data/site.js`
  (`booking.depositAmount`). Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
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

## Accessibility & motion

- `prefers-reduced-motion` disables the cursor, mist effect, preloader, page
  transitions, and reveal animations (content renders immediately).
- Touch devices get the native cursor and no cursor canvas.
- Keyboard: skip link, focus-visible outlines, Escape closes the mobile menu,
  dropdowns open on focus-within.
