const express = require('express');
const router = express.Router();

const services = require('../data/services');

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

  res.render('pages/services-hub', {
    pageTitle: 'Our Services | Umoya Wellness Spa',
    pageDescription:
      'Body contouring, medical wellness, and aesthetic treatments. Explore every service Umoya Wellness Spa offers.',
    grouped,
  });
});

router.get('/:slug', (req, res, next) => {
  const service = services.find((s) => s.slug === req.params.slug);
  if (!service) return next();

  const otherServices = services.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 3);

  res.render('pages/service-detail', {
    pageTitle: `${service.name} | Umoya Wellness Spa`,
    pageDescription: service.pitch,
    service,
    otherServices,
  });
});

module.exports = router;
