# Republia Times — Article Editor Specification

## 1. Overview

Build a web-based article editor for creating, editing, and previewing the 71 news articles in the Republia Times game. The editor reads from and writes to the canonical `articleDatabase.ts` file (created in the database extraction phase), giving non-technical users a visual way to manage game content without touching TypeScript source.

The editor ships as a **separate Vite entry point** inside the same project, sharing types and data with the game. It is NOT embedded in the game — it's a standalone tool page at `/editor.html`.

---

## 2. Scope

### 2.1 In Scope

| Feature | Description |
|---------|-------------|
| Article list | Filterable/sortable table of all articles with category, loyalty, day range |
| Article editing | Edit blurb + headline text for EN and ES, plus all metadata fields |
| Article creation | Add new articles with auto-assigned legacyIndex |
| Article deletion | Remove articles (with confirmation) |
| Live preview | Show how article looks at S/M/B sizes using the actual game fonts |
| Import/Export JSON | Export database to JSON for external tools, import JSON back |
| Validation | Warn on missing translations, text too long for font bounds, duplicate IDs |
| Category filtering | Filter articles by category (Plot, War, Politics, etc.) |
| Search | Full-text search across blurb and headline text |

### 2.2 Out of Scope (Phase 3+)

- Remote API endpoint (articles served from server)
- Multi-user collaboration
- Version history / undo beyond browser undo
- Direct filesystem write (editor exports JSON; a build script generates .ts)
- Integration with game save system
- Drag-and-drop reordering

---

## 3. Architecture

### 3.1 File Structure

```
republia-times/
  editor.html                    # Editor HTML entry point
  src/
    editor/
      EditorApp.ts               # Main editor application (mounts to DOM)
      components/
        ArticleList.ts           # Filterable table of all articles
        ArticleForm.ts           # Edit form for a single article
        ArticlePreview.ts        # Canvas preview at S/M/B sizes
        Toolbar.ts               # Top bar: search, filter, import/export, add new
      editorState.ts             # In-memory article state, dirty tracking
      editorIO.ts                # JSON import/export, TS codegen
    data/
      articleTypes.ts            # (existing) shared types
      articleDatabase.ts         # (existing) canonical data
```

### 3.2 Tech Stack

- **No framework.** Vanilla TypeScript + DOM APIs. The editor is a developer tool, not a consumer product. Keeping it dependency-free avoids bloating the game's package.json.
- **Vite multi-page** — add `editor.html` as a second entry in `vite.config.ts`.
- **Shared types** — editor imports `ArticleData`, `ArticleCategory`, `LoyaltyEffect` from `src/data/articleTypes.ts`.
- **Shared data** — editor imports `articleDatabase` from `src/data/articleDatabase.ts` as its initial dataset.

### 3.3 Data Flow

```
articleDatabase.ts ──(import)──> Editor state (in-memory)
                                     │
                                     ├── Edit / Add / Delete
                                     │
                                     ▼
                              Export as JSON
                                     │
                                     ▼
                         Import script (future) ──> articleDatabase.ts
```

For now, the editor works with JSON export/import. A future build script can convert JSON → `.ts`.

### 3.4 Vite Configuration

```ts
// vite.config.ts — add rollup input
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      editor: resolve(__dirname, 'editor.html'),
    },
  },
},
```

---

## 4. UI Layout

