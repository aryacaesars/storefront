import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSession } from "@/features/auth/dal"
import { saveLocalUpload } from "@/lib/storage/local-upload"
import { s3, S3_BUCKET, mediaProxyUrl } from "@/lib/storage/s3"

/**
 * Remove background (beta) — proxies ke provider remove.bg lewat server supaya
 * API key tidak bocor ke client. Hasil PNG disimpan ke storage yang sama
 * dengan upload biasa, lalu URL baru dikembalikan ke builder.
 */

const MAX_SOURCE_SIZE = 8 * 1024 * 1024 // 8MB

/** Cegah SSRF: hanya izinkan gambar dari origin sendiri atau public storage. */
function isAllowedSource(url: URL, requestUrl: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false
  if (url.host === requestUrl.host) return true
  const storagePublic = process.env.S3_PUBLIC_URL
  if (storagePublic) {
    try {
      if (url.host === new URL(storagePublic).host) return true
    } catch {
      // S3_PUBLIC_URL invalid — abaikan
    }
  }
  return false
}

/** Availability check — builder pakai ini untuk menampilkan "belum tersedia". */
export async function GET() {
  return NextResponse.json({
    available: Boolean(process.env.REMOVE_BG_API_KEY),
  })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Fitur remove background belum dikonfigurasi (REMOVE_BG_API_KEY)." },
      { status: 503 },
    )
  }

  let imageUrl: unknown
  try {
    const body = (await request.json()) as { imageUrl?: unknown }
    imageUrl = body.imageUrl
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 })
  }
  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return NextResponse.json({ error: "imageUrl wajib diisi." }, { status: 400 })
  }

  const requestUrl = new URL(request.url)
  let sourceUrl: URL
  try {
    sourceUrl = new URL(imageUrl, requestUrl.origin)
  } catch {
    return NextResponse.json({ error: "imageUrl tidak valid." }, { status: 400 })
  }
  if (!isAllowedSource(sourceUrl, requestUrl)) {
    return NextResponse.json(
      { error: "Sumber gambar tidak diizinkan." },
      { status: 400 },
    )
  }

  const sourceRes = await fetch(sourceUrl)
  if (!sourceRes.ok) {
    return NextResponse.json(
      { error: "Gambar sumber tidak bisa diambil." },
      { status: 400 },
    )
  }
  const sourceBytes = Buffer.from(await sourceRes.arrayBuffer())
  if (sourceBytes.byteLength > MAX_SOURCE_SIZE) {
    return NextResponse.json({ error: "Gambar sumber maks. 8MB." }, { status: 400 })
  }

  const form = new FormData()
  form.append(
    "image_file",
    new Blob([new Uint8Array(sourceBytes)], {
      type: sourceRes.headers.get("content-type") ?? "image/png",
    }),
    "source",
  )
  form.append("size", "auto")
  form.append("format", "png")

  const providerRes = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: form,
  })

  if (!providerRes.ok) {
    let detail = ""
    try {
      const err = (await providerRes.json()) as {
        errors?: Array<{ title?: string }>
      }
      detail = err.errors?.[0]?.title ?? ""
    } catch {
      // response bukan JSON — pakai pesan generik
    }
    console.error("[remove-bg] provider error:", providerRes.status, detail)
    return NextResponse.json(
      { error: detail || "Provider remove background gagal memproses gambar." },
      { status: 502 },
    )
  }

  const resultBytes = Buffer.from(await providerRes.arrayBuffer())
  const scope = session.userId
  const useLocal =
    process.env.NODE_ENV === "development" ||
    /127\.0\.0\.1|localhost/.test(process.env.S3_ENDPOINT ?? "")

  if (useLocal) {
    const local = await saveLocalUpload(scope, "png", resultBytes)
    return NextResponse.json({ url: local.url, key: local.key })
  }

  const key = `tenants/${scope}/removebg/${randomUUID()}.png`
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: resultBytes,
        ContentType: "image/png",
      }),
    )
    return NextResponse.json({ url: mediaProxyUrl(key), key })
  } catch (err) {
    console.error("[remove-bg] S3 error:", err)
    try {
      const local = await saveLocalUpload(scope, "png", resultBytes)
      return NextResponse.json({ url: local.url, key: local.key })
    } catch {
      return NextResponse.json({ error: "Storage tidak tersedia." }, { status: 503 })
    }
  }
}
