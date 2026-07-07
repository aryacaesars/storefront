import { scrypt, randomBytes, timingSafeEqual } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)

/** Hash a plaintext password → "salt:hash" (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString("hex")}`
}

/** Constant-time verify of plaintext against stored "salt:hash". */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":")
  if (!salt || !key) return false
  const keyBuffer = Buffer.from(key, "hex")
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}
