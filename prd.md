# PRD: Krysha's Snack Kingdom

## 1. Overview

Krysha's Snack Kingdom is a Next.js 14 web app that helps a 5-year-old girl named Krysha and her father (Daddy) plan healthy, nut-free snacks. Daddy manages the food library and pantry; the AI fairy persona (name customisable) generates contextually appropriate snack combos, recipes, and food discovery suggestions. The app is deployed as a Vercel-hosted PWA-style site, uses no database (localStorage only), and is tuned for the Singapore food context.

---

## 2. Problem Statement

Feeding a young child with clear food preferences, a school nut-free policy, and a Singapore cultural food context is a daily logistics problem. Without a structured tool, Daddy must mentally track which foods Krysha likes, what is physically in the pantry, and how to combine them into balanced snack boxes that meet school rules. The app removes that cognitive load and makes snack planning a delightful activity Krysha can participate in directly.

**Primary user:** Krysha (5 years old) — interacts with the UI visually, taps cards and stars, names her fairy.
**Co-user:** Daddy — manages the food library, interprets AI results, acts on shopping and cooking suggestions.

---

## 3. Goals & Success Metrics

- Daddy can generate a valid, school-compliant snack box combo in under 60 seconds from app open.
- Krysha can identify her favourite foods on-screen and rate them without adult assistance (emoji + star taps require no reading).
- No nut-containing food can appear in any AI recommendation or be saved to the food library.
- Daddy can build a food library of 20+ items in a single session using AI suggestions without manual typing for each item.
- The app loads and is interactive within 3 seconds on a mid-range Android device on a Singapore 4G connection.

---

## 4. Scope

**In scope (current v1 feature set — fully built):**
- Food library management: add, edit, delete, categorise, rate, toggle pantry status.
- Emoji picker (40-item grid) and category auto-emoji defaults.
- Client-side and prompt-level nut detection and blocking.
- AI Snack Pack: 3 school snack combos + gap analysis with inline add-to-library buttons.
- AI Cook Together: 2–3 kid-friendly recipes with missing ingredients highlighted.
- AI Try New: 3 new food discoveries with challenges and one-tap add to library.
- AI Singapore Suggestions: 20 Singapore-appropriate food ideas, multi-select, bulk add.
- Customisable AI fairy name persisted to localStorage.
- Dual navigation: sticky desktop top bar + fixed mobile bottom tab bar.
- Credits error and generic error handling with fairy-persona messaging.

**Out of scope (not built, not planned for v1):**
- User authentication or multi-profile support — single-user app for one family.
- Backend database or server-side state — localStorage constraint is intentional.
- Push notifications or reminders — no service worker planned.
- Nutritional data lookup or calorie counting — app targets enjoyment and balance, not clinical nutrition.
- Printing or PDF export of snack plans.

---

## 5. Functional Requirements

### Food Library

1. The user shall be able to add a food item by entering a name (max 50 chars), selecting an emoji from a 40-item picker, choosing one of 7 categories, and toggling pantry status — all within the AddFoodForm on `/favorites`.
2. The system shall reject any food name that matches the `containsNut()` keyword list, display a nut-free warning inline, and prevent the item from being saved.
3. The system shall default the emoji to the category's representative emoji unless the user manually selects a different one.
4. The user shall be able to edit an existing food item's name, emoji, and category inline from the FoodCard without navigating away.
5. The user shall be able to delete a food item from the FoodCard with a single tap; the card shall animate out before removal.
6. The user shall be able to rate a food item 1–5 stars (or leave it at 0 = unrated) via the StarRating component on the FoodCard.
7. The user shall be able to toggle a food's pantry status (in pantry / need to buy) from both the FoodCard and the AddFoodForm.
8. The user shall be able to filter the food grid by category using pill buttons; the "All" pill shall always be present.
9. The system shall persist all food library changes to `localStorage` key `krysha_snacks_v1` immediately on each mutation.
10. The system shall migrate existing localStorage data that lacks the `inPantry` field by defaulting `inPantry` to `true`.

### AI Snack Pack (`/snack-pack`)

11. The system shall only use foods marked `inPantry: true` as inputs to the snack-pack prompt.
12. The system shall display the pantry food list to Daddy before the AI call so he can verify the inputs.
13. The system shall show an empty-state prompt guiding Daddy to add favourites when `foods.length === 0`, or to mark pantry items when `pantryFoods.length === 0` but foods exist.
14. The AI response shall include a greeting, 0 or more gap warnings (for missing snack box components), 3 snack combos, and a closing note.
15. The system shall render each gap warning in a component-specific colour (fruit = rose, protein = amber, healthy fat = green, dip = purple).
16. Each gap suggestion shall include an inline "Add +" button; tapping it shall add the food to the library with `inPantry: true` and visually confirm with a checkmark.
17. The system shall display an "All 4 components covered" green badge when `gaps` is an empty array.

### AI Cook Together (`/cook-together`)

