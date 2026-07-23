// Stripe webhook: the source of truth for a booking deposit actually being
// paid (the /book/success page is just a courtesy redirect - a closed tab
// or flaky connection there must not be able to skip this). Mounted in
// server.js with express.raw() BEFORE the global express.json() parser,
// because signature verification needs the exact raw request bytes.
const express = require('express');
const router = express.Router();
const path = require('path');

const site = require('../data/site');
const { sendNotification } = require('../lib/mailer');
const { appendJsonEntry } = require('../lib/jsonStore');

const BOOKINGS_FILE = path.join(__dirname, '..', 'data', 'submissions', 'bookings.json');
const NOTIFY_ADDRESS = process.env.CONTACT_TO_EMAIL || 'umoyahelp@gmail.com';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

router.post('/webhooks/stripe', async (req, res) => {
  const stripe = getStripe();
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook received but STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET are not configured.');
    return res.status(500).send('Webhook not configured.');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};

    const booking = {
      serviceSlug: meta.serviceSlug || '',
      serviceName: meta.serviceName || '',
      name: meta.name || '',
      email: meta.email || session.customer_email || '',
      phone: meta.phone || '',
      preferredDate: meta.preferredDate || '',
      preferredTime: meta.preferredTime || '',
      notes: meta.notes || '',
      depositPaid: ((session.amount_total || 0) / 100).toFixed(2),
      stripeSessionId: session.id,
      paidAt: new Date().toISOString(),
    };

    // Persist first, unconditionally - this record must exist regardless of
    // whether the notification email below succeeds or SMTP is configured.
    appendJsonEntry(BOOKINGS_FILE, booking);

    await sendNotification({
      to: NOTIFY_ADDRESS,
      replyTo: booking.email,
      subject: `New booking deposit paid: ${booking.serviceName} (${booking.name})`,
      text:
        `A $${booking.depositPaid} deposit has been paid and a new appointment needs to be confirmed.\n\n` +
        `Service: ${booking.serviceName}\n` +
        `Name: ${booking.name}\n` +
        `Email: ${booking.email}\n` +
        `Phone: ${booking.phone}\n` +
        `Preferred date: ${booking.preferredDate || '-'}\n` +
        `Preferred time: ${booking.preferredTime || '-'}\n` +
        `Notes: ${booking.notes || '-'}\n\n` +
        `Stripe session: ${booking.stripeSessionId}`,
    });

    // Best-effort confirmation to the customer - failure here shouldn't fail the webhook.
    if (booking.email) {
      sendNotification({
        to: booking.email,
        subject: `Your Umoya Wellness Spa deposit is confirmed`,
        text:
          `Hi ${booking.name},\n\n` +
          `We've received your $${booking.depositPaid} deposit for ${booking.serviceName}. ` +
          `The remaining balance will be due at the time of your visit.\n\n` +
          `We'll be in touch shortly to confirm your exact appointment time` +
          (booking.preferredDate ? ` (you requested ${booking.preferredDate}${booking.preferredTime ? ' at ' + booking.preferredTime : ''}).` : '.') +
          `\n\nQuestions in the meantime? Call us at ${site.contact.phone}.\n\n- Umoya Wellness Spa`,
      }).catch((err) => console.error('Customer confirmation email failed:', err.message));
    }
  }

  res.json({ received: true });
});

module.exports = router;
