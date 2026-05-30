#!/bin/bash
# Initialize GitHub Wiki by waiting for first page, then publish all wiki/*.md files
# Author: Poonam Tiwari

set -e

REPO="ponamtiwari/ai-powered-prompt-engineering-assistant"
WIKI_URL="https://github.com/${REPO}.wiki.git"
WIKI_WEB="https://github.com/${REPO}/wiki/_new"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WIKI_SOURCE="$PROJECT_ROOT/wiki"
WORK_DIR="$(mktemp -d)"
MAX_ATTEMPTS=60
SLEEP_SECONDS=5

cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

echo "📚 GitHub Wiki publisher for ${REPO}"
echo ""

# Step 1: Wait for wiki git repo (created after first wiki page exists)
echo "⏳ Waiting for wiki repository (create first page in browser if prompted)..."
echo "   ${WIKI_WEB}"
echo ""

if [[ "$(uname)" == "Darwin" ]]; then
  open "$WIKI_WEB" 2>/dev/null || true
fi

cloned=0
for ((i=1; i<=MAX_ATTEMPTS; i++)); do
  if git clone "$WIKI_URL" "$WORK_DIR/wiki" 2>/dev/null; then
    cloned=1
    echo "✅ Wiki repository found."
    break
  fi
  echo "   Attempt ${i}/${MAX_ATTEMPTS} — create wiki page: Title = Home, then click Save Page"
  sleep "$SLEEP_SECONDS"
done

if [[ "$cloned" -ne 1 ]]; then
  echo ""
  echo "❌ Wiki git repo still not available."
  echo ""
  echo "Manual step (one time only):"
  echo "  1. Open: ${WIKI_WEB}"
  echo "  2. Title: Home"
  echo "  3. Body: # Home (temporary)"
  echo "  4. Click Save Page"
  echo "  5. Run: ./scripts/init-and-publish-wiki.sh"
  exit 1
fi

# Step 2: Copy all wiki markdown pages
cp "$WIKI_SOURCE"/*.md "$WORK_DIR/wiki/"

cd "$WORK_DIR/wiki"
git add .

if git diff --cached --quiet; then
  echo "✅ Wiki already up to date."
else
  git commit -m "Publish full project wiki — AI-Powered Prompt Engineering Assistant"
  git push
  echo "✅ All wiki pages published."
fi

echo ""
echo "🌐 https://github.com/${REPO}/wiki"
