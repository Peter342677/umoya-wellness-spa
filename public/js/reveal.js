/*
 * Scroll reveal + text-split reveal utilities.
 * - [data-reveal] / [data-reveal-group] / .mask-reveal: fade/slide/wipe in as they enter the viewport.
 * - [data-split-text]: splits text into words wrapped per-line for a headline reveal animation.
 *
 * Revealing is intentionally NOT left to IntersectionObserver alone: in some
 * browser/tab states (e.g. a backgrounded tab, or scroll driven entirely by
 * Lenis' transform-based smoothing) IO callbacks can be throttled or skipped
 * entirely, which would leave real content permanently invisible - a much worse failure than losing the entrance
 * animation. So a manual geometry check backs it up on scroll/resize/tab-
 * visibility changes, and a final timeout guarantees everything reveals
 * eventually no matter what.
 */
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Split text into words for line-reveal ----------
  // Walks child nodes rather than flattening to textContent so inline accent
  // markup (the brand's italic <em> words) survives the split - each word
  // keeps its original wrapper tag.
  function splitText(el) {
    var line = document.createElement('span');
    line.className = 'split-line';
    var index = 0;

    function addWord(word, tagName) {
      var w = document.createElement(tagName || 'span');
      w.className = 'word';
      w.style.transitionDelay = (index * 28) + 'ms';
      w.style.animationDelay = (index * 28) + 'ms';
      w.textContent = word;
      line.appendChild(w);
      line.appendChild(document.createTextNode(' '));
      index++;
    }

    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      var tag = node.nodeType === 1 ? node.tagName : null;
      var text = node.textContent.trim();
      if (!text) return;
      text.split(/\s+/).forEach(function (word) { addWord(word, tag); });
    });

    el.innerHTML = '';
    el.appendChild(line);
  }

  document.querySelectorAll('[data-split-text]').forEach(function (el) {
    if (!reducedMotion) splitText(el);
  });

  // Immediate reveal (hero headline) - runs shortly after load, no scroll trigger needed.
  document.querySelectorAll('[data-split-text="immediate"]').forEach(function (el) {
    setTimeout(function () { el.classList.add('split-ready'); }, 350);
  });

  if (reducedMotion) return;

  // ---------- Reveal targets ----------
  var targets = Array.prototype.slice.call(
    document.querySelectorAll('[data-reveal], [data-reveal-group], .mask-reveal, [data-split-text]:not([data-split-text="immediate"])')
  );
  if (!targets.length) return;

  function reveal(el) {
    if (el.classList.contains('is-visible')) return;
    el.classList.add('is-visible');
    if (el.hasAttribute('data-split-text')) el.classList.add('split-ready');
  }

  // ---------- Primary: IntersectionObserver (efficient, animates on scroll) ----------
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );
  targets.forEach(function (el) { observer.observe(el); });

  // ---------- Backup: manual geometry check ----------
  // Catches cases where IO doesn't fire (backgrounded tab, some virtual-scroll
  // setups). Cheap enough to run on scroll/resize since it's a plain rect read.
  var pending = targets.slice();
  function checkPending() {
    if (!pending.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(function (el) {
      var rect = el.getBoundingClientRect();
      var inView = rect.top < vh * 0.92 && rect.bottom > 0;
      if (inView) {
        reveal(el);
        observer.unobserve(el);
        return false;
      }
      return true;
    });
  }

  var ticking = false;
  function scheduleCheck() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { checkPending(); ticking = false; });
  }
  window.addEventListener('scroll', scheduleCheck, { passive: true });
  window.addEventListener('resize', scheduleCheck);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) scheduleCheck();
  });
  if (window.__lenis) window.__lenis.on('scroll', scheduleCheck);

  checkPending(); // catch anything already in view at load

  // ---------- Final safety net ----------
  // No matter what else fails, nothing stays invisible forever.
  setTimeout(function () {
    pending.forEach(reveal);
    pending = [];
  }, 4000);
})();
