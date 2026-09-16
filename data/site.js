// Site-wide constants: contact info, socials, nav structure.
const services = require('./services');

module.exports = {
  brand: {
    name: 'Umoya Wellness Spa',
    shortName: 'Umoya',
    tagline: 'A sanctuary of rest, renewal, and radiance.',
  },
  contact: {
    phone: '(385) 282-9074',
    phoneHref: 'tel:+13852829074',
    email: 'umoyahelp@gmail.com',
    address: '2253 S State St Ste #7, South Salt Lake, UT 84115',
    mapEmbedSrc:
      'https://www.google.com/maps?q=2253+S+State+St+Ste+7,+South+Salt+Lake,+UT+84115&output=embed',
    hours: [
      { days: 'Tuesday - Saturday', time: '8:30 AM - 4:00 PM' },
      { days: 'Sunday', time: '2:00 PM - 7:00 PM' },
      { days: 'Monday', time: 'Closed' },
    ],
  },
  social: {
    instagram: 'https://www.instagram.com/yourumoya',
    instagramHandle: '@yourumoya',
  },
  // $30 deposit due at booking (via Stripe Checkout at /book); the remaining
  // balance is paid in person at the time of the appointment.
  booking: {
    depositAmount: 30,
    depositAmountFormatted: '$30',
  },
  nav: {
    services,
  },
};
