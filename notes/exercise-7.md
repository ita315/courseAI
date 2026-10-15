# Exercise 7: auto-memory

## What I taught Claude
My manual test files are in ~/Desktop/test-files (big.bin, exactly-10.bin, notes.txt).
A gotcha from exercise 4: Claude had created temp test files in /private/tmp.

## What was written
~/.claude/projects/-Users-raskin-course-file-browser/memory/
- MEMORY.md: a one-line index pointing to manual-test-files.md
- manual-test-files.md: the files, expected results, Why and How to apply

## Fresh session, without being told
Q: Which files should I use to check the Large badge by hand?
A: "Use the fixture folder ~/Desktop/test-files..."

## How much loads at session start
The first 200 lines or 25KB of MEMORY.md.
