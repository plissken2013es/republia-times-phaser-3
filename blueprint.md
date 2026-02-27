# Republia Times — Phaser 3 Port: Developer Blueprint

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
  Example: 200 readers → 1.0, 300 readers → 1.1, 400 readers → 1.2

### Public methods
- getLoyaltyDelta(): number — curLoyalty - preLoyalty
- getReaderCountDelta(): number — curReaderCount - preReaderCount
- toString(): string — human-readable, e.g. "L:15(+5) R:300(+100)"

- applyPaperSummary(paperSummary: PaperSummary): void
  Logic (port exactly from original, preserving the known dead-code bug):

  1. Save preLoyalty = curLoyalty, preReaderCount = curReaderCount
  2. Reset comments = ''
  3. curLoyalty += paperSummary.totalLoyaltyEffect * getReadershipBonus(preReaderCount)
  4. Clamp curLoyalty to [-Const.statMax, +Const.statMax]

  5. If articleCoveragePercentage === 0:
       comments += '* The paper is blank. Money was saved on ink, but you have lost many readers.\n'
       curReaderCount *= 0.5
     Else if articleCoveragePercentage < 0.75:
       comments += '* There are too few articles. You have lost readers.\n'
       curReaderCount *= 0.75

  6. If numInterestingArticles < 2:
       comments += '* There are not enough interesting articles. You have lost readers.\n'
       curReaderCount *= 0.9
     Else if numInterestingArticles > 2:
       comments += '* There are many interesting articles. You have gained readers.\n'
       curReaderCount *= 1.25

  7. If curLoyalty > preLoyalty:
       comments += '* The included articles have increased your readership\'s loyalty to the government.\n'
     If curLoyalty < preLoyalty:
       comments += '* The included articles have decreased your readership\'s loyalty to the government.\n'

  8. Compute preReadershipBonus = getReadershipBonus(preReaderCount)
     Compute curReadershipBonus = getReadershipBonus(curReaderCount)
     If curReadershipBonus > preReadershipBonus:
       comments += '* The paper\'s increasing readership has expanded its influence.\n'
     Else if curReadershipBonus > preReadershipBonus:  ← PORT THIS BUG AS-IS (dead branch)
       comments += '* The paper\'s decreasing readership has reduced its influence.\n'

---

## File 2: src/game/Goal.ts

### GoalStatus enum
export enum GoalStatus { None = 0, NotWorking = 1, WorkingTowards = 2, Met = 3 }

### Goal class

Static data — three hardcoded goals in order:
  new Goal('first-state',  3,  20,    0)   — loyalty ≥ 20 by day 3
  new Goal('second-state', 5,  20,  400)   — loyalty ≥ 20 AND readers ≥ 400 by day 5
  new Goal('last-rebel',  10, -30, 1000)   — loyalty ≤ -30 AND readers ≥ 1000 by day 10

Properties: id: string, targetDayNumber: number, targetLoyalty: number, targetReaderCount: number

Constructor: constructor(id, targetDayNumber, targetLoyalty, targetReaderCount)

The Goal class must NOT import GameState (circular dependency risk). Instead, isMet() and getStatus() accept a Readership argument:

- isMet(readership: Readership): boolean
    If targetLoyalty < 0 and readership.curLoyalty > targetLoyalty → false
    If targetLoyalty > 0 and readership.curLoyalty < targetLoyalty → false
    If targetReaderCount > 0 and readership.curReaderCount < targetReaderCount → false
    Return true

- getStatus(readership: Readership): GoalStatus
    If isMet(readership) → GoalStatus.Met
    If working towards negative loyalty (curLoyalty > targetLoyalty and loyaltyDelta < 0) → GoalStatus.WorkingTowards
    If working towards positive loyalty (curLoyalty < targetLoyalty and loyaltyDelta > 0) → GoalStatus.WorkingTowards
    If reader target not met but readerCountDelta > 0 → GoalStatus.WorkingTowards
    If none of the above → GoalStatus.NotWorking

- toString(): string

Static methods:
- static getGoalForDay(dayNumber: number): Goal | null
    Returns the first goal whose targetDayNumber >= dayNumber; null if past all goals

---

## File 3: src/game/Readership.test.ts

Tests:
- New Readership() has curLoyalty=0, curReaderCount=200
- applyPaperSummary with blank paper halves reader count, loyalty unchanged (0*multiplier=0)
- applyPaperSummary with 3 interesting B articles of LOYALTY_UP: loyalty increases, readers increase by 25%
- Loyalty is clamped to +30 even with extreme input
- Loyalty is clamped to -30 even with extreme input
- getReadershipBonus returns 1.0 at 200 readers, 1.1 at 300, 1.2 at 400
- getLoyaltyDelta returns difference after applyPaperSummary
- comments string is non-empty after applyPaperSummary

## File 4: src/game/Goal.test.ts

Tests:
- getGoalForDay(1) returns the 'first-state' goal
- getGoalForDay(3) returns the 'first-state' goal
- getGoalForDay(4) returns the 'second-state' goal
- getGoalForDay(10) returns the 'last-rebel' goal
- getGoalForDay(11) returns null
- isMet returns true when conditions are satisfied
- isMet returns false when loyalty target not met
- isMet returns false when reader count target not met
- getStatus returns GoalStatus.WorkingTowards when loyalty is moving in the right direction

## Expected Result
- `npm test` passes all tests.
- Zero Phaser imports.
- No TypeScript errors.
```

---

### Prompt 5 — GameState, Day, and Util

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- src/constants/Const.ts, src/constants/AssetKeys.ts
- src/game/NewsItem.ts (+ ArticleSize enum, all news content)
- src/game/PaperSummary.ts
- src/game/Readership.ts
- src/game/Goal.ts (+ GoalStatus enum)

Your task is to implement three more pure-logic modules.

---

## File 1: src/utils/Util.ts

### shuffleArray<T>(array: T[]): T[]
Fisher-Yates shuffle. Mutates the array in place and also returns it.
for i from 0 to array.length - 1:
  randomIndex = Math.floor(Math.random() * array.length)
  swap array[i] and array[randomIndex]

---

## File 2: src/game/GameState.ts

A module-level singleton that holds all cross-scene persistent state.

```typescript
import { Readership } from './Readership';
import { NewsItem } from './NewsItem';
import { Goal, GoalStatus } from './Goal';

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

  static getCurGoalStatus(): GoalStatus {
    const goal = Goal.getGoalForDay(GameState.instance.dayNumber);
    if (!goal) return GoalStatus.None;
    return goal.getStatus(GameState.instance.readership);
  }
}
```

Now update NewsItem.ts to complete the [GOV] substitution and '|' variant resolution:
- getBlurbText(): apply getProcessedText(this.blurbText)
- getArticleText(): apply getProcessedText(this.articleText ?? '')
- private getProcessedText(str: string): string
    If str contains '|':
      Split on '|' into tokens
      const status = GameState.getCurGoalStatus()  — import GameState
      str = tokens[status - 1] ?? tokens[0]
    Return GameState.expandGovNames(str)

---

## File 3: src/game/Day.ts

Selects and schedules the news items for a single game day.

```typescript
import { NewsItem } from './NewsItem';
import { Const } from '../constants/Const';
import { shuffleArray } from '../utils/Util';

export class Day {
  newsItems: NewsItem[] = [];

  constructor(dayIndex: number) {
    const criticalItems: NewsItem[] = [];
    let weatherItem: NewsItem | null = null;
    const nonCriticalItems: NewsItem[] = [];
    let containsRebelMessage = false;

    shuffleArray(NewsItem.allNewsItems);

    for (const item of NewsItem.allNewsItems) {
      if (item.used) continue;

      if (item.isWeather()) {
        if (!weatherItem) weatherItem = item;
        continue;
      }

      const hasDayRange = item.dayRangeStart !== 0 || item.dayRangeEnd !== 0;
      if (hasDayRange) {
        const inRange =
          (dayIndex >= item.dayRangeStart && dayIndex <= item.dayRangeEnd) ||
          (dayIndex === item.dayRangeStart && item.dayRangeEnd === -1);
        if (inRange) {
          if (item.isRebelLeader()) containsRebelMessage = true;
          criticalItems.push(item);
        }
      } else {
        nonCriticalItems.push(item);
      }
    }

    const allItems = [...criticalItems];
    if (weatherItem) allItems.push(weatherItem);
    allItems.push(...nonCriticalItems);

    const maxItems = 10;
    const randomRange = containsRebelMessage ? 2 : 3;
    const count = (maxItems - randomRange) + Math.floor(Math.random() * randomRange);
    this.newsItems = allItems.slice(0, count);

    shuffleArray(this.newsItems);

    // Assign random appear times, spread across first 75% of the day
    this.newsItems.forEach((item, i) => {
      let t = (0.75 * i) / this.newsItems.length;
      if (dayIndex === 1) t *= 0.5;
      item.appearTime = Math.random() * t * Const.dayDuration;
    });
  }
}
```

Note: NewsItem needs a public `appearTime: number = 0` property. Add it if not already present.

---

## File 4: src/utils/Util.test.ts

Tests:
- shuffleArray returns same array reference
- shuffleArray returns array with same elements (sorted copy equals original sorted copy)
- shuffleArray mutates the input array (length preserved)
- shuffleArray on empty array returns empty array
- shuffleArray on single-element array returns that element

## File 5: src/game/GameState.test.ts

Tests:
- GameState.instance is defined
- getGovName() returns 'Republia' when stateInControl = true
- getGovName() returns 'Democria' when stateInControl = false
- expandGovNames('[GOV] Times') returns 'Republia Times' when stateInControl = true
- expandGovNames('[GOV] Times') returns 'Democria Times' when stateInControl = false
- reset() sets dayNumber to 1 and creates a fresh Readership
- reset() calls NewsItem.resetAllNewsItems() (verify by marking one item used, then resetting)

## File 6: src/game/Day.test.ts

Tests:
- Day for dayIndex 1 selects between 7 and 10 items
- All items in Day have an appearTime >= 0
- All items in Day have appearTime <= 0.75 * Const.dayDuration
- Items for dayIndex 1 have appearTime <= 0.375 * Const.dayDuration (halved)
- Day includes at most one weather item
- Day does not include any items marked used=true

## Expected Result
- `npm test` passes all new and existing tests.
- Zero Phaser imports in these files.
- No TypeScript errors.
```

