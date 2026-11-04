# react-small-task

Small technical task

This project implements the [supplied exercise brief](docs/REQUIREMENTS.md),
including its optional sorting and presentation improvements.

## Setup

The application uses React, Vite, strict TypeScript, and npm.
Node.js 26.13.0 is pinned in `.nvmrc`. With an initialized version manager:

```sh
fnm install 26.13.0
fnm use
npm ci
npm run dev
```

Open the address printed by Vite. With nvm instead of fnm, use `nvm use` to
select the version in `.nvmrc`.

## Implementation notes

- Name matching is case-sensitive, as required, and combines with the category
  and stock filters.
- The brief does not specify a currency, so prices are formatted as USD.
- Filtered and sorted results are derived from the supplied data; there is no
  routing or global state library.

## Checks

```sh
npm run lint
npm run lint:md
npm run format:check
npm run typecheck
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite checks a user journey, keyboard navigation, and automated
accessibility rules. Automated checks do not replace manual accessibility
review. See [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions.
