# Changelog

## 2026-08-25
- **Standard Gitignore Rules & .DS_Store Cleanup**: Added `.DS_Store`, `node_modules/`, `dist/`, and `build/` to the root `.gitignore` while keeping the existing secrets/credentials block intact. Untracked all `.DS_Store` files (`.DS_Store`, `images/.DS_Store`, `videos/.DS_Store`) from the git index without deleting local files from disk.
