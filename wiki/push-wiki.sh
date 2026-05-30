#!/bin/bash
# Publish wiki/ markdown files to GitHub Wiki repository
# Author: Poonam Tiwari

set -e

REPO="ponamtiwari/ai-powered-prompt-engineering-assistant"
WIKI_URL="https://github.com/${REPO}.wiki.git"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WORK_DIR="$(mktemp -d)"

echo "📚 Publishing wiki to GitHub..."
echo "   Repository: ${REPO}.wiki"

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

if ! git clone "$WIKI_URL" "$WORK_DIR/wiki" 2>/dev/null; then
  echo ""
  echo "❌ Could not clone wiki repository."
  echo ""
  echo "Enable Wikis first:"
  echo "  1. Open https://github.com/${REPO}/settings"
  echo "  2. Under Features → check 'Wikis'"
  echo "  3. Create one page on GitHub (optional), then run this script again"
  echo ""
  exit 1
fi

cp "$SCRIPT_DIR"/*.md "$WORK_DIR/wiki/"

cd "$WORK_DIR/wiki"

if git diff --quiet && git diff --cached --quiet; then
  echo "✅ Wiki is already up to date."
  exit 0
fi

git add .
git commit -m "Update project wiki — AI-Powered Prompt Engineering Assistant"
git push

echo ""
echo "✅ Wiki published successfully!"
echo "   https://github.com/${REPO}/wiki"
