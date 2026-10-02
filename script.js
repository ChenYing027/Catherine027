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

  function initPageTransitions() {
    const startLeave = function () {
      document.body.classList.add('is-leaving');
    };

    window.addEventListener('beforeunload', startLeave);
    window.addEventListener('pagehide', startLeave);

    document.addEventListener('click', function (e) {
      const link = e.target.closest && e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      if (link.host && link.host !== window.location.host) return;
      if (/^mailto:|^tel:|^javascript:/i.test(href)) return;
      startLeave();
    }, true);
  }

  function initPortfolioViewSwitcher() {
    const detailViews = document.getElementById('detail-views');
    if (!detailViews) return;

    const VALID = [
      'section-aigc',
      'section-posters',
      'section-photovideo',
      'section-gzrb',
      'section-shanghai'
    ];

    const categorySections = document.querySelectorAll('#detail-views .category-section');

    function clearActiveSections() {
      categorySections.forEach(function (sec) {
        sec.classList.remove('is-active');
        sec.setAttribute('aria-hidden', 'true');
      });
    }

    function showHubView(pushScroll) {
      document.body.classList.remove('portfolio-view-detail');
      clearActiveSections();
      try {
        if (window.history && typeof window.history.replaceState === 'function') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (err) { /* ignore */ }
      if (pushScroll !== false) {
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
      }
    }

    function showDetailView(targetId) {
      if (!targetId) return;
      if (VALID.indexOf(targetId) === -1) return;
      clearActiveSections();
      const target = document.getElementById(targetId);
      if (!target) return;
      document.body.classList.add('portfolio-view-detail');
      target.classList.add('is-active');
      target.setAttribute('aria-hidden', 'false');
      try {
        if (window.history && typeof window.history.replaceState === 'function') {
          window.history.replaceState(null, '', '#' + targetId);
        }
      } catch (err) { /* ignore */ }
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    }

    function parseHash() {
      const h = window.location.hash || '';
      if (!h || h.length < 2) return null;
      const raw = h.charAt(0) === '#' ? h.slice(1) : h;
      if (VALID.indexOf(raw) !== -1) return raw;
      return null;
    }

    const hubCards = document.querySelectorAll('.float-card-wrapper a.float-card');
    hubCards.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = anchor.getAttribute('href') || '';
        if (!href || href.charAt(0) !== '#') return;
        const id = href.slice(1);
        if (VALID.indexOf(id) === -1) return;
        e.preventDefault();
        showDetailView(id);
      });
    });

    document.addEventListener('click', function (e) {
      const backBtn = e.target.closest && e.target.closest('[data-back-to-hub="true"]');
      if (!backBtn) return;
      e.preventDefault();
      showHubView(true);
    });

    window.addEventListener('hashchange', function () {
      const id = parseHash();
      if (!id) {
        showHubView(true);
        return;
      }
      showDetailView(id);
    });

    const initialId = parseHash();
    if (initialId) {
      showDetailView(initialId);
    } else {
      showHubView(false);
    }
  }

  function boot() {
    initPageTransitions();
    initVideoPlayer();
    initPopObservers();
    initHoverWiggleBoost();
    initNavActiveHighlight();
    initLazyImages();
    initKeyNav();
    initPortfolioViewSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
