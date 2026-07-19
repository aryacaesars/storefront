import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSession } from "@/features/auth/dal"
import { saveLocalUpload } from "@/lib/storage/local-upload"
import { s3, S3_BUCKET, mediaProxyUrl } from "@/lib/storage/s3"

const MAX_SIZE = 2 * 1024 * 1024 // 2MB (sesuai hint UI builder)

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
}

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
}

function resolveUploadExt(file: Blob & { name?: string }): string | null {
  const fromMime = MIME_TO_EXT[file.type]
  if (fromMime) return fromMime

  const name = typeof file.name === "string" ? file.name : ""
  const match = /\.([a-z0-9]+)$/i.exec(name)
  if (!match) return null

  const raw = match[1].toLowerCase()
  if (raw === "jpeg") return "jpg"
  return EXT_TO_MIME[raw] ? raw : null
}

function resolveContentType(ext: string, fileType: string): string {
  if (fileType && MIME_TO_EXT[fileType]) return fileType
  return EXT_TO_MIME[ext] ?? "application/octet-stream"
}

function resolveScope(sessionUserId: string, form: FormData): string {
  const storeId = form.get("storeId")
  if (typeof storeId === "string" && /^[a-z0-9_-]{1,64}$/i.test(storeId)) {
    return storeId
  }
  return sessionUserId
}

function preferLocalStorage(): boolean {
  if (process.env.NODE_ENV === "development") return true
  const endpoint = process.env.S3_ENDPOINT ?? ""
  return /127\.0\.0\.1|localhost/.test(endpoint)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await request.formData()
  const entry = form.get("file")
  if (!entry || typeof entry === "string") {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
  }

  const file = entry as Blob & { name?: string }
  const ext = resolveUploadExt(file)
  if (!ext) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung (PNG, JPG, WebP, SVG)" },
      { status: 400 },
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ukuran file maks. 2MB" }, { status: 400 })
  }

  const body = Buffer.from(await file.arrayBuffer())
  const scope = resolveScope(session.userId, form)
  const key = `tenants/${scope}/branding/${randomUUID()}.${ext}`

  // Dev / local MinIO: simpan ke public/uploads — <img> same-origin, no bucket policy.
  if (preferLocalStorage()) {
    const local = await saveLocalUpload(scope, ext, body)
    return NextResponse.json({ url: local.url, key: local.key })
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: resolveContentType(ext, file.type),
      }),
    )

    // Proxy URL — works even when the bucket is private.
    return NextResponse.json({ url: mediaProxyUrl(key), key })
  } catch (err) {
    console.error("[upload] S3 error, falling back to local:", err)
    try {
      const local = await saveLocalUpload(scope, ext, body)
      return NextResponse.json({ url: local.url, key: local.key })
    } catch (localErr) {
      console.error("[upload] local fallback failed:", localErr)
      return NextResponse.json({ error: "Storage tidak tersedia." }, { status: 503 })
    }
  }
}
