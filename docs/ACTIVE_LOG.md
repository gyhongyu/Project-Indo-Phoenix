# 📝 研發結構化原子日誌 (ACTIVE_LOG.md)

> ⚠️ **【鐵律：只追加不修改 (Append-Only)】**
> 任何代碼修改、Bug 修復、架構決策完成後，一律在此以 6 行結構化格式追加記錄。

---

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
