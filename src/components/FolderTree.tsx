import { useEffect, useState } from 'react'
import { isLargeFile } from '../lib/details'
import { listDirectory } from '../lib/tree'
import type { TreeNode } from '../lib/types'

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

  useEffect(() => {
    let cancelled = false
    listDirectory(root, root.name)
      .then((nodes) => !cancelled && setChildren(nodes))
      .catch((e: unknown) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [root])

  if (error) return <p className="error">{error}</p>
  if (!children) return <p className="muted">Loading…</p>

  return (
    <>
      <h2 className="tree-title">📁 {root.name}</h2>
      <NodeList nodes={children} selectedPath={selectedPath} onSelectFile={onSelectFile} />
    </>
  )
}

type ListProps = Omit<Props, 'root'> & { nodes: TreeNode[]; nested?: boolean }

function NodeList({ nodes, nested = false, selectedPath, onSelectFile }: ListProps) {
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
}

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
