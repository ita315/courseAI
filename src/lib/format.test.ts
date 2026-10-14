import { describe, expect, it } from 'vitest'
import { formatBytes, formatDate, formatDimensions } from './format'

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
