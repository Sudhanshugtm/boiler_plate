// ABOUTME: Intent selector modal overlay for Wikipedia Dynamic View prototype
// ABOUTME: Shows a modal asking users their intent, then triggers appropriate view transformation

(function () {
  'use strict';

  // Configuration for intent modes (ordered: Full Article first, then Quick Facts, Teach Me, Research)
  const INTENT_MODES = {
    'full-article': {
      id: 'full-article',
      title: 'Full Article',
      description: 'Standard Wikipedia view',
      subtitle: 'Complete encyclopedia entry'
    },
    'quick-facts': {
      id: 'quick-facts',
      title: 'Quick Facts',
      description: 'Key information at a glance',
      subtitle: 'Numbers, dates, and essentials'
    },
    'teach-me': {
      id: 'teach-me',
      title: 'Teach Me',
      description: 'Interactive learning experience',
      subtitle: 'Step-by-step explanations'
    },
    'glossary': {
      id: 'glossary',
      title: 'Glossary',
      description: 'Look up terms and definitions',
      subtitle: 'Quick reference A-Z'
    }
  };

  // Default intent when none is specified
  const DEFAULT_INTENT = 'full-article';

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
        <span class="intent-card-title">${mode.title}</span>
        <span class="intent-card-description">${mode.description}</span>
        <span class="intent-card-subtitle">${mode.subtitle}</span>
      `;

      card.addEventListener('click', () => {
        selectIntent(mode.id);
        closeModal(overlay);
        // Create the sidebar switcher after modal selection
        setTimeout(() => createModeSwitcher(mode.id), 350);
      });

      // Keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectIntent(mode.id);
          closeModal(overlay);
          setTimeout(() => createModeSwitcher(mode.id), 350);
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
        setTimeout(() => createModeSwitcher('full-article'), 350);
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

  // Create sidebar mode switcher with unique classes to avoid Wikipedia CSS conflicts
  function createModeSwitcher(currentIntent) {
    console.log('[Intent Selector] Creating mode switcher for:', currentIntent);

    // Remove existing switcher if present
    const existing = document.getElementById('learning-mode-switcher');
    if (existing) existing.remove();

    // Try to find the Appearance container
    let appearanceContainer = document.getElementById('vector-appearance-pinned-container');
    console.log('[Intent Selector] Found pinned container:', !!appearanceContainer);

    if (!appearanceContainer || !appearanceContainer.querySelector('.vector-appearance')) {
      appearanceContainer = document.getElementById('vector-appearance-unpinned-container');
      console.log('[Intent Selector] Trying unpinned container:', !!appearanceContainer);
    }

    if (!appearanceContainer) {
      console.warn('[Intent Selector] Appearance container not found - cannot create sidebar switcher');
      return null;
    }

    // Create wrapper with unique classes
    const wrapper = document.createElement('div');
    wrapper.className = 'learning-mode-panel';
    wrapper.id = 'learning-mode-switcher';

    // Title
    const title = document.createElement('div');
    title.className = 'learning-mode-title';
    title.textContent = 'Learning mode';
    wrapper.appendChild(title);

    // Options container with left border
    const options = document.createElement('div');
    options.className = 'learning-mode-options';

    // Radio buttons with simple structure
    Object.values(INTENT_MODES).forEach(mode => {
      const label = document.createElement('label');
      label.className = 'learning-mode-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'learning-mode';
      input.value = mode.id;
      input.checked = mode.id === currentIntent;

      input.addEventListener('change', () => selectIntent(mode.id));

      const text = document.createElement('span');
      text.textContent = mode.title;

      label.appendChild(input);
      label.appendChild(text);
      options.appendChild(label);
    });

    wrapper.appendChild(options);

    // Insert into appearance container
    const appearanceContent = appearanceContainer.querySelector('.vector-pinnable-element');
    console.log('[Intent Selector] Found pinnable element:', !!appearanceContent);

    if (appearanceContent) {
      const headerEl = appearanceContent.querySelector('.vector-pinnable-header');
      if (headerEl && headerEl.nextSibling) {
        appearanceContent.insertBefore(wrapper, headerEl.nextSibling);
        console.log('[Intent Selector] Inserted switcher after header');
      } else {
        appearanceContent.appendChild(wrapper);
        console.log('[Intent Selector] Appended switcher to pinnable element');
      }
    } else {
      appearanceContainer.appendChild(wrapper);
      console.log('[Intent Selector] Appended switcher to container');
    }

    console.log('[Intent Selector] Mode switcher created successfully');
    return wrapper;
  }

  // Update switcher display
  function updateSwitcher(switcher, intentId) {
    if (!switcher) return;

    const input = switcher.querySelector(`input[value="${intentId}"]`);
    if (input) {
      input.checked = true;
    }
  }

  // Initialize the intent selector system
  function init() {
    const params = getUrlParams();

    // Use intent from URL if valid, otherwise default to full-article
    const activeIntent = (params.intent && INTENT_MODES[params.intent])
      ? params.intent
      : DEFAULT_INTENT;

    // Create the switcher and select the intent
    setTimeout(() => {
      createModeSwitcher(activeIntent);
      selectIntent(activeIntent);
    }, 300);

    console.log('[Intent Selector] Initialized with intent:', activeIntent);
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
