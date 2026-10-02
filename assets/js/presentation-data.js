// SSOT Data Accessor
function getLiveStat(key, fallback) {
  if (window.IPX_DATA && window.IPX_DATA.stats && window.IPX_DATA.stats[key] !== undefined) {
    return window.IPX_DATA.stats[key];
  }
  return fallback;
}

// Auto-modularized Presentation Deck Data & Dynamic SSOT
function getI18NDeck() {
      const revAnnual = (getLiveStat("annualRevenue", 28800000) / 1000000).toFixed(1);
      const capMonthly = Number(getLiveStat("capacityMonthlyM2", 15000)).toLocaleString();
      const capAnnual = Number(getLiveStat("annualVolumeM2", 180000)).toLocaleString();
      const weightedPrice = getLiveStat("weightedPrice", 160);
      const netCapEx = (getLiveStat("netCapex", 17250000) / 1000000).toFixed(2);
      const totCapEx = (getLiveStat("totalCapex", 23000000) / 1000000).toFixed(1);
      const specsSub = (getLiveStat("specsSubsidy", 5750000) / 1000000).toFixed(2);
      const ebitMarg = Number(getLiveStat("ebitMargin", 23.1)).toFixed(1);
      const ebitMo = (getLiveStat("ebitMonthly", 555000) / 1000).toFixed(0);
      const opexMo = (getLiveStat("monthlyOpex", 1845000) / 1000000).toFixed(3);
      const bepUtil = Number(getLiveStat("bep", 50.8)).toFixed(1);
      const bepRev = (getLiveStat("bepRevenue", 1218543) / 1000000).toFixed(2);
      const irrRange = `${getLiveStat("irrLow", 21.3)}% – ${getLiveStat("irrHigh", 24.8)}%`;
      const paybackYrs = getLiveStat("payback", 4.2);
      const paybackNoSub = getLiveStat("paybackRaw", 5.2);
      const totalArea = Number(getLiveStat("factoryArea", 13000)).toLocaleString();
      const cleanroomCls = String(getLiveStat("cleanroomClass", "1K"));

      return {
        en: {
          exitLanding: "Landing Page",
          navAgenda: "AGENDA",
          btnPrev: "◄ PREV",
          btnNext: "NEXT ►",
          slides: [
            // Slide 00: Executive Agenda & Four-Act Navigator
            {
              type: "agenda-master-visual",
              tag: "EXECUTIVE AGENDA / FOUR-ACT ROADSHOW MAP",
              title: "Project Indo-Phoenix: Strategic Roadshow Navigator",
              desc: "A comprehensive institutional briefing on building India's 1st high-reliability Aerospace & Defense FPC manufacturing hub. Click any Act to jump directly.",
              acts: [
                {
                  actNum: "ACT I",
                  targetSlide: 1,
                  badge: "STRATEGY & DEMAND",
                  pages: "Slide 01 – 03",
                  title: "Strategic Gap & Real Demand",
                  desc: "Debunking the 30% self-reliance myth; capturing 0% bare-board vacuum, 48h turnaround, and verified Tier-1 buyer pipeline.",
                  subitems: [
                    "01. Executive Vision & 0% Bare-Board Gap",
                    "02. Pain Point Breakdown: 48h vs 3-Wk Lag",
                    "03. 3 Core Verticals & Verified Buyer Pool"
                  ]
                },
                {
                  actNum: "ACT II",
                  targetSlide: 4,
                  badge: "MOATS & INFRASTRUCTURE",
                  pages: "Slide 04 – 06",
                  title: "Moats, AI SFC & SPCB Clearances",
                  desc: "5% Sweat Equity governance with >90% promoter control; closed-loop Edge AI ACC, and 13,000m² ZLD environmental moat.",
                  subitems: [
                    "04. 5% Sweat Equity & >90% Control Governance",
                    "05. AI / ACC Closed-Loop Smart Factory",
                    "06. 13,000 m² Facility & 3x ZLD Clearance"
                  ]
                },
                {
                  actNum: "ACT III",
                  targetSlide: 7,
                  badge: "FINANCIAL PROOFS",
                  pages: "Slide 07 – 11",
                  title: "5 Sacred Financial Modules",
                  desc: "Rock-solid single source of truth financials: $28.8M revenue, $23M CapEx, SPECS 25% refund, $1.845M OpEx, and 50.8% BEP.",
                  subitems: [
                    "07. Module 1: Product Capacity Mix ($28.8M)",
                    "08. Module 2: Factory Space Engineering Standards",
                    "09. Module 3: CapEx $23M & SPECS 25% Cash Refund",
                    "10. Module 4: Dynamic OpEx ($1.845M/mo) Structure",
                    "11. Module 5: Profitability Cockpit & 50.8% BEP"
                  ]
                },
                {
                  actNum: "ACT IV",
                  targetSlide: 12,
                  badge: "ROADMAP & PARTNERSHIP",
                  pages: "Slide 12 – 13",
                  title: "5-Year Horizon & Data Room",
                  desc: "Dual-track trade-to-manufacture bridge, achieving 100% full investment payback at Year 4.2; invitation to exclusive Data Room.",
                  subitems: [
                    "12. 5-Year Phased Horizon & 4.2-Yr Payback",
                    "13. Strategic Terms & Data Room Access"
                  ]
                }
              ]
            },
            // Slide 01: Executive Vision & Anchor
            {
              type: "hero-showcase",
              tag: "SLIDE 01 / EXECUTIVE STRATEGY",
              title: "India's 1st Strategic Aerospace & Defense FPC Hub",
              desc: "Debunking the '30% Self-Reliance' statistical myth. High-end bare FPC wet-chemistry manufacturing is practically 0% in India. Capturing the China+1 strategic window.",
              mainStat: { 
                label: "Full Capacity Annual Revenue", 
                val: `$${revAnnual}M`, 
                desc: `Targeted on ${capMonthly} m²/mo volume at $${weightedPrice}/m² weighted ASP (35%–40% gross margin).`,
                kpiSteps: [
                  { val: "15,000 m²", lbl: "Monthly Volume" },
                  { val: "38.5%", lbl: "Gross Margin" },
                  { val: "$28.8M", lbl: "Annual Run-Rate" }
                ]
              },
              subStats: [
                { 
                  label: "Net Investor CapEx", 
                  val: `$${netCapEx}M`, 
                  tag: "SPECS 25% Refund", 
                  tagType: "tag-positive",
                  desc: `Gross $${totCapEx}M minus 25% SPECS Government Cash Rebate ($${specsSub}M).` 
                },
                { 
                  label: "EBIT Operating Margin", 
                  val: `${ebitMarg}%`, 
                  tag: "$6.66M Annual EBIT", 
                  tagType: "tag-accent",
                  desc: `Delivering $${(ebitMo*12/1000).toFixed(2)}M annual operating cash flow at scale.` 
                },
                { 
                  label: "Static Payback", 
                  val: `${paybackYrs} Yrs`, 
                  tag: `Raw: ${paybackNoSub} Yrs`, 
                  tagType: "tag-positive",
                  desc: `Rapid payback supported by SPECS subsidy (${paybackNoSub} yrs raw).` 
                },
                { 
                  label: "Internal Rate of Return", 
                  val: irrRange, 
                  tag: "Benchmark: 12-15%", 
                  tagType: "tag-accent",
                  desc: "Substantially exceeds standard electronics manufacturing benchmarks." 
                }
              ]
            },
            // Slide 02: Market Gap & Dual Sourcing Matrix
            {
              type: "vs-matrix",
              tag: "SLIDE 02 / MARKET PAIN POINT & AGILITY",
              title: "0% Domestic Competition & 48-Hour Sampling Edge",
              desc: "Eliminating cross-border 3-week logistics lag. Supplying tier-1 automotive, energy storage, and defense corridors with 48h turnaround.",
              badHeader: "Traditional Cross-Border Import 🔴",
              badList: [
                { badge: "3~5 Weeks", bar: "bad", text: "Long overseas engineering cycles stall new product introduction (NPI)." },
                { badge: "24%~46%", bar: "bad", text: "Customs duty inversion & freight costs + 45-60 days safety inventory lockup." },
                { badge: "Geopolitical", bar: "bad", text: "Severe supply chain risk; DVA capped at 15-20%, limiting PLI subsidy." }
              ],
              goodHeader: "Indo-Phoenix Local Hub 🟢",
              goodList: [
                { badge: "48~72 Hrs", bar: "good", text: "Rapid prototyping directly inside Indian industrial corridor; 3-5 day mass JIT." },
                { badge: "0% Tariff", bar: "good", text: "100% local basic chemicals sourcing + MOOWR / ASEAN FTA duty exemption." },
                { badge: "35%+ DVA", bar: "good", text: "Boosts customer Domestic Value Add to unlock maximum PLI government incentives." }
              ]
            },
            // Slide 03: 3 Core Target Market Verticals & Pipeline
            {
              type: "feature-cards-visual",
              tag: "SLIDE 03 / TARGET VERTICALS & REAL BUYERS",
              title: "Targeting Confirmed Pipeline Across 3 High-Growth Verticals",
              desc: "Targeting India's $1.06B–$1.30B FPC market with >350M units/year verified procurement pool across OEM Tier-1s, EMS Giants, and Defense.",
              defaultExplanation: "Downstream giants urgently require qualified local FPC suppliers to fulfill government DVA and PLI requirements.",
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 11v2"/><path d="M10 11v2"/><path d="M14 11v2"/></svg>`,
                  tag: "ENERGY STORAGE CCS",
                  title: "EV & Battery Pack CCS",
                  desc: "Replaces heavy copper wiring with 500-1500mm heavy copper (2-12oz) flexible circuits.",
                  blueprintImg: "assets/samples/CCS-縮圖.jpg",
                  fullImg: "assets/samples/CCS-大圖.jpg",
                  blueprintLabel: "HD SAMPLE: EV-BATTERY-CCS-PACK",
                  buyerCategories: [
                    {
                      label: "Tier-1 & Battery Pack OEMs",
                      pills: [
                        { name: "Tata AutoComp ($25M-$35M)", tier: "tier1" },
                        { name: "VVDN eMobility ($12M-$18M)", tier: "tier1" },
                        { name: "Exide Energy ($15M-$22M)", tier: "tier1" },
                        { name: "Amara Raja ($12M-$16M)", tier: "tier1" },
                        { name: "Kaynes EV ($8M-$12M)", tier: "tier1" },
                        { name: "Lucas TVS", tier: "tier1" },
                        { name: "Spark Minda", tier: "tier1" },
                        { name: "Ola Electric", tier: "tier1" }
                      ]
                    },
                    {
                      label: "EMS Giants & Assemblers",
                      pills: [
                        { name: "Foxconn EV ($30M-$45M)", tier: "ems" },
                        { name: "Tata Electronics ($20M-$30M)", tier: "ems" },
                        { name: "Dixon Energy ($18M-$25M)", tier: "ems" },
                        { name: "Syrma SGS ($10M-$15M)", tier: "ems" },
                        { name: "Jabil India", tier: "ems" }
                      ]
                    }
                  ],
                  metrics: [
                    { val: "$25M~$35M", lbl: "TACO Annual Import" },
                    { val: "90%+", lbl: "Current Import Ratio" }
                  ],
                  detail: "TACO ($25M-$35M), Foxconn ($30M-$45M), and Dixon ($18M-$25M) urgently need localized 500-1500mm heavy copper flex circuits."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
                  tag: "AUTOMOTIVE TIER-1",
                  title: "Automotive Sensor & ADAS",
                  desc: "Over 100 FPC parts per modern EV. Local testing & zero-defect IATF 16949 bare boards.",
                  blueprintImg: "assets/samples/Automotive-縮圖.jpg",
                  fullImg: "assets/samples/Automotive-大圖.jpg",
                  blueprintLabel: "HD SAMPLE: AUTO-ADAS-SENSOR-FPC",
                  buyerCategories: [
                    {
                      label: "Tier-1 Auto Systems",
                      pills: [
                        { name: "Samvardhana Motherson ($45M-$65M)", tier: "tier1" },
                        { name: "Bosch India ($35M-$50M)", tier: "tier1" },
                        { name: "Uno Minda ($22M-$32M)", tier: "tier1" },
                        { name: "Varroc ($18M-$25M)", tier: "tier1" },
                        { name: "Lumax ($15M-$22M)", tier: "tier1" },
                        { name: "Tata Motors / Mahindra", tier: "tier1" }
                      ]
                    },
                    {
                      label: "Contract EMS Assemblers",
                      pills: [
                        { name: "Foxconn Auto ($35M-$50M)", tier: "ems" },
                        { name: "Continental India ($28M-$40M)", tier: "ems" },
                        { name: "Dixon Auto ($25M-$38M)", tier: "ems" },
                        { name: "SFO Technologies", tier: "ems" }
                      ]
                    }
                  ],
                  metrics: [
                    { val: "$45M~$65M", lbl: "Motherson Annual Import" },
                    { val: "IATF 16949", lbl: "Turnkey Automotive Std" }
                  ],
                  detail: "Motherson ($45M-$65M), Bosch ($35M-$50M), and Continental ($28M-$40M) import 85%+ bare boards from East Asia."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "DEFENSE OFFSET 5-7X",
                  title: "Aerospace & Defense Offset",
                  desc: "Mandatory 30%-50% DAP 2020 offset. Strict non-China sourcing requirement across drone & radar fleets.",
                  blueprintImg: "assets/samples/Drone-縮圖.jpg",
                  fullImg: "assets/samples/Drone-大圖.jpg",
                  blueprintLabel: "HD SAMPLE: AERO-DRONE-RIGIDFLEX",
                  buyerCategories: [
                    {
                      label: "Military Drone & Avionics",
                      pills: [
                        { name: "Raphe mPhibr (Fund $145M)", tier: "tier1" },
                        { name: "ideaForge (50% Market Share)", tier: "tier1" },
                        { name: "Garuda Aerospace (IPO-Ready)", tier: "tier1" },
                        { name: "NewSpace Research ($73M Fund)", tier: "tier1" },
                        { name: "Asteria Aerospace (Reliance)", tier: "tier1" },
                        { name: "Sagar Defence / EndureAir", tier: "tier1" }
                      ]
                    },
                    {
                      label: "Defense Conglomerates & PSUs",
                      pills: [
                        { name: "TASL (Tata Aerospace)", tier: "ems" },
                        { name: "Adani Defence", tier: "ems" },
                        { name: "Zen Technologies (上市)", tier: "ems" },
                        { name: "Cyient DLM / Paras Defence", tier: "ems" },
                        { name: "ISRO / HAL Corridors", tier: "ems" }
                      ]
                    }
                  ],
                  metrics: [
                    { val: "5~7x", lbl: "Higher Margin vs Comms" },
                    { val: "IPC Class 3", lbl: "Mil-Grade Zero China" }
                  ],
                  detail: "DAP 2020 mandates 30%-50% local offset. Raphe mPhibr and ideaForge strictly ban Chinese parts, delivering 5-7x higher margins."
                }
              ]
            },
            // Slide 04: Top 5 Technology Moats & Sweat Equity
            {
              type: "split-hero-matrix",
              tag: "SLIDE 04 / TECHNOLOGY MOATS & GOVERNANCE",
              title: "Indian Promoter Majority Control (>90%) with 5% Sweat Equity",
              desc: "Taiwanese tier-1 team full-time commitment, breaking global vendor-code quotas and guaranteeing SpaceX-grade yield.",
              defaultExplanation: "Promoter retains absolute equity and asset control (>90%), while technical team stakes careers on 90%+ production yield.",
              heroCard: {
                tag: "GOVERNANCE PROTOCOL",
                title: "5% Sweat Equity Alignment",
                desc: "Indian industrial family retains >90% absolute controlling equity and board veto. Technical team stakes careers on 90%+ yield milestones with zero cash equity drain.",
                img: "assets/samples/equity_pie.png",
                imgLabel: "EQUITY SPLIT: >90% VS 5%",
                detail: "Zero cash equity drain on promoter. Indian industrial family holds >90% absolute controlling interest with complete operational veto; equity strictly tied to 85%-95% ramp-up yield deliverables."
              },
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
                  tag: "SUPPLY CHAIN",
                  title: "Global Vendor-Code Access",
                  desc: "Decades-long tier-1 relations secure direct FCCL quotas from DuPont, Taiflex, and Panasonic with 30-60 day credit lines.",
                  detail: "Breaks international allocation barriers, securing tier-1 baseline pricing and eliminating 100% cash prepayment constraints."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
                  tag: "COPY EXACTLY",
                  title: "Copy Exactly Process Transfer",
                  desc: "Direct blueprint replication of mature Taiwan DES, VCP, and black-hole parameters to skip 2 years of learning curve.",
                  detail: "Eliminates 2 years of trial-and-error yield losses common in greenfield Indian electronics setups."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
                  tag: "QUALIFICATION",
                  title: "Turnkey Tier-1 Certifications",
                  desc: "Pre-audited turnkey delivery of IATF 16949 (Auto), AS9100 (Aero), and IPC Class 3 defense certifications.",
                  detail: "Provides instant credibility to win high-margin global aerospace, automotive, and medical supplier contracts."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "DEFENSE OFFSET",
                  title: "100% Non-China Sovereignty",
                  desc: "Fulfills DAP 2020 mandatory 30%-50% offset requirement, locking 5-7x higher margins across defense fleets.",
                  detail: "Raphe mPhibr and ideaForge strictly ban Chinese parts, delivering 5-7x higher margins for verified indigenous suppliers."
                }
              ]
            },
            // Slide 05: Closed-Loop AI / ACC Smart Factory
            {
              type: "split-hero-matrix",
              tag: "SLIDE 05 / CLOSED-LOOP SMART MANUFACTURING",
              title: "Closed-Loop Edge AI ACC: 92% Yield & Zero-Defect Line",
              desc: "Predictive chemical dosing (ACC) and AOI computer vision auto-correct etch speed within 50ms, eliminating human error.",
              defaultExplanation: "We replaced unpredictable manual guesswork with Edge AI closed-loop control and digitalized SOPs, achieving self-healing yield curves.",
              heroCard: {
                tag: "AI INDUSTRIAL BRAIN",
                title: "Closed-Loop Edge AI Architecture",
                desc: "Edge computing nodes and LLM process memory govern real-time etching, chemical auto-dosing, and predictive defect elimination.",
                img: "assets/samples/ai_smart_factory.png",
                detail: "We replaced unpredictable manual guesswork with Edge AI closed-loop control and digitalized SOPs, achieving self-healing yield curves immune to high local operator turnover."
              },
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7" rx="2"/></svg>`,
                  tag: "TRACEABILITY",
                  title: "Smart SFC 1-Board-1-Code",
                  desc: "Every bare board etched with micro-QR code; real-time tracking across chemical baths and optical inspection.",
                  detail: "Instant traceability pinpoints exact machine parameters and chemical bath history for any board within 3 seconds."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
                  tag: "CLOSED-LOOP ACC",
                  title: "50ms Auto-Correct Etching",
                  desc: "3D AOI vision detects line-width drift at 25μm pitch, auto-tuning conveyor speed in 50ms before scrap occurs.",
                  detail: "Eliminates batch over-etching and line necking, guaranteeing consistent SpaceX-grade impedance tolerance."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M2 12h20"/><path d="M20 12v8H4v-8"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/></svg>`,
                  tag: "POKA-YOKE",
                  title: "AR Vision Dynamic SOP",
                  desc: "Operators wear AR smart glasses with dynamic Poka-yoke overlays, slashing training onboarding from 2 weeks to 4 hours.",
                  detail: "Immune to local workforce turnover; step-by-step visual guidance guarantees zero-defect execution on complex setups."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12 2.1 10.5"/></svg>`,
                  tag: "DIGITAL ASSET",
                  title: "Industrial LLM Knowledge Brain",
                  desc: "Every troubleshooting incident auto-indexed into RAG expert system; process IP permanently retained on-premise.",
                  detail: "Zero technical dependency on individual engineers. Factory institutional knowledge compounds automatically over time."
                }
              ]
            },
            // Slide 06: Brownfield Facility & Environmental Moat
            {
              type: "split-hero-matrix",
              tag: "SLIDE 06 / BROWNFIELD RETROFITTING & SPCB PERMITS",
              title: "13,000 m² Facility with 3x ZLD (Zero Liquid Discharge) Clearance",
              desc: "100% compliant with SPCB red-category chemical plating permits. Advanced MVR + RO water recycling creates insurmountable barrier.",
              defaultExplanation: "In India, environmental permits are the ultimate operating license; a 3,000 m² ZLD water recycling system ensures non-stop production.",
              heroCard: {
                tag: "ENVIRONMENTAL MOAT",
                title: "13,000 m² Modern Heavy Plant",
                desc: "Equipped with 3x standard ZLD zero liquid discharge, +40% HVAC thermal redundancy, and deep anti-vibration laser foundations.",
                img: "assets/samples/facility_zld.png",
                detail: "In India, environmental permits are the ultimate operating license; our 3,000 m² ZLD recycling system guarantees zero shutdown risk under SPCB red-category rules."
              },
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>`,
                  tag: "4,500 M² / FRP FLOOR",
                  title: "Heavy Wet Chemistry (VCP/DES)",
                  desc: "High-capacity VCP plating, DES continuous etching lines, and acid-mist scrubbers over heavy FRP acid-proof flooring.",
                  detail: "Fully permitted under State Pollution Control Board (SPCB) red-category industrial plating standards."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
                  tag: "3,500 M² / CLASS 10K",
                  title: "Yellow Room (+40% HVAC)",
                  desc: "Direct imaging (LDI) and vacuum laminators with +40% cooling redundancy against 45°C+ Indian summer heat.",
                  detail: "Strict temperature & humidity control (21±1°C, 55±5% RH) guarantees 25μm ultra-fine line precision."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "2,000 M² / 3D AOI",
                  title: "SMT, Laser & Test Lab",
                  desc: "High-speed SMT placement, flying probe test, and isolated deep anti-vibration foundations for micro-via drilling.",
                  detail: "Zero-defect quality gate with ionic contamination testing and metallurgical cross-section analysis."
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
                  tag: "3,000 M² / BUFFER",
                  title: "Cold Storage & Buffer Depot",
                  desc: "Temperature-controlled 2-10°C storage maintaining 45-60 days of strategic FCCL inventory in India.",
                  detail: "Completely eliminates global air/sea freight disruption risks, ensuring uninterrupted automotive supply."
                }
              ]
            },
            // Slide 07: Module 1 Product Capacity Mix & Revenue Model
            {
              type: "product-mix-visual",
              tag: "SLIDE 07 / MODULE 1: CAPACITY & REVENUE ARCHITECTURE",
              title: `Module 1: 15,000 m²/mo Capacity Delivering $${revAnnual}M Annual Run-Rate`,
              desc: `Weighted average selling price (ASP) of $${weightedPrice}/m² across 1L, 2L, and 3L+ multilayer FPC. Click cards for depth.`,
              totalVolume: capMonthly,
              weightedPrice: `$${weightedPrice}/m²`,
              annualRunRate: `$${revAnnual}M`,
              products: [
                {
                  name: "Single-Sided FPC (1L)",
                  pct: "40.0%",
                  color: "#38bdf8",
                  volume: "6,000 m²",
                  asp: "$120 / m²",
                  revYr: "$8.64M",
                  pills: ["📱 Mobile / Tablet", "⌚ Wearables", "🖥️ Central Touch Panel"],
                  detail: "High-volume basic interconnects for consumer electronics and automotive battery sensing wire replacement. 40% capacity share."
                },
                {
                  name: "Double-Sided FPC (2L)",
                  pct: "50.0%",
                  color: "var(--accent)",
                  volume: "7,500 m²",
                  asp: "$170 / m²",
                  revYr: "$15.30M",
                  pills: ["🔋 EV Battery CCS", "⚡ BMS Power Control", "🚗 Cabin Radar"],
                  detail: "The volume backbone. Primary solution for EV Battery Pack CCS busbar sensing and IATF-16949 automotive wire harnesses. 50% capacity share."
                },
                {
                  name: "Multilayer / Rigid-Flex (3L+)",
                  pct: "10.0%",
                  color: "#a855f7",
                  volume: "1,500 m²",
                  asp: "$270 / m²",
                  revYr: "$4.86M",
                  pills: ["🛸 Drone Flight Controller", "📡 Phased Array Radar", "🛰️ Satellite Comms"],
                  detail: "High-density interconnects (HDI) for aerospace drones, radar seekers, and medical robotics. Ultra-high margin (50%+ gross margin). 10% share."
                }
              ]
            },
            // Slide 08: Module 2 Factory Space & Area Allocation
            {
              type: "space-matrix-visual",
              tag: "SLIDE 08 / MODULE 2: FACTORY SPACE & CLEANROOM SPECS",
              title: `Module 2: 13,000 m² High-Reliability Cleanroom & ZLD Blueprint`,
              desc: `Total built-up factory floor area of ${totalArea} m² (vs 9,700 m² Kunshan ref, +34% localization redundancy). Engineered for heavy wet-process and zero contamination.`,
              defaultExplanation: "13,000 m² layout includes 3x ZLD environmental footprint and +40% HVAC capacity for Indian climate resilience.",
              kpiSummary: {
                totalArea: `${totalArea} m²`,
                kunshanRef: "9,700 m²",
                redundancy: "+34% Redundancy",
                zldArea: "3,000 m² (3x Kunshan)"
              },
              spaces: [
                {
                  title: `Class ${cleanroomCls} Cleanroom Yellow Light`,
                  kunshan: "1,200 m²",
                  india: "1,500 m²",
                  std: `Class ${cleanroomCls} / 22±2°C / 55±5% RH`,
                  equip: "LDI Direct Imaging, Dry Film Vacuum Lamination",
                  infra: "+40% HVAC capacity redundancy to conquer 45°C+ Indian ambient summer heat",
                  detail: "High ambient temperature in India requires +40% higher HVAC capacity. Temperature & humidity strictly maintained at 21±1°C, 55±5% RH for 25μm line pitch."
                },
                {
                  title: "Wet Process Chemical Area",
                  kunshan: "4,000 m²",
                  india: "4,500 m²",
                  std: "FRP Anti-Acid Floor, Multi-Stage Acid Exhaust",
                  equip: "VCP Continuous Plating Line, DES Etching Lines",
                  infra: "Mandatory State Pollution Control Board (SPCB) CTE/CTO red-category compliance",
                  detail: "Houses heavy chemical plating and DES etching. Heavy glass fiber reinforced polymer (FRP) flooring prevents chemical ground corrosion."
                },
                {
                  title: "Drilling & Vacuum Lamination",
                  kunshan: "1,500 m²",
                  india: "2,000 m²",
                  std: "Floor Load 1.5 tons/m², Isolated Deep Bed",
                  equip: "Laser Micro-Via Driller, Vacuum Hot Press",
                  infra: "Micro-vibration isolated floor base required to prevent micro-via drilling defect",
                  detail: "Isolated deep foundation design completely shields laser drillers and vacuum laminators from external heavy industrial vibrations."
                },
                {
                  title: "Raw Material Cold Warehouse",
                  kunshan: "1,500 m²",
                  india: "2,000 m²",
                  std: "Cold Storage 2-10°C, Strict RH Control",
                  equip: "DuPont FCCL, Coverlay & Chemical Depot",
                  infra: "45-60 Days Safety Stock in India (vs 7-14 in Kunshan) to eliminate supply chain disruptions",
                  detail: "Maintains 45-60 days of strategic raw material buffer in India, insulating factory operations from international customs and shipping delays."
                },
                {
                  title: "Wastewater & ZLD Facility",
                  kunshan: "1,500 m²",
                  india: "3,000 m²",
                  std: "Zero Liquid Discharge (ZLD) Mandate",
                  equip: "MVR Evaporators, Multi-Stage Reverse Osmosis",
                  infra: "3x larger footprint than Kunshan. Essential regulatory filter for SPCB red approval",
                  detail: "3,000 m² dedicated zero liquid discharge installation recycles 100% of chemical and plating effluent on-premise, guaranteeing uninterrupted operations."
                }
              ]
            },
            // Slide 09: Module 3 CapEx & SPECS Subsidy Comparison Cockpit
            {
              type: "capex-cockpit-visual",
              tag: "SLIDE 09 / MODULE 3: CAPITAL EXPENDITURE & SPECS REFUND",
              title: `Module 3: Total CapEx $${totCapEx}M with 25% SPECS Cash Refund`,
              desc: `Net investment reduced to $${netCapEx}M via SPECS 25% government subsidy. Taiwan technical team manages source verification and engineering boundaries.`,
              defaultExplanation: "SPECS 25% cash-back strictly applies to production machinery and factory environmental assets. Net capital exposure compressed to $17.25M.",
              kpiSummary: {
                totalBudget: `$${totCapEx}M`,
                kunshanRef: "$18.5M",
                specsRefund: `-$${specsSub}M (25% Cash)`,
                netInvestment: `$${netCapEx}M`
              },
              items: [
                {
                  title: "Core Production Machinery",
                  pct: "71.7%",
                  kunshan: "$15,000,000",
                  india: "$16,500,000",
                  subsidy: "-$4,125,000",
                  net: "$12,375,000",
                  boundary: "DuPont/Taiflex/Panasonic vendor-code support; CEC source verification.",
                  detail: "Direct vendor-code support (DuPont, Taiflex, Panasonic). Taiwan technical group verifies machines at source via CEC green channel."
                },
                {
                  title: "Plant & ZLD Infrastructure",
                  pct: "15.2%",
                  kunshan: "$1,000,000",
                  india: "$3,500,000",
                  subsidy: "-$875,000",
                  net: "$2,625,000",
                  boundary: "Define process & chemical inputs; Promoter leads civil engineering & SPCB.",
                  detail: "Define design specifications & chemical inputs. Local civil engineering & SPCB consent to establish (CTE/CTO) executed by Promoter."
                },
                {
                  title: "Cleanroom & HVAC Facilities",
                  pct: "13.0%",
                  kunshan: "$2,500,000",
                  india: "$3,000,000",
                  subsidy: "-$750,000",
                  net: "$2,250,000",
                  boundary: "Output 1K/10K layout & +40% HVAC specs; Promoter leads civil construction.",
                  detail: "Output factory layout, Class 1K/10K cleanliness, and +40% HVAC humidity specs. Actual building civil works managed by local promoter."
                },
                {
                  title: "Total Initial Project CapEx",
                  pct: "100.0%",
                  kunshan: "$18,500,000",
                  india: "$23,000,000",
                  subsidy: "-$5,750,000",
                  net: "$17,250,000",
                  boundary: "SPECS 25% cash-back locks in a $5.75M capital cushion, protecting investor downside.",
                  detail: "SPECS 25% cash rebate provides an unassailable $5.75M capital cushion, protecting investor downside."
                }
              ]
            },
            // Slide 10: Module 4 Dynamic OpEx Breakdown Visual Cockpit
            {
              type: "opex-cockpit-visual",
              tag: "SLIDE 10 / MODULE 4: MONTHLY OPERATING EXPENSES",
              title: `Module 4: Dynamic Monthly OpEx Structure ($${opexMo}M / mo)`,
              desc: `Variable costs account for 68.97% ($1.27M/mo), ensuring extreme anti-cyclical agility. Click cost rows for depth.`,
              defaultExplanation: "Total monthly OpEx is $1.845M ($22.14M annual). Low fixed depreciation ratio (13.6%) ensures rapid scale profits.",
              kpiSummary: {
                totalOpex: `$${opexMo}M / mo`,
                kunshanRef: "$1.38M / mo",
                variableRatio: "68.97% ($1.27M Var)",
                fixedRatio: "31.03% ($572K Fix)"
              },
              costs: [
                {
                  title: "Direct Material Cost",
                  kunshan: "$600,000",
                  india: "$900,000",
                  pct: "48.8%",
                  varPct: "100.00%",
                  varAmt: "$900,000",
                  fixAmt: "$0",
                  sub: "FCCL copper clad, coverlay film, copper anodes & plating chemistry.",
                  detail: "100% variable cost. Dual-sourcing strategy (Taiwan base + local India chemicals) guarantees supply security and cost parity."
                },
                {
                  title: "Direct & Indirect Labor (30 Staff)",
                  kunshan: "$450,000",
                  india: "$430,000",
                  pct: "23.3%",
                  varPct: "40.00%",
                  varAmt: "$172,000",
                  fixAmt: "$258,000",
                  sub: "30 Taiwanese & Indian senior process specialists and plant operators.",
                  detail: "Fixed core engineering management ($258K) paired with flexible shift production labor ($172K), optimizing unit labor efficiency."
                },
                {
                  title: "Manufacturing & Utilities",
                  kunshan: "$150,000",
                  india: "$265,000",
                  pct: "14.4%",
                  varPct: "75.69%",
                  varAmt: "$200,579",
                  fixAmt: "$64,422",
                  sub: "High-power HVAC cooling, cleanroom air filtration, and RO recycling.",
                  detail: "75.7% variable power & water consumption directly scales with production batches, protected by industrial tariff contracts."
                },
                {
                  title: "Fixed Depreciation & Amortization",
                  kunshan: "$180,000",
                  india: "$250,000",
                  pct: "13.6%",
                  varPct: "0.00%",
                  varAmt: "$0",
                  fixAmt: "$250,000",
                  sub: "10-year straight-line depreciation on production machinery and plant infrastructure.",
                  detail: "100% fixed cost amortized over 10 years, creating strong operational leverage once capacity exceeds break-even."
                },
                {
                  title: "Total Monthly OpEx Summary",
                  kunshan: "$1,380,000",
                  india: "$1,845,000",
                  pct: "100.0%",
                  varPct: "68.97%",
                  varAmt: "$1,272,579",
                  fixAmt: "$572,422",
                  sub: "68.97% variable cost structure gives factory supreme resilience against market cycles.",
                  detail: "High variable cost cushion ($1.27M/mo) allows factory to flexibly scale down operational burn during demand troughs without cash bleeding."
                }
              ]
            },
            // Slide 11: Module 5 Master Break-Even & Sensitivity Cockpit
            {
              type: "bep-master-cockpit",
              tag: "SLIDE 11 / MODULE 5: BREAK-EVEN & RETURNS COCKPIT",
              title: `Module 5: 50.8% Break-Even Point ($${bepRev}M / mo) & ${paybackYrs}-Year Payback`,
              desc: `Robust financial safety cushion. Interactive model: drag slider to simulate capacity sensitivity.`,
              bepVal: `${bepUtil}%`,
              thresholdRevMo: `$${bepRev}M`,
              defaultExplanation: "The business crosses into net profit at just 50.8% capacity ($1.22M monthly revenue), delivering exceptional downside defense.",
              metricsTable: [
                {
                  metric: "Target Sales Revenue",
                  monthly: "$2,400,000",
                  annual: "$28,800,000",
                  margin: "100.0%",
                  bench: "At 15,000 m²/mo full capacity, weighted avg ASP is $160/m²."
                },
                {
                  metric: "Operating Expenses (OpEx)",
                  monthly: "$1,845,000",
                  annual: "$22,140,000",
                  margin: "76.9%",
                  bench: "Includes materials, labor, power, water, and straight-line depreciation."
                },
                {
                  metric: "Operating Profit (EBIT)",
                  monthly: "$555,000",
                  annual: "$6,660,000",
                  margin: "23.1%",
                  bench: "EBIT Margin of 23.1% demonstrates robust scale profitability."
                },
                {
                  metric: "Break-Even Point (BEP)",
                  monthly: "$1,218,543",
                  annual: "$14,622,516",
                  margin: "50.8%",
                  bench: "Factory enters dynamic net profit at only $1.22M/mo revenue."
                },
                {
                  metric: "Internal Rate of Return (IRR)",
                  monthly: "--",
                  annual: "--",
                  margin: "21.3% ~ 24.8%",
                  bench: "Far exceeds standard electronics manufacturing benchmarks (12-15%)."
                },
                {
                  metric: "Static Payback Period",
                  monthly: "--",
                  annual: "--",
                  margin: "4.2 Years",
                  bench: "Assumes SPECS 25% refund ($5.75M). Without subsidy: 5.2 Years."
                }
              ],
              cards: [
                {
                  label: "Target Revenue (100%)",
                  val: `$${(getLiveStat("monthlyRevenue",2400000)/1000000).toFixed(1)}M`,
                  sub: `Annual: $${((getLiveStat("monthlyRevenue",2400000)*12)/1000000).toFixed(1)}M`,
                  detail: "At 15,000 m²/mo full capacity, weighted average ASP is $160/m², delivering $28.8M annual revenue."
                },
                {
                  label: "Operating Profit (EBIT)",
                  val: `$${ebitMo}K`,
                  sub: `${ebitMarg}% Margin ($${(ebitMo*12/1000).toFixed(2)}M/yr)`,
                  detail: "EBIT Margin of 23.1% delivers $6.66M annualized profit at full capacity, proving extraordinary scale returns."
                },
                {
                  label: "Break-Even Utilization",
                  val: `${bepUtil}%`,
                  sub: `Monthly: $${bepRev}M`,
                  detail: "The factory crosses into dynamic net profit at only $1.22M monthly revenue (50.8% capacity, 7,616 m²/mo)."
                },
                {
                  label: "Internal Rate of Return",
                  val: irrRange,
                  sub: "Benchmark: 12% - 15%",
                  detail: "Projected IRR between 21.3% and 24.8% far exceeds standard electronics manufacturing benchmarks (12-15%)."
                },
                {
                  label: "Static Payback",
                  val: `${paybackYrs} Yrs`,
                  sub: `Without SPECS: ${paybackNoSub} Yrs`,
                  detail: "Assumes SPECS 25% CapEx cash refund ($5.75M) is cleared. Static payback period is compressed to 4.2 years (5.2 years without subsidy)."
                }
              ]
            },
            // Slide 12: Dynamic Data-Driven Scissors Crossover Breakeven Horizon
            {
              type: "flow-pipeline",
              tag: "SLIDE 12 / 5-YEAR FULL INVESTMENT PAYBACK & FINANCIAL HORIZON",
              title: "5-Year Phased Horizon: Trade-to-Manufacture to Full CapEx Payback",
              desc: "Day-one commercial trade bridges cash flow, switching to local manufacturing at Year 1, achieving 100% full investment payback at Year 4.2.",
              defaultExplanation: "5-Year Full Investment Horizon: Cumulative operating net cash flow scales from Year 1 local manufacturing to fully recoup the $17.25M net CapEx at Year 4.2, delivering long-term compounding equity value.",
              orangeLabel: "Cumulative CapEx",
              greenLabel: "Cumulative Cash Flow",
              timelineLabel: "5-Year Strategic Investment Horizon",
              disclaimer: "* Note: 4.2-Yr Payback assumes SPECS 25% CapEx cash-back subsidy ($5.75M). Baseline Payback without subsidy is 5.2 Yrs. Approval subject to statutory clearances.",
              liveStats: {
                totCapEx: `$${totCapEx}M`,
                netCapEx: `$${netCapEx}M`,
                ebitAnnual: `$${(ebitMo * 12 / 1000).toFixed(2)}M`,
                paybackYrs: `${paybackYrs} Yrs`,
                cCapEx: Number(netCapEx) || 17.25,
                annualEbit: Number((ebitMo * 12 / 1000).toFixed(2)) || 6.66
              },
              orangeNodes: [
                {
                  title: "Company Setup & Equity",
                  metric: "SPCB CTE Filing",
                  detail: `Promoter secures JV incorporation, site leasehold, initial funding, and SPCB CTE application ($${totCapEx}M Total / $${netCapEx}M Net CapEx).`
                },
                {
                  title: "Cleanroom Ready & CTO",
                  metric: "$17.25M CapEx Ceiling",
                  detail: "Cleanroom commissioned, equipment installed, and SPCB CTO statutory consent to operate granted. CapEx spending concludes."
                },
                {
                  title: "Full Capacity Run-Rate",
                  metric: "180,000 m²/yr Scale",
                  detail: "Two-shift continuous operation achieves full capacity delivery ($28.8M annual revenue / $6.66M EBIT), generating high free cash flow."
                },
                {
                  title: "🎯 100% CapEx Payback",
                  metric: "Breakeven Crossover",
                  detail: "Cumulative net operating cash flow surpasses $17.25M net capital investment. Project reaches full static capital payback!"
                },
                {
                  title: "Phase 2 Expansion",
                  metric: "High Equity Compounding",
                  detail: "Evaluate Phase 2 rigid-flex expansion, defense-grade HDI certification, and shareholder dividend distribution."
                }
              ],
              greenNodes: [
                {
                  title: "Trade Cash Flow Entry",
                  metric: "Seeding Market Codes",
                  detail: "Initiate commercial trading sales via mature supply chain, establishing tier-1 customer vendor codes and 48h prototype sampling."
                },
                {
                  title: "100% Local Switch",
                  metric: "Zero-Downtime Transition",
                  detail: "Transition import orders to 100% India local manufacturing upon cleanroom clearance, kicking off high-margin local production."
                },
                {
                  title: "Operating Cash Engine",
                  metric: "+$6.66M/yr Cash Inflow",
                  detail: "Annualized EBIT reaches $6.66M (23.1% margin). Factory operates as an autonomous, self-sustaining high-cash-generation engine."
                },
                {
                  title: "Net Capital Surplus",
                  metric: "Cumulative Surplus > $17.25M",
                  detail: "Operating cash fully offsets all initial capital expenditure; business enters pure net positive compounding growth."
                },
                {
                  title: "Global Supply Leadership",
                  metric: "Cumulative Cash > $22.5M",
                  detail: "Consolidate position as India's #1 indigenous FPC manufacturer across automotive CCS, defense aerospace, and consumer electronics."
                }
              ],
            },
            // Slide 13: Call to Action & Data Room Access
            {
              type: "cta-hub",
              tag: "SLIDE 13 / STRATEGIC PARTNERSHIP & AI DATA ROOM",
              title: "Position Your Capital at the Origin of India's Defense Supply Chain",
              desc: "Promoter retains >90% controlling equity. Access our official Google AI Data Room or connect directly with our founding leadership.",
              notebookUrl: "https://notebook.google.com/notebook/be750388-f5f2-4027-9f85-f45f61c53ba7",
              formTitle: "Direct Investor Engagement",
              formSubtitle: "Schedule a confidential dialogue with our founding team. All inquiries are securely logged.",
              aiTitle: "Official AI Data Room (NotebookLM)",
              aiBadge: "23 VERIFIED INTELLIGENCE SOURCES",
              aiDesc: "Interactive AI assistant trained on comprehensive Indian market research, Tier-1 customer KYC profiles, and core technical team manufacturing capabilities.",
              aiNotice: "Requires a Google Account (Gmail or Workspace). Read-only interactive Q&A and audio podcast exploration.",
              aiBtn: "Open Official AI Data Room",
              submitBtn: "Submit Partnership Inquiry",
              agendaBtn: "Review Roadshow Agenda",
              landingBtn: "Return to Main Portal"
            }
          ]
        },
        zh: {
          exitLanding: "返回落地頁",
          btnPrev: "◄ 上一頁",
          btnNext: "下一頁 ►",
          slides: [
            // Slide 01: 執行摘要
            {
              type: "hero-showcase",
              tag: "簡報 01 / 執行摘要與國家戰略定位",
              title: "破除 30% 自給率假象：搶佔全印首座高階 FPC 前製程「絕對真空」",
              desc: "專注 35%~40% 高毛利裸板製造，承接全球 China+1 歷史性產業轉移窗口，打造高壁壘、高現金流上市平台。",
              mainStat: { 
                label: "滿載年度營收規模", 
                val: `$${revAnnual}M`, 
                desc: `以每月 ${capMonthly} m² 產能與 $${weightedPrice}/m² 加權單價推算（鎖定 35%~40% 綜合毛利）。`,
                kpiSteps: [
                  { val: "15,000 m²", lbl: "月度滿載產能" },
                  { val: "38.5%", lbl: "綜合毛利率" },
                  { val: "$28.8M", lbl: "年化總產值" }
                ]
              },
              subStats: [
                { 
                  label: "投資人淨資本支出", 
                  val: `$${netCapEx}M`, 
                  tag: "SPECS 25% 現金返還", 
                  tagType: "tag-positive",
                  desc: `總預算 $${totCapEx}M 扣除 SPECS 25% 現金返還 ($${specsSub}M)。` 
                },
                { 
                  label: "息稅前利潤率 (EBIT)", 
                  val: `${ebitMarg}%`, 
                  tag: "年營業利潤 $6.66M", 
                  tagType: "tag-accent",
                  desc: `滿載年貢獻營業利潤達 $${(ebitMo*12/1000).toFixed(2)}M 美元。` 
                },
                { 
                  label: "靜態投資回收期", 
                  val: `${paybackYrs} 年`, 
                  tag: `無補貼為 ${paybackNoSub} 年`, 
                  tagType: "tag-positive",
                  desc: `含 SPECS 補貼 ${paybackYrs} 年回本（未含補貼為 ${paybackNoSub} 年）。` 
                },
                { 
                  label: "內部報酬率 (IRR)", 
                  val: irrRange, 
                  tag: "製造業基準: 12-15%", 
                  tagType: "tag-accent",
                  desc: "大幅超越傳統電子代工與製造業回報基準。" 
                }
              ]
            },
            // Slide 02: 市場痛點與雙軌對比
            {
              type: "vs-matrix",
              tag: "簡報 02 / 市場剛需與痛點破局",
              title: "0% 在地競爭真空 × 48 小時極速打樣：終結 3 週跨國斷鏈痛點",
              desc: "打通印度車載、國防與消費電子在地化供應動脈，重塑供應鏈響應時效，提升客戶 DVA 拿滿 PLI 增量補貼。",
              badHeader: "傳統海外進口三大死穴 🔴",
              badList: [
                { badge: "3~5 週", bar: "bad", text: "打樣跨國寄送與工程溝通週期冗長，拖垮客戶新品上市時效 (NPI)。" },
                { badge: "24%~46%", bar: "bad", text: "負擔關稅倒掛與昂貴空運，疊加 45~60 天在途安全庫存積壓現金流。" },
                { badge: "地緣斷鏈", bar: "bad", text: "供應鏈高度依賴外匯與地緣政治；組裝廠 DVA 停滯在 15~20% 面臨政策扣減。" }
              ],
              goodHeader: "Indo-Phoenix 在地化三大殺手鐧 🟢",
              goodList: [
                { badge: "48~72 小時", bar: "good", text: "印度在地快速工程打樣，3~5 天量產 JIT 廠邊直送。" },
                { badge: "0% 關稅", bar: "good", text: "基礎原料 100% 本地採購，享有 MOOWR 保稅與東協 FTA 免稅通道。" },
                { badge: "35%+ DVA", bar: "good", text: "直接提升客戶在地價值增值 (DVA)，助力客戶拿滿國家 PLI 增量補貼。" }
              ]
            },
            // Slide 03: 三大剛需賽道真實買家
            {
              type: "feature-cards-visual",
              tag: "簡報 03 / 三大剛需賽道與真實買家名冊",
              title: "訂單不是猜的，是點名的：手握數十億美元剛性採購池",
              desc: "對標 2026 印度 $1.06B~$1.30B FPC 市場，年需求超 3.5 億片剛性採購池。涵蓋自主 Tier-1 原廠、EMS 巨頭與國防重工。",
              defaultExplanation: "下游巨頭為滿足政府國產化與 PLI 考核急需在地供應商，採購名單全部到位，我們是在挑選最高毛利的訂單。",
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 11v2"/><path d="M10 11v2"/><path d="M14 11v2"/></svg>`,
                  tag: "新能源儲能 CCS",
                  title: "EV 與電池 Pack CCS 採樣軟板",
                  desc: "全面替代傳統笨重採樣銅線束，提供 500-1500mm 超長厚銅 (2-12oz) 軟板。",
                  blueprintImg: "assets/samples/CCS-縮圖.jpg",
                  fullImg: "assets/samples/CCS-大圖.jpg",
                  blueprintLabel: "高清樣品圖：EV-BATTERY-CCS-PACK",
                  buyerCategories: [
                    {
                      label: "自研 Tier-1 / 電池 Pack 原廠",
                      pills: [
                        { name: "Tata AutoComp ($25M-$35M)", tier: "tier1" },
                        { name: "VVDN eMobility ($12M-$18M)", tier: "tier1" },
                        { name: "Exide Energy ($15M-$22M)", tier: "tier1" },
                        { name: "Amara Raja ($12M-$16M)", tier: "tier1" },
                        { name: "Kaynes EV ($8M-$12M)", tier: "tier1" },
                        { name: "Lucas TVS", tier: "tier1" },
                        { name: "Spark Minda", tier: "tier1" },
                        { name: "Ola Electric", tier: "tier1" }
                      ]
                    },
                    {
                      label: "EMS 巨頭 / 模組代工廠",
                      pills: [
                        { name: "鴻海 Foxconn EV ($30M-$45M)", tier: "ems" },
                        { name: "塔塔電子 TEPL ($20M-$30M)", tier: "ems" },
                        { name: "Dixon Energy ($18M-$25M)", tier: "ems" },
                        { name: "Syrma SGS ($10M-$15M)", tier: "ems" },
                        { name: "Jabil India", tier: "ems" }
                      ]
                    }
                  ],
                  metrics: [
                    { val: "$25M~$35M", lbl: "TACO 單一巨頭進口額" },
                    { val: "90%+", lbl: "全印裸板目前依賴進口" }
                  ],
                  detail: "TACO ($25M-$35M)、鴻海 ($30M-$45M) 及 Dixon ($18M-$25M) 等急需 500-1500mm 超長厚銅在地裸板。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
                  tag: "車載 TIER-1",
                  title: "車載感測與 ADAS 車規級線束",
                  desc: "單車採用超 100 種 FPC。提供 IATF 16949 / AEC-Q 車規認證本土裸板與在地測試。",
                  blueprintImg: "assets/samples/Automotive-縮圖.jpg",
                  fullImg: "assets/samples/Automotive-大圖.jpg",
                  blueprintLabel: "高清樣品圖：AUTO-ADAS-SENSOR-FPC",
                  buyerCategories: [
                    {
                      label: "自研車載 Tier-1 系統巨頭",
                      pills: [
                        { name: "Samvardhana Motherson ($45M-$65M)", tier: "tier1" },
                        { name: "Bosch India ($35M-$50M)", tier: "tier1" },
                        { name: "Uno Minda ($22M-$32M)", tier: "tier1" },
                        { name: "Varroc ($18M-$25M)", tier: "tier1" },
                        { name: "Lumax ($15M-$22M)", tier: "tier1" },
                        { name: "Tata Motors / Mahindra", tier: "tier1" }
                      ]
                    },
                    {
                      label: "車規級 EMS / SMT 貼片基地",
                      pills: [
                        { name: "鴻海 Foxconn Auto ($35M-$50M)", tier: "ems" },
                        { name: "德國馬牌 Continental ($28M-$40M)", tier: "ems" },
                        { name: "Dixon Auto ($25M-$38M)", tier: "ems" },
                        { name: "SFO Technologies", tier: "ems" }
                      ]
                    }
                  ],
                  metrics: [
                    { val: "$45M~$65M", lbl: "Motherson 年進口額" },
                    { val: "IATF 16949", lbl: "車規交鑰匙認證體系" }
                  ],
                  detail: "Motherson ($45M-$65M)、Bosch ($35M-$50M) 及 Continental ($28M-$40M) 全印 85%+ 高階車規裸板皆仰賴進口。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "國防相抵 5~7倍暴利",
                  title: "航太與國防軍規相抵 (Offset)",
                  desc: "DAP 2020 強制 30%-50% 本地採購相抵。軍用無人機與相控陣雷達嚴格排斥中國零件。",
                  blueprintImg: "assets/samples/Drone-縮圖.jpg",
                  fullImg: "assets/samples/Drone-大圖.jpg",
                  blueprintLabel: "高清樣品圖：AERO-DRONE-RIGIDFLEX",
                  buyerCategories: [
                    {
                      label: "軍用無人機 / 航太深科技",
                      pills: [
                        { name: "Raphe mPhibr (融資1.45億美元)", tier: "tier1" },
                        { name: "ideaForge (印度市佔率 50%)", tier: "tier1" },
                        { name: "Garuda Aerospace (籌備IPO)", tier: "tier1" },
                        { name: "NewSpace Research (蜂群無人機)", tier: "tier1" },
                        { name: "Asteria Aerospace (信實集團)", tier: "tier1" },
                        { name: "Sagar Defence (海空水面艇)", tier: "tier1" }
                      ]
                    },
                    {
                      label: "國防軍工巨頭 / 航太事業部",
                      pills: [
                        { name: "TASL (塔塔航太防務)", tier: "ems" },
                        { name: "Adani Defence (阿達尼防務)", tier: "ems" },
                        { name: "Zen Technologies (上市反無人機)", tier: "ems" },
                        { name: "Cyient DLM / Paras Defence", tier: "ems" },
                        { name: "ISRO / HAL 太空與戰機生態", tier: "ems" }
                      ]
                    }
                  ],
                  metrics: [
                    { val: "5~7 倍", lbl: "通訊產品超額利潤倍數" },
                    { val: "IPC Class 3", lbl: "全印唯一軍規無中化實體" }
                  ],
                  detail: "DAP 2020 強制要求 30%~50% 在地採購；Raphe mPhibr 與 ideaForge 全面封殺中國零件，Indo-Phoenix 享有 5~7 倍超額利潤。"
                }
              ]
            },
            // Slide 05: Edge AI / ACC Smart Factory
            {
              type: "feature-cards-visual",
              tag: "SLIDE 05 / AI SMART FACTORY ARCHITECTURE",
              title: "AI / ACC Engine: Eliminating Labor Turnover & Yield Variance",
              desc: "Closed-loop sub-second feedback and AR dynamic Poka-Yoke retain manufacturing intelligence inside the system.",
              defaultExplanation: "Machine learning algorithms and edge controllers automate quality control, preventing batch scrap before it occurs.",
              cards: [
                {
                  icon: "⚡",
                  tag: "EDGE ACC",
                  title: "Millisecond Edge Feedback",
                  desc: "Microchip PolarFire SoC nodes capture micro-deviations in real-time and send servo offset commands to exposure and drilling.",
                  detail: "Corrects micro-inch alignment and chemical etching drift autonomously before batch defect thresholds are breached."
                },
                {
                  icon: "🥽",
                  tag: "AR SOP",
                  title: "AR Smart Glass Poka-Yoke",
                  desc: "Operators wear AR glasses projecting dynamic SOPs and anti-error alerts, cutting training cycles from 2 weeks to 4 hours.",
                  detail: "Ensures consistent execution regardless of operator churn, protecting factory throughput and cleanliness standards."
                },
                {
                  icon: "🧠",
                  tag: "FACTORY LLM",
                  title: "Industrial Expert LLM / RAG",
                  desc: "Every process adjustment and troubleshooting log is converted into an interactive AI knowledge brain retained permanently on-site.",
                  detail: "100% local retention of engineering intelligence, breaking the historical vulnerability of technician departure."
                }
              ]
            },
            // Slide 06: Infrastructure & ZLD Environmental Moats
            {
              type: "space-matrix-visual",
              tag: "SLIDE 06 / PLANT INFRASTRUCTURE & ZLD",
              title: `13,000 m² Heavy Industrial Facility & 3x ZLD Green Clearance`,
              desc: "Engineered for heavy wet-chemical processes, micro-vibration isolated drilling, and strict SPCB zero-liquid discharge mandates.",
              defaultExplanation: "SPCB environmental license represents a primary regulatory moat. 3,000 m² ZLD system guarantees uninterrupted operations.",
              spaces: [
                {
                  title: "Cleanroom Yellow Light",
                  area: "1,500 m²",
                  std: "Class 10K / 22±2°C",
                  desc: "LDI Laser Direct Imaging & Dry Film lamination.",
                  detail: "+40% HVAC cooling headroom engineered specifically for Indian ambient summer extremes (45°C+)."
                },
                {
                  title: "Wet Chemical Plating",
                  area: "4,500 m²",
                  std: "FRP Anti-Acid Floor",
                  desc: "VCP continuous vertical plating and DES etching lines.",
                  detail: "Heavy acid/alkali resistant FRP coating with redundant negative pressure air scrubbers for SPCB approval."
                },
                {
                  title: "Drilling & Press",
                  area: "2,000 m²",
                  std: "Floor Load 1.5 t/m²",
                  desc: "Laser micro-vias drilling and vacuum hot press.",
                  detail: "Isolated seismic foundation to prevent micro-vibration interference during high-precision micro-via laser drilling."
                },
                {
                  title: "Cold Raw Materials",
                  area: "2,000 m²",
                  std: "Cold Storage 2-10°C",
                  desc: "FCCL base laminates, coverlays, and pure chemicals.",
                  detail: "Maintains 45-60 days of strategic safety inventory in India to eliminate international logistics disruptions."
                },
                {
                  title: "Wastewater & ZLD",
                  area: "3,000 m²",
                  std: "Zero Liquid Discharge",
                  desc: "MVR mechanical vapor recompression and multi-stage RO.",
                  detail: "3x larger footprint than standard factories. Mandatory environmental installation for green project approvals in India."
                }
              ]
            },
            // Slide 07: Module 1 Visual Product Mix Donut & Spec Architecture
            {
              type: "product-mix-visual",
              tag: "SLIDE 07 / MODULE 1: CAPACITY & REVENUE ARCHITECTURE",
              title: "Module 1: High-Density Capacity & Revenue Mix ($28.8M / Yr)",
              desc: `Full production scaled to ${capMonthly} m²/month (180,000 m²/year) delivering $${revAnnual}M gross run-rate. Click items for technical depth.`,
              totalVolume: `${capMonthly} m²`,
              weightedPrice: `$${weightedPrice} / m²`,
              annualRunRate: `$${revAnnual}M`,
              defaultExplanation: "1L to 3L+ multi-layer bare boards designed for EV battery CCS, defense avionics, and foldable electronics under dual-shift high throughput.",
              products: [
                {
                  name: "Single-sided FPC (1L)",
                  pct: "40.0%",
                  volume: "6,000 m²/mo",
                  asp: "$100 / m²",
                  revMo: "$600,000",
                  revYr: "$7.20M",
                  color: "#38bdf8",
                  detail: "Single-layer flexible printed circuits. Primarily targeted at standard automotive sensors, consumer LED backlights, and entry-level industrial controls."
                },
                {
                  name: "Double-sided FPC (2L)",
                  pct: "50.0%",
                  volume: "7,500 m²/mo",
                  asp: "$180 / m²",
                  revMo: "$1,350,000",
                  revYr: "$16.20M",
                  color: "var(--accent)",
                  detail: "Double-sided PTH through-hole flex circuits. High-volume sweet spot serving automotive battery CCS modules (Waaree/EV) and aerospace telemetry."
                },
                {
                  name: "Multi-layer FPC (3L+)",
                  pct: "10.0%",
                  volume: "1,500 m²/mo",
                  asp: "$300 / m²",
                  revMo: "$450,000",
                  revYr: "$5.40M",
                  color: "#a855f7",
                  detail: "Multi-layer high-density interconnect (HDI) rigid-flex boards. Built for radar signal processing, missile guidance systems, and medical endoscopes."
                }
              ]
            },
            // Slide 08: Module 2 Factory Space Allocation Matrix Tiles
            {
              type: "space-matrix-visual",
              tag: "SLIDE 08 / MODULE 2: FACTORY SPACE SPECIFICATION",
              title: `Module 2: 13,000 m² Spatial Engineering Standards`,
              desc: "Rigorous cleanroom classes, floor loading, and environmental parameters ensuring seamless support for 15,000 m²/mo output.",
              defaultExplanation: "13,000 m² total footprint structured for compliance with Indian State Pollution Control Board (SPCB) and high-yield wet-chemical processes.",
              spaces: [
                {
                  title: "Cleanroom Yellow Light",
                  area: "1,500 m²",
                  std: "Class 10K / 22±2°C",
                  desc: "LDI Laser Direct Imaging & Dry Film lamination.",
                  detail: "+40% HVAC cooling headroom engineered specifically for Indian ambient summer extremes (45°C+)."
                },
                {
                  title: "Wet Chemical Plating",
                  area: "4,500 m²",
                  std: "FRP Anti-Acid Floor",
                  desc: "VCP continuous vertical plating and DES etching lines.",
                  detail: "Heavy acid/alkali resistant FRP coating with redundant negative pressure air scrubbers for SPCB approval."
                },
                {
                  title: "Drilling & Press",
                  area: "2,000 m²",
                  std: "Floor Load 1.5 t/m²",
                  desc: "Laser micro-vias drilling and vacuum hot press.",
                  detail: "Isolated seismic foundation to prevent micro-vibration interference during high-precision micro-via laser drilling."
                },
                {
                  title: "Cold Raw Materials",
                  area: "2,000 m²",
                  std: "Cold Storage 2-10°C",
                  desc: "FCCL base laminates, coverlays, and pure chemicals.",
                  detail: "Maintains 45-60 days of strategic safety inventory in India to eliminate international logistics disruptions."
                },
                {
                  title: "Wastewater & ZLD",
                  area: "3,000 m²",
                  std: "Zero Liquid Discharge",
                  desc: "MVR mechanical vapor recompression and multi-stage RO.",
                  detail: "3x larger footprint than standard factories. Mandatory environmental installation for green project approvals in India."
                }
              ]
            },
            // Slide 09: Module 3 CapEx & SPECS Subsidy Comparison Cockpit
            {
              type: "capex-cockpit-visual",
              tag: "SLIDE 09 / MODULE 3: CAPITAL EXPENDITURE & SPECS REFUND",
              title: `Module 3: Total CapEx $${totCapEx}M with 25% SPECS Cash Refund`,
              desc: `Net investment reduced to $${netCapEx}M via SPECS 25% government subsidy. Taiwan technical team manages source verification and engineering boundaries.`,
              defaultExplanation: "SPECS 25% cash-back strictly applies to production machinery and factory environmental assets. Net capital exposure compressed to $17.25M.",
              items: [
                {
                  title: "Core Production & Test Equipment",
                  pct: "71.7%",
                  kunshan: "$15,000,000",
                  india: "$16,500,000",
                  subsidy: "-$4,125,000",
                  net: "$12,375,000",
                  detail: "Direct vendor-code support (DuPont, Taiflex, Panasonic). Taiwan technical group verifies machines at source via CEC green channel."
                },
                {
                  title: "Plant & Environmental (ZLD) Infrastructure",
                  pct: "15.2%",
                  kunshan: "$1,000,000",
                  india: "$3,500,000",
                  subsidy: "-$875,000",
                  net: "$2,625,000",
                  detail: "Define design specifications & chemical inputs. Local civil engineering & SPCB consent to establish (CTE/CTO) executed by Promoter."
                },
                {
                  title: "Plant Building & Cleanroom Facilities",
                  pct: "13.0%",
                  kunshan: "$2,500,000",
                  india: "$3,000,000",
                  subsidy: "-$750,000",
                  net: "$2,250,000",
                  detail: "Output factory layout, Class 10K/100K cleanliness, and +40% HVAC humidity specs. Actual building civil works managed by local promoter."
                },
                {
                  title: "Total Initial Project CapEx",
                  pct: "100.0%",
                  kunshan: "$18,500,000",
                  india: `$${totCapEx}M`,
                  subsidy: `-$${specsSub}M`,
                  net: `$${netCapEx}M`,
                  detail: "SPECS 25% cash rebate provides an unassailable $5.75M capital cushion, protecting investor downside."
                }
              ]
            },
            // Slide 10: Module 4 Dynamic OpEx Breakdown Visual Cockpit
            {
              type: "opex-cockpit-visual",
              tag: "SLIDE 10 / MODULE 4: MONTHLY OPERATING EXPENSES",
              title: `Module 4: Dynamic Monthly OpEx Structure ($${opexMo}M / mo)`,
              desc: `Variable costs account for 69.0% ($1.27M/mo), ensuring extreme anti-cyclical agility. Click cost cards for depth.`,
              defaultExplanation: "Total monthly OpEx is $1.845M ($22.14M annual). Low fixed depreciation ratio (13.6%) ensures rapid scale profits.",
              costs: [
                {
                  title: "Direct Raw Materials",
                  amount: "$900,000",
                  pct: "48.8%",
                  varPct: "100%",
                  fixPct: "0%",
                  sub: "FCCL copper clad, coverlay film, copper anodes & plating chemistry.",
                  detail: "100% variable cost. Dual-sourcing strategy (Taiwan base + local India chemicals) guarantees supply security and cost parity."
                },
                {
                  title: "Labor & Technical Staff",
                  amount: "$430,000",
                  pct: "23.3%",
                  varPct: "40%",
                  fixPct: "60%",
                  sub: "30 Taiwanese & Indian senior process specialists and operators.",
                  detail: "Fixed senior engineering overhead ($258K) combined with variable shift labor ($172K), optimizing labor productivity."
                },
                {
                  title: "Utilities, Power & Water",
                  amount: "$265,000",
                  pct: "14.4%",
                  varPct: "75.7%",
                  fixPct: "24.3%",
                  sub: "High-power HVAC cooling, cleanroom air filtration, and RO recycling.",
                  detail: "75.7% variable power consumption directly tracking production runs, protected by dedicated substation grid contracts."
                },
                {
                  title: "Straight-line Depreciation",
                  amount: "$250,000",
                  pct: "13.6%",
                  varPct: "0%",
                  fixPct: "100%",
                  sub: "10-year straight-line depreciation on production line and infrastructure.",
                  detail: "Fixed non-cash depreciation charge. Low 13.6% share allows plant to maintain strong cash flow even in down-cycles."
                }
              ]
            },
            // Slide 11: Module 5 Master Profitability & BEP Cockpit
            {
              type: "bep-master-cockpit",
              tag: "SLIDE 11 / MODULE 5: PROFITABILITY & BREAK-EVEN ANALYSIS",
              title: `Module 5: ${bepUtil}% Break-Even Point · High Margin of Safety`,
              desc: `Dynamic profitability reached at $${bepRev}M/mo (${(getLiveStat("bep",50.8)*150).toFixed(0)} m² utilization). Click cards for contextual insight.`,
              bepVal: `${bepUtil}%`,
              thresholdRevMo: `$${bepRev}M`,
              thresholdRevYr: `$${(bepRev * 12).toFixed(2)}M`,
              defaultExplanation: "Includes materials, labor, power, water, and straight-line depreciation. Operating above 50.8% capacity generates immediate net cash flow.",
              cards: [
                {
                  label: "Target Revenue",
                  val: `$${(getLiveStat("monthlyRevenue",2400000)/1000000).toFixed(1)}M`,
                  sub: `Annually: $${((getLiveStat("monthlyRevenue",2400000)*12)/1000000).toFixed(1)}M`,
                  detail: "At 15,000 m²/month full-capacity operation, weighted average price is $160/m². Represents dual-shift continuous manufacturing gross run-rate."
                },
                {
                  label: "Operating Expenses",
                  val: `$${opexMo}M`,
                  sub: "76.9% of total revenue",
                  detail: "Total monthly OpEx is $1.845M ($22.14M/yr). Variable costs account for 69.0% ($1.27M/mo), providing strong anti-cyclical resilience."
                },
                {
                  label: "EBIT Operating Profit",
                  val: `$${ebitMo}K`,
                  sub: `${ebitMarg}% Margin ($${(ebitMo*12/1000).toFixed(2)}M/yr)`,
                  detail: "EBIT Margin of 23.1% delivers $6.66M annualized profit at full capacity, proving extraordinary scale returns."
                },
                {
                  label: "BEP Revenue Threshold",
                  val: `$${bepRev}M`,
                  sub: `Annualized: $${(bepRev*12).toFixed(2)}M`,
                  detail: "The factory crosses into dynamic net profit at only $1.22M monthly revenue. Standard for highly capitalized modern wet-process electronics plants."
                },
                {
                  label: "Internal Rate of Return",
                  val: irrRange,
                  sub: "Benchmark: 12% - 15%",
                  detail: "Projected IRR between 21.3% and 24.8% far exceeds standard electronics manufacturing benchmarks, offering superior risk-adjusted alpha."
                },
                {
                  label: "Static Payback",
                  val: `${paybackYrs} Yrs`,
                  sub: `Without SPECS: ${paybackNoSub} Yrs`,
                  detail: "Assumes SPECS 25% CapEx cash refund ($5.75M) is cleared. Static payback period is compressed to 4.2 years (5.2 years without subsidy)."
                }
              ]
            },
            // Slide 12: Implementation Roadmap
            {
              type: "flow-pipeline",
              tag: "SLIDE 12 / EXECUTION ROADMAP & MILESTONES",
              title: "24-Month Phased Ramp-Up: Break-Even at Month 12",
              desc: "From brownfield retrofitting to full commercial production within 24 months, achieving scale net profits.",
              steps: [
                { num: "T+6M", title: "Plant Setup & Sampling", desc: "Cleanroom construction, CEC machine verification, customer prototype audits." },
                { num: "T+12M", title: "Scale Production (70%)", desc: "Pass 50.8% BEP threshold. Achieve monthly cash flow profitability." },
                { num: "T+18M", title: "IATF 16949 / AEC-Q", desc: "Complete Tier-1 automotive and defense customer supplier qualifications." },
                { num: "T+24M", title: "Full Capacity (95%+)", desc: "Deliver $28.8M annual revenue and begin SaaS AI manufacturing export." }
              ]
            },
            // Slide 13: Call to Action & Data Room Access
            {
              type: "cta-hub",
              tag: "SLIDE 13 / STRATEGIC PARTNERSHIP & DATA ROOM",
              title: "Position Your Capital at the Origin of India's Defense Supply Chain",
              desc: "Promoter retains >90% controlling equity with full government backing. Request NDA for exclusive Data Room access.",
              primaryBtn: "Request Investor Data Room Access",
              landingBtn: "Return to Landing Page Portal"
            }
          ]
        },
        zh: {
          exitLanding: "返回落地頁",
          navAgenda: "目錄導航",
          btnPrev: "◄ 上一頁",
          btnNext: "下一頁 ►",
          slides: [
            // 簡報 00: 全息總覽與目錄導航
            {
              type: "agenda-master-visual",
              tag: "商業路演總覽 / 四大幕劇導航地圖",
              title: "Project Indo-Phoenix：戰略路演全息目錄",
              desc: "印度首座高可靠度航太與國防 FPC 智慧製造樞紐之完整機構級路演架構。點選任一幕劇即可一鍵直達。",
              acts: [
                {
                  actNum: "第一幕",
                  targetSlide: 1,
                  badge: "戰略機遇與剛需",
                  pages: "簡報 01 – 03",
                  title: "國家戰略真空與點名買家",
                  desc: "破除 30% 自給率假象；搶佔 0% 裸板絕對真空、48小時極速打樣，手握下游巨頭數十億採購池。",
                  subitems: [
                    "01. 執行摘要與高階裸板 0% 絕對真空",
                    "02. 痛點破局：48h 打樣 vs 3週海外斷鏈",
                    "03. 三大剛需賽道與點名買家名冊"
                  ]
                },
                {
                  actNum: "第二幕",
                  targetSlide: 4,
                  badge: "技術壁壘與重工基建",
                  pages: "簡報 04 – 06",
                  title: "技術股護城河與 ZLD 環保特許",
                  desc: "台灣團隊 5% 讓利對賭良率、印度大股東 >90% 絕對控股；Edge AI 閉環工廠與 3 倍 ZLD 零排放。",
                  subitems: [
                    "04. 5% Sweat Equity 讓利與 >90% 控股治理",
                    "05. AI / ACC 閉環智慧工廠體系",
                    "06. 13,000 m² 廠房基建與 SPCB 環評門檻"
                  ]
                },
                {
                  actNum: "第三幕",
                  targetSlide: 7,
                  badge: "神聖五大財務模型",
                  pages: "簡報 07 – 11",
                  title: "五大財務模型連鎖真理閉環",
                  desc: "嚴密閉環數據真源：$28.8M 年營收、CapEx $23M、SPECS 25% 返還、單月 OpEx $1.845M 與 50.8% BEP。",
                  subitems: [
                    "07. 模組一：產能規劃與產品營收模型 ($28.8M)",
                    "08. 模組二：13,000 m² 空間工程標準",
                    "09. 模組三：CapEx $23M 與 SPECS 25% 補貼",
                    "10. 模組四：單月 OpEx ($1.845M) 成本結構",
                    "11. 模組五：獲利駕駛艙與 50.8% 損益平衡點"
                  ]
                },
                {
                  actNum: "第四幕",
                  targetSlide: 12,
                  badge: "放量里程碑與合作",
                  pages: "簡報 12 – 13",
                  title: "5 年投資回本與 Data Room",
                  desc: "以貿促工雙軌無縫切換，第 4.2 年實現 100% 投資全額回收；受邀進入投資人專屬資料室。",
                  subitems: [
                    "12. 5 年宏觀投資時程與 4.2 年回本",
                    "13. 策略合作方案與 Data Room 申請"
                  ]
                }
              ]
            },
            // Slide 01: 執行摘要
            {
              type: "hero-showcase",
              tag: "簡報 01 / 執行摘要與國家戰略定位",
              title: "破除 30% 自給率假象：搶佔全印首座高階 FPC 前製程「絕對真空」",
              desc: "專注 35%~40% 高毛利裸板製造，承接全球 China+1 歷史性產業轉移窗口，打造高壁壘、高現金流上市平台。",
              mainStat: { 
                label: "滿載年度營收規模", 
                val: `$${revAnnual}M`, 
                desc: `以每月 ${capMonthly} m² 產能與 $${weightedPrice}/m² 加權單價推算（鎖定 35%~40% 綜合毛利）。`,
                kpiSteps: [
                  { val: "15,000 m²", lbl: "月度滿載產能" },
                  { val: "38.5%", lbl: "綜合毛利率" },
                  { val: "$28.8M", lbl: "年化總產值" }
                ]
              },
              subStats: [
                { 
                  label: "投資人淨資本支出", 
                  val: `$${netCapEx}M`, 
                  tag: "SPECS 25% 現金返還", 
                  tagType: "tag-positive",
                  desc: `總預算 $${totCapEx}M 扣除 SPECS 25% 現金返還 ($${specsSub}M)。` 
                },
                { 
                  label: "息稅前利潤率 (EBIT)", 
                  val: `${ebitMarg}%`, 
                  tag: "年營業利潤 $6.66M", 
                  tagType: "tag-accent",
                  desc: `滿載年貢獻營業利潤達 $${(ebitMo*12/1000).toFixed(2)}M 美元。` 
                },
                { 
                  label: "靜態投資回收期", 
                  val: `${paybackYrs} 年`, 
                  tag: `無補貼為 ${paybackNoSub} 年`, 
                  tagType: "tag-positive",
                  desc: `含 SPECS 補貼 ${paybackYrs} 年回本（未含補貼為 ${paybackNoSub} 年）。` 
                },
                { 
                  label: "內部報酬率 (IRR)", 
                  val: irrRange, 
                  tag: "製造業基準: 12-15%", 
                  tagType: "tag-accent",
                  desc: "大幅超越傳統電子代工與製造業回報基準。" 
                }
              ]
            },
            // Slide 02: 市場痛點與雙軌對比
            {
              type: "vs-matrix",
              tag: "簡報 02 / 市場剛需與痛點破局",
              title: "0% 在地競爭真空 × 48 小時極速打樣：終結 3 週跨國斷鏈痛點",
              desc: "打通印度車載、國防與消費電子在地化供應動脈，重塑供應鏈響應時效，提升客戶 DVA 拿滿 PLI 增量補貼。",
              badHeader: "傳統海外進口三大死穴 🔴",
              badList: [
                { badge: "3~5 週", bar: "bad", text: "打樣跨國寄送與工程溝通週期冗長，拖垮客戶新品上市時效 (NPI)。" },
                { badge: "24%~46%", bar: "bad", text: "負擔關稅倒掛與昂貴空運，疊加 45~60 天在途安全庫存積壓現金流。" },
                { badge: "地緣斷鏈", bar: "bad", text: "供應鏈高度依賴外匯與地緣政治；組裝廠 DVA 停滯在 15~20% 面臨政策扣減。" }
              ],
              goodHeader: "Indo-Phoenix 在地化三大殺手鐧 🟢",
              goodList: [
                { badge: "48~72 小時", bar: "good", text: "印度在地快速工程打樣，3~5 天量產 JIT 廠邊直送。" },
                { badge: "0% 關稅", bar: "good", text: "基礎原料 100% 本地採購，享有 MOOWR 保稅與東協 FTA 免稅通道。" },
                { badge: "35%+ DVA", bar: "good", text: "直接提升客戶在地價值增值 (DVA)，助力客戶拿滿國家 PLI 增量補貼。" }
              ]
            },
            // Slide 03: 三大剛需賽道真實買家
            {
              type: "feature-cards-visual",
              tag: "簡報 03 / 三大剛需賽道與真實買家名冊",
              title: "訂單不是猜的，是點名的：手握數十億美元剛性採購池",
              desc: "對標 2026 印度 $1.06B~$1.30B FPC 市場，年需求超 3.5 億片剛性採購池。點選卡片查看買家洞察。",
              defaultExplanation: "下游巨頭為滿足政府國產化與 PLI 考核急需在地供應商，採購名單全部到位，我們是在挑選最高毛利的訂單。",
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 11v2"/><path d="M10 11v2"/><path d="M14 11v2"/></svg>`,
                  tag: "新能源儲能 CCS",
                  title: "EV 與電池 Pack CCS 採樣軟板",
                  desc: "全面替代傳統笨重採樣銅線束，提供 500-1500mm 超長厚銅 (2-12oz) 軟板。",
                  blueprintImg: "assets/samples/CCS-縮圖.jpg",
                  fullImg: "assets/samples/CCS-大圖.jpg",
                  blueprintLabel: "高清樣品圖：EV-BATTERY-CCS-PACK",
                  buyers: ["Tata AutoComp", "Waaree Energy", "Ola Electric", "Exide Energy", "Amara Raja"],
                  metrics: [
                    { val: "$25M~$35M", lbl: "TACO 單一巨頭進口額" },
                    { val: "90%+", lbl: "全印裸板目前依賴進口" }
                  ],
                  detail: "單一巨頭 TACO 年進口達 $25M~$35M。超長厚銅（2~12oz）耐溫軟板（-40°C~+125°C）全印 90%+ 依賴進口。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
                  tag: "車載 TIER-1",
                  title: "車載感測與 ADAS 車規級線束",
                  desc: "單車採用超 100 種 FPC。提供 IATF 16949 / AEC-Q 車規認證本土裸板與在地測試。",
                  blueprintImg: "assets/samples/Automotive-縮圖.jpg",
                  fullImg: "assets/samples/Automotive-大圖.jpg",
                  blueprintLabel: "高清樣品圖：AUTO-ADAS-SENSOR-FPC",
                  buyers: ["Samvardhana Motherson", "Bosch India", "Uno Minda", "Tata Motors", "Mahindra"],
                  metrics: [
                    { val: "$45M~$65M", lbl: "Motherson 年進口額" },
                    { val: "IATF 16949", lbl: "車規交鑰匙認證體系" }
                  ],
                  detail: "Motherson 年進口 $45M~$65M。Indo-Phoenix 提供全套 IATF 16949 / AEC-Q 車規認證本土裸板。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "國防相抵 5~7倍暴利",
                  title: "航太與國防軍規相抵 (Offset)",
                  desc: "DAP 2020 強制 30%-50% 本地採購相抵。軍用無人機與相控陣雷達嚴格排斥中國零件。",
                  blueprintImg: "assets/samples/Drone-縮圖.jpg",
                  fullImg: "assets/samples/Drone-大圖.jpg",
                  blueprintLabel: "高清樣品圖：AERO-DRONE-RIGIDFLEX",
                  buyers: ["Raphe mPhibr (獲投1.45億)", "ideaForge (市佔50%)", "TASL", "Adani Defence", "ISRO"],
                  metrics: [
                    { val: "5~7 倍", lbl: "通訊產品超額利潤倍數" },
                    { val: "IPC Class 3", lbl: "全印唯一軍規無中化實體" }
                  ],
                  detail: "DAP 2020 強制要求 30%~50% 在地採購；Indo-Phoenix 為全印唯一符合 IPC Class 3 / AS9100 實體，享有 5~7 倍超額利潤。"
                }
              ]
            },
            // Slide 04: 技術股 5 大護城河
            {
              type: "split-hero-matrix",
              tag: "簡報 04 / 技術股護城河與合資治理",
              title: "印度資本絕對控股 >90%：台灣技術團隊以 5% 讓利對賭 SpaceX 級良率",
              desc: "成熟量產體系毫無偏差整廠移植，打破國際材料配額封鎖與體系認證高牆。點選卡片查看邊界。",
              defaultExplanation: "大股東持有超過 90% 股權與實體資產，技術團隊用職業生涯對賭 90%+ 良率，這是利益極致捆綁的最優合資治理架構。",
              heroCard: {
                tag: "合資治理法理",
                title: "5% Sweat Equity 汗水股讓利",
                desc: "印方實業大股東持有 >90% 絕對控股權與資產處分權。台灣核心團隊全職離職簽訂競業對賭 90%+ 量產爬坡良率。",
                img: "assets/samples/equity_pie.png",
                imgLabel: "合資股權：>90% 控股 VS 5% 乾股",
                detail: "不拿現金、不搶控制權，印度實業家族持有合資公司 >90% 絕對控股權與資本主導權；技術團隊以良率爬坡為唯一對賭條件。"
              },
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
                  tag: "供應鏈通道",
                  title: "突破國際 Vendor Code 壁壘",
                  desc: "沿用數十年原廠信任基礎，取得杜邦 (DuPont)、台虹、松下高階材料配額與 30~60 天信用帳期。",
                  detail: "突破新廠現金 100% 預付與原廠配額封鎖，保障戰略物料不缺料、不斷供。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
                  tag: "整廠移植",
                  title: "Copy Exactly 精確工藝複製",
                  desc: "成熟機台參數、DES/VCP/黑孔化化學藥水配方零偏差輸出，直接壓縮 2 年試錯期。",
                  detail: "將台灣前五大上市基地經過驗證的製程參數標準化導入，杜絕印度新廠土法摸索之巨額損失。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
                  tag: "接單硬實力",
                  title: "全套國際體系認證接單能力",
                  desc: "輔導一次性通過 IATF 16949（車規）、AS9100（航太）、ISO 26262 及 IPC Class 3 認證。",
                  detail: "賦予工廠最高等級接單硬實力，無縫承接全球車廠與印度國防訂單。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "國防自主相抵",
                  title: "100% 國防無中化自主實體",
                  desc: "符合 DAP 2020 強制 30%-50% 本地採購相抵，獲取軍用無人機與雷達 5~7 倍超額利潤。",
                  detail: "印度國防無人機巨頭嚴格排斥中國零件，Indo-Phoenix 提供在地化 Class 3 剛撓結合板。"
                }
              ]
            },
            // Slide 05: Edge AI 智慧工廠壁壘
            {
              type: "split-hero-matrix",
              tag: "簡報 05 / 核心技術與 AI 智慧製造",
              title: "AI / ACC 智慧工廠體系：徹底免疫「人員流失、技術清零」魔咒",
              desc: "邊緣閉環毫秒補償與 AR 動態防呆，將數十年老師傅經驗固化為數位資產。點選卡片查看技術支柱。",
              defaultExplanation: "我們用 AI 演算法與硬體防呆接管了品質控制，讓精密製造不再依賴不可控的人工熟練度，實現良率自動自癒。",
              heroCard: {
                tag: "工廠工業大腦",
                title: "閉環邊緣 AI 智慧產線架構",
                desc: "邊緣運算晶片結合 LLM 專家知識庫，全面接管即時蝕刻補償、化學自動注藥與預測性防呆。",
                img: "assets/samples/ai_smart_factory.png",
                detail: "徹底打破印度新廠「人員流失、技術清零」的痛點，以硬體閉環與算法自適應替代不可靠的人工作業摸索。"
              },
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="10" x="7" y="7" rx="2"/></svg>`,
                  tag: "全製程溯源",
                  title: "Smart SFC 一板一碼",
                  desc: "每片軟板雷射微雕 QR Code，精準追蹤機台參數、化學槽歷史與 3D AOI 光學數據。",
                  detail: "3 秒內精確調取任一出廠軟板的完整生命週期與製程波動日誌，實現車規級 100% 溯源。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
                  tag: "毫秒閉環",
                  title: "50ms ACC 蝕刻自適應補償",
                  desc: "3D AOI 微米級捕捉線寬偏移，50 毫秒內自動向伺服傳動發送調速補償指令，杜絕批量報廢。",
                  detail: "微米級即時補償，把傳統軟板容易因人工作業導致的過蝕、貼合偏移降至最低。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M2 12h20"/><path d="M20 12v8H4v-8"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/></svg>`,
                  tag: "動態防呆",
                  title: "AR 智慧眼鏡與動態 SOP",
                  desc: "作業員配戴 AR 眼鏡進行 Poka-yoke 視覺防呆指引，人員培訓週期由 2 週大幅壓縮至 4 小時。",
                  detail: "即便面對印度基層人員高流動性，產線作業仍能維持零差錯、標準化執行。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12 2.1 10.5"/></svg>`,
                  tag: "數位資產",
                  title: "工業專家大腦 (LLM / RAG)",
                  desc: "每一次排障經驗即時轉化為可對話的工業專家庫，工藝資產 100% 在地留存。",
                  detail: "工廠知識永久沉澱在系統大腦中，徹底打破「工程師一走、工廠癱瘓」的魔咒。"
                }
              ]
            },
            // Slide 06: 廠房基建規劃與 SPCB 環保壁壘
            {
              type: "split-hero-matrix",
              tag: "簡報 06 / 廠房基建規劃與 SPCB 環保壁壘",
              title: `13,000 m² 專業重工廠房：3 倍標準 ZLD 築起印度最高環評門檻`,
              desc: "重工業級濕製程、防微震微盲孔鑽孔及符合印度 SPCB 零液體排放 (ZLD) 環保法規的現代化空間佈局。",
              defaultExplanation: "在印度，環評牌照就是最大的特許經營權；3,000 平方米的零排放系統是我們合法持續量產的終極防禦工事。",
              heroCard: {
                tag: "最高環評特許",
                title: "13,000 m² 現代化重工廠房",
                desc: "配備 3 倍標準 ZLD 零液體排放、+40% HVAC 暖通冗餘及獨立隔震深地基，全印唯一合規綠色重工基地。",
                img: "assets/samples/facility_zld.png",
                detail: "在印度，環評牌照就是最大的特許經營權；3,000 平方米的零排放系統是我們合法持續量產的終極防禦工事。"
              },
              cards: [
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>`,
                  tag: "4,500 M² / FRP 防腐",
                  title: "濕製程電鍍蝕刻區 (VCP/DES)",
                  desc: "VCP 垂直連續電鍍、DES 連續蝕刻線與酸霧洗滌塔，全區鋪設 FRP 重防腐耐酸鹼地坪。",
                  detail: "採用重防腐玻璃鋼 (FRP) 防護地坪，配備多級負壓酸霧洗滌塔，確保順利通過 SPCB 紅色重污染審查。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
                  tag: "3,500 M² / 萬級無塵",
                  title: "黃光乾製程 (+40% HVAC)",
                  desc: "LDI 雷射直接成像與真空壓合，配置 +40% HVAC 暖通空調專門克服印度 45°C+ 極端高溫。",
                  detail: "恆溫恆濕嚴格受控（21±1°C, 55±5% RH），確保 25μm 超微細線路曝光精度不衰減。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
                  tag: "2,000 M² / 3D AOI",
                  title: "SMT、雷射鑽孔與檢測中心",
                  desc: "高速 SMT 貼片、飛針測試，雷射微盲孔專區採用獨立隔震深地基，隔絕重工震動干擾。",
                  detail: "配置離子污染度檢測與金相切片實驗室，執行航太與車規級 100% 零缺陷出廠門禁。"
                },
                {
                  iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
                  tag: "3,000 M² / 恆溫儲備",
                  title: "低溫精密材料倉與戰略緩衝",
                  desc: "冷藏室 2-10°C 儲存杜邦 FCCL 基材，常態備置 45-60 天安全庫存，消除斷鏈風險。",
                  detail: "常態備置 45-60 天印度在地戰略安全庫存，徹底消除國際海空運物流斷鏈風險。"
                }
              ]
            },
            // Slide 07: 模組 1 產銷架構環形圖與產品規格卡
            {
              type: "product-mix-visual",
              tag: "簡報 07 / 模組一：產能規劃與產品營收架構",
              title: "模組 1：高密度產品組合與年化 $28.8M 營收架構",
              desc: `滿載規劃為月產能 ${capMonthly} m²（年產能 180,000 m²），加權平均售價 $${weightedPrice}/m²。點選產品可查看深度應用。`,
              totalVolume: `${capMonthly} m²`,
              weightedPrice: `$${weightedPrice} / m²`,
              annualRunRate: `$${revAnnual}M`,
              defaultExplanation: "涵蓋 1L 至 3L+ 多層高精密軟板，聚焦車載電池 CCS、國防航太雷達與摺疊終端，採雙班制連續滿載生產。",
              products: [
                {
                  name: "單面板 FPC (1L)",
                  pct: "40.0%",
                  volume: "6,000 m²/月",
                  asp: "$120 / m²",
                  revMo: "$720,000",
                  revYr: "$8.64M",
                  color: "#38bdf8",
                  pills: ["📱 智慧手機 / 平板", "⌚ 穿戴設備", "🖥️ 車載中控觸控"],
                  detail: "單層高柔軟度 FPC 軟板。主要應用於車載標準感知器、中控觸控螢幕及智慧終端，具備極高性價比與放量速度。"
                },
                {
                  name: "雙面板 FPC (2L)",
                  pct: "50.0%",
                  volume: "7,500 m²/月",
                  asp: "$170 / m²",
                  revMo: "$1,275,000",
                  revYr: "$15.30M",
                  color: "var(--accent)",
                  pills: ["🔋 EV 動力電池 CCS", "⚡ BMS 電控", "🚗 車載座艙雷達"],
                  detail: "雙面 PTH 貫孔軟板。為產能黃金主力，深度鎖定電動車 (EV) 電池管理系統 CCS 整合模組 (Waaree 儲能專案) 及車載主線束。"
                },
                {
                  name: "多層板 / 剛撓結合 (3L+)",
                  pct: "10.0%",
                  volume: "1,500 m²/月",
                  asp: "$270 / m²",
                  revMo: "$405,000",
                  revYr: "$4.86M",
                  color: "#a855f7",
                  pills: ["🛸 軍用無人機飛控", "📡 相控陣雷達", "🛰️ 航太衛星通信"],
                  detail: "多層高密度互連 (HDI) 軟硬結合板。專供軍工主動相控陣雷達信號處理、飛彈導引頭以及醫療高清內視鏡等頂級戰略領域。"
                }
              ]
            },
            // Slide 08: 模組 2 廠房空間分區標準
            {
              type: "space-matrix-visual",
              tag: "簡報 08 / 模組二：廠房空間分區標準與規範",
              title: `模組 2：13,000 m² 空間工程標準規劃（對比昆山 9,700 m²）`,
              desc: `總建築面積 ${totalArea} m²（較昆山參考廠房擴增 +34% 在地特化冗餘），高標準滿足重工業級濕製程與零污染防線。`,
              defaultExplanation: "13,000 m² 總佔地佈局，包含 3 倍 ZLD 零排放環保佔地與 +40% HVAC 暖通冗餘，專為印度高溫與法規特化設計。",
              kpiSummary: {
                totalArea: `${totalArea} m²`,
                kunshanRef: "9,700 m²",
                redundancy: "+34% 特化冗餘",
                zldArea: "3,000 m² (昆山 3 倍)"
              },
              spaces: [
                {
                  title: `${cleanroomCls === "1K" ? "千級" : cleanroomCls === "10K" ? "萬級" : cleanroomCls}無塵黃光區`,
                  kunshan: "1,200 m²",
                  india: "1,500 m²",
                  std: `${cleanroomCls === "1K" ? "千級" : cleanroomCls === "10K" ? "萬級" : cleanroomCls}無塵室 (Class ${cleanroomCls}) / 22±2°C / 濕度 55±5%`,
                  equip: "LDI 雷射直接成像、乾膜真空壓膜機",
                  infra: "印度環境溫度高，需增加 +40% 暖通空調 (HVAC) 冗餘容量制冷",
                  detail: "配置 +40% HVAC 暖通冗餘空調制冷能力，嚴格受控（21±1°C, 55±5% RH），確保 25μm 微細線路曝光精度不衰減。"
                },
                {
                  title: "濕製程化學區",
                  kunshan: "4,000 m²",
                  india: "4,500 m²",
                  std: "FRP 防酸地坪、專用排氣洗滌塔",
                  equip: "VCP 垂直連續電鍍、DES 連續蝕刻線",
                  infra: "需取得當地污染控制局 (SPCB) CTE/CTO 紅色最高等級環評許可",
                  detail: "採用重防腐玻璃鋼 (FRP) 防護地坪與多級負壓酸霧洗滌塔，100% 滿足印度 SPCB 紅色最高污染級別審批。"
                },
                {
                  title: "鑽孔與真空壓合區",
                  kunshan: "1,500 m²",
                  india: "2,000 m²",
                  std: "樓板載重 1.5 噸/m²、獨立隔震地基",
                  equip: "雷射微盲孔鑽孔機、高精度真空熱壓合",
                  infra: "微盲孔雷射鑽孔需具備微震隔離功能之獨立深地基座",
                  detail: "獨立隔震深地基設計，徹底隔絕外部重工微震動對雷射微盲孔加工良率的干擾。"
                },
                {
                  title: "低溫原料與戰略緩衝倉",
                  kunshan: "1,500 m²",
                  india: "2,000 m²",
                  std: "冷藏室 2-10°C、嚴格溫濕度控制",
                  equip: "杜邦 FCCL 軟性銅箔基板、覆蓋膜儲存",
                  infra: "印度在地常態安全庫存天數 45-60 天（昆山僅 7-14 天），消除斷鏈風險",
                  detail: "常態備置 45-60 天印度在地戰略安全庫存，徹底消除國際海空運及海關物流斷鏈風險。"
                },
                {
                  title: "廢水與環保 ZLD 設施",
                  kunshan: "1,500 m²",
                  india: "3,000 m²",
                  std: "廢水零排放 (ZLD) 法定強制要求",
                  equip: "MVR 機械蒸汽再蒸發器、多級逆滲透 RO",
                  infra: "佔地面積為昆山 3 倍，為符合印度綠色法規之法定強制必備設施",
                  detail: "佔地 3,000 m² 達到傳統 3 倍規格，化學與重金屬廢水 100% 廠內循環回用，零液體排出。"
                }
              ]
            },
            // Slide 09: 模組 3 CapEx 資本支出比較與 SPECS 補貼駕駛艙
            {
              type: "capex-cockpit-visual",
              tag: "簡報 09 / 模組三：資本支出與 SPECS 政府補貼",
              title: `模組 3：建廠總 CapEx $${totCapEx}M 搭配 25% 現金補貼`,
              desc: `透過 SPECS 25% 現金補貼直接將淨曝險降至 $${netCapEx}M。台方團隊把控核心原廠機台驗收與工程責任邊界。`,
              defaultExplanation: "SPECS 25% 現金返還嚴格適用於機器設備與廠房資產。扣除補貼後投資人淨資本支出僅為 $17.25M。",
              kpiSummary: {
                totalBudget: `$${totCapEx}M 總預算`,
                kunshanRef: "$18.5M 昆山參考",
                specsRefund: `-$${specsSub}M (25% 現金返還)`,
                netInvestment: `$${netCapEx}M 淨資本支出`
              },
              items: [
                {
                  title: "核心生產與測試設備",
                  pct: "71.7%",
                  kunshan: "$15,000,000",
                  india: "$16,500,000",
                  subsidy: "-$4,125,000",
                  net: "$12,375,000",
                  boundary: "直接供應商代碼支援 (杜邦、台虹、松下)。透過 CEC 綠色通道於原廠進行機台驗證與技術封裝。",
                  detail: "直接供應商代碼支援 (杜邦、台虹、松下)。透過 CEC 綠色通道於原廠進行機台驗證與技術封裝。"
                },
                {
                  title: "廠房與環保 (ZLD) 設施",
                  pct: "15.2%",
                  kunshan: "$1,000,000",
                  india: "$3,500,000",
                  subsidy: "-$875,000",
                  net: "$2,625,000",
                  boundary: "制定設計規範與水處理化學品標準。實際在地工程及 CTE/CTO (建照/營運同意書) 由發起人負責。",
                  detail: "制定設計規範、水處理化學品投入。實際在地工程及 CTE/CTO (建照/營運同意書) 由發起人全權負責。"
                },
                {
                  title: "廠房建築與無塵室工程",
                  pct: "13.0%",
                  kunshan: "$2,500,000",
                  india: "$3,000,000",
                  subsidy: "-$750,000",
                  net: "$2,250,000",
                  boundary: "輸出廠房佈局、千級無塵室潔淨度與暖通空調 (HVAC) 濕度規範。實際土建工程由發起人負責。",
                  detail: "輸出廠房佈局、千級/萬級無塵室潔淨度與暖通空調 (HVAC) 濕度規範。實際土建工程由發起人負責。"
                },
                {
                  title: "建廠總資本支出合計",
                  pct: "100.0%",
                  kunshan: "$18,500,000",
                  india: "$23,000,000",
                  subsidy: "-$5,750,000",
                  net: "$17,250,000",
                  boundary: "SPECS 25% 官方現金補貼提供堅不可摧的 575 萬美元安全邊際，極大化投資人下行保護。",
                  detail: "SPECS 25% 官方現金補貼提供堅不可摧的 575 萬美元資本安全邊際，極大化投資人下行保護。"
                }
              ]
            },
            // Slide 10: 模組 4 OpEx 成本結構駕駛艙
            {
              type: "opex-cockpit-visual",
              tag: "簡報 10 / 模組四：單月營運成本結構",
              title: `模組 4：動態單月營運成本結構 ($${opexMo}M / 月)`,
              desc: `變動成本佔比高達 68.97% ($1.27M/月)，具備極強抗景氣循環韌性。點選成本項目查看洞察。`,
              defaultExplanation: "單月總營運成本為 184.5 萬美元（年化 2,214 萬美元）。折舊佔比僅 13.6%，產能放量獲利爆發力強。",
              kpiSummary: {
                totalOpex: `$${opexMo}M / 月`,
                kunshanRef: "$1.38M / 月",
                variableRatio: "68.97% ($1.27M 變動成本)",
                fixedRatio: "31.03% ($572K 固定成本)"
              },
              costs: [
                {
                  title: "直接原料與化學耗材",
                  kunshan: "$600,000",
                  india: "$900,000",
                  pct: "48.8%",
                  varPct: "100.00%",
                  varAmt: "$900,000",
                  fixAmt: "$0",
                  sub: "FCCL 銅箔基板、覆蓋膜、銅陽極及電鍍化學耗材。",
                  detail: "100% 變動成本。採用台印雙軌供應鏈（台灣核心膜材 + 印度本地基礎酸鹼），保證成本競爭力與供料安全。"
                },
                {
                  title: "生產與台印專家人工 (30人)",
                  kunshan: "$450,000",
                  india: "$430,000",
                  pct: "23.3%",
                  varPct: "40.00%",
                  varAmt: "$172,000",
                  fixAmt: "$258,000",
                  sub: "30 位台籍資深製程專家與在地高階技術工程師及作業員。",
                  detail: "固定核心工程管理薪資 ($258K) 結合隨班次彈性調度之生產人力 ($172K)，實現單位人效最大化。"
                },
                {
                  title: "製造水電與動力能耗",
                  kunshan: "$150,000",
                  india: "$265,000",
                  pct: "14.4%",
                  varPct: "75.69%",
                  varAmt: "$200,579",
                  fixAmt: "$64,422",
                  sub: "高功率暖通空調制冷、無塵室空氣過濾循環及水回收能耗。",
                  detail: "75.7% 為生產運轉變動用電，透過工業園區專屬變電站合約鎖定最優惠階梯電價。"
                },
                {
                  title: "固定資產直線法折舊",
                  kunshan: "$180,000",
                  india: "$250,000",
                  pct: "13.6%",
                  varPct: "0.00%",
                  varAmt: "$0",
                  fixAmt: "$250,000",
                  sub: "生產線設備與廠房基礎設施 10 年直線法折舊攤提。",
                  detail: "非現金固定折舊攤提。13.6% 的低佔比使工廠在景氣低谷期仍能維持充沛的經營現金流。"
                },
                {
                  title: "單月總營運成本合計",
                  kunshan: "$1,380,000",
                  india: "$1,845,000",
                  pct: "100.0%",
                  varPct: "68.97%",
                  varAmt: "$1,272,579",
                  fixAmt: "$572,422",
                  sub: "高達 68.97% 的變動成本結構賦予工廠極強的抗景氣循環避險韌性。",
                  detail: "高變動成本緩衝 ($1.27M/月) 讓工廠即使在需求波谷也能隨產量即時壓縮燒錢速度，絕不產生巨額虧損。"
                }
              ]
            },
            // Slide 11: 模組 5 旗艦損益兩平駕駛艙
            {
              type: "bep-master-cockpit",
              tag: "簡報 11 / 模組五：獲利能力與損益平衡分析",
              title: `模組 5：損益兩平點 ${bepUtil}% · 安全邊際極高`,
              desc: `單月營收達 $${bepRev}M 美元（稼動率 ${(getLiveStat("bep",50.8)*150).toFixed(0)} m²/月）即跨入淨獲利階段。點選卡片可切換深度說明。`,
              bepVal: `${bepUtil}%`,
              thresholdRevMo: `$${bepRev}M`,
              thresholdRevYr: `$${(bepRev * 12).toFixed(2)}M`,
              defaultExplanation: "包含原料、人工、電力水資源及直線法折舊。產能稼動率只要超過 50.8%，即刻產生充沛淨現金流。",
              metricsTable: [
                {
                  metric: "目標營業收入",
                  monthly: "$2,400,000",
                  annual: "$28,800,000",
                  margin: "100.0%",
                  bench: "在每月 15,000 m² 滿載運營下，加權平均價格為 160 美元/m²。"
                },
                {
                  metric: "單月營運成本 (OpEx)",
                  monthly: "$1,845,000",
                  annual: "$22,140,000",
                  margin: "76.9%",
                  bench: "包含原料、人工、電力、水資源及直線法資產折舊。"
                },
                {
                  metric: "營業利潤 (EBIT)",
                  monthly: "$555,000",
                  annual: "$6,660,000",
                  margin: "23.1%",
                  bench: "23.1% 的息稅前利潤率 (EBIT Margin) 顯示滿載時具有極佳的規模獲利能力。"
                },
                {
                  metric: "損益兩平點 (BEP)",
                  monthly: "$1,218,543",
                  annual: "$14,622,516",
                  margin: "50.8%",
                  bench: "當月營收達到 122 萬美元時，工廠即跨入動態淨獲利階段。"
                },
                {
                  metric: "內部報酬率 (IRR)",
                  monthly: "--",
                  annual: "--",
                  margin: "21.3% ~ 24.8%",
                  bench: "遠超標準電子製造業基準 (12-15%)，極具吸引力。"
                },
                {
                  metric: "靜態投資回收期",
                  monthly: "--",
                  annual: "--",
                  margin: "4.2 年",
                  bench: "假設已取得 SPECS 25% 資本支出補貼 ($5.75M)。若無補貼，回收期為 5.2 年。"
                }
              ],
              cards: [
                {
                  label: "目標營業收入",
                  val: `$${(getLiveStat("monthlyRevenue",2400000)/1000000).toFixed(1)}M`,
                  sub: `年化營收：$${((getLiveStat("monthlyRevenue",2400000)*12)/1000000).toFixed(1)}M`,
                  detail: "在每月 15,000 平方公尺滿載運營下，加權平均價格為 160 美元/平方公尺。代表雙班制連續生產下的總產值規模。"
                },
                {
                  label: "營業利潤 (EBIT)",
                  val: `$${ebitMo}K`,
                  sub: `${ebitMarg}% 利潤率（年化 $${(ebitMo*12/1000).toFixed(2)}M）`,
                  detail: "23.1% 的息稅前利潤率 (EBIT Margin)，滿載時年化息稅前利潤達 666 萬美元，展現卓越的規模獲利優勢。"
                },
                {
                  label: "損益平衡稼動率",
                  val: `${bepUtil}%`,
                  sub: `單月門檻：$${bepRev}M`,
                  detail: "工廠僅需每月 122 萬美元營收（稼動率 50.8%）即跨越損益平衡點。此為現代高資本化濕製程電子工廠的頂尖水準。"
                },
                {
                  label: "內部報酬率 (IRR)",
                  val: irrRange,
                  sub: "製造業基準：12% - 15%",
                  detail: "預估內部報酬率介於 21.3% ~ 24.8%。遠超過標準電子製造業基準，對於戰略國防與高科技投資基金極具超額回報吸引力。"
                },
                {
                  label: "靜態投資回收期",
                  val: `${paybackYrs} 年`,
                  sub: `未計 SPECS 補貼：${paybackNoSub} 年`,
                  detail: "在取得 SPECS 25% 資本支出現金返還補貼 ($5.75M) 條件下，靜態回收期大幅縮短至 4.2 年（無補貼時為 5.2 年）。"
                }
              ]
            },
            // Slide 12: 雙曲線剪刀差財務與時程交叉模型（動態真實數據連動）
            {
              type: "flow-pipeline",
              tag: "簡報 12 / 5 年投資全額回收與宏觀財務時程模型",
              title: "5 年宏觀投資時程：以貿促工 ✕ 本地製造 ✕ 4.2 年全額回本",
              desc: "首期透過代銷貿易產生現金流，第 1 年轉本土製造，第 4.2 年累積淨利全額抵消 $17.25M 總投資，邁向純淨利爆發！",
              defaultExplanation: "5 年投資全額回收藍圖：累積營運淨現金流自第 1 年本土投產後快速爬坡，於第 4.2 年累積達到 $17.25M，正式超越累積建廠總資本支出，實現 100% 投資全額靜態回收！",
              orangeLabel: "累積資本支出",
              greenLabel: "累積淨現金流",
              timelineLabel: "5 年戰略投資全景時間軸",
              disclaimer: "📌 註：4.2 年回本期係基於取得印度 SPECS 25% 資本補貼 ($5.75M) 之測算結果；無補貼時基準回收期為 5.2 年。實際核准依主管機關審查為準。",
              liveStats: {
                totCapEx: `$${totCapEx}M`,
                netCapEx: `$${netCapEx}M`,
                ebitAnnual: `$${(ebitMo * 12 / 1000).toFixed(2)}M`,
                paybackYrs: `${paybackYrs} 年`,
                cCapEx: Number(netCapEx) || 17.25,
                annualEbit: Number((ebitMo * 12 / 1000).toFixed(2)) || 6.66
              },
              orangeNodes: [
                {
                  title: "公司設立與注資",
                  metric: "SPCB CTE 環評送件",
                  detail: `印度發起人主導 JV 公司設立、土地廠房租賃、首期股權注資到位 (總 CapEx $${totCapEx}M / 淨 CapEx $${netCapEx}M)，並遞交 SPCB CTE 環評申請。`
                },
                {
                  title: "潔淨室竣工 ✕ CTO 取證",
                  metric: "CapEx $17.25M 封頂",
                  detail: "萬級無塵室竣工，原廠設備完成進場驗收，取得 SPCB CTO 正式排污許可證，資本開銷正式結束封頂。"
                },
                {
                  title: "全廠雙班制滿載運轉",
                  metric: "年產能 180,000 m²",
                  detail: "連續化滿載運轉，年營收達 $28.8M，年產生 $6.66M 營業淨利潤 (EBIT)，自我造血能力極強。"
                },
                {
                  title: "🎯 100% 投資全額回收",
                  metric: "回本黃金交叉點",
                  detail: "累積營運淨現金流達到 $17.25M，正式全額抵消初期淨資本支出，達成 100% 靜態投資全額回收！"
                },
                {
                  title: "二期擴建與股東分紅",
                  metric: "股權超額複利回報",
                  detail: "累積現金流突破 $22.5M，啟動二期高階剛撓結合板擴產評估，實現股東高額現金分紅與資本增值。"
                }
              ],
              greenNodes: [
                {
                  title: "啟動代銷貿易",
                  metric: "即時現金流切入",
                  detail: "依託成熟供應鏈優勢供貨，以貿易代銷先行跑通市場，預先建立印度終端客戶代碼 (Vendor Code) 與 48h 極速打樣。"
                },
                {
                  title: "轉 100% 本土自主製造",
                  metric: "訂單零延遲原地轉化",
                  detail: "無塵室取證通線，將既有進口代銷訂單 100% 無縫切換為印度本土製造，正式邁向高毛利本土量產。"
                },
                {
                  title: "高現金流營運引擎",
                  metric: "每年淨流入 +$6.66M",
                  detail: "工廠常態化獨立自主運轉，年化 EBIT 達 666 萬美元 (23.1% 利潤率)，成為高回報的自我造血現金引擎。"
                },
                {
                  title: "全額回本淨盈餘衝刺",
                  metric: "累積盈餘 > $17.25M",
                  detail: "累積賺進來的淨現金流超越所有建廠本金，公司正式進入零負擔的純利潤高速滾動增長階段！"
                },
                {
                  title: "全印軟板龍頭霸主",
                  metric: "累積現金 > $22.5M",
                  detail: "穩居全印度第一大本土 FPC 龍頭，全面主導車規電池包 CCS、國防航太與高階消費電子供應鏈。"
                }
              ],
            },
            // Slide 13: 策略合作與 Data Room
            {
              type: "cta-hub",
              tag: "簡報 13 / 策略合作方案與 AI 智能資料室",
              title: "將您的資本，佈局在印度國防與高階電子供應鏈的最起點",
              desc: "印度實業大股東絕對控股 >90%、政府政策全力護航；歡迎進入 Google AI 智能資料室深入調研，或與創始團隊直接預約商務對話。",
              notebookUrl: "https://notebook.google.com/notebook/be750388-f5f2-4027-9f85-f45f61c53ba7",
              formTitle: "創始團隊直通留言通道",
              formSubtitle: "預約實體商務會談或現場考察，所有留言將安全記錄至專案資料庫。",
              aiTitle: "官方 AI 智能資料室 (NotebookLM)",
              aiBadge: "已收錄 23 份市場研報與技術智庫",
              aiDesc: "整合全印度高階電子與國防市場研報、一級目標買家 KYC 名冊，以及台灣技術團隊核心交付職能（化學配方、產線設備、廠房設計與 AI SFC 系統）。",
              aiNotice: "需登入 Google 帳號（個人 Gmail 或 Workspace 均可），具備唯讀互動問答與音訊播客功能。",
              aiBtn: "開啟官方 AI 智能資料室",
              submitBtn: "送出商務會談意向",
              agendaBtn: "返回路演全息目錄",
              landingBtn: "返回主題門戶首頁"
            }
          ]
        }
      };
    }
