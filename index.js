/* ============================================================
   index.js — Landing Page (index.html)
   District selector + particles animation
   ============================================================ */

/* ── District select logic ─────────────────────────── */
const select = document.getElementById('district-select');
const btn    = document.getElementById('btn-view-deals');

// Enable/disable button based on selection
if (select && btn) {
  select.addEventListener('change', function () {
    if (select.value) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  });
}

// Called by quick-select chips
function selectDistrict(name) {
  if (!select) return;
  select.value = name;
  btn.disabled = false;
  select.dispatchEvent(new Event('change'));
}

// View Deals button click
if (btn) {
  btn.addEventListener('click', function () {
    if (!select.value) {
      // Shake the card if no district selected
      var card = document.querySelector('.location-card');
      if (card) {
        card.classList.add('shake');
        card.addEventListener('animationend', function () {
          card.classList.remove('shake');
        }, { once: true });
      }
      return;
    }

    // Fade out and navigate
    var center = document.querySelector('.landing-center');
    if (center) {
      center.style.opacity    = '0';
      center.style.transform  = 'scale(0.96)';
      center.style.transition = 'all 0.4s ease';
    }
    setTimeout(function () {
      window.location.href = 'home.html?district=' + encodeURIComponent(select.value);
    }, 380);
  });
}

/* ── Particle canvas animation ─────────────────────── */
var canvas = document.getElementById('particles-canvas');

if (canvas) {
  var ctx       = canvas.getContext('2d');
  var particles = [];
  var W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function Particle() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 2 + 0.5;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,201,177' : '245,197,66';
  }

  // Spawn 80 particles
  for (var i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  function animParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      ctx.fill();
    });

    requestAnimationFrame(animParticles);
  }

  animParticles();
}

