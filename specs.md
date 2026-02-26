# Republia Times — Phaser 3 Port Specification

## 1. Overview

A faithful 1:1 port of Lucas Pope's *Republia Times* Flash game (originally ActionScript 3 + AS3 Flixel) to a modern web stack using **Phaser 3**, **TypeScript**, and **Vite**. All original assets (images, audio, fonts) are reused. Game logic, mechanics, content, and visual layout are preserved exactly.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Runtime | Browser (standalone web page) |
| Game Framework | Phaser 3 (≥ 3.60 recommended, 3.9 absolute minimum) |
| Language | TypeScript (strict mode) |
| Bundler | Vite |
| Linter | ESLint + `@typescript-eslint` |
| Fonts | Bitmap fonts (pre-converted from TTFs) |

---

## 3. Project Setup

### 3.1 Initialization

```bash
npm create vite@latest republia-times -- --template vanilla-ts
cd republia-times
npm install phaser
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### 3.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 3.3 `vite.config.ts`

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
});
```

### 3.4 ESLint

Use `@typescript-eslint/recommended` ruleset. Enforce `no-explicit-any`, `explicit-function-return-type`, and consistent imports.

---

## 4. Directory Structure

```
republia-times/
├── public/
│   └── assets/
│       ├── images/          # All original PNGs (copied as-is)
│       ├── audio/           # All original MP3s (copied as-is)
│       └── fonts/           # Converted bitmap fonts (.png + .xml per font)
├── src/
│   ├── main.ts              # Phaser.Game config + boot
│   ├── constants/
│   │   ├── Const.ts         # Layout grid constants (mirrors Const.as)
│   │   └── AssetKeys.ts     # String constants for all asset keys
│   ├── scenes/
│   │   ├── PreloadScene.ts
│   │   ├── MorningScene.ts
│   │   ├── PlayScene.ts
│   │   └── NightScene.ts
│   ├── game/
│   │   ├── GameState.ts     # Singleton — cross-scene shared state
│   │   ├── Readership.ts
│   │   ├── Goal.ts
│   │   ├── NewsItem.ts      # All hardcoded news content
│   │   ├── Day.ts           # Daily news selection logic
│   │   └── PaperSummary.ts
│   ├── components/
│   │   ├── Paper.ts         # Newspaper layout + drag-and-drop grid
│   │   ├── Feed.ts          # Scrolling news blurb panel
│   │   ├── Clock.ts         # Day timer visual
│   │   ├── StatMeters.ts    # Loyalty + readership meter bars
│   │   └── CenterPopup.ts   # Modal dialog ("Day is over", etc.)
│   └── utils/
│       ├── Util.ts          # shuffleArray, mute button helpers
│       └── Storage.ts       # localStorage read/write wrapper
├── index.html
├── vite.config.ts
├── tsconfig.json
└── .eslintrc.json
```

---

## 5. Asset Pipeline

### 5.1 Images

Copy all PNGs from `legay_HaxeFlixel_src/assets/` to `public/assets/images/` unchanged.

### 5.2 Audio

Copy all MP3s to `public/assets/audio/` unchanged. `Silence.mp3` maps to the null/background sound used in `PlayScene`.

### 5.3 Bitmap Font Conversion

The original embeds four TTF fonts. Convert each to a bitmap font (`.png` spritesheet + `.xml` descriptor) using **Hiero** (cross-platform, Java) or **Bmfont** (Windows). Output goes to `public/assets/fonts/`.

| Original Font File | Family Name (original) | Usage | Recommended Size |
|---|---|---|---|
| `7x5.ttf` | `FEED` | News blurb text | 8px |
| `MotorolaScreentype.ttf` | `ARTICLEB` | Large article headline | 16px |
| `SILKWONDER.ttf` | `ARTICLEM` | Medium article text | 8px |
| `SG03.ttf` | `ARTICLES` | Small article text | 8px |

Each font produces two files, e.g. `feed.png` + `feed.xml`. Load in Phaser via `this.load.bitmapFont(key, png, xml)`.

---

## 6. Resolution & Scaling

- **Logical resolution:** 540 × 320
- **Display:** 1080 × 640 (2× pixel scale)
- **Scaling strategy:** `Phaser.Scale.FIT` with `autoCenter: Phaser.Scale.CENTER_BOTH`

```ts
scale: {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 540,
  height: 320,
}
```

This preserves aspect ratio and centers the canvas in the viewport on all screen sizes.

---

## 7. `main.ts` — Game Config

