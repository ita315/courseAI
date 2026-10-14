# File Browser

A read-only, browser-only file explorer. Pick a folder, browse it as a tree, and click a file to see its details (plus dimensions, EXIF and a preview for images).

Needs **Chrome** (uses the File System Access API `showDirectoryPicker`).

## Run

```sh
npm install
npm run dev      # open the printed localhost URL in Chrome
```

## Check

```sh
npm run check    # typecheck (tsc) + lint (oxlint) + tests for src/lib (vitest)
```

## Layout

- `src/lib/` – all file logic, plain TypeScript. **Never imports React** (enforced by lint).
- `src/components/` – React UI (`FolderTree`, `DetailPane`).
- `src/styles/tokens.css` – every color, size and spacing value. `app.css` only uses these variables.
