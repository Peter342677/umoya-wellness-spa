/* Magnetic buttons - pull toward the cursor within a radius, spring back on leave. */
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (reducedMotion || isTouch || typeof gsap === 'undefined') return;

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.btn--magnetic');
    buttons.forEach(function (btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      var radius = 60;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.35);
        yTo(relY * 0.35);
      });

      btn.addEventListener('mouseleave', function () {
        xTo(0);
        yTo(0);
      });
    });
  });
})();
