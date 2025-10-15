(function(){try{
  function cssPath(el){ if(!(el instanceof Element)) return ''; const path=[];
    while(el && el.nodeType===1 && el!==document.documentElement){
      let s=el.nodeName.toLowerCase(); if(el.id){ s+=`#${el.id}`; path.unshift(s); break; }
      let nth=1, sib=el; while((sib=sib.previousElementSibling)) if(sib.nodeName===el.nodeName) nth++;
      path.unshift(`${s}:nth-of-type(${nth})`); el=el.parentElement;
    } return path.join(' > ');
  }
  function xPath(el){ if(!el||el.nodeType!==1) return ''; const parts=[];
    while(el && el.nodeType===1 && el!==document.documentElement){
      let idx=1, sib=el.previousElementSibling; while(sib){ if(sib.nodeName===el.nodeName) idx++; sib=sib.previousElementSibling; }
      parts.unshift(`${el.nodeName.toLowerCase()}[${idx}]`); el=el.parentElement;
    } return '//'+parts.join('/');
  }
  function pickAttrs(el){ const keys=['data-testid','data-test','data-qa','aria-label','name','title','id','role']; const out={};
    keys.forEach(k=>{ try{ const v=el.getAttribute(k); if(v) out[k]=v; }catch(_){ } }); return out;
  }
  function nearestHeading(el){ let cur=el, steps=0; while(cur && steps++<5){ try{ const h=cur.querySelector('h1,h2,h3,h4,h5,h6'); if(h&&h.innerText) return h.innerText.trim().slice(0,200); }catch(_){ } cur=cur.parentElement; } return ''; }
  function getSelIn(el){ try{ const sel=window.getSelection(); if(!sel||sel.rangeCount===0) return null; const rng=sel.getRangeAt(0); if(!rng||!el.contains(rng.commonAncestorContainer)) return null; return rng.toString(); }catch(_){ return null; } }
  function detectCode(el){
    const codeEl = el && (el.closest && el.closest('pre,code,[data-line-number],.blob-code,.blob-code-inner,[role="code"],.monaco-editor,.cm-editor'));
    if(!codeEl) return null;
    let lang=''; const cls=(codeEl.className||'').toString(); const m=cls.match(/language-([\w-]+)/i)||cls.match(/lang(uage)?-([\w-]+)/i);
    if(m) lang = (m[1] && !m[1].startsWith('lang')) ? m[1] : (m[2]||'');
    const selectionText=(getSelIn(codeEl)||'').trim();
    const snippet = selectionText ? selectionText.slice(0,1000) : ((codeEl.innerText||'').trim().slice(0,500));
    let host=location.hostname, file='', ref=''; const parts=location.pathname.split('/');
    const blobIdx=parts.indexOf('blob'); if(blobIdx>2 && parts.length>blobIdx+2){ ref=parts[blobIdx+1]; file=decodeURIComponent(parts.slice(blobIdx+2).join('/')); }
    if(!file && location.pathname.includes('/-/blob/')){ const p=location.pathname.split('/'); const i=p.indexOf('blob'); if(i>=0){ ref=p[i+1]||''; file=decodeURIComponent(p.slice(i+2).join('/')); } }
    if(!file && location.pathname.includes('/src/')){ const p=location.pathname.split('/'); const i=p.indexOf('src'); if(i>=0){ ref=p[i+1]||''; file=decodeURIComponent(p.slice(i+2).join('/')); } }
    let lines=null; const hash=(location.hash||'');
    const hm = hash.match(/#L(\d+)(?:-L(\d+))?/i) || hash.match(/#(\d+)-(\d+)/);
    if(hm){ const a=parseInt(hm[1]||'0',10), b=hm[2]?parseInt(hm[2],10):a; lines={start:a,end:b}; }
    return { lang, lines, snippet, host, file, ref };
  }
  function buildAnchorAt(x,y){
    const arr = document.elementsFromPoint ? document.elementsFromPoint(x,y) : [document.elementFromPoint(x,y)];
    let el=null; for(const e of (arr||[])){ if(e&&e.id!=='uxa-overlay'&&e.id!=='uxa-stage') { el=e; break; } }
    if(!el) return null;
    const r = el.getBoundingClientRect();
    return {
      css: cssPath(el),
      xpath: xPath(el),
      attrs: pickAttrs(el),
      heading: nearestHeading(el),
      tag: el.tagName ? el.tagName.toLowerCase() : '',
      snippet: (el.innerText||'').trim().slice(0,200),
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
      code: detectCode(el)
    };
  }
  window.addEventListener('message', (evt)=>{
    const d = evt.data||{}; if(!d || !d.type) return;
    if(d.type==='UXA_PING'){ evt.source && evt.source.postMessage({ type:'UXA_PONG', token:d.token, version:1 }, '*'); return; }
    if(d.type==='UXA_PROBE'){ const res = buildAnchorAt(d.x, d.y); evt.source && evt.source.postMessage({ type:'UXA_PROBE_RESULT', id:d.id, result:res }, '*'); }
  });
}catch(e){ /* silent */ }})();
