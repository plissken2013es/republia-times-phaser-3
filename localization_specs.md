# Republia Times — Spanish Localization Specification

## 1. Overview

Add full Spanish localization to the Phaser 3 port of Republia Times. The game currently has all text hardcoded in English across multiple source files. This feature extracts all player-visible strings into a locale system and provides a complete Spanish translation.

The game supports **runtime language switching** via a language selector on the initial screen. Changing language restarts the current scene to rebuild all text. Both English and Spanish are shipped in the same build.

---

## 2. Scope

### 2.1 Text Sources to Translate

| Source | File | Count | Description |
|--------|------|-------|-------------|
| News items | `NewsItem.ts` | 71 items (142 strings) | Blurb text + article headline per item. Some have `\|`-delimited rebel variants. |
| Morning messages | `MorningScene.ts` | ~52 string fragments | Welcome, goal briefings, performance, family status, tutorial tips |
| Night results | `NightScene.ts` | ~8 string fragments | Results header, loyalty/readership labels, delta format |
| Readership comments | `Readership.ts` | 7 strings | Paper quality feedback ("too few articles", "many interesting", etc.) |
| UI labels | Various | ~15 strings | "Start Work", "End Day", "Go to Sleep", "Send to Print", "Readers", "Loyalty", "Day N", "RESULTS", credits |
| Goal descriptions | `Goal.ts` | 3 goals | Goal text used in score overlay (dev only, low priority) |
| [GOV] names | `GameState.ts` | 2 strings | "Republia" / "Democria" — keep as-is (fictional country names) |

**Total: ~230 translatable strings**

### 2.2 Out of Scope

- Runtime language switching (future feature)
- Bitmap font regeneration for article fonts (MotorolaScreentype, SILKWONDER, SG03 lack Latin accented chars — see §5)
- Audio localization (no spoken audio exists)
- Logo/image localization (newspaper title logos stay in English — fictional branding)

---

## 3. Language Selection

### 3.1 Where

A language toggle (EN / ES flag or text button) on the **MorningScene** (initial screen), near the mute button. Visible on every MorningScene visit, not just day 1.

### 3.2 Switching Behavior

- Changing language **restarts the current scene** (`this.scene.start(currentSceneKey)`)
- All text is created in each scene's `create()` method, which reads from the active locale — so restarting the scene rebuilds everything in the new language
- Mid-gameplay switching (during PlayScene) is **not supported** — the language button only appears on MorningScene. This avoids complexity with the Feed/Paper state.
- The selected language is **persisted to localStorage** so it survives page refresh

### 3.3 Technical Impact

- No need to dynamically update existing BitmapText objects
- Each scene's `create()` already reads strings once — just needs to read from the active locale instead of hardcoded English
- `NewsItem` text is resolved at read time (`getBlurbText()`, `getArticleText()`) so it naturally picks up the active language
- Save format does NOT store language — it's a user preference, not game state

---

## 4. Architecture

### 4.1 Locale Files

```
src/
  locale/
    en.ts             # English strings (original)
    es.ts             # Spanish strings (translation)
    locale.ts         # Active locale accessor + language switching
```

### 4.2 Locale Accessor

```ts
// src/locale/locale.ts
import { en } from './en';
import { es } from './es';

export type LocaleStrings = typeof en;

const LANG_KEY = 'republiatimes-lang';
let active: LocaleStrings = en;

export function setLanguage(lang: 'en' | 'es'): void {
  active = lang === 'es' ? es : en;
  localStorage.setItem(LANG_KEY, lang);
}

export function getLanguage(): 'en' | 'es' {
  return active === es ? 'es' : 'en';
}

export function loadLanguagePreference(): void {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'es') active = es;
}

// All game code reads strings via S()
export function S(): LocaleStrings { return active; }
```

Usage in scenes: `S().ui_startWork` — always reads from the active locale.

### 4.3 String Replacement Strategy

Replace all hardcoded English strings in scene/component code with `S().*` calls. The `NewsItem` data also references the locale for blurb/article text.

### 4.4 [GOV] System

The `[GOV]` placeholder system stays as-is. Translated strings use `[GOV]` and `GameState.expandGovNames()` still replaces them. "Republia" and "Democria" are proper nouns and remain unchanged.

---

## 4. Translation Guidelines

### 4.1 Tone & Style

