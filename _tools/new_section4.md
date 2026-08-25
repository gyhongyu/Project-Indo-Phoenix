## 四、檔案清單

```
E:\Projects\Project Indo-Phoenix\
├── 交接工作報告.md            ← 本檔
├── GAS部署指南.md              ← Sheet 上傳 + GAS 網關部署步驟（業主操作手冊）
├── Project Indo-Phoenix_ India's ... FPC Hub.xlsx
│                               （原始模型 + WEB_DATA/WEB_TEXT 機器讀表；備份在 _tools/BACKUP_original.xlsx）
├── index.html                  模板挑選器（未來可改為正式落地頁）
├── template-a.html             OBSIDIAN 版
├── template-b.html             MISSION CONTROL 版
├── template-c.html             HOLOGRAM 版
├── README.md                   已改繁體中文
├── assets\
│   ├── css\                    base.css / template-a.css / template-b.css / template-c.css
│   └── js\
│       ├── data.js             離線備援快照 + IPX_CONFIG.gasUrl（GAS URL 填這裡）
│       ├── content-engine.js   ★ 線上 SSOT 內容引擎（快取優先 + 背景靜默同步）
│       ├── app.js              i18n 引擎、preloader、counter、Lenis
│       └── scene-a/b/c.js      各模板 3D 背景場景
├── docs\                       STATE.md / ACTIVE_LOG.md / adr / how-to
└── _tools\                     XLSX 手術腳本、驗證輸出、引擎煙霧測試（開發用，可部署時排除）
```

### 各檔職責
- `data.js`：`IPX_CONFIG.gasUrl`（線上端點）+ `IPX_DATA.stats` 離線備援 + `IPX_I18N.en/.zh`
  出廠預設文案。語言存 localStorage key **`ipx-lang`**（en 預設）。
- `content-engine.js`：★ 核心新增。啟動時同步套用 localStorage 快取 → 綁定 `[data-stat]` →
  背景 fetch GAS（WEB_DATA + WEB_TEXT）→ 有差異才寫快取並無縫換值。斷網自動退回快取/預設。
- `app.js`：i18n 引擎、preloader、自訂游標、scroll reveal、counter 跑數、Lenis 平滑滾動。
  暴露 `window.IPX_LANG` / `window.IPX_UI.init`；模板頁監聽 `ipx:ready` 後再掛 GSAP ScrollTrigger。
- `scene-x.js`：各模板背景場景。共同模式：`#bg-canvas` 全螢幕 canvas、DPR 上限（1.5–1.75）、
  `visibilitychange` + visible 旗標暫停／恢復 rAF 迴圈。