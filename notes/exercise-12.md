# Exercise 12: codebase-memory-mcp

- Installed codebase-memory-mcp 0.12.1
- Moved it from ~/.claude.json to the project .mcp.json, with only the command name,
  so it works for the whole team
- Indexed: 230 nodes, 431 edges
- Asked "Who calls isImage?" and the answer came from the graph:
  load in DetailPane.tsx and details.test.ts
- The graph UI runs with: `codebase-memory-mcp --ui=true --port=9749`