---

### Prompt 6 — Storage

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- src/constants/Const.ts, src/constants/AssetKeys.ts
- src/game/NewsItem.ts, PaperSummary.ts, Readership.ts, Goal.ts, GameState.ts, Day.ts
- src/utils/Util.ts

Your task is to implement the localStorage persistence layer. This module has no Phaser dependency.

---

## File 1: src/utils/Storage.ts

### SaveData interface (export it)
```typescript
export interface SaveData {
  dayNumber: number;
  loyalty: number;
  readerCount: number;
  stateInControl: boolean;
  haveWonAtLeastOnce: boolean;
  usedNewsItemIndices: number[];  // indices into NewsItem.allNewsItems
  mute: boolean;
}
```

### SAVE_KEY constant (not exported)
const SAVE_KEY = 'republiatimes-save';

### Storage class (all methods static)

save(mute: boolean): void
  Build a SaveData object from GameState.instance:
  - dayNumber, stateInControl, haveWonAtLeastOnce from GameState
  - loyalty = readership.curLoyalty
  - readerCount = readership.curReaderCount
  - usedNewsItemIndices = indices where NewsItem.allNewsItems[i].used === true
  - mute = passed argument
  Serialize to JSON and write to localStorage.setItem(SAVE_KEY, json)
  Wrap in try/catch; silently swallow errors (storage may be unavailable)

load(): boolean
  Try localStorage.getItem(SAVE_KEY)
  If null or parse fails → return false
  Validate that parsed object has expected keys (dayNumber is number, etc.)
  Hydrate GameState.instance:
    - dayNumber, stateInControl, haveWonAtLeastOnce
    - readership = new Readership(loyalty, readerCount)
  Mark used news items: for each index in usedNewsItemIndices, set NewsItem.allNewsItems[index].used = true
  Return true
  Wrap in try/catch; on any error return false

clear(): void
  localStorage.removeItem(SAVE_KEY)

getMute(): boolean
  Try to parse save data and return mute field; return false on any failure

### Validation helper (private static)
isValidSaveData(data: unknown): data is SaveData
  Check that data is an object with:
  - dayNumber: number
  - loyalty: number
  - readerCount: number
  - stateInControl: boolean
  - haveWonAtLeastOnce: boolean
  - usedNewsItemIndices: array of numbers
  - mute: boolean

---

## File 2: src/utils/Storage.test.ts

Use Vitest's vi.stubGlobal to mock localStorage:

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
```

Tests:
- save() then load() round-trips dayNumber correctly
- save() then load() round-trips loyalty correctly
- save() then load() restores usedNewsItemIndices and marks correct items as used
- save() then load() returns true
- load() with no saved data returns false
- load() with corrupt JSON returns false
- load() with valid JSON missing a required field returns false
- clear() removes the save so subsequent load() returns false
- getMute() returns false when no save exists
- save() then getMute() returns the mute value that was saved

## Expected Result
- `npm test` passes all tests including Storage tests.
- No TypeScript or ESLint errors.
- No Phaser imports.
```

---

### Prompt 7 — PreloadScene

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- A running Vite + Phaser project (src/main.ts) with a single BootScene showing "Loading..."
- All pure-logic modules: Const, AssetKeys, NewsItem, PaperSummary, Readership, Goal, GameState, Day, Util, Storage

Your task is to replace the BootScene with a real PreloadScene that loads all game assets and shows a progress bar. Then wire it to a minimal stub MorningScene so the flow PreloadScene → MorningScene works.

## Asset preparation (you will write the load calls; the actual files are assumed to be present)

All assets live under public/assets/:
- public/assets/images/ — PNG files (Background.png, Morning.png, PrintedPaper.png, Logo.png, Logo2.png, LogoSmall.png, LogoSmall2.png, ArticleSmall.png, ArticleMed.png, ArticleBig.png, Blurb.png, BlurbCheck.png, BlurbArticleS.png, BlurbArticleM.png, BlurbARticleB.png, Button.png, StatMeter.png, CenterPopup.png, Dragging.png, Mute.png, Cursor.png)
- public/assets/audio/ — MP3 files (MainMusic.mp3, NightMusic.mp3, Silence.mp3, Feed.mp3, Drag.mp3, Drop.mp3, ButtonDown.mp3, ButtonUp.mp3, DayOver.mp3, Alarm.mp3, Click.mp3)
- public/assets/fonts/ — bitmap font pairs (feed.png + feed.xml, articleB.png + articleB.xml, articleM.png + articleM.xml, articleS.png + articleS.xml)

---

## File 1: src/scenes/PreloadScene.ts

```typescript
import Phaser from 'phaser';
import { AssetKeys } from '../constants/AssetKeys';
import { Storage } from '../utils/Storage';

export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }

  preload(): void {
    this.createProgressBar();

    // Images — use AssetKeys constants as keys
    this.load.image(AssetKeys.IMG_BACKGROUND, 'assets/images/Background.png');
    // ... (load all images listed above)

    // Audio
    this.load.audio(AssetKeys.MUSIC_MAIN, 'assets/audio/MainMusic.mp3');
    // ... (load all audio)

    // Bitmap fonts
    this.load.bitmapFont(AssetKeys.FONT_FEED, 'assets/fonts/feed.png', 'assets/fonts/feed.xml');
    // ... (load all 4 fonts)
  }

  create(): void {
    Storage.load();  // hydrate GameState from localStorage if save exists
    this.scene.start('MorningScene');
  }

  private createProgressBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const cx = width / 2;
    const cy = height / 2;
    const barW = 200;
    const barH = 16;

    // Outer border (black rectangle)
    const border = this.add.graphics();
    border.lineStyle(2, 0x000000, 1);
    border.strokeRect(cx - barW / 2 - 2, cy - barH / 2 - 2, barW + 4, barH + 4);

    // Fill bar (grows left to right)
    const bar = this.add.graphics();

    // Label
    this.add.text(cx, cy - 24, 'Loading...', {
      color: '#000000',
      fontSize: '12px',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0x000000, 1);
      bar.fillRect(cx - barW / 2, cy - barH / 2, barW * value, barH);
    });
  }
}
```

## File 2: src/scenes/MorningScene.ts (stub only)

```typescript
import Phaser from 'phaser';

export class MorningScene extends Phaser.Scene {
  constructor() { super({ key: 'MorningScene' }); }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    this.add.text(270, 160, 'Morning Scene (stub)', {
      color: '#000000',
      fontSize: '16px',
    }).setOrigin(0.5);

    this.add.text(270, 200, 'Click to continue →', {
      color: '#000000',
      fontSize: '10px',
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('PlayScene'));
  }
}
```

## File 3: src/scenes/PlayScene.ts (stub only)

```typescript
import Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {
  constructor() { super({ key: 'PlayScene' }); }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    this.add.text(270, 160, 'Play Scene (stub)', {
      color: '#000000',
      fontSize: '16px',
    }).setOrigin(0.5);

    this.add.text(270, 200, 'Click to continue →', {
      color: '#000000',
      fontSize: '10px',
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('NightScene'));
  }
}
```

## File 4: src/scenes/NightScene.ts (stub only)

```typescript
import Phaser from 'phaser';

export class NightScene extends Phaser.Scene {
  constructor() { super({ key: 'NightScene' }); }

  create(): void {
    this.cameras.main.setBackgroundColor('#000000');
    this.add.text(270, 160, 'Night Scene (stub)', {
      color: '#ffffff',
      fontSize: '16px',
    }).setOrigin(0.5);

    this.add.text(270, 200, 'Click to restart →', {
      color: '#ffffff',
      fontSize: '10px',
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MorningScene'));
  }
}
```

## File 5: Update src/main.ts

Replace the BootScene import with all four scenes:
```typescript
import { PreloadScene } from './scenes/PreloadScene';
import { MorningScene } from './scenes/MorningScene';
import { PlayScene } from './scenes/PlayScene';
import { NightScene } from './scenes/NightScene';

// scene array: [PreloadScene, MorningScene, PlayScene, NightScene]
// Add input: { activePointers: 2 } to the game config
// pixelArt: true in the game config to ensure nearest-neighbor scaling
```

