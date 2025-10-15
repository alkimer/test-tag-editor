# Running test-tag-editor

This project includes a convenient `run.sh` script for common tasks.

## Prerequisites

- Node.js 18+ installed
- Dependencies installed (run `./run.sh install` if needed)

## Usage

```bash
./run.sh [command]
```

## Available Commands

- **dev** (default) - Start the development server at http://localhost:5173
- **build** - Build the project for production
- **preview** - Preview the production build
- **install** - Install all dependencies
- **test** - Run the test suite
- **help** - Show usage information

## Examples

```bash
# Start development server
./run.sh dev
# or just
./run.sh

# Build for production
./run.sh build

# Run tests
./run.sh test
```

## Notes

- The script will automatically check for Node.js and install dependencies if needed
- On development mode, it will attempt to open your default browser automatically
