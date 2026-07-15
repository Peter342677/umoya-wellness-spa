/*
 * Progressive-enhancement page transition curtain.
 * Intercepts same-origin link clicks to play a brief wipe before navigating.
 * If JS is disabled, links behave as normal full page loads (no transition).
 */
(function () {
  var curtain = document.getElementById('page-transition');
  if (!curtain) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on load (curtain starts covering, then wipes away).
  requestAnimationFrame(function () {
    curtain.classList.add('is-active');
    requestAnimationFrame(function () {
      curtain.classList.add('is-leaving');
    });
  });

  if (reducedMotion) return;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || link.hasAttribute('download')) return;

    var url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return; // in-page anchor

    e.preventDefault();
    curtain.classList.remove('is-leaving');
    curtain.classList.add('is-active');
    setTimeout(function () { window.location.href = link.href; }, 480);
  });
})();
