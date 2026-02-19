# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Install dependencies
npm install

# Development (hot reload)
npm run tauri dev

# Build frontend only
npm run build

# Build macOS app
npm run tauri build

# Check Rust compilation
cd src-tauri && cargo check
```

## Architecture Overview

Card-Flow is a Tauri 2 desktop app for browsing Markdown card notes. It uses a React frontend with Rust backend.

### Frontend (React + TypeScript)
- **State**: Zustand store (`src/stores/cardStore.ts`) - `Map<path, CardMeta>` for cards
- **Components**: Toolbar, CardGrid (masonry), CardItem, CardDetail (right sidebar)
- **Hooks**: `useCardFilter` (useMemo-based filtering/sorting), `useTauriEvents` (event listeners)

### Backend (Rust)
- **scanner.rs**: Async directory scanning using `ignore` crate, emits `scan-batch` events
- **frontmatter.rs**: YAML frontmatter parsing with filesystem time fallback
- **watcher.rs**: File system watching via `notify` crate, emits `fs-event` events
- **commands.rs**: Tauri commands (scan/read/write/create/delete)

### Communication
- **Commands** (`invoke`): One-way calls returning results
- **Events** (`emit/listen`): Streaming data for large operations

```
scan_directory → scan-batch events → addCards() → CardGrid
                        ↓
                  scan-complete → setIsScanning(false)

File changes → fs-event → add/update/remove card
```

## Critical Rules

### React Hooks Order
**Hooks MUST be called at the top level, before any conditional returns.** Violating this causes cards to not display.

```tsx
// WRONG
function CardGrid() {
  if (!currentDir) return <EmptyState />;
  const cards = useCardStore(s => s.cards); // ERROR!
}

// CORRECT
function CardGrid() {
  const cards = useCardStore(s => s.cards);
  const currentDir = useCardStore(s => s.currentDir);
  if (!currentDir) return <EmptyState />;
}
```

## Debugging

- **Rust**: `eprintln!("[debug] message");` - outputs to terminal
- **Frontend**: `console.log()`
- **Tauri DevTools**: macOS `Option + Command + I`

## Before Commit

1. Run `npm run build` to fix TypeScript errors
2. Remove unused imports
3. Verify hooks are at top level
