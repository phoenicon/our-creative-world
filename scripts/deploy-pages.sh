#!/bin/bash
# Manual GitHub Pages deploy (works even while GitHub Actions is unavailable).
# Builds with the /our-creative-world/ base path and force-pushes dist/ to gh-pages.
set -euo pipefail
cd "$(dirname "$0")/.."
VITE_BASE=/our-creative-world/ npm run build
cp dist/index.html dist/404.html
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "Pages deploy (local build)"
git push -f https://github.com/phoenicon/our-creative-world.git gh-pages:gh-pages
rm -rf .git
echo "Deployed: https://phoenicon.github.io/our-creative-world/"
