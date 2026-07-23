// Shared email sending, used by the contact form and Stripe booking webhook.
// Falls back to appending a local JSON file when SMTP isn't configured (or
// the send fails), so nothing is silently lost during local development.
const nodemailer = require('nodemailer');
const { appendJsonEntry } = require('./jsonStore');

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

// opts: { to, subject, text, replyTo, fallbackFile, fallbackEntry }
async function sendNotification(opts) {
  const transporter = getTransporter();
  if (!transporter) {
    if (opts.fallbackFile) appendJsonEntry(opts.fallbackFile, opts.fallbackEntry);
    return { sent: false, reason: 'smtp-not-configured' };
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
    });
    return { sent: true };
  } catch (err) {
    console.error('Mail send failed, falling back to local storage:', err.message);
    if (opts.fallbackFile) appendJsonEntry(opts.fallbackFile, opts.fallbackEntry);
    return { sent: false, reason: 'send-failed', error: err.message };
  }
}

module.exports = { getTransporter, sendNotification };