18. The system shall pass all foods (pantry + need to buy) to the cook-together prompt.
19. Each recipe card shall display name, emoji, full ingredient list, a visually distinct "missing ingredients" sub-list (items not in pantry), step-by-step instructions, and a fun fact.
20. The system shall show an empty-state prompt with a CTA to `/favorites` when `foods.length === 0`.

### AI Try New (`/try-new`)

21. The system shall pass all existing food names to the try-new prompt so the AI avoids duplicates.
22. Each new food card shall display name, emoji, category, why-try-it description, taste profile, and a mini challenge for Krysha.
23. Each new food card shall have a one-tap "Add to My Kingdom" button; tapping it shall add the food with `inPantry: false` and the correct category.
24. The system shall work even when `foods.length === 0` (AI suggests without constraints).

### AI Singapore Suggestions (`/favorites` — SuggestionsPanel)

25. The system shall fetch 20 Singapore-appropriate food suggestions from the AI, excluding any food already in the library.
26. The system shall apply a client-side nut filter (`containsNut()`) to all returned suggestions before rendering.
27. The user shall be able to select individual suggestions, select all 20, or clear the selection.
28. The "Add N foods to My Kingdom" button shall only appear when at least 1 item is selected.
29. All foods added via SuggestionsPanel shall default to `inPantry: false`.

### Fairy Name

30. The user shall be able to edit the fairy name from the home page via an inline text input (max 20 chars in UI).
31. The system shall persist the fairy name to `localStorage` key `krysha_fairy_name_v1` on commit (Enter key or checkmark tap).
32. The system shall default to "Pixie" if the name field is blank or the key is absent.
33. The system shall sanitise the fairy name server-side by stripping `'"\\`, backtick, newline, `{}[]` characters and capping at 30 chars before injecting it into any prompt.

### Navigation

34. The desktop navigation shall be a sticky top bar visible on screens `md` and above, containing a home logo link and 4 section links.
35. The mobile navigation shall be a fixed bottom tab bar visible below `md`, containing 5 tabs (Kingdom, Favourites, Snack Pack, Cook, Try New), each with an emoji and label.
36. The active route shall be visually distinguished in both nav variants.

### Error Handling

37. The system shall detect a `creditsError` in the API response and display a `CreditsErrorCard` with instructions for Daddy to recharge the Anthropic account.
38. The system shall display a fairy-persona error message for all other API failures, with retry available via the primary action button.

---

## 6. Non-Functional Requirements

**Performance**
- Time to interactive on first load: under 3 seconds on a mid-range Android device on a 4G connection (Singapore average ~50 Mbps download).
- AI API response time: acceptable range under 8 seconds for `claude-haiku-4-5-20251001` at `max_tokens: 2048`. Loading states must be visible immediately on button tap.
- localStorage reads on page mount must not block rendering; all `useEffect` data loads are deferred.

**Accessibility**
- All interactive elements must meet the `min-h-[44px]` minimum touch target.
- Toggle switches (pantry) must carry `role="switch"` and `aria-checked`.
- Icon-only buttons must carry `aria-label`.
- Color must not be the sole differentiator for state.
- Target: WCAG 2.1 AA for all text contrast ratios.

**Security**
- `ANTHROPIC_API_KEY` must only be accessed server-side via `/api/recommend`. It must never be exposed to the client bundle.
- The fairy name must be sanitised before prompt injection (implemented in `route.ts`).
- No PII beyond first name ("Krysha") is stored.

**Compatibility**
- Target browsers: Safari on iOS 16+, Chrome on Android 10+, Chrome/Safari on macOS (latest).
- No offline/PWA support required.

---

## 7. Technical Constraints

- **localStorage-only.** No database planned. Clearing browser storage destroys all data with no recovery path (known, accepted constraint — see P0-A).
- **Single API route.** All four AI recommendation types are handled by `/api/recommend`. New types = new `case` in route switch + new typed interface in `types.ts`. Do not create additional API routes without explicit justification.
- **AI model fixed.** `claude-haiku-4-5-20251001` is hardcoded. Model changes must be tested against all four prompt structures.
- **Nut safety is dual-layer.** Both `containsNut()` client-side and `NUT_FREE_PROMPT_RULE` in every system prompt must be maintained. Removing either is a safety regression.
- **No global state.** Each page calls `getFoods()` on mount. Cross-page state updates use local `onAdded` callbacks.
- **Emoji picker** is a hardcoded 40-item array duplicated in `AddFoodForm.tsx` and `FoodCard.tsx`. Keeping them in sync is a maintenance concern if the list is ever expanded (see P2-A).
- **Fairy name length mismatch:** UI enforces `maxLength={20}`, server sanitises at 30 chars. UI is the effective constraint.
- **No new npm dependencies** without discussion.
- **`suggest-favorites` adds with `inPantry: false`; gap suggestions add with `inPantry: true`.** This asymmetry is intentional.

---

## 8. Open Questions

| # | Question | Impact |
|---|---------|--------|
| Q1 | Should AI-generated results persist between sessions? | Requires new localStorage schema, staleness handling |
| Q2 | Is iPad portrait a primary target? | At `md` breakpoint (768px), iPads get the mobile bottom nav |
| Q3 | Should missing ingredients be shareable as a shopping list? | P1-A proposes this — confirm priority |
| Q4 | Maximum food library size? | No pagination; 50+ items may degrade UX |

