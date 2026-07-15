(function () {
  var preloader = document.getElementById('preloader');
  if (!preloader) return;

  var seen = sessionStorage.getItem('umoya_preloader_seen');
  if (seen) {
    preloader.classList.add('is-hidden');
    return;
  }

  window.addEventListener('load', function () {
    // Hold long enough for the logo line-draw + wordmark fade to finish.
    setTimeout(function () {
      preloader.classList.add('is-leaving');
      sessionStorage.setItem('umoya_preloader_seen', '1');
      setTimeout(function () {
        preloader.classList.add('is-hidden');
      }, 950);
    }, 2100);
  });
})();
