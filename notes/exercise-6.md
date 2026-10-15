# Exercise 6: two rules and a skill

## Rules
- .claude/rules/architecture.md: always-on (no frontmatter). Listed in /context Memory files.
- .claude/rules/styles.md: path-scoped (paths: src/**/*.css).
  Not listed at session start. After reading src/styles/app.css: "Loaded .claude/rules/styles.md".
- CLAUDE.md went from 406 to 330 tokens after moving both rules out.

## Skill
- .claude/skills/add-file-detail/SKILL.md, listed in /skills (~60 tokens).
- Plain request, without naming it: "Show the file extension in the detail pane".
- Transcript: "Skill(add-file-detail) → Successfully loaded skill", then it followed all 5 steps.