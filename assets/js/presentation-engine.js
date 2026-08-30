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

      // 3. Space Allocation Area Matrix Tiles (Slide 4)
      else if (slide.type === "space-matrix-visual") {
        html += `
          <div class="space-matrix-grid">
            ${slide.spaces.map((s, idx) => `
              <div class="space-tile-card gs-anim-card ${idx === 0 ? 'active' : ''}" 
                   id="spaceCard_${idx}"
                   onclick="selectGenericCard('spaceCard', ${idx}, '${s.detail.replace(/'/g, "\\'")}')"
                   onmouseenter="selectGenericCard('spaceCard', ${idx}, '${s.detail.replace(/'/g, "\\'")}')">
                <div class="space-tile-top">
                  <div class="space-tile-title">${s.title}</div>
                  <div class="space-tile-area">${s.area}</div>
                </div>
                <div class="space-tile-std">${s.std}</div>
                <div class="space-tile-desc">${s.desc}</div>

                <div class="card-smart-tooltip">
                    <div class="tooltip-tag">🏗️ ${currentLang === 'zh' ? '廠房基建規劃依據' : 'Infrastructure & Compliance'}</div>
                    <div class="tooltip-text">${s.detail}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="cockpit-floating-bar">
            <div class="floating-bar-icon">🏗️</div>
            <div class="floating-bar-text" id="genericFloatingText">
              <strong>${currentLang === 'zh' ? '廠房基建規劃依據' : 'Infrastructure & SPCB Compliance'}:</strong> ${slide.spaces[0].detail}
            </div>
          </div>
        `;
      }

      // 4. OpEx Cost Composition Visual Cockpit (Slide 6)
      else if (slide.type === "opex-cockpit-visual") {
        html += `
          <div class="opex-cockpit-grid">
            ${slide.costs.map((c, idx) => `
              <div class="opex-cost-card gs-anim-card ${idx === 0 ? 'active' : ''}" 
                   id="opexCard_${idx}"
                   onclick="selectGenericCard('opexCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')"
                   onmouseenter="selectGenericCard('opexCard', ${idx}, '${c.detail.replace(/'/g, "\\'")}')">
                <div>
                  <div class="opex-card-head">
                    <div class="opex-card-title">${c.title}</div>
                    <div class="opex-card-pct">${c.pct}</div>
                  </div>
                  <div class="opex-card-amount">${c.amount} <span style="font-size:12px; font-family:var(--font-body); color:var(--ink-sub);">/ mo</span></div>
                  <div class="opex-bar-ratio">
                    <div class="opex-var-bar" style="width:${c.varPct};" title="Variable Cost"></div>
                    <div class="opex-fix-bar" style="width:${c.fixPct};" title="Fixed Cost"></div>
                  </div>
                  <div class="opex-ratio-labels">
                    <span>${currentLang === 'zh' ? '變動成本' : 'Var'}: ${c.varPct}</span>
                    <span>${currentLang === 'zh' ? '固定成本' : 'Fix'}: ${c.fixPct}</span>
                  </div>
                </div>
                <div style="font-size:11.5px; color:var(--ink-sub); line-height:1.4; margin-top:8px;">${c.sub}</div>

                <div class="card-smart-tooltip">
                    <div class="tooltip-tag">📊 ${currentLang === 'zh' ? '成本行為與供應鏈洞察' : 'Cost Behavior Insight'}</div>
                    <div class="tooltip-text">${c.detail}</div>
                </div>
              </div>
            `).join("")}
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
      // 4. CapEx & SPECS Subsidy Comparison Cockpit (Slide 5)
      else if (slide.type === "capex-cockpit-visual") {
        html += `
          <div class="capex-cockpit-grid">
            ${slide.items.map((it, idx) => `
              <div class="capex-row-card gs-anim-card ${idx === 0 ? 'active' : ''}" 
                   id="capexCard_${idx}"
                   onclick="selectGenericCard('capexCard', ${idx}, '${it.detail.replace(/'/g, "\\'")}')"
                   onmouseenter="selectGenericCard('capexCard', ${idx}, '${it.detail.replace(/'/g, "\\'")}')">
                <div class="capex-title-block">
                  <span class="capex-icon">🏛️</span>
                  <div>
                    <div class="capex-title">${it.title}</div>
                    <div class="capex-pct">${it.pct} ${currentLang === 'zh' ? '佔比' : 'Share'}</div>
                  </div>
                </div>
                <div class="capex-val-col">
                  <div class="capex-val-num">${it.kunshan}</div>
                  <div class="capex-val-sub">${currentLang === 'zh' ? '崑山參考基準' : 'Kunshan Ref'}</div>
                </div>
                <div class="capex-val-col">
                  <div class="capex-val-num accent">${it.india}</div>
                  <div class="capex-val-sub">${currentLang === 'zh' ? '印度建廠預算' : 'India Budget'}</div>
                </div>
                <div class="capex-val-col">
                  <div class="capex-val-num subsidy">${it.subsidy}</div>
                  <div class="capex-val-sub">${currentLang === 'zh' ? 'SPECS 25% 返還' : 'SPECS 25% Cash'}</div>
                </div>
                <div class="capex-val-col">
                  <div class="capex-val-num" style="color:var(--ink);">${it.net}</div>
                  <div class="capex-val-sub">${currentLang === 'zh' ? '投資人淨投入' : 'Net Investment'}</div>
                </div>

                <div class="card-smart-tooltip">
                    <div class="tooltip-tag">🛡️ ${currentLang === 'zh' ? '台方責任邊界與風控依據' : 'Technical Boundary & Risk Control'}</div>
                    <div class="tooltip-text">${it.detail}</div>
                </div>
              </div>
            `).join("")}
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
      // 5. Master BEP Financial Cockpit (Slide 7)
      else if (slide.type === "bep-master-cockpit") {
        html += `
          <div class="bep-cockpit-grid">
            <!-- Left: Master BEP Gauge & Sensitivity Simulation -->
            <div class="gauge-card-master gs-anim-card">
              <div>
                <div class="slide-tag" style="font-size:10px; margin-bottom:8px;">BREAK-EVEN METER</div>
                <div class="gauge-main-wrap">
                  <div class="gauge-circle">
                    <div class="gauge-arc" id="cockpitGaugeArc"></div>
                    <div class="gauge-value count-target" data-target="${slide.bepVal}">0</div>
                  </div>
                  <div class="gauge-threshold-text">
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
            </div>

            <!-- Right: 6 Modular Financial Metrics Cards -->
            <div class="cockpit-cards-grid">
              ${slide.cards.map((c, idx) => `
                <div class="cockpit-mini-card gs-anim-card ${idx === 0 ? 'active' : ''}" 
                     id="cockpitCard_${idx}" 
                     onclick="selectCockpitCard(${idx})"
                     onmouseenter="previewCockpitCard(${idx})">
                  <div class="mini-card-header">
                    <div class="mini-card-label">${c.label}</div>
                    <span style="font-size:10px; color:var(--accent); opacity:0.7;">●</span>
                  </div>
                  <div class="mini-card-val count-target" data-target="${c.val}">0</div>
                  <div class="mini-card-sub">${c.sub}</div>

                  <div class="card-smart-tooltip">
                    <div class="tooltip-tag">💡 ${currentLang === 'zh' ? '財務指標決策依據' : 'Strategic Insight'}</div>
                    <div class="tooltip-text">${c.detail}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Non-Intrusive Floating Context Explanation Bar -->
          <div class="cockpit-floating-bar" id="cockpitFloatingBar">
            <div class="floating-bar-icon">💡</div>
            <div class="floating-bar-text" id="cockpitFloatingText">
              <strong>${currentLang === 'zh' ? '決策依據' : 'Strategic Insight'}:</strong> ${slide.cards[0].detail}
            </div>
          </div>
        `;
      }
      // 6. Flow Pipeline
      else if (slide.type === "flow-pipeline") {
        html += `
          <div class="flow-pipeline">
            ${slide.steps.map(st => `
              <div class="flow-card gs-anim-flow">
                <div class="flow-step-num">${st.num}</div>
                <div class="flow-title">${st.title}</div>
                <div class="flow-desc">${st.desc}</div>
              </div>
            `).join("")}
          </div>
        `;
      }
      // 7. CTA Hub Box
      else if (slide.type === "cta-hub") {
        html += `
          <div class="cta-hub-box gs-anim-hero">
            <div class="cta-hub-title">${slide.title}</div>
            <div class="cta-hub-desc">${slide.desc}</div>
            <div class="cta-btn-group">
              <a href="#contact" class="btn-cta-primary" onclick="alert(currentLang==='zh'?'已為您登記申請，投資專員將於 24 小時內與您聯繫。':'Access request received. An investor relations manager will reach out within 24 hours.')">${slide.primaryBtn}</a>
              <a href="template-${currentTheme}.html" class="btn-nav">${slide.landingBtn}</a>
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
