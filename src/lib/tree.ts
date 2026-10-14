import type { TreeNode } from './types'

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
