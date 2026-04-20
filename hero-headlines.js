// Shared hero headlines — single source of truth for index.html, slides.html, and slides-cnbc.html
window.heroHeadlines = [
  { lines: ['15+ years shaping', 'how people'], em: 'watch video.', jpLines: ['15年以上にわたり', '人々の映像体験を'], jpEm: '創造する。' },
  { lines: ['Designing the future', 'of how the world'], em: 'experiences media.', jpLines: ['世界がメディアを', '体験する方法の'], jpEm: '未来を描く。' },
  { lines: ['Transforming complex', 'streaming tech into'], em: 'intuitive products.', jpLines: ['複雑なストリーミング技術を', '直感的なプロダクトに'], jpEm: '変える。' },
  { lines: ['The intersection of', 'craft, product,'], em: 'and storytelling.', jpLines: ['技術、製品、そして', 'ストーリーテリングの'], jpEm: '交差点。' },
];

/* --- SPLINE BACKGROUND VARIATIONS --- */
window.heroBackgroundVariations = [
  { hue: 19, sat: 1.4, bri: 2, con: 2, grainOp: 0, grainSz: 20, bgCol: '#0091ff', glassCol: '#000000', glassOp: 0.04, glassBlur: 8 },
  { hue: 210, sat: 1.1, bri: 1.05, con: 2, grainOp: 0, grainSz: 20, bgCol: '#000000', glassCol: '#3b00a8', glassOp: 0.11, glassBlur: 40 },
  { hue: 320, sat: 1.1, bri: 0.9, con: 1.1, grainOp: 0.15, grainSz: 220, bgCol: '#ffd500', glassCol: '#000000', glassOp: 0.04, glassBlur: 22 },
  { hue: 80,  sat: 0.8, bri: 1.1,  con: 1.0, grainOp: 0.25, grainSz: 140, bgCol: '#000000', glassCol: '#fafaf8', glassOp: 0, glassBlur: 0 },
  { hue: 168, sat: 0,   bri: 2,    con: 2, grainOp: 0.07, grainSz: 20,  bgCol: '#000000', glassCol: '#fafaf8', glassOp: 0, glassBlur: 0 }
];

