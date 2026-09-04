# Changelog

## 2026-09-04
- **Remove AI Eyebrow Section Labels Across Site**: Audited and removed all section eyebrow labels (`Selected work`, `About`, `Career narrative`, `The problem space`, etc.) and horizontal rule line dividers across `index.html`, case studies (`case-study-vimeo.html`, `case-study-looking-glass.html`, `case-study-boxee.html`), and backup/legacy files. Refined case study hero kickers to remove decorative 32px line prefixes while preserving subtle lowercase typography. Cleaned up global CSS, slideshow styles, and translation mappings in `js/main.js`.

## 2026-08-25
- **Standard Gitignore Rules & .DS_Store Cleanup**: Added `.DS_Store`, `node_modules/`, `dist/`, and `build/` to the root `.gitignore` while keeping the existing secrets/credentials block intact. Untracked all `.DS_Store` files (`.DS_Store`, `images/.DS_Store`, `videos/.DS_Store`) from the git index without deleting local files from disk.
