/* Smoke test for content-engine.js under Node with mocked browser env */
"use strict";
const path = require("path");
const root = "E:/Projects/Project Indo-Phoenix/assets/js";

/* ---- mocks ---- */
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
};
function makeEl(attrs) {
  return {
    _attr: Object.assign({}, attrs),
    textContent: "0",
    getAttribute(n) { return this._attr[n] !== undefined ? this._attr[n] : null; },
    setAttribute(n, v) { this._attr[n] = String(v); },
  };
}
const els = [
  makeEl({ "data-stat": "capacityMonthlyM2", "data-count": "15000" }),
  makeEl({ "data-stat": "annualRevenue", "data-scale": "1000000", "data-decimals": "1", "data-count": "25.2" }),
  makeEl({ "data-stat": "annualRevenue", "data-scale": "1000000", "data-decimals": "1", "data-stat-format": "$%sM" }),
];
global.document = { querySelectorAll: () => els };
global.window = global;

let calls = [];
global.fetch = (url) => {
  calls.push(url);
  const isData = url.includes("WEB_DATA");
  const json = isData
    ? { status: "success", data: [
        { key: "capacityMonthlyM2", value: 15000 },
        { key: "annualRevenue", value: 28800000 },
        { key: "weightedPrice", value: 160 },
      ] }
    : { status: "success", data: [
        { key: "cta.btn", en: "Request Investor Access", zh: "申請投資人專區" },
      ] };
  return Promise.resolve({ json: () => Promise.resolve(json) });
};

/* ---- load scripts ---- */
require(path.join(root, "data.js"));
window.IPX_CONFIG.gasUrl = "https://script.google.com/macros/s/FAKE/exec";
window.IPX_I18N.en.cta = {}; window.IPX_I18N.zh.cta = {};

require(path.join(root, "content-engine.js"));

setTimeout(() => {
  let pass = 0, fail = 0;
  function t(name, cond) { cond ? (pass++, console.log("PASS:", name)) : (fail++, console.log("FAIL:", name)); }

  t("fetch called twice (DATA+TEXT)", calls.length === 2);
  t("live stats merged from sheet", window.IPX_DATA.stats.weightedPrice === 160);
  t("i18n merged (en)", window.IPX_I18N.en.cta.btn === "Request Investor Access");
  t("i18n merged (zh)", window.IPX_I18N.zh.cta.btn === "\u7533\u8acb\u6295\u8cc7\u4eba\u5c08\u5340");
  t("cache written", !!store["ipx-content-cache-v1"]);
  t("el1 data-count updated to live", els[0]._attr["data-count"] === "15000");
  t("el2 data-count scaled to millions", els[1]._attr["data-count"] === "28.8");
  t("format-mode element painted", els[2].textContent === "$28.8M");

  /* --- second boot simulating reload (cache exists, network dead) --- */
  global.fetch = () => Promise.reject(new Error("offline"));
  delete require.cache[require.resolve(path.join(root, "content-engine.js"))];
  try { require(path.join(root, "content-engine.js")); } catch (e) { console.log("reload err:", e.message); }
  setTimeout(() => {
    t("cached stats survive offline reload", window.IPX_DATA.stats.weightedPrice === 160);
    console.log("\nRESULT: " + pass + " passed, " + fail + " failed");
    process.exit(fail ? 1 : 0);
  }, 150);
}, 200);