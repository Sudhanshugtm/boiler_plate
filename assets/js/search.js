// ABOUTME: Handles search functionality with mock autocomplete suggestions
// ABOUTME: Provides Wikipedia-like search experience without backend

(function() {
  'use strict';

  // Mock search suggestions
  const mockSuggestions = [
    'Albert Einstein',
    'Quantum mechanics',
    'Theory of relativity',
    'General relativity',
    'Special relativity',
    'Photoelectric effect',
    'E=mc²',
    'Nobel Prize in Physics',
    'Max Planck',
    'Niels Bohr',
    'Werner Heisenberg',
    'Schrödinger equation',
    'Manhattan Project',
    'Institute for Advanced Study',
    'Princeton University',
    'Patent office',
    'Brownian motion',
    'Unified field theory',
    'Spacetime',
    'Gravitational waves'
  ];

  function createSuggestionsDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #a2a9b1;
      border-top: none;
      max-height: 400px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: none;
    `;
    return dropdown;
  }

  function createSuggestionItem(text, query) {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item';
    item.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #eaecf0;
    `;

    // Highlight matching text
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex !== -1) {
      const before = text.substring(0, startIndex);
      const match = text.substring(startIndex, startIndex + query.length);
      const after = text.substring(startIndex + query.length);
      item.innerHTML = `${before}<strong>${match}</strong>${after}`;
    } else {
      item.textContent = text;
    }

    // Hover effect
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = '#eaf3ff';
    });
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = 'white';
    });

    return item;
  }

  function filterSuggestions(query) {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    return mockSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }

  function initSearch() {
    const searchInputs = document.querySelectorAll('.vector-search-box-input, .cdx-text-input__input');

    searchInputs.forEach(input => {
      const searchForm = input.closest('form');
      if (!searchForm) return;

      const searchContainer = input.closest('.vector-search-box, .cdx-search-input');
      if (!searchContainer) return;

      // Make search container relative for positioning
      searchContainer.style.position = 'relative';

      // Create suggestions dropdown
      const suggestionsDropdown = createSuggestionsDropdown();
      searchContainer.appendChild(suggestionsDropdown);

      let selectedIndex = -1;

      // Handle input
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const suggestions = filterSuggestions(query);

        if (suggestions.length === 0) {
          suggestionsDropdown.style.display = 'none';
          return;
        }

        // Clear previous suggestions
        suggestionsDropdown.innerHTML = '';
        selectedIndex = -1;

        // Add new suggestions
        suggestions.forEach((suggestion, index) => {
          const item = createSuggestionItem(suggestion, query);

          item.addEventListener('click', () => {
            input.value = suggestion;
            suggestionsDropdown.style.display = 'none';
            // In a real implementation, this would navigate to the page
            console.log('Navigate to:', suggestion);
          });

          suggestionsDropdown.appendChild(item);
        });

        suggestionsDropdown.style.display = 'block';
      });

      // Handle keyboard navigation
      input.addEventListener('keydown', (e) => {
        const items = suggestionsDropdown.querySelectorAll('.search-suggestion-item');

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
          updateSelectedItem(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          updateSelectedItem(items, selectedIndex);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          items[selectedIndex].click();
        } else if (e.key === 'Escape') {
          suggestionsDropdown.style.display = 'none';
          selectedIndex = -1;
        }
      });

      // Close suggestions when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
          suggestionsDropdown.style.display = 'none';
          selectedIndex = -1;
        }
      });

      // Handle form submission
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          console.log('Search for:', query);
          alert(`In a real implementation, this would search for: "${query}"`);
        }
      });
    });
  }

  function updateSelectedItem(items, index) {
    items.forEach((item, i) => {
      if (i === index) {
        item.style.backgroundColor = '#eaf3ff';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.style.backgroundColor = 'white';
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
