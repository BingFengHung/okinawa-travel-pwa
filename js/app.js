// ==============================
// 沖繩旅遊地圖 — 主邏輯
// ==============================

(function () {
  'use strict';

  // ==================== State ====================
  const state = {
    map: null,
    currentDay: 0,
    currentSpot: null,
    currentPosition: null,
    routeLayer: null,
    markerLayer: null,
    nearbyLayer: null,
    positionMarker: null,
    watchId: null,
    notifyTimers: [],
    deferredInstallPrompt: null,
    itinerary: JSON.parse(JSON.stringify(APP_DATA.itinerary)),
    darkMode: localStorage.getItem('darkMode') === 'true'
  };

  // ==================== Map Init ====================
  function initMap() {
    state.map = L.map('map', {
      center: APP_DATA.center,
      zoom: APP_DATA.defaultZoom,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(state.map);

    state.routeLayer = L.layerGroup().addTo(state.map);
    state.markerLayer = L.layerGroup().addTo(state.map);
    state.nearbyLayer = L.layerGroup().addTo(state.map);
  }

  // ==================== Custom Markers ====================
  function createIcon(className, label) {
    return L.divIcon({
      className: '',
      html: `<div class="custom-marker ${className}">${label}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  // ==================== Sidebar Rendering ====================
  function renderDayTabs() {
    const container = document.getElementById('day-tabs');
    container.innerHTML = '';
    state.itinerary.forEach((day, i) => {
      const btn = document.createElement('button');
      btn.className = `day-tab ${i === state.currentDay ? 'active' : ''}`;
      btn.innerHTML = `
        Day ${day.day}
        <span class="tab-weather">${day.weather.icon} ${day.weather.temp}</span>
      `;
      btn.addEventListener('click', () => switchDay(i));
      container.appendChild(btn);
    });
  }

  function switchDay(dayIndex) {
    state.currentDay = dayIndex;
    state.currentSpot = null;
    renderDayTabs();
    renderSpotList();
    showDayOnMap();
  }

  function renderSpotList() {
    const container = document.getElementById('spot-list');
    container.innerHTML = '';
    const day = state.itinerary[state.currentDay];
    if (!day) return;

    day.spots.forEach((spot, i) => {
      // Spot card
      const card = document.createElement('div');
      card.className = `spot-card ${state.currentSpot === spot.id ? 'active' : ''}`;
      card.draggable = true;
      card.dataset.spotIndex = i;
      card.dataset.spotId = spot.id;

      card.innerHTML = `
        <div class="spot-header">
          <span class="spot-name">${spot.name}</span>
          <span class="spot-time">${spot.time} · ${spot.duration}分</span>
        </div>
        <div class="spot-desc">${spot.description}</div>
        ${spot.tips ? `<div class="spot-tips">💡 ${spot.tips}</div>` : ''}
        <div class="spot-actions">
          <button class="spot-action-btn btn-navigate" data-spot-id="${spot.id}">🧭 導航</button>
          <button class="spot-action-btn btn-nearby" data-spot-id="${spot.id}">🍜 附近美食</button>
          <button class="spot-action-btn btn-photo" data-spot-id="${spot.id}">📸 拍照</button>
        </div>
      `;

      // Click to fly to spot
      card.addEventListener('click', (e) => {
        if (e.target.closest('.spot-action-btn')) return;
        selectSpot(spot);
      });

      // Drag & Drop
      card.addEventListener('dragstart', onDragStart);
      card.addEventListener('dragover', onDragOver);
      card.addEventListener('dragleave', onDragLeave);
      card.addEventListener('drop', onDrop);
      card.addEventListener('dragend', onDragEnd);

      container.appendChild(card);

      // Transport connector
      if (spot.transportToNext && i < day.spots.length - 1) {
        const conn = document.createElement('div');
        conn.className = 'transport-connector';
        const icon = APP_DATA.transportIcons[spot.transportToNext.mode] || '➡️';
        conn.innerHTML = `
          <div class="transport-line" style="background:${spot.transportToNext.color}"></div>
          <div class="transport-info">
            ${icon} ${spot.transportToNext.note} · 約 ${spot.transportToNext.duration} 分鐘
          </div>
        `;
        container.appendChild(conn);
      }
    });

    // Bind action buttons
    container.querySelectorAll('.btn-navigate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const spot = findSpot(btn.dataset.spotId);
        if (spot) navigateToSpot(spot);
      });
    });

    container.querySelectorAll('.btn-nearby').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const spot = findSpot(btn.dataset.spotId);
        if (spot) showNearbyFood(spot);
      });
    });

    container.querySelectorAll('.btn-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const spot = findSpot(btn.dataset.spotId);
        if (spot) capturePhoto(spot);
      });
    });
  }

  function findSpot(id) {
    for (const day of state.itinerary) {
      const spot = day.spots.find(s => s.id === id);
      if (spot) return spot;
    }
    return null;
  }

  // ==================== Map Display ====================
  function showDayOnMap() {
    state.markerLayer.clearLayers();
    state.routeLayer.clearLayers();
    state.nearbyLayer.clearLayers();
    const day = state.itinerary[state.currentDay];
    if (!day) return;

    const bounds = [];

    day.spots.forEach((spot, i) => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: createIcon('marker-spot', i + 1)
      }).addTo(state.markerLayer);

      marker.bindPopup(`
        <div class="popup-title">${spot.name}</div>
        <div class="popup-detail">${spot.time} · ${spot.duration}分鐘</div>
      `);

      bounds.push([spot.lat, spot.lng]);
    });

    // Draw connecting lines between spots
    if (day.spots.length > 1) {
      for (let i = 0; i < day.spots.length - 1; i++) {
        const from = day.spots[i];
        const to = day.spots[i + 1];
        const transport = from.transportToNext;
        if (transport) {
          L.polyline(
            [[from.lat, from.lng], [to.lat, to.lng]],
            {
              color: transport.color || '#999',
              weight: 3,
              opacity: 0.4,
              dashArray: transport.mode === 'walk' ? '8, 8' : null
            }
          ).addTo(state.markerLayer);
        }
      }
    }

    if (bounds.length > 0) {
      state.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  function selectSpot(spot) {
    state.currentSpot = spot.id;
    renderSpotList();
    state.map.flyTo([spot.lat, spot.lng], 15, { duration: 1 });
  }

  // ==================== Navigation (Route Drawing) ====================
  function navigateToSpot(spot) {
    state.routeLayer.clearLayers();
    state.currentSpot = spot.id;
    renderSpotList();

    if (!state.currentPosition) {
      getCurrentPosition().then(pos => {
        if (pos) drawRoute(pos, spot);
        else alert('無法取得目前位置，請確認 GPS 已開啟');
      });
    } else {
      drawRoute(state.currentPosition, spot);
    }
  }

  function drawRoute(fromPos, toSpot) {
    state.routeLayer.clearLayers();

    const from = [fromPos.lat, fromPos.lng];
    const to = [toSpot.lat, toSpot.lng];

    // Draw polyline
    const polyline = L.polyline([from, to], {
      color: '#e94560',
      weight: 4,
      opacity: 0.8,
      dashArray: '12, 8'
    }).addTo(state.routeLayer);

    // Current position marker
    L.marker(from, {
      icon: createIcon('marker-current', '📍')
    }).addTo(state.routeLayer).bindPopup('目前位置');

    // Destination marker
    L.marker(to, {
      icon: createIcon('marker-spot', '🏁')
    }).addTo(state.routeLayer).bindPopup(`
      <div class="popup-title">${toSpot.name}</div>
      <div class="popup-detail">${toSpot.description}</div>
    `);

    // Distance & estimated time
    const dist = calcDistance(from[0], from[1], to[0], to[1]);
    const estTime = Math.ceil(dist / 40 * 60); // avg 40km/h

    L.popup()
      .setLatLng([(from[0] + to[0]) / 2, (from[1] + to[1]) / 2])
      .setContent(`
        <div class="popup-title">📏 距離 ${dist.toFixed(1)} km</div>
        <div class="popup-detail">🚗 預估 ${estTime} 分鐘 (平均時速 40km)</div>
      `)
      .openOn(state.map);

    state.map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
  }

  // ==================== Geolocation ====================
  function getCurrentPosition() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.currentPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          updatePositionMarker();
          resolve(state.currentPosition);
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  function startWatchingPosition() {
    if (!navigator.geolocation) return;
    state.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        state.currentPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        updatePositionMarker();
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }

  function updatePositionMarker() {
    if (!state.currentPosition) return;
    if (state.positionMarker) {
      state.positionMarker.setLatLng([state.currentPosition.lat, state.currentPosition.lng]);
    } else {
      state.positionMarker = L.marker(
        [state.currentPosition.lat, state.currentPosition.lng],
        { icon: createIcon('marker-current', '📍') }
      ).addTo(state.map).bindPopup('目前位置');
    }
  }

  // ==================== Nearby Food ====================
  function showNearbyFood(spot) {
    state.nearbyLayer.clearLayers();
    if (!spot.nearby || spot.nearby.length === 0) {
      alert('此景點附近暫無美食資料');
      return;
    }

    state.map.flyTo([spot.lat, spot.lng], 16, { duration: 0.8 });

    spot.nearby.forEach(place => {
      const isConvenience = place.type === 'convenience';
      const icon = createIcon(
        isConvenience ? 'marker-convenience' : 'marker-food',
        isConvenience ? '🏪' : '🍴'
      );

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(state.nearbyLayer);

      marker.bindPopup(`
        <div class="popup-title">${place.name}</div>
        ${place.cuisine ? `<div class="popup-detail">${place.cuisine}</div>` : ''}
        ${place.price ? `<div class="popup-price">${place.price}</div>` : ''}
      `);
    });
  }

  // ==================== Notifications ====================
  function initNotifications() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      document.getElementById('notification-banner').classList.remove('hidden');
    }
    if (Notification.permission === 'granted') {
      scheduleNotifications();
    }
  }

  function requestNotificationPermission() {
    Notification.requestPermission().then(perm => {
      document.getElementById('notification-banner').classList.add('hidden');
      if (perm === 'granted') {
        scheduleNotifications();
      }
    });
  }

  function scheduleNotifications() {
    // Clear existing timers
    state.notifyTimers.forEach(t => clearTimeout(t));
    state.notifyTimers = [];

    const now = new Date();

    state.itinerary.forEach(day => {
      day.spots.forEach(spot => {
        const [h, m] = spot.time.split(':').map(Number);
        const spotDate = new Date(day.date + 'T00:00:00');
        spotDate.setHours(h, m, 0, 0);

        // 15 minutes before
        const notifyTime = new Date(spotDate.getTime() - 15 * 60 * 1000);
        const delay = notifyTime.getTime() - now.getTime();

        if (delay > 0) {
          const timer = setTimeout(() => {
            new Notification('🌴 沖繩旅遊提醒', {
              body: `還有 15 分鐘就到 ${spot.name} 的時間囉！\n${spot.tips || ''}`,
              icon: 'icons/icon-192.svg',
              tag: spot.id
            });
          }, delay);
          state.notifyTimers.push(timer);
        }
      });
    });
  }

  // ==================== Expense Tracker ====================
  function getExpenses() {
    return JSON.parse(localStorage.getItem('okinawa_expenses') || '[]');
  }

  function saveExpenses(expenses) {
    localStorage.setItem('okinawa_expenses', JSON.stringify(expenses));
  }

  function addExpense() {
    const category = document.getElementById('expense-category').value;
    const name = document.getElementById('expense-name').value.trim();
    const amount = parseInt(document.getElementById('expense-amount').value, 10);

    if (!name || !amount || amount <= 0) {
      alert('請填寫項目名稱與金額');
      return;
    }

    const expenses = getExpenses();
    expenses.push({
      id: Date.now().toString(),
      category,
      name,
      amount,
      date: new Date().toISOString()
    });
    saveExpenses(expenses);

    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    renderExpenses();
  }

  function deleteExpense(id) {
    const expenses = getExpenses().filter(e => e.id !== id);
    saveExpenses(expenses);
    renderExpenses();
  }

  function renderExpenses() {
    const expenses = getExpenses();
    const summaryEl = document.getElementById('expense-summary');
    const listEl = document.getElementById('expense-list');

    // Summary
    const totals = {};
    let grandTotal = 0;
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
      grandTotal += e.amount;
    });

    summaryEl.innerHTML = `
      <span class="expense-total">合計 ¥${grandTotal.toLocaleString()}</span>
      ${Object.entries(totals).map(([cat, amt]) =>
        `<span class="expense-tag">${APP_DATA.expenseCategories[cat] || cat} ¥${amt.toLocaleString()}</span>`
      ).join('')}
    `;

    // List
    listEl.innerHTML = expenses.sort((a, b) => b.date.localeCompare(a.date)).map(e => `
      <div class="expense-item">
        <div class="expense-item-info">
          <span>${APP_DATA.expenseCategories[e.category] || ''}</span>
          <strong>${e.name}</strong>
        </div>
        <span class="expense-item-amount">¥${e.amount.toLocaleString()}</span>
        <button class="expense-delete" data-id="${e.id}" title="刪除">🗑️</button>
      </div>
    `).join('');

    listEl.querySelectorAll('.expense-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteExpense(btn.dataset.id));
    });
  }

  // ==================== Checklist ====================
  function getChecklist() {
    const saved = JSON.parse(localStorage.getItem('okinawa_checklist') || '{}');
    return APP_DATA.checklist.map(item => ({
      ...item,
      checked: saved[item.id] || false
    }));
  }

  function toggleChecklistItem(id) {
    const saved = JSON.parse(localStorage.getItem('okinawa_checklist') || '{}');
    saved[id] = !saved[id];
    localStorage.setItem('okinawa_checklist', JSON.stringify(saved));
    renderChecklist();
  }

  function renderChecklist() {
    const items = getChecklist();
    const container = document.getElementById('checklist-items');
    const categories = [...new Set(items.map(i => i.category))];

    container.innerHTML = categories.map(cat => `
      <div class="checklist-category">${cat}</div>
      ${items.filter(i => i.category === cat).map(item => `
        <div class="checklist-item ${item.checked ? 'checked' : ''}">
          <input type="checkbox" id="ck-${item.id}" ${item.checked ? 'checked' : ''} data-id="${item.id}">
          <label for="ck-${item.id}">${item.name}</label>
        </div>
      `).join('')}
    `).join('');

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => toggleChecklistItem(cb.dataset.id));
    });
  }

  // ==================== Weather Display ====================
  function renderWeather() {
    const container = document.getElementById('weather-list');
    container.innerHTML = state.itinerary.map(day => `
      <div class="weather-card">
        <div class="weather-icon">${day.weather.icon}</div>
        <div class="weather-info">
          <h3>${day.title}</h3>
          <div class="weather-temp">${day.weather.temp}</div>
          <div class="weather-detail">${day.weather.desc} · ${day.weather.humidity} · ${day.weather.wind}</div>
        </div>
      </div>
    `).join('');
  }

  // ==================== Photo Capture ====================
  function getPhotos() {
    return JSON.parse(localStorage.getItem('okinawa_photos') || '{}');
  }

  function savePhoto(spotId, dataUrl) {
    const photos = getPhotos();
    if (!photos[spotId]) photos[spotId] = [];
    photos[spotId].push({ url: dataUrl, date: new Date().toISOString() });
    localStorage.setItem('okinawa_photos', JSON.stringify(photos));
  }

  function capturePhoto(spot) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Compress to max 200KB
        compressImage(ev.target.result, 800, 0.7).then(compressed => {
          savePhoto(spot.id, compressed);
          renderPhotoGallery();
        });
      };
      reader.readAsDataURL(file);
    });
    input.click();
  }

  function compressImage(dataUrl, maxWidth, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  }

  function renderPhotoGallery() {
    const photos = getPhotos();
    const container = document.getElementById('photo-gallery');
    const allSpots = state.itinerary.flatMap(d => d.spots);

    container.innerHTML = allSpots
      .filter(spot => photos[spot.id] && photos[spot.id].length > 0)
      .map(spot => `
        <div class="photo-spot-section">
          <div class="photo-spot-title">📍 ${spot.name}</div>
          <div class="photo-grid">
            ${photos[spot.id].map(p =>
              `<img src="${p.url}" alt="${spot.name}" loading="lazy">`
            ).join('')}
          </div>
        </div>
      `).join('') || '<p style="color:var(--text-secondary);text-align:center;padding:40px 0;">還沒有照片，去景點拍一張吧！📸</p>';
  }

  // ==================== Dark Mode ====================
  function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark', state.darkMode);
    localStorage.setItem('darkMode', state.darkMode);
    const btn = document.getElementById('btn-darkmode');
    btn.textContent = state.darkMode ? '☀️' : '🌙';
  }

  function applyDarkMode() {
    if (state.darkMode) {
      document.body.classList.add('dark');
      document.getElementById('btn-darkmode').textContent = '☀️';
    }
  }

  // ==================== Drag & Drop (Reorder Spots) ====================
  let dragIndex = null;

  function onDragStart(e) {
    dragIndex = parseInt(e.currentTarget.dataset.spotIndex, 10);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragIndex.toString());
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }

  function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  function onDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const toIndex = parseInt(e.currentTarget.dataset.spotIndex, 10);
    if (dragIndex === null || dragIndex === toIndex) return;

    const day = state.itinerary[state.currentDay];
    const [moved] = day.spots.splice(dragIndex, 1);
    day.spots.splice(toIndex, 0, moved);

    // Recalculate times
    recalcTimes(day);
    renderSpotList();
    showDayOnMap();
  }

  function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    dragIndex = null;
  }

  function recalcTimes(day) {
    if (day.spots.length === 0) return;
    let [h, m] = day.spots[0].time.split(':').map(Number);

    day.spots.forEach((spot, i) => {
      spot.time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      m += spot.duration;
      if (spot.transportToNext && i < day.spots.length - 1) {
        m += spot.transportToNext.duration;
      }
      h += Math.floor(m / 60);
      m = m % 60;
    });
  }

  // ==================== Sidebar Toggle ====================
  function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');

    toggle.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.toggle('collapsed');
      toggle.textContent = isCollapsed ? '▶' : '◀';
      // Fix mobile
      if (window.innerWidth <= 768) {
        toggle.textContent = isCollapsed ? '▲' : '▼';
      }
      setTimeout(() => state.map.invalidateSize(), 350);
    });

    // Mobile default label
    if (window.innerWidth <= 768) {
      toggle.textContent = '▼';
    }
  }

  // ==================== Modal Management ====================
  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }

  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  function initModals() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.modal));
    });

    // Click backdrop to close
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    });

    // Header buttons
    document.getElementById('btn-weather').addEventListener('click', () => {
      renderWeather();
      openModal('weather-modal');
    });

    document.getElementById('btn-expense').addEventListener('click', () => {
      renderExpenses();
      openModal('expense-modal');
    });

    document.getElementById('btn-checklist').addEventListener('click', () => {
      renderChecklist();
      openModal('checklist-modal');
    });

    document.getElementById('btn-photo').addEventListener('click', () => {
      renderPhotoGallery();
      openModal('photo-modal');
    });

    document.getElementById('btn-darkmode').addEventListener('click', toggleDarkMode);

    // Expense add
    document.getElementById('expense-add').addEventListener('click', addExpense);

    // Notification banner
    document.getElementById('btn-allow-notify').addEventListener('click', requestNotificationPermission);
    document.getElementById('btn-dismiss-notify').addEventListener('click', () => {
      document.getElementById('notification-banner').classList.add('hidden');
    });
  }

  // ==================== PWA Install ====================
  function initPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      document.getElementById('install-banner').classList.remove('hidden');
    });

    document.getElementById('btn-install').addEventListener('click', () => {
      if (state.deferredInstallPrompt) {
        state.deferredInstallPrompt.prompt();
        state.deferredInstallPrompt.userChoice.then(() => {
          state.deferredInstallPrompt = null;
          document.getElementById('install-banner').classList.add('hidden');
        });
      }
    });

    document.getElementById('btn-dismiss-install').addEventListener('click', () => {
      document.getElementById('install-banner').classList.add('hidden');
    });
  }

  // ==================== Service Worker ====================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('Service Worker registered:', reg.scope);
      }).catch(err => {
        console.warn('SW registration failed:', err);
      });
    }
  }

  // ==================== Utilities ====================
  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function deg2rad(deg) { return deg * (Math.PI / 180); }

  // ==================== App Init ====================
  function init() {
    applyDarkMode();
    initMap();
    renderDayTabs();
    renderSpotList();
    showDayOnMap();
    initSidebarToggle();
    initModals();
    initNotifications();
    initPWAInstall();
    registerServiceWorker();
    startWatchingPosition();
    getCurrentPosition();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
