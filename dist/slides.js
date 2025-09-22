/* Distribution build of the Docsify slides plugin (auto-registers if window.$docsify exists) */
/* Source: ../slides.js */
(function(){
  function initMermaidIn(root) {
    try {
      if (!window.mermaid) return;
      var scope = root || document;
      var blocks = scope.querySelectorAll('code[class*="language-mermaid"], pre code.mermaid, .mermaid');
      if (blocks && blocks.length) {
        window.mermaid.init(undefined, blocks);
      }
    } catch (e) {}
  }

  function renderMermaidInSlide(slideEl) {
    try {
      if (!window.mermaid || !slideEl) return;
      var codeBlocks = slideEl.querySelectorAll('code[class*="language-mermaid"], code.lang-mermaid');
      codeBlocks.forEach(function(code){
        var pre = code.closest('pre');
        var text = code.textContent;
        var div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = text;
        if (pre && pre.parentNode) { pre.parentNode.replaceChild(div, pre); }
        else { code.parentNode.replaceChild(div, code); }
        window.mermaid.init(undefined, [div]);
      });
      var mermaidBlocks = slideEl.querySelectorAll('.mermaid');
      if (mermaidBlocks && mermaidBlocks.length) {
        window.mermaid.init(undefined, mermaidBlocks);
      }
    } catch (e) {}
  }

  function buildSlidesHTML(inner, setId, opts) {
    var parts = inner.split(/<!--\s*slide:break\s*-->/i);
    var total = parts.length;
    var slides = parts.map(function(p){ return '<div class="dslides-slide">' + p.trim() + '</div>'; }).join('');
    return [
      '<div class="dslides" data-set="'+ setId +'" data-height="'+ opts.height +'" data-overflow="'+ opts.overflow +'">',
      '  <div class="dslides-viewport">',
      slides,
      '  </div>',
      '  <div class="dslides-controls">',
      '    <button class="dslides-prev" aria-label="Previous slide">◀</button>',
      '    <span class="dslides-counter" aria-live="polite">1/'+ total +'</span>',
      '    <button class="dslides-next" aria-label="Next slide">▶</button>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function wireSlides(root, defaults) {
    var containers = (root || document).querySelectorAll('.dslides');
    containers.forEach(function(el){
      if (el.__wired) return; el.__wired = true;
      var viewport = el.querySelector('.dslides-viewport');
      var slides = Array.prototype.slice.call(el.querySelectorAll('.dslides-slide'));
      var prevBtn = el.querySelector('.dslides-prev');
      var nextBtn = el.querySelector('.dslides-next');
      var counter = el.querySelector('.dslides-counter');
      var idx = 0;
      var heightAttr = parseInt(el.getAttribute('data-height'), 10);
      var overflowAttr = (el.getAttribute('data-overflow') || '').toLowerCase();
      var height = isNaN(heightAttr) ? defaults.height : heightAttr;
      var overflow = (overflowAttr === 'auto' || overflowAttr === 'scroll' || overflowAttr === 'clip') ? overflowAttr : (defaults.overflow || 'auto');
      var overflowX = defaults.overflowX || overflow;
      var overflowY = defaults.overflowY || overflow;
      if (viewport) {
        viewport.style.setProperty('--dslides-height', height + 'px');
        viewport.style.height = height + 'px';
        var cssOverflow = function(v){ return (v === 'clip') ? 'hidden' : (v === 'scroll' ? 'scroll' : 'auto'); };
        viewport.style.overflowX = cssOverflow(overflowX);
        viewport.style.overflowY = cssOverflow(overflowY);
      }
      var prevIdx = 0;
      function update() {
        slides.forEach(function(s){ s.classList.remove('enter-from-right','enter-from-left','exiting-to-left','exiting-to-right'); });
        var forward = idx > prevIdx;
        var dir = forward ? 'right' : 'left';
        var entering = slides[idx];
        var exiting = slides[prevIdx];
        if (idx !== prevIdx) {
          if (entering) { entering.classList.add('enter-from-' + dir); void entering.offsetWidth; }
          if (exiting) { exiting.classList.add('exiting-to-' + (forward ? 'left' : 'right')); }
        }
        slides.forEach(function(s, i){ if (i === idx) s.classList.add('is-active'); else if (i !== prevIdx) s.classList.remove('is-active'); });
        if (idx !== prevIdx && exiting) {
          exiting.classList.add('is-active', 'exiting');
          if (entering) {
            var cleanupPrev = function() {
              exiting.classList.remove('is-active','exiting','exiting-to-left','exiting-to-right');
              entering.removeEventListener('transitionend', cleanupPrev);
            };
            entering.addEventListener('transitionend', cleanupPrev);
          }
        }
        if (idx !== prevIdx && entering) {
          var cleanupEnter = function(){ entering.classList.remove('enter-from-' + dir); entering.removeEventListener('transitionend', cleanupEnter); };
          entering.addEventListener('transitionend', cleanupEnter);
        }
        if (counter) counter.textContent = (idx + 1) + '/' + slides.length;
        if (prevBtn) prevBtn.disabled = (idx === 0);
        if (nextBtn) nextBtn.disabled = (idx === slides.length - 1);
        if (viewport) {
          viewport.scrollTop = 0; viewport.scrollLeft = 0;
          try {
            if (window.mermaid) { var current = slides[idx]; renderMermaidInSlide(current); }
          } catch (e) {}
        }
        prevIdx = idx;
      }
      function go(delta){ var next = idx + delta; if (next < 0) next = 0; if (next > slides.length - 1) next = slides.length - 1; if (next !== idx) { prevIdx = idx; idx = next; update(); } }
      if (prevBtn) prevBtn.addEventListener('click', function(){ go(-1); });
      if (nextBtn) nextBtn.addEventListener('click', function(){ go(1); });
      el.addEventListener('keydown', function(e){ if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } });
      el.setAttribute('tabindex', '0');
      update();
    });
  }

  function replaceSlideBlocks(html, setIdCounter, opts) {
    return html.replace(/<!--\s*slide:start\s*-->([\s\S]*?)<!--\s*slide:end\s*-->/gi, function(_, inner){
      var setId = ++setIdCounter.count; return buildSlidesHTML(inner, setId, opts);
    });
  }

  function plugin(hook, vm) {
    var setIdCounter = { count: 0 };
    var defaults = { height: 360, overflow: 'auto', overflowX: undefined, overflowY: undefined };
    var user = (window.$docsify && (window.$docsify.slidesOptions || window.$docsify.slides)) || {};
    if (typeof user.height === 'number') defaults.height = user.height;
    if (typeof user.overflow === 'string') defaults.overflow = user.overflow;
    if (typeof user.overflowX === 'string') defaults.overflowX = user.overflowX;
    if (typeof user.overflowY === 'string') defaults.overflowY = user.overflowY;
    hook.beforeEach(function(content){ setIdCounter.count = 0; });
    hook.afterEach(function(html, next){ var out = replaceSlideBlocks(html, setIdCounter, defaults); next(out); });
    hook.doneEach(function(){ wireSlides(document, defaults); setTimeout(function(){ initMermaidIn(document); }, 0); });
  }

  if (typeof window !== 'undefined' && window.$docsify) {
    window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
  }
})();
