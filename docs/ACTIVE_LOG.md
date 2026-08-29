# 📝 研發結構化原子日誌 (ACTIVE_LOG.md)

> ⚠️ **【鐵律：只追加不修改 (Append-Only)】**
> 任何代碼修改、Bug 修復、架構決策完成後，一律在此以 6 行結構化格式追加記錄。

---

### [2026-08-26] [fx] 熱修：模板 A 煙尾/煙泡「載入後不動、切窗復活」——主迴圈缺少初始啟動呼叫
- **類型**: `BUGFIX`
- **代碼錨點**: `assets/js/fx.js` 檔尾（L220 新增 `requestAnimationFrame(loop)`）
- **核心事實 / 決策理由**:
  - 根因確診：fx.js 全檔 `requestAnimationFrame(loop)` 僅存在於 visibilitychange 重啟（L202）與 loop 自身續跑（L217），**無初始 kickoff**——載入後渲染迴圈從未啟動，煙尾/煙泡靜止。
  - 症狀完全吻合：切走視窗再切回 → 瀏覽器發出 visibilitychange → 迴圈此時才首次啟動 → 業主見「煙又超奇怪地出現了」。
  - B/C 正常對照組：fx-core.js（L123/L125）有正確初始 kickoff，僅較早編寫的 fx.js 漏行。
  - 教訓入冊：headless DOM 檢查測不出「迴圈未啟動」類 bug（canvas 已建、監聽已掛、零報錯）；日後 FX 層驗收須含「載入後不切窗直接測互動」步驟。
- **驗證**: `node --check fx.js` 通過；kickoff 行已確認存在（L220）。
- **狀態**: `待業主公網複驗`

### [2026-08-26] [app] 熱修：initSmoothScroll 誤遭替換致全站平滑捲動失效
- **類型**: `BUGFIX`
- **代碼錨點**: `assets/js/app.js` L164（bootstrap）
- **核心事實 / 決策理由**:
  - 根因：Phase 2/3 加入 initNav() 時誤將 `initSmoothScroll();` **替換**而非並列，Lenis 平滑捲動三模板全數靜默失效。
  - 修復：恢復為 `initSmoothScroll();` + `initNav();` 兩者並列呼叫。
  - 同案排查結論（業主回報模板 A 煙尾/煙泡消失）：headless 實測載入無任何 JS 錯誤、#fx-canvas 正常建立、圖層堆疊未變——程式碼路徑完好；判定為瀏覽器快取載到新舊混雜資產，已請業主 Ctrl+F5 於公網部署版複驗。
- **驗證**: `node --check app.js` 通過；注入 onerror 探針之 headless 載入零錯誤。
- **狀態**: `待業主公網複驗`

### [2026-08-25] [template-c / base / app] Phase 3：「全息掃描」互動特效 + 全站導航滾動加深 + 三模板游標主題化
- **類型**: `FEATURE`
- **代碼錨點**: `assets/js/scene-c.js`（新增 uMag/uMagPos/uGlitch/uDeep/uGlow 五 uniform＋頂點著色器位移＋ghost echo Pass＋`IPX_HOLO` API）；`assets/js/fx-c.js`（新增）；`assets/css/base.css`（nav `.is-scrolled` 刮層＋cursor 主題＋#fx-canvas 共用樣式）；`assets/js/app.js`（initNav scroll 監聽）；`_tools/check-shader.js`（擴充解析 scene-c VERT/FRAG 內嵌 GLSL）
- **核心事實 / 決策理由**:
  - 磁化吸聚/glitch 橫切片跳格/deep-scan 爆散全部在頂點著色器完成（CPU 零成本）；游標世界座標走 Raycaster×z=0 平面＋`group.worldToLocal()`。
  - 稀有事件 ghost echo 每 70–100s：同 geometry 偏移副本加色混疊，0.85s 正弦淡入淡出，可否認性設計。
  - 導航滾動加深為三模板共用（base.css）：捲動 >24px 掛 `is-scrolled`，深色漸層刮層＋backdrop-blur 淡入並收窄 padding，內容不再與導航糊在一起。
  - 游標主題：A=金暈、B=青方 HUD、C=青虛線圈，皆由 `body[data-template]` 鍵控；沿用 A 熱修鐵律（互動永啟、非互動元素 preventDefault、user-select:none、wheel+scroll 雙通道、null-safe 降級）。
