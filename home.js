/* ============================================================
   home.js — Home / Deals Feed (home.html)
   District from URL + category filter + scroll animations
   ============================================================ */

/* ── Read district from URL query string ─────────────── */
var params   = new URLSearchParams(window.location.search);
var district = params.get('district') || 'Kerala';

var districtNameEl    = document.getElementById('page-district-name');
var breadcrumbEl      = document.getElementById('breadcrumb-district');

if (districtNameEl) {
  districtNameEl.textContent = district;
}
if (breadcrumbEl) {
  breadcrumbEl.textContent = district;
}

// Update page title
document.title = 'DealKerala — Offers in ' + district;

/* ── District banner image ───────────────────────────────── */
var districtImageMap = {
  'thiruvananthapuram': 'trivandrum.jpg',
  'kollam':             'kollam.png',
  'pathanamthitta':     'pathanamthita.jpg',
  'alappuzha':          'alapuzha.jpg',
  'kottayam':           'kottayam.jpeg',
  'idukki':             'idukki.jpg',
  'ernakulam':          'ernakulam.png',
  'thrissur':           'thrissur.jpg',
  'palakkad':           'palakkad.jpg',
  'malappuram':         'malappuram.jpg',
  'kozhikode':          'kozhikode.jpg',
  'wayanad':            'wayanad.png',
  'kannur':             'kannur.jpg',
  'kasaragod':          'kasargod.jpg'
};

(function applyDistrictBanner() {
  var bannerEl = document.getElementById('district-banner-img');
  if (!bannerEl) return;
  var key     = district.toLowerCase();
  var imgPath = districtImageMap[key];
  if (!imgPath) return;

  /* Pre-load the image before showing it */
  var img    = new Image();
  img.onload = function () {
    bannerEl.style.backgroundImage = 'url(' + imgPath + ')';
    bannerEl.classList.add('has-image');
  };
  img.src = imgPath;
})();

/* ── Category filter ─────────────────────────────────── */
function filterAds(btn, cat) {
  // Remove active class from all filter buttons
  document.querySelectorAll('.filter-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  // Show/hide cards based on category
  document.querySelectorAll('.ad-card, #featured-ad').forEach(function (card) {
    var cardCat = card.dataset.cat || 'all';
    var show    = (cat === 'all' || cardCat === cat);

    if (show) {
      card.style.display = '';
      // Re-trigger fade animation
      card.style.animation = 'none';
      void card.offsetHeight; // force reflow
      card.style.animation = '';
      card.style.opacity   = '1';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ── Inject user ads from AdDb ───────────────────────── */
(function injectUserAds() {
  if (typeof AdDb === 'undefined') return;

  var ads  = AdDb.getAll();
  var grid = document.getElementById('ad-grid');
  if (!grid || ads.length === 0) return;

  // Filter ads by selected district (if not 'Kerala' / all)
  var activeDistrict = district.toLowerCase();
  var filtered = (activeDistrict === 'kerala')
    ? ads
    : ads.filter(function (ad) {
        return ad.district && ad.district.toLowerCase() === activeDistrict;
      });

  if (filtered.length === 0) return;

  // Add a "Your Ads" section header before the first user card
  var header = document.createElement('div');
  header.className   = 'section-header';
  header.style.marginTop = '1.5rem';
  header.innerHTML   = '<h2>📢 Posted Ads</h2><a href="post_ad.html" class="view-all-link">Post your ad →</a>';
  grid.parentNode.insertBefore(header, grid);

  // Prepend each user ad card (newest first)
  filtered.forEach(function (ad, i) {
    var card = AdDb.buildCard(ad, i * 0.05);
    grid.insertBefore(card, grid.firstChild);
  });
})();

/* ── Intersection observer: fade cards in on scroll ──── */
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.ad-card').forEach(function (card) {
  observer.observe(card);
});

/* ── Offer Modal Logic ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('offer-modal');
  if (!modal) return;
  var closeBtn = document.getElementById('modal-close');
  var mImg   = document.getElementById('modal-img');
  var mTitle = document.getElementById('modal-title');
  var mDesc  = document.getElementById('modal-desc');
  var mLoc   = document.getElementById('modal-loc');
  var mDate  = document.getElementById('modal-date');

  function openModal(card) {
    // 1. Extract Image
    var bgImg = '';
    var placeholder = card.querySelector('.ad-placeholder');
    if (placeholder && placeholder.style.backgroundImage) {
      bgImg = placeholder.style.backgroundImage;
    } else if (card.querySelector('img')) {
      bgImg = 'url(' + card.querySelector('img').src + ')';
    } else {
      bgImg = 'linear-gradient(135deg, #f0f0f0, #e0e0e0)';
    }
    mImg.style.backgroundImage = bgImg;

    // 2. Extract Title
    var titleEl = card.querySelector('.ad-biz');
    mTitle.textContent = titleEl ? titleEl.textContent : 'Special Offer';

    // 3. Extract Description
    var descEl = card.querySelector('.ad-desc');
    var altDesc = card.querySelector('.ad-placeholder span:nth-child(3)'); // For some older styles if any
    if (descEl) mDesc.textContent = descEl.textContent;
    else if (altDesc) mDesc.textContent = altDesc.textContent;
    else mDesc.textContent = 'Contact business for full details and availability.';

    // 4. Extract Location / Category Tag
    var locEl = card.querySelector('.ad-tag');
    mLoc.textContent = locEl ? locEl.textContent : '📍 Kerala';

    // 5. Validity Date
    if (card.dataset.date) {
      mDate.textContent = '⏳ ' + card.dataset.date;
    } else if (card.dataset.validUntil) {
      mDate.textContent = '⏳ ' + card.dataset.validUntil;
    } else {
      mDate.textContent = '⏳ Limited Time Offer';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event Delegation for all ad cards (handles dynamic ones too)
  document.body.addEventListener('click', function(e) {
    var card = e.target.closest('.ad-card');
    if (card) {
      openModal(card);
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
});

/* ── Mobile Menu Toggle ──────────────────────────────── */
function initMobileMenu() {
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var navbarLinks = document.getElementById('navbar-links');
  if (hamburgerBtn && navbarLinks) {
    hamburgerBtn.onclick = function() {
      hamburgerBtn.classList.toggle('active');
      navbarLinks.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', hamburgerBtn.classList.contains('active'));
    };
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}
