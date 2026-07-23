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
    slug: 'glp3-weight-loss',
    category: 'Medical Wellness',
    name: 'GLP-3 Weight Loss',
    shortName: 'Weight Loss',
    tagline: 'Clinically supervised peptide protocol for sustainable weight management.',
    pitch:
      'Our clinically supervised GLP-3 peptide protocol supports appetite regulation and metabolic health under the direct oversight of an RN. A medically guided, honest approach to sustainable weight management, not a quick fix.',
    heroImage: '/assets/images/services/glp3-weight-loss.jpg',
    included: [
      'In-depth intake and health history review with Cheryl, RN',
      'Personalized dosing protocol with ongoing clinical supervision',
      'Regular check-ins to monitor progress and adjust your plan',
      'Nutrition and lifestyle guidance alongside your protocol',
      'Honest expectation-setting with no rushed appointments and no guesswork',
    ],
    faq: [
      { q: 'Is this protocol medically supervised?', a: 'Yes. Every client is evaluated and monitored by Cheryl Johnson, RN-BSN-FAACM, throughout the entire protocol.' },
      { q: 'How is this different from other weight-loss programs?', a: 'This is a clinical protocol grounded in your individual health history, not a one-size-fits-all program. Your plan is built and adjusted around your bloodwork, goals, and response.' },
      { q: 'Will I need an initial consultation?', a: 'Yes, a full consultation is required before starting so we can confirm the protocol is appropriate for you.' },
    ],
  },
  {
    slug: 'glutathione-injections',
    category: 'Medical Wellness',
    name: 'Glutathione Injections',
    shortName: 'Glutathione',
    tagline: 'The master antioxidant, for brighter skin and full-body detox support.',
    pitch:
      'Glutathione is the body’s master antioxidant. Our injections support cellular detoxification, immune health, and a brighter, more even-toned complexion, administered by an RN as part of a broader wellness plan.',
    heroImage: '/assets/images/services/glutathione.jpg',
    included: [
      'RN consultation to confirm candidacy and goals',
      'Precision injection of pharmaceutical-grade glutathione',
      'Guidance on injection frequency for your goals',
      'Support for detoxification, immune function, and skin brightness',
      'Can be paired with other services as part of your wellness plan',
    ],
    faq: [
      { q: 'What can I expect to notice?', a: 'Many clients report brighter, more even-toned skin and a general sense of improved energy over a course of injections.' },
      { q: 'How often are injections given?', a: 'Frequency depends on your goals and is set during your consultation. Typically weekly to start, with maintenance sessions after.' },
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
  {
    slug: 'botox',
    category: 'Aesthetics',
    name: 'Botox & Injectables',
    shortName: 'Botox',
    tagline: 'Subtle, natural-looking results from an experienced RN injector.',
    pitch:
      'Administered by an experienced RN injector, our Botox and injectable treatments soften fine lines and refresh your look with a light, natural hand. Never overdone.',
    heroImage: '/assets/images/services/botox.jpg',
    included: [
      'In-depth facial assessment and consultation',
      'Precision injection technique for a natural result',
      'Treatment areas: forehead, glabella, crow’s feet, and more',
      'Honest guidance on what will and won’t achieve your goal',
      'Follow-up check available to confirm your results',
    ],
    faq: [
      { q: 'Will my results look natural?', a: 'Yes. Our approach favors subtle, natural movement over a "frozen" look. We’ll walk through your goals together before any injection.' },
      { q: 'How long do results last?', a: 'Typically 3-4 months, though this varies by individual and treatment area.' },
    ],
  },
];

module.exports = services;
