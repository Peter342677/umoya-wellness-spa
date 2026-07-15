/* Small glue script: default cursor-state hints for elements that don't
   explicitly set data-cursor in markup. */
(function () {
  document.querySelectorAll('.service-card:not([data-cursor])').forEach(function (el) {
    el.setAttribute('data-cursor', 'view');
  });
  document.querySelectorAll('.news-card:not([data-cursor])').forEach(function (el) {
    el.setAttribute('data-cursor', 'read');
  });
  document.querySelectorAll('.testimonials__track:not([data-cursor])').forEach(function (el) {
    el.setAttribute('data-cursor', 'drag');
  });
  document.querySelectorAll('a[href*="vagaro.com"]:not([data-cursor])').forEach(function (el) {
    el.setAttribute('data-cursor', 'book');
  });

  // Hero background video: don't play (or keep downloading) for users who
  // prefer reduced motion - the CSS already hides it, this stops the media.
  // Also pause while the tab is hidden to save battery.
  var heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
      heroVideo.querySelectorAll('source').forEach(function (s) { s.remove(); });
      heroVideo.load();
    } else {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) heroVideo.pause();
        else heroVideo.play().catch(function () {});
      });
    }
  }
})();
