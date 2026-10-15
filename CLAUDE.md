# Forbidden
- No React imports in src/lib/, because the logic must be testable without a browser.
- No network calls, no localStorage or IndexedDB, and no writes to disk,
  because the app only reads a folder and never stores anything.
- No hard-coded colors, sizes or fonts. Use only CSS variables from
  src/styles/tokens.css, because the design must change in one place.
- Never add a new dependency without asking first, because every library grows the project.

# Conventions
- Every new function in src/lib/ gets a test.
- Detect file types by extension, not by the type the browser reports
  (browsers label .ts files as video).
- Time-dependent functions take "now" as a parameter, so tests stay stable.
- Bugs unrelated to the task: list them in the summary, don't fix them.

# Stack & architecture
- React + TypeScript + Vite, tests with Vitest.
- src/lib/: logic, no React.
- src/components/: UI, React components.
- Chrome only (File System Access API).

# Commands
- npm run dev: runs the app locally.
- npm run check: typecheck + lint + tests. Must stay green.

# Open questions
- formatBytes divides by 1000, but the "Large" badge uses 1024. Unify?
- Support Safari and Firefox (via <input webkitdirectory>)?