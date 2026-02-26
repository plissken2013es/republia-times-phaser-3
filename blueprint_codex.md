# Republia Times — Phaser 3 Port: Developer Blueprint (Codex)

## Strategy

The port is built in **four phases**, each of which produces runnable, testable code before the next begins:

1. **Foundation** — Project scaffold, tooling, constants, and all pure-TypeScript game logic (no Phaser). This layer is fully unit-testable with Vitest.
2. **Scene Shells** — Phaser boot, PreloadScene, and stub versions of all three game scenes wired together so navigation works end-to-end before any gameplay exists.
3. **Gameplay Core** — The Paper and Feed components, drag-and-drop, the day timer, and the CenterPopup. The game becomes playable.
4. **Completion & Integration** — Full scene content (all MorningScene message branches, NightScene results), localStorage persistence, mute, and debug mode.

---

## Phase Breakdown

```
Phase 1 — Foundation
  1.1  Project scaffold (Vite + TS + ESLint + Vitest + Phaser)
  1.2  Constants (Const.ts, AssetKeys.ts)
  1.3  NewsItem data class + PaperSummary
  1.4  Readership + Goal
  1.5  GameState singleton + Day selection + Util
  1.6  Storage (localStorage wrapper)

Phase 2 — Scene Shells
  2.1  PreloadScene (asset loading, progress bar)
  2.2  MorningScene stub (logo, day text, "Start Work" button)
  2.3  NightScene stub (black bg, "Go to Sleep" button)
  2.4  Clock + StatMeters components wired into stubs

Phase 3 — Gameplay Core
  3.1  PlayScene timer + Clock + "End Day" button
  3.2  Paper component — article pool + grid snapping + overlap
  3.3  Feed component — blurb pool + scroll animation + size icons
  3.4  Feed → Paper drag integration
  3.5  CenterPopup + PlayScene completion (appear times, popup, transition)

Phase 4 — Completion & Integration
  4.1  NightScene — full results display
  4.2  MorningScene — all message branches, goal/game-over logic
  4.3  localStorage save/load wired end-to-end
  4.4  Mute button in all scenes + persistence
  4.5  Debug mode (dev-only keys)
```

---

## Step-Level Breakdown

Each step maps to exactly one prompt below.

| Prompt | Title | Builds On |
|--------|-------|-----------|
| 1 | Project Scaffold | — |
| 2 | Constants & Asset Keys | 1 |
| 3 | NewsItem & PaperSummary | 2 |
| 4 | Readership & Goal | 3 |
| 5 | GameState, Day, Util | 4 |
| 6 | Storage | 5 |
| 7 | PreloadScene | 6 |
| 8 | MorningScene Stub | 7 |
| 9 | NightScene Stub | 8 |
| 10 | Clock & StatMeters | 9 |
| 11 | PlayScene — Timer & Day | 10 |
| 12 | Paper Component | 11 |
| 13 | Feed Component | 12 |
| 14 | Feed → Paper Drag Integration | 13 |
| 15 | CenterPopup & PlayScene Completion | 14 |
| 16 | NightScene — Full Results | 15 |
| 17 | MorningScene — All Branches | 16 |
| 18 | localStorage End-to-End | 17 |
| 19 | Mute Button & Persistence | 18 |
| 20 | Debug Mode | 19 |

---

## Prompts

---

### Prompt 1 — Project Scaffold

```
You are setting up a new Phaser 3 game project from scratch. The game is called "Republia Times" — a port of a Flash game. Your job is to scaffold the project with the exact tooling specified below. Do not implement any game logic yet.

## Tech Stack
- Vite (latest) with vanilla-ts template
- TypeScript (strict mode)
- Phaser 3 (latest stable, ≥ 3.60)
- Vitest for unit testing
- ESLint with @typescript-eslint

## Steps

1. Create the project with:
   npm create vite@latest republia-times -- --template vanilla-ts

2. Install dependencies:
   npm install phaser
   npm install -D vitest @vitest/ui eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

3. Replace tsconfig.json with:
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}

4. Replace vite.config.ts with:
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

5. Create .eslintrc.json:
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  },
  "env": { "browser": true, "es2020": true }
}

6. Add to package.json scripts:
  "test": "vitest run",
  "test:ui": "vitest --ui"

7. Create src/main.ts with a minimal Phaser game that displays a white canvas and the text "Loading..." centered on screen at 540x320. Use Phaser.AUTO renderer. Configure scale mode to Phaser.Scale.FIT with autoCenter Phaser.Scale.CENTER_BOTH. Register a single inline scene called BootScene that just adds the text. Do NOT import any game-specific files yet.

8. Create a minimal index.html that loads the Vite entry point with a dark body background so the white canvas is visible.

9. Create src/main.test.ts with one trivial Vitest test (e.g. `expect(1 + 1).toBe(2)`) to confirm the test runner works.

## Expected Result
- `npm run dev` opens a browser showing a white 540x320 canvas (scaled to fit) with centered "Loading..." text.
- `npm test` passes with one test.
- No TypeScript errors.
- No ESLint errors.
```

