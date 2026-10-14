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

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function plural(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`
}

/** How long before `now` the date was → "just now", "5 minutes ago", "yesterday", "2 months ago". */
export function formatRelativeTime(date: Date, now: Date): string {
  const elapsed = now.getTime() - date.getTime()
  if (elapsed < MINUTE) return 'just now'
  if (elapsed < HOUR) return plural(Math.floor(elapsed / MINUTE), 'minute')
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), 'hour')
  const days = Math.floor(elapsed / DAY)
  if (days === 1) return 'yesterday'
  if (days < 30) return plural(days, 'day')
  if (days < 365) return plural(Math.min(Math.floor(days / 30), 11), 'month')
  return plural(Math.floor(days / 365), 'year')
}
