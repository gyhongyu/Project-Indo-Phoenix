/* ============================================================
   FX CORE — shared interaction utilities (Templates A / B / C)
   Device profile · overlay canvas factory · sprite factory
   glow channel (wheel + scroll + touch) · hold/tap binder
   visibility-aware loop driver
   NOTE: fx.js (Template A) predates this core and stays as-is.
   ============================================================ */

(function () {
  "use strict";

  /* device profile: desktop = real mouse (hover capable + fine pointer) */
  const DESKTOP = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- overlay canvas factory ---------------- */
  function makeOverlay(id) {
    const cv = document.createElement("canvas");
    cv.id = id || "fx-canvas";
    document.body.appendChild(cv);
    const cx = cv.getContext("2d");
    let DPR = 1;
    function resize() {
      DPR = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = Math.floor(innerWidth * DPR);
      cv.height = Math.floor(innerHeight * DPR);
    }
    addEventListener("resize", resize, { passive: true });
    resize();
    return { cv, cx, dpr: function () { return DPR; } };
  }

  /* ---------------- radial sprite factory ---------------- */
  function makeSprite(r, g, b, coreA) {
    const a = coreA == null ? 0.5 : coreA;
    const SPR = document.createElement("canvas");
    SPR.width = SPR.height = 64;
    const c = SPR.getContext("2d");
    const grd = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(" + r + "," + g + "," + b + "," + a + ")");
    grd.addColorStop(0.45, "rgba(" + r + "," + g + "," + b + "," + (a * 0.32) + ")");
    grd.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
    c.fillStyle = grd;
    c.fillRect(0, 0, 64, 64);
    return SPR;
  }

  /* ---------------- glow channel ----------------
     wheel + scrollbar/keyboard scroll + touchmove all feed in;
     exponential decay (~4s back to dark). Call step(dt) per frame. */
  function glowChannel() {
    const st = { v: 0 };
    addEventListener("wheel", function (e) {
      st.v = Math.min(1, st.v + Math.min(0.30, Math.abs(e.deltaY) * 0.0022));
    }, { passive: true });
    let lastSY = window.scrollY || 0;
    addEventListener("scroll", function () {
      const d = Math.abs((window.scrollY || 0) - lastSY);
      lastSY = window.scrollY || 0;
      if (d > 1) st.v = Math.min(1, st.v + Math.min(0.22, d * 0.0016));
    }, { passive: true });
    addEventListener("touchmove", function () {
      st.v = Math.min(1, st.v + 0.02);
    }, { passive: true });
    st.step = function (dt) {
      st.v *= Math.pow(0.5, dt / 1.3);
      if (st.v < 0.003) st.v = 0;
      return st.v;
    };
    return st;
  }

  /* ---------------- hold / tap binder ----------------
     340ms threshold. Desktop mouse press on non-interactive
     elements never becomes text selection / native drag. */
  function bindHold(handlers) {
    let downAt = 0, px = 0, py = 0, holding = false, timer = 0;
    addEventListener("pointermove", function (e) {
      px = e.clientX; py = e.clientY;
    }, { passive: true });
    addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") {
        const t = e.target;
        const interactive = t && t.closest &&
          t.closest("a, button, input, textarea, select");
        if (!interactive) e.preventDefault();
      }
      downAt = performance.now();
      px = e.clientX; py = e.clientY;
      clearTimeout(timer);
      timer = setTimeout(function () {
        holding = true;
        document.body.classList.add("fx-holding");
        if (handlers.onHold) handlers.onHold(px, py);
      }, 340);
    }, { passive: false });
    function release() {
      clearTimeout(timer);
      const quick = performance.now() - downAt < 340;
      if (holding) {
        holding = false;
        document.body.classList.remove("fx-holding");
        if (handlers.onRelease) handlers.onRelease(px, py);
      } else if (quick && handlers.onTap) {
        handlers.onTap(px, py);
      }
    }
    addEventListener("pointerup", release, { passive: true });
    addEventListener("pointercancel", release, { passive: true });
  }

  /* ---------------- visibility-aware loop driver ---------------- */
  function autoLoop(stepFn) {
    let last = performance.now(), running = true;
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { last = performance.now(); requestAnimationFrame(frame); }
    });
    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      stepFn(dt, now);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.IPX_FX = {
    DESKTOP: DESKTOP,
    makeOverlay: makeOverlay,
    makeSprite: makeSprite,
    glowChannel: glowChannel,
    bindHold: bindHold,
    autoLoop: autoLoop
  };
})();