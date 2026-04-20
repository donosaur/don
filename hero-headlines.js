// Shared hero headlines — single source of truth for index.html, slides.html, and slides-cnbc.html
window.heroHeadlines = [
  { lines: ['15+ years shaping', 'how people'], em: 'watch video.', jpLines: ['15年以上にわたり', '人々の映像体験を'], jpEm: '創造する。' },
  { lines: ['Designing the future', 'of how the world'], em: 'experiences media.', jpLines: ['世界がメディアを', '体験する方法の'], jpEm: '未来を描く。' },
  { lines: ['Transforming complex', 'streaming tech into'], em: 'intuitive products.', jpLines: ['複雑なストリーミング技術を', '直感的なプロダクトに'], jpEm: '変える。' },
  { lines: ['The intersection of', 'craft, product,'], em: 'and storytelling.', jpLines: ['技術、製品、そして', 'ストーリーテリングの'], jpEm: '交差点。' },
];

// Aggressive Spline Logo Removal
// Applies to all pages importing this script (index.html, slides.html, slides-cnbc.html)
document.addEventListener('DOMContentLoaded', () => {
    const removeSplineLogos = () => {
        const viewers = document.querySelectorAll('spline-viewer');
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
                // Stop trying after 10 seconds empty 
                if (attempts > 100) clearInterval(interval);
            }, 100);
        });
    };
    
    // Initial removal pass
    removeSplineLogos();

    // Secondary pass in case custom elements trigger load late
    setTimeout(removeSplineLogos, 2000);

    /*
    * Performance enhancement: Spline 3D Viewer scroll jacking prevention.
    * 1. Stops Spline's internal canvas from intercepting mousewheel/touchscroll events
    * 2. Temporarily disables pointer-events while scrolling to boost FPS to 60.
    */
    const passThroughScroll = (e) => { e.stopPropagation(); };
    let scrollTimeout;

    const viewers = document.querySelectorAll('spline-viewer');
    viewers.forEach(viewer => {
        // Enforce capture-phase event stopping so Spline never receives the event
        viewer.addEventListener('wheel', passThroughScroll, { capture: true, passive: true });
        viewer.addEventListener('touchstart', passThroughScroll, { capture: true, passive: true });
        viewer.addEventListener('touchmove', passThroughScroll, { capture: true, passive: true });

        // Bind global scroll listener
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
});
