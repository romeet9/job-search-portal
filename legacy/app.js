// ============================================================
// app.js — DesignJobs India v3 (Live JSearch Edition)
// Dynamic city fetch • Proxy integration • Logo markers
// ============================================================

(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────
  const PROXY_URL = '/api/jobs';

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

  function expandSheet(forceFull = false) {
    if (window.innerWidth > 768) return;
    const s = document.getElementById('sidebar');
    const h = window.innerHeight;
    const targetY = forceFull ? 0 : h * 0.35;
    s.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    s.style.transform = `translateY(${targetY}px)`;
    s.classList.add('active');
  }

  function timeAgo(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  // ── Logo Adaptive Contrast ──────────────────────────────
  window.analyzeLogo = function(img) {
    const container = img.parentElement;
    if (!container) return;
    
    // Clearbit/Brandfetch might block canvas via CORS, so we use a try-catch
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 10; canvas.height = 10;
      
      // We need crossOrigin set to anonymous for this to work with remote images
      // but only if the server allows it. Clearbit usually does.
      img.crossOrigin = "Anonymous";

      ctx.drawImage(img, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      
      let r = 0, g = 0, b = 0, count = 0;
      let hasTransparency = false;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 20) { // Visible pixel
          r += data[i]; g += data[i + 1]; b += data[i + 2];
          count++;
        } else {
          hasTransparency = true;
        }
      }

      if (count === 0) {
        container.style.background = 'var(--surface3)';
        return;
      }

      const avg = (r + g + b) / (count * 3);
      
      // User Logic: 
      // White/Light Logo -> Black Background
      // Black/Dark Logo -> White Background
      if (avg > 180) { 
        container.style.background = '#0b0b0b'; 
      } else if (avg < 110) { 
        container.style.background = '#ffffff'; 
      } else {
        container.style.background = '#f8f8f8'; // Default high-clarity background
      }
    } catch (e) {
      // If canvas is tainted/blocked, default to a high-contrast white bg for logos
      container.style.background = '#ffffff';
    }
  };

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
      ? `<img src="${company.logoUrl}" alt="${company.name}" crossorigin="anonymous"
           onload="analyzeLogo(this)"
           onerror="if(!this.src.includes('google.com')){ this.src='https://www.google.com/s2/favicons?domain='+('${company.domain || ''}')+'&sz=128'; } else { this.parentElement.style.background='var(--surface3)'; this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company)}</span>'; }" />`
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
        expandSheet(); // Auto-expand on mobile marker click
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
        ? `<img src="${company.logoUrl}" alt="${company.name}" crossorigin="anonymous"
             onload="analyzeLogo(this)"
             onerror="if(!this.src.includes('google.com')){ this.src='https://www.google.com/s2/favicons?domain='+('${company.domain || ''}')+'&sz=128'; } else { this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company)}</span>'; }" />`
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
      ? `<img src="${company.logoUrl}" alt="${company.name}" crossorigin="anonymous"
           onload="analyzeLogo(this)"
           onerror="if(!this.src.includes('google.com')){ this.src='https://www.google.com/s2/favicons?domain='+('${company.domain || ''}')+'&sz=128'; } else { this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company)}</span>'; }" />`
      : `<span class="logo-fallback">${safeInitial(company)}</span>`;

    const jobCardsHtml = jobs.map(job => {
      return `
        <div class="job-card">
          <div class="job-title">${job.title}</div>
          <div class="job-meta-row">
            <span class="job-badge exp">⏱ ${job.experience || 'Not specified'}</span>
            <span class="job-badge">${job.type}</span>
            <span class="job-badge">${job.mode}</span>
            <span class="job-badge source">🗓 ${timeAgo(job.postedAt)}</span>
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

  // ── Refresh Button (Hard Reload) ──────────
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      // Luxury animation before reload
      refreshBtn.style.transform = 'scale(0.8) rotate(180deg)';
      refreshBtn.style.opacity = '0.5';
      setTimeout(() => window.location.reload(), 300);
    });
  }

  // ── Backdrop Blur Dismissal ────────────────
  const backdropBlur = document.getElementById('backdrop-blur');
  if (backdropBlur) {
    backdropBlur.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      setSheetPos(getSheetStates().collapsed, true);
    });
  }

  // ── Mobile Draggable Bottom Sheet ────────────────────────
  const sidebar = document.getElementById('sidebar');
  const dragHandle = document.querySelector('.drag-handle');
  
  if (sidebar && dragHandle) {
    let startY = 0;
    let startTranslateY = 0;
    let isDragging = false;
    let startTime = 0;
    
    const getSheetStates = () => {
      const h = window.innerHeight;
      return {
        collapsed: h - 48,
        expanded: h * 0.4,
        full: 0
      };
    };

    const setSheetPos = (y, animate = false) => {
      sidebar.style.transition = animate ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      sidebar.style.transform = `translateY(${y}px)`;
      
      const states = getSheetStates();
      // Ensure we NEVER exceed collapsed bound (vanishing point)
      const clampedY = Math.min(states.collapsed, y);
      if (clampedY !== y) sidebar.style.transform = `translateY(${clampedY}px)`;

      // Luxury Dynamic Blur & Map Shift
      const progress = Math.max(0, Math.min(1, 1 - (clampedY / states.collapsed)));
      const blurOverlay = document.getElementById('backdrop-blur');
      if (blurOverlay) {
        blurOverlay.style.opacity = progress;
        blurOverlay.style.pointerEvents = progress > 0.1 ? 'auto' : 'none';
        blurOverlay.style.backdropFilter = `blur(${progress * 12}px)`;
      }
      
      document.body.classList.toggle('sidebar-active', clampedY < states.collapsed - 10);
    };

    dragHandle.addEventListener('touchstart', (e) => {
      if (window.innerWidth > 768) return;
      isDragging = true;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      
      const transform = window.getComputedStyle(sidebar).transform;
      const matrix = new WebKitCSSMatrix(transform);
      startTranslateY = matrix.m42;
      
      setSheetPos(startTranslateY, false);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const states = getSheetStates();
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      // CLAMP: Prevent going below collapsed or above top
      const newY = Math.min(states.collapsed, Math.max(0, startTranslateY + deltaY));
      setSheetPos(newY, false);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const duration = Date.now() - startTime;
      
      const transform = window.getComputedStyle(sidebar).transform;
      const matrix = new WebKitCSSMatrix(transform);
      const endY = matrix.m42;
      const states = getSheetStates();
      
      // Handle Tap on handle: Toggle between states
      if (duration < 250 && Math.abs(endY - startTranslateY) < 15) {
        const isCurrentlyCollapsed = endY > states.collapsed - 30;
        const target = isCurrentlyCollapsed ? states.expanded : states.collapsed;
        setSheetPos(target, true);
        return;
      }
      
      // Snap to closest
      let closest = states.collapsed;
      if (Math.abs(endY - states.expanded) < Math.abs(endY - closest)) closest = states.expanded;
      if (Math.abs(endY - states.full) < Math.abs(endY - closest)) closest = states.full;
      
      setSheetPos(closest, true);
    });

    // Handle Handle/Header Click for Auto-Move (Desk/Mob compatibility)
    const toggleSheet = () => {
      if (window.innerWidth > 768) return;
      const transform = window.getComputedStyle(sidebar).transform;
      const matrix = new WebKitCSSMatrix(transform);
      const currentY = matrix.m42;
      const states = getSheetStates();
      const isCurrentlyCollapsed = currentY > states.collapsed - 30;
      const target = isCurrentlyCollapsed ? states.expanded : states.collapsed;
      setSheetPos(target, true);
    };

    dragHandle.addEventListener('click', toggleSheet);
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) sidebarHeader.addEventListener('click', toggleSheet);
  }

  loadJobs();

})();
