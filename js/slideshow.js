/* ═══════════════════════════════════════════════
   SLIDESHOW ENGINE
   Converts case study sections into a 16:9
   presentation mode with keyboard navigation.
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ──
  let active = false;
  let currentSlide = 0;
  let slides = [];
  let viewport = null;
  let controlsEl = null;
  let progressEl = null;
  let hintEl = null;
  let hintTimeout = null;
  let mouseMoveHandler = null;
  let hideNavTimeout = null;

  // ── SVG icons ──
  const ICON_SLIDES = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="12" height="8" rx="1.5"/>
    <line x1="5" y1="13" x2="11" y2="13"/>
  </svg>`;

  const ICON_SCROLL = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="1" width="10" height="14" rx="1.5"/>
    <line x1="6" y1="5" x2="10" y2="5"/>
    <line x1="6" y1="8" x2="10" y2="8"/>
    <line x1="6" y1="11" x2="9" y2="11"/>
  </svg>`;

  // ── Init: run on DOMContentLoaded ──
  function init() {
    injectToggleButton();
    checkUrlHash();
    checkSessionStorage();
  }

  // ── Inject the toggle icon button into the nav ──
  function injectToggleButton() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const navTitle = nav.querySelector('.nav-title');
    if (!navTitle) return;

    const btn = document.createElement('button');
    btn.className = 'slideshow-toggle';
    btn.id = 'slideshow-toggle';
    btn.setAttribute('aria-label', 'Toggle presentation mode');
    btn.setAttribute('title', 'Toggle presentation mode');
    btn.innerHTML = ICON_SLIDES;
    btn.addEventListener('click', toggle);

    // Wrap the title and button to keep them together with a 16px buffer
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '16px';
    
    // Insert wrapper where the title was, then move title and button inside
    navTitle.parentNode.insertBefore(wrapper, navTitle);
    wrapper.appendChild(navTitle);
    wrapper.appendChild(btn);
  }

  // ── Discover slide sections ──
  function discoverSlides() {
    const body = document.body;
    const children = Array.from(body.children);
    const slideElements = [];

    children.forEach(el => {
      // Skip non-content elements
      const tag = el.tagName.toLowerCase();
      if (tag === 'nav' || tag === 'footer' || tag === 'script' || tag === 'style' || tag === 'link') return;
      if (el.classList.contains('lightbox')) return;
      if (el.classList.contains('slideshow-viewport')) return;
      if (el.classList.contains('slideshow-controls')) return;
      if (el.classList.contains('slideshow-progress')) return;
      if (el.classList.contains('slideshow-hint')) return;

      // Skip footer-nav sections
      if (el.querySelector('.footer-nav')) return;
      if (el.classList.contains('footer-nav')) return;

      // Skip footers nested in divs
      if (el.querySelector('footer')) return;

      slideElements.push(el);
    });

    return slideElements;
  }

  // ── Build the slideshow viewport ──
  function buildViewport() {
    const sourceSlides = discoverSlides();
    if (sourceSlides.length === 0) return;

    // Create viewport
    viewport = document.createElement('div');
    viewport.className = 'slideshow-viewport';

    sourceSlides.forEach((srcEl, i) => {
      const slide = document.createElement('div');
      slide.className = 'slideshow-slide';
      if (i === 0) slide.classList.add('active');
      slide.dataset.index = i;

      const frame = document.createElement('div');
      frame.className = 'slideshow-frame';

      // Clone the content with its background styling
      const clone = srcEl.cloneNode(true);

      // Removed inline background style copying.
      // Backgrounds are now handled via consistent themes in slideshow.css

      frame.appendChild(clone);
      slide.appendChild(frame);
      viewport.appendChild(slide);
    });

    slides = viewport.querySelectorAll('.slideshow-slide');
    document.body.appendChild(viewport);

    // Re-bind lightbox click handlers in cloned content
    rebindLightbox();
  }

  // ── Re-bind lightbox handlers in cloned slides ──
  function rebindLightbox() {
    if (!viewport) return;
    const thumbs = viewport.querySelectorAll('.screen-thumb[onclick]');
    thumbs.forEach(thumb => {
      const onclickStr = thumb.getAttribute('onclick');
      if (onclickStr) {
        // Extract the index from openLightbox(N)
        const match = onclickStr.match(/openLightbox\((\d+)\)/);
        if (match) {
          const index = parseInt(match[1], 10);
          thumb.removeAttribute('onclick');
          thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof window.openLightbox === 'function') {
              window.openLightbox(index);
            }
          });
        }
      }
    });
  }

  // ── Create slide controls ──
  function buildControls() {
    // Controls bar
    controlsEl = document.createElement('div');
    controlsEl.className = 'slideshow-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slideshow-arrow';
    prevBtn.id = 'slide-prev';
    prevBtn.innerHTML = '←';
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

    const counter = document.createElement('span');
    counter.className = 'slideshow-counter';
    counter.id = 'slide-counter';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slideshow-arrow';
    nextBtn.id = 'slide-next';
    nextBtn.innerHTML = '→';
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    controlsEl.appendChild(prevBtn);
    controlsEl.appendChild(counter);
    controlsEl.appendChild(nextBtn);
    document.body.appendChild(controlsEl);

    // Progress bar
    progressEl = document.createElement('div');
    progressEl.className = 'slideshow-progress';
    progressEl.innerHTML = '<div class="slideshow-progress-bar" id="slide-progress-bar"></div>';
    document.body.appendChild(progressEl);

    // Keyboard hint
    hintEl = document.createElement('div');
    hintEl.className = 'slideshow-hint';
    hintEl.textContent = '← → arrows to navigate · esc to exit';
    document.body.appendChild(hintEl);

    updateControls();
  }

  // ── Update controls state ──
  function updateControls() {
    if (!controlsEl || !slides.length) return;

    const counter = document.getElementById('slide-counter');
    if (counter) {
      counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;

    const bar = document.getElementById('slide-progress-bar');
    if (bar) {
      const pct = slides.length > 1 ? ((currentSlide + 1) / slides.length) * 100 : 100;
      bar.style.width = pct + '%';
    }

    // Update URL hash
    if (active) {
      const url = new URL(window.location);
      url.hash = `slide=${currentSlide + 1}`;
      history.replaceState(null, '', url);
    }
  }

  // ── Navigate to slide ──
  function goToSlide(n) {
    if (n < 0 || n >= slides.length) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');

    // Scroll the frame to top for the new slide
    const frame = slides[currentSlide].querySelector('.slideshow-frame');
    if (frame) frame.scrollTop = 0;

    updateControls();
  }

  // ── Toggle slideshow mode ──
  function toggle() {
    if (active) {
      deactivate();
    } else {
      activate();
    }
  }

  // ── Activate slideshow ──
  function activate() {
    active = true;
    document.body.classList.add('slideshow-active');

    const btn = document.getElementById('slideshow-toggle');
    if (btn) {
      btn.classList.add('active');
      btn.innerHTML = ICON_SCROLL;
      btn.setAttribute('title', 'Exit presentation mode');
    }

    buildViewport();
    buildControls();

    // Check for hash-specified slide
    const hash = window.location.hash;
    const match = hash.match(/slide=(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10) - 1;
      if (n >= 0 && n < slides.length) {
        goToSlide(n);
      }
    }

    // Show hint briefly
    if (hintEl) {
      requestAnimationFrame(() => {
        hintEl.classList.add('visible');
        hintTimeout = setTimeout(() => {
          hintEl.classList.remove('visible');
        }, 3000);
      });
    }

    // Auto-hide header (Dock style)
    const nav = document.querySelector('nav');
    if (nav) {
      mouseMoveHandler = (e) => {
        if (!active) return;
        // Show if cursor is in the top 80px (enough to cover the nav area)
        if (e.clientY < 80) {
          nav.classList.remove('nav-hidden');
        } else {
          nav.classList.add('nav-hidden');
        }
      };
      document.addEventListener('mousemove', mouseMoveHandler);

      // Initially hide the nav after a short delay
      hideNavTimeout = setTimeout(() => {
        if (active) nav.classList.add('nav-hidden');
      }, 1500);
    }

    sessionStorage.setItem('slideshow-mode', 'active');
  }

  // ── Deactivate slideshow ──
  function deactivate() {
    active = false;
    document.body.classList.remove('slideshow-active');

    const btn = document.getElementById('slideshow-toggle');
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = ICON_SLIDES;
      btn.setAttribute('title', 'Toggle presentation mode');
    }

    // Remove mouse listener and un-hide nav
    if (mouseMoveHandler) {
      document.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
    if (hideNavTimeout) {
      clearTimeout(hideNavTimeout);
      hideNavTimeout = null;
    }
    const nav = document.querySelector('nav');
    if (nav) nav.classList.remove('nav-hidden');

    // Remove injected elements
    if (viewport) { viewport.remove(); viewport = null; }
    if (controlsEl) { controlsEl.remove(); controlsEl = null; }
    if (progressEl) { progressEl.remove(); progressEl = null; }
    if (hintEl) { hintEl.remove(); hintEl = null; }
    if (hintTimeout) { clearTimeout(hintTimeout); hintTimeout = null; }

    slides = [];
    currentSlide = 0;

    // Clean URL hash
    const url = new URL(window.location);
    url.hash = '';
    history.replaceState(null, '', url.pathname + url.search);

    sessionStorage.removeItem('slideshow-mode');
  }

  // ── Keyboard navigation ──
  function handleKeydown(e) {
    if (!active) {
      // Allow P key to activate
      if (e.key === 'p' || e.key === 'P') {
        // Only if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        toggle();
      }
      return;
    }

    // Disable slideshow keyboard navigation if the WYSIWYG editor is active
    if (document.body.classList.contains('le-edit-mode')) {
      return;
    }

    // Check if lightbox is currently open
    // This handler fires in CAPTURE phase (before the inline lightbox handler)
    // so the lightbox 'open' class has NOT been removed yet
    const lightbox = document.getElementById('lightbox');
    const lightboxIsOpen = lightbox && lightbox.classList.contains('open');

    // If lightbox is open, let it handle its own keys — don't interfere
    if (lightboxIsOpen) {
      return; // The inline handler will close the lightbox
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        goToSlide(currentSlide + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        goToSlide(currentSlide - 1);
        break;
      case 'Escape':
        e.preventDefault();
        deactivate();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(slides.length - 1);
        break;
      case 'p':
      case 'P':
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        toggle();
        break;
    }
  }

  // ── Check URL hash on load ──
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash.match(/slide=\d+/)) {
      activate();
    }
  }

  // ── Check session storage for persistence ──
  function checkSessionStorage() {
    if (sessionStorage.getItem('slideshow-mode') === 'active' && !active) {
      activate();
    }
  }

  // ── Bind events ──
  // Use CAPTURE phase so this handler fires BEFORE the inline lightbox keydown handler
  // This ensures we can check lightbox state before it gets modified
  document.addEventListener('keydown', handleKeydown, true);

  // ── Init on DOM ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// ── Local WYSIWYG Editor Injection ──────────────────────────────
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Only inject if it hasn't been injected yet (in case main.js also ran)
  if (!document.querySelector('script[src="js/local-editor.js"]')) {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'css/local-editor.css';
    document.head.appendChild(cssLink);

    const jsScript = document.createElement('script');
    jsScript.src = 'js/local-editor.js';
    document.body.appendChild(jsScript);
  }
}
