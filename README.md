# MUN Chair Toolkit

A local-first web app for chairs and vice-chairs running Model United Nations committees.

## Current feature

The first feature slice provides:

- Committee name and agenda topic
- Single delegation entry and bulk one-country-per-line paste
- Roll call with Present, Present and Voting, and Absent states
- Quorum, simple majority, and two-thirds calculations
- IndexedDB persistence through Dexie
- Pure, tested rules logic in `src/lib/rules.ts`

## Setup

```bash
npm install
npm run dev
```

Run the checks with:

```bash
npm test
npm run build
```

## Rules logic

The UI sends plain delegation data to framework-free functions in `src/lib/rules.ts`. The functions count present delegations and calculate thresholds without importing React, Zustand, or browser APIs. This keeps the rules easy to test and review.

## Roadmap

Speakers and accurate background-safe timers come next, followed by motions, voting, scoring, exports, and the synchronized display view.

## Screenshots

Screenshots will be added as each major workflow is completed.
