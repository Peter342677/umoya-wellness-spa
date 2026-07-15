/*
 * Custom cursor - a small gold dot with a trailing ring that eases toward the
 * pointer (lerp follower). On [data-cursor] targets the ring grows and shows
 * a soft label ("View" / "Book" / "Drag"). Disabled on touch devices and for
 * prefers-reduced-motion; pauses when the tab is hidden.
 */
(function () {
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || reducedMotion) {
    document.body.classList.remove('has-custom-cursor');
    return;
  }

  var canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var cursorLabel = document.getElementById('cursor-label');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = window.innerWidth;
  var height = window.innerHeight;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  var pointer = { x: width / 2, y: height / 2 };
  var ringPos = { x: pointer.x, y: pointer.y };
  var ringRadius = 18;
  var hoverState = null; // null | 'view' | 'book' | 'drag'

  window.addEventListener('mousemove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  document.addEventListener('mouseover', function (e) {
    var target = e.target.closest('[data-cursor]');
    hoverState = target ? target.getAttribute('data-cursor') : null;
  });

  var GOLD = '#b89768';
  var CREAM = '#f3ede4';

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Ring lags behind the pointer.
    ringPos.x += (pointer.x - ringPos.x) * 0.16;
    ringPos.y += (pointer.y - ringPos.y) * 0.16;

    var targetRadius = hoverState ? 32 : 18;
    ringRadius += (targetRadius - ringRadius) * 0.18;

    // Filled soft disc when hovering (label sits on top of it).
    if (hoverState) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(216,192,154,0.92)';
      ctx.arc(ringPos.x, ringPos.y, ringRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dot tracks the pointer exactly.
      ctx.beginPath();
      ctx.fillStyle = GOLD;
      ctx.arc(pointer.x, pointer.y, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(184,151,104,0.85)';
      ctx.lineWidth = 1.25;
      ctx.arc(ringPos.x, ringPos.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (cursorLabel) {
      if (hoverState) {
        cursorLabel.textContent = hoverState.toUpperCase();
        cursorLabel.style.transform = 'translate(' + ringPos.x + 'px,' + ringPos.y + 'px) translate(-50%,-50%)';
        cursorLabel.classList.add('is-visible');
      } else {
        cursorLabel.classList.remove('is-visible');
      }
    }
  }

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  function loop() {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
