const express = require('express');
const router = express.Router();

const services = require('../data/services');
const testimonials = require('../data/testimonials');
const faq = require('../data/faq');
const news = require('../data/news');
const transformation = require('../data/transformation');
const site = require('../data/site');
const { breadcrumbList } = require('../lib/breadcrumbs');

router.get('/', (req, res) => {
  res.render('pages/home', {
    pageTitle: 'Umoya Wellness Spa | Med Spa in South Salt Lake, UT',
    pageDescription:
      'A sanctuary of rest, renewal, and radiance. RN-led body contouring, medical wellness, and aesthetic treatments in South Salt Lake, Utah.',
    services: services.filter((s) => s.flagship).concat(services.filter((s) => !s.flagship)).slice(0, 4),
    testimonials,
  });
});

router.get('/about', (req, res) => {
  const crumbs = [{ name: 'About Us', url: '/about' }];
  res.render('pages/about', {
    pageTitle: 'About Us | Umoya Wellness Spa',
    pageDescription:
      'Umoya means air, breath, and spirit. Meet founder Cheryl Johnson, RN-BSN-FAACM, and learn about our consultation-first, clinical approach to wellness.',
    breadcrumbs: crumbs,
    structuredData: [breadcrumbList(res.locals.siteOrigin, crumbs)],
  });
});

// Alias so /about-us also reaches the About Us page.
router.get('/about-us', (req, res) => res.redirect(301, '/about'));

// The Packages page was discontinued - send any existing link to the
// homepage rather than 404ing.
router.get('/packages', (req, res) => res.redirect(301, '/'));

router.get('/transformation', (req, res) => {
  const crumbs = [{ name: transformation.name, url: '/transformation' }];
  res.render('pages/transformation', {
    pageTitle: `${transformation.name} | Umoya Wellness Spa`,
    pageDescription:
      'A medically guided 6-week package combining Zinzino, THINNR, and 5 T-Shape 2 body contouring sessions for real, sustainable results.',
    transformation,
    breadcrumbs: crumbs,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: transformation.name,
        provider: { '@type': 'MedicalBusiness', name: site.brand.name },
        areaServed: 'South Salt Lake, UT',
        description: 'A medically guided 6-week weight-loss and body contouring package.',
        offers: {
          '@type': 'Offer',
          price: transformation.price,
          priceCurrency: 'USD',
        },
      },
      breadcrumbList(res.locals.siteOrigin, crumbs),
    ],
  });
});

router.get('/learn-more', (req, res) => {
  const crumbs = [{ name: 'Learn More', url: '/learn-more' }];
  res.render('pages/learn-more', {
    pageTitle: 'Learn More | Umoya Wellness Spa',
    pageDescription: 'Educational resources on body contouring, medical wellness, and what to expect at Umoya.',
    faq,
    services,
    breadcrumbs: crumbs,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      breadcrumbList(res.locals.siteOrigin, crumbs),
    ],
  });
});

router.get('/news', (req, res) => {
  const crumbs = [{ name: 'News & Journal', url: '/news' }];
  res.render('pages/news', {
    pageTitle: 'News & Journal | Umoya Wellness Spa',
    pageDescription: 'The latest from Umoya Wellness Spa: openings, education, and wellness insight.',
    news,
    breadcrumbs: crumbs,
    structuredData: [breadcrumbList(res.locals.siteOrigin, crumbs)],
  });
});

// The weight-loss article was rewritten around THINNR (previously described a
// prescription-style protocol) - redirect the old slug so it still resolves.
router.get('/news/understanding-medically-supervised-weight-loss', (req, res) =>
  res.redirect(301, '/news/understanding-our-thinnr-weight-loss-protocol')
);

router.get('/news/:slug', (req, res, next) => {
  const article = news.find((a) => a.slug === req.params.slug);
  if (!article) return next();

  const otherArticles = news.filter((a) => a.slug !== article.slug).slice(0, 3);
  const crumbs = [
    { name: 'News & Journal', url: '/news' },
    { name: article.title, url: `/news/${article.slug}` },
  ];

  res.render('pages/news-detail', {
    pageTitle: `${article.title} | Umoya Wellness Spa`,
    pageDescription: article.excerpt,
    article,
    otherArticles,
    breadcrumbs: crumbs,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        author: { '@type': 'Person', name: 'Cheryl Johnson, RN-BSN-FAACM' },
        publisher: { '@type': 'MedicalBusiness', name: 'Umoya Wellness Spa' },
        mainEntityOfPage: `${res.locals.siteOrigin}/news/${article.slug}`,
      },
      breadcrumbList(res.locals.siteOrigin, crumbs),
    ],
  });
});

// Concierge Healthcare was discontinued - send any existing link to the
// homepage rather than 404ing.
router.get('/concierge-healthcare', (req, res) => res.redirect(301, '/'));

// Bump this when site content meaningfully changes - applied to every
// sitemap entry as a single, honest "last updated" signal rather than
// stamping the current request date (which would falsely claim daily changes).
const SITE_LAST_UPDATED = '2026-09-17';

router.get('/sitemap.xml', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  const staticRoutes = ['/', '/about', '/services', '/transformation', '/learn-more', '/news', '/contact', '/book'];
  const serviceRoutes = services.map((s) => `/services/${s.slug}`);
  const newsRoutes = news.map((a) => `/news/${a.slug}`);
  const all = [...staticRoutes, ...serviceRoutes, ...newsRoutes];

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url><loc>${base}${p}</loc><lastmod>${SITE_LAST_UPDATED}</lastmod></url>`).join('\n')}
</urlset>`);
});

router.get('/robots.txt', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /book/success\nSitemap: ${base}/sitemap.xml\n`);
});

module.exports = router;
