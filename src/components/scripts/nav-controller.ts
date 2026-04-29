// Nav.astro client-side controller. Extracted so the .astro file stays
// markup-focused. Astro bundles this as an external deferred module.

/* ── Dropdown de servicios ── */
const servicesMenuBtn = document.getElementById(
  "services-menu-btn",
) as HTMLButtonElement | null;
const servicesTabLink = document.getElementById(
  "services-tab-link",
) as HTMLAnchorElement | null;
const servicesMenu = document.getElementById(
  "services-menu",
) as HTMLElement | null;

function openServices() {
  servicesMenu?.removeAttribute("hidden");
  servicesMenuBtn?.setAttribute("aria-expanded", "true");
}
function closeServices() {
  servicesMenu?.setAttribute("hidden", "");
  servicesMenuBtn?.setAttribute("aria-expanded", "false");
}

servicesMenuBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (servicesMenu?.hasAttribute("hidden")) {
    openServices();
  } else {
    closeServices();
  }
});

servicesTabLink?.addEventListener("click", () => {
  closeServices();
});

document.addEventListener("click", () => closeServices());

servicesMenuBtn?.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeServices();
    servicesMenuBtn.focus();
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    openServices();
  }
});

servicesTabLink?.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    openServices();
  }
  if (e.key === "Escape" && !servicesMenu?.hasAttribute("hidden")) {
    e.preventDefault();
    closeServices();
    servicesMenuBtn?.focus();
  }
});

servicesMenu?.addEventListener("keydown", (e: KeyboardEvent) => {
  const items = Array.from(
    servicesMenu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  );
  const idx = items.indexOf(document.activeElement as HTMLElement);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    items[(idx + 1) % items.length]?.focus();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    items[(idx - 1 + items.length) % items.length]?.focus();
  }
  if (e.key === "Escape") {
    closeServices();
    servicesMenuBtn?.focus();
  }
  if (e.key === "Tab") {
    closeServices();
  }
});

/* ── Drawer mobile ── */
const burger = document.getElementById("nav-burger");
const drawer = document.getElementById("nav-drawer");
const drawerA11yToggle = document.getElementById(
  "drawer-a11y-toggle",
) as HTMLButtonElement | null;
const drawerA11yPanel = document.getElementById(
  "drawer-a11y-panel",
) as HTMLElement | null;

function closeDrawer() {
  if (!drawer?.classList.contains("open")) return;
  drawer.classList.remove("open");
  burger?.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");
  drawerA11yPanel?.classList.remove("open");
  drawerA11yToggle?.setAttribute("aria-expanded", "false");
}

burger?.addEventListener("click", () => {
  const isOpen = drawer?.classList.contains("open");

  if (isOpen) {
    closeDrawer();
  } else {
    drawer?.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    drawer?.setAttribute("aria-hidden", "false");
  }
});

drawerA11yToggle?.addEventListener("click", () => {
  const isOpen = drawerA11yPanel?.classList.contains("open");
  drawerA11yPanel?.classList.toggle("open", !isOpen);
  drawerA11yToggle.setAttribute("aria-expanded", String(!isOpen));
});

// Cerrar drawer al hacer click en cualquier link interno
drawer?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeDrawer();
  });
});

// Cerrar drawer con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer?.classList.contains("open")) {
    closeDrawer();
    burger?.focus();
  }
});

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 10 && drawer?.classList.contains("open"))
      closeDrawer();
  },
  { passive: true },
);
