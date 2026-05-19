/**
 * Local WYSIWYG Editor
 * Injected only on localhost to visually tweak CSS layout and sizing.
 */

(function() {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;

  let editModeActive = false;
  let selectedElement = null;
  let hoveredElement = null;

  // Create UI
  const panel = document.createElement('div');
  panel.id = 'local-editor-panel';
  panel.classList.add('minimized');
  panel.innerHTML = `
    <div id="local-editor-header">
      <div id="local-editor-title">Layout Editor <span id="le-status">(Off)</span></div>
      <button id="local-editor-minimize">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    </div>
    <div id="local-editor-body">
      <button id="le-toggle-btn" class="le-btn" style="margin-bottom: 20px; width: 100%;">Enable Edit Mode</button>
      
      <div id="le-editor-controls" style="display: none;">
        <div id="le-target-info">No element selected</div>
        
        <div class="le-control-group">
          <label>Margin</label>
          <div class="le-input-row">
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="marginTop"><span>T</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="marginRight"><span>R</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="marginBottom"><span>B</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="marginLeft"><span>L</span></div>
          </div>
        </div>

        <div class="le-control-group">
          <label>Padding</label>
          <div class="le-input-row">
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="paddingTop"><span>T</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="paddingRight"><span>R</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="paddingBottom"><span>B</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="paddingLeft"><span>L</span></div>
          </div>
        </div>

        <div class="le-control-group">
          <label>Sizing</label>
          <div class="le-input-row">
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="width" placeholder="auto"><span>W</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="height" placeholder="auto"><span>H</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="maxWidth" placeholder="none"><span>Max W</span></div>
          </div>
        </div>

        <div class="le-control-group">
          <label>Layout</label>
          <div class="le-input-row">
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="gap" placeholder="0px"><span>Gap</span></div>
            <div class="le-input-wrap"><input type="text" class="le-input" data-prop="fontSize" placeholder="inherit"><span>Font</span></div>
          </div>
        </div>

        <div id="local-editor-actions">
          <button id="le-copy-btn" class="le-btn primary">Copy CSS</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const toggleBtn = document.getElementById('le-toggle-btn');
  const controls = document.getElementById('le-editor-controls');
  const status = document.getElementById('le-status');
  const minimizeBtn = document.getElementById('local-editor-minimize');
  const targetInfo = document.getElementById('le-target-info');
  const inputs = document.querySelectorAll('.le-input');
  const copyBtn = document.getElementById('le-copy-btn');

  // Minimize logic
  minimizeBtn.addEventListener('click', () => {
    const isMin = panel.classList.contains('minimized');
    if (isMin) {
      panel.classList.remove('minimized');
      minimizeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
    } else {
      panel.classList.add('minimized');
      minimizeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    }
  });

  // Toggle Edit Mode
  toggleBtn.addEventListener('click', () => {
    editModeActive = !editModeActive;
    if (editModeActive) {
      document.body.classList.add('le-edit-mode');
      toggleBtn.textContent = 'Disable Edit Mode';
      toggleBtn.style.background = 'rgba(255,0,0,0.2)';
      toggleBtn.style.borderColor = 'rgba(255,0,0,0.3)';
      status.textContent = '(On)';
      controls.style.display = 'block';
    } else {
      document.body.classList.remove('le-edit-mode');
      toggleBtn.textContent = 'Enable Edit Mode';
      toggleBtn.style.background = '';
      toggleBtn.style.borderColor = '';
      status.textContent = '(Off)';
      controls.style.display = 'none';
      clearSelection();
    }
  });

  // Hover Outline
  document.addEventListener('mouseover', (e) => {
    if (!editModeActive) return;
    if (panel.contains(e.target)) return;
    if (hoveredElement && hoveredElement !== selectedElement) {
      hoveredElement.classList.remove('le-hover-target');
    }
    hoveredElement = e.target;
    if (hoveredElement !== selectedElement) {
      hoveredElement.classList.add('le-hover-target');
    }
  });

  // Select Element
  document.addEventListener('click', (e) => {
    if (!editModeActive) return;
    if (panel.contains(e.target)) return;
    
    e.preventDefault();
    e.stopPropagation();

    if (selectedElement) selectedElement.classList.remove('le-selected-target');
    if (hoveredElement) hoveredElement.classList.remove('le-hover-target');
    
    selectedElement = e.target;
    selectedElement.classList.add('le-selected-target');
    
    populatePanel(selectedElement);
  }, true);

  function clearSelection() {
    if (selectedElement) selectedElement.classList.remove('le-selected-target');
    if (hoveredElement) hoveredElement.classList.remove('le-hover-target');
    selectedElement = null;
    hoveredElement = null;
  }

  function populatePanel(el) {
    let selector = el.tagName.toLowerCase();
    if (el.id) selector += '#' + el.id;
    if (el.className) {
      const classes = Array.from(el.classList).filter(c => !c.startsWith('le-')).join('.');
      if (classes) selector += '.' + classes;
    }
    targetInfo.textContent = selector;

    const computed = window.getComputedStyle(el);
    inputs.forEach(input => {
      const prop = input.getAttribute('data-prop');
      // Show inline style if it exists, otherwise show computed
      input.value = el.style[prop] || computed[prop] || '';
    });
  }

  const modifiedElements = new Map();

  // Live Update from Panel
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      if (!selectedElement) return;
      const prop = e.target.getAttribute('data-prop');
      selectedElement.style[prop] = e.target.value;
      
      // Track modification
      if (!modifiedElements.has(selectedElement)) {
        modifiedElements.set(selectedElement, new Set());
      }
      modifiedElements.get(selectedElement).add(prop);
    });
  });

  // Export All Modified CSS
  copyBtn.addEventListener('click', () => {
    if (modifiedElements.size === 0) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'No changes to copy';
      setTimeout(() => copyBtn.textContent = originalText, 1500);
      return;
    }

    const allStyles = [];
    
    modifiedElements.forEach((propsSet, el) => {
      let selector = el.tagName.toLowerCase();
      if (el.id) selector += '#' + el.id;
      if (el.className) {
        const classes = Array.from(el.classList).filter(c => !c.startsWith('le-')).join('.');
        if (classes) selector += '.' + classes;
      }

      const styles = [];
      propsSet.forEach(prop => {
        if (el.style[prop]) {
          const kebab = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
          styles.push(`  ${kebab}: ${el.style[prop]};`);
        }
      });
      
      if (styles.length > 0) {
        allStyles.push(`/* Custom styles for ${selector} */\n${selector} {\n${styles.join('\n')}\n}`);
      }
    });

    const cssText = allStyles.join('\n\n');
    navigator.clipboard.writeText(cssText).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied All CSS!';
      setTimeout(() => copyBtn.textContent = originalText, 1500);
    });
  });

})();