### 4.1 Overall Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar: [Search...] [Category ▼] [+ New Article] [Export] [Import] │
├────────────────────────────────┬────────────────────────────┤
│                                │                            │
│   Article List (scrollable)    │   Article Form + Preview   │
│   - ID, category badge,       │   - Metadata fields        │
│     blurb preview, loyalty     │   - EN text (blurb+head)   │
│   - Click row to select       │   - ES text (blurb+head)   │
│   - Highlight selected         │   - Preview at 3 sizes     │
│   - Color-coded by category   │   - Delete button           │
│                                │                            │
└────────────────────────────────┴────────────────────────────┘
```

### 4.2 Article List Columns

| Column | Width | Content |
|--------|-------|---------|
| # | 40px | legacyIndex |
| ID | 160px | String ID (e.g. "war-gas-stolen") |
| Category | 90px | Colored badge |
| Blurb | flex | First ~60 chars of EN blurb |
| Loyalty | 60px | ↑ / ↓ / — icon |
| Interest | 50px | ★ or blank |
| Days | 60px | Range or "any" |

### 4.3 Article Form Fields

| Field | Type | Notes |
|-------|------|-------|
| id | text input | String, must be unique, kebab-case |
| legacyIndex | number (readonly) | Auto-assigned, shown for reference |
| category | dropdown | ArticleCategory enum values |
| dayRangeStart | number | 0 = always available |
| dayRangeEnd | number | 0 = always, -1 = open-ended |
| loyaltyEffect | radio | Up / Down / None |
| interesting | checkbox | Affects reader count |
| EN blurb | textarea | Feed panel text |
| EN headline | text input (nullable) | Paper headline (null for rebel messages) |
| ES blurb | textarea | Spanish feed text |
| ES headline | text input (nullable) | Spanish paper headline |

### 4.4 Category Color Coding

| Category | Color |
|----------|-------|
| Plot | #8B0000 (dark red) |
| Military | #2E4057 (navy) |
| War | #D4380D (orange-red) |
| Politics | #531DAB (purple) |
| Weather | #0891B2 (teal) |
| Sports | #16A34A (green) |
| Entertainment | #D97706 (amber) |

---

## 5. Validation Rules

| Rule | Severity | Message |
|------|----------|---------|
| Empty EN blurb | Error | "English blurb text is required" |
| Duplicate article ID | Error | "Article ID must be unique" |
| EN headline missing when category ≠ Plot | Warning | "Non-plot articles usually have headlines" |
| ES blurb empty | Warning | "Missing Spanish translation for blurb" |
| ES headline empty when EN has one | Warning | "Missing Spanish headline translation" |
| Blurb > 120 chars | Warning | "Blurb may overflow feed panel" |
| Headline > 40 chars (B size) | Warning | "Headline may overflow big article" |
| dayRangeEnd < dayRangeStart (when both > 0) | Error | "Day range end must be ≥ start" |

---

## 6. Import/Export Format

### 6.1 JSON Schema

```json
{
  "version": 1,
  "articles": [
    {
      "id": "rebellion-crushed",
      "legacyIndex": 0,
      "category": "plot",
      "dayRangeStart": 1,
      "dayRangeEnd": 3,
      "loyaltyEffect": 1,
      "interesting": true,
      "text": {
        "en": { "blurb": "...", "headline": "..." },
        "es": { "blurb": "...", "headline": "..." }
      }
    }
  ]
}
```

### 6.2 Export Behavior

- Downloads as `articles.json` with current timestamp in filename
- Includes ALL articles, sorted by legacyIndex

### 6.3 Import Behavior

- File picker for `.json` files
- Validates against schema before replacing state
- Shows diff summary: "N articles added, M modified, K removed"
- Requires confirmation before applying

---

## 7. Styling

- Monospace font for text fields (matches game's pixel aesthetic)
- Dark theme (#1a1a2e background, #eee text) — matches game's dark tone
- Minimal CSS, no framework — just a `<style>` block or small `.css` file
- Responsive: works at 1280px+ width, not mobile-optimized

---

## 8. Deliverables

- [ ] `editor.html` — Entry point
- [ ] `src/editor/EditorApp.ts` — Main application
- [ ] `src/editor/components/ArticleList.ts` — Article table
- [ ] `src/editor/components/ArticleForm.ts` — Edit form
- [ ] `src/editor/components/ArticlePreview.ts` — Size preview (stretch goal)
- [ ] `src/editor/components/Toolbar.ts` — Search, filter, actions
- [ ] `src/editor/editorState.ts` — State management
- [ ] `src/editor/editorIO.ts` — JSON import/export
- [ ] Updated `vite.config.ts` — Multi-page build
- [ ] All existing tests still pass
