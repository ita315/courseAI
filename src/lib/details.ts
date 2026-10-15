import exifr from 'exifr'
import { formatDateTime } from './format'
import type { Dimensions, ExifEntry, FileDetails } from './types'

export function getFileDetails(file: File): FileDetails {
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'Unknown',
    modified: new Date(file.lastModified),
  }
}

export function isImage(file: File): boolean {
  return file.type.startsWith('image/')
}

/** Extensions we treat as plain text, so we can count their lines. */
const TEXT_EXTENSIONS = new Set([
  'txt', 'html', 'htm', 'css', 'js', 'ts', 'py', 'json', 'xml', 'yaml', 'yml', 'csv',
  'md', 'log', 'ini', 'cfg', 'conf', 'env', 'sql', 'sh', 'bat',
])

/**
 * Checks the extension, not the MIME type: browsers report .ts as video/mp2t
 * and leave many of these (.env, .yml, .conf…) with no type at all.
 */
export function isTextFile(name: string): boolean {
  const dot = name.lastIndexOf('.')
  return dot !== -1 && TEXT_EXTENSIONS.has(name.slice(dot + 1).toLowerCase())
}

/** "" → 0, "a" → 1, "a\nb\n" → 2: a trailing newline doesn't start a new line. */
export function countLines(text: string): number {
  if (text === '') return 0
  const newlines = text.split('\n').length - 1
  return text.endsWith('\n') ? newlines : newlines + 1
}

/** Returns null if the browser can't decode the image. */
export async function getImageDimensions(file: File): Promise<Dimensions | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const dimensions = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return dimensions
  } catch {
    return null
  }
}

/** The EXIF tags we show, in display order, with how to format each one. */
const EXIF_FIELDS: { tag: string; label: string; format: (value: unknown) => string }[] = [
  { tag: 'Make', label: 'Camera make', format: String },
  { tag: 'Model', label: 'Camera model', format: String },
  { tag: 'LensModel', label: 'Lens', format: String },
  { tag: 'DateTimeOriginal', label: 'Taken', format: (v) => (v instanceof Date ? formatDateTime(v) : String(v)) },
  { tag: 'ExposureTime', label: 'Exposure', format: (v) => formatExposure(Number(v)) },
  { tag: 'FNumber', label: 'Aperture', format: (v) => `f/${v}` },
  { tag: 'ISO', label: 'ISO', format: String },
  { tag: 'FocalLength', label: 'Focal length', format: (v) => `${v} mm` },
  { tag: 'latitude', label: 'Latitude', format: (v) => Number(v).toFixed(5) },
  { tag: 'longitude', label: 'Longitude', format: (v) => Number(v).toFixed(5) },
]

/** 0.004 → "1/250 s", 2 → "2 s" */
export function formatExposure(seconds: number): string {
  if (seconds >= 1) return `${seconds} s`
  return `1/${Math.round(1 / seconds)} s`
}

/** Picks the EXIF fields we care about from exifr's output. */
export function pickExifEntries(raw: Record<string, unknown> | undefined): ExifEntry[] {
  if (!raw) return []
  return EXIF_FIELDS.filter(({ tag }) => raw[tag] !== undefined && raw[tag] !== null).map(
    ({ tag, label, format }) => [label, format(raw[tag])],
  )
}

/** Reads EXIF from the file. Returns [] when there is none or it can't be read. */
export async function getExif(file: File): Promise<ExifEntry[]> {
  try {
    return pickExifEntries(await exifr.parse(file))
  } catch {
    return []
  }
}

/** 10 MB in binary units (10 × 1024 × 1024 bytes). */
export const LARGE_FILE_BYTES = 10 * 1024 * 1024

/** Large files open slowly and take up disk space, so the tree flags them. */
export function isLargeFile(size: number): boolean {
  return size > LARGE_FILE_BYTES
}
