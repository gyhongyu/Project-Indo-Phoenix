/* ============================================================
   PROJECT INDO-PHOENIX — App Shell
   i18n engine (EN default / 繁中 toggle) + preloader + cursor
   + scroll reveals + number counters + smooth scrolling
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------- Language engine ---------------------- */
  const LANG_KEY = "ipx-lang";

  const Lang = {
    get() {
      return localStorage.getItem(LANG_KEY) || "en"; // English default
    },
    set(l) {
      localStorage.setItem(LANG_KEY, l);
      this.apply();
    },
    toggle() {
      this.set(this.get() === "en" ? "zh" : "en");
    },
    apply() {
      const lang = this.get();
      const dict = (window.IPX_I18N && window.IPX_I18N[lang]) || window.IPX_I18N.en;
      document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const path = el.getAttribute("data-i18n");
        const val = path.split(".").reduce((o, k) => (o ? o[k] : undefined), dict);
        if (val !== undefined && val !== null) el.innerHTML = val;
      });
      document.querySelectorAll(".lang-toggle").forEach((btn) => {
        btn.textContent = lang === "en" ? "中文" : "EN";
        btn.setAttribute("aria-label", "Switch language");
      });
      // Synchronize deck jump links with active lang & template
      const activeTemplate = document.body.getAttribute("data-template") || "a";
      document.querySelectorAll(".nav-deck-link").forEach((link) => {
        link.href = `presentation.html?theme=${activeTemplate}&lang=${lang}`;
      });
    }
  };
  window.IPX_LANG = Lang;

  /* ------------------------ Preloader -------------------------- */
  function runPreloader(onDone) {
    const el = document.querySelector(".preloader__num");
    const wrap = document.querySelector(".preloader");
    if (!wrap) { onDone(); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.classList.add("done"); onDone(); return;
    }
    const DURATION = 1400;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      if (el) el.textContent = Math.round(eased * 100);
      if (t < 1) { requestAnimationFrame(tick); }
      else { wrap.classList.add("done"); setTimeout(onDone, 250); }
    })(start);
  }

  /* -------------------- Custom cursor -------------------------- */
  function initCursor() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot"; ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.documentElement.classList.add("has-cursor");

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* --------------- Scroll reveals + counters -------------------- */
  function initReveals() {
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach((el, i) => {
      if (!el.getAttribute("data-delay")) {
        el.style.transitionDelay = Math.min(i * 60, 360) + "ms";
      } else {
        el.style.transitionDelay = el.getAttribute("data-delay") + "ms";
      }
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(runCounter);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    els.forEach((el) => io.observe(el));
  }

  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(target, decimals); return;
    }
    const DURATION = 1800;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format(target * eased, decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = format(target, decimals);
    })(start);
  }

  function format(v, decimals) {
    return v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /* ---------------- Nav scroll state ----------------
     darkens/dims the fixed navbar once content scrolls under it */
  function initNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const update = () =>
      nav.classList.toggle("is-scrolled", (window.scrollY || 0) > 24);
    addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ------------------- Smooth scrolling ------------------------- */
  function initSmoothScroll() {
    if (!window.Lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const lenis = new window.Lenis({ duration: 1.25 });
      window.__lenis = lenis;
      if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", window.ScrollTrigger.update);
      }
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    } catch (e) { /* native scroll fallback */ }
  }

  /* ----------------------- Bootstrap --------------------------- */
  function init() {
    Lang.apply();
    document.querySelectorAll(".lang-toggle").forEach((btn) =>
      btn.addEventListener("click", () => Lang.toggle())
    );
    initCursor();
    initSmoothScroll();
    initNav();
    runPreloader(() => {
      initReveals();
      document.body.classList.add("ready");
      document.dispatchEvent(new CustomEvent("ipx:ready"));
    });
  }

  window.IPX_UI = { init };

  document.addEventListener("DOMContentLoaded", () => {
    if (window.__IPX_NO_AUTOBOOT) return;   // templates may opt out
    window.IPX_UI.init();
  });
})();
