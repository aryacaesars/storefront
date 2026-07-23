"use client"

import { useActionState, useEffect, useState } from "react"
import {
  changePasswordAction,
  deleteAddressAction,
  saveAddressAction,
  setDefaultAddressAction,
  updateProfileAction,
  type AccountFormState,
} from "@/app/(storefront)/account/actions"
import { UseMyLocationButton } from "@/features/storefront/UseMyLocationButton"
import { cn } from "@/lib/utils"

type Variant = "default" | "bold"

const inputByVariant: Record<Variant, string> = {
  default:
    "h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[var(--theme-text)] outline-none transition-colors focus:border-[var(--theme-primary)] placeholder:text-[var(--theme-muted)]",
  bold:
    "h-12 w-full border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-[var(--theme-accent)]/25",
}

const labelByVariant: Record<Variant, string> = {
  default: "text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]",
  bold: "text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400",
}

const submitByVariant: Record<Variant, string> = {
  default:
    "h-11 cursor-pointer rounded-full px-6 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
  bold:
    "inline-flex h-12 min-w-[160px] cursor-pointer items-center justify-center px-8 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
}

type AddressRow = {
  id: string
  label: string | null
  street: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export function AccountProfileForm({
  name,
  email,
  phone,
  variant = "default",
}: {
  name: string
  email: string
  phone: string
  variant?: Variant
}) {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    updateProfileAction,
    undefined,
  )
  const inputClass = inputByVariant[variant]
  const labelClass = labelByVariant[variant]
  const submitClass = submitByVariant[variant]

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="account-email" className={labelClass}>
          Email
        </label>
        <input
          id="account-email"
          type="email"
          value={email}
          disabled
          className={cn(inputClass, "mt-1.5 opacity-70")}
        />
      </div>
      <div>
        <label htmlFor="account-name" className={labelClass}>
          Full name
        </label>
        <input
          id="account-name"
          name="name"
          type="text"
          required
          defaultValue={name}
          placeholder="Full name"
          autoComplete="name"
          className={cn(inputClass, "mt-1.5")}
        />
      </div>
      <div>
        <label htmlFor="account-phone" className={labelClass}>
          Phone number
        </label>
        <input
          id="account-phone"
          name="phone"
          type="tel"
          required
          defaultValue={phone}
          placeholder="08xxxxxxxxxx"
          autoComplete="tel"
          className={cn(inputClass, "mt-1.5")}
        />
      </div>
      {state && "error" in state && state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state && "ok" in state && state.message && (
        <p className="text-sm text-emerald-600" role="status">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={submitClass}
        style={{
          backgroundColor:
            variant === "bold" ? "var(--theme-accent)" : "var(--theme-primary)",
        }}
      >
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  )
}

export function AccountPasswordForm({ variant = "default" }: { variant?: Variant }) {
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    changePasswordAction,
    undefined,
  )
  const inputClass = inputByVariant[variant]
  const labelClass = labelByVariant[variant]

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="current-password" className={labelClass}>
          Current password
        </label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={cn(inputClass, "mt-1.5")}
        />
      </div>
      <div>
        <label htmlFor="new-password" className={labelClass}>
          New password
        </label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={cn(inputClass, "mt-1.5")}
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={cn(inputClass, "mt-1.5")}
        />
      </div>
      {state && "error" in state && state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state && "ok" in state && state.message && (
        <p className="text-sm text-emerald-600" role="status">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={submitByVariant[variant]}
        style={{
          backgroundColor:
            variant === "bold" ? "var(--theme-accent)" : "var(--theme-primary)",
        }}
      >
        {pending ? "Saving..." : "Change password"}
      </button>
    </form>
  )
}

export function AccountAddressSection({
  addresses,
  variant = "default",
}: {
  addresses: AddressRow[]
  variant?: Variant
}) {
  const [mode, setMode] = useState<"list" | "form">("list")
  const [editing, setEditing] = useState<AddressRow | null>(null)
  const [state, formAction, pending] = useActionState<AccountFormState, FormData>(
    saveAddressAction,
    undefined,
  )
  const [defaultState, defaultFormAction, defaultPending] = useActionState<
    AccountFormState,
    FormData
  >(setDefaultAddressAction, undefined)
  const [deleteState, deleteFormAction, deletePending] = useActionState<
    AccountFormState,
    FormData
  >(deleteAddressAction, undefined)

  const inputClass = inputByVariant[variant]
  const isBold = variant === "bold"

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      setMode("list")
      setEditing(null)
    }
  }, [state])

  function startAdd() {
    setEditing(null)
    setMode("form")
  }

  function startEdit(address: AddressRow) {
    setEditing(address)
    setMode("form")
  }

  if (mode === "form") {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3
            className={
              isBold
                ? "text-sm font-black uppercase tracking-wide text-zinc-900"
                : "text-sm font-bold text-[var(--theme-text)]"
            }
          >
            {editing ? "Edit address" : "Add address"}
          </h3>
          <button
            type="button"
            onClick={() => {
              setMode("list")
              setEditing(null)
            }}
            className={
              isBold
                ? "cursor-pointer text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-zinc-900"
                : "cursor-pointer text-xs font-semibold text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
            }
          >
            Cancel
          </button>
        </div>

        <form action={formAction} className="space-y-3">
          {editing && <input type="hidden" name="addressId" value={editing.id} />}
          <UseMyLocationButton
            className={
              isBold
                ? "cursor-pointer text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--theme-primary)] transition-opacity hover:opacity-70 disabled:opacity-50"
                : "cursor-pointer text-sm font-semibold text-[var(--theme-primary)] transition-opacity hover:opacity-70 disabled:opacity-50"
            }
          />
          <div>
            <label htmlFor="address-label" className={labelByVariant[variant]}>
              Label
            </label>
            <input
              id="address-label"
              name="label"
              type="text"
              placeholder="Home, Office, …"
              defaultValue={editing?.label ?? ""}
              className={cn(inputClass, "mt-1.5")}
            />
          </div>
          <div>
            <label htmlFor="address-street" className={labelByVariant[variant]}>
              Full address
            </label>
            <input
              id="address-street"
              name="street"
              type="text"
              required
              placeholder="123 Example St"
              defaultValue={editing?.street ?? ""}
              autoComplete="street-address"
              className={cn(inputClass, "mt-1.5")}
            />
          </div>
          <div className="grid gap-3 @2xl:grid-cols-2">
            <div>
              <label htmlFor="address-city" className={labelByVariant[variant]}>
                City
              </label>
              <input
                id="address-city"
                name="city"
                type="text"
                required
                placeholder="City"
                defaultValue={editing?.city ?? ""}
                autoComplete="address-level2"
                className={cn(inputClass, "mt-1.5")}
              />
            </div>
            <div>
              <label htmlFor="address-province" className={labelByVariant[variant]}>
                Province
              </label>
              <input
                id="address-province"
                name="province"
                type="text"
                required
                placeholder="Province"
                defaultValue={editing?.province ?? ""}
                autoComplete="address-level1"
                className={cn(inputClass, "mt-1.5")}
              />
            </div>
          </div>
          <div>
            <label htmlFor="address-postal" className={labelByVariant[variant]}>
              Postal code
            </label>
            <input
              id="address-postal"
              name="postalCode"
              type="text"
              required
              placeholder="Postal code"
              defaultValue={editing?.postalCode ?? ""}
              autoComplete="postal-code"
              className={cn(inputClass, "mt-1.5")}
            />
          </div>
          <label
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2.5 text-sm",
              isBold ? "text-zinc-900" : "text-[var(--theme-text)]",
            )}
          >
            <input
              type="checkbox"
              name="makeDefault"
              defaultChecked={!editing || editing.isDefault}
              className="h-4 w-4 accent-[var(--theme-primary)]"
            />
            Set as default address
          </label>
          {state && "error" in state && state.error && (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className={cn(submitByVariant[variant], isBold && "w-full")}
            style={{
              backgroundColor:
                isBold ? "var(--theme-accent)" : "var(--theme-primary)",
            }}
          >
            {pending ? "Saving..." : "Save address"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3
          className={
            isBold
              ? "text-sm font-black uppercase tracking-wide text-zinc-900"
              : "text-sm font-bold text-[var(--theme-text)]"
          }
        >
          Shipping addresses
        </h3>
        <button
          type="button"
          onClick={startAdd}
          className={
            isBold
              ? "cursor-pointer text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--theme-primary)] transition-opacity hover:opacity-70"
              : "cursor-pointer text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]"
          }
        >
          + Add
        </button>
      </div>

      {addresses.length === 0 ? (
        <div
          className={
            isBold
              ? "border border-dashed border-zinc-200 px-4 py-10 text-center"
              : "rounded-2xl border border-dashed border-black/10 px-4 py-8 text-center"
          }
        >
          <p className={isBold ? "text-sm text-zinc-400" : "text-sm text-[var(--theme-muted)]"}>
            No saved addresses yet.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className={
              isBold
                ? "mt-3 cursor-pointer text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--theme-primary)]"
                : "mt-3 cursor-pointer text-sm font-semibold text-[var(--theme-primary)]"
            }
          >
            Add address
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={
                isBold
                  ? "border border-zinc-100 bg-zinc-50/80 p-4"
                  : "rounded-2xl border border-black/8 bg-[var(--theme-bg,#fafafa)]/60 p-4"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={
                        isBold
                          ? "text-sm font-black uppercase tracking-wide text-zinc-900"
                          : "text-sm font-bold text-[var(--theme-text)]"
                      }
                    >
                      {address.label || "Address"}
                    </p>
                    {address.isDefault && (
                      <span
                        className={
                          isBold
                            ? "bg-zinc-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white"
                            : "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                        }
                        style={
                          isBold
                            ? undefined
                            : { backgroundColor: "var(--theme-primary)" }
                        }
                      >
                        Aktif
                      </span>
                    )}
                  </div>
                  <p
                    className={
                      isBold
                        ? "mt-1.5 text-sm leading-relaxed text-zinc-500"
                        : "mt-1.5 text-sm leading-relaxed text-[var(--theme-muted)]"
                    }
                  >
                    {address.street}
                    <br />
                    {address.city}, {address.province} {address.postalCode}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(address)}
                    className={
                      isBold
                        ? "cursor-pointer text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--theme-primary)] transition-opacity hover:opacity-70"
                        : "cursor-pointer text-xs font-semibold text-[var(--theme-primary)]"
                    }
                  >
                    Ubah
                  </button>
                  {!address.isDefault && (
                    <>
                      <span
                        aria-hidden
                        className={isBold ? "text-zinc-200" : "text-black/15"}
                      >
                        |
                      </span>
                      <form
                        action={deleteFormAction}
                        onSubmit={(e) => {
                          if (!window.confirm("Hapus alamat ini?")) e.preventDefault()
                        }}
                      >
                        <input type="hidden" name="addressId" value={address.id} />
                        <button
                          type="submit"
                          disabled={deletePending}
                          className={
                            isBold
                              ? "cursor-pointer text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--theme-primary)] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                              : "cursor-pointer text-xs font-semibold text-[var(--theme-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                          }
                        >
                          Hapus
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {address.isDefault ? (
                <button
                  type="button"
                  disabled
                  className={
                    isBold
                      ? "mt-3 h-9 cursor-not-allowed border border-zinc-200 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300"
                      : "mt-3 h-9 cursor-not-allowed rounded-lg border border-black/10 px-4 text-xs font-semibold text-[var(--theme-muted)]/60"
                  }
                >
                  Atur sebagai utama
                </button>
              ) : (
                <form action={defaultFormAction}>
                  <input type="hidden" name="addressId" value={address.id} />
                  <button
                    type="submit"
                    disabled={defaultPending}
                    className={
                      isBold
                        ? "mt-3 h-9 cursor-pointer border border-zinc-900 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        : "mt-3 h-9 cursor-pointer rounded-lg border border-black/20 px-4 text-xs font-semibold text-[var(--theme-text)] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                    }
                  >
                    {defaultPending ? "Menyimpan..." : "Atur sebagai utama"}
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      {state && "ok" in state && state.message && (
        <p className="mt-3 text-sm text-emerald-600" role="status">
          {state.message}
        </p>
      )}
      {defaultState && "error" in defaultState && defaultState.error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {defaultState.error}
        </p>
      )}
      {defaultState && "ok" in defaultState && defaultState.message && (
        <p className="mt-3 text-sm text-emerald-600" role="status">
          {defaultState.message}
        </p>
      )}
      {deleteState && "error" in deleteState && deleteState.error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {deleteState.error}
        </p>
      )}
      {deleteState && "ok" in deleteState && deleteState.message && (
        <p className="mt-3 text-sm text-emerald-600" role="status">
          {deleteState.message}
        </p>
      )}
    </div>
  )
}
