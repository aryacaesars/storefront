import Link from "next/link"
import { requireCustomer } from "@/features/storefront/customer-dal"
import { getCustomerWithOrders } from "@/server/services/customer.service"
import { formatIdr } from "@/features/storefront/catalog-types"
import { LogoutButton } from "./LogoutButton"

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
  const customer = await getCustomerWithOrders(session.customerId, session.storeId)

  if (!customer) {
    // session valid but record vanished — treat as logged out
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-[var(--theme-muted)]">Akun tidak ditemukan.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 @2xl:px-6">
      <div className="mb-8 flex items-center justify-between rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--theme-primary)" }}>
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

      <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
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
                    <p className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
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
