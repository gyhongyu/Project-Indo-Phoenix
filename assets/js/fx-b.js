/* ============================================================
   TEMPLATE B — Interaction FX layer ("Orbital Force Field")
   desktop mouse: ion trail follows cursor + gravity well,
   click = radar pulse, hold ≥340ms = ignition, wheel = power
   touch: drag = trail + well, tap = pulse, hold = ignition
   Rare event: satellite transit every ~60–90s.
   Requires: fx-core.js (before this), scene-b.js (IPX_ORBIT)
   Intensity kept at ~70% of Template A's feel.
   ============================================================ */

(function () {
  "use strict";
  if (!document.body || document.body.getAttribute("data-template") !== "b") return;
  const FX = window.IPX_FX;
  if (!FX) return;
  const orbit = () => window.IPX_ORBIT; /* null-safe degradation */

  /* ---------------- overlay ---------------- */
  const ov = FX.makeOverlay("fx-canvas");
  const g2 = ov.cx;
  const DPR = ov.dpr;
  const SPR_ION = FX.makeSprite(79, 209, 197, 0.50);  /* teal ion */
  const SPR_SAT = FX.makeSprite(215, 255, 246, 0.85); /* satellite head */

  /* ---------------- particles ---------------- */
  const P = [];
  const MAX_P = 170;
  function ion(x, y, vx, vy) {
    if (P.length >= MAX_P) P.shift();
    P.push({
      x: x, y: y, vx: vx, vy: vy,
      size: 3 + Math.random() * 7,
      life: 0.5 + Math.random() * 0.45,
      age: 0, alpha: 0.5
    });
  }

  const ripples = [];

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
      p.y += p.vy * dt * 60;
      const s = p.size * (1 + k * 1.4) * DPR();
      g2.globalAlpha = p.alpha * fade;
      g2.drawImage(SPR_ION, p.x * DPR() - s, p.y * DPR() - s, s * 2, s * 2);
    }
    /* 2D radar ripples (mirror of the 3D LineLoop pulse) */
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.age += dt;
      const k = r.age / r.life;
      if (k >= 1) { ripples.splice(i, 1); continue; }
      const e = 1 - Math.pow(1 - k, 3);
      const rad = (14 + e * 110) * DPR();
      g2.strokeStyle = "rgba(79,209,197,1)";
      g2.lineWidth = 1.5 * DPR();
      g2.globalAlpha = (1 - k) * 0.65;
      g2.beginPath();
      g2.arc(r.x * DPR(), r.y * DPR(), rad, 0, Math.PI * 2);
      g2.stroke();
      g2.globalAlpha = (1 - k) * 0.35;
      g2.beginPath();
      g2.arc(r.x * DPR(), r.y * DPR(), rad * 0.62, 0, Math.PI * 2);
      g2.stroke();
    }
    g2.globalAlpha = 1;
  }

  /* ---------------- pointer: ion trail + gravity well ---------------- */
  let lx = -1, ly = -1;
  function move(x, y) {
    const o = orbit(); if (o) o.well(x, y, true);
    if (lx < 0) { lx = x; ly = y; return; }
    const d = Math.hypot(x - lx, y - ly);
    if (d < 7) return;
    const n = FX.DESKTOP ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5;
      ion(lx + (x - lx) * t, ly + (y - ly) * t,
        (x - lx) * 0.02 + (Math.random() - 0.5) * 0.5,
        (y - ly) * 0.02 + (Math.random() - 0.5) * 0.5);
    }
    lx = x; ly = y;
  }
  addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
  function wellOff() {
    lx = -1; ly = -1;
    const o = orbit(); if (o) o.well(0, 0, false);
  }
  document.addEventListener("pointerleave", wellOff);
  addEventListener("blur", wellOff);

  /* ---------------- hold / tap ---------------- */
  FX.bindHold({
    onHold: () => { const o = orbit(); if (o) o.burn(1); },
    onRelease: () => { const o = orbit(); if (o) o.burn(0); },
    onTap: (x, y) => {
      ripples.push({ x: x, y: y, age: 0, life: 0.9 });
      const o = orbit(); if (o) o.pulse(x, y);
    }
  });

  /* ---------------- scroll glow channel ---------------- */
  const glow = FX.glowChannel();

  /* ---------------- rare event: satellite transit ---------------- */
  const sat = {
    on: false,
    next: performance.now() + 18000 + Math.random() * 15000,
    x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0
  };

  function satTick(now, dt) {
    if (!sat.on && now >= sat.next) {
      sat.on = true; sat.age = 0; sat.life = 7;
      const fromLeft = Math.random() < 0.5;
      sat.x = fromLeft ? -80 : innerWidth + 80;
      sat.y = innerHeight * (0.10 + Math.random() * 0.35);
      const dir = fromLeft ? 1 : -1;
      sat.vx = dir * (innerWidth / 5.5);           /* ~5.5s crossing */
      sat.vy = (Math.random() - 0.35) * innerHeight * 0.06;
    } else if (sat.on) {
      sat.age += dt;
      sat.x += sat.vx * dt;
      sat.y += sat.vy * dt;
      const spd = Math.hypot(sat.vx, sat.vy) || 1;
      const tx = sat.x - (sat.vx / spd) * 110;
      const ty = sat.y - (sat.vy / spd) * 110;
      const grd = g2.createLinearGradient(
        sat.x * DPR(), sat.y * DPR(), tx * DPR(), ty * DPR());
      grd.addColorStop(0, "rgba(220,255,248,0.9)");
      grd.addColorStop(1, "rgba(120,235,215,0)");
      g2.globalAlpha = 1;
      g2.strokeStyle = grd;
      g2.lineWidth = 1.6 * DPR();
      g2.beginPath();
      g2.moveTo(sat.x * DPR(), sat.y * DPR());
      g2.lineTo(tx * DPR(), ty * DPR());
      g2.stroke();
      const s = 9 * DPR();
      g2.globalAlpha = 0.95;
      g2.drawImage(SPR_SAT, sat.x * DPR() - s, sat.y * DPR() - s, s * 2, s * 2);
      g2.globalAlpha = 1;
      if (sat.age > sat.life || sat.x < -120 || sat.x > innerWidth + 120) {
        sat.on = false;
        sat.next = now + 60000 + Math.random() * 30000; /* 60–90s */
      }
    }
  }

  /* ---------------- main loop ---------------- */
  FX.autoLoop((dt, now) => {
    const g = glow.step(dt);
    const o = orbit(); if (o) o.glow(g);
    step(dt);
    satTick(now, dt);
  });
})();