/* ============================================================
   TEMPLATE B — Background scene
   Three.js: particle planet + orbital gold ring + telemetry
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

  let visible = true;
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) requestAnimationFrame(loop);
  });

  function render(t) {
    planet.rotation.y = t * 0.00006;
    innerHalo.rotation.y = -t * 0.00004;
    orbit.rotation.y = t * 0.00012;
    dust.rotation.y = -t * 0.00005;
    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    group.rotation.y = cx;
    group.rotation.x = 0.35 + cy;
    renderer.render(scene, camera);
  }

  function loop(t) {
    if (!visible) return;
    render(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
