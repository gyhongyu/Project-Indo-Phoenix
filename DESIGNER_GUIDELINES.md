# 🏛️ Project Indo-Phoenix 投行級路演系統：設計師全域設計規範與受眾畫像指南 (DESIGNER_GUIDELINES.md)

> **本文件為進場 UI/UX 設計師與前端工程代理人的「最高設計憲章與避坑指南」。**  
> 所有頁面設計、視覺重構與版面微調，必須 100% 嚴格遵循本指南之受眾心理學、視覺調性與物理排版禁忌。

---

## 🎯 一、 目標受眾畫像（Target Audience Persona & Psychology）

這份路演網站**不是**給一般大眾、非科技宅或普通散戶看的，它的核心受眾極為特殊與高階：

1. **印度頂層財閥與高種姓掌門人（Tier-1 Industrial Families / Promoters）**：
   - **特質**：極度自信、注重家族傳承與社會聲望、對資本回報（IRR / Payback）與「控股權（>90%）」有絕對掌控慾。
   - **心理痛點**：討厭複雜瑣碎的工程廢話，只看「國家級戰略高度」、「政府補貼（SPECS 25%）」與「防禦護城河」。
2. **強烈國族自豪感與國防愛國情操（Make in India & Strategic Sovereignty）**：
   - **特質**：強烈響應莫迪政府「在地化製造（Atmanirbhar Bharat）」與國防採購相抵（DAP 2020 Offset 30%~50%）。
   - **心理痛點**：極度排斥依賴中國供應鏈，渴望建立「全印首座、真正 0% 依賴海外」的戰略級自主濕製程工廠。
3. **頂級機構投資人、主權基金與投行高管（Institutional Investors & Sovereign Funds）**：
   - **特質**：對數據真實性極度敏銳，厭惡假大空的行銷吹噓，只認「單一真值來源（SSOT）」與閉環財務邏輯（$28.8M 營收、$23M CapEx、50.8% BEP）。

---

## 🎨 二、 視覺美學與品牌調性（Visual Aesthetics & Branding）

* **設計風格**：**Institutional Luxury & Sovereign Industrial Tech（機構級尊爵重工奢華科技風）**。
* **調性對標**：Bloomberg Terminal ✕ Palantir Foundry ✕ Lockheed Martin ✕ Tesla Keynote。
* **調色盤標準（Color Palette）**：
  - **主背景（Background）**：深邃奢華黑曜金底色（`#08090d` ~ `#0a0f19`），搭配極細緻的微粒子雜訊膠卷質感（Grain Texture）。
  - **核心主色（Accent Gold）**：香檳皇家金（`#c9a96e` / `#dfbd7e`），象徵財富、尊爵與國家級莊嚴。
  - **次級色（Technical Cyan/Blue）**：航太鈦藍/科技青（`#38bdf8` / `#4fd1c5`），用於標註技術規格、產能與高可靠度指標。
  - **高警示/正向色**：軍規薄荷綠（`#34d399`）、戰略紅（`#ef4444`）。

---

## ⛔ 三、 絕對硬性禁止事項（Absolute Design Prohibitions & Anti-Patterns）

設計師進場時，**凡違反以下禁忌者一律視為不合格產出**：

1. ❌ **嚴禁使用任何顏文字 / Emoji（如 🚀, 💎, 🚗, 🛡️, 🔍, 📊）**：
   - **原因**：Emoji 在投行、財團掌門人眼中顯得極度幼稚、廉價且不專業。
   - **規範**：所有圖標必須一律採用**金色細線條向量 SVG（Stroke 1.5px~2px）**，呈現瑞士鐘錶級的精密工藝感。
2. ❌ **嚴禁在頁面底部放置任何「常駐說明欄 / 浮動解釋條（Floating Bottom Bar）」**：
   - **原因**：底部橫條嚴重侵占 60px~80px 的垂直黃金空間，在低解析度或矮螢幕下會引發災難性重疊破版；且讓閱讀視線上下割裂。
   - **規範**：頁面主空間 100% 留給內容卡片。詳細技術與戰略依據，一律採用**「桌面端滑鼠懸浮 Tooltip 氣泡（Smart Hover Balloon）」**，平時隱形，不佔用任何像素。
3. ❌ **嚴禁出現侵權或非授權 Logo（例如嚴禁使用 FOXLINK 等特定外商商標）**：
   - **規範**：圖片一律使用乾淨去識別化的高清工程樣品圖、CAD 分解圖或自製 SVG 示意圖。
4. ❌ **嚴禁使用大體積 PNG 或未壓縮圖片**：
   - **規範**：圖片一律採用適度壓縮的 JPG（縮圖 ~140KB，大圖 ~250KB），確保首頁載入秒開，防止高管瀏覽時卡頓。
5. ❌ **嚴禁空洞的「占位符（Placeholder）」或虛構荒謬數據**：
   - **規範**：所有展示數據必須嚴格對齊專案數據庫（`assets/js/data.js` 與 `docs/STATE.md`）。

---

## 📐 四、 版面佈局與響應式防禦原則（Layout & Elastic Space Defense）

1. **一屏一頁、呼吸感充足（Single-Viewport Slide Architecture）**：
   - 簡報模式必須確保在主流筆電（1366×768、1920×1080、MacBook 16:10）上**「免滾動、一眼收盡全貌」**。
   - 容器與內邊距必須全面使用 `clamp()`（如 `padding: clamp(12px, 1.8vh, 20px)`）。
2. **縮圖與燈箱放大機制（Thumbnail + Full-Res Lightbox）**：
   - 卡片內的樣品縮圖容器高度嚴格限制在 `clamp(70px, 10vh, 120px)`，保持彈性收縮。
   - 點擊縮圖時觸發全螢幕高清大圖燈箱（Lightbox Zoom Modal），支援按 `ESC` 或點擊空白處平滑關閉。
3. **客戶名單採用結構化分群膠囊（Two-Tier Buyer Pills）**：
   - 買家名冊必須劃分為：
     - **第一層**：`● 自研 Tier-1 / 電池 Pack 原廠`（金框膠囊）
     - **第二層**：`● EMS 巨頭 / 模組代工廠`（青藍框膠囊）
   - 膠囊字體緊湊（`10px~11px`），文字間距微調，確保內容飽滿且絕不溢出邊界。
4. **手機端 / 觸控端自動降級（Mobile Graceful Degradation）**：
   - 手機與觸控螢幕沒有滑鼠游標，透過 `@media (hover: none)` **自動隱藏所有懸浮 Tooltip 氣泡**，防止誤觸干擾。

---

## 💡 五、 設計師速查 Check List（交付驗收表）

- [ ] 1. 本頁是否 100% 無任何 Emoji，全數替換為金色精緻 SVG？
- [ ] 2. 頁面底部是否乾淨無常駐說明欄，垂直高度完全釋放？
- [ ] 3. 在筆電矮螢幕（Height: 768px）下，所有卡片文字是否絕不重疊、絕不被底部導航遮擋？
- [ ] 4. 電腦端滑鼠 Hover 卡片時，是否能平滑彈出微透磨砂 Tooltip 氣泡？
- [ ] 5. 縮圖點擊是否能正常放大為高清大圖（Lightbox）？
- [ ] 6. 核心數字（$28.8M、$23M、50.8%、15,000 m²）是否清晰大氣，呈現金色發光尊爵質感？
