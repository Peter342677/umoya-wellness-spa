/* Draggable / auto-advancing testimonial carousel with dot nav and card-tilt-on-drag. */
(function () {
  document.querySelectorAll('.testimonials').forEach(function (root) {
    var track = root.querySelector('.testimonials__track');
    var dotsWrap = root.querySelector('.testimonials__nav');
    var cards = Array.prototype.slice.call(track.querySelectorAll('.testimonial-card'));
    if (!track || !cards.length) return;

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () { scrollToCard(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollToCard(i) {
      track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }

    function updateActiveDot() {
      var trackCenter = track.scrollLeft + track.clientWidth / 2;
      var closest = 0;
      var closestDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(card.offsetLeft + card.clientWidth / 2 - trackCenter);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === closest); });
    }
    track.addEventListener('scroll', updateActiveDot, { passive: true });

    // ---------- Drag to scroll + subtle card tilt ----------
    var isDown = false;
    var startX = 0;
    var scrollStart = 0;

    track.addEventListener('pointerdown', function (e) {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.clientX;
      scrollStart = track.scrollLeft;
    });
    window.addEventListener('pointerup', function () {
      isDown = false;
      track.classList.remove('is-dragging');
      cards.forEach(function (c) { c.style.transform = ''; });
    });
    window.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      track.scrollLeft = scrollStart - dx;
      var tilt = Math.max(-4, Math.min(4, dx * 0.03));
      cards.forEach(function (c) { c.style.transform = 'rotate(' + tilt + 'deg)'; });
    });

    // ---------- Auto-advance ----------
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      var autoTimer = setInterval(function () {
        if (isDown) return;
        var next = (dots.findIndex(function (d) { return d.classList.contains('is-active'); }) + 1) % cards.length;
        scrollToCard(next);
      }, 6000);
      track.addEventListener('pointerdown', function () { clearInterval(autoTimer); });
    }
  });
})();
