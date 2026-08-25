"use strict";
/* One-shot static check: GLSL paren balance + required uniforms present.
   Covers scene-a.js FRAG block and scene-c.js vertex/fragment blocks. */
const fs = require("fs");
const ROOT = __dirname + "/../assets/js/";

function strings(blockSrc) {
  return [...blockSrc.matchAll(/"([^"]*)"/g)].map((x) => x[1]).join("\n");
}
function check(file, blockRe, label, uniforms) {
  const src = fs.readFileSync(ROOT + file, "utf8");
  const m = src.match(blockRe);
  if (!m) { console.error("MISSING " + label + " block in " + file); return false; }
  const code = strings(m[0]);
  let bal = 0;
  for (const c of code) { if (c === "(") bal++; if (c === ")") bal--; }
  console.log(file + " [" + label + "] paren balance:", bal);
  let ok = bal === 0;
  uniforms.forEach((u) => {
    const has = code.includes(u);
    console.log((has ? "has " : "MISSING ") + u);
    if (!has) ok = false;
  });
  return ok;
}

let allOk = true;

/* Template A — fragment shader (unchanged, regression guard) */
allOk = check("scene-a.js", /const FRAG = \[[\s\S]*?\]\.join/, "FRAG",
  ["u_boost", "u_glow", "u_fig", "u_figp", "figure", "fbm"]) && allOk;

/* Template C — vertex shader (Phase 3 interaction uniforms) */
allOk = check("scene-c.js", /vertexShader: \[[\s\S]*?\]\.join/, "VERT",
  ["uTime", "uScanY", "uMag", "uMagPos", "uGlitch", "uDeep", "uGlow",
   "vGlow", "vMix"]) && allOk;

/* Template C — fragment shader */
allOk = check("scene-c.js", /fragmentShader: \[[\s\S]*?\]\.join/, "FRAG",
  ["uColA", "uColB", "vGlow", "vMix"]) && allOk;

process.exit(allOk ? 0 : 2);
