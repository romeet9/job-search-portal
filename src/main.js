import { CITY_BOUNDS } from './constants.js';
import { fetchJobs } from './api.js';
import { initMap, renderMarkers, flyToCity, flyToCompany } from './map.js';
import { 
  updateUsageStatsUI, 
  updateMapStats, 
  renderCompanyList, 
  renderDetailView, 
  showListView,
  setSheetPos
} from './ui.js';

// ── State ────────────────────────────────────────────────
let currentCompanies = [];
let activeCity = 'bengaluru';
let activeFilter = 'Product Designer';
let searchQuery = '';
let selectedId = null;
let isLoading = false;

// ── Initialization ───────────────────────────────────────
const map = initMap(activeCity, (company) => {
  handleShowDetail(company.id);
  flyToCompany(company.lat, company.lng);
  expandSheet();
});

async function loadData() {
  if (isLoading) return;
  isLoading = true;
  document.getElementById('loading-overlay').classList.remove('hidden');
  
  try {
    const result = await fetchJobs(activeCity, activeFilter);
    currentCompanies = result.data || [];
    updateUsageStatsUI(result.stats);
    
    selectedId = null;
    showListView();
    renderAll();
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
  } finally {
    isLoading = false;
    document.getElementById('loading-overlay').classList.add('hidden');
  }
}

function renderAll() {
  const q = searchQuery.toLowerCase().trim();
  const filtered = currentCompanies.filter(company => {
    return !q || 
      company.name.toLowerCase().includes(q) ||
      company.city.toLowerCase().includes(q) ||
      company.about.toLowerCase().includes(q) ||
      company.jobs.some(j => j.title.toLowerCase().includes(q));
  });

  const totalRoles = filtered.reduce((a, c) => a + c.jobs.length, 0);
  const cityLabel = filtered[0]?.city || activeCity.charAt(0).toUpperCase() + activeCity.slice(1);
  
  updateMapStats(totalRoles, cityLabel);
  renderMarkers(filtered, selectedId, (company) => {
    handleShowDetail(company.id);
    flyToCompany(company.lat, company.lng);
    expandSheet();
  });
  renderCompanyList(filtered, selectedId, (company) => {
    handleShowDetail(company.id);
    flyToCompany(company.lat, company.lng);
  });
}

function handleShowDetail(id) {
  const company = currentCompanies.find(c => c.id === id);
  if (!company) return;
  selectedId = id;
  renderDetailView(company, () => handleBack());
  renderAll();
}

function handleBack() {
  selectedId = null;
  showListView();
  const bounds = CITY_BOUNDS[activeCity];
  map.flyTo(bounds.center, bounds.zoom, { duration: 1 });
  renderAll();
}

// ── Event Listeners ──────────────────────────────────────
document.getElementById('city-tabs').addEventListener('click', e => {
  const tab = e.target.closest('.city-tab');
  if (!tab || tab.dataset.city === activeCity) return;
  
  document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeCity = tab.dataset.city;
  
  flyToCity(activeCity);
  loadData();
});

const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
let searchTimer;

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  searchClear.classList.toggle('hidden', !searchQuery);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (selectedId) showListView();
    renderAll();
  }, 120);
});

searchClear.addEventListener('click', () => {
  searchInput.value = ''; 
  searchQuery = '';
  searchClear.classList.add('hidden');
  renderAll();
});

document.getElementById('back-btn').addEventListener('click', handleBack);

// ── Mobile Drawer Logic ──────────────────────────────────
const sidebar = document.getElementById('sidebar');
const dragHandle = document.querySelector('.drag-handle');

function expandSheet() {
  if (window.innerWidth > 768) return;
  setSheetPos(sidebar, window.innerHeight * 0.35, true);
  sidebar.classList.add('active');
}

if (sidebar && dragHandle) {
  dragHandle.addEventListener('click', () => {
    if (window.innerWidth > 768) return;
    const isCollapsed = sidebar.style.transform.includes(`${window.innerHeight - 48}px`);
    setSheetPos(sidebar, isCollapsed ? window.innerHeight * 0.35 : window.innerHeight - 48, true);
  });
}

// ── Refresh Logic ────────────────────────────────────────
const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    refreshBtn.style.transform = 'scale(0.8) rotate(180deg)';
    refreshBtn.style.opacity = '0.5';
    setTimeout(() => window.location.reload(), 300);
  });
}

// ── Kickoff ──────────────────────────────────────────────
loadData();
