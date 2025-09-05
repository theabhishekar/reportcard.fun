"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import QRCode from "qrcode"

type CompanyCertData = {
  companyName: string
  issueType: string
  issueInfo: string
  companyLogoUrl: string
  postUrl?: string
}

export const CompanyCertificateCanvas = forwardRef<HTMLCanvasElement, { data: CompanyCertData }>(
  ({ data }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useImperativeHandle(ref, () => canvasRef.current!)

    useEffect(() => {
      const draw = async () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const width = 900
        const height = 1273
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d", { alpha: false })
        if (!ctx) return
        // bg
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, width, height)
        // border
        ctx.strokeStyle = "#E5E7EB"
        ctx.lineWidth = 4
        ctx.strokeRect(20, 20, width - 40, height - 40)

        // header bar
        ctx.fillStyle = "#2563EB"
        ctx.fillRect(20, 20, width - 40, 120)
        ctx.fillStyle = "#fff"
        ctx.font = "bold 30px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.textAlign = "center"
        ctx.fillText("Swachhata Against Bad Service", width / 2, 80)

        ctx.textAlign = "left"
        ctx.fillStyle = "#111827"
        ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.fillText(data.companyName || "Company", 40, 180)
        ctx.font = "600 18px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.fillText(`Issue Type: ${data.issueType}`, 40, 210)
        ctx.font = "500 16px system-ui, -apple-system, Segoe UI, Roboto"
        wrapText(ctx, `Issue: ${data.issueInfo}`, 40, 240, width - 80)

        // Reserve bottom section like civic certificate: Modi bottom-left, QR bottom-right
        const bottomSectionY = height - 360
        const bottomPadding = 40
        const spaceBetween = 40

        // Precompute QR position
        const qrSize = 160
        const qrX = width - bottomPadding - qrSize
        const qrY = bottomSectionY

        // company logo box (upper left)
        const logoX = 40
        const logoY = 300
        const logoW = 360
        const logoH = 360
        ctx.strokeStyle = "#E5E7EB"
        ctx.lineWidth = 2
        ctx.strokeRect(logoX, logoY, logoW, logoH)
        if (data.companyLogoUrl) {
          try {
            const img = await loadImage(data.companyLogoUrl)
            ctx.drawImage(img, logoX + 8, logoY + 8, logoW - 16, logoH - 16)
          } catch {}
        }

        // Modi photo bottom-left (stretch-to-available like civic)
        try {
          const modiImg = await loadImage("https://pbs.twimg.com/media/Gz6Wnu1XsAANe07?format=jpg&name=large")
          const modiX = bottomPadding
          const modiY = bottomSectionY
          const maxW = Math.max(200, qrX - spaceBetween - bottomPadding)
          const naturalW = (modiImg as HTMLImageElement).width || maxW
          const naturalH = (modiImg as HTMLImageElement).height || maxW
          const aspect = naturalW > 0 ? naturalW / naturalH : 0.75
          const targetW = Math.min(maxW, naturalW)
          const targetH = Math.min(320, Math.round(targetW / Math.max(aspect, 0.1)))
          ctx.strokeStyle = "#E5E7EB"
          ctx.lineWidth = 4
          ctx.strokeRect(modiX, modiY, targetW, targetH)
          ctx.drawImage(modiImg, modiX + 8, modiY + 8, targetW - 16, targetH - 16)
          // tagline
          const tagY = Math.min(height - 80, modiY + targetH + 22)
          ctx.fillStyle = "#1F2937"
          ctx.font = "italic 600 16px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.fillText("Reporting to build the India our PM envisions", modiX, tagY)
        } catch {}

        // QR bottom-right for post URL
        try {
          const qrUrl = data.postUrl || "https://twitter.com/"
          const qrDataUrl = await QRCode.toDataURL(qrUrl, { margin: 0, scale: 6 })
          const qrImg = await loadImage(qrDataUrl)
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(qrX, qrY, qrSize, qrSize)
          ctx.strokeStyle = "#E5E7EB"
          ctx.lineWidth = 2
          ctx.strokeRect(qrX, qrY, qrSize, qrSize)
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
          ctx.fillStyle = "#6B7280"
          ctx.font = "500 12px system-ui, -apple-system, Segoe UI, Roboto"
          ctx.textAlign = "center"
          ctx.fillText("Scan to view post", qrX + qrSize/2, qrY + qrSize + 18)
          ctx.textAlign = "left"
        } catch {}

        // Footer
        ctx.fillStyle = "#6B7280"
        ctx.font = "500 12px system-ui, -apple-system, Segoe UI, Roboto"
        ctx.fillText("Disclaimer: Citizen-generated certificate for awareness; no official action implied.", 40, height - 36)
      }
      draw()
    }, [JSON.stringify(data)])

    return <canvas ref={canvasRef} className="w-full h-auto rounded border" />
  }
)

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  const words = text.split(" ")
  let line = ""
  const lineHeight = 22
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " "
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + " "
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}


