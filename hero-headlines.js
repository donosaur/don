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
  { hue: 168, sat: 0,   bri: 2,    con: 2, grainOp: 0.07, grainSz: 20,  bgCol: '#000000', glassCol: '#fafaf8', glassOp: 0, glassBlur: 0 }
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

    // Cycle through variants every 30 seconds smoothly
    window.isConfiguratorActive = false;
    window.isConfiguratorPaused = false;
    setInterval(() => {
        if (window.isConfiguratorActive || window.isConfiguratorPaused) return; // Don't interrupt while tweaking

        currentConfigIndex = (currentConfigIndex + 1) % window.heroBackgroundVariations.length;
        activeConfig = window.heroBackgroundVariations[currentConfigIndex];
        
        viewers.forEach(v => applyFilters(v, activeConfig));
        
        // Push exact values to the local Dev UI if it exists
        if (typeof window.updateConfiguratorUI === 'function') {
            window.updateConfiguratorUI(activeConfig);
        }
    }, 30000);


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
        ui.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
            padding: 12px; width: 220px; color: #fff; font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-size: 11px;
            max-height: 90vh; overflow-y: auto;
        `;
        ui.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 10px;">
                <h3 style="margin:0;font-size:13px;color:#38bdf8;">Spline Configurator</h3>
                <span style="font-size:9px;background:#38bdf822;color:#38bdf8;padding:2px 6px;border-radius:4px;display:inline-block;cursor:pointer;user-select:none;transition:all 0.2s;" id="autoStatus">Auto 30s</span>
            </div>
            
            <div style="margin-bottom:6px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;">Hue <span id="valHue">${activeConfig.hue}</span>deg</label>
                <input type="range" id="slHue" min="0" max="360" value="${activeConfig.hue}" style="width:100%;">
            </div>
            <div style="margin-bottom:6px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;">Saturate <span id="valSat">${activeConfig.sat}</span></label>
                <input type="range" id="slSat" min="0" max="3" step="0.1" value="${activeConfig.sat}" style="width:100%;">
            </div>
            <div style="margin-bottom:6px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;">Brightness <span id="valBri">${activeConfig.bri}</span></label>
                <input type="range" id="slBri" min="0.1" max="2" step="0.05" value="${activeConfig.bri}" style="width:100%;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;">Contrast <span id="valCon">${activeConfig.con}</span></label>
                <input type="range" id="slCon" min="0.1" max="2" step="0.05" value="${activeConfig.con}" style="width:100%;">
            </div>
            
            <div style="height:1px;background:rgba(255,255,255,0.1);margin:10px 0;"></div>
            <h4 style="margin:0 0 6px;font-size:11px;color:#cbd5e1;">Environment & Glass</h4>
            
            <div style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                <label style="color:#cbd5e1;">Base Color</label>
                <input type="color" id="inBgCol" value="${activeConfig.bgCol}" style="cursor:pointer;border:none;background:none;height:18px;width:18px;padding:0;">
            </div>
            <div style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
                <label style="color:#cbd5e1;">Glass Color</label>
                <input type="color" id="inGlCol" value="${activeConfig.glassCol}" style="cursor:pointer;border:none;background:none;height:18px;width:18px;padding:0;">
            </div>
            <div style="margin-bottom:6px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;color:#cbd5e1;">Glass Opacity <span id="valGlOp">${activeConfig.glassOp}</span></label>
                <input type="range" id="slGlOp" min="0" max="1" step="0.01" value="${activeConfig.glassOp}" style="width:100%;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;color:#cbd5e1;">Glass Blur (px) <span id="valGlBl">${activeConfig.glassBlur}</span></label>
                <input type="range" id="slGlBl" min="0" max="40" step="1" value="${activeConfig.glassBlur}" style="width:100%;">
            </div>

            <div style="height:1px;background:rgba(255,255,255,0.1);margin:10px 0;"></div>
            
            <div style="margin-bottom:6px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;color:#cbd5e1;">Grain Opacity <span id="valGrOp">${activeConfig.grainOp}</span></label>
                <input type="range" id="slGrOp" min="0" max="1" step="0.01" value="${activeConfig.grainOp}" style="width:100%;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="display:flex;justify-content:space-between;margin-bottom:2px;color:#cbd5e1;">Grain Scale (px) <span id="valGrSz">${activeConfig.grainSz}</span></label>
                <input type="range" id="slGrSz" min="20" max="400" step="10" value="${activeConfig.grainSz}" style="width:100%;">
            </div>
            <div style="background:#0b1120;padding:6px;border-radius:4px;font-family:monospace;font-size:9px;color:#a5b4fc;word-break:break-all;" id="outCode">
                { hue: ${activeConfig.hue}, sat: ${activeConfig.sat}, bri: ${activeConfig.bri}, con: ${activeConfig.con}, grainOp: ${activeConfig.grainOp}, grainSz: ${activeConfig.grainSz}, bgCol: '${activeConfig.bgCol}', glassCol: '${activeConfig.glassCol}', glassOp: ${activeConfig.glassOp}, glassBlur: ${activeConfig.glassBlur} }
            </div>
            <button onclick="this.parentElement.style.display='none'" style="margin-top:8px;width:100%;padding:6px;background:#334155;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:10px;">Hide Panel</button>
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
            
            document.getElementById('outCode').innerText = `{ hue: ${config.hue}, sat: ${config.sat}, bri: ${config.bri}, con: ${config.con}, grainOp: ${config.grainOp}, grainSz: ${config.grainSz}, bgCol: '${config.bgCol}', glassCol: '${config.glassCol}', glassOp: ${config.glassOp}, glassBlur: ${config.glassBlur} }`;
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
                autoStatus.style.color = '#fbbf24';
                autoStatus.style.backgroundColor = '#fbbf2422';
            } else {
                autoStatus.innerText = 'Auto 30s';
                autoStatus.style.color = '#38bdf8';
                autoStatus.style.backgroundColor = '#38bdf822';
            }
        });

        const inputs = ['slHue', 'slSat', 'slBri', 'slCon', 'slGrOp', 'slGrSz', 'slGlOp', 'slGlBl', 'inBgCol', 'inGlCol'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                window.isConfiguratorActive = true;
                if (!window.isConfiguratorPaused) {
                    autoStatus.innerText = 'Interacting';
                    autoStatus.style.color = '#94a3b8';
                    autoStatus.style.backgroundColor = '#94a3b822';
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
                autoStatus.style.color = '#38bdf8';
                autoStatus.style.backgroundColor = '#38bdf822';
            }
        });
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