```ts
import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';
import { MorningScene } from './scenes/MorningScene';
import { PlayScene } from './scenes/PlayScene';
import { NightScene } from './scenes/NightScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 540,
  height: 320,
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 2,   // enable touch with 2 pointers
  },
  scene: [PreloadScene, MorningScene, PlayScene, NightScene],
};

new Phaser.Game(config);
```

---

## 8. Scene Architecture

### 8.1 Scene Flow

```
PreloadScene → MorningScene ⇄ PlayScene → NightScene → MorningScene (loop)
```

Scenes are started/stopped with `this.scene.start('SceneKey')`. No scene runs concurrently.

### 8.2 `PreloadScene`

**Responsibilities:** Load all assets, show a progress bar, then start `MorningScene`.

- Display a centered loading bar (white background, black border, filled rect that grows with load progress)
- Load images individually via `this.load.image(key, path)`
- Load audio via `this.load.audio(key, path)`
- Load bitmap fonts via `this.load.bitmapFont(key, pngPath, xmlPath)`
- On `complete`, call `this.scene.start('MorningScene')`

All asset key strings are defined as constants in `src/constants/AssetKeys.ts` (e.g. `export const ASSET_BACKGROUND = 'background'`).

### 8.3 `MorningScene`

**Responsibilities:** Show daily briefing message, logo, day number, stat meters (from day 2+), and a continue/game-over button.

**On `create()`:**
1. Read `GameState.instance` for current day, readership, goals
2. Compute the briefing message (port logic from `MorningState.as` exactly — same goal checks, same strings, same family/performance messages)
3. Replace `[GOV]` with `GameState.getGovName()` (see §10)
4. Show `StatMeters` component if `dayNumber > 1`
5. Play `mainMusic` (loop)
6. If `gameOver` → button label "Accept Fate", onClick → reset state and restart `MorningScene`
7. If normal → button label "Start Work", onClick → `this.scene.start('PlayScene')`
8. If rebels won ending → button label "Let's Go!", onClick → same as gameOver but flip `stateInControl`

**Debug keys** (dev mode only — see §13):
- `K` → increment `dayNumber`, restart `MorningScene`
- `O` → loyalty −10, restart `MorningScene`
- `P` → loyalty +10, restart `MorningScene`
- `N` → readerCount −100, restart `MorningScene`
- `M` → readerCount +100, restart `MorningScene`

### 8.4 `PlayScene`

**Responsibilities:** Core gameplay — timed newspaper editing.

**On `create()`:**
1. White background
2. Play null/silence sound as background (matches original behavior)
3. Create `Feed` component (left panel)
4. Create `Paper` component (right panel)
5. Create `Clock` component
6. Create `CenterPopup` component (hidden)
7. Create `StatMeters` component
8. Create "End Day" invisible button (top right area, matches original position)
9. Create `Day` instance to get this day's `NewsItem` list with appear times
10. Start day timer: `time = 0`, `speed = dayNumber === 1 ? 0.5 : 1`

**On `update(delta)`:**
1. Advance `time += (delta / 1000) * speed`
2. At 75% of `dayDuration` (60s): play alarm sound once
3. At 100% `dayDuration`: disable `Feed` and `Paper`, show `CenterPopup` ("The day is over..."), play dayOver sound
4. Each frame: check `Day.newsItems` for items whose `appearTime <= time` that aren't yet in the feed; add them via `feed.addBlurb(newsItem)`
5. Update `Clock` with `time / dayDuration`

**On "Send to Print" (popup confirm):**
1. `GameState.readership.applyPaperSummary(paper.getSummary())`
2. `paper.markNewsItemsUsed()`
3. `Storage.save()` (localStorage auto-save)
4. `this.scene.start('NightScene')`

**On "End Day" button:** set `speed = 10`

**Debug keys** (dev mode only):
- `K` → apply paper summary, mark used, increment day, start `PlayScene`
- `L` → show score overlay text

### 8.5 `NightScene`

**Responsibilities:** Show results (loyalty delta, reader count delta, comments), printed paper image, "Go to Sleep" button.

**On `create()`:**
1. Black background
2. Play `nightMusic` (loop)
3. Show `printedPaper` image centered
4. Show `StatMeters`
5. Build results message (port `NightState.as` format exactly)
6. "Go to Sleep" button → increment `dayNumber`, `this.scene.start('MorningScene')`

---

## 9. Game State Management

### 9.1 `GameState` Singleton (`src/game/GameState.ts`)