---

### Prompt 2 — Constants & Asset Keys

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The project was scaffolded in the previous step with Vite, strict TypeScript, ESLint, and Vitest. A minimal BootScene is shown in the browser.

Your task is to create two constant files that all future code will import. Do not modify main.ts or any scene files.

## File 1: src/constants/Const.ts

Create an exported const object called Const with the following values (all are pixel measurements unless noted):

- s: 10          — base pixel unit
- p: 50          — page grid unit (5 × s)
- paperX: 330    — 33 × s, left edge of newspaper layout area
- paperY: 40     — 4 × s, top edge of newspaper layout area
- paperW: 200    — 4 × p, width of newspaper layout area
- paperH: 250    — 5 × p, height of newspaper layout area
- feedX: 60      — 6 × s, left edge of news feed panel
- feedY: 0       — top edge of news feed panel
- feedW: 260     — 26 × s, width of news feed panel
- feedH: 320     — 32 × s, height of news feed panel
- buttonW: 120
- dayDuration: 60   — seconds per in-game day
- statMax: 30       — maximum absolute loyalty value (loyalty is clamped to ±30)
- readershipStartCount: 200  — starting reader count
- readershipBonusThresh: 100 — every 100 readers above 200 adds 10% loyalty multiplier

Use `as const` so all values are readonly literals.

## File 2: src/constants/AssetKeys.ts

Create exported string constants for every asset the game uses. Use SCREAMING_SNAKE_CASE. Group by type with a comment per group.

Images:
  IMG_BACKGROUND, IMG_MORNING, IMG_PRINTED_PAPER,
  IMG_LOGO, IMG_LOGO2, IMG_LOGO_SMALL, IMG_LOGO_SMALL2,
  IMG_ARTICLE_S, IMG_ARTICLE_M, IMG_ARTICLE_B,
  IMG_BLURB, IMG_BLURB_CHECK,
  IMG_BLURB_ARTICLE_S, IMG_BLURB_ARTICLE_M, IMG_BLURB_ARTICLE_B,
  IMG_BUTTON, IMG_STAT_METER, IMG_CENTER_POPUP,
  IMG_DRAGGING, IMG_MUTE, IMG_CURSOR

Audio:
  MUSIC_MAIN, MUSIC_NIGHT,
  SFX_NULL, SFX_FEED, SFX_DRAG, SFX_DROP,
  SFX_BTN_DOWN, SFX_BTN_UP, SFX_DAY_OVER, SFX_ALARM, SFX_CLICK

Fonts:
  FONT_FEED, FONT_ARTICLE_B, FONT_ARTICLE_M, FONT_ARTICLE_S

## File 3: src/constants/Const.test.ts

Write Vitest unit tests that verify:
- Const.p === Const.s * 5
- Const.paperX === Const.s * 33
- Const.paperW === Const.p * 4
- Const.paperH === Const.p * 5
- Const.feedW === Const.s * 26
- Const.statMax === 30
- Const.dayDuration === 60

