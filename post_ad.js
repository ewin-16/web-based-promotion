/* ============================================================
   post_ad.js — Post Advertisement (post_ad.html)
   Size picker, duration picker, image preview, step navigation,
   price calculation, form submit + AdDb save
   ============================================================ */

/* ── Pricing matrix ────────────────────────────────────
   Rows: Small | Medium | Banner
   Cols: 3 days | 7 days | 15 days | 30 days
   ─────────────────────────────────────────────────── */
var PRICES = {
  Small:  [199, 399,  699,  1199],
  Medium: [399, 799,  1399, 2499],
  Banner: [799, 1499, 2799, 4999]
};

/* ── Hold captured base64 image across steps ─────────── */
var capturedImageBase64 = '';

var DUR_DAYS = [3, 7, 15, 30];

// Currently selected values
var selSize   = null;
var selDurIdx = null;

/* ── Ad size selection ───────────────────────────────── */
function selectSize(el) {
  // Deselect all, then select clicked one
  document.querySelectorAll('.size-opt').forEach(function (e) {
    e.classList.remove('selected');
  });
  el.classList.add('selected');
  selSize = el.dataset.size;
}

/* ── Duration selection ──────────────────────────────── */
function selectDur(el) {
  document.querySelectorAll('.dur-opt').forEach(function (e) {
    e.classList.remove('selected');
  });
  el.classList.add('selected');
  selDurIdx = parseInt(el.dataset.idx, 10);
}

/* ── Poster image preview ────────────────────────────── */
function previewPoster(e) {
  var file = e.target.files[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File is too large. Please upload an image under 5MB.');
    e.target.value = '';
    capturedImageBase64 = '';
    return;
  }

  var reader = new FileReader();
  reader.onload = function (ev) {
    // Store base64 for later saving to AdDb
    capturedImageBase64 = ev.target.result;

    var img = document.getElementById('preview-img');
    if (img) {
      img.src           = ev.target.result;
      img.style.display = 'block';
    }
    var placeholder = document.getElementById('upload-placeholder');
    if (placeholder) {
      placeholder.style.opacity = '0.4';
    }
    var zone = document.getElementById('upload-zone');
    if (zone) {
      zone.classList.add('has-file');
    }
  };
  reader.readAsDataURL(file);
}

/* ── Go to Step 2: validate + calculate price ────────── */
function goToStep2() {
  var biz  = document.getElementById('biz-name')  ? document.getElementById('biz-name').value.trim()  : '';
  var cat  = document.getElementById('biz-cat')   ? document.getElementById('biz-cat').value           : '';
  var dist = document.getElementById('biz-district') ? document.getElementById('biz-district').value   : '';

  // Validation with if/else
  if (!biz) {
    alert('Please enter your business name.');
    return;
  } else if (!cat) {
    alert('Please select a category.');
    return;
  } else if (!dist) {
    alert('Please select your district.');
    return;
  } else if (!selSize) {
    alert('Please select an ad size.');
    return;
  } else if (selDurIdx === null) {
    alert('Please select a duration.');
    return;
  }

  // Calculate prices
  var base  = PRICES[selSize][selDurIdx];
  var gst   = Math.round(base * 0.18);
  var total = base + gst;
  var days  = DUR_DAYS[selDurIdx];

  // Populate review panel
  document.getElementById('pr-biz').textContent   = biz;
  document.getElementById('pr-cat').textContent   = cat;
  document.getElementById('pr-dist').textContent  = dist;
  document.getElementById('pr-size').textContent  = selSize;
  document.getElementById('pr-dur').textContent   = days + ' Days';
  document.getElementById('pr-base').textContent  = '₹' + base.toLocaleString('en-IN');
  document.getElementById('pr-gst').textContent   = '₹' + gst.toLocaleString('en-IN');
  document.getElementById('pr-total').textContent = '₹' + total.toLocaleString('en-IN');

  // Transfer poster preview to step 2 if uploaded
  var previewImg = document.getElementById('preview-img');
  if (previewImg && previewImg.style.display !== 'none' && previewImg.src) {
    var s2img = document.getElementById('step2-preview');
    if (s2img) {
      s2img.src = previewImg.src;
    }
    var s2wrap = document.getElementById('step2-img-wrap');
    if (s2wrap) {
      s2wrap.style.display = 'block';
    }
  }

  // Switch to step 2 panel
  var step1 = document.getElementById('step1-form');
  var panel = document.getElementById('step2-panel');
  if (step1) step1.style.display = 'none';
  if (panel) {
    panel.classList.add('visible');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update step indicator bar
  var s1Ind = document.getElementById('step1-indicator');
  var s2Ind = document.getElementById('step2-indicator');
  var s1num = document.getElementById('s1num');
  var line1 = document.getElementById('line1');

  if (s1Ind) { s1Ind.classList.remove('active'); s1Ind.classList.add('done'); }
  if (s1num) { s1num.textContent = '✓'; }
  if (line1) { line1.classList.add('done'); }
  if (s2Ind) { s2Ind.classList.add('active'); }
}

/* ── Go back to Step 1 ───────────────────────────────── */
function goBackToStep1() {
  var panel = document.getElementById('step2-panel');
  var step1 = document.getElementById('step1-form');
  var s1Ind = document.getElementById('step1-indicator');
  var s2Ind = document.getElementById('step2-indicator');
  var s1num = document.getElementById('s1num');
  var line1 = document.getElementById('line1');

  if (panel) panel.classList.remove('visible');
  if (step1) step1.style.display = 'block';
  if (s1Ind) { s1Ind.classList.add('active'); s1Ind.classList.remove('done'); }
  if (s1num) s1num.textContent = '1';
  if (line1) line1.classList.remove('done');
  if (s2Ind) s2Ind.classList.remove('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Submit ad: save to AdDb + show success toast ────── */
function submitAd() {
  var toast = document.getElementById('success-toast');
  if (!toast) return;

  // ── Gather all form values ──────────────────────────────
  var bizName  = (document.getElementById('biz-name')     || {}).value || '';
  var category = (document.getElementById('biz-cat')      || {}).value || '';
  var district = (document.getElementById('biz-district') || {}).value || '';
  var phone    = (document.getElementById('biz-phone')    || {}).value || '';
  var tagline  = (document.getElementById('biz-desc')     || {}).value || '';

  // ── Calculate price ─────────────────────────────────────
  var base  = (selSize && selDurIdx !== null) ? PRICES[selSize][selDurIdx] : 0;
  var gst   = Math.round(base * 0.18);
  var total = base + gst;
  var days  = (selDurIdx !== null) ? DUR_DAYS[selDurIdx] : 7;

  // ── Save to AdDb (localStorage) ─────────────────────────
  if (typeof AdDb !== 'undefined') {
    AdDb.save({
      bizName     : bizName.trim(),
      category    : category,
      tagline     : tagline.trim(),
      district    : district,
      phone       : phone.trim(),
      size        : selSize || 'Small',
      duration    : days,
      basePrice   : base,
      totalPrice  : total,
      imageBase64 : capturedImageBase64
    });
  }

  // ── Show success toast ──────────────────────────────────
  toast.style.display    = 'block';
  toast.style.opacity    = '1';
  toast.style.transition = '';

  setTimeout(function () {
    toast.style.opacity    = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(function () {
      // Go to the district feed so user sees their live ad
      window.location.href = 'home.html?district=' + encodeURIComponent(district);
    }, 600);
  }, 3200);
}

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
