"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthProvider, AuthError } from "./provider";
import { setSessionCookie, clearSessionCookie } from "./session";
import {
  resolveTenantFromIdentity,
  upsertTenant,
} from "@/server/services/tenant.service";
import { ScalevError } from "@/lib/scalev/client";
import type { LoginFormState } from "./types";

const LoginInput = z.object({
  token: z.string().trim().min(1, "Masukkan token Scalev."),
});

/**
 * Login via Scalev token connect. Signature matches useActionState:
 * (prevState, formData). On success: set session cookie + redirect to dashboard.
 * On failure: return { error } for the form to render.
 */
export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = LoginInput.safeParse({ token: formData.get("token") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  let identity, token;
  try {
    const result = await getAuthProvider().authenticate({ token: parsed.data.token });
    identity = result.identity;
    token = result.token;
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    if (e instanceof ScalevError) {
      // Shape mismatch = the response didn't match our ASSUMPTION schema
      // (envelope or renamed key). The upstream call actually SUCCEEDED — log
      // full detail server-side for week-1 validation instead of a useless
      // "HTTP 200" to the user.
      if (e.kind === "validation") {
        console.error("[auth] Scalev /v3/me shape mismatch:", e.message, e.body);
        return {
          error:
            "Respons Scalev tidak sesuai dugaan — cek server log (validasi struktur Minggu 1).",
        };
      }
      if (e.kind === "network" || e.status === 0) {
        console.error("[auth] Scalev network error:", e.message);
        return {
          error:
            "Tidak bisa terhubung ke Scalev API. Periksa koneksi internet, pastikan SCALEV_API_BASE=https://api.scalev.com di .env, lalu restart npm run dev.",
        };
      }
      if (e.status === 401) {
        console.error("[auth] Scalev 401:", e.body);
        return {
          error:
            "API Key ditolak Scalev (401). Buat/ salin ulang key di Scalev → Settings → Developers → API Keys (format sk_... atau rk_...). Pastikan key belum expired dan scope-nya mencakup akses business.",
        };
      }
      return { error: `Gagal menghubungi Scalev (HTTP ${e.status}).` };
    }
    return { error: "Login gagal. Coba lagi." };
  }

  const resolved = resolveTenantFromIdentity(identity);
  if (!resolved) {
    return { error: "Akun Scalev belum punya business/store yang terhubung." };
  }

  let tenant;
  try {
    tenant = await upsertTenant(resolved);
  } catch (e) {
    console.error("[auth] Failed to upsert tenant:", e);
    return { error: "Gagal menyimpan data tenant. Periksa koneksi database." };
  }

  // Identity fields are nested under `user` (may be null for non-user auth).
  const user = identity.user;
  // Prefer the first non-empty display name; tolerate empty-string fields.
  const displayName =
    [user?.fullname, user?.email].find(
      (v): v is string => typeof v === "string" && v.trim().length > 0,
    ) ?? tenant.name;

  try {
    await setSessionCookie({
      // Fall back to the business id when there's no user (e.g. app login).
      merchantId: user?.id != null ? String(user.id) : tenant.scalevBusinessId,
      displayName,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      scalevToken: token,
    });
  } catch (e) {
    // e.g. SESSION_SECRET missing/too short — controlled failure, no raw stack.
    console.error("[auth] Failed to create session:", e);
    return { error: "Gagal membuat sesi (konfigurasi server). Hubungi admin." };
  }

  redirect("/dashboard"); // throws NEXT_REDIRECT — must be last, outside try/catch
}

/** Log out: clear session + back to login. */
export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
