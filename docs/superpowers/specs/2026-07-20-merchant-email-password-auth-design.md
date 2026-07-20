# Merchant Email/Password Auth

Date: 2026-07-20

## Goal

Merchant (OWNER/ADMIN) can **register** and **login** with email+password, while keeping Google OAuth.

## Scope

- `/login` — email+password form + Google + link to register
- `/register` — name (optional), email, password, confirm + Google + link to login
- `User.passwordHash` nullable (Google-only users OK)
- Credentials provider in NextAuth (JWT session, existing cookie `sf_session`)
- Role from `ADMIN_EMAILS` unchanged

## Out of scope

- Email verification
- Password reset
- Linking password to existing Google account (same email → register fails if email taken)

## Security

- scrypt via `lib/auth/password.ts`
- Password min 8 chars
- Generic login error: "Email atau password salah."
- Users without `passwordHash` cannot credentials-login