---

## 9. Feature Backlog

### P0 — Safety & Data Integrity

**P0-A: localStorage Export / Import (Data Backup)**

Losing the device or clearing browser storage permanently destroys Krysha's entire food library with no recovery path. A JSON export/import with no backend dependency eliminates this risk.

Acceptance criteria:
- [ ] "Backup my foods" on `/favorites` downloads `krysha-snacks-[date].json` with all `FoodItem` entries + fairy name
- [ ] "Restore from backup" accepts a `.json` file, validates schema, prompts confirmation before replacing library
- [ ] Import rejects files containing nut-matching food names
- [ ] No new API routes or npm packages (uses `URL.createObjectURL` + `<input type="file">`)

---

### P1 — Core UX Improvements

**P1-A: Recipe Shopping List (Cook Together)**

The `missingIngredients` array is already returned by the AI but only rendered as a visual list. A one-tap copy/share action removes a manual step for Daddy.

Acceptance criteria:
- [ ] "Copy shopping list" button appears after results load, only when ≥1 recipe has missing ingredients
- [ ] Copies formatted plain-text of all unique missing ingredients across all recipes to clipboard
- [ ] Button shows "Copied! ✓" for 2 seconds then resets
- [ ] On supported browsers, a "Share list" button uses the Web Share API

**P1-B: Snack History Log**

Re-tapping the magic button discards previous combos. No record of what was packed or whether Krysha enjoyed it.

Acceptance criteria:
- [ ] Each successful snack-pack result is appended to `krysha_snack_history_v1`, capped at 7 entries
- [ ] Collapsible "Recent Packs" section on `/snack-pack` shows last 3 combo names + dates
- [ ] Individual entries can be dismissed
- [ ] Section hidden until at least 1 pack has been generated

**P1-C: Pantry Bulk Actions**

With 20+ foods, toggling each pantry item individually after a shopping trip is tedious.

Acceptance criteria:
- [ ] "Mark all in pantry" appears when ≥1 food has `inPantry: false`
- [ ] "Clear pantry" appears when ≥1 food has `inPantry: true`
- [ ] Both actions respect the active category filter
- [ ] Both require confirmation (confirm dialog or 5-second undo toast)

---

### P2 — Enrichment & Delight

**P2-A: Expanded Emoji Picker (~80 emojis)**

The 40-item picker lacks common Singapore foods (rice, noodles, tofu, papaya). Expanding and extracting to a shared `src/lib/emojis.ts` removes duplication and improves coverage.

Acceptance criteria:
- [ ] Picker supports ≥80 distinct food-relevant emojis
- [ ] List extracted to shared `src/lib/emojis.ts` (AddFoodForm + FoodCard share same source)
- [ ] Picker renders without layout overflow on viewports narrower than 375px
- [ ] No new npm packages

**P2-B: "Krysha Tried It!" Badge**

The Try New feature has no feedback loop — Daddy cannot record whether Krysha tried and liked the food.

Acceptance criteria:
- [ ] Foods added via Try New are tagged `source: 'try-new'` in a new optional `FoodItem` field
- [ ] On `/favorites`, `source: 'try-new'` cards with `rating === 0` display a "Did Krysha try it? ⭐" prompt
- [ ] Tapping the prompt opens StarRating; saving a rating removes the prompt permanently
- [ ] Existing `FoodItem` records without `source` default to `undefined` (prompt hidden)

**P2-C: Weekly Snack Planner (`/planner`)**

A 5-day (Mon–Fri) grid where Daddy can assign AI-generated combos to day slots, giving a visual weekly plan. Only build after P0-A (backup) is in place.

Acceptance criteria:
- [ ] `/planner` route added with a Monday–Friday 5-column grid
- [ ] Each day slot holds one snack combo (name + items list)
- [ ] Combos assigned from `/snack-pack` results via an "Add to Planner" button
- [ ] State persists in `localStorage` key `krysha_planner_v1` as `{ [dayKey]: SnackCombo | null }`
- [ ] Individual day slots clearable with a single tap
- [ ] Planner accessible from home dashboard as a fifth kingdom card
- [ ] No backend, sharing, or printing required in this iteration

---

## 10. v1 Shippable Checklist

- [ ] `npm run build` — zero TypeScript errors, zero ESLint errors
- [ ] All 5 routes render without console errors in Chrome + Safari
- [ ] Nut keyword input is blocked with error message shown
- [ ] All 4 AI recommendation types return valid responses and render correctly
- [ ] Fairy name persists across reloads and appears in AI greetings
- [ ] Mobile nav (375px) and desktop nav (1280px) render correctly with active state highlighting
- [ ] Credits-exhausted API response renders `CreditsErrorCard`
- [ ] `ANTHROPIC_API_KEY` absent from client-side bundle (verifiable via DevTools)
- [ ] All FoodCard pantry toggles, star ratings, edit, and delete actions persist to localStorage and reflect immediately in UI without page reload
