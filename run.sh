#!/usr/bin/env zsh
# Simple launcher for the test-tag-editor project (macOS / zsh)
# Usage: ./run.sh [command]
# Commands: dev (default), build, preview, install, test, help

set -euo pipefail

PROJ_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJ_ROOT"

command=${1:-dev}

function ensure_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js is not installed or not in PATH. Please install Node 18+ (https://nodejs.org/)."
    exit 1
  fi
}

function ensure_deps() {
  if [ ! -d "node_modules" ]; then
    echo "node_modules not found — installing dependencies (this may take a minute)..."
    npm install
  fi
}

case "$command" in
  dev)
    ensure_node
    ensure_deps
    echo "Starting dev server..."
    # Start vite in background so we can open the browser
    npm run dev &
    VITE_PID=$!
    # Wait a short moment for server to bind
    sleep 2
    # Try to open default browser to Vite dev URL
    if command -v open >/dev/null 2>&1; then
      open "http://localhost:5173"
    fi
    echo "Dev server started (pid: $VITE_PID). Press Ctrl-C to stop."
    wait $VITE_PID
    ;;
  build)
    ensure_node
    npm run build
    ;;
  preview)
    ensure_node
    npm run preview
    ;;
  install)
    ensure_node
    echo "Installing dependencies..."
    npm install
    echo "Installing recommended runtime deps..."
    npm i react-konva konva zustand recharts jspdf html2canvas react-router-dom
    echo "Installing dev dependencies..."
    npm i -D @types/konva @types/jest vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom eslint prettier
    ;;
  test)
    ensure_node
    ensure_deps
    npm run test
    ;;
  help|--help|-h)
    echo "run.sh - helper launcher"
    echo "Usage: ./run.sh [dev|build|preview|install|test|help]"
    ;;
  *)
    echo "Unknown command: $command"
    echo "Usage: ./run.sh [dev|build|preview|install|test|help]"
    exit 2
    ;;
esac
