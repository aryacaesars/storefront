import { NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { s3, S3_BUCKET } from "@/lib/storage/s3"

/**
 * Same-origin media proxy for S3/MinIO objects.
 * Upload stores return `/api/media/<key>` so <img> never depends on a public
 * bucket URL (which often 403s and looks like an "expired" image).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const { key: parts } = await context.params
  const key = parts.map((p) => decodeURIComponent(p)).join("/")
  if (!key || key.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 })
  }

  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
    )
    if (!obj.Body) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const bytes = Buffer.from(await obj.Body.transformToByteArray())
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": obj.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (err) {
    console.error("[media] GetObject error:", err)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
