// Shared hero headlines — single source of truth for index.html, slides.html, and slides-cnbc.html
window.heroHeadlines = [
  { lines: ['15+ years shaping', 'how people'], em: 'watch video.', jpLines: ['15年以上にわたり', '人々の映像体験を'], jpEm: '創造する。' },
  { lines: ['Designing the future', 'of how the world'], em: 'experiences media.', jpLines: ['世界がメディアを', '体験する方法の'], jpEm: '未来を描く。' },
  { lines: ['Transforming complex', 'streaming tech into'], em: 'intuitive products.', jpLines: ['複雑なストリーミング技術を', '直感的なプロダクトに'], jpEm: '変える。' },
  { lines: ['The intersection of', 'craft, product,'], em: 'and storytelling.', jpLines: ['技術、製品、そして', 'ストーリーテリングの'], jpEm: '交差点。' },
];

/* --- SPLINE BACKGROUND VARIATIONS --- */
// Randomly initialized on load, smoothly transitions every 30s
window.heroBackgroundVariations = [
  { hue: 19, sat: 1.4, bri: 2, con: 2, grainOp: 0, grainSz: 20, bgCol: '#0091ff', glassCol: '#000000', glassOp: 0.04, glassBlur: 8 },
  { hue: 210, sat: 1.1, bri: 1.05, con: 2, grainOp: 0, grainSz: 20, bgCol: '#000000', glassCol: '#3b00a8', glassOp: 0.11, glassBlur: 40 },
  { hue: 320, sat: 1.1, bri: 0.9, con: 1.1, grainOp: 0.15, grainSz: 220, bgCol: '#ffd500', glassCol: '#000000', glassOp: 0.04, glassBlur: 22 },
  { hue: 80,  sat: 0.8, bri: 1.1,  con: 1.0, grainOp: 0.25, grainSz: 140, bgCol: '#000000', glassCol: '#fafaf8', glassOp: 0, glassBlur: 0 },
  { hue: 168, sat: 0,   bri: 2,    con: 2, grainOp: 0.07, grainSz: 20,  bgCol: '#000000', glassCol: '#fafaf8', glassOp: 0, glassBlur: 0 },
  { hue: 202, sat: 2.6, bri: 1.85, con: 2, grainOp: 0.08, grainSz: 50,  bgCol: '#ff000d', glassCol: '#000000', glassOp: 0.04, glassBlur: 0 },
  { hue: 248, sat: 2.6, bri: 1.25, con: 2, grainOp: 0.21, grainSz: 240, bgCol: '#c800ff', glassCol: '#000000', glassOp: 0.19, glassBlur: 0 }
];

