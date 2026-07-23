/* Booking form: POSTs to /book, which creates a Stripe Checkout Session and
   returns its URL - then redirects the browser there. Distinct from the
   generic .js-ajax-form handler in forms.js because success here means
   "navigate away to Stripe," not "show an inline success message." */
(function () {
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var status = form.querySelector('.form-status');
  var submitBtn = form.querySelector('[type="submit"]');

  /* Slot picker: only active when #bk-slot-mode is present and visible
     (server renders it visible when Google Calendar is configured). Falls
     back to the plain preferred date/time fields otherwise. */
  var slotMode = document.getElementById('bk-slot-mode');
  var slotModeActive = !!slotMode && slotMode.style.display !== 'none';
  var calendarEl = document.getElementById('bk-calendar');
  var slotsContainer = document.getElementById('bk-slots');
  var slotStatus = document.getElementById('bk-slot-status');
  var slotStartField = document.getElementById('bk-slot-start');
  var slotEndField = document.getElementById('bk-slot-end');

  function parseISODate(str) {
    var parts = str.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function toISODate(y, m, d) {
    var mm = m + 1 < 10 ? '0' + (m + 1) : String(m + 1);
    var dd = d < 10 ? '0' + d : String(d);
    return y + '-' + mm + '-' + dd;
  }

  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* Inline month-grid calendar (replaces the native <input type="date">
     dropdown so open dates are visible at a glance). Closed weekdays
     (Sunday/Monday) are grayed out client-side to match the business hours
     in lib/availability.js's BUSINESS_HOURS - keep these in sync. */
  function initCalendar(el) {
    var minDate = parseISODate(el.getAttribute('data-min'));
    var maxDate = parseISODate(el.getAttribute('data-max'));
    var viewYear = minDate.getFullYear();
    var viewMonth = minDate.getMonth();
    var selectedStr = null;

    var titleEl = document.getElementById('bk-cal-title');
    var daysEl = document.getElementById('bk-cal-days');
    var prevBtn = document.getElementById('bk-cal-prev');
    var nextBtn = document.getElementById('bk-cal-next');

    function selectDay(dateStr, btnEl) {
      var prevSelected = daysEl.querySelector('.booking-calendar__day.is-selected');
      if (prevSelected) prevSelected.classList.remove('is-selected');
      btnEl.classList.add('is-selected');
      selectedStr = dateStr;
      slotStartField.value = '';
      slotEndField.value = '';
      loadSlots(dateStr);
    }

    function render() {
      titleEl.textContent = MONTH_NAMES[viewMonth] + ' ' + viewYear;
      daysEl.innerHTML = '';

      var firstOfMonth = new Date(viewYear, viewMonth, 1);
      var startWeekday = firstOfMonth.getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      for (var i = 0; i < startWeekday; i++) {
        var empty = document.createElement('span');
        empty.className = 'booking-calendar__day booking-calendar__day--empty';
        daysEl.appendChild(empty);
      }

      for (var day = 1; day <= daysInMonth; day++) {
        var cellDate = new Date(viewYear, viewMonth, day);
        var dateStr = toISODate(viewYear, viewMonth, day);
        var weekday = cellDate.getDay();
        var outOfRange = cellDate < minDate || cellDate > maxDate;
        var closed = weekday === 0 || weekday === 1;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'booking-calendar__day';
        btn.textContent = String(day);

        if (outOfRange || closed) {
          btn.disabled = true;
        } else {
          btn.setAttribute('data-date', dateStr);
          btn.addEventListener('click', function () {
            selectDay(this.getAttribute('data-date'), this);
          });
        }

        if (selectedStr === dateStr) btn.classList.add('is-selected');
        daysEl.appendChild(btn);
      }

      prevBtn.disabled = viewYear === minDate.getFullYear() && viewMonth === minDate.getMonth();
      nextBtn.disabled = viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth();
    }

    prevBtn.addEventListener('click', function () {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      render();
    });
    nextBtn.addEventListener('click', function () {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      render();
    });

    render();
  }

  if (slotModeActive && calendarEl) {
    initCalendar(calendarEl);
  }

  function loadSlots(dateStr) {
    if (!dateStr) return;
    slotsContainer.innerHTML = '';
    slotStatus.textContent = 'Loading open times...';

    fetch('/api/availability?date=' + encodeURIComponent(dateStr))
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok) throw new Error(json.error || 'Could not load availability.');

        if (!json.slots || !json.slots.length) {
          slotStatus.textContent = 'No open times that day - try another date, or call us at the number above.';
          return;
        }

        slotStatus.textContent = 'Select an available time:';
        json.slots.forEach(function (slot) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'slot-grid__btn';
          btn.textContent = slot.label;
          btn.addEventListener('click', function () {
            var prev = slotsContainer.querySelector('.slot-grid__btn.is-selected');
            if (prev) prev.classList.remove('is-selected');
            btn.classList.add('is-selected');
            slotStartField.value = slot.start;
            slotEndField.value = slot.end;
          });
          slotsContainer.appendChild(btn);
        });
      })
      .catch(function (err) {
        slotStatus.textContent = err.message || 'Could not load availability. Please call us to book.';
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (slotModeActive && !slotStartField.value) {
      if (status) {
        status.className = 'form-status is-error';
        status.textContent = 'Please choose a date and an available time.';
      }
      return;
    }

    var data = new FormData(form);
    var payload = {};
    data.forEach(function (value, key) { payload[key] = value; });

    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'Redirecting to payment...';
    }
    if (status) {
      status.className = 'form-status';
      status.textContent = '';
    }

    fetch('/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
      .then(function (result) {
        if (result.ok && result.json.ok && result.json.url) {
          window.location.href = result.json.url;
          return;
        }
        throw new Error((result.json && result.json.error) || 'Something went wrong. Please try again.');
      })
      .catch(function (err) {
        if (status) {
          status.textContent = err.message;
          status.classList.add('is-error');
        }
        if (submitBtn) {
          submitBtn.removeAttribute('disabled');
          submitBtn.textContent = 'Continue to Payment';
        }
      });
  });
})();
