# Exercise 11: subagent context cost

- Before: Messages 10 tokens
- After: Messages 20.3k tokens, but most of it is the /context output itself
- The subagent used 57,568 tokens in its own context. Only its short report came back.
- Two runs found slightly different results (7 vs 6), so always check what a subagent reports.
- A subagent is a waste for a small job, like reading one file, because the instructions and the report cost more than doing it directly.