A TypeScript module-level singleton (not tied to Phaser's registry) holding all cross-scene state:

```ts
export class GameState {
  static instance: GameState = new GameState();

  dayNumber: number = 1;
  readership: Readership = new Readership();
  stateInControl: boolean = true;
  haveWonAtLeastOnce: boolean = false;

  reset(): void {
    this.readership = new Readership();
    this.dayNumber = 1;
    NewsItem.resetAllNewsItems();
  }

  static getGovName(): string {
    return GameState.instance.stateInControl ? 'Republia' : 'Democria';
  }

  static expandGovNames(str: string): string {
    return str.replace(/\[GOV\]/g, GameState.getGovName());
  }
}
```

Scenes access state via `GameState.instance` directly — no need for Phaser's registry since the singleton persists for the lifetime of the JS module.

### 9.2 Data Models

Port each class from the original AS3 1:1:

**`Readership`**
- Fields: `curLoyalty`, `preLoyalty`, `curReaderCount`, `preReaderCount`, `comments`
- Methods: `applyPaperSummary(ps: PaperSummary)`, `getLoyaltyDelta()`, `getReaderCountDelta()`
- Loyalty clamped to `[-Const.statMax, +Const.statMax]` (±30)
- Starting readers: `Const.readershipStartCount` (200)
- Readership bonus multiplier: `1 + 0.1 * floor((readerCount - 200) / 100)`

**`Goal`**
- Three hardcoded goals (same as original):
  1. `first-state`: loyalty ≥ 20 by day 3
  2. `second-state`: loyalty ≥ 20 AND readers ≥ 400 by day 5
  3. `last-rebel`: loyalty ≤ −30 AND readers ≥ 1000 by day 10
- Methods: `isMet()`, `getStatus()` (returns `kStatusNotWorking | kStatusWorkingTowards | kStatusMet`), `static getGoalForDay(day)`, `static getCurGoalStatus()`

**`NewsItem`**
- Same static array of all hardcoded news items (port verbatim from `NewsItem.as`)
- `[GOV]` replacement applied at read time via `GameState.expandGovNames()`
- `|`-delimited blurb text for rebel messages resolved via `Goal.getCurGoalStatus()`
- `isWeather()`: `blurbText.includes('Weather:')`
- `isRebelLeader()`: `blurbText.includes('***')`
- `used: boolean` reset via `NewsItem.resetAllNewsItems()`

**`Day`**
- Constructor takes `dayIndex: number`, selects 7–10 news items using same logic as original:
  1. Shuffle `NewsItem.allNewsItems`
  2. Partition into critical (day-range matched), weather (one), non-critical
  3. Splice to max 10 (or 8–9 if rebel message present)
  4. Shuffle result
  5. Assign random `appearTime` values (before 75% of day duration; halved on day 1)

**`PaperSummary`**
- Accumulates `numInterestingArticles`, `numArticles`, `articleCoveragePercentage`, `totalLoyaltyEffect`
- Size multipliers: S = 1×, M = 3×, B = 6×
- Coverage per article: S = 2/19, M = 4/19, B = 9/19 (max paper area = 4×5 − 1 = 19 grid units)

---

## 10. Layout & Constants (`src/constants/Const.ts`)

Mirror `Const.as` exactly:

```ts
export const Const = {
  s: 10,            // base pixel unit
  p: 50,            // page grid unit (5 × s)
  paperX: 330,      // 33 × s
  paperY: 40,       // 4 × s
  paperW: 200,      // 4 × p
  paperH: 250,      // 5 × p
  feedX: 60,        // 6 × s
  feedY: 0,
  feedW: 260,       // 26 × s
  feedH: 320,       // 32 × s
  buttonW: 120,
  dayDuration: 60,  // seconds
  statMax: 30,
  readershipStartCount: 200,
  readershipBonusThresh: 100,
} as const;
```

---

## 11. Components

### 11.1 `Paper` Component

Manages the newspaper layout area. Implemented as a plain TypeScript class (not a Phaser GameObject subclass); it creates and manages Phaser GameObjects internally via a passed scene reference.

**Internal state:**
- Pool of 30 `Article` objects (10 each of S, M, B sizes), all initially invisible
- `draggingArticle: Article | null`

**Article sizes:**
```ts
enum ArticleSize { S = 0, M = 1, B = 2 }
```

**Drag-and-drop (Phaser built-in):**
- Each `Article` sprite is set `setInteractive({ draggable: true })`
- Listen to scene-level `this.input.on('drag', ...)` to move article to pointer
- Listen to scene-level `this.input.on('dragend', ...)` to:
  1. Snap to grid: `paperX + p * round((x - paperX) / p)`
  2. Validate: not overlapping another article, not out of bounds → if invalid, hide article
  3. If valid, place and make visible

**Spawning from Feed:**
- `spawnArticleAtPointer(size, graphic, newsItem, pointer)`:
  1. Find an invisible `Article` of the matching size from the pool
  2. Set its position to current pointer position
  3. Make it visible
  4. Initiate drag via `scene.input.setDragState(pointer, article.sprite, 2)` (internal Phaser drag state = DRAGGING)
  5. Any previously dragging article is hidden first
  6. Hide other articles with the same `NewsItem`

**Overlap detection:** AABB check between article bounds (port `testArticleOverlapOther` logic). Overlapping articles tint red (`0xff0000`), non-overlapping tint white (`0xffffff`).

**`getSummary(): PaperSummary`** — iterates visible articles, builds summary.

**`markNewsItemsUsed()`** — sets `used = true` on visible articles' news items.

### 11.2 `Feed` Component

Left panel showing incoming news blurbs. Pool of 10 `Blurb` objects (all initially invisible), stacked top-to-bottom, animating in with smooth scroll (blurbs slide in from below).

**`addBlurb(newsItem: NewsItem)`:**
- Find first invisible blurb in pool
- Set its `newsItem`, update text, make visible
- Reduce `blurbsTopTarget` by blurb height
- Play feed sound

**Scroll animation:** Each `update()`, `blurbsTop` lerps toward `blurbsTopTarget` at 100px/sec.

**On pointer down in feed area:**
- Check each visible blurb for pointer overlap
- If pointer hits a size icon (S/M/B), call `paper.spawnArticleAtPointer(size, graphic, newsItem, pointer)`

**Blurb visual state:** Each blurb shows article size icons (S/M/B). A checkmark sprite overlays the currently placed size. A "dragging" sprite overlays the currently dragged size. Rebel leader blurb text is colored red.

### 11.3 `Clock` Component

Displays a visual clock showing time elapsed in the day. `setTime(fraction: number)` — updates the clock hand/display to the given 0–1 fraction of the day.

Port the visual rendering from `Clock.as` exactly.

### 11.4 `StatMeters` Component

Displays two stat bars: Loyalty and Readership. `setValues(readership: Readership, animate: boolean)` updates bar fill amounts. Port from `StatMeters.as`.

### 11.5 `CenterPopup` Component

A centered modal overlay. `show(message, buttonLabel, callback)` makes it visible. `hide()` hides it. Blocks interaction with Paper and Feed while visible (set `paper.enabled = false`, `feed.enabled = false`).

---

## 12. Persistence (`src/utils/Storage.ts`)

### 12.1 Save Key

`localStorage` key: `'republiatimes-save'`

### 12.2 Save Schema

```ts
interface SaveData {
  dayNumber: number;
  loyalty: number;
  readerCount: number;
  stateInControl: boolean;
  haveWonAtLeastOnce: boolean;
  usedNewsItemIndices: number[];  // indices into NewsItem.allNewsItems
  mute: boolean;
}
```

### 12.3 Save Trigger

`Storage.save()` is called once in `PlayScene` immediately after applying the paper summary and before transitioning to `NightScene`.

### 12.4 Load on Boot

In `PreloadScene` (before transitioning to `MorningScene`), call `Storage.load()`:
- If save exists → hydrate `GameState.instance` and mark used news items by index
- If no save → leave defaults (fresh game)
- Always apply `mute` preference to `Phaser.Sound.SoundManagerWebAudio`

### 12.5 `Storage` API

```ts
class Storage {
  static save(): void;     // serialize GameState → localStorage
  static load(): void;     // deserialize localStorage → GameState
  static clear(): void;    // delete save (used on game reset)
}
```

---

## 13. Audio

| Original Asset | Key Constant | Usage |
|---|---|---|
| `MainMusic.mp3` | `MUSIC_MAIN` | MorningScene background |
| `NightMusic.mp3` | `MUSIC_NIGHT` | NightScene background |
| `Silence.mp3` | `SOUND_NULL` | PlayScene background (workaround) |
| `Feed.mp3` | `SOUND_FEED` | Blurb appears (vol 0.25) |
| `Drag.mp3` | `SOUND_DRAG` | Article picked up |
| `Drop.mp3` | `SOUND_DROP` | Article released |
| `ButtonDown.mp3` | `SOUND_BTN_DOWN` | Button press |
| `ButtonUp.mp3` | `SOUND_BTN_UP` | Button release |
| `DayOver.mp3` | `SOUND_DAY_OVER` | Day timer expires (vol 0.25) |
| `Alarm.mp3` | `SOUND_ALARM` | 75% of day elapsed (vol 0.25) |
| `Click.mp3` | `SOUND_CLICK` | General click |

**Mute button:** Rendered in each scene using the `Mute.png` sprite as a toggle (2-frame spritesheet). On toggle, set `this.sound.mute = !this.sound.mute` and persist to `localStorage` via `Storage.saveMute()`.

---

## 14. Input & Touch Support

- Phaser is initialized with `activePointers: 2` to support touch
- All interactive elements use `setInteractive()` with no assumption of mouse-only
- Drag-and-drop uses Phaser's pointer events (works for both mouse and touch)
- The mute button and all UI buttons use Phaser's `Button`-equivalent (interactive image with `pointerdown`/`pointerup` events)

---

## 15. Debug Mode

Gated behind `import.meta.env.DEV` (Vite's built-in flag — automatically `false` in production builds).

```ts
if (import.meta.env.DEV) {
  this.input.keyboard?.on('keydown-K', () => { /* advance day */ });
  // ... other debug keys
}
```

**Available debug keys:**

| Key | Scene | Action |
|---|---|---|
| `K` | Morning + Play | Advance day |
| `O` | Morning | Loyalty −10 |
| `P` | Morning | Loyalty +10 |
| `N` | Morning | Reader count −100 |
| `M` | Morning | Reader count +100 |
| `L` | Play | Toggle score overlay |

---

## 16. [GOV] Name System

All user-visible strings containing `[GOV]` must be passed through `GameState.expandGovNames(str)` before display. This replaces `[GOV]` with `"Republia"` when `stateInControl = true` or `"Democria"` when `stateInControl = false`.

This applies to:
- All `NewsItem` blurb and article text
- All briefing messages in `MorningScene`
- The logo sprite selection (`logo.png` vs `logo2.png`, `logoSmall.png` vs `logoSmall2.png`)

---

## 17. Deliverables Checklist

- [ ] Vite + TypeScript project scaffolded with strict TS and ESLint
- [ ] All assets copied to `public/assets/`
- [ ] All 4 TTF fonts converted to bitmap font pairs and placed in `public/assets/fonts/`
- [ ] `PreloadScene` with loading bar
- [ ] `MorningScene` — all message branches, goals, game-over logic
- [ ] `PlayScene` — timer, feed, paper, drag-and-drop, popup
- [ ] `NightScene` — results display
- [ ] `GameState` singleton with all data models
- [ ] `Storage` utility (save/load/clear + mute)
- [ ] `Paper` component with grid snapping and overlap detection
- [ ] `Feed` component with scroll animation and spawn-to-paper
- [ ] `Clock`, `StatMeters`, `CenterPopup` components
- [ ] Mute toggle in all scenes, persisted to `localStorage`
- [ ] Touch input working for drag-and-drop
- [ ] Debug keys gated behind `import.meta.env.DEV`
- [ ] Scale mode FIT + centered at 540×320

---

## Annex A: Known Bug (Do Not Fix in MVP)

In `Readership.applyPaperSummary()`, the second branch of the readership bonus comparison is unreachable:

```as3
// original AS3 — both branches compare curReadershipBonus > preReadershipBonus
else if (curReadershipBonus > preReadershipBonus)  // ← dead code, never fires
{
  comments += "* The paper's decreasing readership has reduced its influence.\n";
}
```

This means the "decreasing readership influence" comment never appears. Port the bug as-is for MVP. Fix in a future iteration by changing the second condition to `<`.

---

## Annex B: Optional Improvements (Post-MVP)

### B.1 Texture Atlas
Pack all images into a single texture atlas using **TexturePacker** or **Shoebox**. Replace individual `this.load.image()` calls with `this.load.atlas()`. Reduces HTTP requests and improves render batching.

### B.2 Individual Asset Loader → Atlas
See B.1.

### B.3 Bug Fix: Dead Readership Comment Branch
Fix the unreachable `else if` in `Readership.applyPaperSummary()` (see Annex A).

### B.4 Responsive Font Scaling
At very large viewport sizes the pixel fonts may appear blurry. Consider adding a `pixelArt: true` flag to the Phaser config and ensuring nearest-neighbor scaling is applied to the canvas.

### B.5 Additional Save Slots
Expand `Storage` to support multiple save slots (e.g. one per `stateInControl` branch).

### B.6 Accessibility
Add keyboard navigation for article placement (tab to select blurb, arrow keys to position on paper, Enter to place).
