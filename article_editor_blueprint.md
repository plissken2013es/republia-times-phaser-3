# Republia Times — Article Editor: Developer Blueprint

## Strategy

The editor is built in **three phases**:

1. **Scaffold** — Vite multi-page setup, editor entry point, state management, basic DOM shell.
2. **Core UI** — Article list, form, toolbar with search/filter, import/export.
3. **Polish** — Validation, preview, dirty-state tracking, UX refinements.

---

## Phase Breakdown

```
Phase 1 — Scaffold
  1.1  Update vite.config.ts for multi-page build (editor.html + index.html)
  1.2  Create editor.html entry point
  1.3  Create src/editor/editorState.ts — in-memory article state from database
  1.4  Create src/editor/EditorApp.ts — mount point, layout skeleton
  1.5  Verify: `npm run dev` serves both /index.html (game) and /editor.html (editor)

Phase 2 — Core UI
  2.1  Create Toolbar.ts — search input, category dropdown filter, action buttons
  2.2  Create ArticleList.ts — sortable table, click-to-select, category color badges
  2.3  Create ArticleForm.ts — metadata fields + bilingual text inputs
  2.4  Wire list selection → form population → state updates
  2.5  Add "New Article" — creates blank article, selects it, assigns next legacyIndex
  2.6  Add "Delete Article" — with confirmation dialog
  2.7  Create editorIO.ts — JSON export (download) and import (file picker + validation)
  2.8  Verify: full CRUD cycle works, export → import roundtrip preserves data

Phase 3 — Polish
  3.1  Add validation warnings (missing translations, text length, duplicate IDs)
  3.2  Add dirty-state indicator (unsaved changes warning on page unload)
  3.3  Add article count + filter status in toolbar
  3.4  Add "Generate TS" button — outputs articleDatabase.ts content to clipboard
  3.5  Style polish — dark theme, category colors, layout refinements
  3.6  Verify: all existing game tests still pass, editor doesn't break game build
```

---

## Key Technical Decisions

### No Framework

Vanilla TypeScript + DOM. Reasons:
- The editor is a dev tool, not a product — doesn't need React/Vue complexity
- Keeps the game's `package.json` clean (no framework dependency)
- The dataset is 71 items — no virtual scrolling or complex state management needed
- DOM manipulation for a form + list is straightforward

### Shared Code

The editor imports directly from `src/data/`:
- `articleTypes.ts` — types and enums
- `articleDatabase.ts` — initial data

It does NOT import from game code (`src/game/`, `src/scenes/`, `src/locale/`). This keeps the editor decoupled from Phaser.

### State Management

Simple mutable array + event callbacks:
```ts
class EditorState {
  articles: ArticleData[];        // mutable copy of articleDatabase
  selectedIndex: number | null;
  searchQuery: string;
  categoryFilter: ArticleCategory | null;
  dirty: boolean;

  onChange(listener: () => void): void;  // re-render on state change
}
```

No reactive framework — just call `onChange` listeners when state mutates, and each component re-renders its DOM subtree.

### Multi-Page Vite

Vite supports multiple HTML entry points via `build.rollupOptions.input`. Both pages share the same `node_modules` and TypeScript config. The editor bundles independently from the game — no Phaser code included.

### JSON as Interchange Format

The editor works with JSON export/import rather than directly writing `.ts` files:
- **Export:** Downloads `articles-YYYY-MM-DD.json` with full article data
- **Import:** File picker, validates schema, replaces in-memory state
- **Generate TS:** Copies the `articleDatabase.ts` source code to clipboard for manual paste

This avoids any filesystem access complexity while still enabling the workflow.

### TS Code Generation

The "Generate TS" button produces a string that is the exact content of `articleDatabase.ts`, formatted to match the existing code style. The user copies it and pastes over the file. Simple, no build scripts needed.

---

## Component Architecture

```
EditorApp
├── Toolbar
│   ├── Search input (filters list in real-time)
│   ├── Category dropdown (filters list)
│   ├── "New Article" button
│   ├── "Export JSON" button
│   ├── "Import JSON" button
│   └── "Generate TS" button
├── ArticleList (left panel, scrollable)
│   └── Row per article (click to select)
└── ArticleForm (right panel)
    ├── Metadata section (id, category, days, loyalty, interesting)
    ├── EN text section (blurb textarea, headline input)
    ├── ES text section (blurb textarea, headline input)
    ├── Validation warnings
    └── "Delete" button (bottom, with confirmation)
```

Each component owns its DOM subtree and has a `render()` method that rebuilds it from state. No virtual DOM — just `innerHTML` for the list rows and direct property assignments for the form.

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Editor imports break game build | Game won't compile | Editor code in separate `src/editor/` directory, not imported by game |
| Large article list slow to render | Laggy UI | 71 items is tiny — no perf concern |
| JSON import corrupts data | Lost work | Validate schema before replacing state; export before import |
| TS codegen produces invalid syntax | Can't paste into codebase | Test roundtrip: export → import → export, compare |
| Form edits lost on accidental navigation | Lost work | `beforeunload` handler when dirty |