## Expected Result
- `npm test` passes all tests including the new Const tests.
- No TypeScript or ESLint errors.
- No changes to main.ts or any scene.
```

---

### Prompt 3 — NewsItem & PaperSummary

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Vite + TypeScript (strict) + Vitest + ESLint project scaffold
- src/constants/Const.ts — layout constants
- src/constants/AssetKeys.ts — asset key strings

Your task is to implement two pure game-logic classes. These have zero Phaser dependency and must be fully unit-testable.

---

## File 1: src/game/NewsItem.ts

### ArticleSize enum
export enum ArticleSize { S = 0, M = 1, B = 2 }

### NewsItem class
Properties (all public):
- dayRangeStart: number  — 0 = any day; positive = earliest day this item appears
- dayRangeEnd: number    — 0 = any day; -1 = only on dayRangeStart; positive = latest day
- loyaltyEffect: number  — +1, -1, or 0
- interesting: boolean   — whether this article attracts readers
- used: boolean = false  — marked true after the day it was placed ends

Private properties:
- blurbText: string      — short summary shown in the feed panel
- articleText: string | null — headline shown on the placed article (null for rebel messages)

Static constants:
- LOYALTY_UP = 1
- LOYALTY_DOWN = -1
- LOYALTY_NONE = 0

### Methods
- isWeather(): boolean — returns true if blurbText includes 'Weather:'
- isRebelLeader(): boolean — returns true if blurbText includes '***'
- hasArticleText(): boolean — returns articleText !== null
- getBlurbText(): string — returns blurbText (do NOT apply [GOV] substitution here; that belongs to GameState which doesn't exist yet — return raw string for now, substitution will be wired in Prompt 5)
- getArticleText(): string — returns articleText ?? '' (raw, no substitution yet)
- static resetAllNewsItems(): void — sets used = false on every item in allNewsItems

### Static data: allNewsItems
Create a static array of NewsItem instances exactly matching the original game content. Organize with comments by category:

PLOT (rebel messages — articleText is null, blurbText uses '***' prefix, '|'-delimited for goal-status variants):
  new NewsItem(1, 3, LOYALTY_UP, true, 'The rebellion has been crushed. Peace returns to all sectors', 'Rebellion Crushed, Peace Restored!')
  new NewsItem(3, -1, LOYALTY_NONE, true, '*** ####....##...####..## ***', null)
  new NewsItem(4, -1, LOYALTY_NONE, true, '*** Est#blishing secure chan#el. Aw#it further# comm###ication ***', null)
  new NewsItem(6, -1, LOYALTY_NONE, true, '*** #Please hear me. I am Kurstov, leader of#the rebellion. We need your help. ***', null)
  new NewsItem(7, -1, LOYALTY_NONE, true, '*** We can rescue your family. Sow disloyalty to strengthen the rebels. You have 4 days. ***', null)
  new NewsItem(8, -1, LOYALTY_NONE, true, '*** Please help us. The government\'s tyranny must end! Place negative articles! ***|*** Your family will soon be safe! Drop the public\'s loyalty to -30 and get 1000 readers in 3 days! ***|*** It\'s working! Your efforts have strengthened us unimaginably! ***', null)
  new NewsItem(9, -1, LOYALTY_NONE, true, '*** The government cannot win! Seal their fate! Place negative articles! ***|*** Your family\'s safety is assured! Convince 1000 readers to be disloyal in 2 days! ***|*** Yes! Our operations are in order. Soon we overthrow! ***', null)
  new NewsItem(10, -1, LOYALTY_NONE, true, '*** We have no time! The people must be free! Spread negative news! ***|*** Our time is at hand! Hurry! Get 1000 readers with -30 loyalty by the end of today! ***|*** Oh glorious day! We strike at sundown. Prepare yourself! ***', null)

PLOT (rebel vs state conflict):
  new NewsItem(7, 100, LOYALTY_UP, true, 'Terrorist rebel hideout near Central Chem destroyed', 'Rebels Routed At Factory!')
  new NewsItem(8, 100, LOYALTY_DOWN, true, 'Rebels at Central Chem sabotage important machinary', 'Factory Sabotaged!')
  new NewsItem(9, 100, LOYALTY_UP, true, 'Terrorist 2nd-in-command captured. Renounces fight against [GOV]', 'Terrorist Leader Buckles!')
  new NewsItem(10, 100, LOYALTY_DOWN, true, 'Rebels regroup in western towns. Growing in strength and number.', 'Rebels Gaining Support!')

WAR (dayRangeStart=0, dayRangeEnd=0, all interesting):
  9 LOYALTY_UP items:
    '[GOV] forces have destroyed Antegria\'s illegal satellites' / '[GOV] Downs Enemy Satellite!'
    '[GOV] borders have been reinforced with 200,000 additional troops' / 'Borders Reinforced!'
    'State-of-the-art military spy satellites now used to reduce crime' / 'Keeping An Eye On Crime!'
    '[GOV] Navy commissions an additional 500 destroyers to patrol coast' / 'Safeguarding The Coasts!'
    '[GOV] Air Force tactical fighter sets new speed record' / 'Faster Fighter Flown!'
    'Multiple terrorist cells in central district foiled in operation' / 'Central Terrorists Terminated!'
    '[GOV] Army 5th Divison shuts down bomb factory in northern mountains' / 'Bomb Factory Found, Destroyed!'
    '[GOV] soldiers strongest in the world according to latest tests' / 'Our Boys Are the Best!'
    'Peace enforcement squad rounds up 200 terrorist rebels' / 'Peace Restored, Rebels Captured!'
  10 LOYALTY_DOWN items:
    '40,000 gallons of military gasoline stolen from western bases' / 'Military Gas Gone!'
    'Critical oil fields in the north have been sabotaged' / 'Pipelines Crippled!'
    'Terrorist bomb explodes on northern bay ferry. 600 people missing' / 'Explosion Rocks The Seas!'
    '[GOV] Air Force tactical fighter test flight ends in crash. Crew lost' / 'Futuristic Fight Crashes, Burns!'
    '[GOV] Navy identifies critical fault in all operational submarines' / 'Our Subs Are Faulty!'
    'The top general in charge of southern forces has died suddenly' / 'General Dies Overnight!'
    'Antegria secret code remains unbreakable. Top [GOV] minds are flumoxed' / 'The Enemy\'s Unbreakable Code!'
    'Tank production falls behind schedule. Poor factory conditions blamed' / 'Tanking Tanks!'
    'Worldwide survey finds [GOV] soldiers worst trained, with worst aim' / 'Our Boys Can\'t Fire Straight!'
    'Antegria Navy sinks [GOV] battleship off eastern coast' / '[GOV] Battleship Bested!'

POLITICS (dayRangeStart=0, dayRangeEnd=0, NOT interesting):
  5 LOYALTY_UP items:
    'The Honorable and Great Leader awarded Lifetime Glory medal' / 'A Lifetime of Glory!'
    'Agricultural output from the farming sector doubles for 10th straight month' / 'More Corn Than Air!'
    'Income reallocation scheme contributes 400 million to schools. Proves system works' / 'Education Spending Up!'
    'Latest polls show broad satisfaction with government leaders' / 'Politics Polls Positive!'
    'Newest regional administrator fights for worker\'s rights' / 'Power To The People!'
  5 LOYALTY_DOWN items:
    'Party officials have voted to adjust ration quotas for all orphans' / 'Less Food For Orphans'
    'The Honorable and Great Leader photographed in women\'s clothes' / 'Great Leader, In A Dress!'
    '30,000 teachers and academics reassigned to more useful labor tasks' / 'Educators Punished For Being Smart!'
    'Local citizen council votes will be eliminated in favor of suggestive comments' / 'Local Councils Lose Vote!'
    'Yearly donations to the state must increase to support growing government oversight' / 'Taxes Rise For 8th Year!'

WEATHER (dayRangeStart=0, dayRangeEnd=0, LOYALTY_NONE, interesting):
  10 items — blurbText starts with 'Weather:':
    'Weather: Skies and temperatures will remain calm today' / 'Another Sunny Day!'
    'Weather: Storms predicted to wash western coast out to sea' / 'Western Storms Threaten Coast!'
    'Weather: Forecast expects heavy rains in the north and east' / 'Showers Rain Down!'
    'Weather: Expect unseasonal snow in the south' / 'Blizzard Incoming?'
    'Weather: Sunny morning and cloudy evening for the day' / 'Warm To Cloudy!'
    'Weather: Light showers throughout the day' / 'Warm To Cloudy This Week!'
    'Weather: Hurricane-level winds spotted off eastern coast' / 'Eastern Hurricanes Return!'
    'Weather: Clear skies and no sign of rain' / 'Another Dry Day!'
    'Weather: Freezing sleet and snow expected in northern mountains' / 'Buckle Down For Ice!'
    'Weather: Tropical breezes blow across southeastern coast' / 'Sea Breeze Incoming!'

SPORTS (dayRangeStart=0, dayRangeEnd=0, interesting):
  5 LOYALTY_UP, 1 LOYALTY_NONE, 4 LOYALTY_DOWN — copy from original source
  Includes timed items: dayRangeStart=2/-1 for Chad & Jenlyn wedding arc

ENTERTAINMENT (dayRangeStart=0 mostly, interesting):
  Mix of UP/NONE/DOWN — copy from original source
  Includes timed items for Chad & Jenlyn divorce (dayRangeStart=6, dayRangeEnd=-1)

---

## File 2: src/game/PaperSummary.ts

Properties:
- numInterestingArticles: number = 0
- numArticles: number = 0
- articleCoveragePercentage: number = 0
- totalLoyaltyEffect: number = 0

Method: applyNewsItem(newsItem: NewsItem, articleSize: ArticleSize): void
  - Increment numArticles
  - If newsItem.interesting: increment numInterestingArticles
  - Size multipliers: S=1, M=3, B=6
  - totalLoyaltyEffect += newsItem.loyaltyEffect * multiplier
  - Coverage: max paper area = 19 (grid units). Add to articleCoveragePercentage:
      S: 2/19 (1×2 footprint)
      M: 4/19 (2×2 footprint)
      B: 9/19 (3×3 footprint)

Method: toString(): string — human-readable summary for debug overlay

---

## File 3: src/game/NewsItem.test.ts

Write Vitest tests covering:
- Total count of allNewsItems is exactly 64
- isWeather() returns true only for items whose blurbText starts with 'Weather:'
- isRebelLeader() returns true only for items whose blurbText includes '***'
- hasArticleText() returns false when articleText is null
- resetAllNewsItems() sets all used flags to false
- At least 1 item with dayRangeStart=1 and dayRangeEnd=3 exists (the "rebellion crushed" item)

## File 4: src/game/PaperSummary.test.ts

Write Vitest tests covering:
- Applying a LOYALTY_UP interesting B article: totalLoyaltyEffect=6, numInterestingArticles=1, coverage≈0.473
- Applying a LOYALTY_DOWN non-interesting S article: totalLoyaltyEffect=-1, numInterestingArticles=0, coverage≈0.105
- Applying mixed articles accumulates correctly
- Coverage for B article is 9/19

## Expected Result
- `npm test` passes all tests.
- Zero Phaser imports in these files.
- No TypeScript errors.
```

