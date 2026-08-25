/* ============================================================
   TEMPLATE A — Interaction FX layer ("Silk & Smoke")
   Device-aware: desktop (hover+fine pointer) vs touch profiles.
   - desktop mouse: smoke trail follows cursor, click = bubbles,
     hold = boost, wheel/scroll = glow
   - touch: drag = trail, tap = bubbles, hold = boost, swipe = glow
   Interaction feedback is ALWAYS on; only the autonomous
   pareidolia figure respects prefers-reduced-motion.
   Overlay: #fx-canvas z-index 1 (above bg -2, below grain/content)
   ============================================================ */

(function () {
  "use strict";
  if (!document.body || document.body.getAttribute("data-template") !== "a") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* device profile: desktop = real mouse (hover capable + fine pointer) */
  const DESKTOP = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const smoke = () => window.IPX_SMOKE;

  /* ---------------- overlay canvas ---------------- */
  const cv = document.createElement("canvas");
  cv.id = "fx-canvas";
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

  /* ---------------- soft smoke sprite (pre-rendered) ---------------- */
  const SPR = document.createElement("canvas");
  SPR.width = SPR.height = 64;
  (function () {
    const g = SPR.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(214,182,122,.50)");
    grd.addColorStop(.45, "rgba(178,148,94,.16)");
    grd.addColorStop(1, "rgba(160,130,80,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
  })();

  /* ---------------- particle pool ---------------- */
  const P = [];
  const MAX_P = 240;

  function puff(x, y, vx, vy, size, life, alpha) {
    if (P.length >= MAX_P) P.shift();
    P.push({ kind: 0, x, y, vx, vy, size, life, age: 0, alpha, seed: Math.random() * 6.28 });
  }
  function bubbles(x, y) {
    const n = 6 + (Math.random() * 4 | 0);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      if (P.length >= MAX_P) P.shift();
      P.push({ kind: 1, x: x + Math.cos(a) * 10, y: y + Math.sin(a) * 10,
        vx: Math.cos(a) * 0.18, vy: -0.6 - Math.random() * 0.9,
        size: 5 + Math.random() * 14, life: 1.6 + Math.random() * 1.2,
        age: 0, alpha: 0.5, seed: Math.random() * 6.28 });
    }
    puff(x, y, 0, -0.4, 46, 1.6, 0.5);
  }

  function step(dt) {
    cx.clearRect(0, 0, cv.width, cv.height);
    cx.globalCompositeOperation = "lighter";
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.age += dt;
      if (p.age >= p.life) { P.splice(i, 1); continue; }
      const k = p.age / p.life;
      const fade = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
      if (p.kind === 0) {                    /* smoke puff: rises, expands */
        p.x += (p.vx + Math.sin(p.seed + p.age * 1.7) * 0.22) * dt * 60;
        p.y += (p.vy - 0.35) * dt * 60;
        p.size += 14 * dt;
        const s = p.size * DPR;
        cx.globalAlpha = p.alpha * fade;
        cx.drawImage(SPR, p.x * DPR - s, p.y * DPR - s, s * 2, s * 2);
      } else {                               /* smoke bubble: rises, swells, thins */
        p.x += (p.vx + Math.sin(p.seed + p.age * 2.4) * 0.3) * dt * 60;
        p.y += p.vy * dt * 60;
        const r = (p.size + p.age * 9) * DPR;
        cx.globalAlpha = p.alpha * fade * 0.9;
        cx.strokeStyle = "rgba(214,182,122,1)";
        cx.lineWidth = Math.max(1, DPR * 0.8);
        cx.beginPath();
        cx.arc(p.x * DPR, p.y * DPR, r, 0, 6.2832);
        cx.stroke();
        cx.globalAlpha = p.alpha * fade * 0.25;
        cx.drawImage(SPR, p.x * DPR - r, p.y * DPR - r, r * 2, r * 2);
      }
    }
    cx.globalAlpha = 1;
    cx.globalCompositeOperation = "source-over";
  }

  /* ---------------- pointer input (desktop mouse / mobile touch) ---------------- */
  let px = -1, py = -1, downAt = 0, holding = false, holdTimer = 0;

  function trail(x, y, dx, dy) {
    const sp = Math.hypot(dx, dy);
    /* desktop emits denser puffs — the smoke should visibly follow the cursor */
    const n = DESKTOP ? (sp > 40 ? 4 : sp > 18 ? 3 : 2)
                      : (sp > 40 ? 3 : sp > 18 ? 2 : 1);
    for (let i = 0; i < n; i++) {
      puff(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10,
        -dx * 0.02 - (Math.random() - 0.5) * 0.3,
        -dy * 0.02 - 0.2 - Math.random() * 0.3,
        10 + Math.random() * 16, 1.2 + Math.random() * 1.1, 0.34);
    }
  }

  addEventListener("pointermove", (e) => {
    const x = e.clientX, y = e.clientY;
    /* desktop: smoke follows the mouse at all times; touch fires only while down */
    if (px >= 0) trail(x, y, x - px, y - py);
    px = x; py = y;
  }, { passive: true });

  addEventListener("pointerdown", (e) => {
    /* desktop: a press is an FX gesture, never a text selection / drag */
    if (e.pointerType === "mouse") {
      const t = e.target;
      const interactive = t && t.closest &&
        t.closest("a, button, input, textarea, select");
      if (!interactive) e.preventDefault();
    }
    downAt = performance.now();
    px = e.clientX; py = e.clientY;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      holding = true;
      document.body.classList.add("fx-holding");
      const s = smoke(); if (s) s.boost(1);
    }, 340);
  }, { passive: false });

  function release() {
    clearTimeout(holdTimer);
    const quick = performance.now() - downAt < 340;
    if (holding) {
      holding = false;
      document.body.classList.remove("fx-holding");
      const s = smoke(); if (s) s.boost(0);
      puff(px, py, 0, -0.5, 30, 1.4, 0.4);
    } else if (quick) {
      bubbles(px, py);
    }
  }
  addEventListener("pointerup", release, { passive: true });
  addEventListener("pointercancel", release, { passive: true });

  /* ---------------- scroll glow (fast rise, slow decay) ---------------- */
  let glow = 0;
  addEventListener("wheel", (e) => {
    glow = Math.min(1, glow + Math.min(0.30, Math.abs(e.deltaY) * 0.0022));
  }, { passive: true });
  /* fallback so scrollbar-drag / keyboard / inertia scrolling also feeds glow */
  let lastSY = window.scrollY || 0;
  addEventListener("scroll", () => {
    const d = Math.abs((window.scrollY || 0) - lastSY);
    lastSY = window.scrollY || 0;
    if (d > 1) glow = Math.min(1, glow + Math.min(0.22, d * 0.0016));
  }, { passive: true });
  addEventListener("touchmove", () => {
    glow = Math.min(1, glow + 0.02);
  }, { passive: true });

  /* ---------------- rare figure scheduler (pareidolia) ---------------- */
  const fig = { on: false, next: 0, until: 0, x: 0, y: 0 };

  function figureTick(now, dt) {
    const s = smoke(); if (!s) return;
    if (!fig.on && now >= fig.next) {
      fig.on = true;
      fig.until = now + 9000 + Math.random() * 8000;      /* 9-17s window */
      fig.x = (Math.random() < 0.5 ? -1 : 1) * (0.24 + Math.random() * 0.14);
      fig.y = -0.28;
      s.figure(1, fig.x, fig.y);
    } else if (fig.on) {
      fig.y += 0.011 * dt;                                /* rises like smoke */
      s.figure(1, fig.x, fig.y);
      if (now >= fig.until) {
        fig.on = false;
        s.figure(0);
        fig.next = now + 55000 + Math.random() * 35000;   /* every 55-90s */
      }
    }
  }

  /* ---------------- main loop ---------------- */
  let last = performance.now(), running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(loop); }
  });

  function loop(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    glow *= Math.pow(0.5, dt / 1.3);                      /* ~4s to fade back */
    if (glow < 0.003) glow = 0;
    const s = smoke();
    if (s) s.glow(glow);

    if (!reduced) figureTick(now, dt);
    step(dt);   /* interaction feedback stays on even under reduced-motion */
    requestAnimationFrame(loop);
  }
  fig.next = performance.now() + 22000 + Math.random() * 18000;  /* first visit: pure smoke */
})();
