import Link from "next/link"
import { requireCustomer } from "@/features/storefront/customer-dal"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import {
  getCustomerAddresses,
  getCustomerWithOrders,
} from "@/server/services/customer.service"
import { formatIdr } from "@/features/storefront/catalog-types"
import { Footer as BoldFooter } from "@/themes/bold"
import { LogoutButton } from "./LogoutButton"
import { AccountAddressSection, AccountProfileForm } from "./AccountForms"

export const metadata = { title: "Akun Saya" }

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  PAID: "Dibayar",
  SHIPPED: "Dikirim",
  DONE: "Selesai",
  CANCELLED: "Dibatalkan",
}

export default async function AccountPage() {
  const session = await requireCustomer()
  const tenantSlug = await getTenantSubdomain()
  const theme = await getStorefrontThemeConfig(tenantSlug)
  const isBold = theme.templateId === "bold"

  const [customer, addresses] = await Promise.all([
    getCustomerWithOrders(session.customerId, session.storeId),
    getCustomerAddresses(session.customerId),
  ])

  if (!customer) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-[var(--theme-muted)]">Akun tidak ditemukan.</p>
      </section>
    )
  }

  if (isBold) {
    return (
      <div className="min-h-screen bg-white">
        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          {/* Header — exaggerated minimalism: loud type, high contrast */}
          <div className="mb-10 flex flex-col gap-6 border-b border-zinc-100 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--theme-primary)" }}
              >
                Account
              </p>
              <h1
                className="mt-2 text-4xl font-black uppercase leading-none tracking-tight text-zinc-900 md:text-5xl"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {customer.name ?? "Akun Saya"}
              </h1>
              <p className="mt-3 text-sm text-zinc-400">{customer.email}</p>
            </div>
            <LogoutButton variant="bold" />
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2
                className="text-lg font-black uppercase tracking-wide text-zinc-900"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                Profil & kontak
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Data ini dipakai otomatis saat checkout.
              </p>
              <div className="mt-6">
                <AccountProfileForm
                  variant="bold"
                  name={customer.name ?? ""}
                  email={customer.email}
                  phone={customer.phone ?? ""}
                />
              </div>
            </div>

            <div>
              <AccountAddressSection variant="bold" addresses={addresses} />
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-100 pt-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2
                  className="text-lg font-black uppercase tracking-wide text-zinc-900"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  Pesanan Saya
                </h2>
                <p className="mt-1 text-sm text-zinc-400">Riwayat order terbaru.</p>
              </div>
              <Link
                href="/products"
                className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--theme-primary)] transition-opacity hover:opacity-70 sm:inline"
              >
                Belanja →
              </Link>
            </div>

            {customer.orders.length === 0 ? (
              <div className="border border-dashed border-zinc-200 py-16 text-center">
                <p className="text-sm text-zinc-400">Belum ada pesanan.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex h-12 items-center px-8 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--theme-accent)" }}
                >
                  Mulai belanja
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 border-y border-zinc-100">
                {customer.orders.map((order) => {
                  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
                  return (
                    <li key={order.id}>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-5 transition-colors duration-200 hover:bg-zinc-50"
                      >
                        <div>
                          <p className="text-sm font-black uppercase tracking-wide text-zinc-900">
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            {itemCount} item · {STATUS_LABEL[order.status] ?? order.status}
                          </p>
                        </div>
                        <p
                          className="text-sm font-black tabular-nums"
                          style={{ color: "var(--theme-primary)" }}
                        >
                          {formatIdr(order.total)}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
        <BoldFooter config={theme} />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 @2xl:px-6">
      <div className="mb-8 flex items-center justify-between rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--theme-primary)" }}
          >
            Account
          </p>
          <h1
            className="mt-2 text-3xl font-bold text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {customer.name ?? "Akun Saya"}
          </h1>
          <p className="mt-1 text-sm text-[var(--theme-muted)]">{customer.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 @3xl:grid-cols-2">
        <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
          <h2 className="text-lg font-bold text-[var(--theme-text)]">Profil & kontak</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted)]">
            Data ini dipakai otomatis saat checkout.
          </p>
          <div className="mt-6">
            <AccountProfileForm
              name={customer.name ?? ""}
              email={customer.email}
              phone={customer.phone ?? ""}
            />
          </div>
        </div>

        <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
          <AccountAddressSection addresses={addresses} />
        </div>
      </div>

      <div className="mt-6 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h2 className="text-lg font-bold text-[var(--theme-text)]">Pesanan Saya</h2>

        {customer.orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--theme-muted)]">Belum ada pesanan.</p>
            <Link
              href="/products"
              className="mt-3 inline-block text-sm font-semibold"
              style={{ color: "var(--theme-primary)" }}
            >
              Mulai belanja
            </Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-black/5">
            {customer.orders.map((order) => {
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
              return (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between py-4 transition-colors hover:bg-black/[0.02]"
                  >
                    <div>
                      <p className="text-sm font-bold text-[var(--theme-text)]">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[var(--theme-muted)]">
                        {itemCount} item · {STATUS_LABEL[order.status] ?? order.status}
                      </p>
                    </div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--theme-primary)" }}
                    >
                      {formatIdr(order.total)}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
