import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSession } from "@/features/auth/dal"
import { s3, S3_BUCKET, publicUrl } from "@/lib/storage/s3"

const MAX_SIZE = 2 * 1024 * 1024 // 2MB (sesuai hint UI builder)

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: "Tipe file tidak didukung (PNG, JPG, WebP, SVG)" },
      { status: 400 },
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ukuran file maks. 2MB" }, { status: 400 })
  }

  // Scope per-tenant supaya asset antar merchant tidak bertabrakan.
  const key = `tenants/${session.tenantId}/branding/${randomUUID()}.${ext}`

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  )

  return NextResponse.json({ url: publicUrl(key), key })
}
