#!/bin/bash
# Simple launcher for test-tag-editor project
# Compatible with bash, zsh and other POSIX shells

set -e

cd "$(dirname "$0")"

command=${1:-dev}

check_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
  fi
  
  node_version=$(node -v | sed 's/^v//' | cut -d. -f1)
  if [ "$node_version" -lt 18 ]; then
    echo "Error: Node.js $node_version detected. This project requires Node.js 18+"
    echo "Please upgrade Node.js or use a version manager like nvm"
    exit 1
  fi
  
  if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm not found. Please install Node.js which includes npm"
    exit 1
  fi
}

install_deps() {
  if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
  fi
}

case "$command" in
  dev)
    check_node
    install_deps
    echo "Starting development server..."
    npm run dev
    ;;
  build)
    check_node
    npm run build
    ;;
  preview)
    check_node
    npm run preview
    ;;
  install)
    check_node
    npm install
    ;;
  test)
    check_node
    install_deps
    npm run test
    ;;
  clean)
    echo "Cleaning project..."
    rm -rf node_modules package-lock.json
    echo "Run './run.sh install' to reinstall dependencies"
    ;;
  help|--help|-h)
    echo "Usage: ./run.sh [command]"
    echo "Commands:"
    echo "  dev      Start development server (default)"
    echo "  build    Build for production"
    echo "  preview  Preview production build"
    echo "  install  Install dependencies"
    echo "  test     Run tests"
    echo "  clean    Remove dependencies"
    echo "  help     Show this message"
    ;;
  *)
    echo "Unknown command: $command"
    echo "Run './run.sh help' for available commands"
    exit 1
    ;;
esac
