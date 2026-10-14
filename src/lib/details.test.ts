import { describe, expect, it } from 'vitest'
import { formatExposure, getFileDetails, isImage, pickExifEntries } from './details'

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
