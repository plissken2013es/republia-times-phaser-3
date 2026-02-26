# Republia Times Phaser Port — Todo Checklist

## Phase 1 — Foundation

### Project Scaffold
- [x] Create Vite project (`npm create vite@latest republia-times -- --template vanilla-ts`)
- [x] Install deps: `phaser`
- [x] Install dev deps: `vitest`, `@vitest/ui`, `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
- [x] Replace `tsconfig.json` with strict config (ES2020, bundler resolution)
- [x] Replace `vite.config.ts` with `base: './'`, `publicDir: 'public'`, and Vitest config
- [x] Add `.eslintrc.json` with `@typescript-eslint/recommended` and no-explicit-any
- [x] Add `package.json` scripts: `test`, `test:ui`
- [x] Create minimal `src/main.ts` with BootScene and centered "Loading..." text at 540x320
- [x] Create minimal `index.html` with dark body background
- [x] Add `src/main.test.ts` trivial test
- [x] Verify `npm run dev` and `npm test` pass

### Constants & Asset Keys
- [x] Create `src/constants/Const.ts` with all layout constants
- [x] Create `src/constants/AssetKeys.ts` with image/audio/font keys
- [x] Add `src/constants/Const.test.ts` verifying key invariants
- [x] Verify `npm test` passes

### NewsItem & PaperSummary
- [x] Add `src/game/NewsItem.ts` with ArticleSize enum, helpers, and full data list
- [x] Add `src/game/PaperSummary.ts` with summary math and `toString()`
- [x] Add `src/game/NewsItem.test.ts` (count=64, weather, rebel, reset)
- [x] Add `src/game/PaperSummary.test.ts` (coverage and loyalty math)
- [x] Verify `npm test` passes and no Phaser imports

### Readership & Goal
- [x] Add `src/game/Readership.ts` with bonus logic, comments, and known bug preserved
- [x] Add `src/game/Goal.ts` with three goals and status helpers
- [x] Add `src/game/Readership.test.ts` (clamp, coverage thresholds, bonus, bug)
- [x] Add `src/game/Goal.test.ts` (thresholds and goal lookup)
- [x] Verify `npm test` passes and no Phaser imports

### GameState, Day, Util
- [x] Add `src/game/GameState.ts` singleton with savedMute
- [x] Add `src/game/Day.ts` with selection + appearTime logic
- [x] Add `src/utils/Util.ts` with `shuffleArray` and `clamp`
- [x] Add tests for Util + Day selection rules
- [x] Verify `npm test` passes and no Phaser imports

### Storage
- [x] Add `src/utils/Storage.ts` with versioned schema, save/load/clear
- [x] Persist usedNewsItemIndices and mute
- [x] Add Storage tests (valid/invalid schema, round-trip restore)
- [x] Verify localStorage mocks in Vitest

## Phase 2 — Scene Shells

### PreloadScene
- [x] Create `src/scenes/PreloadScene.ts` with progress bar
- [x] Load all assets via `AssetKeys`
- [x] Load `IMG_MUTE` as spritesheet (12x12, 2 frames)
- [x] On complete: `Storage.load()`, apply `GameState.savedMute`, start `MorningScene`

### MorningScene Stub
- [x] Create `src/scenes/MorningScene.ts` stub
- [x] White background, logo sprite, day number text
- [x] "Start Work" button → `PlayScene`

### NightScene Stub
- [x] Create `src/scenes/NightScene.ts` stub
- [x] Black background, printed paper image
- [x] "Go to Sleep" button → increment day and start `MorningScene`

### Clock & StatMeters
- [x] Implement `src/components/Clock.ts` with `setTime(fraction)`
- [x] Implement `src/components/StatMeters.ts` with `setValues(readership, animate)`
- [x] Wire Clock/StatMeters into MorningScene + NightScene stubs

## Phase 3 — Gameplay Core

### PlayScene Timer & Day
- [x] Create `src/scenes/PlayScene.ts` shell
- [x] White background, Clock, StatMeters
- [x] Instantiate `Day`, track time with speed (day 1 = 0.5)
- [x] Add "End Day" button to set speed = 10
- [x] At 75%: play alarm; at 100%: show popup placeholder and stop

### Paper Component
- [x] Implement `src/components/Paper.ts`
- [x] Pool 30 articles (10 per size), drag-and-drop, snapping, bounds
- [x] Overlap detection with red tint
- [x] Methods: `spawnArticleAtPointer`, `getSummary`, `markNewsItemsUsed`
- [x] Temporary dev harness for snapping/overlap validation (remove later)

### Feed Component
- [x] Implement `src/components/Feed.ts`
- [x] Pool 10 blurbs, scroll animation, addBlurb
- [x] Detect icon clicks and call `paper.spawnArticleAtPointer`
- [x] Render rebel leader blurbs in red
- [x] Temporary dev harness for feed interactions (remove later)

### Feed → Paper Integration
- [x] Wire Feed to Paper in PlayScene
- [x] Add blurbs as Day items appear
- [x] Ensure only one active drag at a time

### CenterPopup & PlayScene Completion
- [x] Implement `src/components/CenterPopup.ts` with show/hide
- [x] Block Feed/Paper when visible
- [x] On day end: show popup and disable interaction
- [x] On confirm: apply summary, mark used, `Storage.save()`, go to NightScene

## Phase 4 — Completion & Integration

### NightScene — Full Results
- [ ] Show results summary text from Readership
- [ ] Show printed paper image and StatMeters
- [ ] Play night music loop
- [ ] "Go to Sleep" button increments day and goes to MorningScene

### MorningScene — All Branches
- [ ] Implement full briefing logic with goals, game-over, rebel win
- [ ] Apply [GOV] substitution in all text
- [ ] Play main music loop
- [ ] Correct button label logic ("Start Work", "Accept Fate", "Let's Go!")
- [ ] Show StatMeters from day 2 onward

### localStorage End-to-End
- [ ] Ensure schema versioning enforced
- [ ] Apply mute before any music plays
- [ ] Used news items persist across reloads
- [ ] Add manual verification checklist in code comments

### Mute Button & Persistence
- [ ] Implement `src/components/MuteButton.ts`
- [ ] Use `IMG_MUTE` spritesheet frames
- [ ] Toggle `scene.sound.mute` and persist via Storage
- [ ] Wire into MorningScene, PlayScene, NightScene

### Debug Mode
- [ ] Add DEV-only debug keys (K/O/P/N/M in Morning, K/L in Play)
- [ ] Implement score overlay toggle in PlayScene
- [ ] Remove keyboard listeners on scene shutdown
- [ ] Confirm production build excludes debug paths

## Post-MVP (Annex)

### Known Bug Fix (Optional)
- [ ] Fix dead readership comment branch (`>` → `<`) after MVP verification

### Texture Atlas (Optional)
- [ ] Replace individual image loads with a texture atlas

### Pixel Art Scaling (Optional)
- [ ] Add `pixelArt: true` in Phaser config if needed

### Accessibility (Optional)
- [ ] Keyboard navigation for blurbs and paper placement
