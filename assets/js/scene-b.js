/* ============================================================
   TEMPLATE B — Background scene
   Three.js: particle planet + orbital gold ring + telemetry
   Interaction API (window.IPX_ORBIT, driven by fx-b.js):
     well(x, y, active)  gravity well at client coords
     burn(0|1)           orbital ignition while held ≥340ms
     glow(v)             scroll power 0..1 fed by fx layer
     pulse(x, y)         radar ripple at client coords
   Base particle arrays are never mutated: displacement targets
   are recomputed each frame FROM snapshots → instant restore.
   ============================================================ */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || !window.THREE) return;

  const TEAL = 0x4fd1c5;
  const GOLD = 0xc9a96e;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x050a14, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 5.2;

  /* --- particle planet (fibonacci sphere shell) --- */
  function shellPoints(count, radius, color, size, opacity) {
    const pos = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = phi * i;
      const jitter = radius * (1 + (Math.random() - 0.5) * 0.015);
      pos[i * 3] = Math.cos(th) * r * jitter;
      pos[i * 3 + 1] = y * jitter;
      pos[i * 3 + 2] = Math.sin(th) * r * jitter;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geo, mat);
  }

  /* --- orbital ring of points (tilted annulus) --- */
  function ringPoints(count, rMin, rMax, color, size, opacity) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = rMin + Math.random() * (rMax - rMin);
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geo, mat);
  }

  const planet = shellPoints(2600, 1.75, TEAL, 0.016, 0.8);
  const innerHalo = shellPoints(900, 1.9, GOLD, 0.01, 0.35);
  const orbit = ringPoints(1400, 2.5, 3.3, GOLD, 0.012, 0.5);
  const dust = ringPoints(500, 3.6, 5.5, TEAL, 0.008, 0.25);

  const group = new THREE.Group();
  group.add(planet, innerHalo, orbit, dust);
  group.rotation.x = 0.35;
  group.rotation.z = -0.12;
  scene.add(group);

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(dpr);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize, { passive: true });
  resize();

  /* mouse parallax */
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener("mousemove", (e) => {
    tx = (e.clientX / innerWidth - 0.5) * 0.35;
    ty = (e.clientY / innerHeight - 0.5) * 0.25;
  }, { passive: true });

  /* ============================================================
     Interaction core — gravity well · ignition · scroll glow ·
     radar pulses (all driven by fx-b.js via window.IPX_ORBIT)
     ============================================================ */

  /* --- pointer → world point on the z=0 plane --- */
  const raycaster = new THREE.Raycaster();
  const planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ndc = new THREE.Vector2();
  const hitP = new THREE.Vector3();

  const well = { active: false, has: false, p: new THREE.Vector3() };
  let burnTarget = 0, burnV = 0, glowV = 0;

  /* asymmetric envelope: fast rise, slow release */
  function envTo(v, target, dt, rise, fall) {
    const c = target > v ? rise : fall;
    return v + (target - v) * (1 - Math.pow(c, dt));
  }

  function clientToWorld(x, y, out) {
    ndc.set((x / innerWidth) * 2 - 1, -((y / innerHeight) * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(planeZ0, out);
  }

  function setWell(x, y, active) {
    well.active = !!active;
    if (!well.active) return;
    if (clientToWorld(x, y, well.p)) well.has = true;
  }

  /* --- radar pulses: expanding LineLoops on the orbital plane --- */
  const pulseGeo = (function () {
    const pts = [];
    for (let k = 0; k <= 72; k++) {
      const a = (k / 72) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  })();
  const pulses = [];

  function spawnPulse(x, y) {
    if (!clientToWorld(x, y, hitP)) return;
    const local = group.worldToLocal(hitP.clone());
    const m = new THREE.LineLoop(
      pulseGeo,
      new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.85 })
    );
    m.position.copy(local);
    m.scale.setScalar(0.05);
    group.add(m);
    pulses.push({ m: m, age: 0, life: 1.1 });
  }

  function stepPulses(dt) {
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.age += dt;
      const k = p.age / p.life;
      if (k >= 1) {
        group.remove(p.m);
        p.m.material.dispose();
        pulses.splice(i, 1);
        continue;
      }
      const e = 1 - Math.pow(1 - k, 3);
      p.m.scale.setScalar(0.05 + e * 2.4);
      p.m.material.opacity = 0.85 * (1 - k);
    }
  }

  /* --- spring displacement on orbit ring + dust only ---
     The particle planet is never distorted. Targets are always
     computed from immutable base snapshots, so on release every
     point springs straight back home. */
  function interactive(pointsObj) {
    const attr = pointsObj.geometry.attributes.position;
    return { obj: pointsObj, attr: attr, base: attr.array.slice() };
  }
  const flexRings = [interactive(orbit), interactive(dust)];
  const tmpV = new THREE.Vector3();

  function displace(r, dt) {
    const P = r.attr.array, B = r.base;
    /* attractor mapped into each ring object's local space */
    let ax = 0, ay = 0, az = 0, on = false;
    if (well.active && well.has) {
      tmpV.copy(well.p);
      group.worldToLocal(tmpV);
      r.obj.worldToLocal(tmpV);
      ax = tmpV.x; ay = tmpV.y; az = tmpV.z;
      on = true;
    }
    const k = 1 - Math.pow(0.002, dt); /* smooth follow factor */
    for (let i = 0; i < P.length; i += 3) {
      let gx = B[i], gy = B[i + 1], gz = B[i + 2];
      if (on) {
        const dx = ax - B[i], dy = ay - B[i + 1], dz = az - B[i + 2];
        const f = Math.exp(-(dx * dx + dy * dy + dz * dz) * 0.50);
        if (f > 0.01) {
          /* pull toward the well + tangential swirl around it */
          gx = B[i]     + dx * f * 0.55 - dz * f * 0.30;
          gy = B[i + 1] + dy * f * 0.55;
          gz = B[i + 2] + dz * f * 0.55 + dx * f * 0.30;
        }
      }
      P[i]     += (gx - P[i])     * k;
      P[i + 1] += (gy - P[i + 1]) * k;
      P[i + 2] += (gz - P[i + 2]) * k;
    }
    r.attr.needsUpdate = true;
  }

  let visible = true;
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) { last = performance.now(); requestAnimationFrame(loop); }
  });

  /* ---------------- render loop ---------------- */
  /* spin is incremental now so ignition can multiply the speed */
  const SPIN = { planet: 0.06, halo: -0.04, orbit: 0.12, dust: -0.05 }; /* rad/s */
  const OP = { orbit: 0.5, dust: 0.25 };
  let last = performance.now();

  function render(now, dt) {
    burnV = envTo(burnV, burnTarget, dt, 0.001, 0.08);
    const boost = 1 + burnV * 2.2;
    planet.rotation.y += SPIN.planet * boost * dt;
    innerHalo.rotation.y += SPIN.halo * boost * dt;
    orbit.rotation.y += SPIN.orbit * boost * dt;
    dust.rotation.y += SPIN.dust * boost * dt;

    displace(flexRings[0], dt);
    displace(flexRings[1], dt);
    stepPulses(dt);

    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    group.rotation.y = cx;
    group.rotation.x = 0.35 + cy;

    /* camera: multiplicative burn dolly-in × scroll pull-back,
       never an overwrite — parallax stays intact */
    const targetZ = 5.2 * (1 - 0.16 * burnV) * (1 + 0.20 * glowV);
    camera.position.z += (targetZ - camera.position.z) * (1 - Math.pow(0.005, dt));

    orbit.material.opacity = Math.min(0.95, OP.orbit + glowV * 0.25 + burnV * 0.20);
    dust.material.opacity  = Math.min(0.80, OP.dust  + glowV * 0.45 + burnV * 0.25);

    renderer.render(scene, camera);
  }

  function loop(now) {
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    render(now, dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------------- public API (consumed by fx-b.js) ---------------- */
  window.IPX_ORBIT = {
    well: setWell,
    burn: (v) => { burnTarget = v ? 1 : 0; },
    glow: (v) => { glowV = v; },
    pulse: spawnPulse
  };
})();
