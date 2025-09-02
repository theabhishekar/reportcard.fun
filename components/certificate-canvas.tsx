"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import QRCode from "qrcode"

export type CertificateData = {
  id: string
  issueType: string
  note?: string
  locationText: string
  coords?: { lat: number; lng: number }
  capturedAt: string // ISO
  issueImageFile: File
  leaderImageUrl: string // data URL or public path
  reportUrl: string
  footerCreditName?: string // optional credit line in footer
}

export type PersistedReport = CertificateData & { imageDataUrl?: string }

export const CertificateCanvas = forwardRef<
  HTMLCanvasElement,
  {
    data: CertificateData
    onRendered?: (dataUrl: string | null) => void
    logoScale?: number
  }
>(({ data, onRendered, logoScale }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useImperativeHandle(ref, () => canvasRef.current!)

  useEffect(() => {
    let revoked: string | null = null
    const draw = async () => {
      try {
        const canvas = canvasRef.current
        if (!canvas) return

        const width = 900
        const height = 1273
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const primary = "#2563EB"
        const textColor = "#111827"
        const subText = "#374151"
        const border = "#E5E7EB"

        // Background
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, width, height)

        // Border
        ctx.strokeStyle = border
        ctx.lineWidth = 4
        ctx.strokeRect(20, 20, width - 40, height - 40)

        const headerH = 140
        const headerTop = 20
        const headerLeft = 20
        const headerWidth = width - 40
        const headerDelta = headerH - 80 // shift content below by this delta

        // Header
        ctx.fillStyle = primary
        ctx.fillRect(headerLeft, headerTop, headerWidth, headerH)

        try {
          const sealImg = await loadImage("/images/gov-seal.png")
          const scale = logoScale && logoScale > 0 ? logoScale : 2.2
          const sealSize = Math.min(Math.round(56 * scale), headerH - 16)
          const sealX = headerLeft + 20
          const sealY = headerTop + (headerH - sealSize) / 2

          // Badge behind seal for contrast
          const cx = sealX + sealSize / 2
          const cy = sealY + sealSize / 2
          ctx.save()
          ctx.beginPath()
          ctx.arc(cx, cy, sealSize / 2 + 10, 0, Math.PI * 2)
          ctx.fillStyle = "#FFFFFF"
          ctx.shadowColor = "rgba(0,0,0,0.08)"
          ctx.shadowBlur = 12
          ctx.fill()
          ctx.restore()

          ctx.drawImage(sealImg, sealX, sealY, sealSize, sealSize)
        } catch {}

        // Center the header text so it doesn't get covered by the logo
        ctx.fillStyle = "#FFFFFF"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const centerX = headerLeft + headerWidth / 2

        ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto"
        const headerTextY1 = headerTop + Math.floor(headerH / 2) - 12
        ctx.fillText("People of India", centerX, headerTextY1)

        ctx.font = "600 20px system-ui, -apple-system, Segoe UI, Roboto"
        const headerTextY2 = headerTextY1 + 28
        ctx.fillText("भारत के लोग", centerX, headerTextY2)

        // Restore left alignment for the rest of the canvas drawing
        ctx.textAlign = "left"
        ctx.textBaseline = "alphabetic"

        // Title (shifted down by headerDelta)
        ctx.fillStyle = textColor
        ctx.font = "bold 30px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.fillText("Civic Issue Certificate", 40, 140 + headerDelta)
        ctx.font = "600 22px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.fillText("नागरिक समस्या प्रमाणपत्र", 40, 170 + headerDelta)

        // Leader photo (shifted down by headerDelta)
        const leaderW = 120
        const leaderH = 150
        ctx.strokeStyle = border
        ctx.lineWidth = 2
        ctx.strokeRect(width - 40 - leaderW - 10, 110 + headerDelta, leaderW + 10, leaderH + 10)
        try {
          const leader = await loadImage(data.leaderImageUrl)
          ctx.drawImage(leader, width - 40 - leaderW - 5, 115 + headerDelta, leaderW, leaderH)
        } catch {
          ctx.fillStyle = "#F3F4F6"
          ctx.fillRect(width - 40 - leaderW - 5, 115 + headerDelta, leaderW, leaderH)
          ctx.fillStyle = subText
          ctx.font = "600 14px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Leader", width - 40 - leaderW + 22, 195 + headerDelta)
        }

        // Meta (shifted down by headerDelta)
        ctx.fillStyle = subText
        ctx.font = "500 16px system-ui, -apple-system, Segoe UI, Roboto"
        const when = new Date(data.capturedAt).toLocaleString()
        const where = data.locationText
        ctx.fillText(`Date & Time / दिनांक: ${when}`, 40, 210 + headerDelta)
        ctx.fillText(`Location / स्थान: ${where}`, 40, 235 + headerDelta)

        // Issue (shifted down by headerDelta)
        ctx.fillStyle = textColor
        ctx.font = "600 20px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.fillText(`Issue: ${data.issueType}`, 40, 270 + headerDelta)
        if (data.note) {
          ctx.font = "500 16px system-ui, -apple-system, Segoe UI, Roboto"
          wrapText(ctx, `Note: ${data.note}`, 40, 298 + headerDelta, width - 80)
        }

        // Issue image (shifted down by headerDelta)
        const photoX = 40
        const photoY = 350 + headerDelta
        const photoW = width - 80
        ctx.strokeStyle = border
        ctx.lineWidth = 2
        try {
          const issueUrl = URL.createObjectURL(data.issueImageFile)
          revoked = issueUrl
          const issueImg = await loadImage(issueUrl)
          const aspect = issueImg.width / issueImg.height
          const photoH = Math.min(420, Math.round(photoW / Math.max(aspect, 1e-6)))
          ctx.strokeRect(photoX - 1, photoY - 1, photoW + 2, photoH + 2)
          ctx.drawImage(issueImg, photoX, photoY, photoW, photoH)

          // Divider
          ctx.strokeStyle = border
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(40, photoY + photoH + 20)
          ctx.lineTo(width - 40, photoY + photoH + 20)
          ctx.stroke()
        } catch {
          const photoH = 300
          ctx.strokeRect(photoX - 1, photoY - 1, photoW + 2, photoH + 2)
          ctx.fillStyle = "#F3F4F6"
          ctx.fillRect(photoX, photoY, photoW, photoH)
          ctx.fillStyle = subText
          ctx.font = "600 16px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Issue photo unavailable", photoX + 20, photoY + 40)

          // Divider
          ctx.strokeStyle = border
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(40, photoY + photoH + 20)
          ctx.lineTo(width - 40, photoY + photoH + 20)
          ctx.stroke()
        }

        // QR code (safe fallback)
        try {
          const qrDataUrl = await QRCode.toDataURL(data.reportUrl, { margin: 0, scale: 6 })
          const qrImg = await loadImage(qrDataUrl)
          const qrSize = 140
          const qrX = 40
          const qrY = height - 40 - qrSize - 80
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
          ctx.fillStyle = subText
          ctx.font = "500 14px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Scan to view report", qrX + qrSize + 16, qrY + 24)
          ctx.fillText("रिपोर्ट देखने हेतु स्कैन करें", qrX + qrSize + 16, qrY + 46)
          ctx.fillText(data.reportUrl, qrX + qrSize + 16, qrY + 68)

          // Add demo disclaimer next to QR
          ctx.font = "500 11px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Demo only — QR/URL not live", qrX, qrY + qrSize + 16)
        } catch {
          const qrX = 40
          const qrY = height - 40 - 140 - 80
          ctx.fillStyle = subText
          ctx.font = "500 14px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Link:", qrX, qrY + 24)
          wrapText(ctx, data.reportUrl, qrX + 45, qrY + 24, 500)

          // Add demo disclaimer when QR fails
          ctx.font = "500 11px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Demo only — QR/URL not live", qrX, qrY + 140 + 16)
        }

        // Footer
        ctx.fillStyle = subText
        ctx.font = "500 13px system-ui, -apple-system, Segoe UI, Roboto"
        const footerY = height - 40
        if (data.footerCreditName) {
          ctx.font = "600 13px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText(`Credit: ${data.footerCreditName}`, 40, footerY - 22)
          ctx.font = "500 13px system-ui, -apple-system, Segoe UI, Roboto"
        }
        const footer = "This certificate documents a civic issue reported by a citizen."
        ctx.fillText(footer, 40, footerY)

        try {
          onRendered?.(canvas.toDataURL("image/png"))
        } catch {
          onRendered?.(null)
        }
      } catch {
        onRendered?.(null)
      } finally {
        if (revoked) URL.revokeObjectURL(revoked)
      }
    }

    void draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), logoScale])

  return <canvas ref={canvasRef} className="w-full h-auto rounded border" aria-label="Generated certificate" />
})

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  const words = text.split(" ")
  let line = ""
  const lineHeight = 22
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " "
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + " "
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}
