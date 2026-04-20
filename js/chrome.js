/* ─────────────────────────────────────────────────────────────
 * Darsync Shared Chrome — injects the floating pill nav,
 * mobile menu, ⌘K command palette and wires all behaviors
 * (scroll-shrink, nav clock, language toggle, morphing pill
 * indicator, cmdk keyboard nav).
 *
 * Inner pages just need:
 *   <link rel="stylesheet" href="{rel}/css/chrome.css">
 *   <script src="{rel}/js/chrome.js" defer></script>
 * and the lang-bootstrap <script> in <head>.
 * ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';
  if (window.__darsyncChromeInstalled) return;
  window.__darsyncChromeInstalled = true;

  /* ── Figure out the relative path to root ──────────────────
   * Derived from the location of chrome.js itself. */
  var scriptPath = (function () {
    var s = document.currentScript || document.querySelector('script[src*="chrome.js"]');
    var src = s ? s.getAttribute('src') : 'js/chrome.js';
    // strip trailing "js/chrome.js"
    return src.replace(/js\/chrome\.js.*$/, '');
  })();
  var REL = scriptPath || '';

  /* ── Translations (nav + footer + CTA only) ────────────── */
  var TR = {
    en: {
      features: 'Features', solutions: 'Solutions', industries: 'Industries',
      pricing: 'Pricing', resources: 'Resources', cta: 'Start free trial'
    },
    ar: {
      features: 'الميزات', solutions: 'الحلول', industries: 'القطاعات',
      pricing: 'الأسعار', resources: 'الموارد', cta: 'ابدأ النسخة التجريبية'
    }
  };

  /* ── HTML templates ───────────────────────────────────── */
  var NAV_HTML =
    '<header class="site-header" role="banner">' +
      '<div class="nav-shell">' +
        '<a href="' + REL + '" class="logo" aria-label="Darsync Home">' +
          '<img src="' + REL + 'images/image.png" alt="Darsync" height="56" style="display:block;height:56px;width:auto;object-fit:contain;">' +
        '</a>' +
        '<nav class="nav-pill" role="navigation" aria-label="Main navigation">' +
          '<span class="nav-pill__indicator" aria-hidden="true"></span>' +
          '<a href="' + REL + 'features/"   data-key="features">Features</a>' +
          '<a href="' + REL + 'solutions/"  data-key="solutions">Solutions</a>' +
          '<a href="' + REL + 'industries/" data-key="industries">Industries</a>' +
          '<a href="' + REL + 'pricing/"    data-key="pricing">Pricing</a>' +
          '<a href="' + REL + 'resources/"  data-key="resources">Resources</a>' +
        '</nav>' +
        '<div class="nav-cluster">' +
          '<div class="nav-clock" aria-label="Gulf Standard Time">' +
            '<span class="nav-clock__dot"></span>' +
            '<span id="nav-clock">GST · --:--:--</span>' +
          '</div>' +
          '<button class="nav-lang" id="nav-lang" data-lang="en" aria-label="Toggle language">' +
            '<span class="nav-lang__pill" aria-hidden="true"></span>' +
            '<span class="nav-lang__option is-active" data-lang="en">EN</span>' +
            '<span class="nav-lang__option" data-lang="ar">AR</span>' +
          '</button>' +
          '<button class="nav-cmdk" id="nav-cmdk" aria-label="Open command palette">' +
            '<span class="nav-cmdk__key">⌘</span>' +
            '<span class="nav-cmdk__key">K</span>' +
          '</button>' +
          '<a href="' + REL + 'contact/demo.html" class="nav-cta" data-key="cta">Start free trial</a>' +
          '<button class="mobile-toggle" id="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>' +
        '</div>' +
      '</div>' +
    '</header>';

  var MOBILE_MENU_HTML =
    '<div class="mobile-menu" id="mobile-menu" aria-hidden="true" role="dialog" aria-label="Mobile navigation">' +
      '<div class="mobile-menu__header">' +
        '<a href="' + REL + '" class="logo"><img src="' + REL + 'images/image.png" alt="Darsync"></a>' +
        '<button class="mobile-menu__close" id="mobile-menu-close" aria-label="Close menu">✕</button>' +
      '</div>' +
      '<div class="mobile-menu__body">' +
        '<nav class="mobile-menu__nav">' +
          '<a href="' + REL + 'features/"   data-key="features">Features</a>' +
          '<a href="' + REL + 'solutions/"  data-key="solutions">Solutions</a>' +
          '<a href="' + REL + 'industries/" data-key="industries">Industries</a>' +
          '<a href="' + REL + 'pricing/"    data-key="pricing">Pricing</a>' +
          '<a href="' + REL + 'resources/"  data-key="resources">Resources</a>' +
        '</nav>' +
        '<div class="mobile-menu__footer">' +
          '<a href="' + REL + 'contact/demo.html" class="nav-cta" data-key="cta">Start free trial</a>' +
          '<div class="mobile-menu__meta">' +
            '<span>GST · <span id="mobile-clock">--:--</span></span>' +
            '<a href="tel:+97140000000">+971 4 XXX XXXX</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var CMDK_DATA = [
    { group: 'Features', icon: '◆', items: [
      { title: 'Ejari & compliance', desc: 'Automated registration, RERA alerts', url: 'features/ejari-compliance.html' },
      { title: 'PDC automation', desc: 'Post-dated cheque lifecycle', url: 'features/pdc-automation.html' },
      { title: 'Smart maintenance', desc: 'AI-routed work orders', url: 'features/smart-maintenance.html' },
      { title: 'Owner dashboard', desc: 'Real-time NOI & occupancy', url: 'features/owner-dashboard.html' },
      { title: 'Tenant portal', desc: 'Self-service payments & requests', url: 'features/tenant-portal.html' },
      { title: 'WhatsApp workflows', desc: 'Chat-native tenant comms', url: 'features/whatsapp-workflows.html' }
    ]},
    { group: 'Solutions', icon: '◧', items: [
      { title: 'Property managers',   url: 'solutions/property-managers.html' },
      { title: 'Finance teams',       url: 'solutions/finance-teams.html' },
      { title: 'Maintenance teams',   url: 'solutions/maintenance-teams.html' },
      { title: 'Leasing agents',      url: 'solutions/leasing-agents.html' },
      { title: 'Owners & investors',  url: 'solutions/owners-investors.html' },
      { title: 'Compliance officers', url: 'solutions/compliance-officers.html' },
      { title: 'Security teams',      url: 'solutions/security-teams.html' }
    ]},
    { group: 'Industries', icon: '◫', items: [
      { title: 'Residential',    url: 'industries/residential.html' },
      { title: 'Commercial',     url: 'industries/commercial.html' },
      { title: 'Mixed-use',      url: 'industries/mixed-use.html' },
      { title: 'Hospitality',    url: 'industries/vacation-rentals.html' },
      { title: 'Student housing', url: 'industries/student-housing.html' },
      { title: 'Co-working',     url: 'industries/co-working.html' },
      { title: 'Owners assoc.',  url: 'industries/owners-associations.html' },
      { title: 'Developers',     url: 'industries/real-estate-developers.html' }
    ]},
    { group: 'Pages', icon: '→', items: [
      { title: 'Pricing',      url: 'pricing/' },
      { title: 'Book a demo',  url: 'contact/demo.html' },
      { title: 'ROI calculator', url: 'resources/roi-calculator.html' },
      { title: 'FAQ',          url: 'resources/faq.html' },
      { title: 'Blog',         url: 'blog/' },
      { title: 'Compare',      url: 'compare/' }
    ]}
  ];

  var CMDK_HTML =
    '<div class="cmdk" id="cmdk-root" aria-hidden="true">' +
      '<div class="cmdk__backdrop" id="cmdk-backdrop"></div>' +
      '<div class="cmdk__panel" role="dialog" aria-label="Command palette">' +
        '<div class="cmdk__input-wrap">' +
          '<span class="cmdk__search-icon" aria-hidden="true">⌕</span>' +
          '<input class="cmdk__input" id="cmdk-input" type="text" placeholder="Search Darsync — features, solutions, pricing…" autocomplete="off">' +
          '<kbd class="cmdk__esc">ESC</kbd>' +
        '</div>' +
        '<div class="cmdk__results" id="cmdk-results"></div>' +
        '<div class="cmdk__footer">' +
          '<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
          '<span><kbd>↵</kbd> open</span>' +
          '<span><kbd>ESC</kbd> close</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ── Install: only on pages that don't already have the pill nav ───── */
  function install() {
    // If a pill-nav is already present (flagship page inline markup),
    // just wire behaviors against the existing DOM.
    if (!document.querySelector('.nav-shell')) {
      // remove any legacy <header class="site-header"> that came from old markup
      var legacy = document.querySelectorAll('header.site-header, nav.nav');
      legacy.forEach(function (el) {
        // only strip the outermost legacy header/nav; skip nested use of class="nav"
        if (el.parentElement === document.body || el.parentElement.tagName === 'BODY') {
          el.remove();
        } else if (el.tagName === 'HEADER' || (el.tagName === 'NAV' && el.classList.contains('nav'))) {
          el.remove();
        }
      });
      // Inject nav at the top of body
      document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    }

    // Inject mobile menu + cmdk if not already present
    if (!document.getElementById('mobile-menu')) {
      document.body.insertAdjacentHTML('beforeend', MOBILE_MENU_HTML);
    }
    if (!document.getElementById('cmdk-root')) {
      document.body.insertAdjacentHTML('beforeend', CMDK_HTML);
    }

    // Mark body so chrome.css can push page content down
    document.body.classList.add('chrome-installed');

    wireBehaviors();
  }

  /* ── Wire up all behaviors ──────────────────────────────── */
  function wireBehaviors() {
    /* Scroll-shrink */
    var header = document.querySelector('.site-header');
    if (header) {
      var lastScrolled = false;
      function onScroll() {
        var scrolled = window.scrollY > 40;
        if (scrolled !== lastScrolled) {
          header.classList.toggle('scrolled', scrolled);
          lastScrolled = scrolled;
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Morphing indicator on nav-pill */
    var navPill = document.querySelector('.nav-pill');
    if (navPill) {
      var indicator = navPill.querySelector('.nav-pill__indicator');
      var links = navPill.querySelectorAll('a');
      function move(el) {
        if (!indicator || !el) return;
        var pr = navPill.getBoundingClientRect();
        var er = el.getBoundingClientRect();
        indicator.style.width = er.width + 'px';
        indicator.style.left = (er.left - pr.left) + 'px';
      }
      links.forEach(function (a) {
        a.addEventListener('mouseenter', function () { navPill.classList.add('has-hover'); move(a); });
      });
      navPill.addEventListener('mouseleave', function () { navPill.classList.remove('has-hover'); });
    }

    /* GST clocks (nav + mobile) */
    var navClock = document.getElementById('nav-clock');
    var mobileClock = document.getElementById('mobile-clock');
    if (navClock || mobileClock) {
      function tick() {
        var now = new Date();
        var utc = now.getTime() + now.getTimezoneOffset() * 60000;
        var gst = new Date(utc + 4 * 3600000);
        var p = function (n) { return n < 10 ? '0' + n : n; };
        if (navClock) navClock.textContent = 'GST · ' + p(gst.getHours()) + ':' + p(gst.getMinutes()) + ':' + p(gst.getSeconds());
        if (mobileClock) mobileClock.textContent = p(gst.getHours()) + ':' + p(gst.getMinutes());
      }
      tick();
      setInterval(tick, 1000);
    }

    /* Language toggle (chrome only — nav + CTA) */
    var navLang = document.getElementById('nav-lang');
    if (navLang) {
      function positionPill() {
        var active = navLang.querySelector('.nav-lang__option.is-active');
        var pill = navLang.querySelector('.nav-lang__pill');
        if (!active || !pill) return;
        pill.style.left = active.offsetLeft + 'px';
        pill.style.width = active.offsetWidth + 'px';
      }
      function applyLang(lang) {
        navLang.dataset.lang = lang;
        document.documentElement.setAttribute('data-lang-active', lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        navLang.querySelectorAll('.nav-lang__option').forEach(function (o) {
          o.classList.toggle('is-active', o.dataset.lang === lang);
        });
        /* Only translate data-key elements that we own (nav + footer basics).
           Page-level [data-i18n] translations are handled by flagship pages' own scripts. */
        document.querySelectorAll('[data-key]').forEach(function (el) {
          var k = el.dataset.key;
          if (TR[lang][k] !== undefined) el.textContent = TR[lang][k];
        });
        try { localStorage.setItem('darsync-lang', lang); } catch (e) {}
        requestAnimationFrame(positionPill);
      }
      var saved = 'en';
      try { saved = localStorage.getItem('darsync-lang') || 'en'; } catch (e) {}
      applyLang(saved);
      navLang.addEventListener('click', function () {
        applyLang(navLang.dataset.lang === 'en' ? 'ar' : 'en');
      });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(positionPill).catch(function () {});
      }
      window.addEventListener('resize', positionPill);
    }

    /* Mobile menu */
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileToggle = document.getElementById('mobile-toggle');
    var mobileClose = document.getElementById('mobile-menu-close');
    if (mobileMenu && mobileToggle) {
      function openM() { mobileMenu.classList.add('is-open'); mobileMenu.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
      function closeM() { mobileMenu.classList.remove('is-open'); mobileMenu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
      mobileToggle.addEventListener('click', openM);
      if (mobileClose) mobileClose.addEventListener('click', closeM);
      mobileMenu.querySelectorAll('.mobile-menu__nav a, .mobile-menu__footer .nav-cta').forEach(function (a) {
        a.addEventListener('click', closeM);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeM();
      });
    }

    /* ⌘K command palette */
    var cmdkRoot = document.getElementById('cmdk-root');
    var cmdkInput = document.getElementById('cmdk-input');
    var cmdkResults = document.getElementById('cmdk-results');
    var cmdkBtn = document.getElementById('nav-cmdk');
    var cmdkBackdrop = document.getElementById('cmdk-backdrop');
    if (cmdkRoot && cmdkInput && cmdkResults) {
      var cmdkItems = [];
      var cmdkActive = 0;
      function render(query) {
        var q = (query || '').toLowerCase().trim();
        cmdkResults.innerHTML = '';
        cmdkItems = [];
        var anyMatch = false;
        CMDK_DATA.forEach(function (g) {
          var matched = g.items.filter(function (it) {
            return !q || it.title.toLowerCase().indexOf(q) >= 0 || ((it.desc || '').toLowerCase().indexOf(q) >= 0);
          });
          if (!matched.length) return;
          anyMatch = true;
          var grp = document.createElement('div');
          grp.className = 'cmdk__group';
          var lbl = document.createElement('div');
          lbl.className = 'cmdk__group-label';
          lbl.textContent = g.group;
          grp.appendChild(lbl);
          matched.forEach(function (item) {
            var row = document.createElement('a');
            row.className = 'cmdk__item';
            row.href = REL + item.url;
            row.innerHTML =
              '<div class="cmdk__item-icon">' + g.icon + '</div>' +
              '<div class="cmdk__item-text"><strong></strong><small></small></div>' +
              '<span class="cmdk__item-hint">↵ open</span>';
            row.querySelector('strong').textContent = item.title;
            row.querySelector('small').textContent = item.desc || '';
            grp.appendChild(row);
            cmdkItems.push(row);
          });
          cmdkResults.appendChild(grp);
        });
        if (!anyMatch) {
          var empty = document.createElement('div');
          empty.className = 'cmdk__empty';
          empty.textContent = 'No results for "' + query + '"';
          cmdkResults.appendChild(empty);
        }
        setActive(0);
      }
      function setActive(i) {
        cmdkItems.forEach(function (it, k) { it.classList.toggle('is-active', k === i); });
        cmdkActive = i;
        if (cmdkItems[i]) cmdkItems[i].scrollIntoView({ block: 'nearest' });
      }
      function openC() {
        cmdkRoot.classList.add('is-open');
        cmdkRoot.setAttribute('aria-hidden', 'false');
        cmdkInput.value = '';
        render('');
        setTimeout(function () { cmdkInput.focus(); }, 60);
        document.body.style.overflow = 'hidden';
      }
      function closeC() {
        cmdkRoot.classList.remove('is-open');
        cmdkRoot.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      if (cmdkBtn) cmdkBtn.addEventListener('click', openC);
      if (cmdkBackdrop) cmdkBackdrop.addEventListener('click', closeC);
      cmdkInput.addEventListener('input', function () { render(cmdkInput.value); });
      document.addEventListener('keydown', function (e) {
        var isOpen = cmdkRoot.classList.contains('is-open');
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          isOpen ? closeC() : openC();
          return;
        }
        if (!isOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); closeC(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(cmdkActive + 1, cmdkItems.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(cmdkActive - 1, 0)); }
        else if (e.key === 'Enter' && cmdkItems[cmdkActive]) { window.location.href = cmdkItems[cmdkActive].href; }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
