// Scroll reveal: aplica .is-visible a elementos .reveal al entrar al viewport.
// DOMContentLoaded + requestAnimationFrame: alineación con init síncrono de
// nhA11y / clase no-motion. Extraído de Layout.astro para CSP estricta.
(function () {
  function reduceMotionActive() {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('no-motion') ||
      (typeof window.nhA11y !== 'undefined' && window.nhA11y.motionReduced === true)
    );
  }

  function initReveal() {
    requestAnimationFrame(function () {
      var nodes = document.querySelectorAll('.reveal');
      if (reduceMotionActive()) {
        nodes.forEach(function (el) {
          el.classList.add('is-visible');
        });
        return;
      }
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        // threshold 0: callback al haber intersección no nula con el root. Con 0.15, la ratio
        // visible/total de un .reveal muy alto (p. ej. el <article class="prose"> de un post largo)
        // puede no alcanzar nunca 15% y el contenido queda en opacity:0.
        { threshold: 0, rootMargin: '0px 0px -50px 0px' }
      );
      nodes.forEach(function (el) {
        observer.observe(el);
      });

      function initAltReveal() {
        var path = window.location.pathname.replace(/\/$/, '') || '/';
        if (path !== '/' && path !== '/servicios' && path !== '/talento') return;
        var altNodes = document.querySelectorAll('[data-alt-reveal]');
        if (altNodes.length === 0) return;
        if (reduceMotionActive()) {
          altNodes.forEach(function (el) {
            el.classList.remove('opacity-0', 'translate-y-4');
            el.classList.add('opacity-100', 'translate-y-0');
          });
          return;
        }
        var observerAlt = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              entry.target.classList.remove('opacity-0', 'translate-y-4');
              entry.target.classList.add('opacity-100', 'translate-y-0');
              observerAlt.unobserve(entry.target);
            });
          },
          { threshold: 0, rootMargin: '0px 0px -50px 0px' }
        );
        altNodes.forEach(function (el) {
          observerAlt.observe(el);
        });
      }
      initAltReveal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();
