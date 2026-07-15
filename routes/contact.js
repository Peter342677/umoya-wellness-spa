const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const SUBMISSIONS_FILE = path.join(__dirname, '..', 'data', 'submissions', 'submissions.json');

function saveSubmissionLocally(entry) {
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
  } catch (e) {
    existing = [];
  }
  existing.push(entry);
  fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(existing, null, 2));
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    pageTitle: 'Contact | Umoya Wellness Spa',
    pageDescription:
      'Visit Umoya Wellness Spa in South Salt Lake, Utah, or send us a message. We typically respond within one business day.',
  });
});

// TODO: swap saveSubmissionLocally/nodemailer for a real email/CRM integration
// (e.g. SendGrid, or push straight into the Vagaro/CRM lead pipeline).
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

  const transporter = getTransporter();
  const toAddress = process.env.CONTACT_TO_EMAIL || 'umoyahelp@gmail.com';

  try {
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toAddress,
        replyTo: email,
        subject: `New contact submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nMessage: ${message || '-'}`,
      });
    } else {
      saveSubmissionLocally(entry);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Mail send failed, falling back to local storage:', err.message);
    saveSubmissionLocally(entry);
    return res.json({ ok: true, fallback: true });
  }
});

module.exports = router;