- **驗證**: `node --check` 七檔全過；`check-shader.js` 擴充後 paren balance 0／uniform 全存在（含 A 迴歸防護）。
- **狀態**: `待業主前台驗收 + CTO 屍前驗屍`

### [2026-08-25] [template-b] Phase 2：「軌道力場」互動特效上線（重力井/離子尾/雷達脈衝/按住點火/滾輪增亮/衛星過境）
- **類型**: `FEATURE`
- **代碼錨點**: `assets/js/fx-core.js`（新增：DESKTOP 剖析/overlay/sprite/glow 通道/bindHold/autoLoop 共用核心）；`assets/js/scene-b.js`（`IPX_ORBIT` API＋彈簧位移＋增量自轉＋相機乘法鏈）；`assets/js/fx-b.js`（新增 2D 覆蓋層）；`template-b.html`（`data-template="b"`＋掛載 fx-core→fx-b）
- **核心事實 / 決策理由**:
  - 架構鐵律落實：基底粒子陣列**永不變異**——orbit 1400＋dust 500 每幀由不可變快照計算目標位置再插值，放開瞬間乾淨復原；粒子行星完全不參與形變（屍前預防 #1）。
  - 相機參數純乘法：`targetZ = 5.2 × (1−0.16·burn) × (1+0.20·glow)`，絕不覆寫，滑鼠視差保留。
  - 自轉由絕對角度改增量（rad/s），使按住點火（burnV 快升 ~0.33s／慢降 ~1.25s 包絡）可 ×3.2 加速全場旋轉＋推近相機；滾輪 glow 反向拉遠＋塵埃增亮。
  - 點擊雙回饋：3D LineLoop 雷達環（z=0 平面 raycast 定位）＋2D 同步漣漪；稀有事件衛星過境每 60–90s 橫越畫面（首發 18–33s 供快速驗收）。
- **驗證**: `node --check scene-b.js / fx-core.js / fx-b.js` 通過；HTML 腳本順序確認（THREE→scene-b→fx-core→fx-b）。
- **狀態**: `待業主前台驗收 + CTO 屍前驗屍`

### [2026-08-25] [template-a] 熱修：桌面版特效全靜音 + 按住選字 + 滾輪無感（裝置分流改造）
- **類型**: `BUGFIX`
- **代碼錨點**: `assets/js/fx.js`（DESKTOP 裝置剖析 + 互動永啟 + preventDefault + scroll fallback）；`assets/js/scene-a.js`（glow 增強）；`assets/css/template-a.css`（user-select:none）
- **核心事實 / 決策理由**:
  - 根因：trail/bubbles 被 `prefers-reduced-motion` 全閘（業主 Windows 關閉動畫效果即全靜音，僅剩未被閘的 hold boost——與業主回報症狀完全吻合）。
  - 政策反轉：互動回饋（煙尾/煙泡/boost/glow）改為**永遠啟用**，僅自主性神影排程尊重 reduced-motion；新增 `(hover:hover) and (pointer:fine)` 桌面剖析，桌面煙尾加密（2-4 粒/事件）。
  - 選字修復：滑鼠 pointerdown 非 passive 化，非互動元素上 `preventDefault` + CSS `user-select:none` 雙保險；按住時加 `fx-holding` class 隱藏游標。
  - 滾輪增感：wheel 增益 ×2（0.0022、單事件上限 0.30）+ 新增 `scroll` 事件 fallback（涵蓋捲軸拖曳/鍵盤）；shader `u_glow` 亮度係數 0.6→1.15 並加金色光洗 `vec3(.20,.16,.09)`。
- **狀態**: `待業主前台驗收 + CTO 屍前驗屍`

### [2026-08-25] [template-a] 新增「金絲煙」主題互動特效五件套（Phase 1/3）
- **類型**: `FEATURE`
- **代碼錨點**: `assets/js/fx.js`（新增）；`assets/js/scene-a.js`（u_boost/u_glow/u_fig + `IPX_SMOKE` API）；`template-a.html`（`data-template="a"` + 掛載）；`assets/css/template-a.css`（`#fx-canvas`）
- **核心事實 / 決策理由**:
  - 滑鼠/拖曳=煙尾；短點擊=煙泡；按住≥340ms=背景煙漸亮且流速×1.4；滾輪=快亮（~0.4s）慢暗（半衰 1.3s）。
  - 神影帕雷多利亞：shader 軟質量偏置振幅 0.045 貼閾值，每 55-90s 顯現 9-17s 並上飄，無任何宗教符號——可否認性為設計目標。
  - 效能與降級：粒子池 ≤240、DPR≤1.5、visibilitychange 暫停、`prefers-reduced-motion` 全降級；GLSL 靜態檢查通過（`_tools/check-shader.js`）。
