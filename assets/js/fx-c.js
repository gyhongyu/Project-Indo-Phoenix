/* ============================================================
   TEMPLATE C — Interaction FX layer ("Hologram Scan")
   desktop mouse: magnetize field follows cursor + spark trail,
   click = glitch pulse, hold ≥340ms = deep scan, wheel = power
   touch: drag = magnetize + sparks, tap = glitch, hold = deep
   Rare event: ghost echo every ~70–100s (scene-side pass).
   Requires: fx-core.js (before this), scene-c.js (IPX_HOLO)
   Intensity kept at ~70% of Template A's feel.
   ============================================================ */

(function () {
  "use strict";
  if (!document.body || document.body.getAttribute("data-template") !== "c") return;
  const FX = window.IPX_FX;
  if (!FX) return;
  const holo = () => window.IPX_HOLO; /* null-safe degradation */

  /* ---------------- overlay ---------------- */
  const ov = FX.makeOverlay("fx-canvas");
  const g2 = ov.cx;
  const DPR = ov.dpr;
  const SPR = FX.makeSprite(53, 224, 255, 0.45); /* cyan spark */

  /* ---------------- particles ---------------- */
  const P = [];
  const MAX_P = 140;
  function spark(x, y, vx, vy) {
    if (P.length >= MAX_P) P.shift();
    P.push({
      x: x, y: y, vx: vx, vy: vy,
      size: 2.5 + Math.random() * 6,
      life: 0.45 + Math.random() * 0.40,
      age: 0, alpha: 0.45
    });
  }

  const bars = []; /* glitch slices */
  function glitchBars(x, y) {
    const n = 3 + ((Math.random() * 3) | 0);
    for (let i = 0; i < n; i++) {
      bars.push({
        y: Math.max(0, Math.min(innerHeight,
           y + (Math.random() - 0.5) * 280)),
        h: 2 + Math.random() * 16,
        dx: (Math.random() - 0.5) * 70,
        age: 0, life: 0.16 + Math.random() * 0.14
      });
    }
  }

  function step(dt) {
    g2.clearRect(0, 0, ov.cv.width, ov.cv.height);
    g2.globalCompositeOperation = "lighter";
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.age += dt;
      if (p.age >= p.life) { P.splice(i, 1); continue; }
      const k = p.age / p.life;
      const fade = k < 0.25 ? k / 0.25 : 1 - (k - 0.25) / 0.75;
      p.x += p.vx * dt * 60;
      p.y += (p.vy - 0.15) * dt * 60; /* sparks drift up slightly */
      const s = p.size * (1 + k * 1.3) * DPR();
      g2.globalAlpha = p.alpha * fade;
      g2.drawImage(SPR, p.x * DPR() - s, p.y * DPR() - s, s * 2, s * 2);
    }
    for (let i = bars.length - 1; i >= 0; i--) {
      const b = bars[i];
      b.age += dt;
      const k = b.age / b.life;
      if (k >= 1) { bars.splice(i, 1); continue; }
      g2.globalAlpha = (1 - k) * 0.5;
      g2.fillStyle = Math.random() < 0.5
        ? "rgba(83,216,255,0.8)" : "rgba(205,242,255,0.8)";
      g2.fillRect(b.dx * k * DPR(), b.y * DPR(), ov.cv.width, b.h * DPR());
    }
    g2.globalAlpha = 1;
  }

  /* ---------------- pointer: sparks + magnetize ---------------- */
  let lx = -1, ly = -1;
  function move(x, y) {
    const h = holo(); if (h) h.mag(x, y, true);
    if (lx < 0) { lx = x; ly = y; return; }
    const d = Math.hypot(x - lx, y - ly);
    if (d < 9) return;
    const n = FX.DESKTOP ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5;
      spark(lx + (x - lx) * t, ly + (y - ly) * t,
        (x - lx) * 0.015 + (Math.random() - 0.5) * 0.4,
        (y - ly) * 0.015 + (Math.random() - 0.5) * 0.4);
    }
    lx = x; ly = y;
  }
  addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
  function magOff() {
    lx = -1; ly = -1;
    const h = holo(); if (h) h.mag(0, 0, false);
  }
  document.addEventListener("pointerleave", magOff);
  addEventListener("blur", magOff);

  /* ---------------- hold / tap ---------------- */
  FX.bindHold({
    onHold: () => { const h = holo(); if (h) h.deep(1); },
    onRelease: () => { const h = holo(); if (h) h.deep(0); },
    onTap: (x, y) => {
      const h = holo(); if (h) h.glitch();
      glitchBars(x, y);
    }
  });

  /* ---------------- scroll glow channel ---------------- */
  const glow = FX.glowChannel();

  /* ---------------- rare event: ghost echo scheduler ---------------- */
  let nextEcho = performance.now() + 26000 + Math.random() * 20000;

  /* ---------------- main loop ---------------- */
  FX.autoLoop((dt, now) => {
    const g = glow.step(dt);
    const h = holo(); if (h) h.glow(g);
    if (now >= nextEcho) {
      if (h && h.echo) h.echo();
      nextEcho = now + 70000 + Math.random() * 30000; /* 70–100s */
    }
    step(dt);
  });
})();