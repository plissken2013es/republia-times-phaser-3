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
