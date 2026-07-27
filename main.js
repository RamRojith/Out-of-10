/* ══════════════════════════════════════════
   MAIN.JS — OUT OF 10
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── PAGE LOADER ── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 400);
    });
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ── SMOOTH SCROLL (anchor links) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── INTERSECTION OBSERVER — SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate], [data-stagger]').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ── TILT EFFECT ON CARDS (desktop only) ── */
  if (window.matchMedia('(min-width: 769px) and (hover: hover)').matches) {
    document.querySelectorAll('.service-card, .team-card, .help-card, .phase-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── PARALLAX ON HERO (subtle) ── */
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 800) {
        heroSection.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK HIGHLIGHT ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ── FORM FIELD ANIMATIONS ── */
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
    field.addEventListener('focus', () => field.parentElement.classList.add('focused'));
    field.addEventListener('blur', () => field.parentElement.classList.remove('focused'));
  });

  /* ══════════════════════════════════════════
     TEXT ANIMATIONS
     ══════════════════════════════════════════ */

  /* ── SPLIT TEXT: CHARS ── */
  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.style.transitionDelay = `${i * 0.03}s`;
      span.textContent = char === ' ' ? '\u00A0' : char;
      el.appendChild(span);
    });
  }

  /* ── SPLIT TEXT: WORDS ── */
  function splitWords(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.classList.add('word');
      span.style.transitionDelay = `${i * 0.07}s`;
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) {
        const space = document.createTextNode(' ');
        el.appendChild(space);
      }
    });
  }

  /* ── SPLIT TEXT: LINES (wraps each line) ── */
  function splitLines(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      const wrap = document.createElement('span');
      wrap.classList.add('line-wrap');
      const inner = document.createElement('span');
      inner.classList.add('line-inner');
      inner.style.transitionDelay = `${i * 0.06}s`;
      inner.textContent = word;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  }

  /* ── INITIALIZE SPLIT TEXT ELEMENTS ── */
  document.querySelectorAll('[data-split="chars"]').forEach(splitChars);
  document.querySelectorAll('[data-split="words"]').forEach(splitWords);
  document.querySelectorAll('[data-split="lines"]').forEach(splitLines);

  /* ── INITIALIZE CLIP / WIPE / BLUR REVEALS ── */
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (el.getAttribute('data-reveal') === 'clip' || el.getAttribute('data-reveal') === 'wipe' || el.getAttribute('data-reveal') === 'blur') {
      revealObserver.observe(el);
    }
  });

  /* ── TEXT REVEAL OBSERVER ── */
  const textRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          textRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('[data-split], [data-reveal]').forEach(el => {
    textRevealObserver.observe(el);
  });

  /* ── TYPING EFFECT ── */
  function typeText(el, speed) {
    const fullText = el.getAttribute('data-type-text') || el.textContent.trim();
    el.setAttribute('data-type-text', fullText);
    el.textContent = '';
    el.classList.add('is-typing');
    el.style.width = 'auto';
    let i = 0;

    function type() {
      if (i < fullText.length) {
        el.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.remove('is-typing');
        el.classList.add('is-typed');
      }
    }

    type();
  }

  const typeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const speed = parseInt(entry.target.getAttribute('data-type-speed'), 10) || 60;
          setTimeout(() => typeText(entry.target, speed), 400);
          typeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-type]').forEach(el => {
    typeObserver.observe(el);
  });

  /* ── TEXT STAGGER DELAYS (auto-assign delays to children) ── */
  document.querySelectorAll('[data-text-stagger]').forEach(container => {
    const delay = parseFloat(container.getAttribute('data-text-stagger')) || 0.08;
    const children = container.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}s`;
    });
  });

})();
