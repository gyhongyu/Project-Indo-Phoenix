/* ============================================================
   TEMPLATE A — Background scene
   Raw WebGL fragment shader: dark silk with faint gold light
   Interaction uniforms:
     u_boost  hold-to-intensify (brighter + faster drift)
     u_glow   scroll glow (fast brighten, slow dim)
     u_fig    rare ambiguous drifting figure (pareidolia by
              design — head/ear/trunk/shoulder soft-mass only,
              amplitude kept at the edge of perception)
   Public API: window.IPX_SMOKE { boost(v), glow(v), figure(v,x,y) }
   ============================================================ */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) { canvas.style.display = "none"; return; }

  const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  const FRAG = [
    "precision highp float;",
    "uniform vec2 u_res;uniform float u_time;",
    "uniform float u_boost;uniform float u_glow;",
    "uniform float u_fig;uniform vec2 u_figp;",
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
    "float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.;float a=.5;",
    " for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(11.7,7.3);a*=.52;}return v;}",
    "float ell(vec2 p,vec2 c,vec2 r,float s){float d=length((p-c)/r);return 1.-smoothstep(1.-s,1.,d);}",
    "float figure(vec2 p){",
    " float m=ell(p,vec2(0.,.62),vec2(.115,.15),.8);",
    " m=max(m,ell(p,vec2(-.17,.55),vec2(.085,.12),.8));",
    " m=max(m,ell(p,vec2(.17,.55),vec2(.085,.12),.8));",
    " m=max(m,ell(p,vec2(.055,.40),vec2(.05,.065),.8));",
    " m=max(m,ell(p,vec2(.115,.29),vec2(.048,.062),.8));",
    " m=max(m,ell(p,vec2(.15,.18),vec2(.046,.06),.8));",
    " m=max(m,ell(p,vec2(.125,.08),vec2(.042,.056),.8));",
    " m=max(m,ell(p,vec2(-.04,-.18),vec2(.40,.55),.9));",
    " return m;}",
    "void main(){",
    " vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;",
    " float t=u_time*.05*(1.+u_boost*1.4);",
    " float fm=figure(uv-u_figp)*u_fig;",
    " vec2 q=vec2(fbm(uv*1.6+t),fbm(uv*1.6-t*.8+3.1));",
    " vec2 r=vec2(fbm(uv*1.6+q*1.9+vec2(1.7,9.2)+t*.6),fbm(uv*1.6+q*1.9+vec2(8.3,2.8)-t*.4));",
    " float v=fbm(uv*1.6+r*1.6+fm*.38);",
    " vec3 col=mix(vec3(.016,.016,.02),vec3(.075,.062,.04),clamp(v*v*1.6,0.,1.));",
    " col+=smoothstep(.48,.92,r.y)*vec3(.79,.66,.43)*.16*(.35+v);",
    " col+=fm*vec3(.79,.66,.43)*.045*(.35+.65*v);",
    " col+=u_glow*vec3(.20,.16,.09)*(.35+v);",
    " float vig=smoothstep(1.25,.35,length(uv));",
    " col*=vig*.94+.06;",
    " col*=1.+u_boost*.85+u_glow*1.15;",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s)); return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog)); return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uBoost = gl.getUniformLocation(prog, "u_boost");
  const uGlow = gl.getUniformLocation(prog, "u_glow");
  const uFig = gl.getUniformLocation(prog, "u_fig");
  const uFigp = gl.getUniformLocation(prog, "u_figp");

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  addEventListener("resize", resize, { passive: true });
  resize();

  /* ------- interaction state (asymmetric easing: fast in, slow out) ------- */
  const st = { boost: 0, glow: 0, fig: 0, figx: 0.32, figy: -0.2 };
  const tgt = { boost: 0, glow: 0, fig: 0 };

  window.IPX_SMOKE = {
    /* hold: background smoke brightens & drifts faster */
    boost(v) { tgt.boost = Math.min(1, Math.max(0, v)); },
    /* scroll glow envelope (fx.js owns rise/decay, we just smooth) */
    glow(v) { tgt.glow = Math.min(1, Math.max(0, v)); },
    /* rare figure: 0 hides (slow fade out), 1 shows (slow fade in) */
    figure(v, x, y) {
      tgt.fig = Math.min(1, Math.max(0, v));
      if (typeof x === "number") { st.figx = x; st.figy = y; }
    }
  };

  function ease(cur, target, kUp, kDown) {
    return cur + (target - cur) * (target > cur ? kUp : kDown);
  }

  function draw(now) {
    st.boost = ease(st.boost, tgt.boost, 0.10, 0.045);   /* hold: quick in, slow out */
    st.glow = ease(st.glow, tgt.glow, 0.16, 0.030);      /* scroll: brighten fast, dim slow */
    st.fig = ease(st.fig, tgt.fig, 0.018, 0.011);        /* figure: ~6s in, ~9s out */
    if (st.fig > 0.01) st.figy += 0.0005;                /* drifts upward like smoke */
    gl.uniform1f(uTime, now * 0.001);
    gl.uniform1f(uBoost, st.boost);
    gl.uniform1f(uGlow, st.glow);
    gl.uniform1f(uFig, st.fig);
    gl.uniform2f(uFigp, st.figx, st.figy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let visible = true;
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) requestAnimationFrame(loop);
  });

  let last = 0;
  function loop(now) {
    if (!visible) return;
    // throttle to ~40fps — plenty for a slow ambient shader
    if (now - last > 24) { draw(now); last = now; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
