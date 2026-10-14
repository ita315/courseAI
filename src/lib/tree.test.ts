import { describe, expect, it } from 'vitest'
import { isHidden, listDirectory, sortEntries, type DirectoryLike } from './tree'
import type { TreeNode } from './types'

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