// Helper to convert hex to rgb string for rgba usage
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '250, 250, 248';
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Random Background Spawning Engine
    const viewers = document.querySelectorAll('spline-viewer');
    const grainCanvas = document.getElementById('heroGrain');
    const randomConfig = window.heroBackgroundVariations[Math.floor(Math.random() * window.heroBackgroundVariations.length)];
    
    let activeSize = randomConfig.grainSz;

    // Inject dynamic glass overlay div over each viewer
    viewers.forEach(viewer => {
        viewer.parentElement.style.backgroundColor = randomConfig.bgCol; // Apply bg color defaults to parent

        const glassDiv = document.createElement('div');
        glassDiv.className = 'spline-glass-overlay';
        glassDiv.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
        viewer.parentElement.appendChild(glassDiv);
        viewer.glassOverlayRef = glassDiv; // save reference for configurator
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
    
    viewers.forEach(v => applyFilters(v, randomConfig));

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

    // 4. Developer Configurator Overlay (Only loads on localhost)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
        const ui = document.createElement('div');
        ui.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
            padding: 20px; width: 330px; color: #fff; font-family: 'Inter', sans-serif;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5); font-size: 13px;
            max-height: 90vh; overflow-y: auto;
        `;
        ui.innerHTML = `
            <h3 style="margin:0 0 15px;font-size:16px;color:#38bdf8;">Spline Configurator</h3>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;">Hue <span id="valHue">${randomConfig.hue}</span>deg</label>
                <input type="range" id="slHue" min="0" max="360" value="${randomConfig.hue}" style="width:100%;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;">Saturate <span id="valSat">${randomConfig.sat}</span></label>
                <input type="range" id="slSat" min="0" max="3" step="0.1" value="${randomConfig.sat}" style="width:100%;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;">Brightness <span id="valBri">${randomConfig.bri}</span></label>
                <input type="range" id="slBri" min="0.1" max="2" step="0.05" value="${randomConfig.bri}" style="width:100%;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;">Contrast <span id="valCon">${randomConfig.con}</span></label>
                <input type="range" id="slCon" min="0.1" max="2" step="0.05" value="${randomConfig.con}" style="width:100%;">
            </div>
            
            <div style="height:1px;background:rgba(255,255,255,0.1);margin:15px 0;"></div>
            <h4 style="margin:0 0 10px;font-size:14px;color:#cbd5e1;">Environment & Glass</h4>
            
            <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <label style="color:#cbd5e1;">Base Color</label>
                <input type="color" id="inBgCol" value="${randomConfig.bgCol}" style="cursor:pointer;border:none;background:none;height:24px;width:24px;padding:0;">
            </div>
            <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <label style="color:#cbd5e1;">Glass Color</label>
                <input type="color" id="inGlCol" value="${randomConfig.glassCol}" style="cursor:pointer;border:none;background:none;height:24px;width:24px;padding:0;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;color:#cbd5e1;">Glass Opacity <span id="valGlOp">${randomConfig.glassOp}</span></label>
                <input type="range" id="slGlOp" min="0" max="1" step="0.01" value="${randomConfig.glassOp}" style="width:100%;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;color:#cbd5e1;">Glass Blur (px) <span id="valGlBl">${randomConfig.glassBlur}</span></label>
                <input type="range" id="slGlBl" min="0" max="40" step="1" value="${randomConfig.glassBlur}" style="width:100%;">
            </div>

            <div style="height:1px;background:rgba(255,255,255,0.1);margin:15px 0;"></div>
            
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;color:#cbd5e1;">Grain Opacity <span id="valGrOp">${randomConfig.grainOp}</span></label>
                <input type="range" id="slGrOp" min="0" max="1" step="0.01" value="${randomConfig.grainOp}" style="width:100%;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:4px;color:#cbd5e1;">Grain Scale (px) <span id="valGrSz">${randomConfig.grainSz}</span></label>
                <input type="range" id="slGrSz" min="20" max="400" step="10" value="${randomConfig.grainSz}" style="width:100%;">
            </div>
            <div style="background:#0b1120;padding:10px;border-radius:6px;font-family:monospace;font-size:11px;color:#a5b4fc;word-break:break-all;" id="outCode">
                { hue: ${randomConfig.hue}, sat: ${randomConfig.sat}, bri: ${randomConfig.bri}, con: ${randomConfig.con}, grainOp: ${randomConfig.grainOp}, grainSz: ${randomConfig.grainSz}, bgCol: '${randomConfig.bgCol}', glassCol: '${randomConfig.glassCol}', glassOp: ${randomConfig.glassOp}, glassBlur: ${randomConfig.glassBlur} }
            </div>
            <button onclick="this.parentElement.style.display='none'" style="margin-top:10px;width:100%;padding:8px;background:#334155;color:#fff;border:none;border-radius:6px;cursor:pointer;">Hide Panel</button>
        `;
        document.body.appendChild(ui);

        const updateFilters = () => {
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
            
            document.getElementById('valHue').innerText = h;
            document.getElementById('valSat').innerText = s;
            document.getElementById('valBri').innerText = b;
            document.getElementById('valCon').innerText = c;
            document.getElementById('valGrOp').innerText = go;
            document.getElementById('valGrSz').innerText = gs;
            
            document.getElementById('valGlOp').innerText = glo;
            document.getElementById('valGlBl').innerText = glb;
            
            document.getElementById('outCode').innerText = `{ hue: ${h}, sat: ${s}, bri: ${b}, con: ${c}, grainOp: ${go}, grainSz: ${gs}, bgCol: '${bgC}', glassCol: '${glC}', glassOp: ${glo}, glassBlur: ${glb} }`;
            
            viewers.forEach(v => applyFilters(v, {
                hue: h, sat: s, bri: b, con: c, grainOp: go, grainSz: gs,
                bgCol: bgC, glassCol: glC, glassOp: glo, glassBlur: glb
            }));
        };

        ['slHue', 'slSat', 'slBri', 'slCon', 'slGrOp', 'slGrSz', 'slGlOp', 'slGlBl', 'inBgCol', 'inGlCol'].forEach(id => {
            document.getElementById(id).addEventListener('input', updateFilters);
        });
    }
});
