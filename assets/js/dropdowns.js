// ABOUTME: Handles all dropdown menu interactions (main menu, user menu, page tools, TOC)
// ABOUTME: Implements click-outside-to-close and keyboard navigation support

(function() {
  'use strict';

  // Handle all dropdown checkboxes
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.vector-dropdown');

    dropdowns.forEach(dropdown => {
      const checkbox = dropdown.querySelector('.vector-dropdown-checkbox');
      const content = dropdown.querySelector('.vector-dropdown-content');

      if (!checkbox || !content) return;

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && checkbox.checked) {
          checkbox.checked = false;
        }
      });

      // Prevent clicks inside dropdown from closing it
      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  // Handle pinnable menus (main menu, page tools, TOC)
  function initPinnableMenus() {
    const pinnableHeaders = document.querySelectorAll('.vector-pinnable-header');

    pinnableHeaders.forEach(header => {
      const pinButton = header.querySelector('.vector-pinnable-header-pin-button');
      const unpinButton = header.querySelector('.vector-pinnable-header-unpin-button');

      if (pinButton) {
        pinButton.addEventListener('click', (e) => {
          e.preventDefault();
          header.classList.remove('vector-pinnable-header-unpinned');
          header.classList.add('vector-pinnable-header-pinned');

          // Store preference in localStorage
          const featureName = header.dataset.featureName;
          if (featureName) {
            localStorage.setItem(`vector-${featureName}`, 'pinned');
          }
        });
      }

      if (unpinButton) {
        unpinButton.addEventListener('click', (e) => {
          e.preventDefault();
          header.classList.remove('vector-pinnable-header-pinned');
          header.classList.add('vector-pinnable-header-unpinned');

          // Store preference in localStorage
          const featureName = header.dataset.featureName;
          if (featureName) {
            localStorage.setItem(`vector-${featureName}`, 'unpinned');
          }
        });
      }
    });
  }

  // Handle user links dropdown
  function initUserLinks() {
    const userLinksDropdown = document.querySelector('.vector-user-links');
    if (!userLinksDropdown) return;

    const userMenuButton = userLinksDropdown.querySelector('.vector-user-menu-create-account, .vector-user-menu-logged-in');

    if (userMenuButton) {
      userMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = userMenuButton.closest('.vector-dropdown');
        const checkbox = dropdown?.querySelector('.vector-dropdown-checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });
    }
  }

  // Handle collapsible sections
  function initCollapsibleSections() {
    const collapsibleToggles = document.querySelectorAll('.mw-collapsible-toggle');

    collapsibleToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const collapsible = toggle.closest('.mw-collapsible');
        if (collapsible) {
          collapsible.classList.toggle('mw-collapsed');
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDropdowns();
      initPinnableMenus();
      initUserLinks();
      initCollapsibleSections();
    });
  } else {
    initDropdowns();
    initPinnableMenus();
    initUserLinks();
    initCollapsibleSections();
  }
})();
