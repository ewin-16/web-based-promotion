/* ============================================================
   pricing.js — Pricing Page (pricing.html)
   FAQ accordion toggle
   ============================================================ */

/* ── FAQ accordion ───────────────────────────────────── */
function toggleFaq(el) {
  var isOpen = el.classList.contains('open');

  // Close all open FAQ items first
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.classList.remove('open');
  });

  // If the clicked item was NOT already open, open it
  if (!isOpen) {
    el.classList.add('open');
  }
  // If it was open, clicking closes it (already removed above)
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
