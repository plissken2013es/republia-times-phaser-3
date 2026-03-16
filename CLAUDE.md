# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Republia Times** is a Flash game by Lucas Pope (@dukope), written in **ActionScript 3** using the **Flixel** game framework (AS3 Flixel, not HaxeFlixel — the folder name `legay_HaxeFlixel_src` is misleading). All source lives in `legay_HaxeFlixel_src/`.

## Build

Requires `mxmlc` (Adobe Flex/AIR SDK) and a local copy of the AS3 Flixel library.

```bash
cd legay_HaxeFlixel_src
make
# outputs to ../www/RepubliaTimes.swf
```

The Makefile expects:
- `mxmlc` on PATH
- Flixel source at `~/Projects/LudumDare/flixel/` (hardcoded in Makefile)

To change the Flixel path: edit `FLIXEL` in the Makefile.

## Architecture

### Entry Point & Game Loop

`RepubliaTimes.as` extends `FlxGame` and boots into `MorningState`. The game runs at a logical 540×320 with 2× pixel scaling.

### State Machine

Three `FlxState` subclasses cycle in order:

| State | File | Purpose |
|---|---|---|
| `MorningState` | `MorningState.as` | Daily briefing, goal tracking, tutorial tips |
| `PlayState` | `PlayState.as` | Core newspaper editing gameplay |
| `NightState` | `NightState.as` | Results screen after day ends |

`MorningState` checks `GameStatus` to determine which message/goal to show. After the final day it resolves either the rebel or state ending and resets via `GameStatus.reset()`.

### Global Singleton

`GameStatus` (in `GameStatus.as`) is a singleton (`GameStatus.instance`) holding:
- `dayNumber` — current day (1-based)
- `readership` — the `Readership` object (loyalty + reader count)
- `stateInControl` — `true` = State controls the paper (name = "Republia"), `false` = Rebels won (name = "Democria")
- `haveWonAtLeastOnce` — affects intro message on replay

The `[GOV]` placeholder in all story/message strings is replaced at runtime via `GameStatus.expandGovNames()`.

### Core Gameplay (PlayState)

Two interactive objects share the screen:

- **`Feed`** (`Feed.as`) — Left panel. Scrolling list of `Blurb` items (one per `NewsItem`). Blurbs appear progressively during the day based on `NewsItem.appearTime`. Clicking a blurb's S/M/B icon spawns an article onto the paper.
- **`Paper`** (`Paper.as`) — Right panel. Drag-and-drop newspaper layout on a grid (grid unit `p = 50px`, from `Const.as`). Articles snap to the grid on mouse-up; overlapping articles turn red.

`Day.as` selects and shuffles the day's news items, separating them into critical (plot-driven, with `dayRangeStart`/`dayRangeEnd`), weather, and non-critical pools.

### Scoring / Win Conditions

At day end, `Paper.getSummary()` returns a `PaperSummary` with:
- `totalLoyaltyEffect` — sum of `newsItem.loyaltyEffect × articleSizeMult` (S=1×, M=3×, B=6×)
- `numInterestingArticles` — count of interesting articles placed
- `articleCoveragePercentage` — fraction of paper area filled

`Readership.applyPaperSummary()` applies the summary: adjusts loyalty (clamped ±30) and reader count (bonuses/penalties for coverage and interesting articles). Reader count above 200 provides a loyalty multiplier bonus.

`Goal.as` defines three sequential goals (hardcoded in `allGoals`):
1. `first-state` — reach loyalty 20 by day 3
2. `second-state` — maintain loyalty 20 and 400 readers by day 5
3. `last-rebel` — drop loyalty to −30 with 1000 readers by day 10 (rebel path)

### Content Data

All `NewsItem` content is hardcoded as a static array in `NewsItem.as`. Items have:
- `dayRangeStart` / `dayRangeEnd` — 0/0 = always available; specific values = plot-critical
- `loyaltyEffect` — `kLoyaltyUp(1)`, `kLoyaltyDown(-1)`, or `kLoyaltyNone(0)`
- `interesting` — affects reader count
- Rebel leader messages use `***` prefix and `|`-delimited text selected by current goal status

### Assets

All embedded assets are declared in `Assets.as` using `[Embed]` metadata. Fonts are embedded as `fontFamily` names (`FEED`, `ARTICLEB`, `ARTICLEM`, `ARTICLES`) referenced by string in `Article` text formatting.

### Layout Constants

`Const.as` defines the layout grid:
- `s = 10` — base pixel unit
- `p = 50` — page grid unit (5×s)
- Feed area: 60×0 to 260×320; Paper area: 330×40 to 530×290

### Debug Keys (FlxG.debug mode only)

In `PlayState` and `MorningState`:
- `K` — advance day
- `O`/`P` — loyalty −10/+10
- `N`/`M` — reader count −100/+100
- `L` (PlayState only) — show paper score overlay

## Gameplay Observations (from playing the original HTML5 version)

### PlayState — Core Interaction Flow

