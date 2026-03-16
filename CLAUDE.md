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
- Loyalty effect depends on which stories you placed and at what size (loyaltyEffect × sizeMult).
- Reader count is affected by coverage percentage and interesting articles.

## Playwright Browser Testing (Original Game)

### Live Original Game

Lucas Pope already ported The Republia Times from Flixel/Flash to **HaxeFlixel/HTML5**. The playable version lives at:

- **Wrapper page:** `https://dukope.com/trt/play.html` (embeds iframe)
- **Direct game URL:** `https://dukope.com/files/ld/js-ld-warmup-trt/index.html` (canvas only, use this)

The game uses **Lime/OpenFL** as the HTML5 backend. The main JS bundle is `ld-warmup-trt.js`.

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

1. **OpenFL audio gate overlay:** The first time the game loads, there's a "click to play" overlay (white circle with play triangle) that requires a real user gesture to dismiss. Playwright's programmatic clicks do NOT bypass this — the user must manually click the overlay in the Playwright browser window once.

2. **FlxButton click detection:** `FlxButton.onUp` fires on mouse-up when the cursor is over the button. Playwright's `page.mouse.click()` works for this (confirmed: "Start Work" button). However, clicking other FlxButton instances (e.g. CenterPopup "Send to Print") was unreliable in testing — coordinates appeared correct but clicks didn't register. This may be a timing issue with the game's update loop or a Lime/OpenFL input handling quirk in HTML5 mode.

3. **Feed blurb icon clicks:** Clicking S/M/B icons to spawn articles also failed to register despite correct coordinates. The `Feed.onMouseDown` handler checks `FlxG.mouse` position, which is updated by OpenFL's input system — there may be a frame-timing issue where the mouse position isn't updated before the click handler runs.

4. **Possible workaround (untested):** Using `page.mouse.move()` to the target, waiting a frame (~17ms), then `page.mouse.down()` + `page.mouse.up()` separately might give OpenFL time to register the mouse position before the click.

### Screenshots

All screenshots from Playwright sessions are saved in `.playwright-mcp/screenshots/`.
