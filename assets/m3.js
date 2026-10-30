/* =====================================================================
   rrohaill.dev — shared behaviour for the Material You theme
   - Theme preference (light/dark/system + seed hue), persisted in localStorage.
     The tiny boot script in each page's <head> applies the saved theme before
     paint; this file wires the palette popover and keeps it in sync.
   - Inline icon set (Lucide paths) hydrated into <i data-icon="…"> placeholders.
   - Material 3 Expressive shapes drawn as polar curves into [data-shape].
   - Navigation: blur on scroll, mobile menu, active-section highlight.
   - Small helpers exposed on window.M3 for the page scripts.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- Theme ---------------- */
  var SEEDS = [
    { id: "android", label: "Android green", hue: 150 },
    { id: "ocean", label: "Ocean blue", hue: 245 },
    { id: "lavender", label: "Lavender", hue: 300 },
    { id: "coral", label: "Coral", hue: 32 }
  ];
  var MODE_KEY = "rr-theme-mode";
  var SEED_KEY = "rr-theme-seed";
  var hueOf = {};
  SEEDS.forEach(function (s) { hueOf[s.id] = s.hue; });

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  function prefersDark() { return window.matchMedia("(prefers-color-scheme: dark)").matches; }
  function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  function withTransition(update) {
    if (document.startViewTransition && !reducedMotion()) {
      var t = document.startViewTransition(update);
      // A second switch during the cross-fade skips the first one; that is fine, not an error.
      if (t && t.ready && t.ready.catch) t.ready.catch(function () {});
      if (t && t.updateCallbackDone && t.updateCallbackDone.catch) t.updateCallbackDone.catch(function () {});
    } else update();
  }

  function currentMode() {
    var m = read(MODE_KEY);
    return m === "light" || m === "dark" ? m : "system";
  }
  function currentSeed() {
    var s = read(SEED_KEY);
    return s && hueOf[s] != null ? s : "android";
  }

  function applyMode(mode) {
    var dark = mode === "dark" || (mode === "system" && prefersDark());
    document.documentElement.classList.toggle("dark", dark);
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute("content", dark ? "#111511" : "#f4faf4");
  }
  function applySeed(seed) {
    document.documentElement.style.setProperty("--seed-h", String(hueOf[seed] || hueOf.android));
  }

  function setMode(mode) { store(MODE_KEY, mode); withTransition(function () { applyMode(mode); }); }
  function setSeed(seed) { store(SEED_KEY, seed); withTransition(function () { applySeed(seed); }); }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (currentMode() === "system") applyMode("system");
  });

  /* ---------------- Icons (Lucide) ---------------- */
  var ICONS = {
    "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    "map-pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    boxes: '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    code: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    dumbbell: '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
    "test-tube": '<path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3"/><path d="m16 2 6 6"/><path d="M12 16H4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>',
    "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    link: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    "book-open": '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || "";
    return '<svg class="i ' + (cls || "") + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' + body + "</svg>";
  }

  /* ---------------- Shapes ---------------- */
  var SHAPES = {
    cookie: { lobes: 9, depth: 0.065 },
    clover: { lobes: 4, depth: 0.2 },
    sunny: { lobes: 8, depth: 0.045 },
    flower: { lobes: 6, depth: 0.13 },
    circle: { lobes: 0, depth: 0 }
  };
  var PATHS = {};
  Object.keys(SHAPES).forEach(function (k) {
    var lobes = SHAPES[k].lobes, depth = SHAPES[k].depth;
    var steps = 240, base = 50 / (1 + depth), pts = [];
    for (var i = 0; i < steps; i++) {
      var t = (i / steps) * Math.PI * 2;
      var r = base * (1 + depth * Math.cos(lobes * t));
      var x = 50 + r * Math.cos(t - Math.PI / 2);
      var y = 50 + r * Math.sin(t - Math.PI / 2);
      pts.push(x.toFixed(2) + " " + y.toFixed(2));
    }
    PATHS[k] = "M" + pts.join("L") + "Z";
  });

  function shapeSvg(kind) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="' + (PATHS[kind] || PATHS.circle) + '"/></svg>';
  }

  /** Markup for a shape with optional content inside. */
  function shape(kind, cls, content) {
    return '<span class="shape ' + (cls || "") + '" data-shape="' + kind + '" data-hydrated="1">' + shapeSvg(kind) +
      (content != null ? '<span class="shape-content">' + content + "</span>" : "") + "</span>";
  }

  /** Fill icon and shape placeholders inside root (defaults to the document). */
  function hydrate(root) {
    root = root || document;
    var icons = root.querySelectorAll("i[data-icon]:not([data-hydrated])");
    for (var i = 0; i < icons.length; i++) {
      var el = icons[i];
      el.innerHTML = icon(el.getAttribute("data-icon"), el.getAttribute("data-cls") || "");
      el.setAttribute("data-hydrated", "1");
    }
    var shapes = root.querySelectorAll("[data-shape]:not([data-hydrated])");
    for (var j = 0; j < shapes.length; j++) {
      var s = shapes[j];
      s.classList.add("shape");
      s.insertAdjacentHTML("afterbegin", shapeSvg(s.getAttribute("data-shape")));
      s.setAttribute("data-hydrated", "1");
    }
  }

  /* ---------------- Spotlight: scroll to an element and ring it briefly ---------------- */
  function spotlight(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    el.removeAttribute("data-spotlight");
    void el.offsetWidth;
    el.setAttribute("data-spotlight", "");
    window.setTimeout(function () { el.removeAttribute("data-spotlight"); }, 2400);
  }

  /* ---------------- Theme controls UI ---------------- */
  function mountThemeControls(host) {
    var mode = currentMode(), seed = currentSeed();
    host.classList.add("theme-controls");
    host.innerHTML =
      '<button type="button" class="icon-btn state-layer" aria-label="Change theme" aria-expanded="false">' + icon("palette") + "</button>" +
      '<div class="theme-pop" role="dialog" aria-label="Theme settings" hidden>' +
      '<p class="label">Color</p>' +
      '<p class="hint">Like Android’s dynamic color — one seed tints everything.</p>' +
      '<div class="seed-row" role="radiogroup" aria-label="Seed color">' +
      SEEDS.map(function (s) {
        return '<button type="button" role="radio" class="seed-btn" data-seed="' + s.id + '" aria-checked="' + (s.id === seed) +
          '" aria-label="' + s.label + '" title="' + s.label + '" style="background: conic-gradient(from 225deg, oklch(0.62 0.13 ' + s.hue +
          ") 0 50%, oklch(0.86 0.06 " + s.hue + ") 0 75%, oklch(0.72 0.1 " + (s.hue + 70) + ') 0)">' +
          '<span class="tick"' + (s.id === seed ? "" : " hidden") + ">" + icon("check", "i-4") + "</span></button>";
      }).join("") +
      "</div>" +
      '<p class="label" style="margin-top:1.25rem">Mode</p>' +
      '<div class="mode-seg" role="radiogroup" aria-label="Color mode">' +
      [["system", "System", "monitor"], ["light", "Light", "sun"], ["dark", "Dark", "moon"]].map(function (m) {
        return '<button type="button" role="radio" class="state-layer" data-mode="' + m[0] + '" aria-checked="' + (m[0] === mode) + '">' +
          '<span class="ic">' + icon(m[0] === mode ? "check" : m[2], "i-3") + "</span>" + m[1] + "</button>";
      }).join("") +
      "</div></div>";

    var trigger = host.querySelector(".icon-btn");
    var pop = host.querySelector(".theme-pop");

    function open(state) {
      pop.hidden = !state;
      trigger.setAttribute("aria-expanded", String(state));
    }
    trigger.addEventListener("click", function () { open(pop.hidden); });
    document.addEventListener("pointerdown", function (e) {
      if (!pop.hidden && !host.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });

    host.querySelectorAll(".seed-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-seed");
        setSeed(id);
        host.querySelectorAll(".seed-btn").forEach(function (o) {
          var on = o === b;
          o.setAttribute("aria-checked", String(on));
          o.querySelector(".tick").hidden = !on;
        });
      });
    });
    host.querySelectorAll(".mode-seg button").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-mode");
        setMode(id);
        var iconsFor = { system: "monitor", light: "sun", dark: "moon" };
        host.querySelectorAll(".mode-seg button").forEach(function (o) {
          var on = o === b, oid = o.getAttribute("data-mode");
          o.setAttribute("aria-checked", String(on));
          o.querySelector(".ic").innerHTML = icon(on ? "check" : iconsFor[oid], "i-3");
        });
      });
    });
  }

  /* ---------------- Navigation ---------------- */
  function mountNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;

    function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 12); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = nav.querySelector(".menu-btn");
    var menu = nav.querySelector(".mobile-menu");
    if (toggle && menu) {
      var setOpen = function (state) {
        menu.classList.toggle("open", state);
        toggle.setAttribute("aria-expanded", String(state));
        toggle.setAttribute("aria-label", state ? "Close menu" : "Open menu");
        toggle.innerHTML = icon(state ? "x" : "menu");
      };
      toggle.addEventListener("click", function () { setOpen(!menu.classList.contains("open")); });
      menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    }

    var themeHost = nav.querySelector("[data-theme-controls]");
    if (themeHost) mountThemeControls(themeHost);

    // Highlight whichever section fills mid-screen (homepage only).
    if (nav.hasAttribute("data-home") && "IntersectionObserver" in window) {
      var links = nav.querySelectorAll('.nav-link[href^="#"]');
      var sectionToId = new Map();
      links.forEach(function (l) {
        var id = l.getAttribute("href").slice(1);
        var target = document.getElementById(id);
        var section = target && target.closest("section");
        if (section) sectionToId.set(section, id);
      });
      var setActive = function (id) {
        links.forEach(function (l) {
          var on = l.getAttribute("href") === "#" + id;
          l.classList.toggle("is-active", on);
          if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
        });
      };
      var io = new IntersectionObserver(function (entries) {
        var hit = entries.find(function (e) { return e.isIntersecting; });
        if (hit) setActive(sectionToId.get(hit.target));
      }, { rootMargin: "-45% 0px -50% 0px" });
      sectionToId.forEach(function (_, el) { io.observe(el); });
    }

    var brand = nav.querySelector(".nav-brand");
    if (brand && nav.hasAttribute("data-home")) {
      brand.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
        history.replaceState(null, "", window.location.pathname + window.location.search);
      });
    }
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    applySeed(currentSeed());
    applyMode(currentMode());
    hydrate(document);
    mountNav();
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  window.M3 = {
    SEEDS: SEEDS,
    icon: icon,
    shape: shape,
    hydrate: hydrate,
    spotlight: spotlight,
    setMode: setMode,
    setSeed: setSeed,
    reducedMotion: reducedMotion
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
