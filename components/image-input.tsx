"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"

export function ImageInput({
  label,
  onChange,
}: {
  label: string
  onChange: (file: File | null, previewUrl: string | null) => void
}) {
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange(null, null)
      return
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.")
      onChange(null, null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      onChange(file, (reader.result as string) || null)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="grid gap-2">
      <Label className="text-sm">{label}</Label>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
