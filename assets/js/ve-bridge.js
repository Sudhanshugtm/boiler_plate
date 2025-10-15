// ABOUTME: Bridge VisualEditor and other MediaWiki runtime network calls
// Rewrites relative /w/* requests to the original wiki origin so VE can load
// when a page is hosted statically on GitHub Pages or file://

(function(){
  try {
    var REMOTE = (typeof window.__VE_REMOTE_BASE__ === 'string' && window.__VE_REMOTE_BASE__) || '';

    function withOriginParam(url) {
      try {
        if (!url) return url;
        // Add origin=* to action API calls to enable CORS
        if (url.indexOf('/w/api.php') !== -1) {
          var hasQ = url.indexOf('?') !== -1;
          if (url.indexOf('origin=') === -1) {
            url += (hasQ ? '&' : '?') + 'origin=*';
          }
        }
      } catch(_){ }
      return url;
    }

    function absolutize(u){
      try {
        if (!u) return u;
        if (typeof u !== 'string') return u;
        // Only rewrite root-relative MediaWiki endpoints
        if (u.startsWith('/w/')) return withOriginParam((REMOTE || '') + u);
        // Also patch if already absolute to remote but missing origin param for api.php
        if ((REMOTE && u.startsWith(REMOTE + '/w/api.php')) || u.indexOf('/w/api.php') !== -1) return withOriginParam(u);
        return u;
      } catch(_) { return u; }
    }

    // Patch fetch
    if (typeof window.fetch === 'function') {
      var _fetch = window.fetch;
      window.fetch = function(input, init){
        try {
          if (typeof input === 'string') input = absolutize(input);
          else if (input && typeof input === 'object' && 'url' in input) {
            var url = absolutize(input.url);
            if (url !== input.url) { try { input = new Request(url, input); } catch(_) { input.url = url; } }
          }
          // Ensure cross-origin friendly defaults
          init = init || {};
          if (!init.credentials) init.credentials = 'omit';
          if (!init.mode) init.mode = 'cors';
        } catch(_) {}
        return _fetch.call(this, input, init);
      };
    }

    // Patch XMLHttpRequest
    if (window.XMLHttpRequest) {
      var _open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url){
        try { url = absolutize(url); } catch(_) {}
        return _open.apply(this, [method, url].concat([].slice.call(arguments, 2)));
      };
    }

    // Patch jQuery ajax if present
    if (window.jQuery && jQuery.ajaxPrefilter) {
      jQuery.ajaxPrefilter(function(options){
        options.url = absolutize(options.url);
        options.xhrFields = options.xhrFields || {};
        options.xhrFields.withCredentials = false;
      });
    }
  } catch(_) { /* ignore */ }
})();
