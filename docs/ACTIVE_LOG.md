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
- **防禦手段 / 測試背書**:
  - 執行 `--update "Project-Indo-Phoenix" --visibility "Public"` 並以 `--list` 驗證回傳 `[Public]` 成功。

