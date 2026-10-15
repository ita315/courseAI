---
name: add-file-detail
description: Add a new piece of file information to the app (like line count
  or a size badge). Use when asked to show something new about a file in the
  detail pane or the tree.
---
<!-- למעלה: המדבקה 🏷️ (תמיד בחלון). למטה: המתכון המלא 📋 (רק כשמשתמשים) -->

# Add a file detail
1. Add a pure function in src/lib/details.ts.
2. Add tests in src/lib/details.test.ts, including edge cases.
3. Show it in src/components/DetailPane.tsx (or FolderTree.tsx for the tree).
4. Style only with tokens from src/styles/tokens.css.
5. Run npm run check until it is green.