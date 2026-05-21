/* ============================================================
   adDb.js — DealKerala Ad Database (localStorage)
   Shared by post_ad.js, offers.js, home.js
   ============================================================

   Ad object shape:
   {
     id          : string  — unique ad ID (timestamp-based)
     bizName     : string  — business name
     category    : string  — raw category string from select
     categoryKey : string  — normalised key for filter matching
     tagline     : string  — offer / promotion tagline
     district    : string  — Kerala district
     phone       : string  — contact number (optional)
     size        : string  — 'Small' | 'Medium' | 'Banner'
     duration    : number  — days (3 / 7 / 15 / 30)
     basePrice   : number  — base price in ₹
     totalPrice  : number  — total inc. GST
     imageBase64 : string  — data-URL from FileReader (may be '')
     timestamp   : number  — Date.now() at submission time
   }
   ============================================================ */

var AdDb = (function () {

  var STORAGE_KEY = 'dealkerala_ads';

  /* ── Category string → filter key mapping ──────────────── */
  var CAT_MAP = {
    'food'      : 'food',
    'dining'    : 'food',
    'shopping'  : 'shopping',
    'retail'    : 'shopping',
    'hotel'     : 'hotel',
    'stay'      : 'hotel',
    'services'  : 'services',
    'beauty'    : 'beauty',
    'wellness'  : 'beauty',
    'education' : 'education',
    'automotive': 'services',
    'healthcare': 'services',
    'events'    : 'services',
    'other'     : 'other'
  };

  function normaliseCategoryKey(catString) {
    if (!catString) return 'other';
    var lower = catString.toLowerCase();
    // Try each keyword in CAT_MAP
    for (var keyword in CAT_MAP) {
      if (CAT_MAP.hasOwnProperty(keyword)) {
        if (lower.indexOf(keyword) !== -1) {
          return CAT_MAP[keyword];
        }
      }
    }
    return 'other';
  }

  /* ── Internal: read raw array from localStorage ─────────── */
  function _readAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /* ── Internal: write array back to localStorage ─────────── */
  function _writeAll(ads) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    } catch (e) {
      console.warn('AdDb: localStorage write failed (quota exceeded?)', e);
    }
  }

  /* ── Internal: check if an ad has expired ───────────────── */
  function _isExpired(ad) {
    if (!ad.timestamp || !ad.duration) return false;
    var expiresAt = ad.timestamp + (ad.duration * 24 * 60 * 60 * 1000);
    return Date.now() > expiresAt;
  }

  /* ── PUBLIC: save a new ad ──────────────────────────────── */
  function save(adObj) {
    var ads = _readAll();

    // Build a clean, complete ad record
    var record = {
      id          : 'ad_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      bizName     : adObj.bizName     || '',
      category    : adObj.category    || '',
      categoryKey : normaliseCategoryKey(adObj.category),
      tagline     : adObj.tagline     || '',
      district    : adObj.district    || '',
      phone       : adObj.phone       || '',
      size        : adObj.size        || 'Small',
      duration    : adObj.duration    || 7,
      basePrice   : adObj.basePrice   || 0,
      totalPrice  : adObj.totalPrice  || 0,
      imageBase64 : adObj.imageBase64 || '',
      timestamp   : Date.now()
    };

    ads.unshift(record); // newest first
    _writeAll(ads);
    return record;
  }

  /* ── PUBLIC: get all active (non-expired) ads ───────────── */
  function getAll() {
    var ads    = _readAll();
    var active = ads.filter(function (ad) { return !_isExpired(ad); });

    // Prune expired ones from storage silently
    if (active.length !== ads.length) {
      _writeAll(active);
    }

    return active;
  }

  /* ── PUBLIC: clear all ads (admin / testing) ────────────── */
  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /* ── PUBLIC: get a size CSS class for an ad ─────────────── */
  function sizeClass(size) {
    var map = { Small: 'small', Medium: 'medium', Banner: 'banner' };
    return map[size] || 'small';
  }

  /* ── PUBLIC: build an ad card DOM element ─────────────────
     Returns a fully-built <div class="ad-card ..."> element    */
  function buildCard(ad, delaySeconds) {
    delaySeconds = delaySeconds || 0;
    var cls  = sizeClass(ad.size);
    var card = document.createElement('div');
    card.className       = 'ad-card ' + cls + ' user-ad';
    card.dataset.cat     = ad.categoryKey;
    card.style.animationDelay = delaySeconds + 's';

    var endDate = new Date(ad.timestamp + (ad.duration * 24 * 60 * 60 * 1000));
    card.dataset.validUntil = endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

    /* ── badge label ── */
    var badgeText = ad.tagline
      ? ad.tagline.substring(0, 18) + (ad.tagline.length > 18 ? '…' : '')
      : 'NEW';

    /* ── min-height by size ── */
    var minH = { small: '180px', medium: '200px', banner: '220px' };

    if (ad.imageBase64) {
      /* ─── Poster image card ─── */
      var img = document.createElement('img');
      img.src   = ad.imageBase64;
      img.alt   = ad.bizName + ' poster';
      img.style.cssText = [
        'display:block',
        'width:100%',
        'height:' + (minH[cls] || '180px'),
        'object-fit:cover',
        'border-radius:var(--radius-md) var(--radius-md) 0 0'
      ].join(';');
      card.appendChild(img);
    } else {
      /* ─── Placeholder gradient card (no image uploaded) ─── */
      var ph = document.createElement('div');
      ph.className  = 'ad-placeholder';
      ph.style.cssText = 'background:linear-gradient(135deg,#001a12,#003322);min-height:' + (minH[cls] || '180px');

      var icon = document.createElement('span');
      icon.style.fontSize = '2.5rem';
      icon.textContent    = '🏢';

      var nameSpan = document.createElement('span');
      nameSpan.style.cssText = 'font-family:var(--font-head);font-size:1rem;font-weight:800;color:#00c9b1';
      nameSpan.textContent   = ad.bizName;

      var tagSpan = document.createElement('span');
      tagSpan.style.cssText = 'color:var(--clr-text-muted);font-size:0.82rem;text-align:center;padding:0 1rem';
      tagSpan.textContent   = ad.tagline || '';

      ph.appendChild(icon);
      ph.appendChild(nameSpan);
      ph.appendChild(tagSpan);
      card.appendChild(ph);
    }

    /* ─── Overlay with biz name & district ─── */
    var overlay = document.createElement('div');
    overlay.className = 'ad-overlay';

    var bizDiv = document.createElement('div');
    bizDiv.className   = 'ad-biz';
    bizDiv.textContent = ad.bizName;

    var tagDiv = document.createElement('div');
    tagDiv.className   = 'ad-tag';
    tagDiv.textContent = '📍 ' + ad.district;

    overlay.appendChild(bizDiv);
    overlay.appendChild(tagDiv);
    card.appendChild(overlay);

    /* ─── NEW badge ─── */
    var badge = document.createElement('div');
    badge.className   = 'ad-badge';
    badge.textContent = 'NEW';
    card.appendChild(badge);

    return card;
  }

  /* ── Expose public API ──────────────────────────────────── */
  return {
    save      : save,
    getAll    : getAll,
    clear     : clear,
    sizeClass : sizeClass,
    buildCard : buildCard
  };

}());
