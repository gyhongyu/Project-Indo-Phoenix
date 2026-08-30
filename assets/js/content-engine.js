/* ============================================================
   PROJECT INDO-PHOENIX — Content Engine
   SSOT: online Google Sheet via GAS Web App (Universal Gateway)
   Strategy: CACHE-FIRST + silent background refresh
   - 1st visit ever: shows bundled defaults (data.js), fetches,
     caches, applies seamlessly.
   - Every next open: instant render from localStorage cache,
     then quietly syncs in background (presentation-safe).
   ============================================================ */

(function () {
  "use strict";

  var CFG = window.IPX_CONFIG || {};
  var GAS_URL = (CFG.gasUrl || "").replace(/\/+$/, "");
  var CACHE_KEY = "ipx-content-cache-v1";

  /* ---------------- storage ---------------- */
  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); }
    catch (e) { return null; }
  }
  function writeCache(payload) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch (e) {}
  }

  /* ------------- object helpers ------------- */
  function setPath(obj, path, val) {
    var parts = path.split("."), o = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (typeof o[parts[i]] !== "object" || o[parts[i]] === null) o[parts[i]] = {};
      o = o[parts[i]];
    }
    o[parts[parts.length - 1]] = val;
  }
  function mergeFlat(target, flat) {
    Object.keys(flat || {}).forEach(function (k) { setPath(target, k, flat[k]); });
  }

  /* -------- apply a payload into live objects -------- */
  function applyPayload(p) {
    if (!p) return;
    var stats = window.IPX_DATA && window.IPX_DATA.stats;
    if (p.stats && stats) Object.keys(p.stats).forEach(function (k) { stats[k] = p.stats[k]; });
    if (p.i18n && window.IPX_I18N) {
      mergeFlat(window.IPX_I18N.en, p.i18n.en || {});
      mergeFlat(window.IPX_I18N.zh, p.i18n.zh || {});
    }
  }

  /* -------------- number formatting -------------- */
  function fmt(v, decimals) {
    return Number(v).toLocaleString("en-US", {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals
    });
  }

  /* ---------- bind [data-stat] elements ---------- */
  function bindStats(force) {
    var els = document.querySelectorAll("[data-stat]");
    Array.prototype.forEach.call(els, function (el) {
      var key = el.getAttribute("data-stat");
      var raw = window.IPX_DATA && window.IPX_DATA.stats ? window.IPX_DATA.stats[key] : undefined;
      if (raw === undefined || raw === null) return;
      var scale = parseFloat(el.getAttribute("data-scale") || "1") || 1;
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var shown = fmt(Number(raw) / scale, dec);
      var tmpl = el.getAttribute("data-stat-format");
      if (tmpl) {                       // whole-string mode e.g. "$%sM"
        el.textContent = tmpl.replace("%s", shown);
        return;
      }
      el.setAttribute("data-count", String(Number(raw) / scale));
      var counted = el.getAttribute("data-counted") === "1";
      if (counted || force === "silent") el.textContent = shown;
    });
  }

  /* --------- convert GAS list rows -> payload --------- */
  function rowsToPayload(dataRows, textRows) {
    var p = { ts: Date.now(), stats: {}, i18n: { en: {}, zh: {} } };
    (dataRows || []).forEach(function (r) {
      if (!r.key) return;
      var v = r.value;
      if (v === "" || v === null || v === undefined) return;
      var cleanStr = String(v).replace(/,/g, "").trim();
      var match = cleanStr.match(/^[-+]?[0-9]*\.?[0-9]+/);
      var n = match ? parseFloat(match[0]) : NaN;
      p.stats[String(r.key).trim()] = isNaN(n) ? String(v) : n;
    });
    (textRows || []).forEach(function (r) {
      var k = String(r.key || "").trim();
      if (!k) return;
      if (r.en !== "" && r.en !== null && r.en !== undefined) p.i18n.en[k] = String(r.en);
      if (r.zh !== "" && r.zh !== null && r.zh !== undefined) p.i18n.zh[k] = String(r.zh);
    });
    return p;
  }

  function fetchSheet(sheetName, cb) {
    var url = GAS_URL + "?action=list&sheet_name=" + encodeURIComponent(sheetName) +
              "&_cb=" + Date.now();
    fetch(url, { method: "GET", redirect: "follow" })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json && json.status === "success" && Array.isArray(json.data)) cb(null, json.data);
        else cb(new Error(json && json.message || "bad response"));
      })
      .catch(function (err) { cb(err); });
  }

  function backgroundSync() {
    if (!GAS_URL) return;
    var done = 0, dataRows = null, textRows = null, failed = false;
    function fin() {
      done++;
      if (done < 2) return;
      if (failed) return;                    // offline -> keep cache/defaults
      var payload = rowsToPayload(dataRows, textRows);
      var cached = readCache();
      if (cached && JSON.stringify(cached.stats) === JSON.stringify(payload.stats) &&
          JSON.stringify(cached.i18n) === JSON.stringify(payload.i18n)) return; // no change
      writeCache(payload);
      applyPayload(payload);
      bindStats("silent");
      if (window.IPX_LANG && window.IPX_LANG.apply) window.IPX_LANG.apply();
    }
    fetchSheet("WEB_DATA", function (e, d) { if (e) failed = true; else dataRows = d; fin(); });
    fetchSheet("WEB_TEXT", function (e, d) { if (e) failed = true; else textRows = d; fin(); });
  }

  /* ------------------- bootstrap ------------------- */
  applyPayload(readCache());   // synchronous: instant paint from cache
  bindStats(false);            // wire data-count targets before counters start
  backgroundSync();            // quiet refresh; updates only if changed

  window.IPX_CONTENT = {
    refresh: function () { writeCache(null); backgroundSync(); },
    version: "1.0"
  };
})();