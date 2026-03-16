# Republia Times — Spanish Localization: TODO

## Phase 1 — Infrastructure (extract strings, keep English)

- [ ] **1.1** Create `src/locale/strings.ts` with all UI label strings
- [ ] **1.2** Refactor `MorningScene.ts` — replace 52 hardcoded message fragments with `S.*` references
- [ ] **1.3** Refactor `NightScene.ts` — results header, delta format strings
- [ ] **1.4** Refactor `Readership.ts` — 7 comment strings
- [ ] **1.5** Refactor `PlayScene.ts` + `Clock.ts` + `StatMeters.ts` + `CenterPopup.ts` — UI labels
- [ ] **1.6** Extract `NewsItem.ts` text — 71 blurb + article text pairs into translatable form
- [ ] **1.7** Smoke test — game plays identically with extracted English strings

## Phase 2 — Translation

- [ ] **2.1** Translate UI strings in `strings.ts` (buttons, labels, headers)
- [ ] **2.2** Translate MorningScene messages:
  - [ ] Day 1 welcome + intro
  - [ ] Goal transition messages (first-state, second-state success/fail)
  - [ ] Mid-goal feedback (progress, loyalty dropping, not improving)
  - [ ] Performance ratings (APPRECIATED → DISASTROUS)
  - [ ] Family status messages (6 tiers)
  - [ ] Tutorial tips (days 2-7)
  - [ ] Rebel victory / game over endings
- [ ] **2.3** Translate all 71 news items:
  - [ ] Political/government items (~25)
  - [ ] Military items (~15)
  - [ ] Sports/entertainment items (~12)
  - [ ] Weather items (~6)
  - [ ] Critical/plot items (~8)
  - [ ] Rebel leader messages with `|`-branching (~5)
- [ ] **2.4** Translate Readership comment strings (7 strings)
- [ ] **2.5** Assess + fix article headline fonts:
  - [ ] Check if original TTFs exist in `legay_HaxeFlixel_src/`
  - [ ] If yes: regenerate MotorolaScreentype, SILKWONDER, SG03 with Latin chars
  - [ ] If no: constrain article headlines to ASCII-only characters
- [ ] **2.6** Review all `[GOV]` usages in Spanish context for grammar

## Phase 3 — Validation

- [ ] **3.1** Visual review: MorningScene — day 1, day 2-3 (goal active), day 4 (goal transition), day 8+ (rebel path)
- [ ] **3.2** Visual review: PlayScene — feed blurb text fits, article headlines readable, "Terminar el Dia" button
- [ ] **3.3** Visual review: NightScene — results text, Readership comments, stat labels
- [ ] **3.4** Fix text overflow — shorten any translations that break layout
- [ ] **3.5** Full playthrough test — play 10 days in Spanish, both paths (state + rebel)
- [ ] **3.6** Edge case test — rebel victory screen, game over screen, replay with "haveWonAtLeastOnce"

## Notes

- **Priority order:** Phase 1 first (no translation yet, just extraction). Then 2.1 + 2.5 (UI + fonts). Then 2.3 (bulk news items). Then 2.2 (messages). Then Phase 3.
- **Biggest effort:** Step 2.3 (71 news items × 2 strings each = 142 translations)
- **Biggest risk:** Article fonts missing Latin chars (step 2.5)
- **Keep English accessible:** Consider keeping English strings as comments or a parallel object for reference during translation