---

### Prompt 4 — Readership & Goal

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Vite + TypeScript (strict) + Vitest + ESLint project
- src/constants/Const.ts — layout constants (statMax=30, readershipStartCount=200, readershipBonusThresh=100)
- src/game/NewsItem.ts — all news content + ArticleSize enum
- src/game/PaperSummary.ts — paper evaluation logic

Your task is to implement two more pure-logic classes with no Phaser dependency.

---

## File 1: src/game/Readership.ts

### Constructor
constructor(loyalty: number = 0, readers: number = Const.readershipStartCount)

### Properties
- curLoyalty: number
- preLoyalty: number
- curReaderCount: number
- preReaderCount: number
- comments: string = ''

### Private static method
getReadershipBonus(readerCount: number): number
  Returns: 1 + 0.1 * Math.floor((readerCount - Const.readershipStartCount) / Const.readershipBonusThresh)
  Example: 200 readers → 1.0, 300 readers → 1.1, 500 readers → 1.3

### Methods
applyPaperSummary(ps: PaperSummary): void
  - Save preLoyalty and preReaderCount
  - Apply loyalty: curLoyalty += ps.totalLoyaltyEffect * bonus
  - Clamp loyalty to [-Const.statMax, +Const.statMax]
  - Apply reader count:
    + If ps.articleCoveragePercentage < 0.25: -50 readers
    + Else if < 0.5: +0 readers
    + Else if < 0.75: +75 readers
    + Else: +100 readers
  - Add +50 readers if ps.numInterestingArticles ≥ 2
  - Compute comments exactly like original (including the known bug in the decreasing readership branch: the second branch uses `>` again instead of `<`)

