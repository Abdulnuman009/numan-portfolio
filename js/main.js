/* ================================================================
   MAIN.JS — Mohammed Abdul Numan Portfolio
   ================================================================ */

'use strict';

/* ── CUSTOM CURSOR (desktop only) ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;
  if ('ontouchstart' in window) return; // skip on touch

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth ring follow
  function ringFollow() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(ringFollow);
  }
  ringFollow();

  // Scale on hover over interactive elements
  const interactives = 'a, button, .tag, .project-card, .skill-card, .arch-card, .learning-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      ring.style.transform   = 'translate(-50%,-50%) scale(1.5)';
      ring.style.borderColor = 'rgba(0,229,255,.7)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform   = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(0,229,255,.4)';
    }
  });
})();


/* ── MOBILE NAV ── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');
  if (!hamburger || !navLinks || !overlay) return;

  function openNav() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('open') ? closeNav() : openNav()
  );
  overlay.addEventListener('click', closeNav);

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });
})();


/* ── NAV SCROLL SHRINK ── */
(function initNavShrink() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── ACTIVE NAV LINK HIGHLIGHT ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── SCROLL REVEAL ── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


/* ── TYPED EFFECT ── */
(function initTyped() {
  const el = document.getElementById('typed-sub');
  if (!el) return;

  const messages = [
    'Full Stack & Cloud Engineer · AI & Data Systems',
    'React.js · FastAPI · GCP · AWS · OpenTelemetry',
    'Building scalable multi-tenant systems',
    'Integrating AI into production pipelines',
    'Deploying on cloud infrastructure'
  ];

  let mi = 0, ci = 0, deleting = false, pausing = false;

  function type() {
    if (pausing) return;
    const msg = messages[mi];

    if (!deleting) {
      el.textContent = msg.slice(0, ci++);
      if (ci > msg.length) {
        pausing = true;
        setTimeout(() => { deleting = true; pausing = false; type(); }, 2600);
        return;
      }
      setTimeout(type, 52);
    } else {
      el.textContent = msg.slice(0, ci--);
      if (ci < 0) {
        deleting = false;
        mi = (mi + 1) % messages.length;
        ci = 0;
        pausing = true;
        setTimeout(() => { pausing = false; type(); }, 400);
        return;
      }
      setTimeout(type, 26);
    }
  }

  // Start after hero animations
  setTimeout(type, 800);
})();


/* ── PROGRESS BARS ANIMATE ON REVEAL ── */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  // Store target widths from inline style
  bars.forEach(bar => {
    const target = bar.style.width || '0%';
    bar.dataset.target = target;
    bar.style.width = '0%';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.style.transition = 'width 1.2s cubic-bezier(.22,1,.36,1)';
          bar.style.width = bar.dataset.target;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ── CARD MOUSE GLOW EFFECT ── */
(function initCardGlow() {
  const cards = document.querySelectorAll(
    '.skill-card, .arch-card, .project-card, .learning-card'
  );
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();


/* ── SMOOTH SCROLL for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── STAT COUNTER ANIMATION ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  function parseNum(text) {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  function animateCounter(el, target, suffix, duration = 1200) {
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const value    = eased * target;
      el.querySelector('.num-val').textContent =
        isDecimal ? value.toFixed(2) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(tick);
    }

    // Wrap text content
    const span = el.querySelector('span');
    const spanHTML = span ? span.outerHTML : '';
    const rawText  = el.textContent.replace(span?.textContent || '', '').trim();
    const num = parseNum(rawText);

    if (!num) return;

    el.innerHTML = `<span class="num-val">${isDecimal ? '0.00' : '0'}</span>${spanHTML}`;
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const span = el.querySelector('span');
      const spanText = span?.textContent || '';
      const text = el.textContent.replace(spanText, '').trim();
      const num  = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (!num) return;

      // Simple approach: just trigger visual pop
      el.style.transition = 'color 0.3s';
      el.style.color = 'var(--accent)';
      setTimeout(() => el.style.color = '', 600);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();


/* ── ACTIVE NAV UNDERLINE CSS ── */
(function addNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: var(--text); }
    .nav-link.active::after { width: 100%; }
  `;
  document.head.appendChild(style);
})();


/* ── BACK TO TOP ON LOGO CLICK ── */
(function initLogoScroll() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── PERFORMANCE: lazy load images ── */
(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native support
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
})();


/* ── FOOTER YEAR ── */
(function setYear() {
  const el = document.querySelector('footer p');
  if (!el) return;
  el.innerHTML = el.innerHTML.replace('2026', new Date().getFullYear());
})();