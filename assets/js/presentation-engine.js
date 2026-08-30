// Presentation Dynamic Engine & Interactive Controllers
let currentTheme = "a";
    let currentLang = "en";
    let currentSlide = 0;
    let slideDirection = "next";
    let isTransitioning = false;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("theme")) currentTheme = urlParams.get("theme").toLowerCase();
    if (urlParams.get("lang")) currentLang = urlParams.get("lang").toLowerCase();

    function setLang(lang) {
      currentLang = lang;
      document.documentElement.lang = lang;
      localStorage.setItem("ipx-lang", lang);
      document.getElementById("btn-lang-en").classList.toggle("active", lang === "en");
      document.getElementById("btn-lang-zh").classList.toggle("active", lang === "zh");
      
      // Update exit landing page link
      document.getElementById("btnExitLanding").href = `template-${currentTheme}.html`;

      const dict = getI18NDeck()[lang];
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
      });

      renderSlide(false);
    }

    /* ═══════════════════════════════════════════════════════════════
       MASTER RENDER ENGINE (DYNAMIC ARCHETYPES PER SLIDE)
       ═══════════════════════════════════════════════════════════════ */
    function renderSlide(animate = true) {
      const slides = getI18NDeck()[currentLang].slides;
      const slide = slides[currentSlide];
      const container = document.getElementById("slideContent");
      
      const pageNumStr = currentSlide === 0 
        ? (currentLang === "zh" ? "目錄導航" : "AGENDA") 
        : `${currentSlide} / ${slides.length - 1}`;

      let html = `
        <div class="slide-meta">
          <div class="slide-tag">${slide.tag}</div>
          <div class="slide-page-num">${pageNumStr}</div>
        </div>
        <h1 class="slide-title gs-anim-title">${slide.title}</h1>
        <p class="slide-desc gs-anim-desc">${slide.desc}</p>
      `;

      // 0. Master Roadshow Agenda Navigator (Slide 00)
      if (slide.type === "agenda-master-visual") {
        html += `
          <div class="agenda-matrix-grid">
            ${slide.acts.map((act, idx) => `
              <div class="agenda-act-card gs-anim-card" onclick="jumpToSlide(${act.targetSlide})">
                <div>
                  <div class="agenda-act-head">
                    <span class="agenda-act-badge">${act.actNum} · ${act.badge}</span>
                    <span class="agenda-act-pages">${act.pages} ➔</span>
                  </div>
                  <div class="agenda-act-title">${act.title}</div>
                  <div class="agenda-act-desc">${act.desc}</div>
                </div>
                <div class="agenda-act-subitems">
                  ${act.subitems.map(sub => `
                    <div class="agenda-subitem">
                      <span class="agenda-subitem-dot"></span>
                      <span>${sub}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">🗺️</div>
            <div class="floating-bar-text">
              <strong>${currentLang === 'zh' ? '全息導航提示' : 'Executive Navigation'}:</strong> ${currentLang === 'zh' ? '點擊任一幕劇卡片可直接跳轉至對應核心章節；在任何頁面隨時點擊頂部「☰ 快速目錄」即可返回此頁。' : 'Click any Act card to jump directly to that module. Click [☰ AGENDA] in the top navigation at any time to return here.'}
            </div>
          </div>
        `;
      }
      // 1. Hero Showcase
      else if (slide.type === "hero-showcase") {
        html += `
          <div class="hero-metric-box">
            <div class="main-anchor-stat gs-anim-hero">
              <div>
                <div class="main-stat-label">${slide.mainStat.label}</div>
                <div class="main-stat-num count-target" data-target="${slide.mainStat.val}">0</div>
                <div class="main-stat-desc">${slide.mainStat.desc}</div>
              </div>
              ${slide.mainStat.kpiSteps ? `
                <div class="mini-kpi-pathway">
                  ${slide.mainStat.kpiSteps.map((step, idx) => `
                    <div class="kpi-step">
                      <span class="kpi-step-val">${step.val}</span>
                      <span class="kpi-step-lbl">${step.lbl}</span>
                    </div>
                    ${idx < slide.mainStat.kpiSteps.length - 1 ? '<span class="kpi-arrow">➔</span>' : ''}
                  `).join("")}
                </div>
              ` : ''}
            </div>
            <div class="sub-stat-grid">
              ${slide.subStats.map(s => `
                <div class="stat-card gs-anim-card">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div class="stat-card-label">${s.label}</div>
                    ${s.tag ? `<span class="stat-benchmark-tag ${s.tagType || 'tag-accent'}">${s.tag}</span>` : ''}
                  </div>
                  <div class="stat-card-value count-target" data-target="${s.val}">0</div>
                  <div class="stat-card-desc">${s.desc}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
      // 2. Product Mix Visual Donut & Spec Architecture (Slide 2)
      else if (slide.type === "product-mix-visual") {
        html += `
          <div class="product-mix-grid">
            <!-- Left: Donut Breakdown Hero Card -->
            <div class="donut-hero-card gs-anim-card">
              <div class="donut-card-header">
                <div class="slide-tag" style="font-size:10px; margin:0;">PRODUCT CAPACITY MIX</div>
                <div style="font-family:var(--font-mono); font-size:11px; color:var(--ink-sub);">
                  ${currentLang === 'zh' ? '加權均價' : 'Weighted ASP'}: <strong style="color:var(--accent);">${slide.weightedPrice}</strong>
                </div>
              </div>

              <div class="donut-circle-wrap">
                <svg class="donut-svg" viewBox="0 0 100 100">
                  <circle class="donut-bg" cx="50" cy="50" r="42"></circle>
                  <!-- 1L: 40% (offset 0), 2L: 50% (offset 40), 3L+: 10% (offset 90), Perimeter = 2 * PI * 42 = 263.89 -->
                  <circle class="donut-segment" id="donutSeg_0" cx="50" cy="50" r="42" stroke="#38bdf8" stroke-dasharray="105.5 263.9" stroke-dashoffset="0"></circle>
                  <circle class="donut-segment" id="donutSeg_1" cx="50" cy="50" r="42" stroke="var(--accent)" stroke-dasharray="131.9 263.9" stroke-dashoffset="-105.5"></circle>
                  <circle class="donut-segment" id="donutSeg_2" cx="50" cy="50" r="42" stroke="#a855f7" stroke-dasharray="26.4 263.9" stroke-dashoffset="-237.4"></circle>
                </svg>
                <div class="donut-center-text">
                  <div class="donut-center-val count-target" data-target="${slide.totalVolume}">0</div>
                  <div class="donut-center-lbl">MONTHLY M²</div>
                </div>
              </div>

              <!-- Interactive Dynamic Detail Dock (Left Bottom) -->
              <div class="donut-insight-dock" id="donutInsightDock">
                <div class="dock-tag" id="donutDockTag">💎 ${slide.products[1].name}</div>
                <div class="dock-desc" id="donutDockDesc">${slide.products[1].detail}</div>
              </div>
            </div>

            <!-- Right: 3 Interactive Product Specification Tiles (Clean, Zero-Obtrusive Tooltip) -->
            <div class="product-spec-grid">
              ${slide.products.map((p, idx) => `
                <div class="product-spec-card gs-anim-card ${idx === 1 ? 'active' : ''}" 
                     id="prodCard_${idx}" 
                     onclick="highlightProductMix(${idx}, '${p.name.replace(/'/g, "\\'")}', '${p.detail.replace(/'/g, "\\'")}')"
                     onmouseenter="highlightProductMix(${idx}, '${p.name.replace(/'/g, "\\'")}', '${p.detail.replace(/'/g, "\\'")}')">
                  <div class="product-spec-top-row">
                    <div class="spec-title-col">
                      <div class="spec-dot" style="background:${p.color}; box-shadow:0 0 10px ${p.color};"></div>
                      <div>
                        <div class="spec-name">${p.name}</div>
                        <div class="spec-pct">${p.pct} ${currentLang === 'zh' ? '產能佔比' : 'Capacity Share'}</div>
                      </div>
                    </div>
                    <div>
                      <div class="spec-val-num">${p.volume}</div>
                      <div class="spec-val-sub">${currentLang === 'zh' ? '月產量' : 'Monthly Volume'}</div>
                    </div>
                    <div>
                      <div class="spec-val-num" style="color:var(--accent);">${p.asp}</div>
                      <div class="spec-val-sub">${currentLang === 'zh' ? '基準單價 ASP' : 'Benchmark ASP'}</div>
                    </div>
                    <div>
                      <div class="spec-val-num" style="color:var(--ink);">${p.revYr}</div>
                      <div class="spec-val-sub">${currentLang === 'zh' ? '年化預估營收' : 'Annual Run-Rate'}</div>
                    </div>
                  </div>

                  ${p.pills ? `
                    <div class="product-pills-row">
                      ${p.pills.map(pill => `
                        <span class="product-app-pill">${pill}</span>
                      `).join("")}
                    </div>
                  ` : ''}
                </div>
              `).join("")}
            </div>
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">💎</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '技術與應用依據' : 'Technical & Market Insight'}:</strong> ${slide.products[1].detail}
            </div>
          </div>
        `;
      }

      // 3. Space Allocation Area Matrix Tiles (Slide 8 Overhaul - High-Density Engineering Table)
      else if (slide.type === "space-matrix-visual") {
        html += `
          <div class="space-cockpit-container">
            <!-- Top KPI Ribbon -->
            ${slide.kpiSummary ? `
              <div class="space-kpi-ribbon">
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '印度總規劃面積' : 'India Total Built-Up'}</span>
                  <span class="space-kpi-val">${slide.kpiSummary.totalArea}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '昆山參考面積' : 'Kunshan Ref Area'}</span>
                  <span class="space-kpi-val" style="color:var(--ink-sub);">${slide.kpiSummary.kunshanRef}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '在地化特化擴增' : 'Localization Redundancy'}</span>
                  <span class="space-kpi-val" style="color:#34d399;">${slide.kpiSummary.redundancy}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? 'ZLD 零排放環評專區' : 'ZLD Environmental Area'}</span>
                  <span class="space-kpi-val" style="color:var(--accent);">${slide.kpiSummary.zldArea}</span>
                </div>
              </div>
            ` : ''}

            <!-- 5 Detailed Engineering Rows -->
            <div class="space-rows-list">
              ${slide.spaces.map((s, idx) => `
                <div class="space-row-card gs-anim-card ${idx === 0 ? 'active' : ''}" 
                     id="spaceCard_${idx}"
                     onclick="selectGenericCard('spaceCard', ${idx}, '${s.detail.replace(/'/g, "\\'")}')"
                     onmouseenter="selectGenericCard('spaceCard', ${idx}, '${s.detail.replace(/'/g, "\\'")}')">
                  
                  <div class="space-row-title-col">
                    <div class="space-row-idx">${idx + 1}</div>
                    <div>
                      <div class="space-row-title">${s.title}</div>
                      <div class="space-row-std">${s.std}</div>
                    </div>
                  </div>

                  <div class="space-row-equip-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '核心工藝設備' : 'Key Equipment / Process'}</div>
                    <div class="space-row-equip">${s.equip || s.desc}</div>
                  </div>

                  <div class="space-row-infra-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '工程標準與環評亮點' : 'Infrastructure & SPCB Note'}</div>
                    <div class="space-row-infra">${s.infra || s.detail}</div>
                  </div>

                  <div class="space-row-area-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '昆山 ➔ 印度規劃' : 'Kunshan ➔ India Area'}</div>
                    <div class="space-row-area-box">
                      <span class="area-kunshan">${s.kunshan || '--'}</span>
                      <span class="area-arrow">➔</span>
                      <span class="area-india">${s.india || s.area}</span>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">🏗️</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '廠房基建規劃依據' : 'Infrastructure & SPCB Compliance'}:</strong> ${slide.spaces[0].detail}
            </div>
          </div>
        `;
      }

      // 4. OpEx Cost Composition Visual Cockpit (Slide 10 Overhaul)
      else if (slide.type === "opex-cockpit-visual") {
        html += `
          <div class="opex-cockpit-container">
            <!-- Top KPI Ribbon -->
            ${slide.kpiSummary ? `
              <div class="space-kpi-ribbon">
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '單月總營運成本' : 'Total Monthly OpEx'}</span>
                  <span class="space-kpi-val" style="color:var(--accent);">${slide.kpiSummary.totalOpex}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '昆山單月參考' : 'Kunshan Ref OpEx'}</span>
                  <span class="space-kpi-val" style="color:var(--ink-sub);">${slide.kpiSummary.kunshanRef}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '變動成本佔比 (極強抗風險)' : 'Variable Ratio (Agile Buffer)'}</span>
                  <span class="space-kpi-val" style="color:#38bdf8;">${slide.kpiSummary.variableRatio}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '固定成本負擔 (低折舊壓力)' : 'Fixed Ratio (Low Amort)'}</span>
                  <span class="space-kpi-val" style="color:var(--ink);">${slide.kpiSummary.fixedRatio}</span>
                </div>
              </div>
            ` : ''}

            <!-- 5 OpEx Cost Behavior Rows -->
            <div class="opex-rows-list">
              ${slide.costs.map((c, idx) => `
                <div class="opex-row-card gs-anim-card ${idx === 0 ? 'active' : ''} ${idx === 4 ? 'total-row' : ''}" 
                     id="opexCard_${idx}"
                     onclick="selectGenericCard('opexCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')"
                     onmouseenter="selectGenericCard('opexCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')">
                  
                  <div class="opex-title-block">
                    <span class="opex-icon">${idx === 4 ? '💎' : '📊'}</span>
                    <div>
                      <div class="opex-title">${c.title}</div>
                      <div class="opex-pct">${c.pct} ${currentLang === 'zh' ? '佔比' : 'Share'}</div>
                    </div>
                  </div>

                  <div class="opex-bar-col">
                    <div class="space-row-sublbl">
                      <span>${currentLang === 'zh' ? '變動比' : 'Var'}: <strong style="color:#38bdf8;">${c.varPct}</strong></span>
                      <span>${currentLang === 'zh' ? '固定比' : 'Fix'}: <strong>${(100 - parseFloat(c.varPct)).toFixed(1)}%</strong></span>
                    </div>
                    <div class="opex-bar-ratio-mini">
                      <div class="opex-var-bar" style="width:${c.varPct};" title="Variable"></div>
                      <div class="opex-fix-bar" style="width:${(100 - parseFloat(c.varPct))}%;" title="Fixed"></div>
                    </div>
                  </div>

                  <div class="opex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '昆山單月' : 'Kunshan'}</div>
                    <div class="opex-val-num kunshan">${c.kunshan}</div>
                  </div>

                  <div class="opex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '印度單月' : 'India'}</div>
                    <div class="opex-val-num accent">${c.india}</div>
                  </div>

                  <div class="opex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '變動部分 (Var $)' : 'Variable $'}</div>
                    <div class="opex-val-num var-amt">${c.varAmt}</div>
                  </div>

                  <div class="opex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '固定部分 (Fix $)' : 'Fixed $'}</div>
                    <div class="opex-val-num fix-amt">${c.fixAmt}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">📊</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '成本行為與供應鏈洞察' : 'Cost Behavior Insight'}:</strong> ${slide.costs[0].detail}
            </div>
          </div>
        `;
      }

      // Precision Data Table (Fallback)
      else if (slide.type === "data-table") {
        html += `
          <div class="deck-table-wrap gs-anim-hero">
            <table class="deck-table">
              <thead>
                <tr>${slide.headers.map(h => `<th>${h}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${slide.rows.map(r => `
                  <tr>
                    ${r.map((col, ci) => `
                      <td class="${ci === 0 ? 'strong' : (ci === r.length - 1 ? 'accent' : '')}">${col}</td>
                    `).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      }
      // 2.5. Split Hero Matrix (Slide 4: Left Hero Showcase + Right 2x2 Moat Grid)
      else if (slide.type === "split-hero-matrix") {
        html += `
          <div class="split-hero-layout">
            <!-- Left: Strategic Hero Card (Pie Chart & Governance) -->
            <div class="split-hero-left gs-anim-card" 
                 onclick="selectGenericCard('heroCard', 0, '${slide.heroCard.detail.replace(/'/g, "\\'")}')"
                 onmouseenter="selectGenericCard('heroCard', 0, '${slide.heroCard.detail.replace(/'/g, "\\'")}')">
              <div>
                <div class="feature-card-top">
                  <div class="feature-card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a1 1 0 0 0 0-1.4l-5-5a1 1 0 0 0-1.4 0L11 9"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18"/></svg>
                  </div>
                  <div class="feature-card-tag">${slide.heroCard.tag}</div>
                </div>
                <div class="split-hero-title">${slide.heroCard.title}</div>
                <div class="split-hero-desc">${slide.heroCard.desc}</div>
              </div>

              <div class="split-hero-img-wrap">
                <img class="split-hero-img" src="${slide.heroCard.img}" alt="Equity Split" loading="lazy" />
              </div>

              <div class="card-smart-tooltip">
                <div class="tooltip-tag">⚖️ ${currentLang === 'zh' ? '合資治理深度解析' : 'Governance Insight'}</div>
                <div class="tooltip-text">${slide.heroCard.detail}</div>
              </div>
            </div>

            <!-- Right: 2x2 Moat Grid Cards -->
            <div class="split-hero-right-grid">
              ${slide.cards.map((c, idx) => `
                <div class="split-moat-card gs-anim-card ${idx === 0 ? 'active' : ''}" 
                     id="moatCard_${idx}"
                     onclick="selectGenericCard('moatCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')"
                     onmouseenter="selectGenericCard('moatCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')">
                  <div>
                    <div class="feature-card-top">
                      <div class="feature-card-icon">${c.iconSvg ? c.iconSvg : (c.icon || '💎')}</div>
                      <div class="feature-card-tag">${c.tag}</div>
                    </div>
                    <div class="split-moat-title">${c.title}</div>
                    <div class="split-moat-desc">${c.desc}</div>
                  </div>

                  <div class="card-smart-tooltip">
                    <div class="tooltip-tag">🛡️ ${currentLang === 'zh' ? '核心護城河洞察' : 'Moat Insight'}</div>
                    <div class="tooltip-text">${c.detail}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
      // 3. Feature Cards Visual (Slide 3 Market Verticals, Slide 5 AI)
      else if (slide.type === "feature-cards-visual") {
        html += `
          <div class="feature-cards-grid">
            ${slide.cards.map((c, idx) => `
              <div class="feature-card-item gs-anim-card ${idx === 0 ? 'active' : ''}" 
                   id="featCard_${idx}"
                   onclick="selectGenericCard('featCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')"
                   onmouseenter="selectGenericCard('featCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')">
                <div>
                  <div class="feature-card-top">
                    <div class="feature-card-icon">${c.iconSvg ? c.iconSvg : (c.icon || '💎')}</div>
                    <div class="feature-card-tag">${c.tag}</div>
                  </div>
                  <div class="feature-card-title">${c.title}</div>
                  <div class="feature-card-desc">${c.desc}</div>

                  ${c.blueprintImg ? `
                    <div class="blueprint-thumb-box" title="${currentLang === 'zh' ? '點擊放大檢視高清樣品大圖' : 'Click to view high-res sample'}" onclick="event.stopPropagation(); openImageModal('${c.fullImg || c.blueprintImg}', '${c.title.replace(/'/g, "\\'")}')">
                      <img class="blueprint-thumb-img" src="${c.blueprintImg}" alt="FPC Blueprint" loading="lazy" />
                      <div class="blueprint-zoom-badge">🔍 ${c.blueprintLabel || 'HD SAMPLE'}</div>
                    </div>
                  ` : ''}

                  ${c.buyerCategories ? `
                    <div class="buyer-categories-wrap">
                      ${c.buyerCategories.map(cat => `
                        <div class="buyer-category-block">
                          <div class="buyer-category-lbl">● ${cat.label}</div>
                          <div class="buyer-pills-row">
                            ${cat.pills.map(p => `
                              <span class="buyer-pill ${p.tier || ''}">${p.name}</span>
                            `).join("")}
                          </div>
                        </div>
                      `).join("")}
                    </div>
                  ` : (c.buyers ? `
                    <div class="buyer-pills-row">
                      ${c.buyers.map((b, bi) => `
                        <span class="buyer-pill ${bi === 0 ? 'tier1' : ''}">${b}</span>
                      `).join("")}
                    </div>
                  ` : '')}
                </div>

                ${c.metrics ? `
                  <div class="buyer-data-matrix">
                    ${c.metrics.map(m => `
                      <div class="buyer-data-item">
                        <span class="buyer-data-val">${m.val}</span>
                        <span class="buyer-data-lbl">${m.lbl}</span>
                      </div>
                    `).join("")}
                  </div>
                ` : ''}

                ${c.detail ? `
                  <div class="card-smart-tooltip">
                    <div class="tooltip-tag">🔍 ${currentLang === 'zh' ? '戰略深度洞察' : 'Strategic Insight'}</div>
                    <div class="tooltip-text">${c.detail}</div>
                  </div>
                ` : ''}
              </div>
            `).join("")}
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">🔍</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '戰略深度洞察' : 'Strategic Insight'}:</strong> ${slide.cards[0].detail}
            </div>
          </div>
        `;
      }

      // 3. VS Matrix
      else if (slide.type === "vs-matrix") {
        html += `
          <div class="vs-matrix">
            <div class="vs-col bad gs-anim-left">
              <div class="vs-header" style="color: #f87171;">${slide.badHeader}</div>
              <ul class="vs-list">
                ${slide.badList.map(item => `
                  <li class="vs-item">
                    <div>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="vs-badge badge-bad">${item.badge}</span>
                        <span>${item.text}</span>
                      </div>
                      ${item.bar === 'bad' ? `
                        <div class="vs-metric-row">
                          <div class="vs-bar-track"><div class="vs-bar-bad"></div></div>
                        </div>
                      ` : ''}
                    </div>
                  </li>
                `).join("")}
              </ul>
            </div>
            <div class="vs-col good gs-anim-right">
              <div class="vs-header" style="color: var(--accent);">${slide.goodHeader}</div>
              <ul class="vs-list">
                ${slide.goodList.map((item, idx) => `
                  <li class="vs-item" style="cursor: pointer;"
                      onmouseenter="document.getElementById('vsFloatingText').innerHTML = '<strong>${currentLang === 'zh' ? '戰略突破依據' : 'Strategic Edge'}:</strong> ${item.text.replace(/'/g, "\\'")}';">
                    <div>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="vs-badge badge-good">${item.badge}</span>
                        <span><strong>${item.text}</strong></span>
                      </div>
                      ${item.bar === 'good' ? `
                        <div class="vs-metric-row">
                          <div class="vs-bar-track"><div class="vs-bar-good"></div></div>
                        </div>
                      ` : ''}
                    </div>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">💡</div>
            <div class="floating-bar-text" id="vsFloatingText">
              <strong>${currentLang === 'zh' ? '戰略破局洞察' : 'Strategic Breakthrough'}:</strong> ${currentLang === 'zh' ? '我們賣的不是產品，是「時間」與「確定性」——幫客戶一次拿回新品上市速度、消滅海外在途庫存，並直接提升在地價值增值 (DVA) 拿滿國家 PLI 增量現金補貼！' : 'We do not merely sell components; we deliver Time and Certainty—slashing NPI cycles, eliminating pipeline inventory, and elevating customer Domestic Value Add (DVA) to secure maximum PLI subsidies.'}
            </div>
          </div>
        `;
      }
      // 4. CapEx & SPECS Subsidy Comparison Cockpit (Slide 9 Overhaul)
      else if (slide.type === "capex-cockpit-visual") {
        html += `
          <div class="capex-cockpit-container">
            <!-- Top KPI Ribbon -->
            ${slide.kpiSummary ? `
              <div class="space-kpi-ribbon">
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '建廠總 CapEx 預算' : 'Total Project CapEx'}</span>
                  <span class="space-kpi-val" style="color:var(--accent);">${slide.kpiSummary.totalBudget}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '昆山參考預算' : 'Kunshan Ref Budget'}</span>
                  <span class="space-kpi-val" style="color:var(--ink-sub);">${slide.kpiSummary.kunshanRef}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? 'SPECS 25% 現金返還' : 'SPECS 25% Cash Refund'}</span>
                  <span class="space-kpi-val" style="color:#34d399;">${slide.kpiSummary.specsRefund}</span>
                </div>
                <div class="space-kpi-divider"></div>
                <div class="space-kpi-block">
                  <span class="space-kpi-lbl">${currentLang === 'zh' ? '投資人淨資本投入' : 'Net Investor CapEx'}</span>
                  <span class="space-kpi-val" style="color:var(--ink);">${slide.kpiSummary.netInvestment}</span>
                </div>
              </div>
            ` : ''}

            <!-- 4 CapEx Rows -->
            <div class="capex-rows-list">
              ${slide.items.map((it, idx) => `
                <div class="capex-row-card gs-anim-card ${idx === 0 ? 'active' : ''} ${idx === 3 ? 'total-row' : ''}" 
                     id="capexCard_${idx}"
                     onclick="selectGenericCard('capexCard', ${idx}, '${it.detail.replace(/'/g, "\\'")}')"
                     onmouseenter="selectGenericCard('capexCard', ${idx}, '${it.detail.replace(/'/g, "\\'")}')">
                  
                  <div class="capex-title-block">
                    <span class="capex-icon">${idx === 3 ? '💎' : '🏛️'}</span>
                    <div>
                      <div class="capex-title">${it.title}</div>
                      <div class="capex-pct">${it.pct} ${currentLang === 'zh' ? '佔比' : 'Share'}</div>
                    </div>
                  </div>

                  <div class="capex-boundary-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '技術股責任與管理邊界' : 'Governance & Scope'}</div>
                    <div class="capex-boundary-text">${it.boundary || it.detail}</div>
                  </div>

                  <div class="capex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '昆山參考' : 'Kunshan'}</div>
                    <div class="capex-val-num kunshan">${it.kunshan}</div>
                  </div>

                  <div class="capex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '印度在地' : 'India'}</div>
                    <div class="capex-val-num accent">${it.india}</div>
                  </div>

                  <div class="capex-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? 'SPECS 25%' : 'Subsidy'}</div>
                    <div class="capex-val-num subsidy">${it.subsidy}</div>
                  </div>

                  <div class="capex-val-col net-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '淨投入' : 'Net CapEx'}</div>
                    <div class="capex-val-num net">${it.net}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">🛡️</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '台方責任邊界與風控依據' : 'Technical Boundary & Risk Control'}:</strong> ${slide.items[0].detail}
            </div>
          </div>
        `;
      }

      // 4. CapEx Waterfall Bars (Fallback)
      // 5. Master BEP Financial Cockpit (Slide 11 Overhaul)
      else if (slide.type === "bep-master-cockpit") {
        html += `
          <div class="bep-cockpit-grid">
            <!-- Left 38%: Master BEP Gauge & Sensitivity Simulation -->
            <div class="gauge-card-master gs-anim-card">
              <div class="gauge-top-section">
                <div class="slide-tag" style="font-size:11px; margin-bottom:10px;">BREAK-EVEN SIMULATOR</div>
                <div class="gauge-main-wrap">
                  <div class="gauge-circle">
                    <div class="gauge-arc" id="cockpitGaugeArc"></div>
                    <div class="gauge-value" id="cockpitGaugeVal">${slide.bepVal}</div>
                  </div>
                  <div class="gauge-threshold-text" id="cockpitThresholdText">
                    ${currentLang === 'zh' ? '損益平衡月門檻' : 'Threshold'}: <strong>${slide.thresholdRevMo}</strong> / mo
                  </div>
                </div>
              </div>

              <!-- Interactive Capacity Sensitivity Slider -->
              <div class="slider-box">
                <div class="slider-header">
                  <span>${currentLang === 'zh' ? '稼動率敏感度模擬' : 'Capacity Simulation'}</span>
                  <strong id="sliderCapVal">75% (11,250 m²)</strong>
                </div>
                <input type="range" class="cockpit-slider" id="cockpitSlider" min="30" max="100" value="75" oninput="updateCockpitSim(this.value)">
                <div class="slider-result-row">
                  <span>${currentLang === 'zh' ? '預估月營收' : 'Est. Revenue'}: <strong id="simRev">$1.80M</strong></span>
                  <span>${currentLang === 'zh' ? '預估月獲利' : 'Est. EBIT'}: <strong id="simEbit" style="color:var(--accent);">$322K</strong></span>
                </div>
              </div>

              <!-- Bottom Double Returns Badges -->
              <div class="bep-returns-ribbon">
                <div class="bep-return-item">
                  <span class="bep-ret-lbl">IRR ${currentLang === 'zh' ? '內部報酬率' : 'Return'}</span>
                  <span class="bep-ret-val" style="color:#34d399;">21.3% ~ 24.8%</span>
                </div>
                <div class="bep-return-divider"></div>
                <div class="bep-return-item">
                  <span class="bep-ret-lbl">${currentLang === 'zh' ? '靜態投資回收期' : 'Static Payback'}</span>
                  <span class="bep-ret-val" style="color:var(--accent);">4.2 ${currentLang === 'zh' ? '年' : 'Yrs'}</span>
                </div>
              </div>
            </div>

            <!-- Right 62%: Complete Financial Statement Metrics Rows -->
            <div class="bep-metrics-rows-list">
              ${(slide.metricsTable || []).map((m, idx) => `
                <div class="bep-metric-row-card gs-anim-card ${idx === 2 ? 'ebit-row' : ''} ${idx === 3 ? 'bep-row' : ''}"
                     id="bepRow_${idx}"
                     onclick="selectGenericCard('bepRow', ${idx}, '${m.bench.replace(/'/g, "\\'")}')"
                     onmouseenter="selectGenericCard('bepRow', ${idx}, '${m.bench.replace(/'/g, "\\'")}')">
                  
                  <div class="bep-metric-title-col">
                    <span class="bep-metric-dot ${idx === 2 ? 'accent' : ''}"></span>
                    <span class="bep-metric-title">${m.metric}</span>
                  </div>

                  <div class="bep-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '單月預估' : 'Monthly'}</div>
                    <div class="bep-val-num ${idx === 2 ? 'accent' : ''}">${m.monthly}</div>
                  </div>

                  <div class="bep-val-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '年度預估' : 'Annual'}</div>
                    <div class="bep-val-num ${idx === 2 ? 'accent' : ''}">${m.annual}</div>
                  </div>

                  <div class="bep-val-col margin-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '毛利/比率' : 'Margin/Val'}</div>
                    <div class="bep-val-num ${idx === 2 ? 'highlight' : ''}">${m.margin}</div>
                  </div>

                  <div class="bep-bench-col">
                    <div class="space-row-sublbl">${currentLang === 'zh' ? '業界標準與決策依據' : 'Benchmark & Strategic Note'}</div>
                    <div class="bep-bench-text">${m.bench}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Non-Intrusive Floating Context Explanation Bar -->
          <div class="cockpit-floating-bar" id="cockpitFloatingBar">
            <div class="floating-bar-icon">💡</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '財務模型決策依據' : 'Financial Statement Insight'}:</strong> ${slide.defaultExplanation}
            </div>
          </div>
        `;
      }
      // 6. Authentic 5-Year Full Investment Payback Horizon (Consistent $0M-$25M Scale & Evenly Spaced Macro Nodes)
      else if (slide.type === "flow-pipeline") {
        const ls = slide.liveStats || {};
        
        // Exact 1:1 Synchronized Dollar Scale ($0M -> SVG_Y 305, $25M -> SVG_Y 45)
        const capExVal = Number(ls.cCapEx) || 17.25; // $17.25M net capex
        const annualEbit = Number(ls.annualEbit) || 6.66; // $6.66M annual EBIT
        
        function dollarToY(val) {
          const ratio = Math.min(Math.max(val / 25.0, 0), 1);
          return (305 - ratio * 260).toFixed(1);
        }
        
        // Orange Cumulative CapEx curve points (X = [80 (Y0), 280 (Y1), 480 (Y2), 680 (Y3), 740 (Y4.2), 920 (Y5)])
        // Y0 starts at 0 -> jumps to $17.25M at Y1 upon full cleanroom commissioning -> stays flat at $17.25M
        const capY0 = dollarToY(0);
        const capY1 = dollarToY(capExVal); // $17.25M (around Y=125)
        const capY2 = capY1;
        const capY3 = capY1;
        const capY42 = capY1;
        const capY5 = capY1;

        // Green Cumulative Net Cash Flow curve points:
        // Y0 = $0M
        // Y1 = $0.40M (initial trading profit)
        // Y2 = $0.40M + $3.40M = $3.80M (ramping local production)
        // Y3 = $3.80M + $6.66M = $10.46M (full scale run-rate)
        // Y4.2 = $10.46M + 1.2 * $6.66M = $18.45M -> Exact Crossover at Y4.2 ($17.25M)!
        // Y5 = $10.46M + 2.0 * $6.66M = $23.78M
        const revY0 = dollarToY(0);
        const revY1 = dollarToY(0.4);
        const revY2 = dollarToY(3.8);
        const revY3 = dollarToY(10.46);
        const revY42 = capY1; // EXACT 1:1 INTERSECTION AT YEAR 4.2 ($17.25M)
        const revY5 = dollarToY(23.5);

        // Coordinates of 5 Evenly Spaced Macro Nodes:
        // Y0 (80px / 8%), Y1 (280px / 28%), Y2 (480px / 48%), Y4.2 (740px / 74%), Y5 (920px / 92%)
        const nodePositions = ['8%', '28%', '48%', '74%', '92%'];

        html += `
          <div class="crossover-chart-container macro-5yr-container">
            
            <!-- Dual-Curve Interactive Canvas (Radical Slimming & Full Height Breathing Room) -->
            <div class="crossover-board-wrap macro-board-wrap">
              
              <!-- LAYER 1: Pure Background SVG Dual Curves & Central Timeline Axis -->
              <svg class="crossover-svg" viewBox="0 0 1000 350" preserveAspectRatio="none">
                <defs>
                  <!-- Orange Expenditure Gradient ($17.25M CapEx Ceiling) -->
                  <linearGradient id="orangeCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#f97316" stop-opacity="0.9" />
                    <stop offset="30%" stop-color="#fb923c" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#fdba74" stop-opacity="0.5" />
                  </linearGradient>
                  <!-- Green Cumulative Cash Flow Gradient (Upward Compounding) -->
                  <linearGradient id="greenCashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#22c55e" stop-opacity="0.4" />
                    <stop offset="50%" stop-color="#4ade80" stop-opacity="0.75" />
                    <stop offset="80%" stop-color="#86efac" stop-opacity="0.95" />
                    <stop offset="100%" stop-color="#10b981" stop-opacity="1" />
                  </linearGradient>
                  <filter id="macroCurveGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <marker id="arrowTimelineBlue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb" />
                  </marker>
                </defs>

                <!-- LAYER 2: 5 Vertical Time Grid Lines for 5 Macro Years -->
                <line x1="80" y1="35" x2="80" y2="315" stroke="rgba(249,115,22,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
                <line x1="280" y1="35" x2="280" y2="315" stroke="rgba(249,115,22,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
                <line x1="480" y1="35" x2="480" y2="315" stroke="rgba(201,169,110,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
                <line x1="740" y1="35" x2="740" y2="315" stroke="rgba(201,169,110,0.6)" stroke-width="2" stroke-dasharray="4 3" />
                <line x1="920" y1="35" x2="920" y2="315" stroke="rgba(34,197,94,0.3)" stroke-width="1.5" stroke-dasharray="4 3" />

                <!-- Central Solid Blue Horizontal Axis Line with Arrow (y=175) -->
                <line x1="40" y1="175" x2="965" y2="175" stroke="#2563eb" stroke-width="4.5" marker-end="url(#arrowTimelineBlue)" />

                <!-- Realistic Smooth Orange CapEx Curve (S-Curve to $17.25M at Y1, then flat) -->
                <path d="M 40,305 C 55,300 70,220 80,185 C 160,135 220,${capY1} 280,${capY1} L 740,${capY1} L 960,${capY1}" 
                      fill="none" stroke="url(#orangeCapGrad)" stroke-width="3.5" filter="url(#macroCurveGlow)" opacity="0.85" />

                <!-- 1:1 Scale Synchronized Green Cumulative Cash Flow Curve (Crosses Orange Line exactly at Year 4.2: (740, ${capY1})) -->
                <path d="M 40,305 C 70,305 80,305 180,${revY1} C 280,${revY1} 380,${revY2} 480,${revY2} C 580,${revY3} 660,${capY1} 740,${capY1} C 800,${capY1} 860,110 960,105" 
                      fill="none" stroke="url(#greenCashGrad)" stroke-width="4" filter="url(#macroCurveGlow)" opacity="0.9" />
              </svg>

              <!-- Category Legend Badges -->
              <div class="crossover-title-badge orange-badge">
                ${slide.orangeLabel || '累積資本支出'}
              </div>
              <div class="crossover-title-badge green-badge">
                ${slide.greenLabel || '累積營運淨現金流'}
              </div>
              <div class="timeline-legend-tag">
                ${slide.timelineLabel || '5 年戰略投資全景時間軸'}
              </div>

              <!-- True Payback Golden Crossover: 100% PERFECT 1:1 CSS CIRCLE (Zero distortion on fullscreen/resize) -->
              <div class="payback-perfect-pulse" style="left: 74%; top: ${((capY1 / 350) * 100).toFixed(1)}%;">
                <div class="pulse-core-dot"></div>
                <div class="pulse-wave-ring"></div>
              </div>

              <!-- LAYER 3 FOREGROUND: Top Orange Milestones (5 Evenly Spaced Macro Nodes at top: 16%) -->
              <div class="crossover-node-layer orange-layer">
                ${(slide.orangeNodes || []).map((n, idx) => `
                  <div class="crossover-point-item orange-point" style="left:${nodePositions[idx] || '50%'}; top: 16%; transform: translateX(-50%);"
                       onclick="selectGenericCard('orangePt', ${idx}, '${n.detail.replace(/'/g, "\\'")}')"
                       onmouseenter="selectGenericCard('orangePt', ${idx}, '${n.detail.replace(/'/g, "\\'")}')">
                    <div class="point-header-line">
                      <span class="point-bullet orange"></span>
                      <span class="point-text">${n.title}</span>
                    </div>
                    <span class="point-metric-pill orange">${n.metric}</span>

                    <!-- Smart Hover Popover with Live Financial Context -->
                    <div class="card-smart-tooltip">
                      <div class="tooltip-tag" style="color:#f97316;">🏗️ ${currentLang === 'zh' ? '資本與建廠里程碑' : 'CapEx & Facility Milestone'}</div>
                      <div class="tooltip-text">${n.detail}</div>
                    </div>
                  </div>
                `).join("")}
              </div>

              <!-- LAYER 3 FOREGROUND: Central 5-Year Macro Timeline Labels -->
              <div class="crossover-time-labels">
                <span style="left:8%;">Year 0</span>
                <span style="left:28%;">Year 1 (CTO)</span>
                <span style="left:48%;">Year 2 (Full)</span>
                <span style="left:74%; color:var(--accent); font-weight:800; font-size:12px;">${currentLang === 'zh' ? 'Year 4.2 (🎯 4.2年回本)' : 'Year 4.2 (🎯 Payback)'}</span>
                <span style="left:92%;">Year 5</span>
              </div>

              <!-- LAYER 3 FOREGROUND: Bottom Green Commercial Milestones (5 Evenly Spaced Macro Nodes at bottom: 16%) -->
              <div class="crossover-node-layer green-layer">
                ${(slide.greenNodes || []).map((n, idx) => `
                  <div class="crossover-point-item green-point" style="left:${nodePositions[idx] || '50%'}; bottom: 16%; transform: translateX(-50%);"
                       onclick="selectGenericCard('greenPt', ${idx}, '${n.detail.replace(/'/g, "\\'")}')"
                       onmouseenter="selectGenericCard('greenPt', ${idx}, '${n.detail.replace(/'/g, "\\'")}')">
                    <div class="point-header-line">
                      <span class="point-bullet green"></span>
                      <span class="point-text">${n.title}</span>
                    </div>
                    <span class="point-metric-pill green">${n.metric}</span>

                    <!-- Smart Hover Popover with Live Financial Context -->
                    <div class="card-smart-tooltip">
                      <div class="tooltip-tag" style="color:#22c55e;">📈 ${currentLang === 'zh' ? '營收與現金流里程碑' : 'Cash Flow & Value Milestone'}</div>
                      <div class="tooltip-text">${n.detail}</div>
                    </div>
                  </div>
                `).join("")}
              </div>

            </div>

            <!-- Discreet Bottom Disclaimer Bar (Financial & Legal Rigor Outside Canvas) -->
            <div class="deck-disclaimer-note">
              ${slide.disclaimer || ''}
            </div>

          </div>
        `;
      }
      // 7. Slide 13: Executive Lead Form & Official NotebookLM AI Data Room Hub
      else if (slide.type === "cta-hub") {
        html += `
          <div class="cta-split-container">
            
            <!-- LEFT COLUMN: Executive Direct Lead Form -->
            <div class="cta-column-card">
              <div>
                <div class="cta-card-header">
                  <div class="cta-card-badge gold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>${currentLang === 'zh' ? '創始人通道' : 'DIRECT CHANNEL'}</span>
                  </div>
                  <span style="font-family:var(--font-mono); font-size:10px; color:#94a3b8;">CONFIDENTIAL</span>
                </div>
                <div class="cta-card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>${slide.formTitle || '創始團隊直通留言通道'}</span>
                </div>
                <div class="cta-card-desc">
                  ${slide.formSubtitle || '預約實體商務會談或現場考察，所有留言將安全記錄至專案資料庫。'}
                </div>

                <form id="investorInquiryForm" class="cta-form-grid" onsubmit="event.preventDefault(); handleInvestorLeadSubmit();">
                  <div class="cta-form-group">
                    <label class="cta-form-label">${currentLang === 'zh' ? '您的姓名 / Full Name *' : 'Full Name *'}</label>
                    <input type="text" id="leadName" class="cta-form-input" placeholder="${currentLang === 'zh' ? '例：張偉 / David Chen' : 'e.g., David Chen'}" required />
                  </div>
                  <div class="cta-form-group">
                    <label class="cta-form-label">${currentLang === 'zh' ? '機構 / Fund / Org *' : 'Institution / Fund *'}</label>
                    <input type="text" id="leadOrg" class="cta-form-input" placeholder="${currentLang === 'zh' ? '例：紅杉資本 / Tata Capital' : 'e.g., Sequoia / Sovereign Fund'}" required />
                  </div>
                  <div class="cta-form-group">
                    <label class="cta-form-label">${currentLang === 'zh' ? '商務郵箱 / Email *' : 'Corporate Email *'}</label>
                    <input type="email" id="leadEmail" class="cta-form-input" placeholder="${currentLang === 'zh' ? '例：name@fund.com' : 'name@fund.com'}" required />
                  </div>
                  <div class="cta-form-group">
                    <label class="cta-form-label">${currentLang === 'zh' ? '電話 / WhatsApp' : 'Phone / WhatsApp'}</label>
                    <input type="text" id="leadPhone" class="cta-form-input" placeholder="+886 / +91 / +1" />
                  </div>
                  <div class="cta-form-group full-width">
                    <label class="cta-form-label">${currentLang === 'zh' ? '合作意向或需求 / Message' : 'Strategic Inquiry / Message'}</label>
                    <textarea id="leadMsg" class="cta-form-textarea" placeholder="${currentLang === 'zh' ? '簡要說明您的投資偏好、擬合作形式或盡調考察時程...' : 'Briefly describe your investment focus or due diligence timeline...'}"></textarea>
                  </div>
                  <div class="cta-form-group full-width" style="margin-top:4px;">
                    <button type="submit" id="btnSubmitLead" class="btn-action-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      <span>${slide.submitBtn || '送出商務會談意向'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- RIGHT COLUMN: Google NotebookLM AI Data Room -->
            <div class="cta-column-card ai-highlight-card">
              <div>
                <div class="cta-card-header">
                  <div class="cta-card-badge cyan">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2v-2h2zm0-4h-2V7h2z"/></svg>
                    <span>${slide.aiBadge || '23 VERIFIED DOSSIERS'}</span>
                  </div>
                  <span style="font-family:var(--font-mono); font-size:10px; color:#38bdf8; font-weight:700;">GOOGLE NOTEBOOKLM</span>
                </div>
                <div class="cta-card-title" style="color:#7dd3fc;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  <span>${slide.aiTitle || '官方 AI 智能資料室'}</span>
                </div>
                <div class="cta-card-desc">
                  ${slide.aiDesc || '完整收錄 13,000 m² 廠區規劃、SPCB 環評批文、CEC 原廠報價單與 5 年財務母模型，支援即時深度問答與音訊播客。'}
                </div>

                <!-- Structured Intelligence & Capability Matrix Preview -->
                <div class="ai-features-list">
                  <div class="ai-feature-item">
                    <div class="ai-feature-icon-box">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div class="ai-feature-text-block">
                      <span class="ai-feature-heading">${currentLang === 'zh' ? '目標客戶名冊與深度 KYC' : 'Target Customer Pipeline & Market KYC'}</span>
                      <span class="ai-feature-sub">${currentLang === 'zh' ? '全印國防、車規電池包 CCS 與高階消費電子一級買家需求與採購清單' : 'Tier-1 Defense, EV CCS & Camera Module buyer procurement profiles'}</span>
                    </div>
                  </div>
                  <div class="ai-feature-item">
                    <div class="ai-feature-icon-box">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    </div>
                    <div class="ai-feature-text-block">
                      <span class="ai-feature-heading">${currentLang === 'zh' ? '技術團隊核心交付職能' : 'Technical Team Engineering Moats'}</span>
                      <span class="ai-feature-sub">${currentLang === 'zh' ? '自主化學配方、設備選型調試、潔淨室廠房設計與 AI SFC 智慧製造系統' : 'Chemical formulations, machine configuration, fab design & AI SFC MES'}</span>
                    </div>
                  </div>
                </div>

                <div class="ai-notice-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>${slide.aiNotice || '需登入 Google 帳號（個人 Gmail 或 Workspace 均可），具備唯讀檢視與對話權限。'}</span>
                </div>
              </div>

              <div>
                <button type="button" class="btn-action-primary btn-action-glow" onclick="openPasscodeModal()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>${slide.aiBtn || '開啟官方 AI 智能資料室 (需密碼)'}</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Bottom Safe Harbor & Navigation Strip -->
          <div class="cta-global-nav-bar">
            <div class="cta-nav-links">
              <button class="btn-nav-outline" onclick="goToSlide(0)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <span>${slide.agendaBtn || '返回路演全息目錄'}</span>
              </button>
              <a href="template-${currentTheme}.html" class="btn-nav-outline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>${slide.landingBtn || '返回主題門戶首頁'}</span>
              </a>
            </div>
            <div class="cta-safe-harbor-text">
              🔒 Private & Confidential / For Institutional Accredited Investors Only © 2026 Project Indo-Phoenix
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
      renderTimeline();

      if (animate && window.gsap) {
        executeCinematicTimeline();
      } else {
        animateNumbers();
        animateBars();
      }
    }

    /* ═══════════════════════════════════════════════════════════════
       CINEMATIC 3D GSAP TRANSITION TIMELINE
       ═══════════════════════════════════════════════════════════════ */
    function executeCinematicTimeline() {
      isTransitioning = true;
      const rotY = slideDirection === "next" ? 16 : -16;
      const transX = slideDirection === "next" ? 70 : -70;

      // 1. Sweep Laser Beam
      gsap.fromTo("#scanBeam", 
        { left: "-100%", opacity: 0.8 },
        { left: "140%", opacity: 0, duration: 0.65, ease: "power2.out" }
      );

      // 2. 3D Stage Origami Pivot
      gsap.fromTo("#slideWrapper",
        { rotateY: rotY, scale: 0.95, filter: "brightness(1.3)" },
        { rotateY: 0, scale: 1, filter: "brightness(1)", duration: 0.6, ease: "power3.out" }
      );

      // 3. Elements Timeline
      const tl = gsap.timeline({
        onComplete: () => { isTransitioning = false; }
      });

      tl.fromTo(".gs-anim-title",
        { opacity: 0, x: transX, filter: "blur(6px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }
      );

      tl.fromTo(".gs-anim-desc",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.25"
      );

      if (document.querySelector(".gs-anim-hero")) {
        tl.fromTo(".gs-anim-hero",
          { opacity: 0, scale: 0.92, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" },
          "-=0.2"
        );
      }
      if (document.querySelectorAll(".gs-anim-card").length) {
        tl.fromTo(".gs-anim-card",
          { opacity: 0, y: 24, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.06, ease: "back.out(1.3)" },
          "-=0.25"
        );
      }
      if (document.querySelector(".gs-anim-left")) {
        tl.fromTo(".gs-anim-left",
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
          "-=0.25"
        );
        tl.fromTo(".gs-anim-right",
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
          "-=0.35"
        );
      }
      if (document.querySelectorAll(".gs-anim-flow").length) {
        tl.fromTo(".gs-anim-flow",
          { opacity: 0, y: 30, rotateX: 20 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.45, stagger: 0.07, ease: "back.out(1.4)" },
          "-=0.25"
        );
      }
      if (document.querySelectorAll(".gs-anim-bar").length) {
        tl.fromTo(".gs-anim-bar",
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.38, stagger: 0.05, ease: "power2.out" },
          "-=0.2"
        );
      }
      if (document.querySelector(".gs-anim-gauge")) {
        tl.fromTo(".gs-anim-gauge",
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" },
          "-=0.25"
        );
      }

      triggerFxPulse();
      animateNumbers();
      animateBars();
    }

    function triggerFxPulse() {
      try {
        if (currentTheme === "a" && window.IPX_SMOKE && window.IPX_SMOKE.boost) {
          window.IPX_SMOKE.boost(2.4);
          setTimeout(() => window.IPX_SMOKE.boost(0), 450);
        } else if (currentTheme === "b" && window.IPX_ORBIT && window.IPX_ORBIT.pulse) {
          window.IPX_ORBIT.pulse(window.innerWidth / 2, window.innerHeight / 2);
        } else if (currentTheme === "c" && window.IPX_HOLO && window.IPX_HOLO.warp) {
          window.IPX_HOLO.warp(1.5);
        }
      } catch (e) {}
    }

    function animateBars() {
      setTimeout(() => {
        document.querySelectorAll(".bar-fill").forEach(bar => {
          const pct = bar.getAttribute("data-pct");
          bar.style.width = pct + "%";
        });
      }, 120);
    }

    function animateNumbers() {
      document.querySelectorAll(".count-target").forEach(el => {
        const raw = el.getAttribute("data-target");
        if (!raw) return;
        const clean = raw.replace(/[$,%M]/g, "").trim();
        const num = parseFloat(clean);
        if (isNaN(num)) {
          el.textContent = raw;
          return;
        }

        const prefix = raw.startsWith("$") ? "$" : "";
        const suffix = raw.includes("%") ? "%" : (raw.includes("M") ? "M" : (raw.includes("年") ? " 年" : (raw.includes("Yrs") ? " Yrs" : "")));
        const isDecimal = clean.includes(".");
        const decimals = isDecimal ? clean.split(".")[1].length : 0;
        
        const duration = 750;
        const start = performance.now();

        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const ease = 1 - Math.pow(1 - t, 4);
          const current = num * ease;
          
          if (decimals > 0) {
            el.textContent = prefix + current.toFixed(decimals) + suffix;
          } else {
            el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
          }

          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = raw;
        }
        requestAnimationFrame(tick);
      });
    }

    function jumpToSlide(idx) {
      if (idx === currentSlide || isTransitioning) return;
      slideDirection = idx > currentSlide ? "next" : "prev";
      currentSlide = idx;
      renderSlide(true);
    }

    function renderTimeline() {
      const slides = getI18NDeck()[currentLang].slides;
      const container = document.getElementById("timelineSteps");
      container.innerHTML = slides.map((s, idx) => `
        <div class="step-pill ${idx === currentSlide ? 'active' : ''}" 
             title="${currentLang === 'zh' ? `第 ${idx + 1} 頁` : `Slide ${idx + 1}`}" 
             onclick="goToSlide(${idx})"></div>
      `).join("");
    }

    function goToSlide(idx) {
      jumpToSlide(idx);
    }
    function nextSlide() {
      const slides = getI18NDeck()[currentLang].slides;
      if (currentSlide < slides.length - 1 && !isTransitioning) {
        slideDirection = "next";
        currentSlide++;
        renderSlide(true);
      }
    }
    function prevSlide() {
      if (currentSlide > 0 && !isTransitioning) {
        slideDirection = "prev";
        currentSlide--;
        renderSlide(true);
      }
    }

    /* ═══════════════════════════════════════════════════════════════
       FINANCIAL COCKPIT & SENSITIVITY INTERACTION CONTROLLER
       ═══════════════════════════════════════════════════════════════ */
    function highlightProductMix(idx, name, detailText) {
      document.querySelectorAll("[id^='prodCard_']").forEach((el, i) => {
        el.classList.toggle("active", i === idx);
      });

      // Update Left Donut Segment Glowing Focus
      [0, 1, 2].forEach(i => {
        const seg = document.getElementById(`donutSeg_${i}`);
        if (seg) {
          if (i === idx) {
            seg.style.filter = "drop-shadow(0 0 8px currentColor) brightness(1.3)";
            seg.style.strokeWidth = "15";
          } else {
            seg.style.filter = "none";
            seg.style.strokeWidth = "12";
          }
        }
      });

      // Update Left Bottom Insight Dock
      const tagEl = document.getElementById("donutDockTag");
      const descEl = document.getElementById("donutDockDesc");
      if (tagEl) tagEl.textContent = `💎 ${name}`;
      if (descEl) descEl.textContent = detailText;
    }

    function selectGenericCard(prefix, idx, detailText) {
      document.querySelectorAll(`[id^='${prefix}_']`).forEach((el, i) => {
        el.classList.toggle("active", i === idx);
      });
      const el = document.getElementById("genericFloatingText");
      if (el) {
        const title = currentLang === "zh" ? "決策與技術洞察" : "Strategic & Technical Insight";
        el.innerHTML = `<strong>${title}:</strong> ${detailText}`;
      }
    }

    function previewCockpitCard(idx) {
      const slide = getI18NDeck()[currentLang].slides[currentSlide];
      if (!slide || !slide.cards || !slide.cards[idx]) return;
      
      document.querySelectorAll(".cockpit-mini-card").forEach((el, i) => {
        el.classList.toggle("active", i === idx);
      });

      const prefix = currentLang === "zh" ? "決策依據" : "Strategic Insight";
      document.getElementById("cockpitFloatingText").innerHTML = `<strong>${prefix}:</strong> ${slide.cards[idx].detail}`;
    }

    function selectCockpitCard(idx) {
      previewCockpitCard(idx);
    }

    function updateCockpitSim(val) {
      const capPct = parseInt(val, 10);
      const capM2 = Math.round(15000 * (capPct / 100));
      document.getElementById("sliderCapVal").textContent = `${capPct}% (${capM2.toLocaleString()} m²)`;

      // Live Calculation Model:
      // Monthly Rev = capM2 * 160
      const rev = (capM2 * 160) / 1000000;
      // Fixed Cost = 572.4K, Variable Cost = Rev * (1272.6K / 2400K) = Rev * 0.53025
      const varCost = rev * 0.53025;
      const fixedCost = 0.5724;
      const ebit = (rev - varCost - fixedCost) * 1000;

      document.getElementById("simRev").textContent = `$${rev.toFixed(2)}M`;
      const ebitEl = document.getElementById("simEbit");
      if (ebit >= 0) {
        ebitEl.textContent = `$${Math.round(ebit)}K`;
        ebitEl.style.color = "var(--accent)";
      } else {
        ebitEl.textContent = `-$${Math.abs(Math.round(ebit))}K`;
        ebitEl.style.color = "#ef4444";
      }

      // Live Interactive Gauge Animation Linkage
      const gaugeValEl = document.getElementById("cockpitGaugeVal");
      const gaugeArcEl = document.getElementById("cockpitGaugeArc");
      const gaugeThresholdText = document.getElementById("cockpitThresholdText");
      if (gaugeValEl) {
        gaugeValEl.textContent = `${capPct}%`;
      }
      if (gaugeArcEl) {
        // -45deg is 0%, +135deg is 100% (total 180deg range)
        const targetDeg = -45 + (capPct / 100) * 180;
        gaugeArcEl.style.transform = `rotate(${targetDeg}deg)`;
        if (capPct < 50.8) {
          gaugeArcEl.style.borderTopColor = "#ef4444";
          gaugeArcEl.style.borderLeftColor = "#ef4444";
          gaugeArcEl.style.boxShadow = "0 0 20px rgba(239,68,68,0.5)";
          if (gaugeValEl) gaugeValEl.style.color = "#ef4444";
        } else {
          gaugeArcEl.style.borderTopColor = "var(--accent)";
          gaugeArcEl.style.borderLeftColor = "var(--accent)";
          gaugeArcEl.style.boxShadow = "0 0 20px var(--accent-glow)";
          if (gaugeValEl) gaugeValEl.style.color = "var(--accent)";
        }
      }
      if (gaugeThresholdText) {
        if (capPct < 50.8) {
          gaugeThresholdText.innerHTML = `<span style="color:#ef4444;">${currentLang === 'zh' ? '未達損益兩平 (虧損)' : 'BELOW BREAK-EVEN (LOSS)'}</span>`;
        } else {
          gaugeThresholdText.innerHTML = `${currentLang === 'zh' ? '損益平衡月門檻' : 'Threshold'}: <strong>$1.22M</strong> / mo`;
        }
      }
    }

    /* ═══════════════════════════════════════════════════════════════
       EXECUTIVE DETAIL MODAL CONTROLLER
       ═══════════════════════════════════════════════════════════════ */
    function openDetailModal(slideIdx, cardIdx) {
      const slide = getI18NDeck()[currentLang].slides[slideIdx];
      if (!slide || !slide.cards || !slide.cards[cardIdx]) return;
      const card = slide.cards[cardIdx];

      document.getElementById("modalTag").textContent = currentLang === "zh" ? "決策依據與業界標準說明" : "Strategic Explanation & Benchmarks";
      document.getElementById("modalTitle").textContent = card.label;
      document.getElementById("modalVal").textContent = card.val;
      document.getElementById("modalLbl").textContent = card.unit || (currentLang === "zh" ? "指標現值" : "Current Value");
      document.getElementById("modalText").textContent = card.detail || card.desc;
      document.getElementById("modalSource").textContent = card.source || "Google Sheet (FPC Factory Model)";

      const modal = document.getElementById("deckModal");
      modal.classList.add("is-open");
    }

    /* Sample Image Lightbox Handlers */
    function openImageModal(imgUrl, caption) {
      const modal = document.getElementById("imageModal");
      const img = document.getElementById("imageModalImg");
      const cap = document.getElementById("imageModalCaption");
      if (img) img.src = imgUrl;
      if (cap) cap.textContent = caption || "SAMPLE HIGH-RES PREVIEW";
      if (modal) modal.classList.add("is-open");
    }

    function closeImageModal(e) {
      if (e && e.target && e.target.closest(".image-modal-card") && !e.target.classList.contains("modal-close-btn")) {
        return;
      }
      const modal = document.getElementById("imageModal");
      if (modal) modal.classList.remove("is-open");
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDetailModal();
        closeImageModal();
      }
      if (document.getElementById("deckModal").classList.contains("is-open")) return;
      if (document.getElementById("imageModal").classList.contains("is-open")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prevSlide();
    });

    function switchTheme(theme) {
      if (theme !== currentTheme) {
        const url = new URL(window.location.href);
        url.searchParams.set("theme", theme);
        url.searchParams.set("lang", currentLang);
        window.location.href = url.toString();
      }
    }

    function loadActiveThemeScene(theme) {
      document.body.setAttribute("data-template", theme);
      
      // Update Exit button href
      document.getElementById("btnExitLanding").href = `template-${theme}.html`;

      document.querySelectorAll(".control-group .btn-ctrl").forEach(btn => {
        if (btn.textContent.toLowerCase().includes(theme + ":")) {
          btn.classList.add("active");
        } else if (btn.textContent.includes("A:") || btn.textContent.includes("B:") || btn.textContent.includes("C:")) {
          btn.classList.remove("active");
        }
      });

      const sceneScript = document.createElement("script");
      const fxScript = document.createElement("script");

      if (theme === "a") {
        sceneScript.src = "assets/js/scene-a.js";
        fxScript.src = "assets/js/fx.js";
      } else if (theme === "b") {
        sceneScript.src = "assets/js/scene-b.js";
        const fxCore = document.createElement("script");
        fxCore.src = "assets/js/fx-core.js";
        document.body.appendChild(fxCore);
        fxScript.src = "assets/js/fx-b.js";
      } else if (theme === "c") {
        sceneScript.src = "assets/js/scene-c.js";
        const fxCore = document.createElement("script");
        fxCore.src = "assets/js/fx-core.js";
        document.body.appendChild(fxCore);
        fxScript.src = "assets/js/fx-c.js";
      }

      document.body.appendChild(sceneScript);
      document.body.appendChild(fxScript);
    }

    // Connect Live SSOT Cloud Data Engine
    window.addEventListener("DOMContentLoaded", () => {
      setLang(currentLang);
      loadActiveThemeScene(currentTheme);
    });

    // Re-render when Live Content Engine updates from Google Sheet
    document.addEventListener("ipx:ready", () => {
      renderSlide(false);
    });

    /* ═══════════════════════════════════════════════════════════════
       SLIDE 13: INVESTOR LEAD SUBMISSION HANDLER (REAL GAS SYNC)
       ═══════════════════════════════════════════════════════════════ */
    function handleInvestorLeadSubmit() {
      const name = document.getElementById("leadName")?.value || "";
      const org = document.getElementById("leadOrg")?.value || "";
      const email = document.getElementById("leadEmail")?.value || "";
      const phone = document.getElementById("leadPhone")?.value || "";
      const msg = document.getElementById("leadMsg")?.value || "";
      const btn = document.getElementById("btnSubmitLead");

      if (!name || !email || !org) return;

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
          <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
          <span>${currentLang === 'zh' ? '正在安全記錄至 Google 表格...' : 'Logging to Google Sheet...'}</span>
        `;
      }

      const safePhone = phone ? (phone.startsWith("+") ? `'${phone}` : phone) : "";

      const payload = {
        action: "append",
        sheet_name: "INVESTOR_LEADS",
        "Timestamp": new Date().toISOString(),
        "Full Name": name,
        "Institution": org,
        "Corporate Email": email,
        "Phone": safePhone,
        "Message": msg,
        "Source": "Pitch Deck Slide 13",
        // Bilingual fallback keys for flexible header mapping
        "提交時間": new Date().toLocaleString(),
        "姓名": name,
        "機構/基金": org,
        "商務郵箱": email,
        "電話/WhatsApp": safePhone,
        "電話": safePhone,
        "合作意向": msg,
        "來源": "Project Indo-Phoenix Deck"
      };

      const gasUrl = (window.IPX_CONFIG && window.IPX_CONFIG.gasUrl) ? window.IPX_CONFIG.gasUrl : "";
      const gmailUrl = (window.IPX_CONFIG && window.IPX_CONFIG.gmailGasUrl) ? window.IPX_CONFIG.gmailGasUrl : "";

      // Pipeline 1: Record Lead into Google Sheet via Universal GAS Gateway
      if (gasUrl) {
        fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        }).catch(err => console.warn("Google Sheet sync note:", err));
      }

      // Pipeline 2: Auto-dispatch MII Passcode Access Email via Universal Gmail Gateway
      if (gmailUrl && email) {
        const mailBody = `Dear ${name || 'Investor'},\n\nThank you for your interest in Project Indo-Phoenix (India's 1st Strategic Aerospace & Defense FPC Hub).\n\nHere is your official access credential for our interactive AI Data Room:\n\n* AI Data Room URL: https://notebook.google.com/notebook/be750388-f5f2-4027-9f85-f45f61c53ba7\n* Access Passcode: MII (Make In India Initiative)\n\nInside the AI Data Room, you can freely query 23 verified dossiers including pan-India Defense/EV market KYC profiles, 5-year mathematical financial models, and core technical team manufacturing capabilities.\n\nNote: Requires signing into any Google account for read-only interactive Q&A exploration.\n\n========================================\nBest regards,\nProject Indo-Phoenix Founding Team\nIndia Strategic Aerospace & Defense FPC Initiative\nDirect Contact: gyhongyu@gmail.com`;

        const mailPayload = {
          action: "send",
          to: email,
          subject: "[Project Indo-Phoenix] Official AI Data Room Access Key (Passcode: MII)",
          body: mailBody,
          no_signature: true
        };

        fetch(gmailUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(mailPayload)
        }).catch(err => console.warn("Gmail auto-responder note:", err));
      }

      // Render instant executive confirmation (Perfect Centered Card)
      setTimeout(() => {
        const formCard = document.getElementById("investorInquiryForm");
        if (formCard) {
          formCard.style.minHeight = "240px";
          formCard.style.display = "flex";
          formCard.style.alignItems = "center";
          formCard.style.justifyContent = "center";
          formCard.innerHTML = `
            <div style="background:rgba(52,211,153,0.08); border:1px solid rgba(52,211,153,0.4); border-radius:10px; padding:24px 20px; text-align:center; width:100%; box-shadow:0 0 25px rgba(52,211,153,0.15);">
              <div style="color:#34d399; margin-bottom:12px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div style="font-family:var(--font-display); font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">
                ${currentLang === 'zh' ? '商務會談意向已成功登記！' : 'Inquiry Successfully Submitted!'}
              </div>
              <div style="font-size:12px; color:#cbd5e1; line-height:1.6;">
                ${currentLang === 'zh' ? `感謝 <strong>${name}</strong> (${org}) 先進，已記錄至專案資料庫，且通行金鑰已自動發送至 <strong>${email}</strong>。創始團隊將於 24 小時內親自與您聯繫。` : `Thank you, <strong>${name}</strong> (${org}). Inquiry recorded and access passkey dispatched to <strong>${email}</strong>. Our team will reach out within 24 hours.`}
              </div>
            </div>
          `;
        }
      }, 500);
    }

    /* ═══════════════════════════════════════════════════════════════
       PASSCODE GATEWAY MODAL CONTROLLER (MII GENTLEMAN'S CODE)
       ═══════════════════════════════════════════════════════════════ */
    function openPasscodeModal() {
      const modal = document.getElementById("passcodeModal");
      const titleEl = document.getElementById("passcodeModalTitle");
      const descEl = document.getElementById("passcodeModalDesc");
      const hintEl = document.getElementById("passcodeModalHint");
      const btnCancel = document.getElementById("btnPasscodeCancel");
      const btnConfirm = document.getElementById("btnPasscodeConfirm");
      const inputEl = document.getElementById("passcodeInput");

      if (currentLang === 'zh') {
        if (titleEl) titleEl.textContent = '解鎖官方 AI 智能資料室';
        if (descEl) descEl.textContent = '本資料室收錄 23 份市場研報與技術智庫，請輸入訪問密碼進入：';
        if (hintEl) hintEl.innerHTML = '<strong>通行提示</strong>：若您尚未取得密碼，請在左側留言板送出意向，系統將發送通行密碼至您的登記郵箱。';
        if (btnCancel) btnCancel.textContent = '取消';
        if (btnConfirm) btnConfirm.textContent = '解鎖進入 ↗';
      } else {
        if (titleEl) titleEl.textContent = 'Unlock Official AI Data Room';
        if (descEl) descEl.textContent = 'Access 23 deep-dive market intelligence dossiers and buyer KYC. Enter access passcode:';
        if (hintEl) hintEl.innerHTML = '<strong>Passcode Notice</strong>: If you do not have the passcode, please submit an inquiry on the left; the passcode will be dispatched to your email.';
        if (btnCancel) btnCancel.textContent = 'Cancel';
        if (btnConfirm) btnConfirm.textContent = 'Unlock & Enter ↗';
      }
      
      if (inputEl) {
        inputEl.value = "";
        inputEl.style.borderColor = "rgba(255, 255, 255, 0.15)";
      }

      if (modal) {
        modal.classList.add("is-active");
        setTimeout(() => { if (inputEl) inputEl.focus(); }, 150);
      }
    }

    function closePasscodeModal(e) {
      if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains("btn-modal-cancel")) return;
      const modal = document.getElementById("passcodeModal");
      if (modal) modal.classList.remove("is-active");
    }

    function verifyPasscodeAndOpen() {
      const inputEl = document.getElementById("passcodeInput");
      const val = (inputEl ? inputEl.value : "").trim().toUpperCase();
      const targetUrl = "https://notebook.google.com/notebook/be750388-f5f2-4027-9f85-f45f61c53ba7";

      // Gentleman's Passcode Verification: "MII" (Make In India)
      if (val === "MII") {
        if (inputEl) inputEl.style.borderColor = "#34d399";
        const modal = document.getElementById("passcodeModal");
        if (modal) modal.classList.remove("is-active");
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        if (inputEl) {
          inputEl.style.borderColor = "#ef4444";
          inputEl.focus();
          alert(currentLang === 'zh' ? '訪問密碼不正確。若您尚未取得密碼，請在左側留言板送出意向，系統將發送密碼至您的登記郵箱。' : 'Incorrect passcode. If you do not have the access code, please submit an inquiry on the left to receive it.');
        }
      }
    }
