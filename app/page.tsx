"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CertificateData } from "@/components/certificate-canvas"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LeaderPhotoInput } from "@/components/leader-photo-input"
import { ImageInput } from "@/components/image-input"
import { getLocationFromImageOrDevice } from "@/lib/location"
import { CertificateCanvas } from "@/components/certificate-canvas"
import { saveReport } from "@/lib/storage"
import { SocialShare } from "@/components/social-share"

type IssueType = "Pothole" | "Garbage" | "Broken Streetlight" | "Illegal Dumping" | "Waterlogging" | "Other"

type LeaderOption = {
  key: string
  label: string
  imageUrl: string
}

const LEADER_OPTIONS: LeaderOption[] = [
  { key: "modi", label: "PM Narendra Modi", imageUrl: "/images/pm-modi.png" },
  { key: "gadkari", label: "Nitin Gadkari", imageUrl: "/images/nitin-gadkari.jpg" },
  { key: "cm", label: "State/UT CM", imageUrl: "/images/leader-default.png" }, // can be replaced with actual CM image
]

export default function HomePage() {
  const [issueImage, setIssueImage] = useState<File | null>(null)
  const [issuePreview, setIssuePreview] = useState<string | null>(null)
  const [leaderImage, setLeaderImage] = useState<File | null>(null)
  const [leaderPreview, setLeaderPreview] = useState<string | null>("/images/leader-default.png")
  const [issueType, setIssueType] = useState<IssueType>("Pothole")
  const [issueNote, setIssueNote] = useState<string>("")
  const [creditName, setCreditName] = useState<string>("") // new optional field
  const [locText, setLocText] = useState<string>("")
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null })
  const [dateTime, setDateTime] = useState<Date | null>(null)
    const [localDateTime, setLocalDateTime] = useState<string>("")
  const [isLocLoading, setIsLocLoading] = useState(false)
    // For top right leaders
    const [selectedLeaders, setSelectedLeaders] = useState<string[]>(["modi"])
    // For CM custom image
    const [cmImage, setCmImage] = useState<string>("/images/leader-default.png")
  const [certData, setCertData] = useState<CertificateData | null>(null)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null) // data URL of canvas
  const [reportUrl, setReportUrl] = useState<string | null>(null) // app link used for QR / tweet
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { currentLanguage: t } = useLanguage()

  useEffect(() => {
    if (!issueImage) return
    ;(async () => {
      setIsLocLoading(true)
      const meta = await getLocationFromImageOrDevice(issueImage)
      if (meta?.coords) setCoords(meta.coords)
      if (meta?.date) setDateTime(meta.date)
      if (meta?.pretty) setLocText(meta.pretty)
      setIsLocLoading(false)
    })()
  }, [issueImage])

    // Fix hydration error: set local date/time only on client
    useEffect(() => {
      setLocalDateTime((dateTime ?? new Date()).toLocaleString())
    }, [dateTime])

  const canGenerate = useMemo(() => {
    return Boolean(issueImage && leaderPreview)
  }, [issueImage, leaderPreview, locText, coords])

  const handleGenerate = async () => {
    if (!issueImage) return;
    const id = crypto.randomUUID();
    const url = `/report/${id}` // Just the path, domain handled in SocialShare;

    // Build top leaders array
    const topLeaders: string[] = selectedLeaders
      .filter((key) => key !== "modi") // exclude Modi from top, always at bottom
      .map((key) => {
        if (key === "cm") return cmImage;
        const found = LEADER_OPTIONS.find((opt) => opt.key === key);
        return found ? found.imageUrl : "";
      })
      .filter(Boolean);

    // Always include Modi at bottom left
    const modiImage = LEADER_OPTIONS.find((opt) => opt.key === "modi")?.imageUrl || "/images/pm-modi.png";

    const data = {
      id: id,
      issueType: issueType,
      note: issueNote,
      locationText:
        (locText && locText.trim()) ||
        (coords.lat && coords.lng ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : "Not provided"),
      coords: coords.lat && coords.lng ? { lat: coords.lat, lng: coords.lng } : undefined,
      capturedAt: (dateTime ?? new Date()).toISOString(),
      issueImageFile: issueImage,
      topLeaderImageUrls: topLeaders,
      modiImageUrl: modiImage,
      reportUrl: url,
      footerCreditName: creditName || undefined,
    };
    setCertData(data);
    setReportUrl(url);
  }

  // Capture the canvas image once drawn
  const handleCanvasRendered = (dataUrl: string | null) => {
    if (!dataUrl || !certData) return
    setGeneratedUrl(dataUrl)
    // persist a copy to localStorage for simple "admin/report" usage
    saveReport({
      ...certData,
      imageDataUrl: dataUrl,
    })
  }

  return (
    <main className="min-h-dvh bg-white text-gray-900">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-balance">Civic Issue Certificate</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <a className="text-sm text-blue-600 hover:underline" href="/admin">
              Admin
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1) {t.translations.uploadPhoto}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageInput
              label="Capture or Upload"
              onChange={(file, preview) => {
                setIssueImage(file)
                setIssuePreview(preview)
              }}
            />
            {issuePreview && (
              <img
                src={issuePreview || "/placeholder.svg"}
                alt="Issue preview"
                className="w-full h-auto rounded border"
              />
            )}
            <div className="text-sm text-gray-700">
              {isLocLoading
                ? "Extracting GPS from photo EXIF..."
                : locText
                  ? `Detected location: ${locText}`
                  : "Location not detected from photo metadata. You can still proceed."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2) {t.translations.selectIssueType}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="issue-type">{t.translations.issueLabel}</Label>
              <select
                id="issue-type"
                className={cn("border rounded px-3 py-2 text-sm")}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
              >
                <option>Pothole</option>
                <option>Garbage</option>
                <option>Broken Streetlight</option>
                <option>Illegal Dumping</option>
                <option>Waterlogging</option>
                <option>Other</option>
              </select>
              <p className="text-xs text-gray-600">Auto-tagging coming soon; choose a type for now.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note">{t.translations.noteLabel}</Label>
              <Input
                id="note"
                placeholder="Short description"
                value={issueNote}
                onChange={(e) => setIssueNote(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location-text">{t.translations.locationLabel}</Label>
              <Input
                id="location-text"
                placeholder="e.g., MG Road, Bengaluru"
                value={locText}
                onChange={(e) => setLocText(e.target.value)}
              />
              <p className="text-xs text-gray-600">
                Optional. We try to read GPS from the photo’s EXIF; you can refine or leave blank.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Capture Time</Label>
                <div className="text-sm">{localDateTime}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="credit-name">Credit name (optional)</Label>
              <Input
                id="credit-name"
                placeholder="e.g., PM Narendra Modi or Nitin Gadkari"
                value={creditName}
                onChange={(e) => setCreditName(e.target.value)}
              />
              <p className="text-xs text-gray-600">If provided, the certificate footer will credit this person.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">3) {t.translations.chooseLeaders}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Select Leaders (Top Right)</Label>
              <div className="grid grid-cols-1 gap-2">
                {LEADER_OPTIONS.map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedLeaders.includes(opt.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeaders((prev) => [...prev, opt.key]);
                        } else if (opt.key !== "modi") { // Don't unselect Modi
                          setSelectedLeaders((prev) => prev.filter((k) => k !== opt.key));
                        }
                      }}
                    />
                    <span className="text-sm">{opt.label}</span>
                    <img 
                      src={opt.imageUrl} 
                      alt={opt.label}
                      className="h-8 w-8 rounded-full object-cover border ml-2"
                    />
                  </label>
                ))}
              </div>
            </div>

            {selectedLeaders.includes("cm") && (
              <div className="space-y-2">
                <Label className="text-sm">Select State/UT CM Photo</Label>
                <LeaderPhotoInput
                  defaultUrl="/images/leader-default.png"
                  onChange={(_, preview) => setCmImage(preview || "/images/leader-default.png")}
                />
                {cmImage && (
                  <img
                    src={cmImage}
                    alt="CM preview"
                    className="h-24 w-24 rounded object-cover border"
                  />
                )}
              </div>
            )}

            <p className="text-xs text-gray-600">
              Note: PM Modi's photo will always appear at the bottom left of the certificate (4x larger).
              Select additional leaders to appear at the top right.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700" disabled={!canGenerate} onClick={handleGenerate}>
            {t.translations.generateCertificate}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIssueImage(null)
              setIssuePreview(null)
              setLeaderImage(null)
              setLeaderPreview("/images/leader-default.png")
              setIssueType("Pothole")
              setIssueNote("")
              setCreditName("") // reset credit name
              setLocText("")
              setCoords({ lat: null, lng: null })
              setDateTime(null)
              setCertData(null)
              setGeneratedUrl(null)
              setReportUrl(null)
            }}
          >
            Reset
          </Button>
        </div>

        {certData && (
          <>
            <Separator />
            <section className="space-y-3">
              <h2 className="text-base font-semibold">{t.translations.title}</h2>
              <CertificateCanvas ref={canvasRef} data={certData} onRendered={handleCanvasRendered} />
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-amber-500 hover:bg-amber-600"
                  onClick={() => {
                    const canvas = canvasRef.current
                    if (!canvas) return
                    const link = document.createElement("a")
                    link.download = `civic-certificate-${certData.id}.png`
                    link.href = canvas.toDataURL("image/png")
                    link.click()
                  }}
                >
                  Download PNG
                </Button>
                {generatedUrl && reportUrl && certData && (
                  <SocialShare
                    imageDataUrl={generatedUrl}
                    issueType={certData.issueType}
                    location={certData.locationText}
                    url={reportUrl}
                  />
                )}
              </div>
              {reportUrl && (
                <p className="text-xs text-gray-600">
                  QR links to:{" "}
                  <a className="text-blue-600 underline" href={reportUrl}>
                    {reportUrl}
                  </a>{" "}
                  — demo only, no backend yet.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
