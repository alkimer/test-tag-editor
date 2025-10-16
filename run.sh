#!/usr/bin/env bash
# Simple launcher for the test-tag-editor project
# Usage: ./run.sh [command]
# Commands: dev (default), build, preview, install, test, help

set -euo pipefail

PROJ_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJ_ROOT"

command=${1:-dev}

function ensure_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js is not installed or not in PATH. Please install Node 18+ (https://nodejs.org/ or using nvm: https://github.com/nvm-sh/nvm)."
    exit 1
  fi

  # Check major version
  NODE_VER_RAW=$(node -v || true)
  NODE_VER_NUM=$(echo "$NODE_VER_RAW" | sed 's/^v//' | cut -d. -f1 || true)
  if [[ -z "$NODE_VER_NUM" ]] || [[ "$NODE_VER_NUM" -lt 18 ]]; then
    echo "Detected Node version: $NODE_VER_RAW"
    echo "Vite and modern tools require Node 18 or newer. Please upgrade Node (nvm recommended):"
    echo "  # install nvm (if needed)"
    echo "  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash"
    echo "  # then install Node 18 LTS"
    echo "  nvm install 18 && nvm use 18"
    exit 1
  fi

  if ! command -v npm >/dev/null 2>&1; then
    echo "npm not found. Please install Node.js which includes npm."
    exit 1
  fi

  # Optional: warn if npm is very old
  NPM_VER_RAW=$(npm -v || true)
  NPM_VER_MAJOR=$(echo "$NPM_VER_RAW" | cut -d. -f1 || true)
  if [[ -n "$NPM_VER_MAJOR" ]] && [[ "$NPM_VER_MAJOR" -lt 8 ]]; then
    echo "Warning: Detected npm version $NPM_VER_RAW — consider upgrading npm (v8+ recommended)."
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

    # Start vite in background so we can open the browser. Capture pid and check it started.
    npm run dev &
    VITE_PID=$!

    # Wait a short moment for server to bind
    sleep 2

    # If process exited already, surface logs and exit
    if ! kill -0 "$VITE_PID" >/dev/null 2>&1; then
      echo "Dev server process exited shortly after starting. Waiting for npm output..."
      wait "$VITE_PID" || true
      echo "Check the npm/vite output above for the error."
      exit 1
    fi

    # Try to open default browser to Vite dev URL
    if command -v open >/dev/null 2>&1; then
      open "http://localhost:5173" || true
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