- **狀態**: `待業主前台驗收 + CTO 屍前驗屍`

### [2026-08-25] [template-c] 修復 Hero 標題 PHOENIX 整行隱形（background-clip × transform 合成層衝突）
- **類型**: `BUGFIX`
- **代碼錨點**: `template-c.html` L37（`.metal` 自外層 span 移至內層 span）；CSS/GSAP 零改動
- **核心事實 / 決策理由**:
  - 業主驗收發現模板 C Hero 僅顯示「INDO—」，第二行「PHOENIX」整行隱形。
  - 根因：`.metal`（gradient + `background-clip: text` + `color: transparent`）掛在外層 span，而文字位於內層 span；內層被 `will-change: transform` + GSAP `yPercent` 動畫提升為獨立合成層，Chrome 無法跨層裁切背景 → 背景裁切失效、文字透明 → 整行不可見。
  - 修法：將 `.metal` 移至被 transform 的內層 span，使漸層背景與文字同層繪製並隨 transform 一起移動；`.metal` 為類別選擇器，CSS 與 GSAP 選擇器 `.hero-title .line > span` 均不受影響。
- **踩坑 / 失敗模式**:
  - `background-clip: text` 與後代元素 transform/will-change 併用時，Chrome 會裁切到空集合（文字隱形）；模板 A/B 因使用純色 accent 未踩雷。
- **防禦手段 / 測試背書**:
  - 結構比對確認 `.metal` 僅此一處使用；待業主前台 F5 驗收 PHOENIX 漸層字正常顯示（含進場滑入動畫）。

### [2026-08-24] [assets/js/content-engine] 全套殼 SSOT：線上 Sheet + 快取優先內容引擎
- **類型**: `FEATURE`
- **代碼錨點**: `assets/js/content-engine.js`, `template-a/b/c.html` (data-stat 綁定), `data.js` (IPX_CONFIG.gasUrl), XLSX 新增 WEB_DATA/WEB_TEXT 頁籤
- **核心事實 / 決策理由**:
  - 三模板共用線上 Google Sheet 單一真源：XLSX 以 PowerShell ZIP 手術注入 `WEB_DATA`（19 key，公式直連 FPC Factory Model）與 `WEB_TEXT`（34 key 雙語文案）兩張機器讀表。
  - 前端新增快取優先引擎：首次開啟顯示打包預設→背景抓 GAS JSON→寫 localStorage；之後每次秒開快取、背景靜默比對，僅有差異才無縫換值（簡報零感知）。
  - HTML 寫死數值全面改為 `data-stat` 綁定（支援 data-scale/data-decimals/data-stat-format），IRR 與回收期因 Sheet 未建模列為 MANUAL INPUT 格。
- **踩坑 / 失敗模式**:
  - 業主線上 Sheet 已改模（ASP 160、營收 $28.8M、EBIT 23.1%、BEP 50.8%），與舊網站快照脫節；已全站跟隨 Sheet 真值並同步 data.js 備援。
- **防禦手段 / 測試背書**:
  - 注入後以 dump 腳本讀回驗證 20+35 列；Node 煙霧測試 `_tools/test-engine.js` 9/9 PASS（合併/綁定/縮放/離線回退）；原檔備份於 `_tools/BACKUP_original.xlsx`。

### [2026-08-23] [root/website] 專案目錄重構與 GitHub Pages 根路徑歸整
- **類型**: `ARCH_DECISION`
- **代碼錨點**: `index.html`, `template-*.html`, `assets/`, `docs/STATE.md`
- **核心事實 / 決策理由**:
  - 原 `website/` 子目錄結構導致 GitHub Pages 預設 Root 部署無法直接對應 `index.html`。
  - 將網站全部核心資產提至專案根目錄，初始化 DMC 知識治理架構（`docs/`），確保零建置且隨插即用。
- **踩坑 / 失敗模式**:
  - 子目錄部署易造成相對路徑參照與 404 問題。
- **防禦手段 / 測試背書**:
  - `node --check` 通過全部 5 個 JavaScript 檔案語法檢測；驗證所有 HTML 的 `assets/` 相對路徑 100% 吻合。

