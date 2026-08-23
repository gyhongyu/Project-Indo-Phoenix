# Project Indo-Phoenix — 投資人演示網站

印度航太國防 FPC（軟性印刷電路板）戰略樞紐的豪華級投資人演示網站。
所有數據皆直接取自可行性工作簿（`Project Indo-Phoenix...xlsx`，工作表 **FPC Factory Model**，Modules 1–5）。

---

## 🚀 快速開始

直接於瀏覽器開啟 `index.html`（模板挑選器），或個別瀏覽三大 3D 視覺方向：

| 檔案 | 視覺方向 | 背景技術 |
| :--- | :--- | :--- |
| [`template-a.html`](file:///e:/Projects/Project%20Indo-Phoenix/template-a.html) | **OBSIDIAN** — 黑金編輯風 | Raw WebGL 片段著色器絲綢 |
| [`template-b.html`](file:///e:/Projects/Project%20Indo-Phoenix/template-b.html) | **MISSION CONTROL** — 海軍藍航太 HUD | Three.js 粒子星球 + 軌道環 |
| [`template-c.html`](file:///e:/Projects/Project%20Indo-Phoenix/template-c.html) | **HOLOGRAM** — 電光青×紫科幻實驗室 | Three.js 全息點雲變形 + 掃描線 |

無需建置步驟（Zero-Build），依賴均採用 CDN（Three.js, GSAP, Lenis, Google Fonts）。

---

## 🌐 語言切換與數據層

- **雙語支援**：預設為英文，點擊右上角「中文」可切換繁體中文，狀態保存於 `localStorage`（key: `ipx-lang`）。
- **數據單一真源 (SSOT)**：所有數字與雙語字典集中於 [`assets/js/data.js`](file:///e:/Projects/Project%20Indo-Phoenix/assets/js/data.js)（`IPX_DATA.stats` 與 `IPX_I18N`）。修改此處全站自動同步。

---

## 📁 專案架構

```text
Project Indo-Phoenix/
├── index.html              # 網站首頁 / 模板挑選器 (GitHub Pages 部署入口)
├── template-a/b/c.html     # 三大 3D 視覺演示頁
├── assets/
│   ├── css/                # base.css, template-a/b/c.css
│   └── js/                 # data.js (SSOT), app.js (UI引擎), scene-a/b/c.js (3D場景)
├── docs/                   # DMC 研發知識庫治理中心
│   ├── STATE.md            # 系統架構真源 (≤200行)
│   ├── ACTIVE_LOG.md       # 原子日誌 (只追加不修改)
│   └── adr/                # 架構決策記錄
├── AGENTS.md               # 多代理人工程最高守則
├── ROADMAP.md              # 階段施工路線圖
└── README.md               # 本說明文檔
```

---

## 🚢 GitHub Pages 部署

本專案已完全標準化為根目錄即插即用架構：
1. 將本倉庫直接推送至 GitHub 遠端倉庫。
2. 於 GitHub 倉庫的 **Settings ➔ Pages** 中，將 Source 設定為 `Deploy from a branch`，Branch 選擇 `main` / `(root)`。
3. 部署完成後即可直接透過 `https://<username>.github.io/<repo>/` 存取完整網站。
