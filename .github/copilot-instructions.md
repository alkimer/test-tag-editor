# Copilot Instructions for test-tag-editor

## Project Overview
React + TypeScript application with Vite for interactive tag editing on images. Combines Konva.js for 2D canvas, Zustand for state management, and Recharts for visualization across Editor, Dashboard, and Report pages.

## Architecture & Core Components

### State Management
- **Zustand Store**: `src/components/EditorCanvas/useEditorStore.ts` - single source of truth
- Functional pattern with state and actions, use `useEditorStore()` hook

### Canvas System (Konva.js)
- **EditorCanvas**: `src/components/EditorCanvas/EditorCanvas.tsx` - main Konva Stage
- **Tag Structure**: Defined in `types.ts` with position, styling, text, z-index
- **Export**: `useEditorExport` hook for PNG snapshots via Konva's `toDataURL()`

### Export System
- **Image Export**: `src/components/Export/exportImage.ts` - Konva stage to PNG
- **PDF Export**: `src/components/Export/exportPdf.ts` - combines editor + charts
- **Charts**: Export via `domToPng` utility in `src/components/Export/domToPng.ts`

### Navigation
- React Router: `/editor`, `/dashboard`, `/report`
- Editor: tag creation/editing with inspector sidebar
- Dashboard: chart overview with PDF export
- Report: preview with editor snapshot + charts

## Development

### Running
- **Primary**: `./run.sh [command]` - handles Node.js version checks
- `./run.sh dev` - development server at http://localhost:5173
- `./run.sh build` - production build
- `./run.sh test` - run test suite
- `./run.sh clean` - remove dependencies for fresh install

### Dependencies
- Canvas: `react-konva` + `konva` for 2D graphics
- State: `zustand` for lightweight state management  
- Charts: `recharts` for responsive components
- Export: `jspdf` + `html2canvas` for PDF generation
- Navigation: `react-router-dom` for SPA routing

### Key Files
- `src/components/EditorCanvas/useEditorStore.ts` - central state
- `src/components/EditorCanvas/types.ts` - core data structures
- `src/routes/EditorPage.tsx` - main editing interface
- `run.sh` - development workflow with Node.js validation

## Code Conventions
- Functional components with hooks (no classes)
- TypeScript with explicit types for Tag and EditorState
- State updates via Zustand actions like `updateTag(id, patch)`
- Export functions return promises for async operations
- Tests in `src/tests/` with `.spec.tsx` extension