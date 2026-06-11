/** Strip wrapper text users often paste from docs or curl examples. */
export function normalizeScalevToken(raw: string): string {
  let token = raw.trim()

  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim()
  }

  // Remove accidental wrapping quotes from copy-paste.
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim()
  }

  return token
}

/** sk_ = secret key, rk_ = restricted key — valid for GET /v3/me */
export function looksLikeScalevApiKey(token: string): boolean {
  return /^(sk|rk)_[A-Za-z0-9]+/.test(token)
}
