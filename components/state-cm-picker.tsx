"use client"

import * as React from "react"
import { INDIAN_STATES, type IndianState, CM_NAME_BY_STATE, CM_WIKI_TITLE_BY_STATE } from "@/lib/indian-states"
import { fetchWikiLeadImage } from "@/lib/wiki"

type Props = {
  onSelect: (imageSrc: string, creditName?: string) => void
  className?: string
}

export function StateCMPicker({ onSelect, className }: Props) {
  const [state, setState] = React.useState<IndianState>("Andhra Pradesh")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ name: string; imageUrl?: string; pageUrl?: string } | null>(null)

  async function handleLoad() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const cmName = CM_NAME_BY_STATE[state]
      const title = CM_WIKI_TITLE_BY_STATE[state]
      const { imageUrl, pageUrl } = await fetchWikiLeadImage(title, 700)
      setResult({ name: cmName, imageUrl, pageUrl })
      if (!imageUrl) setError("Could not find an official image on Wikipedia for this CM.")
    } catch {
      setError("Failed to load CM image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">State</label>
        <select
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          value={state}
          onChange={(e) => setState(e.target.value as IndianState)}
        >
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleLoad}
          disabled={loading}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Loading…" : "Load CM"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 rounded-lg border p-3">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded bg-muted">
              {result.imageUrl ? (
                // Canvas code elsewhere should set crossOrigin="anonymous" when drawing external images
                // Next.js just displays the preview here.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.imageUrl || "/placeholder.svg"} alt={result.name} className="h-16 w-16 object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center text-xs text-muted-foreground">No image</div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{result.name}</p>
              <p className="text-xs text-muted-foreground">Chief Minister of {state}</p>
              {result.pageUrl && (
                <a href={result.pageUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                  Wikipedia source
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => result.imageUrl && onSelect(result.imageUrl, result.name)}
              disabled={!result.imageUrl}
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Use this leader
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Images fetched from Wikipedia (upload.wikimedia.org) are generally CORS-safe for canvas rendering.
          </p>
        </div>
      )}
    </div>
  )
}
