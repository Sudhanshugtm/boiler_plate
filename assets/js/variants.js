// ABOUTME: Design variant system - allows testing different UX approaches via URL parameters
// ABOUTME: Use ?variant=1, ?variant=2, etc. to load different design variations

(function() {
  'use strict';

  // Parse URL parameters
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      variant: params.get('variant'),
      debug: params.get('debug') === 'true',
      mock: params.get('mock')
    };
  }

  // Show variant indicator in corner
  function showVariantIndicator(variantId) {
    const indicator = document.createElement('div');
    indicator.id = 'variant-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #3366cc;
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      cursor: pointer;
    `;
    indicator.textContent = `Variant ${variantId}`;

    indicator.addEventListener('click', () => {
      showVariantMenu();
    });

    document.body.appendChild(indicator);
  }

  // Show variant selection menu
  function showVariantMenu() {
    const existingMenu = document.getElementById('variant-menu');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const menu = document.createElement('div');
    menu.id = 'variant-menu';
    menu.style.cssText = `
      position: fixed;
      bottom: 70px;
      right: 20px;
      background: white;
      border: 1px solid #a2a9b1;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      min-width: 200px;
    `;

    const title = document.createElement('div');
    title.style.cssText = 'font-weight: 600; margin-bottom: 10px; color: #202122;';
    title.textContent = 'Switch Variant';

    menu.appendChild(title);

    // Add variant options
    const variants = ['Default', '1', '2', '3', '4', '5', '6'];
    variants.forEach(v => {
      const button = document.createElement('button');
      button.style.cssText = `
        display: block;
        width: 100%;
        padding: 8px 12px;
        margin: 5px 0;
        border: 1px solid #c8ccd1;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
      `;
      button.textContent = v === 'Default' ? 'Default (no variant)' : `Variant ${v}`;

      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#eaf3ff';
      });
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'white';
      });

      button.addEventListener('click', () => {
        const url = new URL(window.location);
        if (v === 'Default') {
          url.searchParams.delete('variant');
        } else {
          url.searchParams.set('variant', v);
        }
        window.location = url.toString();
      });

      menu.appendChild(button);
    });

    // Add debug toggle
    const debugToggle = document.createElement('label');
    debugToggle.style.cssText = `
      display: block;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #eaecf0;
      cursor: pointer;
    `;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = getUrlParams().debug;
    checkbox.addEventListener('change', () => {
      const url = new URL(window.location);
      if (checkbox.checked) {
        url.searchParams.set('debug', 'true');
      } else {
        url.searchParams.delete('debug');
      }
      window.location = url.toString();
    });

    debugToggle.appendChild(checkbox);
    debugToggle.appendChild(document.createTextNode(' Debug Mode'));
    menu.appendChild(debugToggle);

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target.id !== 'variant-indicator') {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 0);
  }

  // Apply variant-specific changes
  function applyVariant(variantId) {
    console.log(`Applying variant: ${variantId}`);

    // Add variant class to body for CSS targeting
    document.body.classList.add(`variant-${variantId}`);

    // Variant-specific logic can be added here
    // Example variants for the contributions menu issue:
    switch(variantId) {
      case '1':
        // Variant 1: Always show "Contribute" tab first
        forceContributeTabFirst();
        break;

      case '2':
        // Variant 2: Combine both tabs into one view
        combineContributionTabs();
        break;

      case '3':
        // Variant 3: Add explanatory text
        addExplanatoryText();
        break;

      case '4':
        // Variant 4: Bigger cards with visual emphasis
        makeBiggerContributionCards();
        break;

      case '5':
        // Variant 5: Hindi-first design
        emphasizeHindiContent();
        break;

      case '6':
        // Variant 6: Add visual icons to cards
        addVisualIcons();
        break;

      // Add more variants as needed
    }
  }

  // Variant 1: Force Contribute tab to be active
  function forceContributeTabFirst() {
    const tabs = document.querySelectorAll('#p-associated-pages .vector-menu-content-list li');
    if (tabs.length >= 2) {
      tabs[0].classList.add('selected');
      tabs[1].classList.remove('selected');

      // Show contribute content
      const contributeContent = document.querySelector('#mw-contribute-cards');
      if (contributeContent) {
        contributeContent.style.display = 'block';
      }
    }
  }

  // Variant 2: Combine tabs into single view
  function combineContributionTabs() {
    const tabs = document.querySelectorAll('#p-associated-pages');
    tabs.forEach(tab => {
      tab.style.display = 'none';
    });

    // Add explanatory banner
    const content = document.querySelector('#mw-content-text');
    if (content) {
      const banner = document.createElement('div');
      banner.style.cssText = `
        background: #eaf3ff;
        border: 1px solid #a2a9b1;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
      `;
      banner.innerHTML = `
        <strong>Combined View</strong><br>
        This shows both new contribution opportunities and your past contributions in one place.
      `;
      content.prepend(banner);
    }
  }

  // Variant 3: Add explanatory text
  function addExplanatoryText() {
    const tabs = document.querySelector('#p-associated-pages');
    if (tabs) {
      const help = document.createElement('div');
      help.style.cssText = `
        background: #ffe49c;
        border: 1px solid #fc3;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        font-size: 14px;
      `;
      help.innerHTML = `
        <strong>💡 Tip:</strong> Use these tabs to switch between finding new ways to contribute
        and reviewing your past contributions.
      `;
      tabs.parentNode.insertBefore(help, tabs.nextSibling);
    }
  }

  // Variant 4: Make contribution cards bigger and more visual
  function makeBiggerContributionCards() {
    const cards = document.querySelectorAll('.mw-contribute-card');
    cards.forEach(card => {
      card.style.cssText = `
        min-height: 200px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-radius: 12px;
        transition: transform 0.2s;
        border: 2px solid #eaecf0;
      `;

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
        card.style.borderColor = '#3366cc';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        card.style.borderColor = '#eaecf0';
      });
    });

    const titles = document.querySelectorAll('.mw-contribute-card-title');
    titles.forEach(title => {
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '15px';
    });

    const descriptions = document.querySelectorAll('.mw-contribute-card-description');
    descriptions.forEach(desc => {
      desc.style.fontSize = '16px';
      desc.style.lineHeight = '1.6';
      desc.style.marginBottom = '20px';
    });

    const actions = document.querySelectorAll('.mw-contribute-card-action');
    actions.forEach(action => {
      action.style.fontSize = '16px';
      action.style.fontWeight = '600';
      action.style.color = '#3366cc';
    });
  }

  // Variant 5: Emphasize Hindi content over English
  function emphasizeHindiContent() {
    // Change "Translations" to Hindi
    const cards = document.querySelectorAll('.mw-contribute-card-title');
    cards.forEach(card => {
      if (card.textContent.trim() === 'Translations') {
        card.textContent = '🌐 अनुवाद';
      }
    });

    // Add Hindi emphasis banner
    const content = document.querySelector('#mw-content-text');
    if (content) {
      const banner = document.createElement('div');
      banner.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      `;
      banner.innerHTML = `
        🇮🇳 हिन्दी विकिपीडिया में योगदान करें
      `;
      content.prepend(banner);
    }

    // Style Hindi text elements
    const hindiElements = document.querySelectorAll('[lang="hi"]');
    hindiElements.forEach(elem => {
      elem.style.fontWeight = '600';
    });
  }

  // Variant 6: Add visual icons to contribution cards
  function addVisualIcons() {
    const cards = document.querySelectorAll('.mw-contribute-card');
    cards.forEach((card, index) => {
      const content = card.querySelector('.mw-contribute-card-content');
      if (content) {
        const icon = document.createElement('div');
        icon.style.cssText = `
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        `;
        icon.textContent = index === 0 ? '🌐' : '📝';
        content.prepend(icon);
      }
    });

    // Make cards more visual
    const wrapper = document.querySelector('.mw-contribute-content-area');
    if (wrapper) {
      wrapper.style.cssText = `
        display: grid;
        gap: 30px;
        padding: 20px;
      `;
    }

    cards.forEach(card => {
      card.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
      `;

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      });
    });
  }

  // Enable debug mode
  function enableDebugMode() {
    console.log('%cDEBUG MODE ENABLED', 'font-size: 16px; font-weight: bold; color: #cc0000;');

    // Show element outlines
    const style = document.createElement('style');
    style.textContent = `
      * { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }
      *:hover { outline: 2px solid rgba(255, 0, 0, 0.8) !important; }
    `;
    document.head.appendChild(style);

    // Log interactions
    document.addEventListener('click', (e) => {
      console.log('Clicked:', e.target);
    }, true);
  }

  // Initialize variant system
  function init() {
    const params = getUrlParams();

    if (params.variant) {
      showVariantIndicator(params.variant);
      applyVariant(params.variant);
    }

    if (params.debug) {
      enableDebugMode();
    }

    // Always show a small indicator for quick access
    if (!params.variant) {
      const quickAccess = document.createElement('button');
      quickAccess.textContent = '⚙️';
      quickAccess.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 1px solid #a2a9b1;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 10000;
      `;
      quickAccess.addEventListener('click', showVariantMenu);
      document.body.appendChild(quickAccess);
    }

    console.log('✓ Variant system initialized');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
