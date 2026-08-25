## 三、關鍵財務數據（線上 Google Sheet 為唯一真源 SSOT）

> **2026-08-24 起架構升級**：數據與文案真源改為**線上 Google Sheet**
> （XLSX 已注入 `WEB_DATA` / `WEB_TEXT` 兩張機器讀表，經 GAS Web App 輸出 JSON）。
> 前端 `assets/js/content-engine.js` 快取優先載入；`data.js` 降級為離線備援快照。
> 部署步驟見根目錄《GAS部署指南.md》。下表為目前 Sheet 現值（業主已改模）：

| 指標 | 數值 | WEB_DATA key |
|------|------|--------------|
| 月產能 | 15,000 m²/月 | capacityMonthlyM2 |
| 平均單價 | $160 / m²（舊值 140） | weightedPrice |
| 年營收 | $28.8M（$2.4M/月） | annualRevenue |
| CapEx | $23M（SPECS 出資 25% 後淨投入 $17.25M） | totalCapex / netCapex |
| OpEx | $1.845M / 月 | monthlyOpex |
| EBIT 利潤率 | 23.1%（$555K/月） | ebitMargin |
| 損益兩平 BEP | 50.8% 產能利用率 ／ $1.22M 月營收 | bep / bepRevenue |
| IRR | 21.3% – 24.8%（⚠️ 手動輸入格） | irrLow / irrHigh |
| 回收期 | 4.2 年（無補貼 5.2 年，⚠️ 手動輸入格） | payback / paybackRaw |

原始模型：`Project Indo-Phoenix_ India's Strategic Aerospace & Defense FPC Hub.xlsx`
→ sheet **FPC Factory Model**, Modules 1–5。