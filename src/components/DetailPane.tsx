import { useEffect, useState } from 'react'
import { countLines, getExif, getFileDetails, getImageDimensions, isImage, isTextFile } from '../lib/details'
import { formatBytes, formatDate, formatDimensions, formatRelativeTime } from '../lib/format'
import type { Dimensions, ExifEntry, FileDetails } from '../lib/types'

type Loaded = {
  details: FileDetails
  /** When the file was read, so the relative time is measured from that moment. */
  loadedAt: Date
  /** Null for files that aren't text. */
  lines: number | null
  image: { dimensions: Dimensions | null; exif: ExifEntry[]; previewUrl: string } | null
}

export function DetailPane({ handle }: { handle: FileSystemFileHandle }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If another file is clicked before this one finishes loading, ignore this result.
    let cancelled = false
    let previewUrl: string | null = null

    async function load() {
      const file = await handle.getFile()
      let image: Loaded['image'] = null
      if (isImage(file)) {
        const [dimensions, exif] = await Promise.all([getImageDimensions(file), getExif(file)])
        if (cancelled) return
        previewUrl = URL.createObjectURL(file)
        image = { dimensions, exif, previewUrl }
      }
      const lines = isTextFile(file.name) ? countLines(await file.text()) : null
      if (!cancelled) setLoaded({ details: getFileDetails(file), loadedAt: new Date(), lines, image })
    }

    load().catch((e: unknown) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [handle])

  if (error) return <p className="error">{error}</p>
  if (!loaded) return <p className="muted">Loading…</p>

  const { details, loadedAt, lines, image } = loaded
  return (
    <section className="details">
      <h2>{details.name}</h2>
      <dl className="fields">
        <Field label="Name" value={details.name} />
        <Field label="Size" value={formatBytes(details.size)} />
        <Field label="Type" value={details.type} />
        <Field
          label="Modified"
          value={`${formatDate(details.modified)} · ${formatRelativeTime(details.modified, loadedAt)}`}
        />
        {lines !== null && <Field label="Lines" value={String(lines)} />}
        {image && (
          <Field label="Dimensions" value={image.dimensions ? formatDimensions(image.dimensions) : 'Unknown'} />
        )}
      </dl>

      {image && (
        <>
          <h3>EXIF</h3>
          {image.exif.length === 0 ? (
            <p className="muted">No EXIF data</p>
          ) : (
            <dl className="fields">
              {image.exif.map(([label, value]) => (
                <Field key={label} label={label} value={value} />
              ))}
            </dl>
          )}
          <img className="preview" src={image.previewUrl} alt={details.name} />
        </>
      )}
    </section>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  )
}
