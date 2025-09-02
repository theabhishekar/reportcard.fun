"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { StateCMPicker } from "@/components/state-cm-picker"

export function LeaderPhotoInput({
  defaultUrl,
  onChange,
}: {
  defaultUrl: string
  onChange: (file: File | null, previewUrl: string | null) => void
}) {
  // three choices: 'pm' | 'gadkari' | 'custom' | 'url' | 'statecm'
  const [choice, setChoice] = useState<"pm" | "gadkari" | "custom" | "url" | "statecm">("pm")
  const [url, setUrl] = useState<string>("")

  // reflect current choice into preview (statecm is handled by the picker)
  useEffect(() => {
    if (choice === "pm") {
      onChange(null, "/images/pm-modi.png")
    } else if (choice === "gadkari") {
      onChange(null, "/images/nitin-gadkari.jpg")
    } else if (choice === "url") {
      onChange(null, url || defaultUrl)
    } else if (choice === "custom") {
      // Do nothing here; handled by file input.
    } else if (choice === "statecm") {
      // Do nothing here; the StateCMPicker below will call onChange when the user selects a CM.
    } else {
      onChange(null, defaultUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, defaultUrl, url])

  const handleFile = (file: File | null) => {
    if (choice !== "custom") return
    if (!file || !file.type.startsWith("image/")) {
      onChange(null, defaultUrl)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      onChange(file, (reader.result as string) || defaultUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="grid gap-2">
      <Label className="text-sm">Leader Photo</Label>

      <div className="flex flex-col gap-2 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="leader-choice"
            value="pm"
            checked={choice === "pm"}
            onChange={() => setChoice("pm")}
          />
          <span>PM Narendra Modi</span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="leader-choice"
            value="gadkari"
            checked={choice === "gadkari"}
            onChange={() => setChoice("gadkari")}
          />
          <span>Nitin Gadkari</span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="leader-choice"
            value="statecm"
            checked={choice === "statecm"}
            onChange={() => setChoice("statecm")}
          />
          <span>State/UT CM (choose region)</span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="leader-choice"
            value="custom"
            checked={choice === "custom"}
            onChange={() => setChoice("custom")}
          />
          <span>Custom upload</span>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="leader-choice"
            value="url"
            checked={choice === "url"}
            onChange={() => setChoice("url")}
          />
          <span>Use URL</span>
        </label>
      </div>

      {/* URL input (enabled only when 'url' is selected) */}
      {choice === "url" && (
        <input
          type="url"
          placeholder="https://example.com/leader.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="block w-full rounded border px-3 py-2 text-sm"
        />
      )}

      {/* State CM picker (enabled only when 'statecm' is selected) */}
      {choice === "statecm" && (
        <StateCMPicker
          className="mt-1"
          onSelect={(imgSrc /*, cmName*/) => {
            // We keep the existing API: emit only image URL. User can fill credit name separately.
            onChange(null, imgSrc)
          }}
        />
      )}

      {/* Custom upload (enabled only when 'custom' is selected) */}
      <input
        type="file"
        accept="image/*"
        disabled={choice !== "custom"}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
      />

      <p className="text-xs text-gray-600">
        Choose a default, pick a State/UT CM, paste a URL, or switch to Custom to upload your own. Note: Some remote
        URLs may block cross-origin loading; Wikipedia images usually work with canvas.
      </p>
    </div>
  )
}