1. **Spawning articles:** Click a blurb's S/M/B icon in the feed → article appears attached to the mouse cursor at the chosen size.
2. **Placing articles:** Drag the article over the paper grid → release to snap it to the nearest grid cell.
3. **Overlap detection:** Articles that overlap each other **turn red** — clear visual feedback that you need to rearrange. Valid (non-overlapping) articles stay white.
4. **Checkmarks:** Once an article is placed, a checkmark appears on the corresponding S/M/B icon in the feed, showing which size was used.
5. **Resizing:** Clicking a *different* size icon for the same story replaces the article on the paper at the new size. The checkmark moves to the new icon.
6. **Dragging existing articles:** Articles already on the paper can be picked up and repositioned by clicking and dragging them.

### Article Sizes (visual, from screenshots)

| Size | Grid cells (approx W×H) | Headline style | Loyalty multiplier |
|---|---|---|---|
| **S** (small) | 1×2 (50×100 logical) | Small text | 1× |
| **M** (medium) | 2×2 (100×100 logical) | Medium text | 3× |
| **B** (big) | 4×3 (200×150 logical) | Large bold headline | 6× |

### Time & Pacing

- Clock runs **6AM → 6PM** (in-game time, accelerated).
- News stories appear **progressively** throughout the day — the feed starts with 1-2 stories and more arrive over time.
- When the clock hits 6PM, a popup forces "Send to Print" — no more edits allowed.
- A typical day allows placing **6-8 articles** if you work quickly.

### Paper Layout

- The paper has a **"The Republia Times"** header that cannot be moved.
- Below the header is an **empty grid** (~4×5 cells = 200×250 logical pixels).
- Articles snap to the 50px grid on mouse-up.
- Good strategy: fill the paper completely (high coverage %) with a mix of sizes.

### Feed Panel

- Left side scrolling list of `Blurb` items.
- Each blurb shows the story headline text and 3 size icons (B, M, S from left to right).
- Stories scroll upward as new ones arrive at the bottom.
- Rebel leader messages appear in **red text**.

### Night/Results Screen

- After "Send to Print", the NightState shows how loyalty and readership changed.
- Shows a miniature preview of the printed newspaper at the top.
- **Loyalty** effect depends on which stories you placed and at what size (loyaltyEffect × sizeMult).
- **Reader count** is affected by coverage percentage and interesting articles (sports, entertainment, military, weather).
- Feedback messages explain what happened: "interesting articles" → gained readers, "increased loyalty" → positive articles placed.
- Example Day 1 result: Loyalty 0→2 (+2), Readership 200→250 (+50) with 5 articles, some overlapping.
- **"Go to Sleep"** button advances to the next day's MorningState.

### Day 2+ Morning Briefing

- Shows progress feedback ("You are making good progress" / "Loyalty is dropping").
- Reminds of current goal and deadline ("loyalty of 20 by end of day 3").
- Shows family status based on current loyalty level.
- Tutorial tips appear on days 2-7 (Article Size, Reader Interest, Positioning, Weather, Politics, Size & Interest).
- Stat meters (Readers + Loyalty gauge) appear from Day 2 onward.

## Playwright Browser Testing (Original Game)

### Live Original Game

Lucas Pope already ported The Republia Times from Flixel/Flash to **HaxeFlixel/HTML5**. The playable version lives at:

- **Wrapper page:** `https://dukope.com/trt/play.html` (embeds iframe)
- **Direct game URL:** `https://dukope.com/files/ld/js-ld-warmup-trt/index.html` (canvas only, use this)

The game uses **Lime/OpenFL** as the HTML5 backend. The main JS bundle is `ld-warmup-trt.js`.

### Local Copy (`republia-original-html5/`)

A patched local copy of the HTML5 game lives in `republia-original-html5/`. Serve it with:
```bash
npx serve -l 5174 republia-original-html5/
```

**Patch:** `ld-warmup-trt.js` has been modified to export `flixel_FlxG` and `Util` to `$global` (window), making game internals accessible from Playwright's `page.evaluate()`:
```js
// Access from Playwright:
await page.evaluate(() => ({
  width: flixel_FlxG.width,        // 540
  height: flixel_FlxG.height,      // 320
  mouse: { screenX: flixel_FlxG.mouse.screenX, screenY: flixel_FlxG.mouse.screenY },
  zoom: flixel_FlxG.camera.zoom,   // 2
  scale: { x: flixel_FlxG.scaleMode.scale.x, y: flixel_FlxG.scaleMode.scale.y }  // 1, 1
}));
```

**Confirmed values:** FlxG.width=540, height=320, camera.zoom=2, scaleMode.scale=(1,1).

### Playwright MCP Setup

The `@playwright/mcp` server is configured in `.claude.json` for this project:
```json
"playwright": {
  "type": "stdio",
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@playwright/mcp@latest"]
}
```

### Canvas & Coordinate System

