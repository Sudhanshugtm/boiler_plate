// ABOUTME: Main JavaScript file for additional Wikipedia UI functionality
// ABOUTME: Handles sticky header, scroll behavior, dark mode toggle, and other utilities

(function() {
  'use strict';

  // Handle sticky header on scroll
  function initStickyHeader() {
    const stickyHeader = document.querySelector('.vector-sticky-header');
    if (!stickyHeader) return;

    let lastScrollTop = 0;
    const headerHeight = 50;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > headerHeight) {
        stickyHeader.classList.add('vector-sticky-header-visible');
      } else {
        stickyHeader.classList.remove('vector-sticky-header-visible');
      }

      lastScrollTop = scrollTop;
    });
  }

  // Handle appearance/dark mode toggle
  function initAppearanceToggle() {
    const appearanceButton = document.querySelector('[data-event-name="appearance"]');
    if (!appearanceButton) return;

    appearanceButton.addEventListener('click', (e) => {
      e.preventDefault();

      const body = document.body;
      const html = document.documentElement;

      // Toggle between day and night theme
      if (html.classList.contains('skin-theme-clientpref-day')) {
        html.classList.remove('skin-theme-clientpref-day');
        html.classList.add('skin-theme-clientpref-night');
        localStorage.setItem('vector-theme', 'night');
      } else {
        html.classList.remove('skin-theme-clientpref-night');
        html.classList.add('skin-theme-clientpref-day');
        localStorage.setItem('vector-theme', 'day');
      }
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('vector-theme');
    if (savedTheme) {
      const html = document.documentElement;
      html.classList.remove('skin-theme-clientpref-day', 'skin-theme-clientpref-night');
      html.classList.add(`skin-theme-clientpref-${savedTheme}`);
    }
  }

  // Handle references and citations
  function initReferences() {
    const refLinks = document.querySelectorAll('.reference a');

    refLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the reference briefly
            target.style.backgroundColor = '#ffffcc';
            setTimeout(() => {
              target.style.backgroundColor = '';
            }, 2000);
          }
        }
      });
    });
  }

  // Handle image gallery/lightbox
  function initImageGallery() {
    const images = document.querySelectorAll('.mw-file-description img, .thumbimage');

    images.forEach(img => {
      img.style.cursor = 'pointer';

      img.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real implementation, this would open a lightbox/gallery
        console.log('Open image:', img.src);
        alert('Image lightbox would open here. Src: ' + img.src);
      });
    });
  }

  // Handle collapsible content
  function initCollapsibles() {
    const collapsibleHeaders = document.querySelectorAll('.mw-collapsible-toggle');

    collapsibleHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        const collapsible = header.closest('.mw-collapsible');
        if (collapsible) {
          const content = collapsible.querySelector('.mw-collapsible-content');
          if (content) {
            const isCollapsed = collapsible.classList.contains('mw-collapsed');

            if (isCollapsed) {
              collapsible.classList.remove('mw-collapsed');
              content.style.display = '';
            } else {
              collapsible.classList.add('mw-collapsed');
              content.style.display = 'none';
            }
          }
        }
      });
    });
  }

  // Handle external link icons
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');

    externalLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('wikipedia.org') && !href.includes('wikimedia.org')) {
        link.classList.add('external');
      }
    });
  }

  // Handle font size controls
  function initFontSizeControls() {
    const decreaseFontButton = document.querySelector('[data-event-name="font-size-decrease"]');
    const increaseFontButton = document.querySelector('[data-event-name="font-size-increase"]');
    const resetFontButton = document.querySelector('[data-event-name="font-size-reset"]');

    if (decreaseFontButton) {
      decreaseFontButton.addEventListener('click', (e) => {
        e.preventDefault();
        adjustFontSize(-10);
      });
    }

    if (increaseFontButton) {
      increaseFontButton.addEventListener('click', (e) => {
        e.preventDefault();
        adjustFontSize(10);
      });
    }

    if (resetFontButton) {
      resetFontButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.documentElement.style.fontSize = '';
        localStorage.removeItem('vector-font-size');
      });
    }

    // Load saved font size
    const savedFontSize = localStorage.getItem('vector-font-size');
    if (savedFontSize) {
      document.documentElement.style.fontSize = savedFontSize + '%';
    }
  }

  function adjustFontSize(delta) {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const newSize = Math.max(80, Math.min(120, currentSize + delta));
    const percentage = (newSize / 16) * 100;

    document.documentElement.style.fontSize = percentage + '%';
    localStorage.setItem('vector-font-size', percentage);
  }

  // Add smooth scrolling to all anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#bodyContent') {
          e.preventDefault();
          const target = document.querySelector(href === '#' ? 'body' : href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // Console message for developers
  function showConsoleMessage() {
    console.log('%cWikipedia Static Mockup', 'font-size: 24px; font-weight: bold; color: #0645ad;');
    console.log('%cThis is a high-fidelity static mockup of Wikipedia for UX design purposes.', 'font-size: 14px; color: #555;');
    console.log('%cAll interactions are simulated. No backend is connected.', 'font-size: 12px; color: #777;');
  }

  // Initialize all modules
  function init() {
    maybeBootstrapEditor();
    interceptEditBootstrap();
    initStickyHeader();
    initAppearanceToggle();
    initReferences();
    initImageGallery();
    initCollapsibles();
    initExternalLinks();
    initFontSizeControls();
    initSmoothScroll();
    showConsoleMessage();

    // Log successful initialization
    console.log('✓ Wikipedia mockup initialized successfully');
  }

  // Load VisualEditor prototype script on demand to support older pages
  function maybeBootstrapEditor() {
    try {
      const qs = new URLSearchParams(location.search);
      const should = qs.get('editor') && qs.get('editor') !== '0' && qs.get('editor') !== 'false';
      const already = Array.from(document.scripts).some(s=> (s.src||'').includes('/assets/js/editor.js'));
      if (!should || already) return;
      const s = document.createElement('script');
      s.defer = true;
      s.src = location.pathname.includes('/pages/') ? '../assets/js/editor.js' : 'assets/js/editor.js';
      document.body.appendChild(s);
    } catch(_) {}
  }

  // If user clicks an Edit link on older pages (without editor.js), load it and open directly
  function interceptEditBootstrap() {
    try {
      const already = Array.from(document.scripts).some(s=> (s.src||'').includes('/assets/js/editor.js'));
      if (already) return; // editor.js will handle its own edit-link interception
      const selectors = [
        '#ca-edit a',
        '.vector-menu-tabs a[accesskey="e"]',
        'a[href*="action=edit"]',
        'a[href*="veaction=edit"]',
        '.mw-editsection a'
      ];
      document.addEventListener('click', function (e) {
        const a = e.target && (e.target.closest ? e.target.closest('a') : null);
        if (!a) return;
        if (!selectors.some(sel => a.matches(sel))) return;
        const alreadyNow = Array.from(document.scripts).some(s=> (s.src||'').includes('/assets/js/editor.js'));
        if (alreadyNow) return; // editor.js will take over
        e.preventDefault();
        window.__VE_OPEN_ON_LOAD__ = true;
        const s = document.createElement('script');
        s.defer = true;
        s.src = location.pathname.includes('/pages/') ? '../assets/js/editor.js' : 'assets/js/editor.js';
        document.body.appendChild(s);
      }, true);
    } catch(_) {}
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