- Match the original's **bureaucratic, cold, authoritarian** tone for government messages
- Rebel messages should feel **urgent, conspiratorial, hopeful**
- News headlines should feel like **actual newspaper headlines** — concise, punchy
- Use formal "usted" for government communications, informal for rebel messages
- Keep translated text **similar length** to English to avoid layout overflow

### 4.2 Special Characters

- Use standard Spanish characters: á, é, í, ó, ú, ñ, ü, ¿, ¡
- The main UI font (nokiafc22) supports all these characters
- Article headline fonts (Motorola, SILKWONDER, SG03) do NOT — see §5

### 4.3 Text Length Constraints

| Context | Max width (px) | Font | Constraint |
|---------|---------------|------|------------|
| Feed blurb text | 170px | nokiafc22 (10) | ~28 chars/line, 2-3 lines visible |
| Big article headline | 130px | MotorolaScreentype (18) | ~8-10 chars/line |
| Medium article headline | 84px | SILKWONDER (12) | ~10-12 chars/line |
| Small article headline | 40px | SG03 (8) | ~6-8 chars/line |
| Button labels | 120px (full) / 60px (End Day) | nokiafc22 (10) | ~20 / ~10 chars |
| Morning message | 340px | nokiafc22 (10) | ~56 chars/line |

---

## 5. Font Character Coverage

### 5.1 Current Status

| Font | Latin chars | Spanish-ready? |
|------|-----------|----------------|
| nokiafc22 (UI/feed) | Full Latin-1 (á-ÿ, ñ, ¿, ¡) | **Yes** |
| MotorolaScreentype (big headlines) | ASCII only (32-126) | **No** |
| SILKWONDER (med headlines) | ASCII only | **No** |
| SG03 (small headlines) | ASCII only | **No** |

### 5.2 Mitigation Options

**Option A: Regenerate article fonts** — Use the original TTF files to generate new `.fnt` + `_0.png` with extended Latin character sets. Requires font generation tools (Hiero/BMFont).

**Option B: ASCII-only article headlines** — Translate headlines using only ASCII characters. Avoid accented chars in article text. Awkward but functional.

**Option C: Replace article fonts with nokiafc22** — Use the feed font (which has full Latin) for all article sizes, at different scales. Changes visual style but ensures character coverage.

**Recommended: Option A** if original TTFs are available. Fall back to Option B for MVP.

### 5.3 Required Characters for Spanish

Minimum set beyond ASCII: `á é í ó ú ñ Á É Í Ó Ú Ñ ü Ü ¿ ¡`

---

## 6. News Item Translation

### 6.1 Structure

Each `NewsItem` has:
- `blurbText`: Feed panel text (uses nokiafc22 — Latin OK)
- `articleText`: Paper headline (uses article fonts — Latin may be missing)
- Some items have `|`-delimited text for rebel message variants

### 6.2 Approach

1. Extract all 71 news items into a spreadsheet/table format
2. Translate blurbText and articleText for each
3. For articleText: check if translation fits within maxWidth and uses only available chars
4. For rebel `|`-delimited messages: translate all variants

### 6.3 Categories

| Category | Count | Notes |
|----------|-------|-------|
| Political/government | ~25 | Positive loyalty, government propaganda |
| Military | ~15 | War reports, border security |
| Sports/entertainment | ~12 | Interesting to readers |
| Weather | ~6 | No loyalty effect |
| Critical/plot | ~8 | Day-ranged, story-advancing |
| Rebel messages | ~5 | Red text, `***` prefix, `\|`-branching |

---

## 7. Deliverables

- [ ] `src/locale/strings.ts` — All UI strings in Spanish
- [ ] `NewsItem.ts` — All 71 news items translated
- [ ] `MorningScene.ts` — All message branches using `Strings.*`
- [ ] `NightScene.ts` — Results text using `Strings.*`
- [ ] `Readership.ts` — Comment strings using `Strings.*`
- [ ] `PlayScene.ts` — UI labels using `Strings.*`
- [ ] `StatMeters.ts`, `Clock.ts`, `CenterPopup.ts` — Labels using `Strings.*`
- [ ] Article fonts regenerated with Latin chars (if TTFs available)
- [ ] All text verified to fit within layout constraints
- [ ] Game tested end-to-end in Spanish through all 10 days
