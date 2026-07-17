const express = require('express');
const router = express.Router();

const services = require('../data/services');
const testimonials = require('../data/testimonials');
const faq = require('../data/faq');
const packages = require('../data/packages');
const news = require('../data/news');
const concierge = require('../data/concierge');

router.get('/', (req, res) => {
  res.render('pages/home', {
    pageTitle: 'Umoya Wellness Spa | Body Contouring & Medical Wellness in South Salt Lake',
    pageDescription:
      'A sanctuary of rest, renewal, and radiance. RN-led body contouring, medical wellness, and aesthetic treatments in South Salt Lake, Utah.',
    services: services.filter((s) => s.flagship).concat(services.filter((s) => !s.flagship)).slice(0, 4),
    testimonials,
  });
});

router.get('/about', (req, res) => {
  res.render('pages/about', {
    pageTitle: 'About Us | Umoya Wellness Spa',
    pageDescription:
      'Umoya means air, breath, and spirit. Meet founder Cheryl Johnson, RN-BSN-FAACM, and learn about our consultation-first, clinical approach to wellness.',
  });
});

// Alias so /about-us also reaches the About Us page.
router.get('/about-us', (req, res) => res.redirect(301, '/about'));

router.get('/packages', (req, res) => {
  res.render('pages/packages', {
    pageTitle: 'Packages | Umoya Wellness Spa',
    pageDescription: 'Bundled treatment packages designed around your wellness goals. Book to inquire about pricing.',
    packages,
  });
});

router.get('/learn-more', (req, res) => {
  res.render('pages/learn-more', {
    pageTitle: 'Learn More | Umoya Wellness Spa',
    pageDescription: 'Educational resources on body contouring, medical wellness, and what to expect at Umoya.',
    faq,
    services,
  });
});

router.get('/news', (req, res) => {
  res.render('pages/news', {
    pageTitle: 'News & Journal | Umoya Wellness Spa',
    pageDescription: 'The latest from Umoya Wellness Spa: openings, education, and wellness insight.',
    news,
  });
});

router.get('/concierge-healthcare', (req, res) => {
  res.render('pages/concierge', {
    pageTitle: 'Concierge Healthcare Services | Umoya Wellness Spa',
    pageDescription:
      'Primary care, weight loss, lab services, urgent care, behavioral health, dermatology, and a prescription discount program, all in one concierge membership.',
    concierge,
  });
});

router.get('/sitemap.xml', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  const staticRoutes = ['/', '/about', '/services', '/packages', '/learn-more', '/news', '/concierge-healthcare', '/contact'];
  const serviceRoutes = services.map((s) => `/services/${s.slug}`);
  const all = [...staticRoutes, ...serviceRoutes];

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')}
</urlset>`);
});

router.get('/robots.txt', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
});

module.exports = router;