getLoyaltyDelta(): number
getReaderCountDelta(): number

---

## File 2: src/game/Goal.ts

### Goal class
Properties:
- id: string
- targetDayNumber: number
- targetLoyalty: number
- targetReaderCount: number | null

Static goals array: three goals (port exactly from specs):
1. first-state — loyalty ≥ 20 by day 3
2. second-state — loyalty ≥ 20 AND readers ≥ 400 by day 5
3. last-rebel — loyalty ≤ -30 AND readers ≥ 1000 by day 10

Methods:
- isMet(readership: Readership): boolean
- getStatus(readership: Readership): number (kStatusNotWorking, kStatusWorkingTowards, kStatusMet)
- static getGoalForDay(day: number): Goal | null
- static getCurGoalStatus(): number

---

## File 3: src/game/Readership.test.ts

Write Vitest tests for:
- Loyalty clamping at ±Const.statMax
- Reader count delta changes for coverage thresholds
- Bonus multiplier behavior
- The known bug is preserved (the decreasing influence comment never appears)

## File 4: src/game/Goal.test.ts

Write Vitest tests for:
- Each goal is met with the correct thresholds
- getGoalForDay returns correct goal for days 1–10
- getCurGoalStatus returns correct status for a mocked Readership

## Expected Result
- `npm test` passes.
- No Phaser imports.
```

---

### Prompt 5 — GameState, Day, Util

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- All pure logic classes and tests from prompts 2–4

Your task is to add GameState, Day selection logic, and utility helpers.

## File 1: src/game/GameState.ts

Implement a singleton:

export class GameState {
  static instance: GameState = new GameState();

  dayNumber: number = 1;
  readership: Readership = new Readership();
  stateInControl: boolean = true;
  haveWonAtLeastOnce: boolean = false;
  savedMute: boolean = false;

  reset(): void {
    this.readership = new Readership();
    this.dayNumber = 1;
    NewsItem.resetAllNewsItems();
  }

  static getGovName(): string { ... }
  static expandGovNames(str: string): string { ... }
}

## File 2: src/game/Day.ts

Implement day selection logic exactly as in specs:
- Select critical (day-range matched), weather (one), non-critical
- Shuffle pools (use Util.shuffleArray)
- Ensure rebel message rules (if rebel leader present, use 8–9 items; else 10)
- Assign appearTime randomly before 75% of day duration (halve for day 1)

## File 3: src/utils/Util.ts

Add:
- shuffleArray<T>(arr: T[]): T[] (Fisher–Yates, return new array)
- clamp(value, min, max)

## Tests

Add Vitest tests:
- shuffleArray returns a permutation of the same elements
- clamp works for in-range and out-of-range values
- Day produces 7–10 items, includes exactly 1 weather item, and uses critical items when in range

## Expected Result
- `npm test` passes.
- All pure logic files remain Phaser-free.
```

