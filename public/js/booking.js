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
  var slotDateInput = document.getElementById('bk-slot-date');
  var slotsContainer = document.getElementById('bk-slots');
  var slotStatus = document.getElementById('bk-slot-status');
  var slotStartField = document.getElementById('bk-slot-start');
  var slotEndField = document.getElementById('bk-slot-end');

  if (slotModeActive && slotDateInput) {
    slotDateInput.addEventListener('change', function () {
      slotStartField.value = '';
      slotEndField.value = '';
      loadSlots(slotDateInput.value);
    });
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
