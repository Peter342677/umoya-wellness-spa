/* AJAX submission for lead-capture and contact forms, with inline status states. */
(function () {
  document.querySelectorAll('.js-ajax-form').forEach(function (form) {
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

      if (submitBtn) submitBtn.setAttribute('disabled', 'true');
      if (status) {
        status.className = 'form-status';
        status.textContent = '';
      }

      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (result) {
          if (result.ok && result.json.ok) {
            form.reset();
            if (status) {
              status.textContent = "Thank you - we've received your message and will be in touch shortly.";
              status.classList.add('is-success');
            }
          } else {
            throw new Error((result.json && result.json.error) || 'Something went wrong.');
          }
        })
        .catch(function (err) {
          if (status) {
            status.textContent = err.message || 'Something went wrong. Please try again or call us directly.';
            status.classList.add('is-error');
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.removeAttribute('disabled');
        });
    });
  });
})();
