// Tema + strip no-js + no-motion antes del primer paint.
// Debe cargarse sincrónico en <head>; corre previo a renderizar body.
// Extraído de Layout.astro para permitir CSP estricta (script-src 'self').
(function () {
  const stored = localStorage.getItem('nh-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored ? stored === 'dark' : prefersDark;
  document.documentElement.classList.toggle('light', !isDark);
  if (isDark) document.documentElement.classList.remove('light');

  document.documentElement.classList.remove('no-js');

  var motionStored = localStorage.getItem('nh-reduced-motion');
  var reduceMotion =
    motionStored !== null
      ? motionStored === 'true'
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) document.documentElement.classList.add('no-motion');
})();
