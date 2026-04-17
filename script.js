/* ============================================================
   PORTFOLIO SCRIPT — Shashi Kumar Goud
============================================================ */

// ===================== CUSTOM CURSOR =====================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function animCursor() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .tag, .proj-card, .skill-cat').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '58px';
    cursorRing.style.height = '58px';
    cursorRing.style.opacity = '.28';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '38px';
    cursorRing.style.height = '38px';
    cursorRing.style.opacity = '.55';
  });
});

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveNav();
});

// ===================== THEME TOGGLE =====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

function setTheme(t) {
  html.setAttribute('data-theme', t);
  themeIcon.className = t === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
  localStorage.setItem('portfolio-theme', t);
}

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  // re-colour particles
  initParticles();
});

setTheme(localStorage.getItem('portfolio-theme') || 'dark');

// ===================== HAMBURGER / DRAWER =====================
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  const [s0, s1, s2] = hamburger.querySelectorAll('span');
  s0.style.transform = 'rotate(45deg) translate(5px,5px)';
  s1.style.opacity   = '0';
  s2.style.transform = 'rotate(-45deg) translate(5px,-5px)';
}

function closeDrawer() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('show');
  document.body.style.overflow = '';
  hamburger.querySelectorAll('span').forEach(s => {
    s.style.transform = '';
    s.style.opacity   = '';
  });
}

hamburger.addEventListener('click', () => {
  mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

window.closeDrawer = closeDrawer;

// ===================== TYPEWRITER =====================
const roles  = ['Data Analyst', 'Frontend Developer', 'Python Developer', 'SQL Developer', 'Problem Solver'];
const typeEl = document.getElementById('typewriter');
let rIdx = 0, cIdx = 0, deleting = false;

function type() {
  const word = roles[rIdx];
  typeEl.textContent = deleting
    ? word.slice(0, cIdx - 1)
    : word.slice(0, cIdx + 1);
  deleting ? cIdx-- : cIdx++;

  if (!deleting && cIdx === word.length) {
    setTimeout(() => { deleting = true; setTimeout(type, 80); }, 2200);
    return;
  }
  if (deleting && cIdx === 0) {
    deleting = false;
    rIdx = (rIdx + 1) % roles.length;
    setTimeout(type, 320);
    return;
  }
  setTimeout(type, deleting ? 55 : 95);
}
setTimeout(type, 1000);

// ===================== PARTICLES =====================
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Dot {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 1.4 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.38;
    this.vy = (Math.random() - 0.5) * 0.38;
    this.o  = Math.random() * 0.55 + 0.1;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw(rgb) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb},${this.o})`;
    ctx.fill();
  }
}

function initParticles() {
  const n = Math.min(Math.floor(canvas.width * canvas.height / 9000), 130);
  particles = Array.from({ length: n }, () => new Dot());
}

function getRGB() {
  return html.getAttribute('data-theme') === 'light' ? '0,92,230' : '0,229,255';
}

function connect(rgb) {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 105) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${rgb},${(1 - d / 105) * 0.14})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rgb = getRGB();
  particles.forEach(p => { p.move(); p.draw(rgb); });
  connect(rgb);
  requestAnimationFrame(animate);
})();

resize();
initParticles();
window.addEventListener('resize', () => { resize(); initParticles(); });

// ===================== SCROLL REVEAL =====================
const revEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

revEls.forEach(el => revObs.observe(el));

// ===================== ACTIVE NAV =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightActiveNav() {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}

// ===================== SMOOTH SCROLL for logo =====================
document.querySelector('.nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== TILT EFFECT on project cards =====================
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-9px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===================== COUNTER ANIMATION =====================
function animateCounter(el, target, decimals = 0) {
  let start = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = decimals ? start.toFixed(decimals) : Math.floor(start) + '+';
  }, 18);
}

const statObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.s-num').forEach(el => {
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (!isNaN(num)) {
        const dec = raw.includes('.') ? 2 : 0;
        el.textContent = '0';
        animateCounter(el, num, dec);
      }
    });
    statObs.disconnect();
  }
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statObs.observe(statsRow);

// ===================== KONAMI / EASTER EGG =====================
// (just for fun — type "shashi" anywhere)
let buffer = '';
document.addEventListener('keydown', e => {
  buffer = (buffer + e.key).slice(-6);
  if (buffer.toLowerCase() === 'shashi') {
    document.body.style.animation = 'none';
    const flash = document.createElement('div');
    flash.style.cssText =
      'position:fixed;inset:0;background:rgba(0,229,255,.06);z-index:9999;' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-family:JetBrains Mono,monospace;font-size:2rem;color:#00e5ff;' +
      'animation:fadeUp .5s ease both;pointer-events:none;';
    flash.textContent = '👋 Hey Shashi!';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 2000);
    buffer = '';
  }
});
