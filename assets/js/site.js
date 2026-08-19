/* Header dùng chung: đổi nền khi cuộn + mở/đóng menu mobile. */
(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.getElementById('mobile-nav');

  if (header) {
    var sync = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  }

  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      panel.hidden = !open;
      document.body.classList.toggle('has-nav-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setOpen(false); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) { setOpen(false); }
    });
  }
})();
