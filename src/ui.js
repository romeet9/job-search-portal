import { timeAgo, analyzeLogo, safeInitial } from './utils.js';

export function updateUsageStatsUI(stats) {
  if (!stats) return;
  document.getElementById('stat-total-jobs').textContent = stats.totalJobs.toLocaleString();
  document.getElementById('stat-today-jobs').textContent = stats.totalJobs.toLocaleString();
  document.getElementById('stat-daily-left').textContent = stats.dailyLeft;
  document.getElementById('stat-monthly-left').textContent = stats.monthlyLeft;
}

export function updateMapStats(totalRoles, cityLabel) {
  document.getElementById('map-stat-role').textContent =
    `${totalRoles} live role${totalRoles !== 1 ? 's' : ''} across ${cityLabel}`;
}

export function renderCompanyList(companies, selectedId, onCompanyClick) {
  const list = document.getElementById('company-list');
  list.innerHTML = '';

  if (companies.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <p>No results found.<br/>Try adjusting your filters or search.</p>
    </div>`;
    return;
  }

  companies.forEach((company, i) => {
    const card = document.createElement('div');
    card.className = `company-card${company.id === selectedId ? ' active' : ''}`;
    card.dataset.id = company.id;
    card.style.animationDelay = `${Math.min(i * 25, 200)}ms`;

    const logoHtml = company.logoUrl
      ? `<img src="${company.logoUrl}" alt="${company.name}" crossorigin="anonymous"
           onload="analyzeLogo(this)"
           onerror="if(!this.src.includes('google.com')){ this.src='https://www.google.com/s2/favicons?domain='+('${company.domain || ''}')+'&sz=128'; } else { this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company.name, company.logoInitial)}</span>'; }" />`
      : `<span class="logo-fallback">${safeInitial(company.name, company.logoInitial)}</span>`;

    const rolesHtml = company.jobs.slice(0, 2).map(j =>
      `<div class="company-role-item">${j.title}</div>`
    ).join('') + (company.jobs.length > 2
      ? `<div class="company-role-item" style="color:var(--text-muted)">+${company.jobs.length - 2} more</div>`
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
      <div class="role-count-badge">${company.jobs.length}</div>
    `;
    card.addEventListener('click', () => onCompanyClick(company));
    list.appendChild(card);
  });
}

export function renderDetailView(company, onClose) {
  const logoHtml = company.logoUrl
    ? `<img src="${company.logoUrl}" alt="${company.name}" crossorigin="anonymous"
         onload="analyzeLogo(this)"
         onerror="if(!this.src.includes('google.com')){ this.src='https://www.google.com/s2/favicons?domain='+('${company.domain || ''}')+'&sz=128'; } else { this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company.name, company.logoInitial)}</span>'; }" />`
    : `<span class="logo-fallback">${safeInitial(company.name, company.logoInitial)}</span>`;

  const jobCardsHtml = company.jobs.map(job => `
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
    </div>`).join('');

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
      <div class="positions-title">Open Positions — ${company.jobs.length} role${company.jobs.length !== 1 ? 's' : ''}</div>
      ${jobCardsHtml}
    </div>
  `;

  document.getElementById('list-view').classList.add('hidden');
  document.getElementById('detail-view').classList.remove('hidden');
  document.getElementById('back-btn').classList.remove('hidden');
  document.getElementById('company-detail').scrollTop = 0;
}

export function showListView() {
  document.getElementById('list-view').classList.remove('hidden');
  document.getElementById('detail-view').classList.add('hidden');
  document.getElementById('back-btn').classList.add('hidden');
}

export function setSheetPos(sidebar, y, animate = false) {
  sidebar.style.transition = animate ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
  sidebar.style.transform = `translateY(${y}px)`;
  
  const h = window.innerHeight;
  const collapsed = h - 48;
  const clampedY = Math.min(collapsed, y);
  
  const progress = Math.max(0, Math.min(1, 1 - (clampedY / collapsed)));
  const blurOverlay = document.getElementById('backdrop-blur');
  if (blurOverlay) {
    blurOverlay.style.opacity = progress;
    blurOverlay.style.pointerEvents = progress > 0.1 ? 'auto' : 'none';
    blurOverlay.style.backdropFilter = `blur(${progress * 12}px)`;
  }
}
