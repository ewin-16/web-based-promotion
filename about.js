/* ============================================================
   about.js — About Page (about.html)
   Scroll-triggered animations for stat counters
   ============================================================ */

/* ── Animate stat numbers on scroll ─────────────────── */
function animateCounter(el, target, suffix) {
  suffix = suffix || '';
  var start    = 0;
  var duration = 1500; // ms
  var startTime = null;

  // Parse numeric target (strip non-digits for display)
  var numTarget = parseInt(target.replace(/\D/g, ''), 10);

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(eased * numTarget);
    el.textContent = current.toLocaleString('en-IN') + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix; // final value exactly as defined
    }
  }

  requestAnimationFrame(step);
}

/* ── Observe stat cards and trigger animation once ───── */
var statNumbers = document.querySelectorAll('.stat-number');

if (statNumbers.length > 0) {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el      = entry.target;
        var rawText = el.textContent.trim(); // e.g. "14", "500+", "50K+"

        // Determine suffix (+, K+, etc.)
        var suffix = '';
        if (rawText.indexOf('K+') !== -1) {
          suffix = 'K+';
        } else if (rawText.indexOf('+') !== -1) {
          suffix = '+';
        }

        animateCounter(el, rawText, '');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });
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
