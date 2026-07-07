import "server-only"

import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

/** Simpan file ke `public/uploads` — fallback dev saat MinIO/S3 tidak jalan. */
export async function saveLocalUpload(
  tenantId: string,
  ext: string,
  body: Buffer,
): Promise<{ url: string; key: string }> {
  const id = randomUUID()
  const key = `uploads/tenants/${tenantId}/branding/${id}.${ext}`
  const abs = path.join(process.cwd(), "public", key)

  await mkdir(path.dirname(abs), { recursive: true })
  await writeFile(abs, body)

  return { url: `/${key}`, key }
}

export function isS3ConnectionError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const code = "code" in err ? String(err.code) : ""
  return code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ECONNRESET"
}
