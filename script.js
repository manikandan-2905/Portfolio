/* =============================================
   MANIKANDAN V — PORTFOLIO JAVASCRIPT
============================================= */

// ================================================
// 1. ANIMATED CANVAS BACKGROUND — PARTICLE NETWORK
// ================================================
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  const COLORS = ['#00f5ff', '#ff007f', '#bf5fff', '#39ff14', '#ffdd00'];
  const NUM_PARTICLES = 110;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.r  = Math.random() * 2.2 + 0.8;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.pulse += 0.02;
      const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.vx += (dx / dist) * force * 0.4;
        this.vy += (dy / dist) * force * 0.4;
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.vx = Math.max(-1.5, Math.min(1.5, this.vx));
      this.vy = Math.max(-1.5, Math.min(1.5, this.vy));

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around
      if (this.x < 0)  this.x = W;
      if (this.x > W)  this.x = 0;
      if (this.y < 0)  this.y = H;
      if (this.y > H)  this.y = 0;

      this.drawR = this.r * pulseFactor;
      this.drawAlpha = this.alpha * pulseFactor;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.drawR, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.drawAlpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = particles[i].color;
          ctx.shadowColor = particles[i].color;
          ctx.shadowBlur = 4;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Floating geometric shapes
  const shapes = Array.from({ length: 6 }, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 60 + 30,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.008,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    color: COLORS[i % COLORS.length],
    alpha: 0.04 + Math.random() * 0.04,
    sides: [3, 4, 6][Math.floor(Math.random() * 3)],
  }));

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.beginPath();
    for (let i = 0; i < s.sides; i++) {
      const angle = (i / s.sides) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(angle) * s.size;
      const py = Math.sin(angle) * s.size;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = s.alpha;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Update & draw shapes
    shapes.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.rotation += s.rotationSpeed;
      if (s.x < -s.size) s.x = W + s.size;
      if (s.x > W + s.size) s.x = -s.size;
      if (s.y < -s.size) s.y = H + s.size;
      if (s.y > H + s.size) s.y = -s.size;
      drawShape(s);
    });

    // Draw connections
    drawConnections();

    // Update & draw particles
    particles.forEach(p => { p.update(); p.draw(); });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  init();
  animate();
})();


// ================================================
// 2. CUSTOM CURSOR
// ================================================
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let cx = 0, cy = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', e => {
  dotX = e.clientX; dotY = e.clientY;
});

(function animateCursor() {
  cx += (dotX - cx) * 0.12;
  cy += (dotY - cy) * 0.12;
  cursor.style.left    = cx + 'px';
  cursor.style.top     = cy + 'px';
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hover effects on interactive elements
document.querySelectorAll('a, button, .orb-card, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '56px';
    cursor.style.height = '56px';
    cursor.style.borderColor = 'var(--neon-pink)';
    cursor.style.background  = 'rgba(255,0,127,0.08)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '36px';
    cursor.style.height = '36px';
    cursor.style.borderColor = 'var(--neon-cyan)';
    cursor.style.background  = 'transparent';
  });
});


// ================================================
// 3. NAVBAR — SCROLL + HAMBURGER
// ================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}


// ================================================
// 4. TYPING ANIMATION
// ================================================
const phrases = [
  'Full Stack Developer',
  'MERN Stack Expert',
  'React Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 55 : 85);
}
setTimeout(typeLoop, 1000);


// ================================================
// 5. COUNTER ANIMATION (HERO STATS)
// ================================================
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 40);
  });
}
setTimeout(animateCounters, 1200);


// ================================================
// 6. SCROLL REVEAL
// ================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ================================================
// 7. SKILL BAR ANIMATION
// ================================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-bars');
if (skillsSection) skillObserver.observe(skillsSection);


// ================================================
// 8. CONTACT FORM (mailto fallback)
// ================================================
const contactForm = document.getElementById('contactForm');
const sendBtn     = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Animate button
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;

    setTimeout(() => {
      const mailtoLink = `mailto:mani261829@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;

      sendBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      formSuccess.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        sendBtn.disabled = false;
        formSuccess.classList.remove('show');
      }, 4000);
    }, 1200);
  });
}


// ================================================
// 9. SMOOTH SECTION FADE-IN ON LOAD
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});


// ================================================
// 10. ORBIT DOTS CONTINUOUS ANIMATION
// ================================================
(function orbitAnimation() {
  const dots = ['.dot1', '.dot2', '.dot3', '.dot4'];
  const radius = 160;
  const centerX = 0, centerY = 0;
  let angle = 0;

  function rotate() {
    angle += 0.008;
    dots.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const a = angle + (i * Math.PI) / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      el.style.left = `calc(50% + ${x}px - 23px)`;
      el.style.top  = `calc(50% + ${y}px - 23px)`;
    });
    requestAnimationFrame(rotate);
  }
  rotate();
})();


// ================================================
// 11. NEON GLOW MOUSE TRAIL (subtle)
// ================================================
const glowTrails = [];
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.85) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--neon-cyan);
      box-shadow: 0 0 10px var(--neon-cyan);
      pointer-events: none;
      z-index: 9990;
      transform: translate(-50%,-50%);
      transition: opacity 0.6s, transform 0.6s;
    `;
    document.body.appendChild(trail);
    requestAnimationFrame(() => {
      trail.style.opacity = '0';
      trail.style.transform = 'translate(-50%,-50%) scale(3)';
    });
    setTimeout(() => trail.remove(), 700);
  }
});
