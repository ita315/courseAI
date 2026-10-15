import type { LoadedTreeNode, TreeNode } from './types'

/** The part of a directory handle we use, so tests can pass a fake one. */
export type DirectoryLike = {
  values(): AsyncIterable<FileSystemDirectoryHandle | FileSystemFileHandle>
}

export function isFolderPickerSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window
}

/** Opens the folder picker. Returns null if the user cancels. */
export async function pickFolder(): Promise<FileSystemDirectoryHandle | null> {
  try {
    return await window.showDirectoryPicker({ mode: 'read' })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return null
    throw error
  }
}

/** Hidden like in Finder: names starting with a dot. */
export function isHidden(name: string): boolean {
  return name.startsWith('.')
}

/** Folders first, then files, each in natural A→Z order ("file2" before "file10"). */
export function sortEntries(nodes: TreeNode[]): TreeNode[] {
  return [...nodes].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  })
}

/** Lists the visible children of one folder (not recursive). */
export async function listDirectory(dir: DirectoryLike, parentPath: string): Promise<TreeNode[]> {
  const nodes: TreeNode[] = []
  for await (const handle of dir.values()) {
    if (isHidden(handle.name)) continue
    const path = `${parentPath}/${handle.name}`
    nodes.push(
      handle.kind === 'directory'
        ? { kind: 'directory', name: handle.name, path, handle }
        : { kind: 'file', name: handle.name, path, handle },
    )
  }
  return sortEntries(nodes)
}

/** Lists a folder and all its sub-folders (recursive), for searching folders not opened yet. */
export async function loadTree(dir: DirectoryLike, parentPath: string): Promise<LoadedTreeNode[]> {
  const nodes = await listDirectory(dir, parentPath)
  return Promise.all(
    nodes.map(async (node): Promise<LoadedTreeNode> =>
      node.kind === 'directory' ? { ...node, children: await loadTree(node.handle, node.path) } : node,
    ),
  )
}

/**
 * Keeps only files whose name contains the query (ignoring case), plus the folders above them.
 * An empty query returns the tree unchanged.
 */
export function filterTree(nodes: LoadedTreeNode[], query: string): LoadedTreeNode[] {
  const q = query.trim().toLowerCase()
  if (q === '') return nodes
  return filterNodes(nodes, q)
}

function filterNodes(nodes: LoadedTreeNode[], q: string): LoadedTreeNode[] {
  const result: LoadedTreeNode[] = []
  for (const node of nodes) {
    if (node.kind === 'file') {
      if (node.name.toLowerCase().includes(q)) result.push(node)
    } else {
      const children = filterNodes(node.children, q)
      if (children.length > 0) result.push({ ...node, children })
    }
  }
  return result
}
