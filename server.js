require('dotenv').config();

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3070;

// Hostinger's proxy terminates TLS and forwards over plain HTTP, so without
// this, req.protocol always reads "http" - breaking the canonical tag,
// sitemap, robots.txt, and og:url, which all derive the site's base URL from it.
app.set('trust proxy', 1);

// ---------- View engine ----------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// ---------- Core middleware ----------
app.use(
  helmet({
    contentSecurityPolicy: false, // custom canvas/inline animation code; CSP tuned separately if needed
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Consolidates the site onto a single canonical host/URL shape so search
// engines don't split ranking signals between www/non-www or a trailing
// slash and its non-slash equivalent.
app.use((req, res, next) => {
  const host = req.hostname;
  const hasTrailingSlash = req.path.length > 1 && req.path.endsWith('/');

  if (host === 'myumoyaspa.com') {
    const target = `https://www.myumoyaspa.com${req.originalUrl}`;
    return res.redirect(301, target);
  }
  if (hasTrailingSlash) {
    const target = req.path.slice(0, -1) + (req.originalUrl.slice(req.path.length) || '');
    return res.redirect(301, target);
  }
  next();
});

// Stripe webhook signature verification needs the exact raw request bytes,
// so it must be mounted with express.raw() before the global JSON/urlencoded
// parsers below consume the body.
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use('/', require('./routes/stripeWebhook'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Locals available to every view ----------
const site = require('./data/site');
app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.currentPath = req.path;
  // Built from req.path (not req.originalUrl) so tracking/query params like
  // ?utm_source=... don't produce a different "canonical" URL per visit.
  res.locals.canonicalUrl = `${req.protocol}://${req.get('host')}${req.path}`;
  res.locals.siteOrigin = `${req.protocol}://${req.get('host')}`;
  res.locals.pageTitle = site.brand.name;
  res.locals.pageDescription =
    'A sanctuary of rest, renewal, and radiance. RN-led body contouring and medical wellness in South Salt Lake, Utah.';
  res.locals.ogImage = '/assets/images/hero/hero-bg.jpg';
  // Set once real IDs are available - see .env.example. Layout only emits
  // the corresponding tags/scripts when these are present.
  res.locals.gtmContainerId = process.env.GTM_CONTAINER_ID || '';
  res.locals.googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || '';
  next();
});

// ---------- Routes ----------
app.use('/', require('./routes/index'));
app.use('/services', require('./routes/services'));
app.use('/', require('./routes/contact'));
app.use('/', require('./routes/availability'));
app.use('/', require('./routes/booking'));

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Page Not Found | ' + site.brand.name,
    layout: 'layout',
  });
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again shortly.');
});

app.listen(PORT, () => {
  console.log(`Umoya Wellness Spa running at http://localhost:${PORT}`);
});
