// Chrome's folder picker is not in TypeScript's DOM types yet.
interface Window {
  showDirectoryPicker(options?: { mode?: 'read' | 'readwrite' }): Promise<FileSystemDirectoryHandle>
}
