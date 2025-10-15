// ABOUTME: VisualEditor-style prototype overlay for static Wikipedia pages
// Provides: toolbar (bold/italic/headings/link/cite/media), contenteditable surface,
// mock save with word-diff, autosave drafts, source mode toggle, keyboard shortcuts.

(function () {
  'use strict';

  const state = {
    overlay: null,
    surface: null,
    editable: null,
    sourceTextarea: null,
    statusbar: null,
    originalHTML: '',
    pageKey: '',
    isSourceMode: false,
  };

  function ensureCssLoaded() {
    const hrefs = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.getAttribute('href') || '');
    if (!hrefs.some(h => h.includes('/assets/css/editor.css'))) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Attempt to resolve relative path whether we are in pages/ or root
      const base = (function(){
        try {
          const here = document.currentScript && document.currentScript.getAttribute('src');
          if (here && here.includes('/assets/js/')) return here.split('/assets/js/')[0] + '/assets/css/editor.css';
        } catch(_) {}
        // fallback
        const guess = (document.querySelector('link[href*="assets/css/wikipedia-site.css"]') || {}).href;
        if (guess) return guess.replace('wikipedia-site.css','editor.css');
        const fromPages = location.pathname.includes('/pages/') ? '../assets/css/editor.css' : 'assets/css/editor.css';
        return fromPages;
      })();
      link.href = base;
      document.head.appendChild(link);
    }
  }

  function getPageKey() {
    const title = (document.querySelector('#firstHeading') || document.querySelector('title') || {}).textContent || location.pathname;
    return 've-draft:' + title.trim().slice(0, 120);
  }

  function throttle(fn, ms) {
    let t = 0, savedArgs = null, savedThis = null;
    return function throttled(...args) {
      savedArgs = args; savedThis = this;
      if (!t) {
        fn.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
        t = window.setTimeout(() => { t = 0; if (savedArgs) throttled.apply(savedThis, savedArgs); }, ms);
      }
    };
  }

  function buildToolbar() {
    const bar = document.createElement('div');
    bar.className = 've-toolbar';

    const title = document.createElement('div');
    title.className = 've-title';
    title.textContent = 'Visual Editor (Prototype)';
    bar.appendChild(title);

    // Headings
    const heading = document.createElement('select');
    heading.className = 've-select';
    [['P','Paragraph'],['H2','Heading 2'],['H3','Heading 3'],['H4','Heading 4']].forEach(([val,label])=>{
      const opt = document.createElement('option'); opt.value = val; opt.textContent = label; heading.appendChild(opt);
    });
    heading.addEventListener('change', () => {
      const map = { P: 'p', H2: 'h2', H3: 'h3', H4: 'h4' };
      document.execCommand('formatBlock', false, map[heading.value]);
    });
    bar.appendChild(heading);

    // Bold
    const bold = btn('B', () => document.execCommand('bold'));
    bold.style.fontWeight = '700';
    bar.appendChild(bold);

    // Italic
    const italic = btn('I', () => document.execCommand('italic'));
    italic.style.fontStyle = 'italic';
    bar.appendChild(italic);

    // Link
    bar.appendChild(btn('Link', openLinkInspector));

    // Cite
    bar.appendChild(btn('Cite', openCiteInspector));

    // Media
    bar.appendChild(btn('Media', insertMediaPlaceholder));

    bar.appendChild(sep());

    // Undo/Redo
    bar.appendChild(btn('Undo', () => document.execCommand('undo')));
    bar.appendChild(btn('Redo', () => document.execCommand('redo')));

    bar.appendChild(sep());

    // Source toggle
    const source = btn('Source', toggleSourceMode);
    source.title = 'Toggle source mode';
    bar.appendChild(source);

    // Save, Cancel
    const save = document.createElement('button');
    save.className = 've-btn ve-primary';
    save.textContent = 'Publish changes';
    save.addEventListener('click', openSaveModal);
    bar.appendChild(save);

    const cancel = document.createElement('button');
    cancel.className = 've-btn ve-danger';
    cancel.textContent = 'Discard';
    cancel.addEventListener('click', onCancel);
    bar.appendChild(cancel);

    return bar;
  }

  function sep(){ const d = document.createElement('div'); d.className = 've-sep'; return d; }
  function btn(label, onClick){ const b = document.createElement('button'); b.className = 've-btn'; b.textContent = label; b.addEventListener('click', onClick); return b; }

  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 've-overlay';

    const toolbar = buildToolbar();
    overlay.appendChild(toolbar);

    const wrap = document.createElement('div');
    wrap.className = 've-surface-wrap';
    const surface = document.createElement('div');
    surface.className = 've-surface';

    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    editable.setAttribute('spellcheck', 'true');
    editable.style.minHeight = '60vh';
    editable.style.background = '#fff';
    editable.style.padding = '12px 16px';
    editable.style.border = '1px solid var(--ve-border)';
    editable.style.borderRadius = '6px';

    surface.appendChild(editable);
    wrap.appendChild(surface);
    overlay.appendChild(wrap);

    const status = document.createElement('div');
    status.className = 've-statusbar';
    status.innerHTML = '<span id="ve-status-wordcount">Words: 0</span><span>Drafts auto-save locally</span>';
    overlay.appendChild(status);

    document.body.appendChild(overlay);

    state.overlay = overlay;
    state.surface = surface;
    state.editable = editable;
    state.statusbar = status;
  }

  function pickContentRoot() {
    return document.querySelector('#mw-content-text .mw-parser-output')
        || document.querySelector('#mw-content-text')
        || document.querySelector('.mw-parser-output')
        || document.querySelector('#content')
        || document.body;
  }

  function cloneContentIntoEditor() {
    const root = pickContentRoot();
    if (!root) return;
    state.originalHTML = root.innerHTML;

    // Prefer a shallow clone of children (avoid duplicate IDs issues from outer wrapper)
    const frag = document.createDocumentFragment();
    Array.from(root.children).forEach(ch => frag.appendChild(ch.cloneNode(true)));
    state.editable.innerHTML = '';
    state.editable.appendChild(frag);

    // Make internal anchors focusable in edit mode
    state.editable.querySelectorAll('a').forEach(a => { a.setAttribute('data-ve-href', a.getAttribute('href')||''); a.removeAttribute('href'); });
  }

  function restoreLinksAfterSave(container){
    container.querySelectorAll('a[data-ve-href]').forEach(a => { a.setAttribute('href', a.getAttribute('data-ve-href')); a.removeAttribute('data-ve-href'); });
  }

  function updateWordCount() {
    const text = state.editable.innerText || '';
    const words = (text.trim().match(/\S+/g) || []).length;
    const el = document.getElementById('ve-status-wordcount');
    if (el) el.textContent = 'Words: ' + words;
  }

  const autosave = throttle(() => {
    try {
      const draft = state.isSourceMode ? (state.sourceTextarea?.value || '') : state.editable.innerHTML;
      localStorage.setItem(state.pageKey, JSON.stringify({ t: Date.now(), html: draft, isSource: state.isSourceMode }));
    } catch(_) {}
  }, 800);

  function maybeRestoreDraft() {
    try {
      const raw = localStorage.getItem(state.pageKey);
      if (!raw) return;
      const { html, isSource } = JSON.parse(raw);
      if (html) {
        if (isSource) {
          toggleSourceMode(true);
          state.sourceTextarea.value = html;
        } else {
          state.editable.innerHTML = html;
        }
        updateWordCount();
      }
    } catch(_) {}
  }

  function openEditor(opts) {
    ensureCssLoaded();
    if (!state.overlay) buildOverlay();
    state.pageKey = getPageKey();
    cloneContentIntoEditor();
    updateWordCount();
    maybeRestoreDraft();

    state.overlay.classList.add('ve-open');
    state.editable.focus();

    // Events
    state.editable.addEventListener('input', onInput, { passive: true });
    document.addEventListener('keydown', onKeyDown);

    // If opened from a section edit, try to scroll into view
    if (opts && opts.hash) {
      const target = state.editable.querySelector(opts.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeEditor() {
    if (!state.overlay) return;
    state.overlay.classList.remove('ve-open');
    state.isSourceMode = false;
    // Remove listeners
    state.editable.removeEventListener('input', onInput);
    document.removeEventListener('keydown', onKeyDown);
  }

  function onInput() { updateWordCount(); autosave(); }

  function onKeyDown(e) {
    // Cmd/Ctrl+B/I for formatting
    const isMod = e.metaKey || e.ctrlKey;
    if (isMod && e.key.toLowerCase() === 'b') { e.preventDefault(); document.execCommand('bold'); return; }
    if (isMod && e.key.toLowerCase() === 'i') { e.preventDefault(); document.execCommand('italic'); return; }
    if (isMod && e.key.toLowerCase() === 's') { e.preventDefault(); openSaveModal(); return; }
    if (e.key === 'Escape') { e.preventDefault(); closeEditor(); return; }
  }

  function toggleSourceMode(forceSource) {
    const toSource = typeof forceSource === 'boolean' ? forceSource : !state.isSourceMode;
    if (toSource) {
      // enter source mode
      const ta = document.createElement('textarea');
      ta.className = 've-source';
      ta.value = state.editable.innerHTML;
      state.surface.replaceChild(ta, state.editable);
      state.sourceTextarea = ta;
      state.isSourceMode = true;
      ta.addEventListener('input', autosave);
      ta.focus();
    } else {
      // back to visual
      const div = document.createElement('div');
      div.setAttribute('contenteditable', 'true');
      div.setAttribute('spellcheck', 'true');
      div.style.minHeight = '60vh';
      div.style.background = '#fff';
      div.style.padding = '12px 16px';
      div.style.border = '1px solid var(--ve-border)';
      div.style.borderRadius = '6px';
      div.innerHTML = state.sourceTextarea.value;
      state.surface.replaceChild(div, state.sourceTextarea);
      state.editable = div;
      state.isSourceMode = false;
      state.sourceTextarea = null;
      state.editable.addEventListener('input', onInput);
      state.editable.focus();
      updateWordCount();
    }
  }

  function openLinkInspector() {
    const sel = window.getSelection();
    const current = sel && sel.anchorNode ? (sel.anchorNode.parentElement.closest('a') || null) : null;
    const currentHref = current ? (current.getAttribute('data-ve-href') || '') : '';
    const currentText = sel && sel.toString ? sel.toString() : '';

    const { close, body, footer } = modal('Insert Link');
    const f1 = field('Target URL', 'text', currentHref);
    const f2 = field('Label (optional)', 'text', currentText);
    body.appendChild(f1.wrap);
    body.appendChild(f2.wrap);

    const cancel = button('Cancel');
    cancel.addEventListener('click', close);
    const insert = primary('Apply');
    insert.addEventListener('click', () => {
      const url = f1.input.value.trim();
      const label = f2.input.value.trim();
      if (!url) return;
      document.execCommand('createLink', false, url);
      // set label if provided
      if (label) {
        try { const a = window.getSelection()?.anchorNode?.parentElement?.closest('a'); if (a) a.textContent = label; } catch(_) {}
      }
      // preserve VE href data (we removed hrefs during editing)
      const as = state.editable.querySelectorAll('a[href]');
      as.forEach(a => { a.setAttribute('data-ve-href', a.getAttribute('href')); a.removeAttribute('href'); });
      autosave();
      close();
    });
    footer.appendChild(cancel);
    footer.appendChild(insert);
  }

  function openCiteInspector() {
    const { close, body, footer } = modal('Add Citation');
    const f1 = field('Citation text', 'text', 'Reference text or URL');
    body.appendChild(f1.wrap);
    const tip = document.createElement('div'); tip.style.fontSize = '12px'; tip.style.color = '#72777d'; tip.textContent = 'This inserts a prototype citation placeholder.'; body.appendChild(tip);
    const cancel = button('Cancel'); cancel.addEventListener('click', close);
    const insert = primary('Insert'); insert.addEventListener('click', () => {
      const sup = document.createElement('sup'); sup.className = 'reference'; sup.textContent = '[' + (Math.floor(Math.random()*90)+10) + ']';
      const sel = window.getSelection();
      if (sel && sel.rangeCount) { const r = sel.getRangeAt(0); r.collapse(false); r.insertNode(sup); }
      autosave(); close();
    });
    footer.appendChild(cancel); footer.appendChild(insert);
  }

  function insertMediaPlaceholder() {
    const fig = document.createElement('figure'); fig.className = 'mw-file-element'; fig.style.border = '1px dashed #c8ccd1'; fig.style.padding = '8px'; fig.style.margin = '12px 0'; fig.style.textAlign = 'center';
    fig.textContent = 'Media placeholder';
    const sel = window.getSelection();
    if (sel && sel.rangeCount) { const r = sel.getRangeAt(0); r.collapse(false); r.insertNode(fig); }
    autosave();
  }

  function modal(title) {
    const backdrop = document.createElement('div'); backdrop.className = 've-modal-backdrop ve-open';
    const m = document.createElement('div'); m.className = 've-modal';
    const h = document.createElement('div'); h.className = 've-modal-header'; h.textContent = title;
    const b = document.createElement('div'); b.className = 've-modal-body';
    const f = document.createElement('div'); f.className = 've-modal-footer';
    m.appendChild(h); m.appendChild(b); m.appendChild(f);
    backdrop.appendChild(m);
    document.body.appendChild(backdrop);
    const close = () => { backdrop.remove(); };
    return { close, body: b, footer: f, root: backdrop };
  }

  function field(labelText, type, value) {
    const wrap = document.createElement('div'); wrap.className = 've-field';
    const label = document.createElement('label'); label.textContent = labelText; wrap.appendChild(label);
    const input = document.createElement('input'); input.className = 've-input'; input.type = type; if (value) input.value = value; wrap.appendChild(input);
    return { wrap, input };
  }
  function primary(text){ const b = document.createElement('button'); b.className = 've-btn ve-primary'; b.textContent = text; return b; }
  function button(text){ const b = document.createElement('button'); b.className = 've-btn'; b.textContent = text; return b; }

  // --- Diff implementation (word-level LCS) ---
  function tokenizeWords(s){ return (s||'').replace(/\s+/g,' ').trim().split(' '); }
  function diffWords(aStr, bStr){
    const a = tokenizeWords(aStr), b = tokenizeWords(bStr);
    const m = a.length, n = b.length;
    const dp = Array(m+1).fill(0).map(()=>Array(n+1).fill(0));
    for (let i=1;i<=m;i++) for (let j=1;j<=n;j++) dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
    const out = [];
    let i = m, j = n;
    while (i>0 && j>0){
      if (a[i-1] === b[j-1]) { out.push({ type:'equal', text:a[i-1] }); i--; j--; }
      else if (dp[i-1][j] >= dp[i][j-1]) { out.push({ type:'delete', text:a[i-1] }); i--; }
      else { out.push({ type:'insert', text:b[j-1] }); j--; }
    }
    while(i>0){ out.push({ type:'delete', text:a[i-1] }); i--; }
    while(j>0){ out.push({ type:'insert', text:b[j-1] }); j--; }
    out.reverse();
    return out;
  }

  function renderDiffHTML(oldHTML, newHTML){
    // Use text content for clarity
    const oldText = stripHtml(oldHTML);
    const newText = stripHtml(newHTML);
    const chunks = diffWords(oldText, newText);
    const el = document.createElement('div'); el.className = 've-diff';
    const frag = document.createDocumentFragment();
    chunks.forEach(ch => {
      const t = (ch.text + ' ');
      if (ch.type === 'equal') frag.appendChild(document.createTextNode(t));
      else if (ch.type === 'insert') { const ins = document.createElement('ins'); ins.textContent = t; frag.appendChild(ins); }
      else { const del = document.createElement('del'); del.textContent = t; frag.appendChild(del); }
    });
    el.appendChild(frag);
    return el;
  }

  function stripHtml(html){ const tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; }

  function openSaveModal() {
    const { close, body, footer } = modal('Review changes');
    const editedContainer = state.isSourceMode ? (()=>{ const div = document.createElement('div'); div.innerHTML = state.sourceTextarea.value; return div; })() : state.editable.cloneNode(true);
    restoreLinksAfterSave(editedContainer);
    const newHTML = editedContainer.innerHTML;

    const diff = renderDiffHTML(state.originalHTML, newHTML);
    body.appendChild(diff);

    // Actions
    const copy = button('Copy diff');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(diff.innerText); copy.textContent = 'Copied!'; setTimeout(()=>copy.textContent='Copy diff',1200); } catch(_) {}
    });

    const exportHtml = button('Export HTML');
    exportHtml.addEventListener('click', () => {
      const blob = new Blob([newHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'edited.html'; a.click(); URL.revokeObjectURL(url);
    });

    const publish = primary('Publish (mock)');
    publish.addEventListener('click', () => {
      // Simulate success
      publish.textContent = 'Published ✓'; publish.disabled = true;
      try { localStorage.removeItem(state.pageKey); } catch(_){}
      setTimeout(() => { close(); closeEditor(); alert('Changes published (mock).'); }, 400);
    });

    const cancel = button('Cancel'); cancel.addEventListener('click', close);
    footer.appendChild(copy); footer.appendChild(exportHtml); footer.appendChild(cancel); footer.appendChild(publish);
  }

  function onCancel(){
    if (confirm('Discard your changes?')) {
      try { localStorage.removeItem(state.pageKey); } catch(_){}
      closeEditor();
    }
  }

  // --- Entry points ---
  function shouldAutoOpen() {
    const p = new URLSearchParams(location.search);
    return p.get('editor') && p.get('editor') !== '0' && p.get('editor') !== 'false';
  }

  function interceptEditLinks() {
    const selectors = [
      '#ca-edit a',
      '.vector-menu-tabs a[accesskey="e"]',
      'a[href*="action=edit"]',
      'a[href*="veaction=edit"]',
      '.mw-editsection a'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = (a.getAttribute('href') || '').split('#')[1];
        openEditor({ hash: hash ? ('#' + hash) : null });
      });
    });
  }

  function init() {
    interceptEditLinks();
    if (shouldAutoOpen() || (window.__VE_OPEN_ON_LOAD__ === true)) openEditor();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
