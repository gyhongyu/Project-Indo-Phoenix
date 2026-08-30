# 🏛️ Project Indo-Phoenix 投行級路演系統：全域設計規範與三大主題自適應指南 (DESIGNER_GUIDELINES.md)

> **本文件為進場 UI/UX 設計師與前端工程代理人的「最高設計憲章與多主題自適應指南」。**  
> `presentation.html` 是全案三大模板（Template A / B / C）共用的**通用簡報母體（Universal WebPPT Deck）**。所有頁面設計、視覺重構與版面微調，必須 100% 透過 CSS 變數體系動態繼承主題，嚴禁寫死任何單一色彩或固定樣式！

---

## 🎯 一、 目標受眾畫像（Target Audience Persona & Psychology）

這份路演網站的核心受眾極為特殊與高階：

1. **印度頂層財閥與高種姓掌門人（Tier-1 Industrial Families / Promoters）**：
   - **特質**：注重家族傳承與社會聲望、對資本回報（IRR / Payback）與「控股權（>90%）」有絕對掌控慾。
   - **心理痛點**：討厭複雜瑣碎的工程廢話，只看「國家級戰略高度」、「政府補貼（SPECS 25%）」與「防禦護城河」。
2. **強烈國族自豪感與國防愛國情操（Make in India & Strategic Sovereignty）**：
   - **特質**：強烈響應莫迪政府「在地化製造（Atmanirbhar Bharat）」與國防採購相抵（DAP 2020 Offset 30%~50%）。
   - **心理痛點**：極度排斥依賴中國供應鏈，渴望建立「全印首座、真正 0% 依賴海外」的戰略級自主濕製程工廠。
3. **頂級機構投資人、主權基金與投行高管（Institutional Investors & Sovereign Funds）**：
   - **特質**：對數據真實性極度敏銳，只認「單一真值來源（SSOT）」與閉環財務邏輯（$28.8M 營收、$23M CapEx、50.8% BEP）。

---

## 🎭 二、 三大模板主題美學矩陣（3-Theme Dynamic Matrix）

`presentation.html` 的 `<body>` 會根據 URL 參數動態掛載 `data-template="a|b|c"`。**設計師必須使用語意化 CSS 變數，確保一鍵切換時 100% 完美變身：**

| 維度 / 變數 | 🏛️ 主題 A：黑曜奢華金 (Template A) | 🌐 主題 B：國防軍工青 (Template B) | ⚡ 主題 C：次世代賽博紫 (Template C) |
| :--- | :--- | :--- | :--- |
| **目標場景** | 私募路演、財閥掌門人閉門會議 | 軍工國防標案、政府官員與產線審查 | 國際創投、科技論壇、次世代創新展示 |
| **設計風格** | **Institutional Luxury (投行黑金奢華)** | **Tactical Defense HUD (軍工科技戰情)** | **Cyber Hologram (全息賽博未來)** |
| **主背景 (`--bg`)** | `#09090b` (深邃黑曜) | `#040813` (午夜戰術深藍) | `#06070c` (深邃賽博紫黑) |
| **核心色 (`--accent`)** | `#c9a96e` (香檳皇家金) | `#4fd1c5` (戰術國防青 / Teal) | `#35e0ff` (全息粒子電光藍) |
| **光暈 (`--accent-glow`)**| `rgba(201, 169, 110, 0.35)` | `rgba(79, 209, 197, 0.38)` | `rgba(53, 224, 255, 0.40)` |
| **邊框線 (`--line`)** | 奢華金絲微透光線 | 戰術雷達高對比青線 | 脈衝紫藍高動態霓虹線 |
| **大標字體 (`--font-display`)**| `"Cormorant Garamond"` (古典襯線) | `"Space Grotesk"` (嚴謹無襯線) | `"Chakra Petch"` (硬派未來科技) |
| **內文字體 (`--font-body`)**| `"Jost"` (俐落幾何) | `"Space Grotesk"` (現代工程) | `"Chakra Petch"` (賽博機械) |
| **圓角體系 (`--card-radius`)**| `8px` (典雅柔和) | `3px` (戰術硬朗銳角) | `4px` (幾何切角微圓) |

