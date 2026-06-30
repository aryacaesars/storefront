"use client"

import { useState } from "react"

interface UseMyLocationButtonProps {
  className?: string
}

type NominatimAddress = {
  road?: string
  house_number?: string
  city?: string
  town?: string
  village?: string
  county?: string
  state?: string
  postcode?: string
}

/**
 * Auto-fill alamat checkout dari lokasi device. Geolocation API → reverse
 * geocode via Nominatim (OSM, gratis, no API key, CORS *). Set value input
 * uncontrolled (street/city/province/postalCode) di <form> terdekat.
 * Rate limit Nominatim 1 req/detik — cukup untuk pemakaian manual.
 */
export function UseMyLocationButton({ className }: UseMyLocationButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest("form")
    if (!form) return

    if (!("geolocation" in navigator)) {
      setError("Browser tidak mendukung lokasi.")
      return
    }

    setLoading(true)
    setError(null)
    setDone(false)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=id`,
            { headers: { Accept: "application/json" } },
          )
          if (!res.ok) throw new Error("geocode failed")

          const data: { address?: NominatimAddress; display_name?: string } = await res.json()
          const a = data.address ?? {}

          const set = (name: string, value?: string) => {
            const el = form.elements.namedItem(name) as HTMLInputElement | null
            if (el && value) el.value = value
          }

          const street =
            [a.road, a.house_number].filter(Boolean).join(" ") ||
            data.display_name?.split(",")[0]?.trim()

          set("street", street)
          set("city", a.city || a.town || a.village || a.county)
          set("province", a.state)
          set("postalCode", a.postcode)

          setDone(true)
          setTimeout(() => setDone(false), 2500)
        } catch {
          setError("Gagal ambil alamat. Isi manual ya.")
        } finally {
          setLoading(false)
        }
      },
      (geoErr) => {
        setError(
          geoErr.code === geoErr.PERMISSION_DENIED
            ? "Izin lokasi ditolak."
            : "Tidak bisa ambil lokasi.",
        )
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
        aria-live="polite"
      >
        {loading
          ? "Mengambil lokasi..."
          : done
            ? "✓ Lokasi terisi"
            : "📍 Pakai lokasi saya"}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
