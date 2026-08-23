/* ===================================================================
 * portfolio.js — Logique complete du portfolio
 * Sofian Lyadi · Data Engineer & Data Analyst
 * =================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * PARTICLES CANVAS
   * ------------------------------------------------------------------ */
  function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      var count = Math.floor((W * H) / 18000);
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          alpha: Math.random() * 0.3 + 0.08
        });
      }
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(13,124,140,' + (0.1 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(13,124,140,' + p.alpha + ')';
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();
    window.addEventListener('resize', function () { resize(); createParticles(); });
  }

  /* ------------------------------------------------------------------
   * NAV OVERLAY
   * ------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var overlay = document.getElementById('nav-overlay');
    var closeBtn = document.getElementById('nav-close');
    if (!toggle || !overlay) return;

    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function openNav() {
      overlay.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      overlay.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    backdrop.addEventListener('click', closeNav);

    // Close on nav link click
    overlay.querySelectorAll('.nav-link').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ------------------------------------------------------------------
   * SCROLL INDICATOR
   * ------------------------------------------------------------------ */
  function initScrollIndicator() {
    var bar = document.getElementById('scroll-bar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.height = pct + '%';
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
   * PROJECT HOVER EFFECT (dim others, highlight hovered)
   * ------------------------------------------------------------------ */
  function initProjectHover() {
    var list = document.getElementById('projects-list');
    if (!list) return;
    var items = list.querySelectorAll('.project-item');
    if (!items.length) return;

    list.addEventListener('mouseenter', function () {
      list.classList.add('has-hover');
    });
    list.addEventListener('mouseleave', function () {
      list.classList.remove('has-hover');
    });
  }

  /* ------------------------------------------------------------------
   * COUNTER ANIMATION
   * ------------------------------------------------------------------ */
  function initCounters() {
    var els = document.querySelectorAll('.hero-stat__num[data-target]');
    if (!els.length) return;

    var done = false;

    function animate(el) {
      var target = parseInt(el.dataset.target, 10);
      var suffix = el.dataset.suffix || '';
      var start = 0;
      var duration = 1400;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }

    if (!window.IntersectionObserver) {
      els.forEach(animate);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      if (done) return;
      var visible = Array.from(entries).some(function (e) { return e.isIntersecting; });
      if (visible) { done = true; els.forEach(animate); obs.disconnect(); }
    }, { threshold: 0.3 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
   * SCROLL REVEAL
   * ------------------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll(
      '.hero-title, .hero-desc, .hero-actions, .hero-stat, ' +
      '.about-quote, .about-body, ' +
      '.stack-row, ' +
      '.project-item, ' +
      '.exp-item, ' +
      '.contact-heading, .contact-email-link'
    );
    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (!window.IntersectionObserver) {
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          var siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
          var delay = Math.min(siblings.indexOf(entry.target) * 80, 320);
          setTimeout(function () { entry.target.classList.add('visible'); }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
   * SMOOTH SCROLL (nav links)
   * ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ------------------------------------------------------------------
   * IMAGE PREVIEW (flottant au survol)
   * ------------------------------------------------------------------ */
  function initPreview() {
    var preview = document.getElementById('project-preview');
    var previewImg = document.getElementById('preview-img');
    if (!preview || !previewImg) return;

    var mouseX = 0, mouseY = 0;
    var rafId = null;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (preview.classList.contains('is-visible')) {
        positionPreview();
      }
    });

    function positionPreview() {
      var w = preview.offsetWidth;
      var h = preview.offsetHeight;
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var offsetX = 24;
      var offsetY = -h / 2;
      var x = mouseX + offsetX;
      var y = mouseY + offsetY;
      if (x + w > vw - 16) x = mouseX - w - offsetX;
      if (y < 16) y = 16;
      if (y + h > vh - 16) y = vh - h - 16;
      preview.style.left = x + 'px';
      preview.style.top  = y + 'px';
    }

    var items = document.querySelectorAll('[data-image]');
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var src = item.dataset.image;
        if (!src) return;
        previewImg.src = src;
        positionPreview();
        preview.classList.add('is-visible');
      });
      item.addEventListener('mouseleave', function () {
        preview.classList.remove('is-visible');
      });
    });
  }

  /* ------------------------------------------------------------------
   * MODAL (clic sur image preview ou item avec support multi-images)
   * ------------------------------------------------------------------ */
  function initModal() {
    var modal    = document.getElementById('project-modal');
    var backdrop = document.getElementById('modal-backdrop');
    var closeBtn = document.getElementById('modal-close');
    var mImg     = document.getElementById('modal-img');
    var mBadge   = document.getElementById('modal-badge');
    var mPeriod  = document.getElementById('modal-period');
    var mTitle   = document.getElementById('modal-title');
    var mTags    = document.getElementById('modal-tags');
    var mDesc    = document.getElementById('modal-desc');
    var mPrev    = document.getElementById('modal-prev');
    var mNext    = document.getElementById('modal-next');
    var mCounter = document.getElementById('modal-img-counter');
    var mThumbs  = document.getElementById('modal-thumbs');

    if (!modal) return;

    var currentImages = [];
    var currentIndex = 0;

    function updateImage() {
      if (!currentImages.length) return;
      
      mImg.style.opacity = '0.3';
      setTimeout(function () {
        mImg.src = currentImages[currentIndex];
        mImg.style.opacity = '1';
      }, 120);

      if (mCounter) {
        mCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
        mCounter.style.display = currentImages.length > 1 ? 'block' : 'none';
      }

      if (mPrev && mNext) {
        mPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
        mNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
      }

      if (mThumbs) {
        var thumbs = mThumbs.querySelectorAll('.modal-thumb');
        thumbs.forEach(function (thumb, idx) {
          if (idx === currentIndex) thumb.classList.add('is-active');
          else thumb.classList.remove('is-active');
        });
      }
    }

    function renderThumbs() {
      if (!mThumbs) return;
      mThumbs.innerHTML = '';
      if (currentImages.length <= 1) return;

      currentImages.forEach(function (src, idx) {
        var t = document.createElement('div');
        t.className = 'modal-thumb' + (idx === currentIndex ? ' is-active' : '');
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Aperçu ' + (idx + 1);
        t.appendChild(img);
        t.addEventListener('click', function () {
          currentIndex = idx;
          updateImage();
        });
        mThumbs.appendChild(t);
      });
    }

    function nextImage() {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateImage();
    }

    function prevImage() {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateImage();
    }

    function openModal(item) {
      var rawImages = item.dataset.images;
      if (rawImages) {
        currentImages = rawImages.split(',').map(function (s) { return s.trim(); });
      } else if (item.dataset.image) {
        currentImages = [item.dataset.image];
      } else {
        currentImages = [];
      }

      currentIndex = 0;
      mImg.alt          = item.dataset.title || '';
      mBadge.innerHTML  = item.dataset.badge  || '';
      mPeriod.innerHTML = item.dataset.period || '';
      mTitle.innerHTML  = item.dataset.title  || '';
      mTags.innerHTML   = item.dataset.tags   || '';
      mDesc.innerHTML   = item.dataset.desc   || '';

      renderThumbs();
      updateImage();

      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-image]').forEach(function (item) {
      item.addEventListener('click', function () { openModal(item); });
    });

    if (mNext) mNext.addEventListener('click', function (e) { e.stopPropagation(); nextImage(); });
    if (mPrev) mPrev.addEventListener('click', function (e) { e.stopPropagation(); prevImage(); });
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    });
  }

  /* ------------------------------------------------------------------
   * INIT
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initNav();
    initScrollIndicator();
    initProjectHover();
    initCounters();
    initReveal();
    initSmoothScroll();
    initPreview();
    initModal();
  });

})();

