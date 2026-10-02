# 🤝 Project Indo-Phoenix 階段交接文檔 (HANDOFF.md)

> 📅 交接時間：2026-10-02 · 工作目錄：`c:\Program1\Project-Indo-Phoenix`  
> 本文檔為跨會話 AI 代理人標準單一真理源（SSOT）交接總表。接班工程師進場請先參閱此檔與 [`docs/STATE.md`](file:///c:/Program1/Project-Indo-Phoenix/docs/STATE.md)。

---

## 📌 1. 本會話完成並已固化之核心成果
1. **無塵室規格全面升級**：
   - 配合線上工程規劃與高密度 FPC 精密曝光需求，全站黃光區無塵室等級由「萬級 (Class 10K / 10,000)」升級為「**千級 (Class 1K / 1,000)**」。
2. **GAS 萬能網關全鏈路排查與動態連動打通**：
   - 線上 Google Sheet `WEB_DATA` 頁籤 B20 已正式改為 `1K`。
   - 瀏覽器物理驗證 GAS 網關回傳 24 筆資料正常，網關本身未失效。
   - 修復 [`assets/js/content-engine.js`](file:///c:/Program1/Project-Indo-Phoenix/assets/js/content-engine.js) 正則表達式貪婪截斷 Bug（`1K` 不再被誤截為純數字 `1`），並在同步時廣播 `ipx:content-updated` 事件。
   - 打通 [`assets/js/presentation-data.js`](file:///c:/Program1/Project-Indo-Phoenix/assets/js/presentation-data.js) 與 [`assets/js/presentation-engine.js`](file:///c:/Program1/Project-Indo-Phoenix/assets/js/presentation-engine.js)，讓 WebPPT 投影片（Slide 08/09）與線上試算表實現即時動態連動。
3. **DMC 知識日誌同步**：
   - 已在 [`docs/ACTIVE_LOG.md`](file:///c:/Program1/Project-Indo-Phoenix/docs/ACTIVE_LOG.md) 以標準 6 行格式追加原子日誌。

---

## 🔍 2. 當前關鍵上下文：線上 Google Sheet 與 GAS 網關狀態
- **線上 Google Sheet 實體網址**：
  `https://docs.google.com/spreadsheets/d/1xbxE2fijxQR3Lzd9r6IQQBZbUikpxfIbcdgZkQswHvU/edit?gid=2122582769#gid=2122582769`
- **現行配置之 GAS Web App 網關網址**（位於 [`assets/js/data.js`](file:///c:/Program1/Project-Indo-Phoenix/assets/js/data.js#L10)）：
  `https://script.google.com/macros/s/AKfycbzPRGJ3gOlbro2YigiF5t1qoG3PEwUGXU9d-tWkrIGpiK7yfiCMNV3DxzKLvEC84mG9eQ/exec`
- **狀態**：✅ 運行正常（Status 200, JSON valid）。

---

## 🎯 3. 下一步建議工作
- 持續關注業主在 Google Sheet 上更新之財務模型或文案，前端將自動透過 Cache-First + 背景靜默同步保持最新狀態。

---

## 🛡️ 4. 防破壞邊界（Hard Invariants）
- **絕對禁止未經使用者明確指示發起 `git push`**。
- 專案為純前端靜態結構，零 build step，嚴禁引入打包工具。
- 保持 CSS 變數相容三套主題（A/B/C）。
- 任何代碼或重大架構異動必須於 [`docs/ACTIVE_LOG.md`](file:///c:/Program1/Project-Indo-Phoenix/docs/ACTIVE_LOG.md) 追加記錄。
