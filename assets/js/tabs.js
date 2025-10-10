// ABOUTME: Handles page tab navigation (Read, Edit, View history, etc.)
// ABOUTME: Manages active tab states and mock page view switching

(function() {
  'use strict';

  // Handle page tabs (Read, Edit, View history, etc.)
  function initPageTabs() {
    const pageToolsMenu = document.querySelector('#p-views, #p-cactions');
    if (!pageToolsMenu) return;

    const tabs = pageToolsMenu.querySelectorAll('.mw-list-item a, .vector-menu-content-item a');

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        // Allow normal navigation for now, but we could prevent and show mock views
        // For a fully static site, we'd prevent default and show/hide content
        // e.preventDefault();

        // Add active state to clicked tab
        tabs.forEach(t => t.parentElement.classList.remove('selected'));
        tab.parentElement.classList.add('selected');
      });
    });
  }

  // Handle Vector 2022 tabs
  function initVector2022Tabs() {
    const tabs = document.querySelectorAll('.vector-page-titlebar .vector-menu-tabs .mw-list-item');

    tabs.forEach(tab => {
      const link = tab.querySelector('a');
      if (!link) return;

      link.addEventListener('click', (e) => {
        // For static mockup, prevent navigation
        e.preventDefault();

        // Update active tab
        tabs.forEach(t => {
          t.classList.remove('selected');
          t.querySelector('a')?.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('selected');
        link.setAttribute('aria-selected', 'true');

        // Show a visual indication
        console.log(`Switched to: ${link.textContent.trim()}`);
      });
    });
  }

  // Handle language selector tabs
  function initLanguageTabs() {
    const langButton = document.querySelector('.vector-language-button');
    if (!langButton) return;

    langButton.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = langButton.closest('.vector-dropdown');
      const checkbox = dropdown?.querySelector('.vector-dropdown-checkbox');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    });
  }

  // Handle TOC (Table of Contents) interactions
  function initTableOfContents() {
    const toc = document.querySelector('.vector-toc');
    if (!toc) return;

    // TOC toggle button
    const tocToggle = toc.querySelector('.vector-toc-toggle');
    if (tocToggle) {
      tocToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const checkbox = document.querySelector('#vector-toc-collapsed-checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });
    }

    // TOC links smooth scroll
    const tocLinks = toc.querySelectorAll('.vector-toc-link');
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Update active TOC item
            tocLinks.forEach(l => l.parentElement.classList.remove('vector-toc-list-item-active'));
            link.parentElement.classList.add('vector-toc-list-item-active');
          }
        }
      });
    });
  }

  // Handle section edit links
  function initSectionEditLinks() {
    const editLinks = document.querySelectorAll('.mw-editsection a');

    editLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.closest('.mw-heading')?.nextElementSibling;
        console.log('Edit section:', section);
        alert('Section editing would open here in a real implementation');
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPageTabs();
      initVector2022Tabs();
      initLanguageTabs();
      initTableOfContents();
      initSectionEditLinks();
    });
  } else {
    initPageTabs();
    initVector2022Tabs();
    initLanguageTabs();
    initTableOfContents();
    initSectionEditLinks();
  }
})();
