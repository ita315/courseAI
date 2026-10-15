# Exercise 9: nested CLAUDE.md in src/lib

## Before (fresh session)
/context → Memory files: CLAUDE.md (406 tokens) only.

## After reading src/lib/format.ts
Terminal: "Loaded src/lib/CLAUDE.md"

## Note
/context and /memory did not list src/lib/CLAUDE.md (Claude Code 2.1.300),
but the terminal showed "Loaded src/lib/CLAUDE.md" right after reading a file in src/lib.

I asked: "Answer only: which CLAUDE.md files are in your context right now?"
Claude answered:
1. CLAUDE.md, the project root file, loaded when the session started.
2. src/lib/CLAUDE.md, loaded when I read src/lib/format.ts.
/context lists only the root file under Memory files, because the src/lib file
came in through the file read, so it's counted under Messages instead.