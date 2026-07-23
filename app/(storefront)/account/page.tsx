import Link from "next/link"
import { User, Package, ChevronDown, MapPin, Lock } from "lucide-react"
import { requireCustomer } from "@/features/storefront/customer-dal"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import {
  getCustomerAddresses,
  getCustomerWithOrders,
} from "@/server/services/customer.service"
import { formatIdr } from "@/features/storefront/catalog-types"
import { Footer as BoldFooter } from "@/themes/bold"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./LogoutButton"
import {
  AccountAddressSection,
  AccountPasswordForm,
  AccountProfileForm,
} from "./AccountForms"

export const metadata = { title: "My Account" }

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DONE: "Completed",
  CANCELLED: "Cancelled",
}

type AccountTab = "profile" | "address" | "password" | "orders"

const ACCOUNT_SUB_TABS: Array<{
  key: Exclude<AccountTab, "orders">
  label: string
  href: string
}> = [
  { key: "profile", label: "Profile", href: "/account" },
  { key: "address", label: "Alamat", href: "/account?tab=address" },
  { key: "password", label: "Ubah Password", href: "/account?tab=password" },
]

const SUB_TAB_ICON = {
  profile: User,
  address: MapPin,
  password: Lock,
} as const

function resolveTab(tab: string | undefined): AccountTab {
  if (tab === "orders" || tab === "address" || tab === "password") return tab
  return "profile"
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = resolveTab(tab)
  const isAccountGroup = activeTab !== "orders"

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
        <p className="text-sm text-[var(--theme-muted)]">Account not found.</p>
      </section>
    )
  }

  const orderList =
    customer.orders.length === 0 ? null : (
      <ul
        className={
          isBold
            ? "divide-y divide-zinc-100 border-y border-zinc-100"
            : "mt-6 divide-y divide-black/5"
        }
      >
        {customer.orders.map((order) => {
          const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
          return (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className={
                  isBold
                    ? "flex min-h-14 cursor-pointer items-center justify-between gap-4 py-5 transition-colors duration-200 hover:bg-zinc-50"
                    : "flex items-center justify-between py-4 transition-colors hover:bg-black/[0.02]"
                }
              >
                <div>
                  <p
                    className={
                      isBold
                        ? "text-sm font-black uppercase tracking-wide text-zinc-900"
                        : "text-sm font-bold text-[var(--theme-text)]"
                    }
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p
                    className={
                      isBold
                        ? "mt-0.5 text-xs text-zinc-400"
                        : "text-xs text-[var(--theme-muted)]"
                    }
                  >
                    {itemCount} item · {STATUS_LABEL[order.status] ?? order.status}
                  </p>
                </div>
                <p
                  className={cn("text-sm font-black", isBold && "tabular-nums")}
                  style={{ color: "var(--theme-primary)" }}
                >
                  {formatIdr(order.total)}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    )

  if (isBold) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 md:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--theme-primary)" }}
              >
                Account
              </p>
              <h1
                className="mt-2 truncate text-2xl font-black uppercase leading-none tracking-tight text-zinc-900"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {customer.name ?? "My Account"}
              </h1>
              <p className="mt-2 truncate text-xs text-zinc-400">{customer.email}</p>

              <nav className="mt-8 flex flex-col gap-2 border-t border-zinc-100 pt-6">
                <details open={isAccountGroup} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-900 transition-colors hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-3">
                      <User className="h-4 w-4" strokeWidth={2} />
                      My Account
                    </span>
                    <ChevronDown
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                      strokeWidth={2}
                    />
                  </summary>
                  <div className="mt-1 flex flex-col gap-1 pl-4">
                    {ACCOUNT_SUB_TABS.map(({ key, label, href }) => {
                      const isActive = activeTab === key
                      const Icon = SUB_TAB_ICON[key]
                      return (
                        <Link
                          key={key}
                          href={href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] transition-colors",
                            isActive
                              ? "bg-zinc-900 text-white"
                              : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                </details>

                <Link
                  href="/account?tab=orders"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] transition-colors",
                    activeTab === "orders"
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900",
                  )}
                >
                  <Package className="h-4 w-4" strokeWidth={2} />
                  My Orders
                </Link>
              </nav>

              <div className="mt-6 border-t border-zinc-100 pt-6">
                <LogoutButton variant="bold" />
              </div>
            </aside>

            {/* Content */}
            {activeTab === "profile" && (
              <div>
                <h2
                  className="text-lg font-black uppercase tracking-wide text-zinc-900"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  Profile & contact
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  This information is used automatically at checkout.
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
            )}

            {activeTab === "address" && (
              <div>
                <AccountAddressSection variant="bold" addresses={addresses} />
              </div>
            )}

            {activeTab === "password" && (
              <div>
                <h2
                  className="text-lg font-black uppercase tracking-wide text-zinc-900"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  Ubah Password
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Enter your current password, then choose a new one.
                </p>
                <div className="mt-6">
                  <AccountPasswordForm variant="bold" />
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <h2
                      className="text-lg font-black uppercase tracking-wide text-zinc-900"
                      style={{ fontFamily: "var(--theme-heading-font)" }}
                    >
                      My Orders
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">Recent order history.</p>
                  </div>
                  <Link
                    href="/products"
                    className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--theme-primary)] transition-opacity hover:opacity-70 sm:inline"
                  >
                    Shop →
                  </Link>
                </div>

                {orderList ?? (
                  <div className="border border-dashed border-zinc-200 py-16 text-center">
                    <p className="text-sm text-zinc-400">No orders yet.</p>
                    <Link
                      href="/products"
                      className="mt-4 inline-flex h-12 items-center px-8 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "var(--theme-accent)" }}
                    >
                      Start shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        <BoldFooter config={theme} />
      </div>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 @2xl:px-6">
      <div className="grid items-start gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-[27px] bg-white p-6 shadow-[0px_0px_19px_rgba(0,0,0,0.12)] lg:sticky lg:top-24">
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--theme-primary)" }}
          >
            Account
          </p>
          <h1
            className="mt-1 truncate text-xl font-bold text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {customer.name ?? "My Account"}
          </h1>
          <p className="mt-0.5 truncate text-xs text-[var(--theme-muted)]">
            {customer.email}
          </p>

          <nav className="mt-6 flex flex-col gap-1 border-t border-black/5 pt-5">
            <details open={isAccountGroup} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-black/5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3">
                  <User className="h-4 w-4" strokeWidth={1.75} />
                  My Account
                </span>
                <ChevronDown
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  strokeWidth={1.75}
                />
              </summary>
              <div className="mt-1 flex flex-col gap-1 pl-4">
                {ACCOUNT_SUB_TABS.map(({ key, label, href }) => {
                  const isActive = activeTab === key
                  const Icon = SUB_TAB_ICON[key]
                  return (
                    <Link
                      key={key}
                      href={href}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "text-white"
                          : "text-[var(--theme-muted)] hover:bg-black/5 hover:text-[var(--theme-text)]",
                      )}
                      style={
                        isActive
                          ? { backgroundColor: "var(--theme-primary)" }
                          : undefined
                      }
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </details>

            <Link
              href="/account?tab=orders"
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                activeTab === "orders"
                  ? "text-white"
                  : "text-[var(--theme-muted)] hover:bg-black/5 hover:text-[var(--theme-text)]",
              )}
              style={
                activeTab === "orders"
                  ? { backgroundColor: "var(--theme-primary)" }
                  : undefined
              }
            >
              <Package className="h-4 w-4" strokeWidth={1.75} />
              My Orders
            </Link>
          </nav>

          <div className="mt-5 border-t border-black/5 pt-5">
            <LogoutButton />
          </div>
        </aside>

        {/* Content */}
        {activeTab === "profile" && (
          <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
            <h2 className="text-lg font-bold text-[var(--theme-text)]">
              Profile & contact
            </h2>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">
              This information is used automatically at checkout.
            </p>
            <div className="mt-6">
              <AccountProfileForm
                name={customer.name ?? ""}
                email={customer.email}
                phone={customer.phone ?? ""}
              />
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
            <AccountAddressSection addresses={addresses} />
          </div>
        )}

        {activeTab === "password" && (
          <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
            <h2 className="text-lg font-bold text-[var(--theme-text)]">Ubah Password</h2>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">
              Enter your current password, then choose a new one.
            </p>
            <div className="mt-6">
              <AccountPasswordForm />
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
            <h2 className="text-lg font-bold text-[var(--theme-text)]">My Orders</h2>

            {orderList ?? (
              <div className="py-12 text-center">
                <p className="text-sm text-[var(--theme-muted)]">No orders yet.</p>
                <Link
                  href="/products"
                  className="mt-3 inline-block text-sm font-semibold"
                  style={{ color: "var(--theme-primary)" }}
                >
                  Start shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
