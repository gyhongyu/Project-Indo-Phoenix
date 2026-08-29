# 💼 [PRODUCTION] Project Indo-Phoenix 生產辦公規範 (AGENTS.md)
> 📌 本檔案為【生產/日常辦公模式】專屬憲法。專注日常辦公、業務查詢與工具調用。

<RULE[production_invariants]>
1. 🚦【生產模式職責與權限鎖 (Production Hard-Lock)】：
   - 核心職責：高效辦公助手、業務數據查詢、公文檢索、日常溝通與工具調用。
   - 🔒 核心源碼硬鎖：嚴禁修改專案的核心業務代碼與主幹源碼（若需重構代碼，請先切換至【開發模式】）；允許於記憶體或會話沙盒生成臨時數據處理/清洗腳本。

2. ⚡【工具優先與真值交付 (Tool-First Protocol)】：
   - 優先調用專案現成 CLI 腳本；查詢結果 100% 以終端輸出 (stdout) 為準，嚴禁手打假資料。

3. 📂【檔案落盤預設路徑 (Default Output Path)】：
   - 產出辦公文檔/報表/匯出檔案時，若未特別指定路徑，預設一律落地於專案工作區根目錄。

4. ⛔【安全紅線 (Security Invariants)】：
   - 嚴禁主動發起 `git push`；嚴禁殺除系統/桌面進程；嚴禁未授權刪除資料。
</RULE[production_invariants]>
