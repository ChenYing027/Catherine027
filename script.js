(function () {
  'use strict';

  function initVideoPlayer() {
    const video = document.getElementById('heroVideo');
    const btn = document.getElementById('videoPlayBtn');
    if (!video || !btn) return;

    const togglePlay = function () {
      if (video.paused) {
        video.play().then(function () {
          btn.classList.add('is-playing');
        }).catch(function () {
          btn.classList.remove('is-playing');
        });
      } else {
        video.pause();
        btn.classList.remove('is-playing');
      }
    };

    btn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    video.addEventListener('ended', function () {
      btn.classList.remove('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        setTimeout(function () {
          if (video.paused) btn.classList.remove('is-playing');
        }, 100);
      }
    });

    video.addEventListener('play', function () {
      btn.classList.add('is-playing');
    });
  }

  function initPopObservers() {
    if (!('IntersectionObserver' in window)) return;

    const items = document.querySelectorAll('.pop-in[data-observe]');
    if (items.length === 0) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(function (el) {
      el.style.animationPlayState = 'paused';
      io.observe(el);
    });
  }

  function initHoverWiggleBoost() {
    const cards = document.querySelectorAll('.polaroid, .strip-img, .photo-item, .scrap-card, .work-card, .notebook-card');
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        const wiggles = card.querySelectorAll('.wiggle');
        wiggles.forEach(function (w) {
          w.style.animationDuration = '0.35s';
        });
      });
      card.addEventListener('mouseleave', function () {
        const wiggles = card.querySelectorAll('.wiggle');
        wiggles.forEach(function (w) {
          w.style.animationDuration = '';
        });
      });
    });
  }

  function initNavActiveHighlight() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.top-nav .nav-link');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const target = href.split('/').pop();
      if (target === path) {
        link.classList.add('active');
      } else if (path === '' && target === 'index.html') {
        link.classList.add('active');
      }
    });
  }

  function initLazyImages() {
    if (!('IntersectionObserver' in window) || !('loading' in HTMLImageElement.prototype)) return;

    const images = document.querySelectorAll('img');
    images.forEach(function (img) {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  function initKeyNav() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      const video = document.getElementById('heroVideo');
      const btn = document.getElementById('videoPlayBtn');
      if (video && !video.paused) {
        video.pause();
        if (btn) btn.classList.remove('is-playing');
      }
    });
  }

  function boot() {
    initVideoPlayer();
    initPopObservers();
    initHoverWiggleBoost();
    initNavActiveHighlight();
    initLazyImages();
    initKeyNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
