# Republia Times — Article Editor: TODO

## Phase 1 — Scaffold

- [x] **1.1** Update `vite.config.ts` for multi-page build (`index.html` + `editor.html`)
- [x] **1.2** Create `editor.html` — minimal HTML with `#editor-root` container, dark theme base styles
- [x] **1.3** Create `src/editor/editorState.ts` — EditorState class:
  - [x] Deep-clone `articleDatabase` into mutable array on init
  - [x] Selected article tracking
  - [x] Search query + category filter state
  - [x] Dirty flag
  - [x] `onChange()` listener registration
  - [x] `getFilteredArticles()` — returns articles matching current search/filter
- [x] **1.4** Create `src/editor/EditorApp.ts` — mount to `#editor-root`, create layout containers
- [x] **1.5** Verify: `npm run dev` serves both game and editor, `npm run build` outputs both pages

## Phase 2 — Core UI

- [x] **2.1** Create `src/editor/components/Toolbar.ts`:
  - [x] Search input with real-time filtering
  - [x] Category dropdown (All + 7 categories)
  - [x] "New Article" button
  - [x] "Export JSON" button
  - [x] "Import JSON" button (hidden file input)
  - [x] "Copy as TS" button
  - [x] Article count display
- [x] **2.2** Create `src/editor/components/ArticleList.ts`:
  - [x] Scrollable table: #, ID, Category badge, Blurb preview, Loyalty icon, Interest, Days
  - [x] Category color-coded badges
  - [x] Click row → select article
  - [x] Highlight selected row
  - [x] Updates from filtered state
- [x] **2.3** Create `src/editor/components/ArticleForm.ts`:
  - [x] Metadata: id (text), category (dropdown), dayRangeStart/End (number), loyalty (radio), interesting (checkbox)
  - [x] EN section: blurb (textarea), headline (text input + null toggle)
  - [x] ES section: blurb (textarea), headline (text input + null toggle)
  - [x] legacyIndex shown as readonly info
  - [x] Auto-save on input change (update state immediately)
  - [x] Empty state when nothing selected
- [x] **2.4** Wire everything together in EditorApp:
  - [x] Toolbar actions → state changes → re-render list + form
  - [x] List selection → form population
  - [x] Form edits → state update → list row update
- [x] **2.5** "New Article" flow:
  - [x] Generate next legacyIndex (max + 1)
  - [x] Generate placeholder ID from category
  - [x] Add to state, select it
- [x] **2.6** "Delete Article" flow:
  - [x] Confirm dialog with article ID
  - [x] Remove from state
  - [x] Clear selection if deleted was selected
  - [x] Mark dirty
- [x] **2.7** Create `src/editor/editorIO.ts`:
  - [x] `exportJSON(articles)` — download as `articles-YYYY-MM-DD.json`
  - [x] `importJSON(file)` — parse, validate schema, return articles or errors
  - [x] `generateTS(articles)` — produce `articleDatabase.ts` file content string
  - [x] Copy to clipboard for "Copy as TS"
- [ ] **2.8** Roundtrip test: export JSON → clear state → import JSON → verify all 71 articles intact

## Phase 3 — Polish

- [x] **3.1** Validation warnings on form:
  - [x] Empty EN blurb → error
  - [x] Duplicate ID → error
  - [x] Missing ES translations → warning
  - [x] Text length warnings (blurb > 120, headline > 40)
  - [x] Day range logic errors
- [x] **3.2** Dirty-state management:
  - [x] `beforeunload` handler warns on unsaved changes
  - [x] Visual indicator in toolbar ("• Unsaved changes")
  - [x] Reset dirty flag on export/copy-as-TS
- [x] **3.3** Toolbar status: "Showing N of M articles"
- [x] **3.4** Style polish:
  - [x] Dark theme (#1a1a2e bg, #eee text, #333 panels)
  - [x] Category badge colors
  - [x] Loyalty icons (↑ green, ↓ red, — gray)
  - [x] Form section headers
  - [x] Monospace font for text fields
- [x] **3.5** Verify: all 29 game tests still pass, game build unaffected
- [x] **3.6** Verify: editor works in production build (`npm run build && npm run preview`)

## Notes

- Editor is a dev tool — no mobile support needed, 1280px+ width assumed
- No Phaser dependency — editor is pure DOM/TypeScript
- JSON is the interchange format; TS codegen is a convenience copy-paste feature
- Article preview using game fonts is a stretch goal for later (requires loading BMFont in a canvas)