## Manual Verification
1. `npm run dev` — browser shows white canvas with a black progress bar filling to 100%, then transitions to "Morning Scene (stub)"
2. Clicking "Click to continue" cycles through: Morning → Play → Night → Morning
3. Progress bar is centered, has a border, and fills smoothly
4. `npm test` still passes all existing tests
```

---

### Prompt 8 — MorningScene Shell

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PreloadScene loads all assets and transitions to MorningScene
- MorningScene, PlayScene, NightScene are stubs that cycle through on click
- All game logic classes: GameState, Readership, Goal, NewsItem, Day, Storage, Util

Your task is to build a real MorningScene shell that displays the correct visual layout — background, logo, day number, credits, and a working "Start Work" button that transitions to PlayScene. Message content and goal-checking logic will be added in a later prompt. For now show a placeholder message.

## Update src/scenes/MorningScene.ts

Replace the stub. The scene must:

1. Set white background (this.cameras.main.setBackgroundColor('#ffffff'))

2. Add the morning background image (AssetKeys.IMG_MORNING) at position (0, 0)

3. Add the correct logo sprite — use GameState.instance.stateInControl to pick:
   - true → AssetKeys.IMG_LOGO
   - false → AssetKeys.IMG_LOGO2
   Center it horizontally at y=20

4. Play main music (loop at volume 0.5):
   this.sound.stopAll();
   this.sound.play(AssetKeys.MUSIC_MAIN, { loop: true, volume: 0.5 });

5. Add day text using Phaser.GameObjects.Text at x=270, y=70, centered:
   'Day ' + GameState.instance.dayNumber
   Color: #000000, fontSize: 10px

6. Add placeholder message text at x=270, y=160 (origin 0.5, 0):
   Width: 340px (wordWrap)
   Text: '[Briefing message will appear here]'
   Color: #000000, fontSize: 8px

7. Add credits text at bottom-right:
   'by\nLucas Pope\n@dukope'
   Align right, color #000000, fontSize 8px
   Position: x = 540 - margin, y = 320 - 35, origin (1, 0)

8. Add the "Start Work" button:
   - Use the AssetKeys.IMG_BUTTON image
   - Center horizontally at y = 320 - 50
   - On click: this.scene.start('PlayScene')
   - Label text centered on the button: 'Start Work'

9. Add a mute button (placeholder — a simple text toggle for now):
   Text '[M]' at bottom-left (x=10, y=300)
   On click: this.sound.mute = !this.sound.mute
   (Full mute button with sprite will be implemented in a later prompt)

10. Add StatMeters stub — if dayNumber > 1, show placeholder text 'Stats: [pending]' at x=450, y=120

## Manual Verification
- `npm run dev` → PreloadScene loads → MorningScene shows morning background, logo, "Day 1" text, placeholder message, credits, "Start Work" button
- Clicking "Start Work" goes to PlayScene stub
- Main music plays
- No TypeScript errors
```

---

### Prompt 9 — NightScene Shell

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PreloadScene → MorningScene (shell) → PlayScene (stub) → NightScene (stub) all wired and navigable
- GameState, Readership, Goal, Storage all implemented

Your task is to build the NightScene shell — the results screen shown after each day. Message content will reference real Readership data but use a simplified format for now. Full results logic comes later.

## Update src/scenes/NightScene.ts

Replace the stub. The scene must:

1. Set black background

2. Add printed paper image (AssetKeys.IMG_PRINTED_PAPER) centered horizontally at y=30

3. Play night music (loop at volume 0.5):
   this.sound.stopAll();
   this.sound.play(AssetKeys.MUSIC_NIGHT, { loop: true, volume: 0.5 });

4. Add results text using Phaser.GameObjects.Text at x=270, y=110 (origin 0.5, 0):
   Width 340px wordWrap, color #ffffff, fontSize 8px
   Build a message string from GameState.instance.readership:
     const rs = GameState.instance.readership;
     const loyaltyDelta = rs.getLoyaltyDelta();
     const readerDelta = rs.getReaderCountDelta();
     message = "Today's issue has been printed and distributed.\n\nRESULTS\n\n"
     message += "      Loyalty: " + rs.curLoyalty + formatDelta(loyaltyDelta) + "\n"
     message += "      Readership: " + rs.curReaderCount + formatDelta(readerDelta) + "\n\n"
     message += rs.comments

   Helper: formatDelta(delta: number): string
     if delta > 0 → "   (+" + delta + ")"
     if delta < 0 → "   (" + delta + ")"
     else → "   (no change)"

5. Center the message text vertically: text.y = 180 - text.height / 2 (after setting text content)

6. Add "Go to Sleep" button:
   - Use AssetKeys.IMG_BUTTON image, centered horizontally at y = 320 - 50
   - Label: 'Go to Sleep'
   - On click:
       GameState.instance.dayNumber++;
       this.scene.start('MorningScene');

7. Add mute button placeholder at bottom-left (same style as MorningScene: text '[M]')

## Manual Verification
- Full flow: Morning → PlayScene stub → NightScene
- NightScene shows black background, printed paper image, result text (0 changes since no paper was filled), "Go to Sleep" button
- "Go to Sleep" increments dayNumber and returns to MorningScene showing "Day 2"
- Music switches correctly between scenes
- No TypeScript errors
```

---

### Prompt 10 — Clock & StatMeters Components

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PreloadScene → MorningScene (shell) → PlayScene (stub) → NightScene (shell)
- All game logic classes

Your task is to implement Clock and StatMeters as reusable components and wire them into the scenes that need them. Components are plain TypeScript classes that manage Phaser GameObjects via a scene reference.

---

## File 1: src/components/Clock.ts

The Clock displays the day progress. In the original game it was a visual analog-style clock.
Port the visual as a simple digital representation using Phaser graphics + text for now:
- A rectangular border drawn at position (x, y)
- A fill bar that grows from left to right based on time fraction
- A text label showing the time as "HH:MM" (map 0.0–1.0 to 8:00–17:00)

```typescript
export class Clock {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private border: Phaser.GameObjects.Graphics;
  private fill: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;

  private readonly W = 50;
  private readonly H = 10;

  constructor(scene: Phaser.Scene, x: number, y: number) { ... }

  setTime(fraction: number): void {
    // fraction is 0.0 to 1.0
    // Map to 8:00–17:00 (9 hours = 540 minutes)
    const totalMinutes = Math.floor(fraction * 540);
    const hours = 8 + Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.label.setText(`${hours}:${minutes.toString().padStart(2, '0')}`);
    this.fill.clear();
    this.fill.fillStyle(0x000000, 1);
    this.fill.fillRect(this.x, this.y, this.W * fraction, this.H);
  }

  destroy(): void { ... }
}
```

---

## File 2: src/components/StatMeters.ts

Displays two vertical bar meters for Loyalty and Readership.

```typescript
export class StatMeters {
  constructor(scene: Phaser.Scene, x: number, y: number, darkMode: boolean = false)
  setValues(readership: Readership, animate: boolean = true): void
  destroy(): void
}
```

Layout (port from original StatMeter.png sprite usage):
- Two meters side by side, spaced 20px apart
- Each meter: use AssetKeys.IMG_STAT_METER as the background sprite
- Overlay a colored fill rectangle whose height represents the stat value
- Loyalty: maps curLoyalty from [-Const.statMax, +Const.statMax] to fill height
  - Positive loyalty fills upward in black (or white in dark mode)
  - Negative loyalty fills downward in a different shade
- Readership: maps curReaderCount to a reasonable visual range (0–1000 readers = 0–100% fill)
- Add small text labels below each meter: 'Loyalty' and 'Readers'

If animate=true, tween the fill height over 0.5 seconds. If false, set immediately.

---

## Wire into scenes

### MorningScene update:
Replace the 'Stats: [pending]' placeholder:
```typescript
if (GameState.instance.dayNumber > 1) {
  this.statMeters = new StatMeters(this, 450, 120, false);
  this.statMeters.setValues(GameState.instance.readership, false);
}
```
Store as a private property. Call destroy() (if StatMeters has one) when the scene shuts down via this.events.on('shutdown', ...).

### NightScene update:
Add StatMeters at the same position (dark mode = false, animate = true):
```typescript
this.statMeters = new StatMeters(this, 450, 120, false);
this.statMeters.setValues(GameState.instance.readership, true);
```

## Manual Verification
- MorningScene on day 2+ shows two stat meter bars in the top-right area
- NightScene always shows stat meters
- Going through a full loop (Morning → Play stub → Night → Morning) shows "Day 2" with stat meters on the second morning
- No TypeScript errors
```

---

### Prompt 11 — PlayScene: Timer, Day, and Clock

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PreloadScene → MorningScene → PlayScene (stub) → NightScene all navigable
- Clock and StatMeters components
- GameState, Day, Readership, Goal, NewsItem all implemented

Your task is to upgrade PlayScene from a stub to a working timed scene. No paper or feed yet — just the day timer, the clock, the "End Day" button, the alarm, and the transition to NightScene when time runs out.

## Update src/scenes/PlayScene.ts

### Properties
```typescript
private time: number = 0;
private speed: number = 1;
private alarmFired: boolean = false;
private day!: Day;
private clock!: Clock;
private dayEnded: boolean = false;
```

### create()
1. White background
2. Add background image (AssetKeys.IMG_BACKGROUND) at (0, 0)
3. Play null sound as background music (Phaser workaround for audio context):
   this.sound.stopAll();
   this.sound.play(AssetKeys.SFX_NULL, { loop: true, volume: 0 });
