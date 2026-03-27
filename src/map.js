import { CITY_BOUNDS } from './constants.js';
import { analyzeLogo, safeInitial } from './utils.js';

let map;
let markers = {};

export function initMap(activeCity, onMarkerClick) {
  const bounds = CITY_BOUNDS[activeCity];
  map = L.map('map', {
    center: bounds.center,
    zoom: bounds.zoom,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  map.zoomControl.setPosition('bottomleft');
  return map;
}

export function createMarkerIcon(company, isSelected) {
  const inner = company.logoUrl
    ? `<img src="${company.logoUrl}" alt="${company.name}" crossorigin="anonymous"
         onload="analyzeLogo(this)"
         onerror="if(!this.src.includes('google.com')){ this.src='https://www.google.com/s2/favicons?domain='+('${company.domain || ''}')+'&sz=128'; } else { this.parentElement.style.background='var(--surface3)'; this.outerHTML='<span class=\\'logo-fallback\\'>${safeInitial(company.name, company.logoInitial)}</span>'; }" />`
    : `<span class="logo-fallback">${safeInitial(company.name, company.logoInitial)}</span>`;

  return L.divIcon({
    html: `<div class="map-marker${isSelected ? ' selected' : ''}" style="position:relative;">
             <div class="map-marker-inner">${inner}</div>
             <div class="marker-count">${company.jobs.length}</div>
           </div>`,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function renderMarkers(companies, selectedId, onMarkerClick) {
  const filteredIds = new Set(companies.map(c => c.id));
  Object.keys(markers).forEach(id => {
    if (!filteredIds.has(id)) { markers[id].remove(); delete markers[id]; }
  });

  companies.forEach(company => {
    const icon = createMarkerIcon(company, company.id === selectedId);
    if (markers[company.id]) {
      markers[company.id].setIcon(icon);
      return;
    }
    const marker = L.marker([company.lat, company.lng], { icon }).addTo(map);
    marker.on('click', () => onMarkerClick(company));
    markers[company.id] = marker;
  });
}

export function flyToCity(city) {
  const bounds = CITY_BOUNDS[city];
  if (bounds) map.flyTo(bounds.center, bounds.zoom, { duration: 1 });
}

export function flyToCompany(lat, lng) {
  map.flyTo([lat, lng], 13, { duration: 0.8 });
}
