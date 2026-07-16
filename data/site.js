// Site-wide constants: contact info, socials, nav structure, booking link.
const services = require('./services');
const { BOOKING_URL } = services;

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
      { days: 'Tuesday - Friday', time: '8:00 AM - 8:00 PM' },
      { days: 'Saturday', time: '8:00 AM - 8:00 PM' },
      { days: 'Sunday - Monday', time: 'Closed' },
    ],
  },
  social: {
    instagram: 'https://www.instagram.com/yourumoya',
    instagramHandle: '@yourumoya',
  },
  bookingUrl: BOOKING_URL,
  // $50 deposit due at booking (via Stripe Checkout at /book); the remaining
  // balance is paid in person at the time of the appointment.
  booking: {
    depositAmount: 50,
    depositAmountFormatted: '$50',
  },
  nav: {
    services,
  },
};
