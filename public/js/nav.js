/* Header scroll behavior (condense + solid background), scroll-progress bar,
   mobile menu toggle, mobile dropdown accordions. */
(function () {
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('navToggle');
  var navList = document.getElementById('mainNavList');
  var progressBar = document.querySelector('.scroll-progress__bar');

  // ---------- Scroll state: condense header + progress bar ----------
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 40);

    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? y / docHeight : 0;
      progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // ---------- Mobile menu toggle ----------
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close the menu when a link inside it is clicked.
    navList.addEventListener('click', function (e) {
      if (e.target.closest('a') && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Escape closes the menu.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ---------- Mobile dropdown accordions ----------
  document.querySelectorAll('.has-dropdown > .main-nav__dropdown-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth > 960) return;
      e.preventDefault();
      var parent = trigger.closest('.has-dropdown');
      var isOpen = parent.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