---

### Prompt 6 — Storage

```
You are working on a Phaser 3 TypeScript game called "Republia Times".

Your task is to implement localStorage persistence.

## File: src/utils/Storage.ts

Implement a Storage class with:
- save(): void
- load(): boolean
- clear(): void
- getMute(): boolean
- setMute(muted: boolean): void

Schema (versioned):
interface SaveData {
  version: 1;
  dayNumber: number;
  loyalty: number;
  readerCount: number;
  stateInControl: boolean;
  haveWonAtLeastOnce: boolean;
  usedNewsItemIndices: number[];
  mute: boolean;
}

Behavior:
- save serializes GameState.instance into localStorage key 'republiatimes-save'
- load returns false if no save or invalid schema/version
- load restores used news items by index
- getMute reads from save if present, else false
- setMute updates mute and re-saves
- wrap localStorage access in try/catch

## Tests

Add tests for:
- isValidSaveData with correct/incorrect versions
- load returns false for invalid data
- save followed by load restores dayNumber, loyalty, readerCount

Use a localStorage mock for Vitest.
```

---

### Prompt 7 — PreloadScene

```
Implement PreloadScene with a progress bar and full asset loading. Use keys from AssetKeys.

Requirements:
- Create a white background.
- Add a centered loading bar (outlined rectangle + fill that grows with progress).
- Load all images, audio, and bitmap fonts from public/assets.
- Load Mute.png as a spritesheet with frame size 12x12.
- On complete, call Storage.load(), apply GameState.instance.savedMute, and start MorningScene.
```

---

### Prompt 8 — MorningScene Stub

```
Create a minimal MorningScene stub:
- White background.
- Show logo sprite and day number.
- Add "Start Work" button that goes to PlayScene.
- No message logic yet.
- Use placeholder text for now.
```

---

### Prompt 9 — NightScene Stub