> ⚠️ **設計師鐵律**：任何卡片、按鈕、文字或邊框樣式，**絕對禁止寫死 HEX 顏色（如 `#c9a96e`）**！必須統一調用 `var(--accent)`、`var(--bg-card)`、`var(--line)`、`var(--font-display)`！

---

## ⛔ 三、 絕對硬性禁止事項（Absolute Design Prohibitions）

1. ❌ **嚴禁使用任何顏文字 / Emoji（如 🚀, 💎, 🚗, 🛡️, 🔍, 📊）**：
   - **規範**：圖標一律使用**動態繼承主題色向量 SVG**（使用 `stroke="var(--accent)"`），呈現瑞士鐘錶級精密工藝。
2. ❌ **嚴禁在頁面底部放置任何「常駐說明欄 / 浮動解釋條（Floating Bottom Bar）」**：
   - **規範**：頁面主空間 100% 留給內容卡片。深度戰略依據一律採用**「桌面端滑鼠懸浮 Tooltip 氣泡（Smart Hover Balloon）」**，平時隱形，不佔用任何物理像素。
3. ❌ **嚴禁寫死特定主題色彩或固定字體**：
   - **規範**：所有顏色與字體一律走 `var(--accent)` 與 `var(--font-display)` CSS Token。
4. ❌ **嚴禁出現侵權商標（例如嚴禁使用 FOXLINK 等外商 Logo）**：
   - **規範**：圖片一律使用去識別化的高清樣品圖或 CAD 分解圖。
5. ❌ **嚴禁大體積 PNG 或未壓縮素材**：
   - **規範**：採用輕量 JPG（縮圖 ~140KB，大圖 ~250KB），確保首頁載入秒開。

---

## 📐 四、 版面佈局與響應式防禦原則（Layout & Elastic Space Defense）

1. **一屏一頁、呼吸感充足（Single-Viewport Slide Architecture）**：
   - 簡報模式必須確保在主流筆電（1366×768、1920×1080、MacBook 16:10）上**「免滾動、一眼收盡全貌」**。
   - 容器與內邊距必須全面使用 `clamp()`（如 `padding: clamp(12px, 1.8vh, 20px)`）。
2. **縮圖與燈箱放大機制（Thumbnail + Full-Res Lightbox）**：
   - 卡片內的樣品縮圖容器高度限制在 `clamp(70px, 10vh, 120px)`。
   - 點擊縮圖時觸發全螢幕高清大圖燈箱（Lightbox Zoom Modal），按 `ESC` 鍵關閉。
3. **客戶名單採用結構化分群膠囊（Two-Tier Buyer Pills）**：
   - 買家名冊必須清晰劃分：
     - **第一層**：`● 自研 Tier-1 / 電池 Pack 原廠`（`var(--accent)` 主題膠囊）
     - **第二層**：`● EMS 巨頭 / 模組代工廠`（次級色青藍膠囊）
4. **手機端 / 觸控端自動降級（Mobile Graceful Degradation）**：
   - 透過 `@media (hover: none)` **自動隱藏所有懸浮 Tooltip 氣泡**，防止觸控螢幕誤觸。

---

## 💡 五、 設計師速查 Check List（交付驗收表）

- [ ] 1. 切換 `?theme=a`、`?theme=b`、`?theme=c` 時，本頁字體、色彩、光暈是否隨之完美變身？
- [ ] 2. 本頁是否 100% 無任何 Emoji，全數替換為 `stroke="var(--accent)"` 的精緻 SVG？
- [ ] 3. 頁面底部是否乾淨無常駐說明欄，垂直高度完全釋放？
- [ ] 4. 在筆電矮螢幕（Height: 768px）下，所有卡片文字是否絕不重疊、絕不被底部導航遮擋？
- [ ] 5. 電腦端滑鼠 Hover 卡片時，是否能平滑彈出微透磨砂 Tooltip 氣泡？
- [ ] 6. 核心數字（$28.8M、$23M、50.8%）是否大氣震撼，完美繼承當前主題的發光質感？
