/* ============================================================
   TEMPLATE A — Background scene
   Raw WebGL fragment shader: dark silk with faint gold light
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
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
    "float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.;float a=.5;",
    " for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(11.7,7.3);a*=.52;}return v;}",
    "void main(){",
    " vec2 uv=(gl_FragCoord.xy-.5*u_res)/u_res.y;",
    " float t=u_time*.05;",
    " vec2 q=vec2(fbm(uv*1.6+t),fbm(uv*1.6-t*.8+3.1));",
    " vec2 r=vec2(fbm(uv*1.6+q*1.9+vec2(1.7,9.2)+t*.6),fbm(uv*1.6+q*1.9+vec2(8.3,2.8)-t*.4));",
    " float v=fbm(uv*1.6+r*1.6);",
    " vec3 col=mix(vec3(.016,.016,.02),vec3(.075,.062,.04),clamp(v*v*1.6,0.,1.));",
    " col+=smoothstep(.48,.92,r.y)*vec3(.79,.66,.43)*.16*(.35+v);",
    " float vig=smoothstep(1.25,.35,length(uv));",
    " col*=vig*.94+.06;",
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

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  addEventListener("resize", resize, { passive: true });
  resize();

  function draw(now) {
    gl.uniform1f(uTime, now * 0.001);
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