```
Create a minimal NightScene stub:
- Black background.
- Show printed paper image centered.
- Add "Go to Sleep" button that increments dayNumber and starts MorningScene.
- No results logic yet.
```

---

### Prompt 10 — Clock & StatMeters

```
Implement Clock and StatMeters components and wire them into MorningScene and NightScene stubs.
- Clock.setTime(fraction) updates display.
- StatMeters.setValues(readership, animate) updates bars.
Use placeholder visuals if needed but match positions from Const.
```

---

### Prompt 11 — PlayScene — Timer & Day

```
Implement PlayScene shell:
- White background, clock, stat meters.
- Instantiate Day and advance time with speed (day 1 speed 0.5).
- Add "End Day" button that sets speed to 10.
- At 75% play alarm sound, at 100% show popup placeholder and stop.
```

---

### Prompt 12 — Paper Component

```
Implement the Paper component:
- Pool of 30 articles (10 per size)
- Drag-and-drop via Phaser input
- Grid snapping, bounds checking, overlap detection (tint red on overlap)
- Methods: spawnArticleAtPointer, getSummary, markNewsItemsUsed
Add a temporary dev harness scene to manually test snapping/overlap, then remove it once integrated.
```

---

### Prompt 13 — Feed Component

```
Implement the Feed component:
- Pool of 10 blurbs with scroll animation
- Add blurbs with addBlurb(newsItem)
- Detect pointer clicks on S/M/B icons and call paper.spawnArticleAtPointer
- Render rebel leader blurbs in red
Add a temporary dev harness to inject sample NewsItems, then remove after integration.
```

---

### Prompt 14 — Feed → Paper Drag Integration

```
Wire Feed to Paper inside PlayScene:
- Feed adds blurbs as Day items appear
- Clicking S/M/B spawns corresponding article and starts drag
- Ensure only one active drag at a time
```

---

### Prompt 15 — CenterPopup & PlayScene Completion

```
Implement CenterPopup component:
- show(message, buttonLabel, callback)
- hide()
- Blocks interaction with Feed/Paper when visible

Wire PlayScene completion:
- On day end, disable Feed/Paper, show popup
- On confirm, apply paper summary, mark used, Storage.save(), go to NightScene
```

---

### Prompt 16 — NightScene — Full Results

```
Implement full NightScene:
- Display results summary text from Readership
- Show printed paper image and StatMeters
- Play night music loop
- "Go to Sleep" button increments day and starts MorningScene
```

---

### Prompt 17 — MorningScene — All Branches

```
Implement full MorningScene message logic:
- Port all goal/game-over/rebel branches exactly
- Apply [GOV] substitution
- Play main music loop
- Correct button labels for rebel win or game over
- Use StatMeters for day>1
```

---

### Prompt 18 — localStorage End-to-End

```
Harden save/load integration:
- Add versioning to Storage schema if not already
- Ensure GameState.savedMute is applied before music plays
- Verify usedNewsItems persist across reloads
- Add manual verification checklist in comments
```

---

### Prompt 19 — Mute Button & Persistence

```
Implement a reusable MuteButton component:
- Uses IMG_MUTE spritesheet frames (0 = unmuted, 1 = muted)
- Toggles scene.sound.mute and updates GameState.savedMute
- Persists via Storage.setMute

Wire into MorningScene, PlayScene, NightScene.
```

---

### Prompt 20 — Debug Mode

```
Add dev-only debug keys (import.meta.env.DEV):
- MorningScene: K/O/P/N/M adjust day/loyalty/readers
- PlayScene: K advance day via summary; L toggles score overlay
- Remove keyboard listeners on shutdown
Ensure production build excludes debug code.
```

---

## Appendix: Annex Items (Post-MVP)

These are not part of any prompt above. Implement after the MVP is verified complete.

### A. Known Bug — Dead Readership Comment Branch
In Readership.applyPaperSummary(), the second bonus comment branch has an identical condition to the first (`>` instead of `<`). The comment "The paper's decreasing readership has reduced its influence" never fires. Fix by changing the second condition to `<`.

### B. Texture Atlas
Replace individual image loads with a texture atlas to reduce HTTP requests.

### C. Pixel Art Scaling
Add `pixelArt: true` to Phaser config if fonts or sprites appear blurry at large viewport sizes.

### D. Accessibility — Keyboard Article Placement
Add keyboard navigation for blurbs and paper placement.
