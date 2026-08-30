/* ============================================================
   PROJECT INDO-PHOENIX — Data Layer
   ROLE: bundled FALLBACK defaults only.
   Live SSOT = online Google Sheet (WEB_DATA / WEB_TEXT tabs)
   served via GAS Web App -> assets/js/content-engine.js
   Set the deployed GAS URL below once, everything syncs.
   ============================================================ */

window.IPX_CONFIG = {
  gasUrl: "https://script.google.com/macros/s/AKfycbzPRGJ3gOlbro2YigiF5t1qoG3PEwUGXU9d-tWkrIGpiK7yfiCMNV3DxzKLvEC84mG9eQ/exec"   // <== TODO: paste your GAS Web App /exec URL here
};

window.IPX_DATA = {
  stats: {
    capacityMonthlyM2: 15000,   // 'FPC Factory Model'!D10
    annualVolumeM2: 180000,     // E10
    weightedPrice: 160,         // F10
    monthlyRevenue: 2400000,    // G10
    annualRevenue: 28800000,    // H10
    totalCapex: 23000000,       // D27 — India project (Module 3)
    specsSubsidy: 5750000,      // F27 — SPECS 25% cash-back
    netCapex: 17250000,         // G27
    monthlyOpex: 1845000,       // D35 (Module 4)
    ebitMonthly: 555000,        // C41 (Module 5)
    ebitMargin: 23.1,           // %  (E41)
    bep: 50.8,                  // % utilization (E42)
    bepRevenue: 1218543,        // USD / month (C43)
    irrLow: 21.3,               // manual input on WEB_DATA tab
    irrHigh: 24.8,              // manual input on WEB_DATA tab
    payback: 4.2,               // years with SPECS subsidy (manual input)
    paybackRaw: 5.2,            // years without subsidy (manual input)
    factoryArea: 13000,         // m² total layout (D20)
    cleanroomClass: "10K",      // Class 10,000 yellow-light exposure zone
    // 24-Month Stage Sales Model (Dynamic SSOT for Slide 12 - 100% matched to Google Sheet WEB_DATA)
    tradeSales_T0: 0,           // T+0 Trade Bridge initial monthly run-rate ($0)
    tradeSales_T6: 250000,      // T+6M Vendor codes & NPI sampling monthly revenue ($0.25M)
    tradeSales_T12: 750000,     // T+12M Initial switch revenue ($0.75M)
    tradeSales_T18: 1218543,    // T+18M 50.8% BEP crossover point ($1.22M)
    tradeSales_T24: 2040000     // T+24M Scale revenue ($2.04M)
  }
};

/* ------------------------- i18n dictionary ------------------------ */
/* English is the DEFAULT language. Toggle to 繁體中文 via UI button. */

window.IPX_I18N = {
  en: {
    nav: { mission: "Mission", metrics: "The Numbers", deck: "Pitch Deck", contact: "Contact" },
    hero: {
      kicker: "India's Strategic Aerospace &amp; Defense FPC Hub",
      titleA: "Project",
      titleB: "Indo-Phoenix",
      sub: "India's first end-to-end manufacturing facility for high-end, aerospace and defense-grade flexible printed circuits.",
      scroll: "Scroll"
    },
    mission: {
      label: "Strategic Mission",
      title: "Built where capacity is zero.",
      m1t: "First Mover",
      m1d: "India's first end-to-end plant for aerospace &amp; defense-grade FPC manufacturing.",
      m2t: "0% Local Competition",
      m2d: "No low-end SMT assembly. Pure focus on high-margin wet-process bare-board manufacturing — where local capacity today is 0%.",
      m3t: "Brownfield Advantage",
      m3d: "Modular brownfield investment leverages investors' existing factory space and utilities, minimizing capital expenditure."
    },
    metrics: {
      label: "Dynamic Feasibility Model",
      title: "The numbers speak first."
    },
    tiles: {
      ebit:    { label: "EBIT Margin",     desc: "At full 15,000 m²/month utilization." },
      bep:     { label: "Break-Even Point", desc: "Standard for a highly-capitalized wet-process plant." },
      irr:     { label: "Internal Rate of Return", desc: "Far beyond electronics-manufacturing benchmarks." },
      payback: { label: "Static Payback",  desc: "With SPECS 25% subsidy — 5.2 yrs without." },
      capex:   { label: "Total CapEx",     desc: "$17.25M net after SPECS 25% cash-back." },
      rev:     { label: "Annual Revenue",  desc: "$140/m² weighted average at full capacity." }
    },
    cta: {
      body: "Position your capital at the origin of India's defense-electronics supply chain.",
      btn: "Request Investor Access"
    },
    foot: {
      note: "Figures derived from the Project Indo-Phoenix dynamic feasibility factsheet.",
      rights: "© 2026 Project Indo-Phoenix. Confidential investor material."
    }
  },

  zh: {
    nav: { mission: "戰略使命", metrics: "核心數據", deck: "商業計劃", contact: "聯絡" },
    hero: {
      kicker: "印度戰略性航太與國防 FPC 樞紐",
      titleA: "Project",
      titleB: "Indo-Phoenix",
      sub: "印度首座高階、航太與國防等級軟性印刷電路板（FPC）端到端製造工廠。",
      scroll: "下滑探索"
    },
    mission: {
      label: "戰略使命",
      title: "建在產能為零的地方。",
      m1t: "先發優勢",
      m1d: "印度首座針對航太與國防等級 FPC 的端到端製造工廠。",
      m2t: "在地競爭 0%",
      m2d: "不碰低階 SMT 組裝——專注高毛利的濕製程裸板製造，目前該領域印度在地產能為 0%。",
      m3t: "棕地投資優勢",
      m3d: "模組化棕地投資模式，善用投資者現有廠房空間與公用設施，將資本支出降至最低。"
    },
    metrics: {
      label: "動態可行性模型",
      title: "讓數字先說話。"
    },
    tiles: {
      ebit:    { label: "息稅前利潤率", desc: "滿載月產能 15,000 平方公尺之下。" },
      bep:     { label: "損益兩平點",   desc: "高度資本化濕製程工廠的標準水準。" },
      irr:     { label: "內部報酬率",   desc: "遠超標準電子製造業基準。" },
      payback: { label: "靜態回收期",   desc: "含 SPECS 25% 補貼——未含補貼為 5.2 年。" },
      capex:   { label: "建廠總資本支出", desc: "扣除 SPECS 25% 現金返還後淨投入 1,725 萬美元。" },
      rev:     { label: "年度營收",     desc: "滿載加權平均單價 140 美元／平方公尺。" }
    },
    cta: {
      body: "將您的資本，佈局在印度國防電子供應鏈的起點。",
      btn: "申請投資人專區"
    },
    foot: {
      note: "數據源自「印度鳳凰計畫」動態可行性數據表。",
      rights: "© 2026 印度鳳凰計畫。投資人機密資料。"
    }
  }
};
