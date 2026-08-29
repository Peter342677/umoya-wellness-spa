// Service catalog - data-driven source for /services and /services/:slug
// Add a new service by adding an object here; no new template needed.

const services = [
  {
    slug: 't-shape-2-body-contouring',
    category: 'Body Contouring',
    flagship: true,
    name: 'T-Shape 2 Body Contouring',
    shortName: 'Body Contouring',
    tagline: 'Italian-engineered contouring for face, abdomen, arms, legs & buttocks, with zero downtime.',
    pitch:
      'The T-Shape 2 is a precision Italian body-sculpting system that combines radiofrequency, ultrasound cavitation, and vacuum massage to visibly contour and firm the face and body with zero downtime, so you can walk in on a lunch break and walk right back out.',
    heroImage: '/assets/images/services/t-shape-2.jpg',
    included: [
      'Full-body consultation and treatment mapping with an RN',
      'Radiofrequency skin tightening across face and body',
      'Ultrasound cavitation to target stubborn fat pockets',
      'Vacuum lymphatic massage to reduce fluid retention and smooth texture',
      'Zero downtime: resume normal activity immediately after each session',
    ],
    faq: [
      { q: 'How many sessions will I need?', a: 'Most clients see initial results within 1-3 sessions, with a full course of 6-8 sessions recommended for lasting contouring. Cheryl builds your plan at your consultation, not before.' },
      { q: 'Is this the same as surgery?', a: 'No. T-Shape 2 is a non-invasive, non-surgical body contouring treatment. It will not replace surgical results for significant excess skin, but it is highly effective for tightening, smoothing, and reducing stubborn fat with no recovery time.' },
      { q: 'Which areas can be treated?', a: 'Face, neck, abdomen, arms, legs, and buttocks are all treatable with the T-Shape 2 system, and sessions can combine multiple areas in one visit.' },
    ],
  },
  {
    slug: 'face-contouring',
    category: 'Body Contouring',
    name: 'Face Contouring',
    shortName: 'Face Contouring',
    tagline: 'Lift, tighten, and define: a gentler path to a sculpted profile.',
    pitch:
      'Using the same T-Shape 2 radiofrequency technology in a precision facial protocol, we lift, tighten, and define the jawline, cheeks, and neck, restoring a sculpted profile without needles or downtime.',
    heroImage: '/assets/images/services/face-contouring.jpg',
    included: [
      'RN consultation to map facial concerns and goals',
      'Radiofrequency treatment to tighten and lift the jawline, cheeks, and neck',
      'Circulation-boosting massage to support natural collagen response',
      'A calming, spa-forward experience with no needles and no downtime',
      'A visit-by-visit plan built around your skin and timeline',
    ],
    faq: [
      { q: 'Will this feel like a facial?', a: 'Yes. Most clients describe it as a warm, relaxing massage. There is no discomfort and no recovery period.' },
      { q: 'When will I see results?', a: 'Many clients notice initial tightening after the first session, with cumulative improvement over a recommended series of visits.' },
    ],
  },
  {
    slug: 'thinnr-weight-loss',
    category: 'Medical Wellness',
    name: 'THINNR Weight Loss',
    shortName: 'Weight Loss',
    tagline: 'A homeopathic, drop-based weight-loss protocol - no needles required.',
    pitch:
      'THINNR pairs an OTC homeopathic protocol with a structured, low-glycemic nutrition plan, guided by Cheryl at every step. Oral drops instead of injections, with an honest, RN-guided approach to sustainable weight management, not a quick fix.',
    heroImage: '/assets/images/services/thinnr-weight-loss.jpg',
    included: [
      'In-depth intake and health history review with Cheryl, RN',
      'Personalized THINNR protocol across its four guided phases',
      'Structured, low-glycemic nutrition guidance alongside your drops',
      'Regular check-ins to monitor progress and adjust your plan',
      'Honest expectation-setting with no rushed appointments and no guesswork',
    ],
    faq: [
      { q: 'Is this an injectable weight-loss medication?', a: 'No. THINNR is an OTC homeopathic protocol taken as oral drops, not an injection or prescription medication.' },
      { q: 'Do I need a prescription?', a: 'No prescription is required. Cheryl still guides your intake and check-ins so the protocol is appropriate for you and your goals.' },
      { q: 'Will I need an initial consultation?', a: 'Yes, a full consultation is required before starting so we can confirm the protocol is appropriate for you.' },
    ],
  },
  {
    slug: 'teeth-whitening',
    category: 'Aesthetics',
    name: 'Teeth Whitening',
    shortName: 'Teeth Whitening',
    tagline: 'Pharmaceutical-strength whitening in a single 45-60 minute session.',
    pitch:
      'Our pharmaceutical-strength teeth whitening treatment delivers visibly brighter results in a single 45-60 minute session. A fast, comfortable way to finish off your visit with a brighter smile.',
    heroImage: '/assets/images/services/teeth-whitening.jpg',
    included: [
      'Shade assessment and sensitivity check',
      'Pharmaceutical-strength whitening gel application',
      'Single-session treatment, 45-60 minutes',
      'Aftercare guidance to extend your results',
      'Comfortable, spa-setting experience',
    ],
    faq: [
      { q: 'How much whiter will my teeth be?', a: 'Most clients see several shades of improvement in a single session, visible immediately after treatment.' },
      { q: 'Is it safe for sensitive teeth?', a: 'We assess sensitivity before treatment and adjust the protocol accordingly. Let us know about any concerns at booking.' },
    ],
  },
  {
    slug: 'peptides',
    category: 'Medical Wellness',
    name: 'Peptide Therapy',
    shortName: 'Peptides',
    tagline: 'Targeted peptide protocols for recovery, energy, and healthy aging.',
    pitch:
      'Peptide therapy uses targeted, naturally occurring compounds to support recovery, energy, sleep quality, and healthy aging. Every protocol is built around your bloodwork and goals under RN supervision.',
    heroImage: '/assets/images/services/peptides.jpg',
    included: [
      'Comprehensive intake and goal-setting consultation',
      'Peptide protocol selection matched to your health goals',
      'Ongoing clinical monitoring and dose adjustment',
      'Education on administration and expected timeline',
      'Integration with other Umoya services as needed',
    ],
    faq: [
      { q: 'What are peptides used for?', a: 'Common goals include recovery and healing, energy and metabolism, sleep quality, and general anti-aging support. We’ll match a protocol to your specific goal.' },
      { q: 'Do I need bloodwork first?', a: 'In many cases, yes. Cheryl will let you know what’s needed at your consultation to build a protocol that’s appropriate for you.' },
    ],
  },
];

module.exports = services;
