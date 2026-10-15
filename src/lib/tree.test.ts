import { describe, expect, it } from 'vitest'
import { filterTree, isHidden, listDirectory, loadTree, sortEntries, type DirectoryLike } from './tree'
import type { LoadedTreeNode, TreeNode } from './types'

function fakeHandle(kind: 'file' | 'directory', name: string) {
  return { kind, name } as FileSystemFileHandle | FileSystemDirectoryHandle
}

function fakeDirectory(children: ReturnType<typeof fakeHandle>[]): DirectoryLike {
  return {
    async *values() {
      yield* children
    },
  }
}

function node(kind: 'file' | 'directory', name: string): TreeNode {
  return { kind, name, path: `/${name}`, handle: fakeHandle(kind, name) } as TreeNode
}

describe('isHidden', () => {
  it('hides dotfiles only', () => {
    expect(isHidden('.DS_Store')).toBe(true)
    expect(isHidden('.git')).toBe(true)
    expect(isHidden('notes.txt')).toBe(false)
  })
})

describe('sortEntries', () => {
  it('puts folders first, then sorts by name naturally and ignoring case', () => {
    const sorted = sortEntries([
      node('file', 'b.txt'),
      node('file', 'file10.txt'),
      node('directory', 'Zeta'),
      node('file', 'file2.txt'),
      node('file', 'A.txt'),
      node('directory', 'alpha'),
    ])
    expect(sorted.map((n) => n.name)).toEqual([
      'alpha',
      'Zeta',
      'A.txt',
      'b.txt',
      'file2.txt',
      'file10.txt',
    ])
  })
})

describe('listDirectory', () => {
  it('returns sorted visible children with paths', async () => {
    const dir = fakeDirectory([
      fakeHandle('file', 'photo.jpg'),
      fakeHandle('file', '.DS_Store'),
      fakeHandle('directory', 'docs'),
    ])
    const nodes = await listDirectory(dir, 'root')
    expect(nodes.map((n) => [n.kind, n.name, n.path])).toEqual([
      ['directory', 'docs', 'root/docs'],
      ['file', 'photo.jpg', 'root/photo.jpg'],
    ])
  })
})

/** A fake folder handle that can hold nested children, for loadTree. */
function fakeFolder(name: string, children: ReturnType<typeof fakeHandle>[]) {
  return { kind: 'directory', name, ...fakeDirectory(children) } as FileSystemDirectoryHandle
}

describe('loadTree', () => {
  it('loads every sub-folder recursively, with paths, skipping dotfiles', async () => {
    const dir = fakeDirectory([
      fakeHandle('file', 'top.txt'),
      fakeHandle('file', '.DS_Store'),
      fakeFolder('a', [fakeFolder('b', [fakeHandle('file', 'deep.jpg'), fakeHandle('file', '.hidden')])]),
    ])
    const tree = await loadTree(dir, 'root')
    expect(tree).toMatchObject([
      {
        kind: 'directory',
        name: 'a',
        path: 'root/a',
        children: [
          {
            kind: 'directory',
            name: 'b',
            path: 'root/a/b',
            children: [{ kind: 'file', name: 'deep.jpg', path: 'root/a/b/deep.jpg' }],
          },
        ],
      },
      { kind: 'file', name: 'top.txt', path: 'root/top.txt' },
    ])
  })
})

function file(path: string): LoadedTreeNode {
  const name = path.split('/').at(-1)!
  return { kind: 'file', name, path, handle: fakeHandle('file', name) } as LoadedTreeNode
}

function folder(path: string, children: LoadedTreeNode[]): LoadedTreeNode {
  const name = path.split('/').at(-1)!
  return { kind: 'directory', name, path, handle: fakeHandle('directory', name), children } as LoadedTreeNode
}

/** Flattens a tree to its paths, so expectations stay short. */
function paths(nodes: LoadedTreeNode[]): string[] {
  return nodes.flatMap((n) => [n.path, ...(n.kind === 'directory' ? paths(n.children) : [])])
}

describe('filterTree', () => {
  const tree = [
    folder('r/a', [
      folder('r/a/b', [folder('r/a/b/c', [file('r/a/b/c/beach.jpg'), file('r/a/b/c/sea.jpg')]), file('r/a/b/x.txt')]),
      file('r/a/y.txt'),
    ]),
    folder('r/beach-folder', [file('r/beach-folder/notes.txt')]),
    file('r/BEACH.png'),
    file('r/sea.jpg'),
  ]

  it('ignores upper and lower case', () => {
    expect(paths(filterTree(tree, 'Beach'))).toContain('r/BEACH.png')
    expect(paths(filterTree(tree, 'Beach'))).toContain('r/a/b/c/beach.jpg')
    expect(paths(filterTree(tree, 'BEACH'))).toEqual(paths(filterTree(tree, 'beach')))
  })

  it('finds a file deep inside folders and keeps only the folders above it', () => {
    expect(paths(filterTree(tree, 'beach'))).toEqual([
      'r/a',
      'r/a/b',
      'r/a/b/c',
      'r/a/b/c/beach.jpg',
      'r/BEACH.png',
    ])
  })

  it('drops a folder whose own name matches but has no matching files', () => {
    expect(paths(filterTree(tree, 'beach'))).not.toContain('r/beach-folder')
  })

  it('returns nothing when no file matches', () => {
    expect(filterTree(tree, 'zzz')).toEqual([])
  })

  it('returns the whole tree when the box is empty', () => {
    expect(filterTree(tree, '')).toBe(tree)
    expect(filterTree(tree, '   ')).toBe(tree)
  })

  it('does not change the original tree', () => {
    const before = paths(tree)
    filterTree(tree, 'beach')
    expect(paths(tree)).toEqual(before)
  })
})
