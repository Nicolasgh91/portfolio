// Controladores globales: tema, idioma, accesibilidad.
// Extraído de Layout.astro para eliminar 'unsafe-inline' de script-src.
// Carga con defer desde <head>; el DOM ya está parseado cuando se ejecuta.

// ── Tema ───────────────────────────────────────────────
window.nhTheme = {
  isDark: !document.documentElement.classList.contains("light"),
  toggle() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle("light", !this.isDark);
    localStorage.setItem("nh-theme", this.isDark ? "dark" : "light");
    const btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = this.isDark ? "◑ Dark" : "◑ Light";
  },
};

// ── Idioma ─────────────────────────────────────────────
window.nhLang = {
  isEN: document.documentElement.lang === "en",
  apply() {
    const lang = this.isEN ? "en" : "es";
    document.documentElement.lang = lang;
    const btn = document.getElementById("lang-btn");
    if (btn) btn.textContent = this.isEN ? "ES" : "EN";
    document.querySelectorAll("[data-en][data-es]").forEach((el) => {
      const val = this.isEN ? el.dataset.en : el.dataset.es;
      if (!val) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll("[data-en]:not([data-es])").forEach((el) => {
      el.classList.toggle("hidden", !this.isEN);
    });
    document.querySelectorAll("[data-es]:not([data-en])").forEach((el) => {
      el.classList.toggle("hidden", this.isEN);
    });
    if (btn)
      btn.setAttribute(
        "aria-label",
        this.isEN ? "Cambiar a español" : "Switch to English",
      );
  },
  toggle() {
    this.isEN = !this.isEN;
    this.apply();
  },
};
window.nhLang.apply();

// ── Accesibilidad ──────────────────────────────────────
function nhInitialMotionReduced() {
  var s = localStorage.getItem("nh-reduced-motion");
  if (s === "true") return true;
  if (s === "false") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

window.nhA11y = {
  panelOpen: false,
  motionReduced: nhInitialMotionReduced(),

  togglePanel() {
    this.panelOpen = !this.panelOpen;
    const panel = document.getElementById("a11y-panel");
    const btn = document.getElementById("a11y-btn");
    if (panel) panel.classList.toggle("open", this.panelOpen);
    if (btn) btn.classList.toggle("on", this.panelOpen);
    if (btn) btn.setAttribute("aria-expanded", String(this.panelOpen));
  },

  setFontScale(scale) {
    document.documentElement.style.setProperty("--font-scale", scale);
    localStorage.setItem("nh-font-scale", scale);
    document.querySelectorAll(".a11y-fs-btn").forEach((b) => {
      b.classList.toggle("on", parseFloat(b.dataset.scale) === scale);
      b.setAttribute(
        "aria-pressed",
        String(parseFloat(b.dataset.scale) === scale),
      );
    });
  },

  setHighContrast(on) {
    document.documentElement.classList.toggle("hc", on);
    localStorage.setItem("nh-hc", on);
    document.getElementById("hc-off")?.classList.toggle("on", !on);
    document.getElementById("hc-on")?.classList.toggle("on", on);
  },

  setReducedMotion(on, persist) {
    this.motionReduced = on;
    document.documentElement.classList.toggle("no-motion", on);
    let style = document.getElementById("nh-no-motion");
    if (on) {
      if (!style) {
        style = document.createElement("style");
        style.id = "nh-no-motion";
        style.textContent =
          "*, *::before, *::after { transition: none !important; animation: none !important; }";
        document.head.appendChild(style);
      }
    } else {
      style?.remove();
    }
    document.getElementById("mot-on")?.classList.toggle("on", !on);
    document.getElementById("mot-off")?.classList.toggle("on", on);
    if (persist) localStorage.setItem("nh-reduced-motion", String(on));
  },
};

window.nhA11y.setReducedMotion(window.nhA11y.motionReduced);

// Restaurar preferencias persistidas (deferred to reduce TBT)
requestAnimationFrame(function () {
  var savedScale = localStorage.getItem("nh-font-scale");
  if (savedScale) window.nhA11y.setFontScale(parseFloat(savedScale));
  var savedHC = localStorage.getItem("nh-hc");
  if (savedHC === "true") window.nhA11y.setHighContrast(true);
});

// ── Event delegation para reemplazar onclick=".." y permitir CSP estricta ──
// Los botones ahora exponen data-action (y atributos de valor como data-scale)
// en lugar de handlers inline, que están prohibidos por script-src 'self'.
document.addEventListener("click", function (e) {
  const target =
    e.target instanceof Element ? e.target.closest("[data-action]") : null;
  if (!target) return;
  const action = target.dataset.action;
  switch (action) {
    case "theme-toggle":
      window.nhTheme.toggle();
      break;
    case "lang-toggle":
      window.nhLang.toggle();
      break;
    case "a11y-toggle-panel":
      window.nhA11y.togglePanel();
      break;
    case "a11y-font-scale": {
      const scale = parseFloat(target.dataset.scale || "1");
      window.nhA11y.setFontScale(scale);
      break;
    }
    case "a11y-high-contrast": {
      const on = target.dataset.value === "on";
      window.nhA11y.setHighContrast(on);
      break;
    }
    case "a11y-reduced-motion": {
      const on = target.dataset.value === "on";
      window.nhA11y.setReducedMotion(on, true);
      break;
    }
  }
});
