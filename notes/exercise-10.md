# Exercise 10: context7 for the whole team

## Setup
- .mcp.json with context7 (type http, no secrets), committed.
- /mcp: "Project MCPs → ✔ context7 · 2 tools".

## context7 was used (transcript excerpt)
"Called context7 2 times"
- resolve-library-id("React") → /reactjs/react.dev
- query-docs about useDeferredValue for a large filtered list
What it showed: the input uses the live query, the list uses useDeferredValue(query),
and the list must be wrapped in memo, or the deferred render can't skip work.

## Feature
Filter box above the tree: case-insensitive, searches all folders,
keeps parent folders of matching files, clearing the text shows everything again.