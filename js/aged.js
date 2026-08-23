/* ===================================================================
 * aged.js — Logique référentiel AGED · BUT Informatique AGED
 * Sofian Lyadi · Fichier additif (chargé après portfolio.js)
 * =================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * FILTRES PAR COMPÉTENCE AC
   * Filtre les .project-item selon leur attribut data-ac="C1,C2,C3"
   * ------------------------------------------------------------------ */
  function initAcFilters() {
    var filters = document.querySelectorAll('.ac-filter-btn');
    var list    = document.getElementById('projects-list');
    if (!filters.length || !list) return;

    var items = list.querySelectorAll('.project-item');

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;

        // Mise à jour état actif des boutons
        filters.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        if (filter === 'all') {
          // Tout afficher — retirer le mode filtrage
          list.classList.remove('ac-filtering');
          items.forEach(function (item) {
            item.classList.remove('ac-match');
          });
        } else {
          // Activer le mode filtrage
          list.classList.add('ac-filtering');
          // Retirer has-hover pendant le filtrage (éviter conflit)
          list.classList.remove('has-hover');

          items.forEach(function (item) {
            var acData = item.dataset.ac || '';
            var acList = acData.split(',').map(function (s) { return s.trim(); });
            if (acList.indexOf(filter) !== -1) {
              item.classList.add('ac-match');
            } else {
              item.classList.remove('ac-match');
            }
          });
        }
      });
    });

    // Quand le filtre est actif, désactiver has-hover (ne pas re-activer)
    list.addEventListener('mouseenter', function () {
      if (list.classList.contains('ac-filtering')) return;
      list.classList.add('has-hover');
    });
    list.addEventListener('mouseleave', function () {
      if (list.classList.contains('ac-filtering')) return;
      list.classList.remove('has-hover');
    });
  }

  /* ------------------------------------------------------------------
   * TOOLTIP CODES AC (info au survol des badges)
   * ------------------------------------------------------------------ */
  function initAcTooltips() {
    var AC_DESCRIPTIONS = {
      'AC31.01': 'Concevoir une BDD relationnelle complexe / entrepôt de données',
      'AC31.02': 'Assurer la qualité, la fiabilité et la gouvernance des données',
      'AC32.01': 'Élaborer et optimiser des pipelines d\'intégration de données',
      'AC32.02': 'Automatiser les traitements et l\'orchestration des flux',
      'AC33.01': 'Construire des tableaux de bord décisionnels interactifs',
      'AC33.02': 'Restituer la valeur métier et guider la prise de décision'
    };

    // Créer le tooltip DOM
    var tooltip = document.createElement('div');
    tooltip.id = 'ac-tooltip';
    tooltip.style.cssText = [
      'position:fixed',
      'z-index:9999',
      'pointer-events:none',
      'opacity:0',
      'background:#0F172A',
      'color:#F1F5F9',
      'font-family:\'Inter\',sans-serif',
      'font-size:12px',
      'line-height:1.5',
      'padding:8px 14px',
      'border-radius:6px',
      'max-width:280px',
      'box-shadow:0 8px 24px rgba(0,0,0,0.3)',
      'transition:opacity 0.15s ease',
      'white-space:normal'
    ].join(';');
    document.body.appendChild(tooltip);

    var badges = document.querySelectorAll('.ac-badge[data-ac-code]');
    badges.forEach(function (badge) {
      var code = badge.dataset.acCode;
      if (!AC_DESCRIPTIONS[code]) return;

      badge.addEventListener('mouseenter', function (e) {
        tooltip.textContent = AC_DESCRIPTIONS[code];
        tooltip.style.opacity = '1';
        positionTooltip(e);
      });
      badge.addEventListener('mousemove', positionTooltip);
      badge.addEventListener('mouseleave', function () {
        tooltip.style.opacity = '0';
      });
    });

    function positionTooltip(e) {
      var x = e.clientX + 12;
      var y = e.clientY - 36;
      var tw = tooltip.offsetWidth;
      var th = tooltip.offsetHeight;
      if (x + tw > window.innerWidth - 8) x = e.clientX - tw - 12;
      if (y < 8) y = e.clientY + 16;
      if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    }
  }

  /* ------------------------------------------------------------------
   * REVEAL SCROLL pour les composants AGED
   * ------------------------------------------------------------------ */
  function initAgedReveal() {
    var targets = document.querySelectorAll(
      '.ac-competence-block, .ac-matrix-row, ' +
      '.progression-card, .roi-stat, ' +
      '.referentiel-intro'
    );

    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (!window.IntersectionObserver) {
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Délai en cascade pour les éléments frères
          var parent = entry.target.parentElement;
          var siblings = Array.from(parent.querySelectorAll('.reveal:not(.visible)'));
          var idx = siblings.indexOf(entry.target);
          var delay = Math.min(idx * 70, 280);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
   * HIGHLIGHT COMPÉTENCES dans la section #parcours AGED
   * Quand un filtre AC est actif, mettre en avant la description AGED
   * dans le parcours (BUT AGED)
   * ------------------------------------------------------------------ */
  function initParcoursSyncHighlight() {
    var filters = document.querySelectorAll('.ac-filter-btn[data-filter]');
    var agedExp = document.querySelector('.exp-item[data-type="aged"]');
    if (!filters.length || !agedExp) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        if (filter !== 'all') {
          agedExp.classList.add('exp-item--highlighted');
        } else {
          agedExp.classList.remove('exp-item--highlighted');
        }
      });
    });
  }

  /* ------------------------------------------------------------------
   * ROI COUNTERS — Animation des chiffres dans le bloc progression
   * ------------------------------------------------------------------ */
  function initRoiCounters() {
    var counters = document.querySelectorAll('.roi-stat__num[data-target]');
    if (!counters.length) return;

    if (!window.IntersectionObserver) {
      counters.forEach(function (el) {
        el.textContent = el.dataset.target + (el.dataset.suffix || '');
      });
      return;
    }

    var done = false;
    var obs = new IntersectionObserver(function (entries) {
      if (done) return;
      var visible = Array.from(entries).some(function (e) { return e.isIntersecting; });
      if (!visible) return;
      done = true;
      obs.disconnect();

      counters.forEach(function (el) {
        var target = parseFloat(el.dataset.target);
        var suffix = el.dataset.suffix || '';
        var isDecimal = String(target).indexOf('.') !== -1;
        var duration = 1200;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          var val = ease * target;
          el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
   * INIT
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initAcFilters();
    initAcTooltips();
    initAgedReveal();
    initParcoursSyncHighlight();
    initRoiCounters();
  });

})();
