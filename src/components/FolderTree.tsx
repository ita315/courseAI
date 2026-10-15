import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { isLargeFile } from '../lib/details'
import { filterTree, listDirectory, loadTree } from '../lib/tree'
import type { LoadedTreeNode, TreeNode } from '../lib/types'

type FileNode = TreeNode & { kind: 'file' }

type Props = {
  root: FileSystemDirectoryHandle
  selectedPath: string | null
  onSelectFile: (node: FileNode) => void
}

/** Shows the chosen folder's contents. Sub-folders load when expanded. */
export function FolderTree({ root, selectedPath, onSelectFile }: Props) {
  const [children, setChildren] = useState<TreeNode[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  // The input updates on every key; the filtered list catches up when React has time.
  const deferredQuery = useDeferredValue(query)
  // Every sub-folder, loaded once the first time the user types.
  const [fullTree, setFullTree] = useState<LoadedTreeNode[] | null>(null)
  const [searchStarted, setSearchStarted] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listDirectory(root, root.name)
      .then((nodes) => !cancelled && setChildren(nodes))
      .catch((e: unknown) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [root])

  useEffect(() => {
    if (!searchStarted) return
    let cancelled = false
    loadTree(root, root.name)
      .then((nodes) => !cancelled && setFullTree(nodes))
      .catch((e: unknown) => !cancelled && setSearchError(String(e)))
    return () => {
      cancelled = true
    }
  }, [root, searchStarted])

  const filtering = deferredQuery.trim() !== ''
  const matches = useMemo(() => fullTree && filterTree(fullTree, deferredQuery), [fullTree, deferredQuery])

  function changeQuery(value: string) {
    setQuery(value)
    if (value.trim() !== '') setSearchStarted(true)
  }

  if (error) return <p className="error">{error}</p>
  if (!children) return <p className="muted">Loading…</p>

  return (
    <>
      <h2 className="tree-title">📁 {root.name}</h2>
      <input
        type="search"
        className="filter"
        placeholder="Filter files…"
        aria-label="Filter files"
        value={query}
        onChange={(e) => changeQuery(e.target.value)}
      />
      {filtering &&
        (searchError ? (
          <p className="error">{searchError}</p>
        ) : !matches ? (
          <p className="muted">Loading all folders…</p>
        ) : matches.length === 0 ? (
          <p className="muted">No matching files</p>
        ) : (
          <FilteredList nodes={matches} selectedPath={selectedPath} onSelectFile={onSelectFile} />
        ))}
      {/* Kept mounted while filtering, so opened folders stay open after the box is cleared. */}
      <div hidden={filtering}>
        <NodeList nodes={children} selectedPath={selectedPath} onSelectFile={onSelectFile} />
      </div>
    </>
  )
}

type FilteredProps = Omit<Props, 'root'> & { nodes: LoadedTreeNode[]; nested?: boolean }

/** The filter results: every folder shown open, so it's clear where each file lives. */
const FilteredList = memo(function FilteredList({ nodes, nested = false, selectedPath, onSelectFile }: FilteredProps) {
  return (
    <ul className={nested ? undefined : 'tree'}>
      {nodes.map((node) =>
        node.kind === 'directory' ? (
          <li key={node.path}>
            <div className="tree-row">
              <span className="twisty">▾</span>
              <span className="tree-name">📁 {node.name}</span>
            </div>
            <FilteredList nodes={node.children} nested selectedPath={selectedPath} onSelectFile={onSelectFile} />
          </li>
        ) : (
          <FileItem key={node.path} node={node} selectedPath={selectedPath} onSelectFile={onSelectFile} />
        ),
      )}
    </ul>
  )
})

type ListProps = Omit<Props, 'root'> & { nodes: TreeNode[]; nested?: boolean }

const NodeList = memo(function NodeList({ nodes, nested = false, selectedPath, onSelectFile }: ListProps) {
  return (
    <ul className={nested ? undefined : 'tree'}>
      {nodes.length === 0 && <li className="tree-row muted">Empty folder</li>}
      {nodes.map((node) =>
        node.kind === 'directory' ? (
          <FolderItem key={node.path} node={node} selectedPath={selectedPath} onSelectFile={onSelectFile} />
        ) : (
          <FileItem key={node.path} node={node} selectedPath={selectedPath} onSelectFile={onSelectFile} />
        ),
      )}
    </ul>
  )
})

type FileProps = Omit<Props, 'root'> & { node: FileNode }

function FileItem({ node, selectedPath, onSelectFile }: FileProps) {
  // Reading the size only touches metadata, not the file contents.
  const [large, setLarge] = useState(false)

  useEffect(() => {
    let cancelled = false
    node.handle
      .getFile()
      .then((file) => !cancelled && setLarge(isLargeFile(file.size)))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [node.handle])

  return (
    <li>
      <button
        className={`tree-row${node.path === selectedPath ? ' selected' : ''}`}
        onClick={() => onSelectFile(node)}
      >
        <span className="twisty" />
        <span className="tree-name">📄 {node.name}</span>
        {large && <span className="badge">Large</span>}
      </button>
    </li>
  )
}

type FolderProps = Omit<Props, 'root'> & { node: TreeNode & { kind: 'directory' } }

function FolderItem({ node, selectedPath, onSelectFile }: FolderProps) {
  const [open, setOpen] = useState(false)
  // null = not loaded yet. Children are loaded the first time the folder opens.
  const [children, setChildren] = useState<TreeNode[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function toggle() {
    if (!open && children === null) {
      try {
        setChildren(await listDirectory(node.handle, node.path))
      } catch (e) {
        setError(String(e))
      }
    }
    setOpen(!open)
  }

  return (
    <li>
      <button className="tree-row" onClick={() => void toggle()} aria-expanded={open}>
        <span className="twisty">{open ? '▾' : '▸'}</span>
        <span className="tree-name">📁 {node.name}</span>
      </button>
      {open && error && <p className="error">{error}</p>}
      {open && children && (
        <NodeList nodes={children} nested selectedPath={selectedPath} onSelectFile={onSelectFile} />
      )}
    </li>
  )
}
