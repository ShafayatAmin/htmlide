/* ═══════════════════════════════════════════════════════════════════
   HTML IDE Landing — Mobile-First JS
   Terminal typing + scroll-triggered animations (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Terminal Typing Animation ─────────────────────────────────── */
  function initTerminal() {
    const lines = document.querySelectorAll('#terminal-body .terminal-line');
    const preview = document.getElementById('terminal-preview');
    if (!lines.length) return;

    if (prefersReduced) {
      lines.forEach(function (l) { l.classList.add('visible'); });
      if (preview) preview.classList.add('visible');
      return;
    }

    var baseDelay = 300;
    lines.forEach(function (line) {
      var extra = parseInt(line.dataset.delay, 10) || 0;
      setTimeout(function () { line.classList.add('visible'); }, baseDelay + extra);
    });

    if (preview) {
      var lastDelay = baseDelay + parseInt(lines[lines.length - 1].dataset.delay || '0', 10);
      setTimeout(function () { preview.classList.add('visible'); }, lastDelay + 400);
    }
  }

  /* ── Scroll-Triggered Section Animations ───────────────────────── */
  function initScrollAnimations() {
    var sections = document.querySelectorAll('[data-animate]');
    if (!sections.length) return;

    if (prefersReduced) {
      sections.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);

          // If this is the features section, stagger the cards
          if (entry.target.id === 'features') {
            staggerFeatureCards();
          }
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(function (el) { observer.observe(el); });
  }

  /* ── Feature Card Stagger ──────────────────────────────────────── */
  function staggerFeatureCards() {
    var cards = document.querySelectorAll('[data-feature]');
    if (!cards.length) return;

    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.1) + 's';
    });

    // Small delay so the parent .in-view transition starts first,
    // then cards stagger in
    setTimeout(function () {
      cards.forEach(function (card) { card.classList.add('in-view'); });
    }, 200);
  }

  /* ── Nav scroll style ──────────────────────────────────────────── */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.style.background = window.scrollY > 60
            ? 'rgba(10,10,15,0.97)'
            : 'rgba(10,10,15,0.92)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Smooth scroll for anchor links ────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = anchor.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ── Init ──────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initTerminal();
    initScrollAnimations();
    initNav();
    initSmoothScroll();
  });

})();