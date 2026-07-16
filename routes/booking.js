// Booking + $50 deposit flow.
// Flow: /book (form) -> POST /book (creates a Stripe Checkout Session,
// returns its URL) -> Stripe-hosted checkout -> /book/success or /book?canceled=1.
// The booking is only considered confirmed once the Stripe webhook fires
// (see routes/stripeWebhook.js) - the success page is a courtesy, not the
// source of truth, since a user can close the tab right after paying.
const express = require('express');
const router = express.Router();

const services = require('../data/services');
const site = require('../data/site');

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

router.get('/book', (req, res) => {
  const selectedSlug = typeof req.query.service === 'string' ? req.query.service : '';
  const selectedService = services.find((s) => s.slug === selectedSlug) || null;

  res.render('pages/book', {
    pageTitle: 'Book Your Appointment | Umoya Wellness Spa',
    pageDescription:
      'Reserve your appointment at Umoya Wellness Spa with a $50 deposit. The remaining balance is paid at the time of your visit.',
    services,
    selectedService,
    canceled: req.query.canceled === '1',
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
  });
});

router.post('/book', async (req, res) => {
  const { name, email, phone, serviceSlug, preferredDate, preferredTime, notes } = req.body;

  if (!name || !email || !phone || !serviceSlug) {
    return res.status(400).json({ ok: false, error: 'Name, email, phone, and service are required.' });
  }

  const service = services.find((s) => s.slug === serviceSlug);
  if (!service) {
    return res.status(400).json({ ok: false, error: 'Please select a valid service.' });
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({
      ok: false,
      error: 'Online booking payments are temporarily unavailable. Please call us at ' + site.contact.phone + ' to book.',
    });
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${service.name} - Booking Deposit`,
              description: 'Reserves your appointment. The remaining balance is due at the time of your visit.',
            },
            unit_amount: site.booking.depositAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        serviceSlug: service.slug,
        serviceName: service.name,
        name,
        email,
        phone,
        preferredDate: preferredDate || '',
        preferredTime: preferredTime || '',
        notes: notes || '',
      },
      success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book?canceled=1&service=${encodeURIComponent(service.slug)}`,
    });

    return res.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('Stripe checkout session creation failed:', err.message);
    return res.status(500).json({ ok: false, error: 'Something went wrong starting checkout. Please try again or call us.' });
  }
});

router.get('/book/success', async (req, res) => {
  const stripe = getStripe();
  const sessionId = req.query.session_id;
  let details = null;

  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      details = {
        serviceName: session.metadata && session.metadata.serviceName,
        email: session.customer_details && session.customer_details.email,
        amountPaid: (session.amount_total / 100).toFixed(2),
        paymentStatus: session.payment_status,
      };
    } catch (err) {
      console.error('Could not retrieve checkout session:', err.message);
    }
  }

  res.render('pages/book-success', {
    pageTitle: 'Booking Received | Umoya Wellness Spa',
    pageDescription: 'Your deposit has been received - we will be in touch to confirm your appointment.',
    details,
  });
});

module.exports = router;
