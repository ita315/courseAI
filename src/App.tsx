import { useState } from 'react'
import { DetailPane } from './components/DetailPane'
import { FolderTree } from './components/FolderTree'
import { isFolderPickerSupported, pickFolder } from './lib/tree'
import type { TreeNode } from './lib/types'

export default function App() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null)
  // Bumped on every pick, so the tree starts fresh even if the same folder is chosen again.
  const [pickCount, setPickCount] = useState(0)
  const [selected, setSelected] = useState<(TreeNode & { kind: 'file' }) | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function chooseFolder() {
    setError(null)
    try {
      const folder = await pickFolder()
      if (!folder) return // user cancelled
      setRoot(folder)
      setPickCount((n) => n + 1)
      setSelected(null)
    } catch (e) {
      setError(String(e))
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>File Browser</h1>
        {isFolderPickerSupported() ? (
          <button className="button" onClick={() => void chooseFolder()}>
            Choose folder
          </button>
        ) : (
          <span className="error">This browser can't open folders. Please use Chrome.</span>
        )}
        {error && <span className="error">{error}</span>}
      </header>

      <aside className="sidebar">
        {root ? (
          <FolderTree
            key={pickCount}
            root={root}
            selectedPath={selected?.path ?? null}
            onSelectFile={setSelected}
          />
        ) : (
          <p className="muted">No folder chosen.</p>
        )}
      </aside>

      <main className="main">
        {selected ? (
          <DetailPane key={selected.path} handle={selected.handle} />
        ) : (
          <p className="muted">Select a file to see its details.</p>
        )}
      </main>
    </div>
  )
}
