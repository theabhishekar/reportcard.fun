"use client"

import { useMemo, useState } from "react"
import { listReports, deleteReport } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminPage() {
  const [q, setQ] = useState("")
  const [type, setType] = useState("All")
  const [force, setForce] = useState(0)

  const items = useMemo(() => {
    const all = listReports()
    const t = type === "All" ? all : all.filter((r) => r.issueType === type)
    const f = !q
      ? t
      : t.filter(
          (r) =>
            (r.locationText?.toLowerCase() ?? "").includes(q.toLowerCase()) ||
            (r.note?.toLowerCase() ?? "").includes(q.toLowerCase()),
        )
    return f
  }, [q, type, force])

  return (
    <main className="min-h-dvh bg-white">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin</h1>
          <nav className="flex items-center gap-3">
            <a className="text-sm text-blue-600 hover:underline" href="/civic">
              Generate
            </a>
            <a className="text-sm text-blue-600 hover:underline" href="/">
              Home
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="grid gap-2">
            <Label>Search</Label>
            <Input placeholder="Search by location or note" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Issue Type</Label>
            <select className="border rounded px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              <option>All</option>
              <option>Pothole</option>
              <option>Garbage</option>
              <option>Broken Streetlight</option>
              <option>Illegal Dumping</option>
              <option>Waterlogging</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <ul className="grid gap-4">
          {items.map((r) => (
            <li key={r.id} className="rounded border p-3 flex items-start gap-3">
              {r.imageDataUrl ? (
                <img
                  src={r.imageDataUrl || "/placeholder.svg?height=96&width=96&query=thumbnail"}
                  alt="Certificate thumbnail"
                  className="w-24 h-24 object-cover rounded border"
                />
              ) : (
                <div className="w-24 h-24 grid place-items-center bg-gray-100 rounded border text-xs text-gray-600">
                  No image
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <a className="text-blue-600 underline text-sm" href={`/report/${r.id}`}>
                    View
                  </a>
                  <span className="text-xs text-gray-500">ID: {r.id}</span>
                </div>
                <div className="text-sm font-medium mt-1">{r.issueType}</div>
                <div className="text-xs text-gray-600">{new Date(r.capturedAt).toLocaleString()}</div>
                <div className="text-xs text-gray-700 truncate">Location: {r.locationText}</div>
                {r.note && <div className="text-xs text-gray-700 truncate">Note: {r.note}</div>}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteReport(r.id)
                    setForce((x) => x + 1)
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && <li className="text-sm text-gray-600">No certificates stored yet.</li>}
        </ul>
      </div>
    </main>
  )
}
