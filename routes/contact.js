const express = require('express');
const router = express.Router();
const path = require('path');

const { sendNotification } = require('../lib/mailer');

const SUBMISSIONS_FILE = path.join(__dirname, '..', 'data', 'submissions', 'submissions.json');
const TO_ADDRESS = process.env.CONTACT_TO_EMAIL || 'umoyahelp@gmail.com';

router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    pageTitle: 'Contact | Umoya Wellness Spa',
    pageDescription:
      'Visit Umoya Wellness Spa in South Salt Lake, Utah, or send us a message. We typically respond within one business day.',
  });
});

// TODO: swap the local-file fallback for a real CRM integration
// (e.g. push straight into the Vagaro/CRM lead pipeline).
router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ ok: false, error: 'Name and email are required.' });
  }

  const entry = {
    name,
    email,
    phone: phone || '',
    message: message || '',
    submittedAt: new Date().toISOString(),
  };

  const result = await sendNotification({
    to: TO_ADDRESS,
    replyTo: email,
    subject: `New contact submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nMessage: ${message || '-'}`,
    fallbackFile: SUBMISSIONS_FILE,
    fallbackEntry: entry,
  });

  return res.json({ ok: true, fallback: !result.sent });
});

module.exports = router;