| Property | Value |
|---|---|
| Canvas CSS size | 1080×640 px |
| Canvas internal resolution | 1080×640 px |
| Game logical resolution | 540×320 px |
| Scale factor | 2× (logical → screen: multiply by 2) |
| Device pixel ratio | 1 |

**Best practice:** Resize the Playwright viewport to `1080×640` so the canvas sits at `(0, 0)` with no offset. Without this, the canvas has a `margin-top: 576px` that complicates coordinate math.

```js
await page.setViewportSize({ width: 1080, height: 640 });
```

### Coordinate Mapping (Logical → Screen)

Screen coordinate = logical coordinate × 2. Key positions:

**Feed area (left panel):**
- Feed starts at logical `(60, 0)` → screen `(120, 0)`
- Feed dimensions: 260×320 logical → 520×640 screen
- Blurb text: `blurb.x + 10` logical
- Blurb S/M/B icon positions (relative to blurb.x):
  - **B** (big): `+204, +4` logical → screen `blurb_screen_x + 408, blurb_screen_y + 8`
  - **M** (medium): `+229, +4` logical → screen `blurb_screen_x + 458, blurb_screen_y + 8`
  - **S** (small): `+247, +4` logical → screen `blurb_screen_x + 494, blurb_screen_y + 8`
- Since `blurb.x = feed.x = 60` logical = 120 screen, the absolute icon positions are:
  - **B**: screen x ≈ 528, **M**: screen x ≈ 578, **S**: screen x ≈ 614

**Paper area (right panel):**
- Paper starts at logical `(330, 40)` → screen `(660, 80)`
- Paper dimensions: 200×250 logical → 400×500 screen
- Grid unit: 50 logical = 100 screen

**Buttons (centered):**
- `FlxG.width/2 = 270` logical → screen x = 540
- `buttonW = 120` logical → 240 screen
- MorningState "Start Work": logical `(210, 270)` → screen `(420, 540)`, center at `(540, 558)`
- CenterPopup (306×206 asset): positioned at logical `(117, 57)`, button at logical `(210, 213)`

### Known Issues & Workarounds

1. **OpenFL audio gate overlay:** ~~Requires manual click~~ **FIXED in local copy.** The overlay was drawn by `shared_BootWaiter` (a Flixel sprite button). Patched by setting `shared_BootWaiter.clickedAtLeastOnce = true` in `ld-warmup-trt.js`. Game now loads directly without any manual interaction needed.

2. **`page.mouse.move()` does NOT update FlxG.mouse.** Only `page.mouse.click()` (mousedown/mouseup) triggers Lime's event handler which updates FlxG.mouse position. The `mousemove` DOM events are not processed by Lime's HTML5 backend.

3. **FlxButton clicks work** for buttons like "Start Work" (MorningState) because FlxButton checks FlxG.mouse on mouseUp. Use `setGlobalScreenPositionUnsafe()` to pre-set the position, then `page.mouse.click()` to trigger. Confirmed working for: "Start Work", "Send to Print", "Go to Sleep".

4. **Feed blurb icon clicks do NOT work via DOM events.** The Feed's `onMouseDown` checks `FlxG.mouse` position against blurb sprite bounds, but by the time the handler runs, Lime has already overwritten the mouse position with the DOM event coordinates — which may differ from what was set via `setGlobalScreenPositionUnsafe`.

5. **Solution: Direct JS API calls.** Use `paper.spawnArticleAtMouse(size, asset, newsItem)` directly via `page.evaluate()` to bypass all DOM click issues. This is the **recommended approach** for programmatic gameplay (see "Direct JS API" section below).

### Direct JS API (local patched version only)

With the patched local version, game internals are accessible via `page.evaluate()`:

```js
// Access game state
const state = flixel_FlxG.game._state;  // current FlxState (PlayState/MorningState/NightState)
const feed = state.feed;                 // Feed object with blurbs array
const paper = state.paper;               // Paper object with articles array

// Read blurb data
feed.blurbs.forEach(b => {
  if (b.visible) console.log(b.text.text, b.articleSpriteB.x, b.articleSpriteB.y);
});

// Spawn article programmatically (bypasses DOM click issues)
// size: 0=S, 1=M, 2=B | asset: "assets/ArticleSmall.png" / "ArticleMed.png" / "ArticleBig.png"
flixel_FlxG.mouse.setGlobalScreenPositionUnsafe(logicalX * 2, logicalY * 2);
paper.spawnArticleAtMouse(2, "assets/ArticleBig.png", blurb.newsItem);

// Place article by clicking on paper grid position
flixel_FlxG.mouse.setGlobalScreenPositionUnsafe(paperX * 2, paperY * 2);
// then page.mouse.click(paperX * 2, paperY * 2) to trigger mouseUp
```

**Coordinate formula for `setGlobalScreenPositionUnsafe`:** pass `logicalCoord × 2` (because camera zoom = 2, scaleMode = 1).

### Screenshots

All screenshots from Playwright sessions are saved in `.playwright-mcp/screenshots/`.
