import { describe, expect, it } from 'vitest'
import { formatBytes, formatDate, formatDimensions, formatRelativeTime } from './format'

describe('formatBytes', () => {
  it('shows bytes as whole numbers', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(999)).toBe('999 B')
  })

  it('switches units every 1000', () => {
    expect(formatBytes(1000)).toBe('1 KB')
    expect(formatBytes(1500)).toBe('1.5 KB')
    expect(formatBytes(2_400_000)).toBe('2.4 MB')
    expect(formatBytes(3_000_000_000)).toBe('3 GB')
  })
})

describe('formatDate', () => {
  it('uses day, short month, year', () => {
    expect(formatDate(new Date(2026, 9, 12))).toBe('12 Oct 2026')
  })
})

describe('formatDimensions', () => {
  it('uses a multiplication sign', () => {
    expect(formatDimensions({ width: 1920, height: 1080 })).toBe('1920 × 1080')
  })
})

describe('formatRelativeTime', () => {
  const now = new Date(2026, 9, 14, 12, 0, 0)
  const ago = (ms: number) => formatRelativeTime(new Date(now.getTime() - ms), now)
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR

  it('matches the examples', () => {
    expect(ago(30 * SECOND)).toBe('just now')
    expect(ago(5 * MINUTE)).toBe('5 minutes ago')
    expect(ago(3 * HOUR)).toBe('3 hours ago')
    expect(ago(DAY)).toBe('yesterday')
    expect(ago(3 * DAY)).toBe('3 days ago')
    expect(ago(61 * DAY)).toBe('2 months ago')
    expect(ago(548 * DAY)).toBe('1 year ago')
  })

  it('uses the singular for one unit', () => {
    expect(ago(MINUTE)).toBe('1 minute ago')
    expect(ago(HOUR)).toBe('1 hour ago')
    expect(ago(30 * DAY)).toBe('1 month ago')
  })

  it('switches units at the boundaries', () => {
    expect(ago(59 * SECOND)).toBe('just now')
    expect(ago(59 * MINUTE)).toBe('59 minutes ago')
    expect(ago(23 * HOUR)).toBe('23 hours ago')
    expect(ago(2 * DAY - 1)).toBe('yesterday')
    expect(ago(29 * DAY)).toBe('29 days ago')
    expect(ago(364 * DAY)).toBe('11 months ago')
    expect(ago(365 * DAY)).toBe('1 year ago')
    expect(ago(3 * 365 * DAY)).toBe('3 years ago')
  })

  it('treats dates in the future as just now', () => {
    expect(ago(-HOUR)).toBe('just now')
  })
})