### [2026-08-23] [devops/github] 建立公開 GitHub 倉庫與啟用 Pages 部署
- **類型**: `TOOLING`
- **代碼錨點**: `.git/`, `README.md`, `manage_repo_ledger.py`
- **核心事實 / 決策理由**:
  - 依使用者指示建立 Public 遠端倉庫 `gyhongyu/Project-Indo-Phoenix`，支援 GitHub Pages 免費靜態託管。
  - 啟用 Pages（來源 branch: `main`, path: `/`），並同步登記至 Google Sheet《我的Github倉庫明細》台帳。
- **踩坑 / 失敗模式**:
  - 私有倉庫無法在免費版 GitHub 啟用 Pages，必須設為 Public。
- **防禦手段 / 測試背書**:
  - GitHub REST API 201 建立成功；Pages API 201 啟用；Google Sheet 台帳登記回傳 Success。

### [2026-08-23] [skills/github_manager] 修復倉庫台帳權限寫死為 Private 之 Bug
- **類型**: `BUG_FIX`
- **代碼錨點**: `manage_repo_ledger.py` (L213, L272, L285)
- **核心事實 / 決策理由**:
  - `manage_repo_ledger.py` 中 `vis = "Private" if ... else "Private"` 存在筆誤，導致任何新倉庫在 Google Sheet 台帳中一律被硬編碼為 Private。
  - 修復判定邏輯為 `vis = "Private" if (target and target['private']) else "Public"`，並增加 `--visibility` 參數支援，成功將台帳更新為 `Public`。
- **踩坑 / 失敗模式**:
  - 寫檔 ternary operator 筆誤造成展示層與 GitHub 真實狀態（Public）脫節。
### [2026-08-29] [presentation / index / app] 交付：商業計劃 10 頁旗艦 WebPPT 演示頁 + 首頁雙語導航 + 雙向狀態互通
- **類型**: `FEATURE`
- **代碼錨點**: `presentation.html`（新增 10 頁全息動態 Deck）；`index.html`（首頁升級獨立雙語切換＋WebPPT 旗艦入口卡片）；`template-a/b/c.html`（nav-links 注入 `nav.deck` 商業計劃連結）；`assets/js/app.js`（Lang.apply 同步更新 `nav-deck-link` 帶參 `?theme=...&lang=...`）；`docs/STATE.md`（目錄 SSOT 同步更新）
- **核心事實 / 決策理由**:
  - 頂級機構 CEO 演示規格：10 頁涵蓋執行摘要、產銷模型、痛點對比、廠房分區、CapEx 補貼、OpEx 成本、BEP 儀表盤、AI 智慧工廠管線、落地時程、Data Room 入口。
  - 線上 Google Sheet 單一真源連動：全站財務數據封裝於 `getLiveStat()`，實時掛載 `IPX_DATA.stats` 與 `ipx:ready` 監聽，後端改表前端簡報自動動態重算渲染。
  - 3D 空間折疊轉場（Origami Pivot）：GSAP Timeline 控制 16° Y 軸透視折疊＋雷射掃掠光束＋次級物件錯落彈入＋數字滾動計數器（Count-up）。
  - 雙向狀態無損保持：A/B/C 模板導航欄與首頁進入 WebPPT 時自動帶上主題與語系，WebPPT 頂部「✕ 返回落地頁」精準回溯來源模板。
### [2026-08-29] [presentation] 熱修：renderSlide 樣板字面常數閉合殘缺致全站簡報白屏
- **類型**: `BUGFIX`
- **代碼錨點**: `presentation.html` L1455-1468（hero-showcase 區塊補回 subStats.map 閉合括號 `).join("")`）
- **核心事實 / 決策理由**:
  - 根因：先前將全站表格圖表化時，不慎將 floating-bar 區塊錯誤插在 `subStats.map(` 內部，致使 `missing ) after argument list` 語法錯誤阻斷腳本解析，導致 `#slideContent` 初始空白。
  - 修復：精確修復 template literal 閉合標籤，並透過 `node --check` 驗證全腳本 0 語法錯誤。
  - DMC 經驗固化：凡修改大型單檔 HTML 內嵌 `<script>` 後，**必須一律強制執行 `node --check` 語法閘門防禦**，杜絕白屏迴歸。
- **驗證**: `node --check` 通過；所有 10 頁版型渲染函數均已通過語法靜態檢測。
- **狀態**: `✅ 修復完畢，待業主前台驗收`

