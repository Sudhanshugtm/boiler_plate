// ABOUTME: Dynamic View transformation engine for Wikipedia intent-based article adaptation
// ABOUTME: Transforms article content based on user intent: quick-facts, teach-me, research, full-article

(function() {
  'use strict';

  // Store original content for mode switching
  let originalContent = null;
  let parsedContent = null;
  let currentIntent = null;

  // Content extraction utilities
  const ContentExtractor = {
    // Get the main content container
    getContentContainer() {
      return document.querySelector('.mw-parser-output');
    },

    // Get article title
    getTitle() {
      const heading = document.querySelector('#firstHeading');
      return heading ? heading.textContent.trim() : 'Article';
    },

    // Get short description
    getShortDescription() {
      const desc = document.querySelector('.shortdescription');
      return desc ? desc.textContent.trim() : '';
    },

    // Get main article image
    getMainImage() {
      // Try infobox first
      const infoboxImg = document.querySelector('.infobox-image img, .infobox img');
      if (infoboxImg) return { src: infoboxImg.src, alt: infoboxImg.alt || '' };

      // Try first thumb image
      const thumbImg = document.querySelector('.thumb img');
      if (thumbImg) return { src: thumbImg.src, alt: thumbImg.alt || '' };

      // Try og:image
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) return { src: ogImage.content, alt: '' };

      return null;
    },

    // Get introduction paragraphs (before first heading)
    getIntroduction() {
      const container = this.getContentContainer();
      if (!container) return [];

      const paragraphs = [];
      let node = container.firstElementChild;

      while (node) {
        if (node.classList && node.classList.contains('mw-heading')) break;
        if (node.tagName === 'P' && node.textContent.trim()) {
          paragraphs.push(node.innerHTML);
        }
        node = node.nextElementSibling;
      }

      return paragraphs;
    },

    // Get all sections with their content
    getSections() {
      const container = this.getContentContainer();
      if (!container) return [];

      const sections = [];
      const headings = container.querySelectorAll('.mw-heading');

      headings.forEach(heading => {
        const h = heading.querySelector('h2, h3, h4');
        if (!h) return;

        const section = {
          id: h.id,
          level: parseInt(h.tagName.charAt(1)),
          title: h.textContent.replace(/\[edit\]/g, '').trim(),
          content: [],
          images: []
        };

        // Collect content until next heading
        let sibling = heading.nextElementSibling;
        while (sibling && !sibling.classList.contains('mw-heading')) {
          if (sibling.tagName === 'P') {
            section.content.push(sibling.innerHTML);
          }
          if (sibling.tagName === 'UL' || sibling.tagName === 'OL') {
            section.content.push(sibling.outerHTML);
          }
          if (sibling.querySelector && sibling.querySelector('img')) {
            const img = sibling.querySelector('img');
            section.images.push({ src: img.src, alt: img.alt || '' });
          }
          sibling = sibling.nextElementSibling;
        }

        // Skip empty or reference sections
        const skipSections = ['See also', 'Notes', 'References', 'Bibliography', 'Further reading', 'External links'];
        if (!skipSections.includes(section.title)) {
          sections.push(section);
        }
      });

      return sections;
    },

    // Extract key facts from infobox or first paragraphs
    extractKeyFacts() {
      const facts = [];

      // From infobox
      const infobox = document.querySelector('.infobox');
      if (infobox) {
        const rows = infobox.querySelectorAll('tr');
        rows.forEach(row => {
          const header = row.querySelector('th');
          const data = row.querySelector('td');
          if (header && data && !data.querySelector('img')) {
            facts.push({
              label: header.textContent.trim(),
              value: data.textContent.trim().substring(0, 100)
            });
          }
        });
      }

      // Key facts for Atom article specifically
      const atomFacts = [
        { label: 'Size', value: '~100 picometers (0.1 nanometers)', icon: '📏' },
        { label: 'Components', value: 'Protons, Neutrons, Electrons', icon: '⚛️' },
        { label: 'Mass Location', value: '99.94% in the nucleus', icon: '⚖️' },
        { label: 'Discovery Era', value: 'Early 19th century (Dalton)', icon: '📅' },
        { label: 'Smallest Element', value: 'Hydrogen (1 proton)', icon: '🔬' },
        { label: 'Heaviest Natural', value: 'Uranium (92 protons)', icon: '☢️' }
      ];

      return facts.length > 0 ? facts : atomFacts;
    },

    // Extract timeline events
    extractTimeline() {
      return [
        { year: '~400 BCE', event: 'Democritus proposes atomos concept', era: 'philosophy' },
        { year: '1803', event: 'Dalton\'s atomic theory published', era: 'chemistry' },
        { year: '1897', event: 'J.J. Thomson discovers electrons', era: 'physics' },
        { year: '1911', event: 'Rutherford discovers the nucleus', era: 'physics' },
        { year: '1913', event: 'Bohr model of the atom', era: 'physics' },
        { year: '1920s', event: 'Quantum mechanical model developed', era: 'modern' },
        { year: '1932', event: 'Neutron discovered by Chadwick', era: 'modern' }
      ];
    },

    // Parse all content
    parseAll() {
      return {
        title: this.getTitle(),
        shortDescription: this.getShortDescription(),
        mainImage: this.getMainImage(),
        introduction: this.getIntroduction(),
        sections: this.getSections(),
        keyFacts: this.extractKeyFacts(),
        timeline: this.extractTimeline()
      };
    }
  };

  // View Renderers for each intent mode
  const ViewRenderers = {

    // Quick Facts Mode - Card-based, scannable
    renderQuickFacts(content) {
      const container = document.createElement('div');
      container.className = 'dynamic-view dynamic-view-quick-facts';

      container.innerHTML = `
        <div class="dv-quick-hero">
          ${content.mainImage ? `<img src="${content.mainImage.src}" alt="${content.mainImage.alt}" class="dv-hero-image">` : ''}
          <div class="dv-hero-content">
            <h1 class="dv-hero-title">${content.title}</h1>
            <p class="dv-hero-description">${content.shortDescription}</p>
            <p class="dv-hero-intro">${content.introduction[0] || ''}</p>
          </div>
        </div>

        <div class="dv-quick-facts-grid">
          <h2 class="dv-section-title">
            <span class="dv-section-icon">📊</span>
            Key Facts
          </h2>
          <div class="dv-facts-cards">
            ${content.keyFacts.slice(0, 6).map(fact => `
              <div class="dv-fact-card">
                <span class="dv-fact-icon">${fact.icon || '📌'}</span>
                <span class="dv-fact-label">${fact.label}</span>
                <span class="dv-fact-value">${fact.value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dv-quick-timeline">
          <h2 class="dv-section-title">
            <span class="dv-section-icon">📅</span>
            Discovery Timeline
          </h2>
          <div class="dv-timeline">
            ${content.timeline.map(item => `
              <div class="dv-timeline-item" data-era="${item.era}">
                <span class="dv-timeline-year">${item.year}</span>
                <span class="dv-timeline-event">${item.event}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dv-quick-structure">
          <h2 class="dv-section-title">
            <span class="dv-section-icon">🔬</span>
            At a Glance
          </h2>
          <div class="dv-structure-visual">
            <div class="dv-atom-diagram">
              <div class="dv-nucleus">
                <span class="dv-nucleus-label">Nucleus</span>
                <div class="dv-proton">p⁺</div>
                <div class="dv-neutron">n⁰</div>
              </div>
              <div class="dv-electron-cloud">
                <div class="dv-orbit dv-orbit-1"><span class="dv-electron">e⁻</span></div>
                <div class="dv-orbit dv-orbit-2"><span class="dv-electron">e⁻</span></div>
              </div>
            </div>
            <div class="dv-structure-labels">
              <div class="dv-label-item"><span class="dv-label-dot proton"></span> Protons: Positive charge</div>
              <div class="dv-label-item"><span class="dv-label-dot neutron"></span> Neutrons: No charge</div>
              <div class="dv-label-item"><span class="dv-label-dot electron"></span> Electrons: Negative charge</div>
            </div>
          </div>
        </div>

        <div class="dv-quick-cta">
          <button class="dv-learn-more-btn" onclick="IntentSelector.selectIntent('teach-me')">
            📚 Want to learn more? Switch to Teach Me mode
          </button>
        </div>
      `;

      return container;
    },

    // Teach Me Mode - Interactive, step-by-step learning
    renderTeachMe(content) {
      const container = document.createElement('div');
      container.className = 'dynamic-view dynamic-view-teach-me';

      // Filter to key learning sections
      const learningSections = content.sections.filter(s =>
        ['History of atomic theory', 'Structure', 'Properties', 'In philosophy',
         'Discovery of the electron', 'Discovery of the nucleus', 'Bohr model',
         'Subatomic particles', 'Nucleus', 'Electron cloud'].includes(s.title)
      ).slice(0, 6);

      container.innerHTML = `
        <div class="dv-teach-header">
          <div class="dv-progress-bar">
            <div class="dv-progress-fill" style="width: 0%"></div>
          </div>
          <div class="dv-lesson-info">
            <span class="dv-lesson-title">Learning: ${content.title}</span>
            <span class="dv-lesson-progress">Step 1 of ${learningSections.length + 2}</span>
          </div>
        </div>

        <div class="dv-teach-content">
          <!-- Introduction Step -->
          <div class="dv-lesson-step active" data-step="0">
            <div class="dv-step-header">
              <span class="dv-step-number">1</span>
              <h2>What is an Atom?</h2>
            </div>
            <div class="dv-step-content">
              ${content.mainImage ? `
                <figure class="dv-step-figure">
                  <img src="${content.mainImage.src}" alt="${content.mainImage.alt}">
                  <figcaption>Visual representation of an atom</figcaption>
                </figure>
              ` : ''}
              <div class="dv-step-text">
                <p class="dv-intro-lead">${content.shortDescription}</p>
                ${content.introduction.slice(0, 2).map(p => `<p>${p}</p>`).join('')}
              </div>
            </div>
            <div class="dv-step-checkpoint">
              <div class="dv-checkpoint-question">
                <span class="dv-checkpoint-icon">💡</span>
                <p><strong>Quick Check:</strong> What are the three main particles that make up an atom?</p>
              </div>
              <div class="dv-checkpoint-options">
                <button class="dv-option" data-correct="true">Protons, Neutrons, Electrons</button>
                <button class="dv-option" data-correct="false">Photons, Quarks, Muons</button>
                <button class="dv-option" data-correct="false">Molecules, Ions, Isotopes</button>
              </div>
              <div class="dv-checkpoint-feedback"></div>
            </div>
            <button class="dv-next-step-btn">Continue →</button>
          </div>

          <!-- Dynamic Section Steps -->
          ${learningSections.map((section, index) => `
            <div class="dv-lesson-step" data-step="${index + 1}">
              <div class="dv-step-header">
                <span class="dv-step-number">${index + 2}</span>
                <h2>${section.title}</h2>
              </div>
              <div class="dv-step-content">
                ${section.images[0] ? `
                  <figure class="dv-step-figure">
                    <img src="${section.images[0].src}" alt="${section.images[0].alt}">
                  </figure>
                ` : ''}
                <div class="dv-step-text">
                  ${section.content.slice(0, 3).map(c =>
                    c.startsWith('<ul') || c.startsWith('<ol') ? c : `<p>${c}</p>`
                  ).join('')}
                </div>
              </div>
              ${index < learningSections.length - 1 ? `
                <button class="dv-next-step-btn">Continue →</button>
              ` : `
                <div class="dv-lesson-complete">
                  <span class="dv-complete-icon">🎉</span>
                  <h3>Congratulations!</h3>
                  <p>You've completed this learning module about ${content.title}.</p>
                  <div class="dv-complete-actions">
                    <button class="dv-action-btn" onclick="IntentSelector.selectIntent('research')">
                      🔬 Dive Deeper (Research Mode)
                    </button>
                    <button class="dv-action-btn secondary" onclick="IntentSelector.selectIntent('full-article')">
                      📖 Read Full Article
                    </button>
                  </div>
                </div>
              `}
            </div>
          `).join('')}
        </div>

        <div class="dv-teach-sidebar">
          <div class="dv-sidebar-section">
            <h4>Your Progress</h4>
            <div class="dv-topic-list">
              <div class="dv-topic-item completed" data-goto="0">
                <span class="dv-topic-check">✓</span>
                <span>Introduction</span>
              </div>
              ${learningSections.map((section, index) => `
                <div class="dv-topic-item" data-goto="${index + 1}">
                  <span class="dv-topic-check"></span>
                  <span>${section.title}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Add interactivity
      setTimeout(() => this.initTeachMeInteractivity(container, learningSections.length), 100);

      return container;
    },

    // Initialize Teach Me interactivity
    initTeachMeInteractivity(container, totalSteps) {
      let currentStep = 0;
      const steps = container.querySelectorAll('.dv-lesson-step');
      const progressFill = container.querySelector('.dv-progress-fill');
      const progressText = container.querySelector('.dv-lesson-progress');
      const topicItems = container.querySelectorAll('.dv-topic-item');

      const updateProgress = (step) => {
        currentStep = step;
        const percent = (step / (totalSteps + 1)) * 100;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `Step ${step + 1} of ${totalSteps + 2}`;

        steps.forEach((s, i) => {
          s.classList.toggle('active', i === step);
          s.classList.toggle('completed', i < step);
        });

        topicItems.forEach((item, i) => {
          item.classList.toggle('current', i === step);
          item.classList.toggle('completed', i < step);
        });
      };

      // Next step buttons
      container.querySelectorAll('.dv-next-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentStep < steps.length - 1) {
            updateProgress(currentStep + 1);
            container.querySelector('.dv-lesson-step.active').scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // Topic navigation
      topicItems.forEach(item => {
        item.addEventListener('click', () => {
          const goto = parseInt(item.dataset.goto);
          updateProgress(goto);
        });
      });

      // Quiz options
      container.querySelectorAll('.dv-checkpoint-options').forEach(options => {
        options.querySelectorAll('.dv-option').forEach(opt => {
          opt.addEventListener('click', () => {
            const feedback = options.nextElementSibling;
            const isCorrect = opt.dataset.correct === 'true';

            options.querySelectorAll('.dv-option').forEach(o => {
              o.disabled = true;
              if (o.dataset.correct === 'true') o.classList.add('correct');
            });

            if (isCorrect) {
              opt.classList.add('selected-correct');
              feedback.innerHTML = '<span class="dv-feedback-correct">✓ Correct! Well done.</span>';
            } else {
              opt.classList.add('selected-wrong');
              feedback.innerHTML = '<span class="dv-feedback-wrong">✗ Not quite. The answer is: Protons, Neutrons, and Electrons.</span>';
            }
          });
        });
      });
    },

    // Research Mode - Full citations, academic depth
    renderResearch(content) {
      const container = document.createElement('div');
      container.className = 'dynamic-view dynamic-view-research';

      const mainSections = content.sections.filter(s => s.level === 2);

      container.innerHTML = `
        <div class="dv-research-header">
          <div class="dv-research-meta">
            <h1>${content.title}</h1>
            <p class="dv-research-desc">${content.shortDescription}</p>
            <div class="dv-research-actions">
              <button class="dv-research-btn" onclick="window.print()">
                <span>🖨️</span> Export/Print
              </button>
              <button class="dv-research-btn" onclick="navigator.clipboard.writeText(window.location.href)">
                <span>🔗</span> Copy Citation
              </button>
            </div>
          </div>
          ${content.mainImage ? `
            <img src="${content.mainImage.src}" alt="${content.mainImage.alt}" class="dv-research-image">
          ` : ''}
        </div>

        <div class="dv-research-layout">
          <nav class="dv-research-nav">
            <h4>Contents</h4>
            <ol class="dv-research-toc">
              <li><a href="#dv-intro">Introduction</a></li>
              ${mainSections.map((s, i) => `
                <li><a href="#dv-section-${i}">${s.title}</a></li>
              `).join('')}
            </ol>
            <div class="dv-quick-stats">
              <h4>Article Statistics</h4>
              <div class="dv-stat-item">
                <span class="dv-stat-label">Sections</span>
                <span class="dv-stat-value">${content.sections.length}</span>
              </div>
              <div class="dv-stat-item">
                <span class="dv-stat-label">Last Updated</span>
                <span class="dv-stat-value">Dec 2025</span>
              </div>
              <div class="dv-stat-item">
                <span class="dv-stat-label">Quality</span>
                <span class="dv-stat-value">Good Article</span>
              </div>
            </div>
          </nav>

          <article class="dv-research-content">
            <section id="dv-intro" class="dv-research-section">
              <h2>Introduction</h2>
              ${content.introduction.map(p => `<p>${p}</p>`).join('')}
            </section>

            ${mainSections.map((section, i) => `
              <section id="dv-section-${i}" class="dv-research-section">
                <h2>${section.title}</h2>
                ${section.content.map(c =>
                  c.startsWith('<ul') || c.startsWith('<ol') ? c : `<p>${c}</p>`
                ).join('')}
                ${section.images[0] ? `
                  <figure class="dv-research-figure">
                    <img src="${section.images[0].src}" alt="${section.images[0].alt}">
                    <figcaption>${section.images[0].alt || 'Figure illustration'}</figcaption>
                  </figure>
                ` : ''}
              </section>
            `).join('')}
          </article>
        </div>
      `;

      return container;
    },

    // Full Article Mode - Standard Wikipedia with mode indicator
    renderFullArticle(content) {
      // For full article, we restore original content with minimal changes
      const container = document.createElement('div');
      container.className = 'dynamic-view dynamic-view-full-article';

      container.innerHTML = `
        <div class="dv-full-banner">
          <span class="dv-full-banner-text">
            📖 Full Article Mode — <button class="dv-banner-link" onclick="IntentSelector.showModal()">Change view</button>
          </span>
        </div>
      `;

      return container;
    }
  };

  // Main transformation function
  function transformContent(intentId) {
    const container = ContentExtractor.getContentContainer();
    if (!container) {
      console.error('[Dynamic View] Content container not found');
      return;
    }

    // Store original content on first run
    if (!originalContent) {
      originalContent = container.innerHTML;
      parsedContent = ContentExtractor.parseAll();
    }

    // Remove any existing dynamic view
    const existingView = document.querySelector('.dynamic-view');
    if (existingView) existingView.remove();

    // Remove full-article banner if exists
    const existingBanner = document.querySelector('.dv-full-banner');
    if (existingBanner) existingBanner.remove();

    // Add intent class to body
    document.body.className = document.body.className.replace(/\s*intent-\w+/g, '');
    document.body.classList.add(`intent-${intentId}`);

    currentIntent = intentId;

    // Render based on intent
    let viewElement;
    switch (intentId) {
      case 'quick-facts':
        container.style.display = 'none';
        viewElement = ViewRenderers.renderQuickFacts(parsedContent);
        container.parentNode.insertBefore(viewElement, container);
        break;

      case 'teach-me':
        container.style.display = 'none';
        viewElement = ViewRenderers.renderTeachMe(parsedContent);
        container.parentNode.insertBefore(viewElement, container);
        break;

      case 'research':
        container.style.display = 'none';
        viewElement = ViewRenderers.renderResearch(parsedContent);
        container.parentNode.insertBefore(viewElement, container);
        break;

      case 'full-article':
      default:
        container.style.display = '';
        viewElement = ViewRenderers.renderFullArticle(parsedContent);
        container.parentNode.insertBefore(viewElement, container);
        break;
    }

    console.log(`[Dynamic View] Transformed to: ${intentId}`);
  }

  // Listen for intent selection events
  document.addEventListener('intentSelected', (e) => {
    transformContent(e.detail.intent);
  });

  // Expose for external use
  window.DynamicView = {
    transform: transformContent,
    getContent: () => parsedContent,
    getCurrentIntent: () => currentIntent
  };

  console.log('[Dynamic View] Module loaded');
})();
