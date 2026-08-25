# 🚀 GAS 部署指南 — 讓網站吃線上 Google Sheet 數據

> 目標：把 `Project Indo-Phoenix...xlsx` 上傳回 Google Sheets，部署萬能網關，
> 之後你在 Sheet 改數字／文案 → 三個模板（A/B/C）重新整理即全部同步。

---

## Step 1：把改好的 XLSX 上傳回 Google Sheets
1. 開 Google Drive →「新增」→「Google 試算表」→「檔案」→「匯入」→ 上傳
   `Project Indo-Phoenix_ India's Strategic Aerospace & Defense FPC Hub印度 FPC 建廠信息數據表.xlsx`
2. 匯入後應有 **4 張工作表**：
   | 表名 | 用途 | 你需要動它嗎 |
   |---|---|---|
   | `TOC & Overview` | 目錄（原有） | 不用 |
   | `FPC Factory Model` | 人類編輯的模型（Modules 1–5） | ✅ 平時只改這張 |
   | `WEB_DATA` | 網站數據（19 個 key，多數為公式自動搬） | 不用（IRR/回收期 4 格為手動輸入格，可改） |
   | `WEB_TEXT` | 網站雙語文案（34 個 key） | 想改文案時直接改這裡 |

## Step 2：貼上 GAS 萬能網關
1. 試算表選單：「擴充功能」→「Apps Script」
2. 把專案內 `C:\Users\9892\.gemini\config\skills\gas_database_bridge\scripts\Universal_GAS_Gateway.gs`
   的全部程式碼貼進編輯器（覆蓋預設內容），存檔。
3. 右上「部署」→「新增部署」→ 類型選「**網頁應用程式**」：
   - 執行身分：**我**
   - 存取權：**任何人**
4. 部署 → 授權 → 複製網址（結尾是 `/exec`）

## Step 3：把 URL 填進網站
打開 `assets/js/data.js` 第一段，把 URL 貼進去：
```js
window.IPX_CONFIG = {
  gasUrl: "https://script.google.com/macros/s/XXXX/exec"
};
```

## Step 4：驗收（黃金三步）
1. 瀏覽器開 `你的GAS_URL?action=list&sheet_name=WEB_DATA` → 應看到 JSON（status:"success"）。
2. 開 `template-a.html` → 按 F12 看 Network，應有兩支對 `/exec` 的請求且無紅字。
3. 在 Sheet 的 `FPC Factory Model` 改一個數字（如 D10 月產能）→ 重新整理網站 →
   數字變了 = 全鏈路通。✅

---

## 快取行為說明（簡報場景）
- 第一次開某台電腦/瀏瀏覽器：顯示打包預設值 → 背景抓線上值 → 無縫套用並存入 `localStorage`。
- 之後每次開：**直接用快取秒開**（0 等待），同時背景靜默比對；只有真的有變才會換畫面上的值。
- 斷網/簡報現場 Wi-Fi 死掉：照樣用快取或預設值顯示，永不白屏。
- 想強制清快取：F12 Console 執行 `localStorage.removeItem('ipx-content-cache-v1')` 後重新整理。

## WEB_DATA 手動輸入格提醒
Sheet 內建模型**沒有**計算 IRR 與回收期的公式格，因此這 4 格在 `WEB_DATA`
（D 欄標註 `MANUAL INPUT`）：`irrLow / irrHigh / payback / paybackRaw`，
日後要調整請直接改這 4 格的 B 欄數字。
