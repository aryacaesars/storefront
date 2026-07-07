import "server-only"
import { S3Client } from "@aws-sdk/client-s3"

/**
 * S3-compatible storage client (MinIO self-hosted / S3 — guide.md "Storage").
 * Semua akses object storage lewat sini, jangan instansiasi S3Client di tempat lain.
 */

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION ?? "us-east-1",
  // MinIO tidak mendukung virtual-hosted-style bucket URL.
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
})

export const S3_BUCKET = process.env.S3_BUCKET ?? "storefront-assets"

const PUBLIC_URL = (process.env.S3_PUBLIC_URL ?? "").replace(/\/$/, "")

/** URL publik file (bucket harus ber-policy anonymous download). */
export function publicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`
}
