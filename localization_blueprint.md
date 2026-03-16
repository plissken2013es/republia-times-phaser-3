# Republia Times — Spanish Localization: Developer Blueprint

## Strategy

The localization is built in **three phases**:

1. **Extract + Draft** — Extract all English strings into locale files, generate Spanish first-draft for user review.
2. **Review + Integration** — User polishes Spanish, then integrate locale system into game code + add language selector UI.
3. **Validation** — Test all screens, verify text fits within layout bounds, fix overflow issues.

---

## Phase Breakdown

```
Phase 1 — Extract + Draft (Claude generates, user reviews)
  1.1  Create src/locale/en.ts — extract ALL English text into structured locale file
  1.2  Create src/locale/es.ts — Claude generates first-draft Spanish translation
  1.3  Create src/locale/locale.ts — accessor with setLanguage/getLanguage/S()
  1.4  User reviews and polishes es.ts

Phase 2 — Integration (wire locale into game + language selector)
  2.1  Refactor MorningScene to use S().* for all message text
  2.2  Refactor NightScene + Readership to use S().*
  2.3  Refactor PlayScene + components (Feed, Paper, Clock, StatMeters, CenterPopup)
  2.4  Refactor NewsItem to read blurb/article text from active locale
  2.5  Add language toggle button on MorningScene (EN/ES, restarts scene)
  2.6  Persist language choice to localStorage, load on boot in PreloadScene
  2.7  Assess article font Latin coverage — regenerate or constrain
  2.8  Verify: game plays in both languages, switching works

Phase 3 — Validation
  3.1  Visual review: MorningScene (all day variants, both languages)
  3.2  Visual review: PlayScene (feed text, article headlines, button)
  3.3  Visual review: NightScene (results, comments)
  3.4  Text overflow fixes (shorten translations that exceed bounds)
  3.5  Full playthrough: 10-day game in Spanish, both paths
  3.6  Edge cases: language switch mid-game, rebel path, replay
```

---

## Step-Level Breakdown

| Step | Title | Builds On | Estimated Effort |
|------|-------|-----------|-----------------|
| 1.1 | Create strings.ts | — | Small |
| 1.2 | Refactor MorningScene | 1.1 | Medium (52 string fragments) |
| 1.3 | Refactor NightScene + Readership | 1.1 | Small |
| 1.4 | Refactor PlayScene + components | 1.1 | Small |
| 1.5 | Extract NewsItem text | 1.1 | Large (71 items × 2 strings) |
| 1.6 | Verify English still works | 1.2–1.5 | Small |
| 2.1 | Translate UI strings | 1.6 | Small |
| 2.2 | Translate morning messages | 1.6 | Medium |
| 2.3 | Translate news items | 1.6 | **Large** (main effort) |
| 2.4 | Translate readership comments | 1.6 | Small |
| 2.5 | Font assessment / regen | 2.3 | Medium (if regen needed) |
| 2.6 | [GOV] in Spanish grammar | 2.1–2.3 | Small |
| 3.1 | Review MorningScene | 2.2 | Small |
| 3.2 | Review PlayScene | 2.3, 2.5 | Medium |
| 3.3 | Review NightScene | 2.4 | Small |
| 3.4 | Fix text overflows | 3.1–3.3 | Medium |
| 3.5 | Full playthrough | 3.4 | Medium |
| 3.6 | Edge cases | 3.5 | Small |

---

## Key Technical Decisions

### String Extraction Pattern

Use a flat object with typed keys, not nested i18n. Keep it simple:

```ts
// src/locale/strings.ts
export const S = {
  ui_startWork: 'Empezar a Trabajar',
  ui_endDay: 'Terminar el Dia',
  ui_goToSleep: 'Ir a Dormir',
  // ...
  morning_welcome: 'Bienvenido a The [GOV] Times. Eres el nuevo editor en jefe.',
  // ...
  night_resultsHeader: "La edicion de hoy ha sido impresa y distribuida.",
  // ...
} as const;
```

Usage: `S.ui_startWork` instead of `'Start Work'`.

### NewsItem Translation Approach

The 71 news items are constructed with positional arguments. Two options:

**Option A: Translate in-place** — Replace English strings directly in the `new NewsItem(...)` calls. Simpler, no abstraction. Good for single-language target.

**Option B: External data** — Move news item text to a JSON/TS data file, keyed by index. More structured but adds complexity for 71 items.

**Recommended: Option A** for MVP. The game already has all items hardcoded; translating in-place is the least disruptive.

### Translation Workflow

1. **Claude generates first-draft Spanish** — Extract ALL game text (UI, messages, 71 news items) into a single reviewable file (`src/locale/es.ts`), with English originals as comments alongside each Spanish translation.
2. **User reviews and polishes** — The human reviews the file, corrects tone, fixes awkward phrasing, adjusts for cultural fit.
3. **Integrate polished translations** — Replace all hardcoded English with references to the reviewed locale file.

This avoids back-and-forth on individual strings. The user gets a complete translation file to review in one pass.

### [GOV] in Spanish

Spanish grammar may require different forms:
- English: "Republia Times" → "Republia Times" (proper noun, no article change)
- English: "loyal to [GOV]" → "leales a [GOV]" (preposition stays the same)
- English: "The [GOV] Times" → "The [GOV] Times" (keep English newspaper name)

The `[GOV]` system works well for Spanish since "Republia"/"Democria" are proper nouns that don't inflect.

### Font Regeneration

If original TTF files are available in `legay_HaxeFlixel_src/`:

```bash
# Using Hiero (Java BMFont tool)
java -jar hiero.jar
# Load TTF, set size, add characters: ASCII + áéíóúñÁÉÍÓÚÑüÜ¿¡
# Export as BMFont XML (.fnt + _0.png)
```

If TTFs are NOT available: use Option B (ASCII-only headlines) or Option C (nokiafc22 for all sizes).

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Article font missing Latin chars | Headlines show blank glyphs | Regenerate fonts or constrain to ASCII |
| Spanish text longer than English | Text overflows layout bounds | Iterative testing, shorten translations |
| [GOV] grammar mismatch | Awkward phrasing in Spanish | Manual review of all [GOV] contexts |
| Rebel `\|`-branching text | Translation misses a variant | Systematic extraction of all variants |
| 71 news items is tedious | Translation errors | Review pass after bulk translation |
