// ============================================================
// app.js — DesignJobs India v3 (Live JSearch Edition)
// Dynamic city fetch • Proxy integration • Logo markers
// ============================================================

(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────
  const PROXY_URL = 'http://localhost:3000/api/jobs';

  const CITY_BOUNDS = {
    bengaluru: { center: [12.9716, 77.5946], zoom: 12 },
    mumbai:    { center: [19.0760, 72.8777], zoom: 12 },
    delhi:     { center: [28.6139, 77.2090], zoom: 11 },
  };

  // ── State ────────────────────────────────────────────────
  let COMPANIES    = []; 
  let activeCity   = 'bengaluru';
  let activeFilter = 'Product Designer'; // Default to Product Designer
  let searchQuery  = '';
  let selectedId   = null;
  let markers = {}; // id → L.marker
  let isLoading = false;

  // ── Map ──────────────────────────────────────────────────
  const map = L.map('map', {
    center: CITY_BOUNDS.bengaluru.center,
    zoom: CITY_BOUNDS.bengaluru.zoom,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  map.zoomControl.setPosition('bottomleft');

  // ── API Fetching ─────────────────────────────────────────
  async function loadJobs() {
    if (isLoading) return;
    isLoading = true;
    document.getElementById('loading-overlay').classList.remove('hidden');
    
    try {
      const resp = await fetch(`${PROXY_URL}?city=${activeCity}&role=${activeFilter}`);
      const result = await resp.json();
      
      COMPANIES = result.data || [];
      updateUsageStatsUI(result.stats);
      
      selectedId = null;
      showList(); // Reset view to list
      renderAll();
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      isLoading = false;
      document.getElementById('loading-overlay').classList.add('hidden');
    }
  }

  // ── Filtered data ─────────────────────────────────────────
  function getFilteredCompanies() {
    const q = searchQuery.toLowerCase().trim();
    return COMPANIES.filter(company => {
      // Role filter is now handled at API level, but we can still search locally
      const matchesSearch =
        !q ||
        company.name.toLowerCase().includes(q) ||
        company.city.toLowerCase().includes(q) ||
        company.about.toLowerCase().includes(q) ||
        company.jobs.some(j =>
          j.title.toLowerCase().includes(q) ||
          (j.tools || []).some(t => t.toLowerCase().includes(q)) ||
          (j.skills || []).some(s => s.toLowerCase().includes(q))
        );
      return matchesSearch;
    });
  }

  function getVisibleJobs(company) {
    return company.jobs; // Filtered at API level
  }

  // ── Markers ───────────────────────────────────────────────
  function safeInitial(company) {
    return company.logoInitial || company.name.slice(0, 2).toUpperCase();
  }

  function createMarkerIcon(company, isSelected) {
    const jobs = getVisibleJobs(company);
    const countBadge = jobs.length > 0
      ? `<div class="marker-count">${jobs.length}</div>` : '';
    const inner = company.logoUrl
      ? `<img src="${company.logoUrl}" alt="${company.name}" 
           onload="this.parentElement.style.background='white'"
           onerror="this.parentElement.style.background='var(--surface3)'; this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company)}</span>'" />`
      : `<span class="logo-fallback">${safeInitial(company)}</span>`;

    return L.divIcon({
      html: `<div class="map-marker${isSelected ? ' selected' : ''}" style="position:relative;">
               <div class="map-marker-inner">${inner}</div>
               ${countBadge}
             </div>`,
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }

  function renderMarkers() {
    const filtered = getFilteredCompanies();
    const filteredIds = new Set(filtered.map(c => c.id));

    // Remove stale markers
    Object.keys(markers).forEach(id => {
      if (!filteredIds.has(id)) { markers[id].remove(); delete markers[id]; }
    });

    filtered.forEach(company => {
      const icon = createMarkerIcon(company, company.id === selectedId);
      if (markers[company.id]) {
        markers[company.id].setIcon(icon);
        return;
      }
      const marker = L.marker([company.lat, company.lng], { icon }).addTo(map);
      marker.on('click', () => {
        showDetail(company.id);
        map.flyTo([company.lat, company.lng], 13, { duration: 0.8 });
      });
      markers[company.id] = marker;
    });
  }

  // ── Usage Stats UI ───────────────────────────────────────
  function updateUsageStatsUI(stats) {
    if (!stats) return;
    document.getElementById('stat-total-jobs').textContent = stats.totalJobs.toLocaleString();
    document.getElementById('stat-today-jobs').textContent = stats.totalJobs.toLocaleString(); // Simplified for now
    document.getElementById('stat-daily-left').textContent = stats.dailyLeft;
    document.getElementById('stat-monthly-left').textContent = stats.monthlyLeft;
  }

  function updateStats() {
    const fc = getFilteredCompanies();
    const totalRoles = fc.reduce((a, c) => a + getVisibleJobs(c).length, 0);
    const cityLabel = fc[0]?.city || activeCity.charAt(0).toUpperCase() + activeCity.slice(1);
    document.getElementById('map-stat-role').textContent =
      `${totalRoles} live role${totalRoles !== 1 ? 's' : ''} across ${cityLabel}`;
  }

  // ── Company list ──────────────────────────────────────────
  function renderList() {
    const list = document.getElementById('company-list');
    const filtered = getFilteredCompanies();
    list.innerHTML = '';

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <p>No results found.<br/>Try adjusting your filters or search.</p>
      </div>`;
      return;
    }

    filtered.forEach((company, i) => {
      const jobs = getVisibleJobs(company);
      const card = document.createElement('div');
      card.className = `company-card${company.id === selectedId ? ' active' : ''}`;
      card.dataset.id = company.id;
      card.style.animationDelay = `${Math.min(i * 25, 200)}ms`;

      const logoHtml = company.logoUrl
        ? `<img src="${company.logoUrl}" alt="${company.name}"
             onerror="this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company)}</span>'" />`
        : `<span class="logo-fallback">${safeInitial(company)}</span>`;

      const rolesHtml = jobs.slice(0, 2).map(j =>
        `<div class="company-role-item">${j.title}</div>`
      ).join('') + (jobs.length > 2
        ? `<div class="company-role-item" style="color:var(--text-muted)">+${jobs.length - 2} more</div>`
        : '');

      card.innerHTML = `
        <div class="company-logo">${logoHtml}</div>
        <div class="company-info">
          <div class="company-name">${company.name}</div>
          <div class="company-city">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            ${company.city}
          </div>
          <div class="company-roles">${rolesHtml}</div>
        </div>
        <div class="role-count-badge">${jobs.length}</div>
      `;
      card.addEventListener('click', () => {
        showDetail(company.id);
        map.flyTo([company.lat, company.lng], 13, { duration: 0.8 });
      });
      list.appendChild(card);
    });
  }

  // ── Detail view ───────────────────────────────────────────
  function showDetail(companyId) {
    const company = COMPANIES.find(c => c.id === companyId);
    if (!company) return;
    selectedId = companyId;
    renderMarkers();
    renderList();

    const jobs = getVisibleJobs(company);
    const logoHtml = company.logoUrl
      ? `<img src="${company.logoUrl}" alt="${company.name}"
           onerror="this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company)}</span>'" />`
      : `<span class="logo-fallback">${safeInitial(company)}</span>`;

    const jobCardsHtml = jobs.map(job => {
      return `
        <div class="job-card">
          <div class="job-title">${job.title}</div>
          <div class="job-meta-row">
            <span class="job-badge exp">⏱ ${job.experience || 'Not specified'}</span>
            <span class="job-badge">${job.type}</span>
            <span class="job-badge">${job.mode}</span>
            <span class="job-badge source">⚡ ${job.source}</span>
          </div>
          <a class="job-link" href="${job.applyUrl}" target="_blank" rel="noopener noreferrer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            ${job.applyLabel || 'Apply Now'}
          </a>
        </div>`;
    }).join('');

    document.getElementById('company-detail').innerHTML = `
      <div class="detail-header">
        <div class="detail-logo">${logoHtml}</div>
        <div class="detail-name">${company.name}</div>
        <div class="detail-city">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${company.city}
        </div>
        <p class="detail-about">${company.about}</p>
      </div>
      <div class="positions-section">
        <div class="positions-title">Open Positions — ${jobs.length} role${jobs.length !== 1 ? 's' : ''}</div>
        ${jobCardsHtml}
      </div>
    `;

    document.getElementById('list-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    document.getElementById('back-btn').classList.remove('hidden');
    document.getElementById('company-detail').scrollTop = 0;
  }

  function showList() {
    selectedId = null;
    renderMarkers();
    renderList();
    document.getElementById('list-view').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('back-btn').classList.add('hidden');
  }

  // ── City tabs ─────────────────────────────────────────────
  document.getElementById('city-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.city-tab');
    if (!tab) return;
    if (tab.dataset.city === activeCity) return;

    document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCity = tab.dataset.city;

    const bounds = CITY_BOUNDS[activeCity];
    if (bounds) map.flyTo(bounds.center, bounds.zoom, { duration: 1 });
    
    loadJobs();
  });


  // ── Search ────────────────────────────────────────────────
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  let searchTimer;

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    searchClear.classList.toggle('hidden', !searchQuery);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (selectedId) showList();
      renderAll();
    }, 120);
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = ''; searchQuery = '';
    searchClear.classList.add('hidden');
    renderAll();
  });

  // ── Back ──────────────────────────────────────────────────
  document.getElementById('back-btn').addEventListener('click', () => {
    showList();
    const bounds = CITY_BOUNDS[activeCity];
    map.flyTo(bounds.center, bounds.zoom, { duration: 1 });
  });

  // ── Render all ────────────────────────────────────────────
  function renderAll() {
    updateStats();
    renderMarkers();
    renderList();
  }

  // ── Init ──────────────────────────────────────────────────
  loadJobs();

})();
