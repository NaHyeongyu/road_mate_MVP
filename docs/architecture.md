# Roadmate MVP Architecture

## Goal

`rodemate_mvp` is organized so future work does not accumulate back into `App.tsx`.
Detailed coding rules are in `docs/coding-conventions.md`.

Use this rule first:

- `App.tsx` only owns app-level state, auth session wiring, storage orchestration, and screen branching.
- `src/features/*` owns user-facing product logic and UI.
- `src/features/shared/*` owns reusable UI shared across multiple features.
- `src/ui/*` owns visual system primitives such as styles and shared UI types.

## Current Structure

```text
src/
  app/
    hooks/
      useSessionState.ts
      useStoredPostsState.ts
    screens/
      AppAuthExperienceScreen.tsx
      AppCommunityExperienceScreen.tsx
      AppLoadingScreen.tsx
      screenBindings.ts
    types.ts
    useRoadmateAppState.ts
  brandTheme.ts
  lib/
    supabase.ts
  features/
    auth/
      hooks/
        useAuthFlow.ts
      screens/
        AuthConfigScreen.tsx
        AuthEmailScreen.tsx
        AuthOptionsScreen.tsx
        components/
          AuthEmailFormCard.tsx
          AuthModeSwitch.tsx
      types.ts
      utils/
        authHelpers.ts
        authValidation.ts
    community/
      actions/
        accountActions.ts
        postActions.ts
        types.ts
        vehicleActions.ts
      components/
        PostCard.tsx
        postCard/
          PostCardActions.tsx
          PostCardContactRow.tsx
          PostCardFooter.tsx
          PostCardHeader.tsx
          PostCardRouteStack.tsx
          PostCardWeekdayRow.tsx
          linking.ts
      screens/
        CommunityHomeScreen.tsx
        sections/
          CommunityBottomBar.tsx
          CommunityTabContent.tsx
          HomeTabSection.tsx
          MyPageTabSection.tsx
          SavedTabSection.tsx
          home/
            DriverGarageSection.tsx
            DriverHomeSection.tsx
            DriverMyPostsSection.tsx
            DriverRouteComposerSection.tsx
            OperatingDaysChips.tsx
            RiderFeedSection.tsx
            RouteDraftTextField.tsx
            RouteKindChipRow.tsx
      hooks/
        useCommunityActions.ts
        useCommunityCollections.ts
        useCommunityUiState.ts
        useUserCommunityStorageState.ts
      types.ts
      utils/
        routeDraft.ts
        routeForm.ts
        storage.ts
        userCommunityStorage.ts
    shared/
      components/
        BrandLogo.tsx
        Label.tsx
        NoticeBanner.tsx
        ScreenHeader.tsx
        ToggleChip.tsx
  model.ts
  seed.ts
  ui/
    createStyles.ts
    styleFragments/
      auth/
        appBarStyles.ts
        constants.ts
        formStyles.ts
        heroStyles.ts
        layoutStyles.ts
        providerStyles.ts
      authStyles.ts
      community/
        commonStyles.ts
        composerStyles.ts
        postActionStyles.ts
        postDetailStyles.ts
        postRouteStyles.ts
        postStyles.ts
        surfaceStyles.ts
      communityStyles.ts
      layout/
        bottomBarStyles.ts
        constants.ts
        roleToggleStyles.ts
        screenStyles.ts
      layoutStyles.ts
      styleTypes.ts
    types.ts
```

## Folder Rules

### `app`

- Keep `useRoadmateAppState.ts` as a composition root, not a logic dump.
- Put major app-level behaviors in dedicated hooks under `app/hooks/`.
- Keep app-shell screen wrappers (loading, auth branch, signed-in branch) under `app/screens/`.
- `app/screens/*` should delegate product UI to `features/*` and only handle app-level branching/wiring.
- Keep verbose `appState -> feature screen props` mapping logic in `app/screens/screenBindings.ts`.
- Current hook split:
  - `useCommunityUiState`: tab/filter/mode/notice/route-draft UI state
  - `useAuthFlow`: auth form state + auth submit/sign-out actions
  - `useCommunityCollections`: post list derivations (my/saved/visible)
  - `useCommunityActions`: app-level community actions composition
  - `communityActions/accountActions`: mode switching + withdrawal flow
  - `communityActions/vehicleActions`: driver vehicle save flow
  - `communityActions/postActions`: post create/delete/save flow
  - `useSessionState`: Supabase session hydrate/subscription
  - `useStoredPostsState`: local cache hydrate + Supabase route post sync/subscription
  - `useUserCommunityStorageState`: user-scoped vehicle/saved-post storage state
  - `communityStorage`: AsyncStorage read/write helper functions

### `features/auth`

- Add auth-only screens here.
- Add auth-only helpers, validators, or mappers in `utils/`.
- Examples for future work:
  - `AuthOAuthScreen.tsx`
  - `authCopy.ts`
  - `authValidation.ts`

### `features/community`

- Add driver/rider board functionality here.
- `screens/` should compose the full screen.
- `components/` should be smaller pieces used inside community screens.
- `utils/` should contain parsing, storage keys, formatting, and non-UI helpers.
- Card-level and form-level UI should keep splitting under nested folders (`components/postCard/*`, `screens/sections/home/*`) once a file starts to carry multiple responsibilities.
- Examples for future work:
  - `components/VehicleCard.tsx`
  - `components/RouteComposer.tsx`
  - `screens/DriverRoutesScreen.tsx`
  - `utils/postFilters.ts`

### `features/shared`

- Put reusable cross-feature UI here.
- Only move a component here if it is genuinely shared or is clearly intended to become shared.
- Current shared foundation:
  - `BrandLogo`
  - `NoticeBanner`
  - `ScreenHeader`
  - `ToggleChip`
  - `Label`

### `ui`

- Keep global styling and UI typing here.
- `createStyles.ts` is the single style entrypoint used by screen and component layers.
- `ui/styleFragments/*` should split styles by domain (`layout`, `auth`, `community`) instead of one giant style map.
- Domain style aggregators (`authStyles.ts`, `communityStyles.ts`, `layoutStyles.ts`) should stay thin and compose sub-fragments from subfolders.
- If a new visual primitive becomes app-wide, add it here instead of repeating inline styles.

## Common Header Rule

Use `src/features/shared/components/ScreenHeader.tsx` for top sections of major screens.

It should be the default choice when a screen needs:

- a kicker
- a title
- a subtitle
- a top-right action
- extra content under the title block

Do not rebuild custom header markup inside each screen unless the screen is visually different enough to justify a new component.

## How To Add New Work

### New screen

1. Create the screen in the relevant `features/<feature>/screens/` folder.
2. Keep screen props explicit.
3. Pass data and handlers from `App.tsx` or from the owning feature container.
4. Use `ScreenHeader` if the screen needs a standard top section.

### New reusable piece

1. Start in `features/<feature>/components/` if it is feature-specific.
2. Promote to `features/shared/components/` only when at least two screens/features use it.

### New helper

1. Put parsing/formatting/storage helpers in `features/<feature>/utils/`.
2. Avoid mixing UI strings and storage logic in `App.tsx`.

## What Should Stay Out Of `App.tsx`

- Screen layout markup
- Reusable cards/buttons/labels
- Formatting helpers
- Feature-specific parsing logic
- Large style definitions

If a change makes `App.tsx` longer because of UI markup, that code probably belongs in `features/*`.

## Next Good Refactors

- Add `features/profile/` once user profile editing starts.
- Move saved-post keys and vehicle profile from local storage to Supabase-backed user tables.
