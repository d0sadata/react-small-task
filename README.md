# Product Explorer

A small React view for exploring a hard-coded product list, built for the
[exercise brief](docs/REQUIREMENTS.md). It covers every core requirement and
all four stretch goals.

## Run it

Developed on Node.js 26.13.0 (pinned in `.nvmrc`). The development toolchain
supports Node.js 22.22.2+, 24.15.0+, or 26+, the narrowest range its
dependencies declare. CI tests all three.

```sh
fnm use        # or: nvm use
npm ci
npm run dev
```

## Decisions and trade-offs

- **Case-sensitive name search.** The brief asks for "a case sensitive way",
  so the filter does a literal, case-sensitive substring match and the UI says
  so. In a team I would confirm this first: product search is usually
  case-insensitive. Changing it touches one line in
  `filterAndSortProducts` and its tests.
- **Pure domain logic, thin components.** Filtering, sorting, categories, and
  price formatting live in `src/domain/products.ts` as pure functions with unit
  tests. Components only hold state and render.
- **One filter state, derived results.** A single `FilterState` object is the
  only state. The visible list is computed during render rather than stored,
  so it cannot drift out of sync. There is no `useMemo`: with five items it
  adds complexity without a measurable benefit. Child components send partial
  updates that the parent applies with a functional `setState`.
- **Stable sorting.** Products with equal prices keep their original order,
  and the input array is never mutated.
- **Defensive handling.** The data is hard-coded, so this is deliberately
  light: the search input is capped at 100 characters, the sort value is
  checked with a type guard, and an invalid price shows "Price unavailable"
  and sorts last instead of breaking the table.
- **Accessibility.** A semantic table with row and column headers, labelled
  controls, and an "Out of stock" text label, so stock status does not rely on
  colour. A single screen-reader status region announces the result count
  500 ms after typing pauses, instead of on every keystroke.
- **Currency.** The brief does not specify one, so prices use `en-US` USD.
- **Tooling.** Heavier than a five-row table needs, on purpose: it shows the
  checks I would expect in a team codebase. Lint, type, unit, and browser
  checks run in CI on the lowest version of each supported Node line, and the
  browser tests run against the production build.

## With more time, or at scale

- **Search:** confirm the casing requirement; for case-insensitive and
  accent-insensitive matching, compare lower-cased, Unicode-normalised
  (NFD, diacritics removed) strings.
- **Shareable state:** sync filters to the URL so views can be bookmarked and
  shared.
- **10,000 products or a remote API:** move filtering and sorting to the
  server with pagination, debounce the search request, cancel stale requests,
  and handle loading and error states. Virtualise long tables after measuring.
- **Localisation:** take currency and locale from the data or user settings.

## How AI was used

This project was built with an AI coding assistant. I set the scope and
requirements, reviewed the decisions above, and checked the result with the
automated checks below plus manual testing in the browser.

## Checks

```sh
npm run lint
npm run lint:md
npm run format:check
npm run typecheck
npm run test:coverage
npx playwright install chromium
npm run test:e2e
```

The Playwright suite builds the app, then checks a full user journey,
keyboard navigation, a narrow viewport, and automated WCAG rules with axe.
Automated checks do not replace a manual screen-reader review. See
[CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions.
