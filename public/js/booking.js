/* Booking form: POSTs to /book, which creates a Stripe Checkout Session and
   returns its URL - then redirects the browser there. Distinct from the
   generic .js-ajax-form handler in forms.js because success here means
   "navigate away to Stripe," not "show an inline success message." */
(function () {
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var status = form.querySelector('.form-status');
  var submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
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
