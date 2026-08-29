const express = require('express');
const router = express.Router();

const services = require('../data/services');
const site = require('../data/site');
const { breadcrumbList } = require('../lib/breadcrumbs');

function pricingFaqEntry() {
  return {
    q: 'How does pricing work?',
    a: `A ${site.booking.depositAmountFormatted} deposit reserves your appointment. The remaining balance is paid in person at the time of your visit.`,
  };
}

// Display order for category groups on the hub - any new category not listed
// here still renders, just appended after these.
const CATEGORY_ORDER = ['Body Contouring', 'Medical Wellness', 'Aesthetics'];

router.get('/', (req, res) => {
  const categories = [...new Set(services.map((s) => s.category))].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );
  const grouped = {};
  categories.forEach((cat) => {
    grouped[cat] = services.filter((s) => s.category === cat);
  });

  const crumbs = [{ name: 'Services', url: '/services' }];
  res.render('pages/services-hub', {
    pageTitle: 'Our Services | Umoya Wellness Spa',
    pageDescription:
      'Body contouring, medical wellness, and aesthetic treatments. Explore every service Umoya Wellness Spa offers.',
    grouped,
    breadcrumbs: crumbs,
    structuredData: [breadcrumbList(res.locals.siteOrigin, crumbs)],
  });
});

// The weight-loss service moved from an injectable GLP-1 peptide protocol to
// the OTC homeopathic THINNR protocol - redirect every prior slug straight to
// the current one so already-indexed/bookmarked links still resolve.
router.get('/glp3-weight-loss', (req, res) => res.redirect(301, '/services/thinnr-weight-loss'));
router.get('/glp1-weight-loss', (req, res) => res.redirect(301, '/services/thinnr-weight-loss'));

// Botox & Injectables was discontinued (Umoya no longer offers injectables) -
// send any existing link to the services hub rather than 404ing.
router.get('/botox', (req, res) => res.redirect(301, '/services'));

router.get('/:slug', (req, res, next) => {
  const service = services.find((s) => s.slug === req.params.slug);
  if (!service) return next();

  const otherServices = services.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 3);

  const fullService = { ...service, faq: [...(service.faq || []), pricingFaqEntry()] };
  const crumbs = [
    { name: 'Services', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ];

  res.render('pages/service-detail', {
    pageTitle: `${service.name} | Umoya Wellness Spa`,
    pageDescription: service.pitch,
    ogImage: service.heroImage,
    service: fullService,
    otherServices,
    breadcrumbs: crumbs,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: service.name,
        provider: { '@type': 'MedicalBusiness', name: site.brand.name },
        areaServed: 'South Salt Lake, UT',
        description: service.pitch,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: fullService.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      breadcrumbList(res.locals.siteOrigin, crumbs),
    ],
  });
});

module.exports = router;
