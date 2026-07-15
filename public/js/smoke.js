/*
 * "Breath" mist effect - the site's signature, in keeping with the meaning of
 * Umoya (air / breath / spirit).
 *
 * A sparse field of soft, slow radial-gradient puffs in warm gold, cream, and
 * terracotta drifts upward continuously across the whole viewport. Moving the
 * cursor exhales extra puffs along its path, which grow, curl, and fade.
 *
 * Performance guardrails:
 *  - rAF loop pauses when the tab is hidden (Page Visibility API)
 *  - particle counts scale down on small screens
 *  - disabled entirely on touch devices and for prefers-reduced-motion
 *    (the CSS also hides the canvas in both cases)
 */
(function () {
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = window.innerWidth;
  var height = window.innerHeight;
  var isSmall = width < 720;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    isSmall = width < 720;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Warm palette - rgb triplets picked from the brand tokens.
  var TONES = [
    '184,151,104', // gold
    '243,237,228', // cream
    '201,139,107', // terracotta
  ];
  function pickTone() {
    var r = Math.random();
    // gold-weighted: gold 50%, cream 30%, terracotta 20%
    return r < 0.5 ? TONES[0] : r < 0.8 ? TONES[1] : TONES[2];
  }

  var pointer = { x: width / 2, y: height * 0.4 };
  var lastSpawnPoint = { x: pointer.x, y: pointer.y };
  var hasMoved = false;

  if (!isTouch) {
    window.addEventListener('mousemove', function (e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      hasMoved = true;
    });
  }

  // ---------- Ambient mist (always drifting, even with an idle cursor) ----------
  var AMBIENT_COUNT = isSmall ? 10 : 20;
  var ambient = [];

  function makeAmbientParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: 90 + Math.random() * 170,
      baseAlpha: 0.012 + Math.random() * 0.022,
      driftX: (Math.random() - 0.5) * 0.08,
      driftY: -0.02 - Math.random() * 0.05,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.0012 + Math.random() * 0.002,
      tone: pickTone(),
    };
  }
  for (var a = 0; a < AMBIENT_COUNT; a++) ambient.push(makeAmbientParticle());

  function drawAmbient() {
    for (var i = 0; i < ambient.length; i++) {
      var p = ambient[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.driftX + Math.sin(p.wobble) * 0.1;
      p.y += p.driftY;

      // Mist parts gently around the cursor.
      var dx = p.x - pointer.x;
      var dy = p.y - pointer.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var influenceRadius = 220;
      if (dist < influenceRadius && dist > 0.01) {
        var force = (1 - dist / influenceRadius) * 1.1;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      if (p.y < -p.r) { p.y = height + p.r; p.x = Math.random() * width; }
      if (p.x < -p.r) p.x = width + p.r;
      if (p.x > width + p.r) p.x = -p.r;

      paintPuff(p.x, p.y, p.r, p.baseAlpha, p.tone);
    }
  }

  // ---------- Cursor-exhaled puffs ----------
  var MAX_TRAIL = isSmall ? 40 : 140;
  var trail = [];
  var SPAWN_SPACING = 16; // px moved before spawning another puff

  function spawnTrailPuffsAlong(fromX, fromY, toX, toY) {
    var dx = toX - fromX;
    var dy = toY - fromY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < SPAWN_SPACING) return;
    var steps = Math.min(5, Math.floor(dist / SPAWN_SPACING));
    for (var s = 1; s <= steps; s++) {
      var t = s / steps;
      trail.push({
        x: fromX + dx * t + (Math.random() - 0.5) * 8,
        y: fromY + dy * t + (Math.random() - 0.5) * 8,
        age: 0,
        maxAge: 80 + Math.random() * 60, // frames - slow, calming fade
        startR: 8 + Math.random() * 8,
        endR: 70 + Math.random() * 80,
        driftX: (Math.random() - 0.5) * 0.4,
        driftY: -0.3 - Math.random() * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.025,
        peakAlpha: 0.06 + Math.random() * 0.07,
        tone: pickTone(),
      });
    }
    if (trail.length > MAX_TRAIL) trail.splice(0, trail.length - MAX_TRAIL);
  }

  function drawTrail() {
    for (var i = trail.length - 1; i >= 0; i--) {
      var p = trail[i];
      p.age++;
      if (p.age >= p.maxAge) { trail.splice(i, 1); continue; }

      var t = p.age / p.maxAge;
      p.wobble += p.wobbleSpeed;
      p.x += p.driftX + Math.sin(p.wobble) * 0.35;
      p.y += p.driftY;

      // quick fade in, slow fade out; radius grows throughout.
      var alpha = t < 0.15 ? (t / 0.15) * p.peakAlpha : p.peakAlpha * (1 - (t - 0.15) / 0.85);
      var radius = p.startR + (p.endR - p.startR) * Math.min(1, t * 1.3);

      paintPuff(p.x, p.y, radius, Math.max(0, alpha), p.tone);
    }
  }

  function paintPuff(x, y, r, alpha, tone) {
    if (alpha <= 0.001 || r <= 0) return;
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(' + tone + ',' + alpha + ')');
    gradient.addColorStop(1, 'rgba(' + tone + ',0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    drawAmbient();

    if (hasMoved) {
      spawnTrailPuffsAlong(lastSpawnPoint.x, lastSpawnPoint.y, pointer.x, pointer.y);
      lastSpawnPoint.x = pointer.x;
      lastSpawnPoint.y = pointer.y;
    }
    drawTrail();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
