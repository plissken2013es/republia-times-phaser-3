# Repository Guidelines

## Project Structure & Module Organization

- `legay_HaxeFlixel_src/` contains all ActionScript 3 source (`*.as`) and the build `Makefile`.
- `legay_HaxeFlixel_src/assets/` holds embedded assets (PNG, MP3, TTF). These are referenced via `[Embed]` in `Assets.as`.
- Output SWF is expected at `www/RepubliaTimes.swf` (relative to `legay_HaxeFlixel_src/`).

## Build, Test, and Development Commands

- `cd legay_HaxeFlixel_src`
- `make` builds the Flash `.swf` using `mxmlc` and the Flixel source path in `Makefile`.

Notes:
- The Makefile expects `mxmlc` (Adobe Flex/AIR SDK) on `PATH`.
- The Flixel path is hardcoded as `~/Projects/LudumDare/flixel/`. Update `FLIXEL = ...` in `legay_HaxeFlixel_src/Makefile` if your local path differs.

## Coding Style & Naming Conventions

- Indentation: tabs (observed in existing `.as` files).
- Classes: PascalCase, filenames match class names (e.g., `RepubliaTimes.as`, `MorningState.as`).
- Constants: lowerCamelCase `public static const` fields in `Const.as`.
- Prefer minimal inline comments; use short, targeted notes for non-obvious logic.

## Testing Guidelines

- No automated test framework is present in this repository snapshot.
- If you add tests, keep them close to the source (e.g., `legay_HaxeFlixel_src/tests/`) and document run commands in this file.

## Architecture Overview

- Entry point: `RepubliaTimes.as` extends `FlxGame` and boots into `MorningState`.
- States: `MorningState`, `PlayState`, and `NightState` are the main `FlxState` classes.
- Core gameplay: `Feed` manages incoming blurbs, `Paper` handles the layout grid, and `GameStatus` is the global state singleton.

## Commit & Pull Request Guidelines

- Git history is not available in this workspace snapshot, so no existing commit convention can be verified.
- Use concise, imperative commit messages (e.g., `Fix paper layout overlap`).
- PRs should include: a brief summary, build notes (`mxmlc` version if relevant), and screenshots/GIFs for gameplay or UI changes.

## Security & Configuration Tips

- Do not commit local SDK paths or credentials. Keep SDK paths in `Makefile` or local tooling configs that are easy to edit per environment.
