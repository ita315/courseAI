import type { Dimensions } from './types'

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

/** 2_400_000 → "2.4 MB". Uses 1000 per step, like Finder. */
export function formatBytes(bytes: number): string {
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < UNITS.length - 1) {
    value /= 1000
    unit++
  }
  const rounded = unit === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '')
  return `${rounded} ${UNITS[unit]}`
}

/** → "12 Oct 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** → "12 Oct 2026, 14:05" */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** → "1920 × 1080" */
export function formatDimensions({ width, height }: Dimensions): string {
  return `${width} × ${height}`
}
