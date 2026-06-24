/* ============================================
   Our Memory — JavaScript Logic (Controller)
   อ่านข้อมูลทั้งหมดจาก data.js (Model)
   ============================================ */

(function () {
  'use strict';

  var D = MEMO_DATA; // shortcut

  // --- Helper Functions ---
  var _annivDate = new Date(D.couple.startDate);

  function getNextAnniversary() {
    var now = new Date();
    var thisYear = new Date(now.getFullYear(), _annivDate.getMonth(), _annivDate.getDate());
    if (thisYear <= now) {
      return new Date(now.getFullYear() + 1, _annivDate.getMonth(), _annivDate.getDate());
    }
    return thisYear;
  }

  function getNextFixedDate(month, day) {
    var now = new Date();
    var thisYear = new Date(now.getFullYear(), month - 1, day);
    if (thisYear <= now) {
      return new Date(now.getFullYear() + 1, month - 1, day);
    }
    return thisYear;
  }

  function getTargetDate(item) {
    if (item.target === 'anniversary') return getNextAnniversary();
    return getNextFixedDate(item.target.month, item.target.day);
  }

  // ============================================
  // 1. ANNIVERSARY DAYS COUNTER (Hero Section)
  // ============================================
  function updateDaysCounter() {
    var now = new Date();
    var diffMs = now - _annivDate;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Calculate years, months, days
    let years = now.getFullYear() - _annivDate.getFullYear();
    let months = now.getMonth() - _annivDate.getMonth();
    let days = now.getDate() - _annivDate.getDate();

    if (days < 0) {
      // Borrow days from previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const daysNum = document.getElementById('daysNum');
    const daysDetail = document.getElementById('daysDetail');

    if (daysNum) {
      daysNum.textContent = totalDays.toLocaleString('th-TH');
    }
    if (daysDetail) {
      daysDetail.textContent = years + ' ปี ' + months + ' เดือน ' + days + ' วัน';
    }
  }

  // Update every second
  setInterval(updateDaysCounter, 1000);
  updateDaysCounter();

  // ============================================
  // 2. COUNTDOWN SECTION
  // ============================================
  function updateCountdowns() {
    const container = document.getElementById('countdownGrid');
    if (!container) return;

    container.innerHTML = '';

    D.specialDates.forEach(function (item) {
      var targetDate = getTargetDate(item);

      const card = document.createElement('div');
      card.className = 'countdown-card fade-up';

      const formattedDate = targetDate.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      card.innerHTML = 
        '<div class="countdown-icon">' + item.icon + '</div>' +
        '<h3>' + item.name + '</h3>' +
        '<div class="countdown-date">' + formattedDate + '</div>' +
        '<div class="countdown-time" data-target="' + targetDate.getTime() + '">' +
          '<div class="countdown-unit"><span class="num">--</span><span class="lbl">วัน</span></div>' +
          '<div class="countdown-unit"><span class="num">--</span><span class="lbl">ชม.</span></div>' +
          '<div class="countdown-unit"><span class="num">--</span><span class="lbl">นาที</span></div>' +
          '<div class="countdown-unit"><span class="num">--</span><span class="lbl">วิ</span></div>' +
        '</div>' +
        (item.birthYear ? '<div class="countdown-age" id="age_' + D.specialDates.indexOf(item) + '"></div>' : '');

      container.appendChild(card);
    });

    // Set initial countdown values
    refreshCountdownValues();
  }

  function refreshCountdownValues() {
    const now = new Date().getTime();
    const timeElements = document.querySelectorAll('.countdown-time');

    timeElements.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'));
      const diff = target - now;

      if (diff <= 0) {
        el.innerHTML = '<div class="countdown-unit"><span class="num" style="font-size:1.2rem;">🎉</span><span class="lbl">ถึงแล้ว!</span></div>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const nums = el.querySelectorAll('.num');
      if (nums.length >= 4) {
        if (nums[0].textContent !== String(days)) nums[0].textContent = days;
        if (nums[1].textContent !== String(hours)) nums[1].textContent = hours;
        if (nums[2].textContent !== String(minutes)) nums[2].textContent = minutes;
        if (nums[3].textContent !== String(seconds)) nums[3].textContent = seconds;
      }
    });
  }

  // Update age display for birthday countdowns
  function updateAgeDisplay() {
    D.specialDates.forEach(function (item, index) {
      if (!item.birthYear) return;
      var ageEl = document.getElementById('age_' + index);
      if (!ageEl) return;

      var now = new Date();
      var birthDate = new Date(item.birthYear, item.target.month - 1, item.target.day);
      var ageYears = now.getFullYear() - birthDate.getFullYear();
      var ageMonths = now.getMonth() - birthDate.getMonth();
      var ageDays = now.getDate() - birthDate.getDate();

      if (ageDays < 0) {
        var prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        ageDays += prevMonth.getDate();
        ageMonths--;
      }
      if (ageMonths < 0) {
        ageMonths += 12;
        ageYears--;
      }

      // Next birthday age
      var targetDate = getTargetDate(item);
      var nextAge = targetDate.getFullYear() - item.birthYear;

      ageEl.textContent = '🎂 อายุ ' + ageYears + ' ปี ' + ageMonths + ' เดือน (จะครบ ' + nextAge + ' ปี)';
    });
  }

  updateCountdowns();
  setInterval(refreshCountdownValues, 1000);

  // Update age display
  updateAgeDisplay();
  setInterval(updateAgeDisplay, 60000); // every minute

  // ============================================
  // 3. TIMELINE SECTION
  // ============================================
  function buildTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    D.timeline.forEach(function (event, index) {
      const item = document.createElement('div');
      item.className = 'timeline-item';

      let imgHtml = '';
      if (event.img) {
        imgHtml = '<img src="' + event.img + '" alt="' + event.title + '" class="timeline-img" loading="lazy">';
      } else {
        // Placeholder gradient image
        const colors = [
          ['#ff6b9d', '#c44dff'],
          ['#ff9a56', '#ff6b9d'],
          ['#c44dff', '#ff6b9d'],
          ['#ff6b9d', '#ff9a56'],
          ['#c44dff', '#ff9a56'],
        ];
        const c = colors[index % colors.length];
        imgHtml = '<div class="timeline-img" style="background:linear-gradient(135deg,' + c[0] + ',' + c[1] + ');display:flex;align-items:center;justify-content:center;font-size:2.5rem;">' + event.icon + '</div>';
      }

      item.innerHTML =
        '<div class="timeline-content">' +
          '<div class="timeline-date">' + event.date + '</div>' +
          '<h3>' + event.title + '</h3>' +
          '<p>' + event.desc + '</p>' +
          imgHtml +
        '</div>' +
        '<div class="timeline-dot">' + event.icon + '</div>';

      container.appendChild(item);
    });
  }

  buildTimeline();

  // ============================================
  // 4. GALLERY LIGHTBOX
  // ============================================
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentIndex = 0;
    const images = [];

    galleryItems.forEach(function (img, i) {
      images.push(img.src);
      img.parentElement.addEventListener('click', function () {
        currentIndex = i;
        showImage(currentIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function showImage(index) {
      if (images.length === 0) return;
      currentIndex = (index + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', function () {
      showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function () {
      showImage(currentIndex + 1);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  // Call after DOM ready — see init() below

  // ============================================
  // 5. MAP (Leaflet.js)
  // ============================================
  function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    // Default center: Bangkok, Thailand — เปลี่ยนตามสถานที่ที่ต้องการ
    const map = L.map('map').setView([13.7563, 100.5018], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom heart icon
    const heartIcon = L.divIcon({
      html: '<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">❤️</div>',
      className: 'heart-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });

    // Special locations from data.js
    var locations = D.mapLocations;

    locations.forEach(function (loc) {
      const marker = L.marker([loc.lat, loc.lng], { icon: heartIcon }).addTo(map);
      marker.bindPopup('<b>' + loc.name + '</b>');
    });

    // Invalidate size after map container becomes visible
    setTimeout(function () { map.invalidateSize(); }, 300);

    // Build legend
    const legendEl = document.getElementById('mapLegend');
    if (legendEl) {
      locations.forEach(function (loc) {
        const item = document.createElement('div');
        item.className = 'map-legend-item';
        item.innerHTML = '<span class="map-legend-dot" style="background:' + loc.color + ';"></span> ' + loc.name;
        legendEl.appendChild(item);
      });
    }
  }

  // ============================================
  // UTILITIES
  // ============================================

  // --- Intersection Observer for scroll animations ---
  function initScrollAnimations() {
    const fadeEls = document.querySelectorAll('.fade-up');
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    });

    fadeEls.forEach(function (el) { observer.observe(el); });
    timelineItems.forEach(function (el) { observer.observe(el); });
  }

  // --- Nav scroll effect ---
  function initNav() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile hamburger menu ---
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Scroll to top button ---
  function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Hero particles ---
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const colors = ['#ff6b9d', '#c44dff', '#ff9a56', '#ff8fb3', '#d98fff'];
    const count = 25;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(particle);
    }
  }

  // --- Set hero data from MEMO_DATA ---
  function initHeroData() {
    var namesEl = document.getElementById('heroNames');
    var dateEl = document.getElementById('heroDate');
    if (namesEl) namesEl.textContent = D.couple.name1 + ' ❤️ ' + D.couple.name2;
    if (dateEl) dateEl.textContent = 'เริ่มต้น ' + D.couple.startDateDisplay;
  }

  // --- Build Gallery from data.js ---
  function buildGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid || !D.gallery) return;

    D.gallery.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'gallery-item';
      if (item.type === 'tall') div.classList.add('tall');
      if (item.type === 'wide') div.classList.add('wide');

      div.innerHTML =
        '<img src="' + item.src + '" alt="' + item.caption + '" loading="lazy">' +
        '<div class="gallery-overlay"><span>' + item.caption + '</span></div>';

      grid.appendChild(div);
    });
  }

  // --- Update current year in footer ---
  function updateFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  // --- Lock Screen with Real Password + Rate Limit ---
  function initLockScreen() {
    var lockScreen = document.getElementById('lockscreen');
    var btn = document.getElementById('lockscreenBtn');
    var input = document.getElementById('lockPassword');
    var errorEl = document.getElementById('lockError');
    var hintEl = document.getElementById('lockHintText');
    var failedAttempts = 0;
    var lockoutUntil = 0;

    if (!lockScreen) return;

    if (hintEl && D.lockScreen.hint) {
      hintEl.textContent = D.lockScreen.hint;
    }

    if (sessionStorage.getItem('memo_unlocked') === 'yes') {
      lockScreen.classList.add('hidden');
      spawnHeartBurst(15);
      return;
    }

    function isLockedOut() {
      if (lockoutUntil > 0 && Date.now() < lockoutUntil) {
        var remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        showError('🔒 ล็อคชั่วคราว ' + remaining + ' วินาที');
        return true;
      }
      if (lockoutUntil > 0 && Date.now() >= lockoutUntil) {
        lockoutUntil = 0;
        errorEl.textContent = '';
      }
      return false;
    }

    function tryUnlock() {
      if (isLockedOut()) return;

      var password = input.value.trim();
      if (!password) {
        showError('กรุณาใส่รหัสผ่าน');
        return;
      }

      hashPassword(password).then(function (hash) {
        if (hash === D.lockScreen.passwordHash) {
          sessionStorage.setItem('memo_unlocked', 'yes');
          lockScreen.classList.add('hidden');
          spawnHeartBurst(15);
          errorEl.textContent = '';
          input.classList.remove('shake');
          failedAttempts = 0;
        } else {
          failedAttempts++;
          input.classList.remove('shake');
          void input.offsetWidth;
          input.classList.add('shake');
          input.value = '';
          input.focus();

          // Rate limit: 3 wrong → 30s lockout, 5 wrong → 60s, 7+ → 5min
          if (failedAttempts >= 7) {
            lockoutUntil = Date.now() + 300000; // 5 minutes
            showError('❌ ใส่ผิดหลายครั้งเกินไป ล็อค 5 นาที');
          } else if (failedAttempts >= 5) {
            lockoutUntil = Date.now() + 60000; // 1 minute
            showError('⚠️ ใส่ผิดหลายครั้ง ล็อค 1 นาที');
          } else if (failedAttempts >= 3) {
            lockoutUntil = Date.now() + 30000; // 30 seconds
            showError('⏳ ใส่ผิด 3 ครั้ง ล็อค 30 วินาที');
          } else {
            showError('รหัสผ่านไม่ถูกต้อง (' + failedAttempts + '/7)');
          }
        }
      });
    }

    function showError(msg) {
      if (errorEl) errorEl.textContent = msg;
    }

    // Update countdown in real-time
    setInterval(function () {
      if (lockoutUntil > 0 && Date.now() < lockoutUntil) {
        var remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        showError('🔒 ล็อคชั่วคราว ' + remaining + ' วินาที');
      }
    }, 1000);

    btn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
    });
  }

  // SHA-256 hashing using Web Crypto API
  function hashPassword(str) {
    var encoder = new TextEncoder();
    var data = encoder.encode(str);
    return crypto.subtle.digest('SHA-256', data).then(function (buffer) {
      return Array.from(new Uint8Array(buffer))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  // --- Anti F12 / DevTools ---
  function initAntiDevTools() {
    // Disable right-click
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // Disable common dev tools shortcuts (but not all - can't fully block)
    document.addEventListener('keydown', function (e) {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    });

    // DevTools detection via debugger timing trick
    var devtoolsOpen = false;
    var threshold = 160;

    setInterval(function () {
      var start = performance.now();
      debugger;
      var end = performance.now();
      if (end - start > threshold && !devtoolsOpen) {
        devtoolsOpen = true;
        // Clear sensitive content
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#fff;background:#0a0a0f;font-family:sans-serif;text-align:center"><div><h1 style="font-size:3rem">🔒</h1><p style="margin-top:1rem;color:#b0a0b8">กรุณาปิดเครื่องมือนักพัฒนาก่อนเข้าชม</p></div></div>';
      }
      if (end - start <= threshold && devtoolsOpen) {
        devtoolsOpen = false;
      }
    }, 1000);
  }

  // --- Floating Hearts on Click ---
  function initFloatingHearts() {
    document.addEventListener('click', function (e) {
      // Blur YouTube iframe when clicking outside it (fixes stuck menus)
      var tag = e.target.tagName.toLowerCase();
      if (tag !== 'iframe') {
        var ytIframe = document.querySelector('#youtubePlayer iframe');
        if (ytIframe) {
          ytIframe.blur();
          // Force iframe to lose focus by briefly focusing window
          window.focus();
        }
      }

      // Skip interactive elements
      if (tag === 'button' || tag === 'a' || tag === 'input' || tag === 'textarea' || tag === 'iframe') return;
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('iframe')) return;

      createFloatingHeart(e.clientX, e.clientY);
    });
  }

  function createFloatingHeart(x, y) {
    var heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['❤️', '💕', '💗', '💖', '💘', '💝'][Math.floor(Math.random() * 6)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
    document.body.appendChild(heart);

    // Remove after animation
    heart.addEventListener('animationend', function () {
      heart.remove();
    });
  }

  function spawnHeartBurst(count) {
    for (var i = 0; i < count; i++) {
      setTimeout(function () {
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight * 0.7;
        createFloatingHeart(x, y);
      }, i * 60);
    }
  }

  // --- Bucket List ---
  function initBucketList() {
    var grid = document.getElementById('bucketlistGrid');
    if (!grid) return;

    var items = D.bucketList;

    // Load saved state from localStorage
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem('bucketlist')) || {};
    } catch (e) {
      saved = {};
    }

    items.forEach(function (item, index) {
      var isDone = saved[index] === true;
      var div = document.createElement('div');
      div.className = 'bucketlist-item' + (isDone ? ' done' : '');
      div.innerHTML =
        '<div class="bucketlist-check">' + (isDone ? '✓' : '') + '</div>' +
        '<span class="bucketlist-label">' + item + '</span>';

      div.addEventListener('click', function () {
        div.classList.toggle('done');
        var checkEl = div.querySelector('.bucketlist-check');
        var isNowDone = div.classList.contains('done');
        checkEl.textContent = isNowDone ? '✓' : '';

        // Save to localStorage
        saved[index] = isNowDone;
        try {
          localStorage.setItem('bucketlist', JSON.stringify(saved));
        } catch (e) {}
      });

      grid.appendChild(div);
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    initHeroData();
    updateFooterYear();
    initNav();
    initHamburger();
    createParticles();
    buildGallery();
    initScrollAnimations();
    initLightbox();
    initScrollTop();
    initYouTubePlayer();
    initLockScreen();
    initAntiDevTools();
    initFloatingHearts();
    initBucketList();
  }

  // Wait for DOM + Leaflet
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Map needs Leaflet.js CDN to load — initialize when available
  window.addEventListener('load', function () {
    if (typeof L !== 'undefined') {
      initMap();
    } else {
      // Poll for Leaflet
      var checkLeaflet = setInterval(function () {
        if (typeof L !== 'undefined') {
          clearInterval(checkLeaflet);
          initMap();
        }
      }, 200);
      // Stop polling after 10 seconds
      setTimeout(function () { clearInterval(checkLeaflet); }, 10000);
    }
  });

  // ============================================
  // 6. YOUTUBE PLAYER
  // ============================================
  function initYouTubePlayer() {
    var container = document.getElementById('youtubePlayer');
    if (!container) return;

    var iframe = document.createElement('iframe');
    iframe.style.borderRadius = '12px';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = 'https://www.youtube.com/embed/MdeoIGQzNNo?rel=0&modestbranding=1&origin=' + encodeURIComponent(window.location.origin);
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.loading = 'lazy';
    iframe.setAttribute('frameborder', '0');
    container.appendChild(iframe);
  }

})();
