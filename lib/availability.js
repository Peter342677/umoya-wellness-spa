// Computes open appointment slots for a given date: business hours minus
// whatever's already busy on Cheryl's Google Calendar minus a lead-time
// buffer for today. All slot math happens in Utah local time so DST shifts
// don't shift the displayed hours.
const { DateTime } = require('luxon');
const { getBusyIntervals } = require('./googleCalendar');

const TIME_ZONE = 'America/Denver';
const SLOT_STEP_MINUTES = 30; // candidate slot start times, e.g. 8:00, 8:30, 9:00...
const MIN_LEAD_TIME_MINUTES = 60; // can't book a slot starting less than an hour out
const BOOKING_WINDOW_DAYS = 14;

// Keyed by Luxon's ISO weekday (1 = Monday ... 7 = Sunday), matching
// data/site.js's hours (Tuesday-Saturday 8am-8pm, Sunday-Monday closed).
const BUSINESS_HOURS = {
  1: null,
  2: { start: 8, end: 20 },
  3: { start: 8, end: 20 },
  4: { start: 8, end: 20 },
  5: { start: 8, end: 20 },
  6: { start: 8, end: 20 },
  7: null,
};

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Returns { slots: [{ start, end, label }] } in UTC ISO strings, or
// { error: 'not_configured' | 'invalid_date' | 'out_of_range' }.
async function getAvailableSlots(dateStr, durationMinutes) {
  const date = DateTime.fromISO(dateStr, { zone: TIME_ZONE });
  if (!date.isValid) return { error: 'invalid_date' };

  const today = DateTime.now().setZone(TIME_ZONE).startOf('day');
  const maxDate = today.plus({ days: BOOKING_WINDOW_DAYS });
  if (date < today || date > maxDate) return { error: 'out_of_range' };

  const hours = BUSINESS_HOURS[date.weekday];
  if (!hours) return { slots: [] };

  const dayStart = date.set({ hour: hours.start, minute: 0, second: 0, millisecond: 0 });
  const dayEnd = date.set({ hour: hours.end, minute: 0, second: 0, millisecond: 0 });

  const busy = await getBusyIntervals(dayStart.toUTC().toISO(), dayEnd.toUTC().toISO());
  if (busy === null) return { error: 'not_configured' };

  const busyRanges = busy.map((b) => ({ start: DateTime.fromISO(b.start), end: DateTime.fromISO(b.end) }));
  const earliestStart = DateTime.now().setZone(TIME_ZONE).plus({ minutes: MIN_LEAD_TIME_MINUTES });

  const slots = [];
  let cursor = dayStart;
  while (cursor.plus({ minutes: durationMinutes }) <= dayEnd) {
    const slotEnd = cursor.plus({ minutes: durationMinutes });
    const tooSoon = cursor < earliestStart;
    const isBusy = busyRanges.some((b) => rangesOverlap(cursor, slotEnd, b.start, b.end));

    if (!tooSoon && !isBusy) {
      slots.push({
        start: cursor.toUTC().toISO(),
        end: slotEnd.toUTC().toISO(),
        label: cursor.toFormat('h:mm a'),
      });
    }
    cursor = cursor.plus({ minutes: SLOT_STEP_MINUTES });
  }

  return { slots };
}

module.exports = { getAvailableSlots, TIME_ZONE, BOOKING_WINDOW_DAYS };
