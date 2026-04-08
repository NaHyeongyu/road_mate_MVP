# Roadmate MVP Coding Conventions

## Purpose

This document defines the default coding conventions for this repository.
Both human contributors and Codex should follow these rules.

## Core Principles

1. Prefer readability over cleverness.
2. Keep one file focused on one responsibility.
3. Keep data flow explicit (state in, events out).
4. Avoid hidden side effects.
5. Keep diffs small and scoped.

## Architecture Boundary Rules

1. `App.tsx` only handles app-level branching and composition.
2. `src/app/screens/*` wraps app-shell states (loading, auth, signed-in).
3. `src/app/screens/screenBindings.ts` owns verbose `appState -> screen props` mapping.
4. `src/features/*` owns product logic and feature UI.
5. `src/features/shared/*` is only for genuinely shared cross-feature UI.
6. `src/ui/*` owns styling primitives and visual system composition.

## TypeScript Rules

1. Keep `strict`-safe code. Do not introduce `any` unless unavoidable.
2. Export public props/types used across files.
3. Prefer named exports. Keep `default export` only where already established (`App.tsx`).
4. Use `unknown` + narrowing instead of unsafe casts where possible.
5. Keep function signatures explicit for public helpers and hooks.

## React and Hooks Rules

1. Keep component render blocks concise. Split when a file grows too broad.
2. Keep event handler naming consistent:
   - Local handlers: `handleXxx`
   - Callback props: `onXxx`
3. Move repeated inline JSX callbacks into local handlers or bindings.
4. Keep side effects in hooks or action/util layers, not in presentational components.
5. Prefer early returns for loading/error/branching states.

## Styling Rules

1. Use `createStyles` + style fragments as the default styling path.
2. Avoid large inline style objects in screens/components.
3. Reuse theme values from `brandPalette`; avoid ad-hoc colors.
4. If a style becomes shared across domains, promote it to `ui/styleFragments/*`.

## Data, Storage, and Network Rules

1. Keep parsing/normalization in `features/*/utils`.
2. Keep storage keys and storage parsing centralized in utility modules.
3. Keep Supabase/Auth and AsyncStorage access out of pure presentational components.
4. Handle async failures with clear user-facing notice messages.

## File and Naming Rules

1. Components: `PascalCase.tsx`
2. Hooks: `useXxx.ts`
3. Utilities/actions: `camelCase.ts`
4. Keep domain folders shallow unless a file clearly needs sub-structure.
5. Split files before they become multi-responsibility dumps.

## Quality Gate Before Finishing Work

1. Run `npx tsc --noEmit`.
2. For UI changes, run `npm run start` and do a quick manual smoke check when possible.
3. If folder responsibilities change, update `docs/architecture.md`.
4. If team conventions change, update this document in the same PR.

## Commit Message Guideline

Use one of these prefixes:

- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `chore:`

