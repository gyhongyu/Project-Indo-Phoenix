# 🏛️ Project Indo-Phoenix 系統現狀與架構真源 (docs/STATE.md)

> ⚠️ **【文檔紀律】本檔為專案唯一架構真源 (SSOT)，嚴格維持 ≤ 200 行上限。**
> 最後校準日期：2026-08-23 · 審查主管：CTO · 狀態：`✅ VERIFIED`

---

## 🎯 1. 專案定位與業務核心 (Mission & Scope)
- **專案名稱**：Project Indo-Phoenix（印度航太國防 FPC 軟板工廠可行性計畫投資人演示網站）。
- **目標受眾**：國際與印度機構投資人、政府補貼機構 (SPECS)、戰略合作夥伴。
- **核心體驗**：高端奢華感、3D 互動場景、流暢雙語 (EN 預設 / 繁中切換)、嚴謹財務模型可視化。

---

## 🔒 2. 不可違背之架構不變量 (Hard Invariants)
1. **純靜態 Zero-Build 鐵律**：
   - 僅使用 HTML5 / CSS3 / Vanilla JavaScript + CDN（Three.js r128, GSAP 3.12.5, ScrollTrigger, Lenis 1.1.18）。
   - 嚴禁引入 Webpack / Vite / React 等打包框架，確保直接可在本機與 GitHub Pages 即插即用。
2. **數據單一真源 (SSOT) 鐵律**：
   - 線上真源：Google Sheet（人類只編輯 `FPC Factory Model` 表；`WEB_DATA` / `WEB_TEXT`
     兩張機器讀表以公式/內容供網站抓取，經 GAS Web App `?action=list&sheet_name=...` 輸出 JSON）。
   - 前端綁定：`assets/js/content-engine.js`（快取優先 localStorage → 背景靜默同步）；
     HTML 一律用 `data-stat="key"` 綁數字、`data-i18n` 綁文案，嚴禁寫死數值。
   - `assets/js/data.js`（`IPX_DATA.stats` / `IPX_I18N` / `IPX_CONFIG.gasUrl`）降級為
     離線出廠備援快照，需與 Sheet 現值保持同步。
   - 原始模型檔：`Project Indo-Phoenix...xlsx`（含 WEB_DATA / WEB_TEXT 兩張新增頁籤）。
3. **無障礙與動效分層 (Motion Layering)**：
   - `prefers-reduced-motion` 尊重：文字進場、計數器、滾動動畫優雅降級；ambient 3D 背景保持平緩 GPU 節流渲染。
4. **多代理人職責與落盤鐵律**：
   - CTO 嚴禁直接修改業務代碼；工程師必須雙軌交付並實體落盤 `工程師階段工作匯報.md` + 6 行追加 `docs/ACTIVE_LOG.md`。

---

## 📊 3. 關鍵財務數據真值表 (Ground Truth — 同步自線上 Sheet 現值)
| 關鍵指標 | 數值真值 | WEB_DATA key | 來源 |
| :--- | :--- | :--- | :--- |
| **月產能** | `15,000 m²/月` | `capacityMonthlyM2` | 公式 → FPC Factory Model!D10 |
| **平均單價 (ASP)** | `$160 / m²` | `weightedPrice` | 公式 → !F10 |
| **年營收** | `$28.8M` ($2.4M/月) | `annualRevenue` | 公式 → !H10 |
| **總資本支出** | `$23.0M` (淨投入 `$17.25M`) | `totalCapex` / `netCapex` | 公式 → !D27 / !G27 |
| **月營運支出** | `$1.845M / 月` | `monthlyOpex` | 公式 → !D35 |
| **EBIT 利潤率** | `23.1%` ($555K/月) | `ebitMargin` / `ebitMonthly` | 公式 → !E41 / !C41 |
| **損益兩平點** | `50.8%` 利用率 / `$1.22M` 月營收 | `bep` / `bepRevenue` | 公式 → !E42 / !C43 |
| **IRR** | `21.3% – 24.8%` | `irrLow` / `irrHigh` | ⚠️ 手動輸入格（Sheet 未建模） |
| **回收期** | `4.2 年` (無補貼 `5.2 年`) | `payback` / `paybackRaw` | ⚠️ 手動輸入格 |

> ⚠️ 2026-08-24 校準註記：業主線上 Sheet 已改模（ASP 140→160、營收 25.2→28.8M、
> OpEx 1.645→1.845M、EBIT 21.7→23.1%、BEP 55.7→50.8%），全站已跟隨 Sheet 真值。

---

## 🗺️ 4. 目錄結構與模組地圖 (Directory SSOT)
```text
Project Indo-Phoenix/
├── index.html              ← 網站入口 (根目錄部署 GitHub Pages)
├── template-a.html         ← 模板 A: 黑金編輯風 (OBSIDIAN)
├── template-b.html         ← 模板 B: 航太 HUD 風 (MISSION CONTROL)
├── template-c.html         ← 模板 C: 全息點雲科幻風 (HOLOGRAM)
├── assets/
│   ├── css/                ← base.css, template-a/b/c.css
│   └── js/                 ← data.js (備援快照+設定), content-engine.js (線上SSOT引擎),
│                              app.js (UI引擎), scene-a/b/c.js (3D場景)
├── docs/                   ← DMC 研發知識庫治理中心
│   ├── STATE.md            ← [本檔] 架構唯一真源 (≤200行)
│   ├── ACTIVE_LOG.md       ← 研發踩坑與決策單向追加日誌
│   ├── adr/                ← 架構決策記錄
│   ├── how-to/             ← 實戰操作指引
│   └── archive/            ← 歷史滾動封存
├── AGENTS.md               ← 軟體工程多代理人最高守則
├── ROADMAP.md              ← 專案階段施工圖
├── README.md               ← 專案公開說明與部署指南
├── GAS部署指南.md           ← Sheet 上傳 + GAS 萬能網關部署步驟
├── _tools/                 ← XLSX 手術腳本 / 備份 / 引擎煙霧測試
├── 交接工作報告.md         ← 歷史交接底稿
└── Project Indo-Phoenix...xlsx ← 原始可行性財務模型 (含 WEB_DATA/WEB_TEXT 頁籤)
```

---

## 🛡️ 5. 屍前驗屍 (Pre-mortem) 核心防禦抗體
1. **GitHub Pages 根路徑陷阱**：所有資源與頁面跳轉一律採用相對路徑（如 `assets/...`），支援子目錄與自定義網域。
2. **WebGL Context 洩漏防禦**：頁面切換或分頁隱藏時，透過 `visibilitychange` 與 dispose 機制釋放 GPU 負載。
3. **i18n Key 缺漏防禦**：所有 HTML `data-i18n` 鍵值必須在 `data.js` 的 `en` 與 `zh` 中 100% 對齊。
