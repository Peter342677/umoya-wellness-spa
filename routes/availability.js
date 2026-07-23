const express = require('express');
const router = express.Router();

const { getAvailableSlots, BOOKING_WINDOW_DAYS } = require('../lib/availability');
const { isConfigured } = require('../lib/googleCalendar');

const DEFAULT_DURATION_MINUTES = 60;

router.get('/api/availability', async (req, res) => {
  if (!isConfigured()) {
    return res.json({ ok: true, configured: false, slots: [] });
  }

  const date = typeof req.query.date === 'string' ? req.query.date : '';
  if (!date) {
    return res.status(400).json({ ok: false, error: 'Missing date.' });
  }

  try {
    const result = await getAvailableSlots(date, DEFAULT_DURATION_MINUTES);
    if (result.error === 'invalid_date') {
      return res.status(400).json({ ok: false, error: 'Invalid date.' });
    }
    if (result.error === 'out_of_range') {
      return res.json({ ok: true, configured: true, slots: [], bookingWindowDays: BOOKING_WINDOW_DAYS });
    }
    res.json({ ok: true, configured: true, slots: result.slots, bookingWindowDays: BOOKING_WINDOW_DAYS });
  } catch (err) {
    console.error('Availability lookup failed:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load availability right now. Please call us to book.' });
  }
});

module.exports = router;
