// Concierge Healthcare Services - a broader primary-care membership offering
// alongside Umoya's medspa treatments. Kept separate from data/services.js
// (the medspa catalog) since these aren't booked through the $50 deposit /
// Stripe flow - inquiries route to /contact instead.
module.exports = [
  {
    slug: 'primary-care',
    name: 'Primary Care',
    icon: 'heart',
    text:
      'A dedicated provider who actually knows your history. Unhurried visits, same-week availability, and a care plan built around you rather than a fifteen-minute time slot.',
  },
  {
    slug: 'weight-loss',
    name: 'Weight Loss',
    icon: 'trending',
    text:
      'Physician-directed weight management grounded in your labs, your metabolism, and your goals, integrated with the rest of your primary care rather than treated as a standalone program.',
  },
  {
    slug: 'lab-services',
    name: 'Lab Services',
    icon: 'flask',
    text:
      'Bloodwork and diagnostic testing coordinated for you, with results reviewed personally and explained in plain language, not left on a portal for you to interpret alone.',
  },
  {
    slug: 'urgent-care',
    name: 'Urgent Care',
    icon: 'cross',
    text:
      'Prompt attention for the illnesses and minor injuries that cannot wait for a routine appointment, without the waiting room of a walk-in clinic.',
  },
  {
    slug: 'behavioral-health',
    name: 'Behavioral Health',
    icon: 'mind',
    text:
      'Mental health support integrated into your overall care, so your emotional wellbeing is treated as part of your health, not a referral to somewhere else.',
  },
  {
    slug: 'dermatology',
    name: 'Dermatology',
    icon: 'skin',
    text:
      'Medical and clinical skin care for concerns that go beyond aesthetics, coordinated alongside any treatments you receive through the spa.',
  },
  {
    slug: 'prescription-discount-program',
    name: 'Prescription Discount Program',
    icon: 'pill',
    text:
      'Member savings on prescription medications, so the cost of staying on top of your health is one less thing to worry about.',
  },
];

// A single bookable entry representing an intro consultation, so the /book
// flow (built around data/services.js's medspa catalog) has one selectable
// option for Concierge Healthcare without listing all 7 sub-services as
// separately bookable appointments.
module.exports.bookingOption = {
  slug: 'concierge-consultation',
  category: 'Concierge Healthcare',
  name: 'Concierge Healthcare Consultation',
};
