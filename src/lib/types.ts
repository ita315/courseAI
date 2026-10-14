export type TreeNode =
  | { kind: 'directory'; name: string; path: string; handle: FileSystemDirectoryHandle }
  | { kind: 'file'; name: string; path: string; handle: FileSystemFileHandle }

export type FileDetails = {
  name: string
  size: number
  type: string
  modified: Date
}

export type Dimensions = { width: number; height: number }

export type ExifEntry = [label: string, value: string]
