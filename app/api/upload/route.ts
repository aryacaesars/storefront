import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSession } from "@/features/auth/dal"
import { saveLocalUpload } from "@/lib/storage/local-upload"
import { s3, S3_BUCKET, publicUrl } from "@/lib/storage/s3"

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
  const key = `tenants/${session.tenantId}/branding/${randomUUID()}.${ext}`

  // Dev: simpan ke public/uploads — langsung bisa di-load <img> tanpa bucket policy MinIO.
  if (process.env.NODE_ENV === "development") {
    const local = await saveLocalUpload(session.tenantId, ext, body)
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

    return NextResponse.json({ url: publicUrl(key), key })
  } catch (err) {
    console.error("[upload] S3 error:", err)
    return NextResponse.json({ error: "Storage tidak tersedia." }, { status: 503 })
  }
}
