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
    slug: 'red-light-therapy',
    category: 'Aesthetics',
    name: 'Red Light Therapy',
    shortName: 'Red Light',
    tagline: 'Low-level light therapy for brighter, firmer, more even-toned skin.',
    pitch:
      'Red light therapy uses low-level wavelengths to stimulate collagen production and circulation, supporting brighter, firmer, more even-toned skin, with no needles, no downtime, and no discomfort.',
    heroImage: '/assets/images/services/red-light-therapy.jpg',
    included: [
      'RN consultation to confirm candidacy and goals',
      'A full-body or targeted red light therapy session',
      'Guidance on session frequency for your goals',
      'Can be paired with other services as part of your wellness plan',
      'Comfortable, relaxing, zero-downtime experience',
    ],
    faq: [
      { q: 'What does red light therapy help with?', a: 'Clients use it for skin tone and texture, fine lines, and circulation. Results build gradually over a series of sessions.' },
      { q: 'Is there any downtime?', a: 'None. Sessions are comfortable and relaxing, and you can resume normal activity immediately.' },
    ],
  },
  {
    slug: 'wellness-testing-labs',
    category: 'Medical Wellness',
    name: 'Wellness Testing Labs',
    shortName: 'Lab Testing',
    tagline: 'Bloodwork and diagnostic testing, reviewed personally and explained in plain language.',
    pitch:
      'Know your body before you build a plan around it. Cheryl coordinates bloodwork and diagnostic testing for you, then reviews the results with you personally, in plain language, not left on a portal for you to interpret alone.',
    heroImage: '/assets/images/services/wellness-testing-labs.jpg',
    included: [
      'RN consultation to determine which labs are right for you',
      'Bloodwork and diagnostic testing coordination',
      'Personal, plain-language review of your results with Cheryl',
      'A plan built around what your labs actually show',
      'Can be paired with your THINNR protocol or any other Umoya service',
    ],
    faq: [
      { q: 'Do I need labs before starting a protocol?', a: 'In many cases, yes. Cheryl will let you know what testing makes sense at your consultation.' },
      { q: 'Will you explain my results to me?', a: 'Yes. Every result is reviewed with you personally, in plain language, not left on a portal for you to interpret alone.' },
    ],
  },
];

module.exports = services;