4. Create this.day = new Day(GameState.instance.dayNumber)
5. Create this.clock = new Clock(this, 480, 10)
6. this.time = 0
7. this.speed = GameState.instance.dayNumber === 1 ? 0.5 : 1
8. this.alarmFired = false
9. this.dayEnded = false
10. Add "End Day" button:
    - Transparent/invisible hitbox (60×20px) at position (0, 94) — matches original
    - Label text 'End Day' in black at that position
    - On click: this.speed = 10

### update(time: number, delta: number)
1. const elapsed = (delta / 1000) * this.speed
2. const prevTime = this.time
3. this.time += elapsed

4. Alarm at 75%:
   if (prevTime < 0.75 * Const.dayDuration && this.time >= 0.75 * Const.dayDuration && !this.alarmFired):
     this.sound.play(AssetKeys.SFX_ALARM, { volume: 0.25 })
     this.alarmFired = true

5. Day end:
   if (this.time >= Const.dayDuration && !this.dayEnded):
     this.time = Const.dayDuration
     this.dayEnded = true
     this.sound.play(AssetKeys.SFX_DAY_OVER, { volume: 0.25 })
     // Show console.log for now: 'Day ended — transitioning to NightScene'
     // Immediately transition (popup will be added in a later prompt):
     this.onDayOver()

6. Update clock: this.clock.setTime(this.time / Const.dayDuration)

### onDayOver() (private)
```typescript
private onDayOver(): void {
  // Placeholder: no paper summary yet, just end the day
  GameState.instance.dayNumber++;  // temporary — will be moved to NightScene's button later
  this.scene.start('NightScene');
}
```

Note: The dayNumber increment will be moved once the CenterPopup and full flow are wired. For now it's here so NightScene shows the correct day.