// Helper to convert hex to rgb string for rgba usage
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Random Background Spawning Engine & Auto-Advancer
    const viewers = document.querySelectorAll('spline-viewer');
    const grainCanvas = document.getElementById('heroGrain');
    
    let currentConfigIndex = Math.floor(Math.random() * window.heroBackgroundVariations.length);
    let activeConfig = window.heroBackgroundVariations[currentConfigIndex];
    let activeSize = activeConfig.grainSz;

    if (grainCanvas) {
        grainCanvas.style.transition = 'opacity 1s ease-in-out';
    }

    // Inject dynamic glass overlay div over each viewer
    viewers.forEach(viewer => {
        viewer.style.transition = 'filter 1s ease-in-out';
        viewer.parentElement.style.transition = 'background-color 1s ease-in-out';
        viewer.parentElement.style.backgroundColor = activeConfig.bgCol;

        const glassDiv = document.createElement('div');
        glassDiv.className = 'spline-glass-overlay';
        glassDiv.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;transition:all 1s ease-in-out;';
        viewer.parentElement.appendChild(glassDiv);
        viewer.glassOverlayRef = glassDiv; 
    });

    const applyFilters = (viewer, config) => {
        viewer.style.filter = `hue-rotate(${config.hue}deg) saturate(${config.sat}) brightness(${config.bri}) contrast(${config.con})`;
        viewer.parentElement.style.backgroundColor = config.bgCol;
        if (viewer.glassOverlayRef) {
            viewer.glassOverlayRef.style.backgroundColor = `rgba(${hexToRgb(config.glassCol)}, ${config.glassOp})`;
            viewer.glassOverlayRef.style.backdropFilter = `blur(${config.glassBlur}px)`;
            viewer.glassOverlayRef.style.webkitBackdropFilter = `blur(${config.glassBlur}px)`;
        }
        if (grainCanvas) {
            grainCanvas.style.opacity = config.grainOp;
            activeSize = parseInt(config.grainSz);
        }
    };
    
    viewers.forEach(v => applyFilters(v, activeConfig));

    // 1.2 Cursor Mask Preview Engine
    const cursorMask = document.getElementById('hero-cursor-mask');
    const cursorExpander = cursorMask ? cursorMask.querySelector('.hero-cursor-expander') : null;
    const cursorBg = document.querySelector('.hero-cursor-bg');
    const heroSection = document.querySelector('.hero');
    
    let nextConfigIndex = (currentConfigIndex + 1) % window.heroBackgroundVariations.length;
    
    const updateCursorMaskPreview = () => {
        if (!cursorBg) return;
        const nextConfig = window.heroBackgroundVariations[nextConfigIndex];
        // Create an abstract representation of the next config
        cursorBg.style.background = `linear-gradient(135deg, ${nextConfig.bgCol} 0%, rgba(${hexToRgb(nextConfig.glassCol)}, 0.8) 100%)`;
        cursorBg.style.filter = `hue-rotate(${nextConfig.hue}deg) saturate(${nextConfig.sat})`;
    };
    updateCursorMaskPreview();
    
    if (heroSection && cursorMask) {
        heroSection.addEventListener('mousemove', (e) => {
            // Only show/move mask if it's a fine pointer (mouse)
            if (window.matchMedia('(pointer: coarse)').matches) return;
            const rect = heroSection.getBoundingClientRect();
            // Position exactly at cursor
            cursorMask.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
        });
    }

    const advanceBackground = () => {
        if (window.isConfiguratorActive || window.isConfiguratorPaused) return;

        // Animate mask expansion
        if (cursorExpander && !window.matchMedia('(pointer: coarse)').matches) {
            cursorExpander.classList.add('is-expanding');
            
            // Wait for expansion to cover screen before swapping underlying background
            setTimeout(() => {
                currentConfigIndex = nextConfigIndex;
                nextConfigIndex = (currentConfigIndex + 1) % window.heroBackgroundVariations.length;
                activeConfig = window.heroBackgroundVariations[currentConfigIndex];
                
                viewers.forEach(v => applyFilters(v, activeConfig));
                updateCursorMaskPreview();
                
                if (typeof window.updateConfiguratorUI === 'function') {
                    window.updateConfiguratorUI(activeConfig);
                }
                
                // Reset mask to scale(0) instantly
                cursorExpander.style.transition = 'none'; 
                cursorExpander.classList.remove('is-expanding');
                cursorExpander.style.transform = 'scale(0)';
                
                // Force reflow
                void cursorExpander.offsetWidth;
                
                // Animate growth from cursor center
                cursorExpander.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
                cursorExpander.style.transform = ''; // clears inline style, letting CSS hover (scale(1)) take over
                
                // Clean up inline transition after animation completes
                setTimeout(() => {
                    cursorExpander.style.transition = '';
                }, 600);
            }, 400); // Trigger swap midway through 0.8s expansion
        } else {
            // Fallback for mobile or missing mask
            currentConfigIndex = nextConfigIndex;
            nextConfigIndex = (currentConfigIndex + 1) % window.heroBackgroundVariations.length;
            activeConfig = window.heroBackgroundVariations[currentConfigIndex];
            viewers.forEach(v => applyFilters(v, activeConfig));
            if (typeof window.updateConfiguratorUI === 'function') {
                window.updateConfiguratorUI(activeConfig);
            }
            updateCursorMaskPreview();
        }
    };

    // Cycle through variants every 30 seconds smoothly
    window.isConfiguratorActive = false;
    window.isConfiguratorPaused = false;
    let backgroundCycleInterval = setInterval(advanceBackground, 30000);

    const resetCycleInterval = () => {
        clearInterval(backgroundCycleInterval);
        backgroundCycleInterval = setInterval(advanceBackground, 30000);
    };

    if (heroSection) {
        heroSection.addEventListener('click', (e) => {
            // Prevent triggering if clicking on the CTA or Nav
            if (e.target.closest('.hero-cta') || e.target.closest('nav')) return;
            advanceBackground();
            resetCycleInterval();
        });
    }


    // 1.5 Dither Grain Rendering Engine
    if (grainCanvas) {
        const ctx = grainCanvas.getContext('2d');
        let currentImgSize = activeSize;
        grainCanvas.width = activeSize;
        grainCanvas.height = activeSize;
        let img = ctx.createImageData(activeSize, activeSize);
        let frame = 0;
        const SKIP = 5; 
        
        function drawGrain() {
            frame++;
            if (activeSize !== currentImgSize) {
                currentImgSize = activeSize;
                grainCanvas.width = activeSize;
                grainCanvas.height = activeSize;
                img = ctx.createImageData(activeSize, activeSize);
            }
            if (frame % SKIP === 0) {
                const d = img.data;
                for (let i = 0; i < d.length; i += 4) {
                    const v = (Math.random() * 255) | 0;
                    d[i] = d[i + 1] = d[i + 2] = v;
                    d[i + 3] = 255;
                }
                ctx.putImageData(img, 0, 0);
            }
            requestAnimationFrame(drawGrain);
        }
        drawGrain();
    }

    // 2. Aggressive Spline Logo Removal
    const removeSplineLogos = () => {
        viewers.forEach(viewer => {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (viewer.shadowRoot) {
                    const logo = viewer.shadowRoot.querySelector('#logo');
                    if (logo) {
                        logo.remove();
                        clearInterval(interval);
                        return;
                    }
                }
                if (attempts > 100) clearInterval(interval);
            }, 100);
        });
    };
    removeSplineLogos();
    setTimeout(removeSplineLogos, 2000);

    // 3. Spline Scroll-Jacking & Rendering FPS Optimizer
    const passThroughScroll = (e) => { e.stopPropagation(); };
    let scrollTimeout;
    viewers.forEach(viewer => {
        viewer.addEventListener('wheel', passThroughScroll, { capture: true, passive: true });
        viewer.addEventListener('touchstart', passThroughScroll, { capture: true, passive: true });
        viewer.addEventListener('touchmove', passThroughScroll, { capture: true, passive: true });
        window.addEventListener('scroll', () => {
            if (!viewer.classList.contains('is-scrolling')) {
                viewer.style.pointerEvents = 'none';
                viewer.classList.add('is-scrolling');
            }
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                viewer.style.pointerEvents = 'auto';
                viewer.classList.remove('is-scrolling');
            }, 100);
        }, { passive: true });
    });

    // 3.8 Subtle Magnetic Text Effect (25% strength of CTA)
    const attachMagneticEffect = () => {
        // Target all relevant text containers in the hero sections across different files
        const nodes = document.querySelectorAll('.hero-label, .hero h1, .hero-sub, .hero-stat, #heroH1, #heroLabel, .hero-grid > div:last-child > div');
        const magneticTargets = Array.from(nodes).filter(el => !el.classList.contains('hero-cta') && !el.closest('.hero-cta'));
        
        magneticTargets.forEach(el => {
            let rafId = null;
            el.addEventListener('mousemove', function(e) {
                if (window.matchMedia('(pointer: coarse)').matches) return;
                if (rafId) cancelAnimationFrame(rafId);
                
                rafId = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left; 
                    const y = e.clientY - rect.top; 
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const deltaX = x - centerX;
                    const deltaY = y - centerY;
                    
                    // Scaled down to 25% of the original CTA effect
                    const rotateX = (deltaY / centerY) * -3.75; 
                    const rotateY = (deltaX / centerX) * 3.75;
                    const translateX = deltaX * 0.0625;
                    const translateY = deltaY * 0.0625;

                    el.style.transform = `perspective(1000px) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    el.style.transition = 'transform 0.1s ease-out';
                });
            });

            el.addEventListener('mouseleave', function() {
                if (rafId) cancelAnimationFrame(rafId);
                requestAnimationFrame(() => {
                    el.style.transform = 'perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
                    el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
                });
            });
        });
    };
    setTimeout(attachMagneticEffect, 800);

    // 3.5 Device Accelerometer Spline Tracking (Mobile Responsiveness)
    if (window.DeviceOrientationEvent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const viewerContainer = document.querySelector('.hero-video-bg');
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let ticking = false;

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const updateParallax = () => {
            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);

            if (viewerContainer) {
                // Scale slightly to create a bleed area, then translate via hardware acceleration
                viewerContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.05)`;
            }

            if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
                requestAnimationFrame(updateParallax);
            } else {
                ticking = false;
            }
        };

        window.addEventListener('deviceorientation', (e) => {
            if (!e.gamma && !e.beta) return;
            
            // Constrain tilt angles
            let gamma = e.gamma;
            if (gamma < -30) gamma = -30;
            if (gamma > 30) gamma = 30;
            
            let beta = e.beta;
            let betaOffset = beta - 45; // center on typical holding angle
            if (betaOffset < -30) betaOffset = -30;
            if (betaOffset > 30) betaOffset = 30;

            // Map angles to a max physical displacement of 15 pixels
            targetX = (gamma / 30) * 15;
            targetY = (betaOffset / 30) * 15;
            
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateParallax);
            }
        }, { passive: true });
    }

    // 4. Developer Configurator Overlay (Only loads on localhost)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
        const ui = document.createElement('div');
        ui.className = 'shadcn-panel';
        ui.innerHTML = `
            <style>
                .shadcn-panel {
                    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                    background: rgba(9, 9, 11, 0.95); backdrop-filter: blur(12px);
                    border: 1px solid #27272a; border-radius: 6px;
                    padding: 8px; width: 140px; color: #fafafa; font-family: 'Inter', sans-serif;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    max-height: 90vh; overflow-y: auto;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    opacity: 1; transform: translateY(0);
                }
                .shadcn-panel * { box-sizing: border-box; }
                .shadcn-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .shadcn-title { font-size: 11px; font-weight: 600; margin: 0; letter-spacing: -0.02em; }
                .shadcn-controls { display: flex; align-items: center; gap: 4px; }
                .shadcn-badge {
                    font-size: 8px; background: #27272a; color: #a1a1aa; padding: 1px 4px;
                    border-radius: 9999px; cursor: pointer; user-select: none; transition: all 0.2s; font-weight: 500;
                }
                .shadcn-badge.active { background: #fafafa; color: #09090b; }
                .shadcn-badge.paused { background: #f59e0b33; color: #f59e0b; }
                .shadcn-close { cursor: pointer; color: #a1a1aa; font-size: 12px; line-height: 1; transition: color 0.2s; }
                .shadcn-close:hover { color: #fafafa; }
                
                .shadcn-label { display: flex; justify-content: space-between; align-items: center; font-size: 9px; font-weight: 500; margin-bottom: 4px; }
                .shadcn-value { color: #a1a1aa; font-weight: 400; font-variant-numeric: tabular-nums; }
                
                .shadcn-range { -webkit-appearance: none; width: 100%; height: 3px; background: #27272a; border-radius: 9999px; outline: none; margin-bottom: 8px; cursor: pointer; }
                .shadcn-range::-webkit-slider-thumb {
                    -webkit-appearance: none; width: 10px; height: 10px; border-radius: 50%;
                    background: #fafafa; cursor: grab; border: 1px solid #09090b; box-shadow: 0 0 0 1px #fafafa; transition: transform 0.1s;
                }
                .shadcn-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }
                
                .shadcn-color-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
                .shadcn-color { -webkit-appearance: none; width: 16px; height: 16px; border: 1px solid #27272a; border-radius: 4px; padding: 0; background: none; cursor: pointer; overflow: hidden; }
                .shadcn-color::-webkit-color-swatch-wrapper { padding: 0; }
                .shadcn-color::-webkit-color-swatch { border: none; border-radius: 3px; }
                
                .shadcn-separator { height: 1px; background: #27272a; margin: 8px -8px; }
                .shadcn-group-title { font-size: 10px; font-weight: 600; margin: 0 0 6px 0; letter-spacing: -0.01em; }
            </style>

            <div class="shadcn-header">
                <h3 class="shadcn-title">Hero BG</h3>
                <div class="shadcn-controls">
                    <span class="shadcn-badge active" id="autoStatus">Auto 30s</span>
                    <span class="shadcn-close" onclick="this.closest('.shadcn-panel').style.display='none'">&times;</span>
                </div>
            </div>
            
            <div>
                <label class="shadcn-label">Hue <span class="shadcn-value" id="valHue">${activeConfig.hue}&deg;</span></label>
                <input type="range" class="shadcn-range" id="slHue" min="0" max="360" value="${activeConfig.hue}">
            </div>
            <div>
                <label class="shadcn-label">Saturate <span class="shadcn-value" id="valSat">${activeConfig.sat}</span></label>
                <input type="range" class="shadcn-range" id="slSat" min="0" max="3" step="0.1" value="${activeConfig.sat}">
            </div>
            <div>
                <label class="shadcn-label">Brightness <span class="shadcn-value" id="valBri">${activeConfig.bri}</span></label>
                <input type="range" class="shadcn-range" id="slBri" min="0.1" max="2" step="0.05" value="${activeConfig.bri}">
            </div>
            <div>
                <label class="shadcn-label">Contrast <span class="shadcn-value" id="valCon">${activeConfig.con}</span></label>
                <input type="range" class="shadcn-range" id="slCon" min="0.1" max="2" step="0.05" value="${activeConfig.con}" style="margin-bottom:0;">
            </div>
            
            <div class="shadcn-separator"></div>
            <h4 class="shadcn-group-title">Environment & glass</h4>
            
            <div class="shadcn-color-row">
                <label class="shadcn-label" style="margin-bottom:0;">Base color</label>
                <input type="color" class="shadcn-color" id="inBgCol" value="${activeConfig.bgCol}">
            </div>
            <div class="shadcn-color-row" style="margin-bottom:16px;">
                <label class="shadcn-label" style="margin-bottom:0;">Glass color</label>
                <input type="color" class="shadcn-color" id="inGlCol" value="${activeConfig.glassCol}">
            </div>
            <div>
                <label class="shadcn-label">Glass opacity <span class="shadcn-value" id="valGlOp">${activeConfig.glassOp}</span></label>
                <input type="range" class="shadcn-range" id="slGlOp" min="0" max="1" step="0.01" value="${activeConfig.glassOp}">
            </div>
            <div>
                <label class="shadcn-label">Glass blur (px) <span class="shadcn-value" id="valGlBl">${activeConfig.glassBlur}</span></label>
                <input type="range" class="shadcn-range" id="slGlBl" min="0" max="40" step="1" value="${activeConfig.glassBlur}" style="margin-bottom:0;">
            </div>

            <div class="shadcn-separator"></div>
            
            <div>
                <label class="shadcn-label">Grain opacity <span class="shadcn-value" id="valGrOp">${activeConfig.grainOp}</span></label>
                <input type="range" class="shadcn-range" id="slGrOp" min="0" max="1" step="0.01" value="${activeConfig.grainOp}">
            </div>
            <div>
                <label class="shadcn-label">Grain scale (px) <span class="shadcn-value" id="valGrSz">${activeConfig.grainSz}</span></label>
                <input type="range" class="shadcn-range" id="slGrSz" min="20" max="400" step="10" value="${activeConfig.grainSz}">
            </div>
        `;
        document.body.appendChild(ui);

        window.updateConfiguratorUI = (config) => {
            document.getElementById('slHue').value = config.hue;
            document.getElementById('slSat').value = config.sat;
            document.getElementById('slBri').value = config.bri;
            document.getElementById('slCon').value = config.con;
            document.getElementById('slGrOp').value = config.grainOp;
            document.getElementById('slGrSz').value = config.grainSz;
            document.getElementById('inBgCol').value = config.bgCol;
            document.getElementById('inGlCol').value = config.glassCol;
            document.getElementById('slGlOp').value = config.glassOp;
            document.getElementById('slGlBl').value = config.glassBlur;
            
            document.getElementById('valHue').innerText = config.hue;
            document.getElementById('valSat').innerText = config.sat;
            document.getElementById('valBri').innerText = config.bri;
            document.getElementById('valCon').innerText = config.con;
            document.getElementById('valGrOp').innerText = config.grainOp;
            document.getElementById('valGrSz').innerText = config.grainSz;
            document.getElementById('valGlOp').innerText = config.glassOp;
            document.getElementById('valGlBl').innerText = config.glassBlur;
        };

        const updateFiltersFromUI = () => {
            const h = document.getElementById('slHue').value;
            const s = document.getElementById('slSat').value;
            const b = document.getElementById('slBri').value;
            const c = document.getElementById('slCon').value;
            const go = document.getElementById('slGrOp').value;
            const gs = document.getElementById('slGrSz').value;
            
            const bgC = document.getElementById('inBgCol').value;
            const glC = document.getElementById('inGlCol').value;
            const glo = document.getElementById('slGlOp').value;
            const glb = document.getElementById('slGlBl').value;
            
            // Re-render UI readouts
            window.updateConfiguratorUI({
                hue: h, sat: s, bri: b, con: c, grainOp: go, grainSz: gs,
                bgCol: bgC, glassCol: glC, glassOp: glo, glassBlur: glb
            });
            
            viewers.forEach(v => applyFilters(v, {
                hue: h, sat: s, bri: b, con: c, grainOp: go, grainSz: gs,
                bgCol: bgC, glassCol: glC, glassOp: glo, glassBlur: glb
            }));
        };

        const autoStatus = document.getElementById('autoStatus');
        autoStatus.addEventListener('click', () => {
            window.isConfiguratorPaused = !window.isConfiguratorPaused;
            if (window.isConfiguratorPaused) {
                autoStatus.innerText = 'Paused';
                autoStatus.className = 'shadcn-badge paused';
            } else {
                autoStatus.innerText = 'Auto 30s';
                autoStatus.className = 'shadcn-badge active';
            }
        });

        const inputs = ['slHue', 'slSat', 'slBri', 'slCon', 'slGrOp', 'slGrSz', 'slGlOp', 'slGlBl', 'inBgCol', 'inGlCol'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                window.isConfiguratorActive = true;
                if (!window.isConfiguratorPaused) {
                    autoStatus.innerText = 'Interacting';
                    autoStatus.className = 'shadcn-badge';
                }
                updateFiltersFromUI();
            });
        });
        
        // Resume rotation when mouse leaves the UI completely unless forcefully paused
        ui.addEventListener('mouseenter', () => window.isConfiguratorActive = true);
        ui.addEventListener('mouseleave', () => {
            window.isConfiguratorActive = false;
            if (!window.isConfiguratorPaused) {
                autoStatus.innerText = 'Auto 30s';
                autoStatus.className = 'shadcn-badge active';
            }
        });

        // Auto-hide panel when hero section is not visible
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    ui.style.opacity = '0';
                    ui.style.pointerEvents = 'none';
                    ui.style.transform = 'translateY(10px)';
                } else {
                    ui.style.opacity = '1';
                    ui.style.pointerEvents = 'auto';
                    ui.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0 }); // 0 means when completely out of view
        
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }

    // 3.6 Mobile Video Fallback (Strictly physical mobile devices)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobileDevice) {
        document.body.classList.add('is-mobile-device');
    }

    const initMobileVideoFallback = () => {
        if (isMobileDevice) {
            const videoIds = ['Jox6R5-rIH0', 'TBsBq7298JU', '9vntypeV5QU', 'eI2PcZPZYKY'];
            const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];
            
            // Define API callback before injecting the script
            window.onYouTubeIframeAPIReady = function() {
                let fallbackTimeout;
                const player = new YT.Player('heroYoutube', {
                    videoId: randomVideoId,
                    playerVars: {
                        'autoplay': 1,
                        'mute': 1,
                        'loop': 1,
                        'controls': 0,
                        'playsinline': 1,
                        'disablekb': 1,
                        'rel': 0,
                        'showinfo': 0,
                        'modestbranding': 1,
                        'playlist': randomVideoId,
                        'enablejsapi': 1
                    },
                    events: {
                        'onReady': function(event) {
                            // Explicitly mute and play to bypass strict mobile autoplay policies
                            event.target.mute();
                            event.target.playVideo();
                            
                            // Safety fallback: if video is stuck buffering, reveal it anyway after 3s
                            fallbackTimeout = setTimeout(() => {
                                const ytEl = document.getElementById('heroYoutube');
                                if (ytEl) ytEl.classList.add('is-playing');
                            }, 3000);
                        },
                        'onStateChange': function(event) {
                            if (event.data === YT.PlayerState.PLAYING) {
                                clearTimeout(fallbackTimeout);
                                const ytEl = document.getElementById('heroYoutube');
                                if (ytEl) ytEl.classList.add('is-playing');
                            }
                        }
                    }
                });
            };

            // Load YouTube IFrame API
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    };
    initMobileVideoFallback();
});
