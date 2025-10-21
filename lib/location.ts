

import * as exifr from "exifr"

// Reverse geocode lat/lng to a human-readable address using OpenStreetMap Nominatim.
// Note: This makes a public network request. Keep usage modest per Nominatim's usage policy.
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lng))
    url.searchParams.set('zoom', '14')
    url.searchParams.set('addressdetails', '1')

    const res = await fetch(url.toString(), {
      headers: {
        // Browser will set a UA; we can hint language for better results
        'Accept-Language': 'en-IN,en;q=0.8'
      }
    })
    if (!res.ok) throw new Error('reverse geocode failed')
    const data: any = await res.json()
    const a = data?.address || {}
    const parts = [
      a.suburb || a.neighbourhood || a.hamlet || a.locality,
      a.city || a.town || a.village || a.municipality || a.county,
      a.state,
      a.country
    ].filter(Boolean)
    if (parts.length) return parts.join(', ')
    return data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

export async function getLocationFromImageOrDevice(file: File): Promise<{
  coords?: { lat: number; lng: number }
  date?: Date
  pretty?: string
} | null> {
  try {
    const gps = await exifr.gps(file).catch(() => null as any)
    const exifDate = await exifr.parse(file, { pick: ["DateTimeOriginal", "CreateDate"] }).catch(() => null as any)

    let coords: { lat: number; lng: number } | undefined
    if (gps?.latitude && gps?.longitude) {
      coords = { lat: gps.latitude, lng: gps.longitude }
    }

    let date: Date | undefined
    const d = (exifDate?.DateTimeOriginal as Date) || (exifDate?.CreateDate as Date)
    if (d) date = new Date(d)

    // Removed device geolocation to avoid intrusive prompt; EXIF-only
    // if (!coords) {
    //   try {
    //     const device = await getDeviceLocation()
    //     if (device) coords = device
    //   } catch {
    //     // ignore
    //   }
    // }

    let pretty: string | undefined
    if (coords) {
      pretty = await reverseGeocode(coords.lat, coords.lng)
    }

    return { coords, date, pretty }
  } catch {
    return null
  }
}

// Deprecated: coarse reverse geocode placeholder removed in favor of reverseGeocode above
