import { describe, expect, it } from 'vitest'
import {
  LARGE_FILE_BYTES,
  countLines,
  formatExposure,
  getFileDetails,
  isImage,
  isLargeFile,
  isTextFile,
  pickExifEntries,
} from './details'

describe('getFileDetails', () => {
  it('reads name, size, type and modified date', () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain', lastModified: 0 })
    expect(getFileDetails(file)).toEqual({
      name: 'hello.txt',
      size: 5,
      type: 'text/plain',
      modified: new Date(0),
    })
  })

  it('says "Unknown" when the browser does not know the type', () => {
    expect(getFileDetails(new File([], 'Makefile')).type).toBe('Unknown')
  })
})

describe('isImage', () => {
  it('checks the MIME type', () => {
    expect(isImage(new File([], 'a.png', { type: 'image/png' }))).toBe(true)
    expect(isImage(new File([], 'a.txt', { type: 'text/plain' }))).toBe(false)
  })
})

describe('isTextFile', () => {
  it('recognises text extensions, ignoring case', () => {
    for (const name of ['notes.txt', 'index.HTML', 'app.ts', 'config.yml', '.env', 'prod.env', 'run.bat']) {
      expect(isTextFile(name), name).toBe(true)
    }
  })

  it('rejects images, other files and names with no extension', () => {
    for (const name of ['beach.jpg', 'photo.png', 'archive.zip', 'Makefile', 'txt']) {
      expect(isTextFile(name), name).toBe(false)
    }
  })
})

describe('countLines', () => {
  it('counts an empty file as 0 lines', () => {
    expect(countLines('')).toBe(0)
  })

  it('counts text without a newline as 1 line', () => {
    expect(countLines('שלום')).toBe(1)
  })

  it('counts lines separated by newlines', () => {
    expect(countLines('א\nב\nג')).toBe(3)
  })

  it('does not count a trailing newline as an extra line', () => {
    expect(countLines('א\nב\nג\n')).toBe(3)
  })

  it('handles Windows line endings', () => {
    expect(countLines('a\r\nb\r\n')).toBe(2)
  })

  it('counts empty lines in the middle', () => {
    expect(countLines('a\n\nb')).toBe(3)
  })
})

describe('formatExposure', () => {
  it('shows fractions below one second', () => {
    expect(formatExposure(0.004)).toBe('1/250 s')
    expect(formatExposure(2)).toBe('2 s')
  })
})

describe('pickExifEntries', () => {
  it('keeps known tags in display order and skips missing ones', () => {
    expect(pickExifEntries({ ISO: 100, Make: 'Apple', FNumber: 1.8, Unknown: 'x' })).toEqual([
      ['Camera make', 'Apple'],
      ['Aperture', 'f/1.8'],
      ['ISO', '100'],
    ])
  })

  it('returns [] when there is no EXIF', () => {
    expect(pickExifEntries(undefined)).toEqual([])
  })
})

describe('isLargeFile', () => {
  it('uses 10 × 1024 × 1024 bytes as the limit', () => {
    expect(LARGE_FILE_BYTES).toBe(10_485_760)
  })

  it('is false up to and including exactly 10 MB', () => {
    expect(isLargeFile(0)).toBe(false)
    expect(isLargeFile(10_000_000)).toBe(false)
    expect(isLargeFile(LARGE_FILE_BYTES)).toBe(false)
  })

  it('is true above 10 MB', () => {
    expect(isLargeFile(LARGE_FILE_BYTES + 1)).toBe(true)
    expect(isLargeFile(3_000_000_000)).toBe(true)
  })
})
