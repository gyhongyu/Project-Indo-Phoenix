/* ============================================================
   TEMPLATE C — Background scene
   HOLOGRAM MORPH — procedural device point-clouds
   (drone -> AI glasses -> smartphone -> robot arm)
   scanline sweep · projector rings · mouse parallax
   ============================================================ */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || !window.THREE) return;

  const N = innerWidth < 700 ? 3800 : 7200;

  /* -------- stroke sampler: build shapes from lines/arcs -------- */
  function sampler() {
    const S = [];
    function line(ax, ay, bx, by, z, dz, z2) {
      const zA = z || 0, zB = (z2 === undefined ? zA : z2), d = dz || 0;
      S.push({ len: Math.hypot(bx - ax, by - ay) || 0.01,
        f: (t) => [ax + (bx - ax) * t, ay + (by - ay) * t,
                   zA + (zB - zA) * t + (Math.random() - 0.5) * d] });
    }
    function arc(cx, cy, r, a0, a1, z, dz) {
      S.push({ len: r * Math.abs(a1 - a0),
        f: (t) => { const a = a0 + (a1 - a0) * t;
          return [cx + Math.cos(a) * r, cy + Math.sin(a) * r,
                  (z || 0) + (Math.random() - 0.5) * (dz || 0)]; } });
    }
    function circle(cx, cy, r, z, dz) { arc(cx, cy, r, 0, Math.PI * 2, z, dz); }
    function rr(x, y, w, h, r, z, dz) {
      const hw = w / 2, hh = h / 2;
      line(x-hw+r, y+hh, x+hw-r, y+hh, z, dz);
      line(x+hw, y+hh-r, x+hw, y-hh+r, z, dz);
      line(x+hw-r, y-hh, x-hw+r, y-hh, z, dz);
      line(x-hw, y-hh+r, x-hw, y+hh-r, z, dz);
      arc(x+hw-r, y+hh-r, r, 0, Math.PI/2, z, dz);
      arc(x-hw+r, y+hh-r, r, Math.PI/2, Math.PI, z, dz);
      arc(x-hw+r, y-hh+r, r, Math.PI, Math.PI*1.5, z, dz);
      arc(x+hw-r, y-hh+r, r, Math.PI*1.5, Math.PI*2, z, dz);
    }
    function build(n) {
      const total = S.reduce((s, k) => s + k.len, 0);
      const out = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        let tgt = Math.random() * total, st = S[0];
        for (let j = 0; j < S.length; j++) {
          if ((tgt -= S[j].len) <= 0) { st = S[j]; break; }
        }
        const p = st.f(Math.random());
        out[i*3] = p[0]; out[i*3+1] = p[1]; out[i*3+2] = p[2];
      }
      return out;
    }
    return { line, arc, circle, rr, build };
  }

  /* ---------------- the four device silhouettes ---------------- */
  function drone() {
    const s = sampler();
    s.circle(0, 0, 0.24, 0, 0.07);
    s.circle(0, 0, 0.10, 0.02, 0.04);
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach((d) => {
      s.line(d[0]*0.16, d[1]*0.16, d[0]*0.60, d[1]*0.60, 0, 0.05);
      s.circle(d[0]*0.70, d[1]*0.70, 0.17, 0.01, 0.03);
      s.circle(d[0]*0.70, d[1]*0.70, 0.07, 0.03, 0.02);
    });
    return s.build(N);
  }
  function glasses() {
    const s = sampler();
    s.rr(-0.36, 0.02, 0.50, 0.34, 0.10, 0, 0.02);
    s.rr( 0.36, 0.02, 0.50, 0.34, 0.10, 0, 0.02);
    s.arc(-0.11, 0.16, 0.12, 0, Math.PI, 0, 0.012);
    s.line(-0.61, 0.12, -0.67, 0.02, 0, 0.02, 0.95);
    s.line( 0.61, 0.12,  0.67, 0.02, 0, 0.02, 0.95);
    s.line(-0.67, 0.02, -0.63, -0.08, 0.95, 0.02);
    s.line( 0.67, 0.02,  0.63, -0.08, 0.95, 0.02);
    return s.build(N);
  }
  function phone() {
    const s = sampler();
    s.rr(0, 0, 0.54, 1.04, 0.10, -0.05, 0.015);
    s.rr(0, 0, 0.54, 1.04, 0.10,  0.05, 0.015);
    s.rr(0, -0.01, 0.46, 0.90, 0.07, 0.068, 0.01);
    s.circle(0.145, 0.40, 0.028, 0.062, 0.008);
    s.line(0.278, 0.16, 0.278, 0.30, 0, 0.012);
    return s.build(N);
  }
  function arm() {
    const s = sampler();
    s.line(-0.42, -0.78, 0.42, -0.78, 0, 0.05);
    s.rr(0, -0.66, 0.66, 0.16, 0.04, 0, 0.05);
    s.circle(0.05, -0.50, 0.09, 0, 0.05);
    s.line(0.05, -0.50, 0.42, 0.08, 0, 0.05);
    s.circle(0.42, 0.08, 0.07, 0, 0.05);
    s.line(0.42, 0.08, -0.12, 0.58, 0, 0.05);
    s.circle(-0.12, 0.58, 0.055, 0, 0.04);
    s.line(-0.12, 0.58, -0.34, 0.74, 0, 0.03);
    s.line(-0.12, 0.58, -0.30, 0.44, 0, 0.03);
    s.line(-0.34, 0.74, -0.45, 0.83, 0, 0.03);
    s.line(-0.30, 0.44, -0.43, 0.37, 0, 0.03);
    return s.build(N);
  }

  /* ------------------- renderer / scene ------------------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0.15, 4.3);

  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = Math.random();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:   { value: 0 },
      uScanY:  { value: -2 },
      uColA:   { value: new THREE.Color(0x35e0ff) },
      uColB:   { value: new THREE.Color(0x8b7bff) },
      uMag:    { value: 0 },                          /* magnetize envelope 0..1 */
      uMagPos: { value: new THREE.Vector3(0, 0, 0) }, /* cursor point, cloud-local */
      uGlitch: { value: 0 },                          /* glitch burst envelope */
      uDeep:   { value: 0 },                          /* deep-scan exploded view */
      uGlow:   { value: 0 }                           /* wheel / scroll power */
    },
    vertexShader: [
      "attribute float aSeed;",
      "uniform float uScanY;",
      "uniform float uTime;",
      "uniform float uMag;",
      "uniform vec3 uMagPos;",
      "uniform float uGlitch;",
      "uniform float uDeep;",
      "uniform float uGlow;",
      "varying float vGlow;",
      "varying float vMix;",
      "void main() {",
      "  vec3 p = position;",
      /* magnetize: points near the cursor get pulled in + agitated */
      "  vec3 dm = p - uMagPos;",
      "  float pull = smoothstep(0.95, 0.0, length(dm)) * uMag;",
      "  p -= dm * pull * 0.55;",
      "  p += vec3(sin(uTime * 3.1 + aSeed * 43.0),",
      "            cos(uTime * 2.6 + aSeed * 61.0),",
      "            sin(uTime * 2.2 + aSeed * 29.0)) * pull * 0.07;",
      /* deep scan: exploded view along each point's radial */
      "  p += normalize(p + vec3(0.0001)) * uDeep * (0.22 + aSeed * 0.22);",
      /* glitch burst: horizontal slices jump sideways */
      "  float row = floor((p.y + 2.0) * 9.0);",
      "  float jump = step(0.8, fract(sin(row * 91.7 + floor(uTime * 28.0) * 13.1) * 43758.5453));",
      "  p.x += (jump - 0.5) * 0.30 * uGlitch;",
      "  p.z += (fract(aSeed * 7.0) - 0.5) * 0.10 * uGlitch;",
      "  vec4 mv = modelViewMatrix * vec4(p, 1.0);",
      "  gl_Position = projectionMatrix * mv;",
      "  gl_PointSize = (7.0 + aSeed * 8.0) / max(0.1, -mv.z);",
      "  float scan = smoothstep(0.30, 0.02, abs(position.y - uScanY));",
      "  float flick = 0.84 + 0.16 * sin(uTime * 24.0 + aSeed * 90.0);",
      "  vGlow = (0.38 + 0.9 * scan + uDeep * 0.55 + uGlow * 0.85) * flick",
      "        + uGlitch * 0.5 + pull * 0.6;",
      "  vMix = aSeed;",
      "}"
    ].join("\n"),
    fragmentShader: [
      "precision mediump float;",
      "uniform vec3 uColA;",
      "uniform vec3 uColB;",
      "varying float vGlow;",
      "varying float vMix;",
      "void main() {",
      "  vec2 c = gl_PointCoord - 0.5;",
      "  if (dot(c, c) > 0.25) discard;",
      "  float a = smoothstep(0.5, 0.08, length(c));",
      "  vec3 col = mix(uColA, uColB, smoothstep(0.2, 1.0, vMix));",
      "  gl_FragColor = vec4(col * (0.2 + vGlow), a * min(vGlow, 1.0) * 0.9);",
      "}"
    ].join("\n"),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });

  const cloud = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(cloud);

  /* hologram projector rings (refs kept so FX can breathe them) */
  const projRings = [];
  [0.85, 1.25, 1.70].forEach((r, i) => {
    const pts = [];
    for (let k = 0; k <= 90; k++) {
      const a = (k / 90) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const baseOp = 0.16 - i * 0.045;
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x35e0ff, transparent: true, opacity: baseOp })
    );
    ring.position.y = -1.14;
    group.add(ring);
    projRings.push({ mesh: ring, baseOp: baseOp });
  });
  scene.add(group);

  /* -------------------- morph engine -------------------- */
  const SHAPES = [drone(), glasses(), phone(), arm()];
  const pos = geo.attributes.position;
  const HOLD = 4200, MORPH = 1700, CYCLE = HOLD + MORPH;
  let curIdx = 0;

  function applyShape(a) { pos.array.set(a); pos.needsUpdate = true; }

  function morphStep(target, u01) {
    const A = SHAPES[curIdx], B = SHAPES[target], P = pos.array;
    for (let i = 0; i < N; i++) {
      let u = u01 * 1.38 - seeds[i] * 0.38;
      u = u < 0 ? 0 : u > 1 ? 1 : u;
      u = u * u * (3 - 2 * u);
      const j = i * 3;
      P[j]     = A[j]     + (B[j]     - A[j])     * u;
      P[j + 1] = A[j + 1] + (B[j + 1] - A[j + 1]) * u;
      P[j + 2] = A[j + 2] + (B[j + 2] - A[j + 2]) * u;
    }
    pos.needsUpdate = true;
  }

  /* ---------------- interaction / resize ---------------- */
  let tx = 0, ty = 0, mx = 0, my = 0;
  addEventListener("mousemove", (e) => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(dpr);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    const wide = innerWidth > 980;
    group.position.x = wide ? 1.15 : 0;
    group.position.y = wide ? 0 : 0.3;
    group.scale.setScalar(Math.min(1, innerWidth / 900));
  }
  addEventListener("resize", resize, { passive: true });
  resize();
  applyShape(SHAPES[0]);

  /* ============================================================
     Interaction core — magnetize · glitch burst · deep scan ·
     wheel glow · ghost echo (driven by fx-c.js via IPX_HOLO)
     All displacement lives in the vertex shader: zero CPU cost.
     ============================================================ */
  const raycaster = new THREE.Raycaster();
  const planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ndc = new THREE.Vector2();
  const hitP = new THREE.Vector3();

  let magActive = false, magHas = false;
  const magClient = { x: 0, y: 0 };
  let magV = 0, deepTarget = 0, deepV = 0, glitchV = 0, glowV = 0;

  /* ghost echo pass: same geometry, offset additive copy */
  const ghostMat = new THREE.PointsMaterial({
    color: 0x35e0ff, size: 0.02, transparent: true,
    opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const ghost = new THREE.Points(geo, ghostMat);
  ghost.visible = false;
  group.add(ghost);

  const ECHO_MS = 850;
  let echoOn = false, echoUntil = 0;

  /* asymmetric envelope: fast rise, slow release */
  function envTo(v, target, dt, rise, fall) {
    const c = target > v ? rise : fall;
    return v + (target - v) * (1 - Math.pow(c, dt));
  }

  let visible = true;
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) { last = performance.now(); requestAnimationFrame(loop); }
  });

  /* ---------------- render loop ---------------- */
  let last = performance.now();
  let scanPhase = 0;

  function render(now, dt) {
    const cyc = now % (CYCLE * SHAPES.length);
    const idx = Math.floor(cyc / CYCLE);
    const ph = cyc % CYCLE;
    if (ph <= MORPH) { if (idx !== curIdx) morphStep(idx, ph / MORPH); }
    else if (idx !== curIdx) { curIdx = idx; applyShape(SHAPES[idx]); }

    mat.uniforms.uTime.value = now * 0.001;
    /* scan sweep speeds up during deep scan */
    scanPhase = (scanPhase + dt * 0.21 * (1 + deepV * 1.8)) % 1;
    mat.uniforms.uScanY.value = -1.4 + 2.9 * scanPhase;

    /* envelopes: fast rise, slow decay */
    magV = envTo(magV, magActive ? 1 : 0, dt, 2e-7, 0.0032);
    deepV = envTo(deepV, deepTarget, dt, 0.0014, 0.08);
    glitchV *= Math.pow(0.0005, dt);

    /* cursor client coords → world z=0 plane → cloud-local space */
    if (magActive && magHas) {
      ndc.set((magClient.x / innerWidth) * 2 - 1,
              -((magClient.y / innerHeight) * 2 - 1));
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(planeZ0, hitP)) {
        group.worldToLocal(hitP);
        mat.uniforms.uMagPos.value.copy(hitP);
      }
    }
    mat.uniforms.uMag.value = magV;
    mat.uniforms.uDeep.value = deepV;
    mat.uniforms.uGlitch.value = glitchV;
    mat.uniforms.uGlow.value = glowV;

    /* projector rings brighten & pulse with power / deep scan */
    projRings.forEach((r, i) => {
      r.mesh.material.opacity = Math.min(0.6,
        r.baseOp + glowV * 0.22 + deepV * 0.30);
      r.mesh.scale.setScalar(1 + Math.sin(now * 0.004 + i * 1.7) * 0.03 * deepV);
    });

    /* rare ghost echo: signal double-image fading in and out */
    if (echoOn) {
      const k = Math.min(1, 1 - (echoUntil - now) / ECHO_MS);
      ghost.visible = true;
      ghost.position.set(Math.sin(now * 0.02) * 0.07,
                         Math.cos(now * 0.017) * 0.05, -0.14);
      ghostMat.size = 0.02 + deepV * 0.01;
      ghostMat.opacity = 0.20 * Math.sin(Math.PI * k);
      if (now >= echoUntil) {
        echoOn = false; ghost.visible = false; ghostMat.opacity = 0;
      }
    }

    mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
    group.rotation.y = Math.sin(now * 0.00022) * 0.38 + mx * 0.45;
    group.rotation.x = 0.07 + my * 0.25;

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

  /* ---------------- public API (consumed by fx-c.js) ---------------- */
  window.IPX_HOLO = {
    mag: (x, y, active) => {
      magActive = !!active;
      if (magActive) { magClient.x = x; magClient.y = y; magHas = true; }
    },
    glitch: () => { glitchV = 1; },
    deep: (v) => { deepTarget = v ? 1 : 0; },
    glow: (v) => { glowV = v; },
    echo: () => { echoOn = true; echoUntil = performance.now() + ECHO_MS; }
  };
})();
