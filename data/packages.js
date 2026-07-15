// Bundled treatment packages - pricing is intentionally omitted (real pricing
// TBD by the client); every card routes to booking to inquire.
module.exports = [
  {
    slug: 'glow-starter-detox',
    name: 'Glow Starter Detox',
    tagline: 'A first-step reset for skin, energy, and total-body radiance.',
    description:
      'Our entry point into medical wellness: a curated first series pairing glutathione for detox and brightness with a face contouring session, designed to introduce you to the Umoya approach.',
    includes: ['3 Glutathione Injections', '1 Face Contouring Session', 'Personalized aftercare guidance'],
    badge: 'Most Popular',
  },
  {
    slug: 'sculpt-and-sustain',
    name: 'Sculpt & Sustain',
    tagline: 'A full contouring series built for visible, lasting change.',
    description:
      'A structured series of T-Shape 2 body contouring sessions across your target areas, spaced for optimal results and paired with lymphatic support between visits.',
    includes: ['6 T-Shape 2 Body Contouring Sessions', 'Treatment mapping consultation', 'Progress check-ins'],
  },
  {
    slug: 'radiant-renewal',
    name: 'Radiant Renewal',
    tagline: 'A brightening, tightening combination for face-forward results.',
    description:
      'Face contouring and glutathione work together in this package to lift, tighten, and brighten. A favorite before events, reunions, or simply a fresh start.',
    includes: ['3 Face Contouring Sessions', '3 Glutathione Injections', 'A finishing Teeth Whitening session'],
  },
  {
    slug: 'wellness-membership',
    name: 'Monthly Wellness Membership',
    tagline: 'Ongoing medical wellness support, built around your goals.',
    description:
      'For clients on a GLP-3 or peptide protocol, this membership bundles your monthly clinical check-ins, dosing, and adjustments into one ongoing plan of care.',
    includes: ['Monthly RN check-in and protocol review', 'Dosing and adjustments as needed', 'Priority scheduling'],
  },
];
