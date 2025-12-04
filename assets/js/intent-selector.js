// ABOUTME: Intent selector modal overlay for Wikipedia Dynamic View prototype
// ABOUTME: Shows a modal asking users their intent, then triggers appropriate view transformation

(function() {
  'use strict';

  // Configuration for intent modes
  const INTENT_MODES = {
    'quick-facts': {
      id: 'quick-facts',
      icon: '🎯',
      title: 'Quick Facts',
      description: 'Key information at a glance',
      subtitle: 'Numbers, dates, and essentials'
    },
    'teach-me': {
      id: 'teach-me',
      icon: '📚',
      title: 'Teach Me',
      description: 'Interactive learning experience',
      subtitle: 'Step-by-step explanations'
    },
    'research': {
      id: 'research',
      icon: '🔬',
      title: 'Research',
      description: 'Deep dive with citations',
      subtitle: 'Full academic detail'
    },
    'full-article': {
      id: 'full-article',
      icon: '📖',
      title: 'Full Article',
      description: 'Standard Wikipedia view',
      subtitle: 'Complete encyclopedia entry'
    }
  };

  // Get URL parameters
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      intent: params.get('intent'),
      skipModal: params.get('skipModal') === 'true'
    };
  }

  // Set URL parameter without reload
  function setIntentParam(intent) {
    const url = new URL(window.location);
    url.searchParams.set('intent', intent);
    window.history.replaceState({}, '', url.toString());
  }

  // Get article title from page
  function getArticleTitle() {
    const heading = document.querySelector('#firstHeading');
    return heading ? heading.textContent : 'this article';
  }

  // Get article image (from infobox or og:image)
  function getArticleImage() {
    const infoboxImg = document.querySelector('.infobox img, .thumb img');
    if (infoboxImg) return infoboxImg.src;

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) return ogImage.content;

    return null;
  }

  // Create the intent selector modal
  function createIntentModal() {
    const articleTitle = getArticleTitle();
    const articleImage = getArticleImage();

    const overlay = document.createElement('div');
    overlay.id = 'intent-selector-overlay';
    overlay.className = 'intent-overlay';

    const modal = document.createElement('div');
    modal.className = 'intent-modal';

    // Header with article context
    const header = document.createElement('div');
    header.className = 'intent-modal-header';
    header.innerHTML = `
      ${articleImage ? `<img src="${articleImage}" alt="" class="intent-article-image">` : ''}
      <div class="intent-header-text">
        <h2>Welcome to "<span class="intent-article-title">${articleTitle}</span>"</h2>
        <p class="intent-subtitle">How would you like to explore this topic?</p>
      </div>
    `;

    // Intent cards grid
    const grid = document.createElement('div');
    grid.className = 'intent-cards-grid';

    Object.values(INTENT_MODES).forEach(mode => {
      const card = document.createElement('button');
      card.className = 'intent-card';
      card.dataset.intent = mode.id;
      card.innerHTML = `
        <span class="intent-card-icon">${mode.icon}</span>
        <span class="intent-card-title">${mode.title}</span>
        <span class="intent-card-description">${mode.description}</span>
        <span class="intent-card-subtitle">${mode.subtitle}</span>
      `;

      card.addEventListener('click', () => {
        selectIntent(mode.id);
        closeModal(overlay);
      });

      // Keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectIntent(mode.id);
          closeModal(overlay);
        }
      });

      grid.appendChild(card);
    });

    // Footer
    const footer = document.createElement('div');
    footer.className = 'intent-modal-footer';
    footer.innerHTML = `
      <p class="intent-footer-note">You can change your view anytime using the mode switcher</p>
    `;

    modal.appendChild(header);
    modal.appendChild(grid);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    return overlay;
  }

  // Show the modal
  function showModal() {
    const modal = createIntentModal();
    document.body.appendChild(modal);
    document.body.classList.add('intent-modal-open');

    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('intent-overlay-visible');
    });

    // Focus first card for accessibility
    const firstCard = modal.querySelector('.intent-card');
    if (firstCard) firstCard.focus();

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Default to full-article if user dismisses
        selectIntent('full-article');
        closeModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Close the modal
  function closeModal(overlay) {
    overlay.classList.remove('intent-overlay-visible');
    overlay.classList.add('intent-overlay-closing');

    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('intent-modal-open');
    }, 300);
  }

  // Select an intent and trigger transformation
  function selectIntent(intentId) {
    setIntentParam(intentId);

    // Dispatch custom event for dynamic-view.js to handle
    const event = new CustomEvent('intentSelected', {
      detail: { intent: intentId, mode: INTENT_MODES[intentId] }
    });
    document.dispatchEvent(event);

    console.log(`[Intent Selector] Selected: ${intentId}`);
  }

  // Create floating mode switcher button
  function createModeSwitcher(currentIntent) {
    const switcher = document.createElement('div');
    switcher.id = 'intent-mode-switcher';
    switcher.className = 'intent-mode-switcher';

    const currentMode = INTENT_MODES[currentIntent] || INTENT_MODES['full-article'];

    const button = document.createElement('button');
    button.className = 'intent-switcher-button';
    button.innerHTML = `
      <span class="intent-switcher-icon">${currentMode.icon}</span>
      <span class="intent-switcher-label">${currentMode.title}</span>
      <span class="intent-switcher-chevron">▼</span>
    `;

    const dropdown = document.createElement('div');
    dropdown.className = 'intent-switcher-dropdown';

    Object.values(INTENT_MODES).forEach(mode => {
      const option = document.createElement('button');
      option.className = 'intent-switcher-option' + (mode.id === currentIntent ? ' active' : '');
      option.dataset.intent = mode.id;
      option.innerHTML = `
        <span class="intent-option-icon">${mode.icon}</span>
        <span class="intent-option-text">
          <span class="intent-option-title">${mode.title}</span>
          <span class="intent-option-desc">${mode.description}</span>
        </span>
      `;

      option.addEventListener('click', (e) => {
        e.stopPropagation();
        selectIntent(mode.id);
        updateSwitcher(switcher, mode.id);
        dropdown.classList.remove('visible');
      });

      dropdown.appendChild(option);
    });

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('visible');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('visible');
    });

    switcher.appendChild(button);
    switcher.appendChild(dropdown);

    return switcher;
  }

  // Update switcher display
  function updateSwitcher(switcher, intentId) {
    const mode = INTENT_MODES[intentId];
    const button = switcher.querySelector('.intent-switcher-button');
    button.querySelector('.intent-switcher-icon').textContent = mode.icon;
    button.querySelector('.intent-switcher-label').textContent = mode.title;

    // Update active state
    switcher.querySelectorAll('.intent-switcher-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.intent === intentId);
    });
  }

  // Initialize the intent selector system
  function init() {
    const params = getUrlParams();

    // If intent already set in URL, just show the switcher
    if (params.intent && INTENT_MODES[params.intent]) {
      const switcher = createModeSwitcher(params.intent);
      document.body.appendChild(switcher);

      // Trigger the view transformation
      selectIntent(params.intent);
    }
    // Otherwise show the modal
    else if (!params.skipModal) {
      // Small delay to let page render first
      setTimeout(() => {
        showModal();
      }, 500);
    }

    console.log('[Intent Selector] Initialized');
  }

  // Expose for external use
  window.IntentSelector = {
    showModal,
    selectIntent,
    INTENT_MODES
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
