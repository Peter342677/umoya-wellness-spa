// Google Calendar integration via a service account: reads Cheryl's calendar
// to compute open slots (freebusy) and writes confirmed appointments to it.
// Requires the calendar to be shared with the service account email with
// "Make changes to events" permission - see README for setup steps.
const { google } = require('googleapis');

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'umoyahelp@gmail.com';

// The key can be provided either as the raw multi-line PEM (with literal \n
// escapes, as it appears in .env) or - more robustly, since hosting-panel
// text fields can mangle backslashes/newlines on paste - as a base64
// encoding of that same PEM. Base64 has no characters a web form could
// corrupt, so it's the recommended format for production.
function normalizePrivateKey(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith('-----BEGIN')) {
    return trimmed.replace(/\\n/g, '\n');
  }
  return Buffer.from(trimmed, 'base64').toString('utf8');
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) return null;

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: normalizePrivateKey(rawKey),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

function getCalendarClient() {
  const auth = getAuth();
  if (!auth) return null;
  return google.calendar({ version: 'v3', auth });
}

function isConfigured() {
  return !!getAuth();
}

// Returns an array of { start, end } ISO busy ranges, or null if the
// integration isn't configured (caller should fall back gracefully).
async function getBusyIntervals(timeMinISO, timeMaxISO) {
  const calendar = getCalendarClient();
  if (!calendar) return null;

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMinISO,
      timeMax: timeMaxISO,
      items: [{ id: CALENDAR_ID }],
    },
  });

  const cal = res.data.calendars && res.data.calendars[CALENDAR_ID];
  return (cal && cal.busy) || [];
}

// Creates a confirmed-appointment event on Cheryl's calendar. Attendees are
// deliberately omitted - a service account can't send calendar invites
// without domain-wide delegation, and the client already gets a confirmation
// email separately (see routes/stripeWebhook.js).
async function createAppointmentEvent({ summary, description, startISO, endISO }) {
  const calendar = getCalendarClient();
  if (!calendar) return null;

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary,
      description,
      start: { dateTime: startISO },
      end: { dateTime: endISO },
    },
  });
  return res.data;
}

module.exports = { getBusyIntervals, createAppointmentEvent, isConfigured, CALENDAR_ID };