## Manual Verification
- `npm run dev`, go through Morning → PlayScene
- The clock updates in real time (reaches end in ~60 seconds at normal speed)
- Clicking "End Day" makes the clock run 10× faster
- At 75% time, alarm fires (or verify via console.log if audio isn't set up yet)
- At 100% time, scene transitions to NightScene
- Day 1 runs at half speed (takes ~120 seconds)
- No TypeScript errors
```

---

### Prompt 12 — Paper Component

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PlayScene with a working day timer, clock, and transition to NightScene
- All game logic: GameState, NewsItem, PaperSummary, Day, Readership
- AssetKeys and Const constants

Your task is to implement the Paper component — the drag-and-drop newspaper layout panel on the right side of PlayScene. The Feed integration (spawning articles from blurbs) comes in the next prompt; for now focus on the paper grid, the article pool, snapping, and overlap detection.

## File 1: src/components/Paper.ts

Paper manages a pool of 30 Article objects (10 each of Small, Medium, Large). Articles are Phaser Image GameObjects that can be dragged and dropped onto a grid.

### ArticleSize is already in NewsItem.ts — import it from there.

### Internal class: Article (not exported — keep at bottom of Paper.ts or in a separate internal file)
Properties: sprite: Phaser.GameObjects.Image, textObj: Phaser.GameObjects.BitmapText, newsItem: NewsItem | null, articleSize: ArticleSize, visible: boolean
Methods: setVisible(vis: boolean): void — sets sprite.visible and textObj.visible

### Paper class

```typescript
export class Paper {
  private scene: Phaser.Scene;
  private articles: Article[] = [];
  private draggingArticle: Article | null = null;
  public enabled: boolean = true;

  constructor(scene: Phaser.Scene) { ... }

  getSummary(): PaperSummary { ... }
  markNewsItemsUsed(): void { ... }
  spawnArticleAtPointer(size: ArticleSize, newsItem: NewsItem, pointer: Phaser.Input.Pointer): void { ... }
  getArticleSizeWithNewsItem(newsItem: NewsItem): ArticleSize | -1 { ... }
  getDraggingArticleSizeWithNewsItem(newsItem: NewsItem): ArticleSize | -1 { ... }
  destroy(): void { ... }
}
```

### constructor(scene: Phaser.Scene)
1. Draw paper background: white filled rect at (Const.paperX, Const.paperY, Const.paperW, Const.paperH) using scene.add.graphics()
2. Draw a thin black border around the paper area
3. Add a small logo sprite above the paper (AssetKeys.IMG_LOGO_SMALL or IMG_LOGO_SMALL2 based on stateInControl), centered at x = paperX + paperW/2, y = paperY - 15
4. Create article pool — for each size, create 10 Articles:
   S: image key AssetKeys.IMG_ARTICLE_S, bitmap font FONT_ARTICLE_S, textOffset (5, 5), textWidth 40
   M: image key AssetKeys.IMG_ARTICLE_M, bitmap font FONT_ARTICLE_M, textOffset (10, 10), textWidth 80
   B: image key AssetKeys.IMG_ARTICLE_B, bitmap font FONT_ARTICLE_B, textOffset (10, 10), textWidth 130
   All articles start invisible, positioned off-screen
5. Set up Phaser drag input:
   - Each article sprite: sprite.setInteractive({ draggable: true })
   - scene.input.on('drag', onDrag, this)
   - scene.input.on('dragend', onDragEnd, this)
   - scene.input.on('dragstart', onDragStart, this)

### onDragStart(pointer, gameObject)
Find the Article with this sprite. Set draggingArticle to it.
Play drag sound: scene.sound.play(AssetKeys.SFX_DRAG)

### onDrag(pointer, gameObject, dragX, dragY)
If !enabled: return
Find Article. Set sprite position to (dragX, dragY).
Update text position to match (sprite.x + textOffset.x, sprite.y + textOffset.y)

### onDragEnd(pointer, gameObject)
If !enabled: draggingArticle?.setVisible(false); draggingArticle = null; return

Play drop sound: scene.sound.play(AssetKeys.SFX_DROP)

const article = draggingArticle if it matches gameObject, else find it.

Check if pointer is within paper bounds (Const.paperX to paperX+paperW, paperY to paperY+paperH):
  If NOT in bounds: article.setVisible(false); draggingArticle = null; return

Snap to grid:
  snappedX = Const.paperX + Const.p * Math.round((article.sprite.x - Const.paperX) / Const.p)
  snappedY = Const.paperY + Const.p * Math.round((article.sprite.y - Const.paperY) / Const.p)

Clamp so article doesn't extend past paper edges (account for sprite width/height).

Check bounds and overlap:
  if (snappedX + spriteW > paperX + paperW) → invalid
  if (snappedY + spriteH > paperY + paperH) → invalid
  if (testOverlapWithOthers(article, snappedX, snappedY)) → invalid

If invalid: article.setVisible(false)
If valid: set sprite to (snappedX, snappedY), update text position, article remains visible
draggingArticle = null

### testOverlapWithOthers(article, x, y): boolean
AABB test: check if a rect at (x, y, spriteW, spriteH) overlaps any other visible article's rect.
Two rects overlap if: NOT (a.right <= b.left OR a.left >= b.right OR a.bottom <= b.top OR a.top >= b.bottom)

### update() — call this from PlayScene.update()
For each visible article:
  if overlapping any other visible article → sprite.setTint(0xff0000)
  else → sprite.clearTint()

If !enabled and draggingArticle:
  draggingArticle.setVisible(false); draggingArticle = null

### spawnArticleAtPointer(size, newsItem, pointer)
1. If draggingArticle exists, hide it and set to null
2. Hide any visible articles that already have this newsItem
3. Find first invisible Article of the matching size in the pool
4. If none found, return (pool exhausted)
5. Set article.newsItem = newsItem
6. Set article.textObj.text = newsItem.getArticleText()
7. Make article visible
8. Position sprite at (pointer.x, pointer.y)
9. Set draggingArticle = article
10. Force-start the Phaser drag: scene.input.setDragState(pointer, article.sprite, 2)
    (Phaser drag state 2 = DRAGGING)

### getSummary(): PaperSummary
Create PaperSummary, call applyNewsItem for each visible article that has a newsItem set. Return it.

### markNewsItemsUsed()
For each visible article with a newsItem, set newsItem.used = true.

### getArticleSizeWithNewsItem(newsItem): ArticleSize | -1
Return the articleSize of the first visible, non-dragging article matching this newsItem. Return -1 if none.

### getDraggingArticleSizeWithNewsItem(newsItem): ArticleSize | -1
If draggingArticle?.newsItem === newsItem, return its size. Else -1.

---

## Wire into PlayScene

In PlayScene.create(), after existing setup:
```typescript
this.paper = new Paper(this);
```

In PlayScene.update(), call:
```typescript
this.paper.update();
```

In PlayScene.onDayOver(), update to use paper:
```typescript
private onDayOver(): void {
  GameState.instance.readership.applyPaperSummary(this.paper.getSummary());
  this.paper.markNewsItemsUsed();
  Storage.save(this.sound.mute);
  this.scene.start('NightScene');
}
```
Remove the dayNumber++ from here (NightScene's "Go to Sleep" button handles it).

## Manual Verification
- PlayScene shows the paper area (white rect with border) on the right side
- Open browser console: no errors
- Articles are not yet visible (they have no newsItem assigned yet — Feed integration is next)
- No TypeScript errors
```

---

### Prompt 13 — Feed Component

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PlayScene with Paper component (article pool, grid snapping, drag-and-drop)
- All game logic: GameState, Day, NewsItem, etc.
- AssetKeys constants including FONT_FEED, IMG_BLURB, IMG_BLURB_CHECK, IMG_BLURB_ARTICLE_S/M/B, IMG_DRAGGING

Your task is to implement the Feed component — the left panel that shows incoming news blurbs and lets the player pick which size article to place.

## File 1: src/components/Feed.ts

Feed manages a pool of 10 Blurb objects. Blurbs scroll into view from below as news items appear during the day.

### Internal: Blurb class (not exported)
Properties:
- sprite: Phaser.GameObjects.Image  — uses IMG_BLURB as background
- textObj: Phaser.GameObjects.BitmapText  — uses FONT_FEED
- newsItem: NewsItem | null
- checkSprite: Phaser.GameObjects.Image   — IMG_BLURB_CHECK
- articleSpriteS: Phaser.GameObjects.Image  — IMG_BLURB_ARTICLE_S
- articleSpriteM: Phaser.GameObjects.Image  — IMG_BLURB_ARTICLE_M
- articleSpriteB: Phaser.GameObjects.Image  — IMG_BLURB_ARTICLE_B
- draggingSprite: Phaser.GameObjects.Image  — IMG_DRAGGING
- checkedArticleSize: number = -1
- draggingArticleSize: number = -1
- visible: boolean = false

Methods:
- setVisible(vis: boolean): void — sets visibility on sprite, textObj, and conditionally on article size sprites (only visible if newsItem.hasArticleText())
- updateLayout(): void — positions text, article icons, check/drag overlays relative to sprite position
  The blurb sprite is the background. Position sub-elements relative to it:
    textObj: sprite.x + 10, sprite.y + 0
    articleSpriteB: sprite.x + 204, sprite.y + 4
    articleSpriteM: sprite.x + 229, sprite.y + 4
    articleSpriteS: sprite.x + 247, sprite.y + 4
    checkSprite: centered on whichever article sprite matches checkedArticleSize
    draggingSprite: centered on whichever article sprite matches draggingArticleSize

### Feed class

```typescript
export class Feed {
  private scene: Phaser.Scene;
  private paper: Paper;
  private blurbs: Blurb[] = [];
  private blurbsTop: number;
  private blurbsTopTarget: number;
  public enabled: boolean = true;

  constructor(scene: Phaser.Scene, paper: Paper) { ... }
  addBlurb(newsItem: NewsItem): void { ... }
  hasBlurb(newsItem: NewsItem): boolean { ... }
  update(delta: number): void { ... }
  destroy(): void { ... }
}
```

### constructor(scene, paper)
1. this.blurbsTop = Const.feedH  — blurbs start below the visible area
2. this.blurbsTopTarget = Const.feedH
3. Create pool of 10 Blurb objects, all invisible, positioned off-screen
4. Set up pointer input on the scene:
   scene.input.on('pointerdown', this.onPointerDown, this)

### addBlurb(newsItem: NewsItem)
1. Find the first invisible blurb in pool
2. If none found, return (pool full)
3. Set blurb.newsItem = newsItem
4. Set blurb.textObj.text = newsItem.getBlurbText()
5. Set text color:
   - If newsItem.isRebelLeader() → 0xff0000 (red)
   - Else → 0x000000 (black)
6. Call blurb.setVisible(true)
7. Decrease blurbsTopTarget by blurb.sprite.height
8. Play feed sound: scene.sound.play(AssetKeys.SFX_FEED, { volume: 0.25 })

### hasBlurb(newsItem: NewsItem): boolean
Return true if any visible blurb has this newsItem.

### onPointerDown(pointer: Phaser.Input.Pointer)
If !enabled: return
Check if pointer is within feed bounds (Const.feedX to feedX+feedW, feedY to feedY+feedH):
  For each visible blurb whose sprite overlaps the pointer:
    If pointer overlaps blurb.articleSpriteS → paper.spawnArticleAtPointer(ArticleSize.S, blurb.newsItem, pointer)
    If pointer overlaps blurb.articleSpriteM → paper.spawnArticleAtPointer(ArticleSize.M, blurb.newsItem, pointer)
    If pointer overlaps blurb.articleSpriteB → paper.spawnArticleAtPointer(ArticleSize.B, blurb.newsItem, pointer)
    Break after first match

### update(delta: number)
1. Scroll animation: if blurbsTop > blurbsTopTarget:
     blurbsTop -= (delta / 1000) * 100
     if blurbsTop < blurbsTopTarget: blurbsTop = blurbsTopTarget

2. Stack blurbs vertically:
   let y = blurbsTop + Const.feedY
   For each visible blurb:
     blurb.sprite.x = Const.feedX
     blurb.sprite.y = y
     y += blurb.sprite.height
     blurb.updateLayout()

3. For each visible blurb with a newsItem:
   blurb.checkedArticleSize = paper.getArticleSizeWithNewsItem(blurb.newsItem)
   blurb.draggingArticleSize = paper.getDraggingArticleSizeWithNewsItem(blurb.newsItem)

---

## Wire into PlayScene

In PlayScene.create(), after paper creation:
```typescript
this.feed = new Feed(this, this.paper);
```

In PlayScene.update(), pass delta to feed:
```typescript
this.feed.update(delta);
```

In PlayScene.update(), add the news item appearance logic (replaces the console.log placeholder):
```typescript
for (const newsItem of this.day.newsItems) {
  if (this.time > newsItem.appearTime && !this.feed.hasBlurb(newsItem)) {
    this.feed.addBlurb(newsItem);
  }
}
```

When day ends (onDayOver or when popup is confirmed), disable both:
```typescript
this.paper.enabled = false;
this.feed.enabled = false;
```

## Manual Verification
- PlayScene shows news blurbs appearing in the left panel over time
- Blurbs scroll in smoothly from below
- Rebel leader blurbs appear in red
- Clicking a size icon (S/M/B) next to a blurb spawns an article that follows the pointer
- Dropping the article on the paper grid snaps it to position
- Dropping outside the paper removes the article
- No TypeScript errors
```

---

### Prompt 14 — Feed → Paper Drag Integration & Visual Polish

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Paper component with article pool, grid snapping, overlap detection
- Feed component with blurb pool, scroll animation, size icon click handling
- PlayScene wiring both together with news item appear timing

Your task is to close the loop on the drag interaction: verify the full cycle works, add the visual check/drag indicators in the feed, and ensure the paper correctly shows red tints for overlapping articles.

## Task 1: Verify and fix the feed-to-paper spawn flow

The interaction chain is:
1. User clicks a size icon in a blurb → Feed.onPointerDown detects it
2. Feed calls paper.spawnArticleAtPointer(size, newsItem, pointer)
3. Paper finds a pooled article, positions it at pointer, calls scene.input.setDragState(pointer, sprite, 2)
4. Phaser drag events fire: onDrag moves the sprite, onDragEnd snaps or hides it

Ensure this chain works for both mouse and touch (pointer events should be identical).

Test cases to verify manually:
- Click S icon → small article follows pointer → drop on paper → snaps to grid
- Click M icon → medium article follows → drop on paper → snaps
- Click B icon → big article follows → drop on paper → snaps
- Drop outside paper → article disappears
- Click a different size for the same story → previous article for that story disappears, new size appears
- Overlapping articles tint red; resolving the overlap removes the tint

## Task 2: Feed visual state — check and drag sprites

The blurb shows a checkmark sprite when an article of that story is placed on the paper.
The blurb shows a "dragging" sprite when an article of that story is currently being dragged.

In Feed.update(), after updating checkedArticleSize and draggingArticleSize on each blurb:
- Call blurb.updateLayout() so sprites reposition

In Blurb.updateLayout(), handle the check and drag sprites:

```typescript
// Check sprite
if (this.checkedArticleSize < 0) {
  this.checkSprite.setVisible(false);
} else {
  this.checkSprite.setVisible(true);
  const target = this.getSpriteForSize(this.checkedArticleSize);
  this.checkSprite.setPosition(
    target.x + target.width / 2 - this.checkSprite.width / 2,
    target.y + target.height / 2 - this.checkSprite.height / 2
  );
}

// Dragging sprite
if (this.draggingArticleSize < 0) {
  this.draggingSprite.setVisible(false);
} else {
  this.draggingSprite.setVisible(true);
  const target = this.getSpriteForSize(this.draggingArticleSize);
  this.draggingSprite.setPosition(
    target.x + target.width / 2 - this.draggingSprite.width / 2,
    target.y + target.height / 2 - this.draggingSprite.height / 2
  );
}
```

Add private getSpriteForSize(size: ArticleSize): Phaser.GameObjects.Image helper.

## Task 3: Paper overlap tinting in update()

In Paper.update(), for each visible article (not just dragging):
  Create its bounds rect: { left: x, right: x+w, top: y, bottom: y+h }
  Check against all other visible articles
  If any overlap: sprite.setTint(0xff0000)
  Else: sprite.clearTint()

## Task 4: PlayScene — disable interaction when day ends

When dayEnded = true:
  this.paper.enabled = false
  this.feed.enabled = false
  If dragging article exists in paper, hide it

## Manual Verification
Full gameplay loop test:
1. Start a new game, go through MorningScene → PlayScene
2. Wait for blurbs to appear
3. Place articles by clicking size icons — verify they attach to pointer
4. Drop articles on paper — verify grid snapping
5. Place two articles that overlap — both go red
6. Move one away — overlap resolves, both go white
7. Place an article, verify the blurb shows a checkmark on that size
8. Drag an article, verify the blurb shows the dragging sprite
9. Wait for day to end — verify nothing can be dragged after
10. No TypeScript errors
```

---

### Prompt 15 — CenterPopup & PlayScene Completion

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- PlayScene with working timer, clock, Feed, and Paper components all integrated
- Paper and Feed are disabled when dayEnded = true
- NightScene stub still handles dayNumber increment

Your task is to implement the CenterPopup component and complete PlayScene's end-of-day flow: when the timer expires, show the popup, and on confirm apply the paper summary and transition to NightScene.

## File 1: src/components/CenterPopup.ts

```typescript
export class CenterPopup {
  private scene: Phaser.Scene;
  private bg: Phaser.GameObjects.Image;
  private messageText: Phaser.GameObjects.Text;
  private button: Phaser.GameObjects.Image;
  private buttonLabel: Phaser.GameObjects.Text;
  public visible: boolean = false;

  constructor(scene: Phaser.Scene) {
    // Position centered on screen: 270, 160
    // Use AssetKeys.IMG_CENTER_POPUP as background image
    // messageText: Phaser.Text, multi-line, centered, wordWrap 300px, color #000000
    // button: AssetKeys.IMG_BUTTON image centered below message
    // buttonLabel: text centered on button
    // All initially invisible
  }

  show(message: string, buttonLabel: string, callback: () => void): void {
    this.message = message;
    this.messageText.setText(message);
    this.buttonLabel.setText(buttonLabel);
    this.bg.setVisible(true);
    this.messageText.setVisible(true);
    this.button.setVisible(true);
    this.buttonLabel.setVisible(true);
    this.visible = true;
    this.button.setInteractive({ useHandCursor: true })
      .once('pointerdown', () => {
        this.hide();
        callback();
      });
  }

  hide(): void {
    this.bg.setVisible(false);
    this.messageText.setVisible(false);
    this.button.setVisible(false);
    this.buttonLabel.setVisible(false);
    this.visible = false;
    this.button.removeInteractive();
  }

  destroy(): void { /* destroy all game objects */ }
}
```

## Update PlayScene

### Add CenterPopup property
```typescript
private centerPopup!: CenterPopup;
```

### In create(), add:
```typescript
this.centerPopup = new CenterPopup(this);
```

### Update the day-end logic in update():
Replace the direct call to onDayOver() with:
```typescript
if (this.time >= Const.dayDuration && !this.dayEnded) {
  this.time = Const.dayDuration;
  this.dayEnded = true;
  this.paper.enabled = false;
  this.feed.enabled = false;
  this.sound.play(AssetKeys.SFX_DAY_OVER, { volume: 0.25 });

  if (!this.centerPopup.visible) {
    this.centerPopup.show(
      'The day is over. There is no more time. We must send to print immediately.',
      'Send to Print',
      () => this.onSendToPrint()
    );
  }
}
```

### Replace onDayOver() with onSendToPrint():
```typescript
private onSendToPrint(): void {
  GameState.instance.readership.applyPaperSummary(this.paper.getSummary());
  this.paper.markNewsItemsUsed();
  Storage.save(this.sound.mute);
  this.scene.start('NightScene');
}
```

### Remove dayNumber++ from NightScene's "Go to Sleep" button
NightScene's button should now do exactly:
```typescript
GameState.instance.dayNumber++;
this.scene.start('MorningScene');
```
(This was already the case, but confirm it is NOT also incrementing in PlayScene.)

## Manual Verification
1. Play through a full day — timer expires → popup appears with "The day is over..." message
2. "Send to Print" button in popup confirms → transitions to NightScene
3. NightScene shows results (loyalty/reader changes based on placed articles)
4. "Go to Sleep" → MorningScene shows correct next day number
5. A blank paper → NightScene shows "paper is blank" comment and reader loss
6. 3+ interesting articles → NightScene shows reader gain comment
7. localStorage contains a save after clicking "Send to Print"
8. Reloading the page resumes at the correct day
9. No TypeScript errors
```

---

### Prompt 16 — NightScene: Full Results Display

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Full PlayScene with timer, Feed, Paper, CenterPopup, and save-on-print
- NightScene shell (black bg, printed paper, results text, StatMeters, "Go to Sleep" button)
- Readership.applyPaperSummary() generates detailed comments

Your task is to complete NightScene so the results text displays exactly as in the original game.

## Update src/scenes/NightScene.ts

### Update the results message builder in create()

```typescript
const rs = GameState.instance.readership;

// Format helper
const formatDelta = (delta: number): string => {
  if (delta > 0) return `   (+${delta})`;
  if (delta < 0) return `   (${delta})`;
  return '   (no change)';
};

let message = "Today's issue has been printed and distributed.\n\nRESULTS\n\n";
message += `      Loyalty: ${rs.curLoyalty}${formatDelta(rs.curLoyalty - rs.preLoyalty)}\n`;
message += `      Readership: ${rs.curReaderCount}${formatDelta(rs.curReaderCount - rs.preReaderCount)}\n\n`;
message += rs.comments;

this.messageText.setText(message);

// Center vertically between printed paper and button
// After setting text, reposition: messageText.y = 180 - messageText.height / 2
```

### Verify StatMeters shows updated values
statMeters.setValues(rs, true)  — animate=true so bars slide to new positions

### "Go to Sleep" button
On click:
```typescript
GameState.instance.dayNumber++;
this.scene.start('MorningScene');
```

## Manual Verification
Test each result condition and verify the correct comment appears:

Scenario A — Blank paper:
  Place no articles → "The paper is blank. Money was saved on ink, but you have lost many readers."

Scenario B — Too few articles (< 75% coverage):
  Place only one small article → "There are too few articles. You have lost readers."

Scenario C — Too few interesting articles (< 2):
  Place only politics articles (not interesting) → "There are not enough interesting articles."

Scenario D — Many interesting articles (> 2):
  Place 3+ interesting articles → "There are many interesting articles. You have gained readers."

Scenario E — Loyalty increased:
  Place positive loyalty articles → "The included articles have increased your readership's loyalty..."

Scenario F — Loyalty decreased:
  Place negative loyalty articles → "The included articles have decreased your readership's loyalty..."

Verify loyalty delta and reader count delta display correctly in the RESULTS section.
No TypeScript errors.
```

---

### Prompt 17 — MorningScene: All Message Branches

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Full PlayScene (timer, Feed, Paper, CenterPopup, save-on-print)
- Full NightScene (results, comments, StatMeters)
- MorningScene shell (logo, day text, placeholder message, "Start Work" button)
- GameState, Goal, GoalStatus, Readership all implemented

Your task is to complete MorningScene by implementing all message branches and the full game-over / win-condition logic, exactly as in the original game.

## Update src/scenes/MorningScene.ts

### Add a buildMessage() private method that returns { message: string, gameOver: boolean, rebelsWon: boolean }

Port the entire message-building logic from the original MorningState.as:

```typescript
private buildMessage(): { message: string; gameOver: boolean; rebelsWon: boolean } {
  const gs = GameState.instance;
  const rs = gs.readership;
  const dayNumber = gs.dayNumber;
  const goal = Goal.getGoalForDay(dayNumber);
  const prevGoal = Goal.getGoalForDay(dayNumber - 1);

  let message = '';
  let gameOver = false;
  let rebelsWon = false;

  const killMessage = 'Your services are no longer required. Your family has been eliminated and you will be reassigned.';

  if (dayNumber === 1) {
    message += 'Welcome to The [GOV] Times. You are the new editor-in-chief.\n\n';
    if (gs.stateInControl) {
      message += 'The war with Antegria is over and the rebellion uprising has been crushed. Order is slowly returning to [GOV].\n\n';
      message += 'The public is not loyal to the government.\n\n';
    } else {
      message += 'Freedom has returned to [GOV], but the public is skeptical.\n\n';
    }
    message += 'It is your job to increase their loyalty by editing The [GOV] Times carefully. ';
    message += 'Pick only stories that highlight the good things about [GOV] and its government.\n\n';
    message += 'You have 3 days to raise the public\'s loyalty to ' + goal?.targetLoyalty + '.\n\n';
    if (gs.haveWonAtLeastOnce) {
      message += 'We have found a new wife and child for you. ';
      message += 'As a precaution against influence, we are keeping them in a safe location.';
    } else {
      message += 'As a precaution against influence, we are keeping your wife and child in a safe location.';
    }

  } else if (goal && prevGoal && goal !== prevGoal) {
    // Transition between goals — check if previous goal was met
    if (prevGoal.id === 'first-state') {
      if (prevGoal.isMet(rs)) {
        message += 'You have completed your first task. The Great and Honorable Leader is pleased.\n\n';
        message += 'Continue to print positive articles and maintain a loyalty of at least ' + goal.targetLoyalty + '.\n\n';
        message += 'We must now work to increase readership. More minds is more power.\n\n';
        message += 'Attain at least ' + goal.targetReaderCount + ' readers by the end of day ' + goal.targetDayNumber + '.';
      } else {
        message += 'You have failed to inspire your readers and their loyalty remains weak.\n\n';
        message += killMessage;
        gameOver = true;
      }
    } else if (prevGoal.id === 'second-state') {
      if (prevGoal.isMet(rs)) {
        message += 'Congratulations, you have completed your second task. The Great and Honorable Leader is pleased.\n\n';
        message += 'From this point we will withdraw our close oversight.\n\n';
        message += 'Continue to increase readership and maintain the promotion of positive news.';
      } else {
        message += 'You have failed to acquire enough readers with loyalty ' + goal.targetLoyalty + '. Without a loyal audience, The [GOV] Times has no influence.\n\n';
        message += killMessage;
        gameOver = true;
      }
    }

  } else if (goal && goal.id.includes('state')) {
    // Working for the state — progress feedback
    if (rs.curLoyalty >= goal.targetLoyalty) {
      message += 'Good work. The Great and Honorable Leader has been notified of your diligent efforts.\n\n';
      message += 'Keep your reader\'s loyalty at ' + goal.targetLoyalty + ' or higher.';
    } else if (rs.getLoyaltyDelta() > 0) {
      message += 'You are making good progress.\n\n';
      message += 'Keep working towards a loyalty of ' + goal.targetLoyalty + ' or above by the end of day ' + goal.targetDayNumber + '.';
    } else if (rs.getLoyaltyDelta() < 0) {
      message += 'This is not good. Loyalty is dropping.\n';
      message += 'You must choose positive articles that cast [GOV] in a good light. Try harder.\n\n';
      message += 'Bring your reader\'s loyalty to at least ' + goal.targetLoyalty + ' by the end of day ' + goal.targetDayNumber + '.';
    } else {
      message += 'This is not good. Loyalty is not improving.\n';
      message += 'You must choose positive articles that cast [GOV] in a good light. Try harder.\n\n';
      message += 'Bring your reader\'s loyalty to at least ' + goal.targetLoyalty + ' by the end of day ' + goal.targetDayNumber + '.';
    }
    if (goal.targetReaderCount) {
      message += '\n';
      if (rs.curReaderCount >= goal.targetReaderCount) {
        message += 'Maintain at least ' + goal.targetReaderCount + ' readers.';
      } else {
        message += 'You must have ' + goal.targetReaderCount + ' or more readers by the end of day ' + goal.targetDayNumber + '.';
      }
    }
    message += '\n\n';
    message += this.getFamilyMessage(rs.curLoyalty);

  } else if (goal) {
    // Working for the rebels
    if (rs.getLoyaltyDelta() >= 0) message += 'Good morning.\n\n';
    if (rs.getLoyaltyDelta() < 0) message += 'A drop in reader loyalty has been noted. Try harder.\n\n';
    message += this.getPerformanceMessage(rs.curLoyalty) + '\n' + this.getFamilyMessage(rs.curLoyalty);

  } else {
    // Final day — no more goals
    if (prevGoal?.isMet(rs)) {
      message += 'We have done it!\n\n';
      message += 'Thank you my friend! Without your efforts the rebellion would have failed once again. ';
      message += 'A new era for our beloved nation begins!\n\n';
      message += 'I\'m truly sorry that we could not save your family.\n\n';
      message += 'We need someone with your skills to talk with the people. Come back tomorrow for your new position.\n\n';
      message += 'Long Live [GOV]!';
      gs.stateInControl = !gs.stateInControl;
      rebelsWon = true;
    } else {
      message += 'We have reviewed your file.\n\n';
      message += this.getPerformanceMessage(rs.curLoyalty) + '\n\n';
      message += 'The Great and Honorable Leader has decided that printed paper is old technology. ';
      message += 'The Ministry of Media will be moving to focus on online communications.\n\n';
      message += killMessage;
    }
    gameOver = true;
  }

  message += '\n\n';
  if (!gameOver) message += this.getTutorialMessage(dayNumber);
  message = GameState.expandGovNames(message);

  return { message, gameOver, rebelsWon };
}
```

### Implement the helper methods (port exactly from original):

getPerformanceMessage(loyalty: number): string
  Returns "Your performance is: -RATING-"
  RATING thresholds (loyalty vs Const.statMax=30):
    >= 30 → APPRECIATED
    > 20 → ACCEPTABLE
    > 10 → MARGINAL
    >= -10 → UNSATISFACTORY
    <= -30 → DISASTROUS
    < -20 → DISASTROUS
    < -10 → DISAPPOINTING

getFamilyMessage(loyalty: number): string
  Returns "Your family [status]."
  Status thresholds:
    >= 30 → "is receiving excellent treatment."
    > 20 → "is being well-cared for."
    > 10 → "lives normally under our care."
    >= -10 → "has lost several privileges."
    <= -30 → "endures daily beatings."
    < -20 → "suffers due to your failures."
    < -10 → "is being punished for your poor performance."

getTutorialMessage(dayNumber: number): string
  Returns a tutorial tip based on day (days 2–7 each have a tip; other days return ''):
    Day 2: Article Size — "Larger articles have more influence..."
    Day 3: Reader Interest — "The public is interested in sports, entertainment, and military..."
    Day 4: Article Positioning — "Article placement has no effect on loyalty..."
    Day 5: Weather — "The government cannot control the weather yet..."
    Day 6: Politics — "The public finds political stories uninteresting..."
    Day 7: Article Size and Reader Interest — "Article size does not affect reader interest..."
  Each tip is preceded by: '__________________________________________\n[Title]\n\n'

### Update create() to use buildMessage()

```typescript
const { message, gameOver, rebelsWon } = this.buildMessage();

// Set message text
this.messageText.setText(message);
this.messageText.setColor(rebelsWon ? '#ff0000' : '#000000');

// Center message vertically
this.messageText.y = 180 - this.messageText.height / 2;

// Button configuration
const buttonLabel = rebelsWon ? "Let's Go!" : (gameOver ? 'Accept Fate' : 'Start Work');
this.buttonLabel.setText(buttonLabel);

// Button callback
if (gameOver) {
  this.button.once('pointerdown', () => {
    GameState.instance.haveWonAtLeastOnce = true;
    Storage.clear();
    GameState.instance.reset();
    this.scene.start('MorningScene');
  });
} else {
  this.button.once('pointerdown', () => this.scene.start('PlayScene'));
}
```

## Manual Verification
Use debug keys (K to advance day) to walk through all game states:
- Day 1: Welcome message appears
- Days 2–3: Performance and family messages appear
- Day 3 end (if goal met): Success → second-state goal begins
- Day 3 end (if goal not met): Kill message → game over → reset to day 1
- Days 6–10: Rebel messages appear in feed; rebel branch messages appear in morning
- Day 10+ (rebel success): "We have done it!" message, stateInControl flips
- Day 10+ (rebel fail): Kill message → game over
- Tutorial tips appear on correct days
- [GOV] is replaced with Republia or Democria correctly throughout
- No TypeScript errors
```

---

### Prompt 18 — localStorage End-to-End

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Full game loop: PreloadScene → MorningScene → PlayScene → NightScene → MorningScene
- Storage.ts with save/load/clear/getMute
- Storage.save() called in PlayScene.onSendToPrint()
- Storage.load() called in PreloadScene.create()
- Storage.clear() called on game reset in MorningScene

Your task is to verify and harden the full save/load integration, and wire the mute preference into the persistence flow.

## Task 1: Verify save round-trip

In PreloadScene.create(), after Storage.load():
```typescript
// Apply mute preference before starting music
const muted = Storage.getMute();
// Store this so scenes can read it — write it to GameState or pass via scene data
// Simplest approach: store on GameState
(GameState.instance as GameState & { savedMute: boolean }).savedMute = muted;
```

Better approach: add `savedMute: boolean = false` as a property directly on GameState.ts. This avoids type casting.

In MorningScene, PlayScene, and NightScene, apply mute on scene create:
```typescript
this.sound.mute = GameState.instance.savedMute;
```

## Task 2: Harden the save schema version

Add a `version: number` field to SaveData (value = 1). In Storage.isValidSaveData(), require version === 1. If version doesn't match (old save format), return false so load() returns false and the game starts fresh rather than crashing.

## Task 3: Verify usedNewsItems persistence

After sending to print on day 2, the news items placed on day 1 should be marked used and not appear again. Verify:
1. Play day 1, place articles and send to print
2. Reload the page
3. Play day 2 — the articles from day 1 should not appear in the feed

The mechanism: Storage.save() records indices of used items; Storage.load() restores them.

## Task 4: Verify game reset clears save

When game over occurs (MorningScene calls GameState.instance.reset() and Storage.clear()):
- localStorage should have no save data
- Reloading the browser starts a fresh game on day 1

## Task 5: Edge cases

Ensure the game handles gracefully (no crash, just starts fresh):
- Manually corrupted localStorage value
- localStorage quota exceeded (write fails silently — already handled by try/catch)
- localStorage not available (private browsing with quota=0 — try/catch already handles this)

## Update src/utils/Storage.ts

Add version: 1 to SaveData and the isValidSaveData check.
Add savedMute property to GameState.ts.
Update all three game scenes to apply sound.mute from GameState.instance.savedMute on create.

## Manual Verification
1. Start fresh → play a full day → send to print → NightScene shows results
2. Reload browser → game resumes at day 2 with correct loyalty/reader count
3. Used news items from day 1 don't appear on day 2
4. Open browser DevTools → Application → localStorage → verify 'republiatimes-save' exists with valid JSON
5. Manually delete the localStorage key → reload → game starts at day 1
6. Manually corrupt the localStorage value → reload → game starts at day 1 (no crash)
7. Game over → "Accept Fate" → localStorage key is deleted → game starts at day 1
8. `npm test` all tests pass
```

---

### Prompt 19 — Mute Button in All Scenes

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The following already exists:
- Full game loop with all scenes implemented
- localStorage persistence including mute preference
- Placeholder mute buttons (text '[M]') in MorningScene and NightScene

Your task is to replace all placeholder mute buttons with the correct sprite-based toggle button and wire it consistently in all four scenes.

## File 1: src/components/MuteButton.ts

Create a reusable MuteButton component:

```typescript
import Phaser from 'phaser';
import { AssetKeys } from '../constants/AssetKeys';
import { GameState } from '../game/GameState';
import { Storage } from '../utils/Storage';

export class MuteButton {
  private sprite: Phaser.GameObjects.Image;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // IMG_MUTE is a 2-frame spritesheet (12×12 per frame: frame 0 = unmuted, frame 1 = muted)
    // Use setFrame to toggle between states
    this.sprite = scene.add.image(x, y, AssetKeys.IMG_MUTE)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });

    // Set initial frame based on current mute state
    this.updateFrame();

    this.sprite.on('pointerdown', () => {
      scene.sound.mute = !scene.sound.mute;
      GameState.instance.savedMute = scene.sound.mute;
      Storage.save(scene.sound.mute);  // persist immediately
      this.updateFrame();
    });
  }

  private updateFrame(): void {
    // frame 0 = audio on (not muted), frame 1 = audio off (muted)
    this.sprite.setFrame(this.scene.sound.mute ? 1 : 0);
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
```

Note: The Mute.png asset must be loaded as a spritesheet (not a plain image) to support setFrame. Update PreloadScene to load it as:
```typescript
this.load.spritesheet(AssetKeys.IMG_MUTE, 'assets/images/Mute.png', {
  frameWidth: 12,
  frameHeight: 12
});
```

## Wire MuteButton into all scenes

### MorningScene
- Remove the placeholder '[M]' text
- Add: `this.muteButton = new MuteButton(this, 10, 300);`
  (bottom-left corner, margin 10)

### PlayScene
- Add: `this.muteButton = new MuteButton(this, 265, 5);`
  (top-right area, matching original position)

### NightScene
- Remove the placeholder '[M]' text
- Add: `this.muteButton = new MuteButton(this, 10, 300);`

### PreloadScene
- No mute button needed (loading screen is brief)

## Manual Verification
1. Start game — mute button shows correct frame (unmuted = frame 0)
2. Click mute button in MorningScene → music stops → frame changes to frame 1
3. Navigate to PlayScene → audio remains muted → button shows frame 1
4. Click mute button → audio resumes → frame changes to frame 0
5. Navigate to NightScene → button shows correct state
6. Reload browser → mute preference is restored correctly
7. No TypeScript errors
```

---

### Prompt 20 — Debug Mode

```
You are working on a Phaser 3 TypeScript game called "Republia Times". The game is feature-complete. The following already exists:
- Full game loop: PreloadScene → MorningScene → PlayScene → NightScene → MorningScene
- All gameplay, persistence, and mute functionality working

Your task is to add debug keyboard shortcuts that are only active in development builds (Vite's `import.meta.env.DEV`). These must have zero effect in production builds.

## Debug keys to implement

| Key | Scene | Action |
|-----|-------|--------|
| K   | MorningScene | Increment dayNumber, restart MorningScene |
| O   | MorningScene | loyalty -= 10, restart MorningScene |
| P   | MorningScene | loyalty += 10, restart MorningScene |
| N   | MorningScene | readerCount -= 100, restart MorningScene |
| M   | MorningScene | readerCount += 100, restart MorningScene |
| K   | PlayScene    | Apply paper summary, mark used, increment day, go to NightScene |
| L   | PlayScene    | Toggle score overlay text |

## Implementation

### MorningScene — add at the end of create():
```typescript
if (import.meta.env.DEV) {
  const kb = this.input.keyboard;
  if (!kb) return;

  kb.on('keydown-K', () => {
    GameState.instance.dayNumber++;
    this.scene.start('MorningScene');
  });
  kb.on('keydown-O', () => {
    GameState.instance.readership.curLoyalty =
      Math.max(-Const.statMax, GameState.instance.readership.curLoyalty - 10);
    this.scene.start('MorningScene');
  });
  kb.on('keydown-P', () => {
    GameState.instance.readership.curLoyalty =
      Math.min(Const.statMax, GameState.instance.readership.curLoyalty + 10);
    this.scene.start('MorningScene');
  });
  kb.on('keydown-N', () => {
    GameState.instance.readership.curReaderCount =
      Math.max(0, GameState.instance.readership.curReaderCount - 100);
    this.scene.start('MorningScene');
  });
  kb.on('keydown-M', () => {
    GameState.instance.readership.curReaderCount += 100;
    this.scene.start('MorningScene');
  });
}
```

### PlayScene — add at the end of create():
```typescript
if (import.meta.env.DEV) {
  const kb = this.input.keyboard;
  if (!kb) return;

  kb.on('keydown-K', () => {
    GameState.instance.readership.applyPaperSummary(this.paper.getSummary());
    this.paper.markNewsItemsUsed();
    GameState.instance.dayNumber++;
    this.scene.start('PlayScene');
  });

  kb.on('keydown-L', () => {
    this.toggleScoreOverlay();
  });
}
```

### PlayScene — add score overlay:
```typescript
private scoreOverlay: Phaser.GameObjects.Text | null = null;
private scoreVisible: boolean = false;

private toggleScoreOverlay(): void {
  if (!import.meta.env.DEV) return;
  this.scoreVisible = !this.scoreVisible;
  if (this.scoreVisible) {
    const summary = this.paper.getSummary();
    const goal = Goal.getGoalForDay(GameState.instance.dayNumber);
    const text = summary.toString() + (goal ? ' | Goal: ' + goal.toString() : '');
    if (!this.scoreOverlay) {
      this.scoreOverlay = this.add.text(Const.paperX, 310, '', {
        color: '#ff0000',
        fontSize: '8px',
        backgroundColor: '#ffffff'
      });
    }
    this.scoreOverlay.setText(text).setVisible(true);
  } else {
    this.scoreOverlay?.setVisible(false);
  }
}
```

### Keyboard listener cleanup
In each scene's shutdown event handler, remove keyboard listeners to prevent them accumulating across scene restarts:
```typescript
this.events.on('shutdown', () => {
  this.input.keyboard?.removeAllListeners();
});
```
Add this to MorningScene, PlayScene, and NightScene.

## Production build verification
```bash
npm run build
```
Verify the build output does not include any debug key handler strings. The Vite bundler tree-shakes `import.meta.env.DEV` branches in production (they evaluate to `false` and are removed by the minifier).

## Manual Verification (dev mode only)
1. `npm run dev`
2. MorningScene: press K repeatedly → day number increments correctly
3. MorningScene: press O → loyalty decreases, scene refreshes with updated message
4. MorningScene: press P → loyalty increases
5. PlayScene: press K → day advances, scene reloads as next day's PlayScene
6. PlayScene: press L → red score overlay appears at bottom of paper area
7. PlayScene: press L again → overlay hides
8. `npm run build` → open dist/ in a browser → no debug keys function
9. `npm test` → all tests still pass
10. No TypeScript errors in dev or build
```

---

## Appendix: Annex Items (Post-MVP)

These are not part of any prompt above. Implement after the MVP is verified complete.

### A. Known Bug — Dead Readership Comment Branch (Annex A from specs)
In `Readership.applyPaperSummary()`, the second bonus comment branch has an identical condition to the first (`>` instead of `<`). The comment "The paper's decreasing readership has reduced its influence" never fires. Fix by changing the second condition to `<`.

### B. Texture Atlas (Annex B.1)
Replace 21 individual `this.load.image()` calls in PreloadScene with a single texture atlas loaded via `this.load.atlas()`. Generate the atlas with TexturePacker or Shoebox. This reduces HTTP requests from ~35 to ~3.

### C. Pixel Art Scaling (Annex B.4)
Add `pixelArt: true` to the Phaser game config if fonts or sprites appear blurry at large viewport sizes. This sets canvas-rendering to `image-rendering: pixelated` and uses nearest-neighbor texture filtering.

### D. Accessibility — Keyboard Article Placement (Annex B.6)
Tab to cycle through blurbs, arrow keys to choose size, Enter to spawn, arrow keys to position on paper grid, Enter to place.

### E. Multi-Touch Support — Missing `activePointers` Config
`src/main.ts` is missing the `input: { activePointers: 2 }` config block required for multi-touch (two-finger drag on tablet). Without it, Phaser only registers a single active pointer, meaning simultaneous touch gestures will be silently ignored. Fix:

```ts
// src/main.ts — inside the Phaser.Types.Core.GameConfig object
input: {
  activePointers: 2,
},
```

This was specified in blueprint Prompt 7 and specs §14 (Input & Touch Support) but was not included in the generated implementation.
```
