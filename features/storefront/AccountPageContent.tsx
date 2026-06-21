import Link from "next/link"
import { MapPin, Package, User } from "lucide-react"

const MOCK_ORDERS = [
  {
    id: "ORD-28491",
    date: "12 Jun 2026",
    status: "Dikirim",
    total: 437,
    items: 2,
  },
  {
    id: "ORD-27103",
    date: "28 Mei 2026",
    status: "Selesai",
    total: 189,
    items: 1,
  },
] as const

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-muted)] focus:border-[var(--theme-primary)]"

const cardClass =
  "rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]"

export function AccountPageContent() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 @2xl:px-6">
      <div className={`mb-10 ${cardClass}`}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)]">
          Account
        </p>
        <h1
          className="mt-2 text-3xl font-bold text-[var(--theme-text)] @2xl:text-4xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Akun Saya
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--theme-muted)]">
          Kelola profil, alamat pengiriman, dan pantau pesanan kamu di sini.
        </p>
      </div>

      <div className="grid gap-8 @3xl:grid-cols-5">
        <div className="space-y-8 @3xl:col-span-3">
          <div className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[var(--theme-text)]">Profil</h2>
                <p className="text-xs text-[var(--theme-muted)]">
                  Informasi kontak untuk pesanan dan notifikasi.
                </p>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid gap-4 @2xl:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--theme-text)]">
                    Nama depan
                  </span>
                  <input type="text" defaultValue="Budi" className={inputClass} />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--theme-text)]">
                    Nama belakang
                  </span>
                  <input type="text" defaultValue="Santoso" className={inputClass} />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--theme-text)]">Email</span>
                <input
                  type="email"
                  defaultValue="budi.santoso@email.com"
                  className={inputClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--theme-text)]">
                  Nomor telepon
                </span>
                <input type="tel" defaultValue="+62 812 3456 7890" className={inputClass} />
              </label>
              <button
                type="button"
                className="mt-2 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                Simpan Perubahan
              </button>
            </form>
          </div>

          <div className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                <MapPin className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[var(--theme-text)]">
                  Alamat Pengiriman
                </h2>
                <p className="text-xs text-[var(--theme-muted)]">
                  Alamat utama untuk pengiriman pesanan.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-[var(--theme-bg)] p-4">
              <p className="text-sm font-semibold text-[var(--theme-text)]">Budi Santoso</p>
              <p className="mt-1 text-sm text-[var(--theme-muted)]">
                Jl. Sudirman No. 45, Jakarta Pusat 10220
              </p>
              <p className="mt-1 text-sm text-[var(--theme-muted)]">+62 812 3456 7890</p>
            </div>

            <button
              type="button"
              className="mt-4 text-sm font-semibold text-[var(--theme-primary)] transition-opacity hover:opacity-80"
            >
              Ubah alamat
            </button>
          </div>
        </div>

        <aside className="space-y-8 @3xl:col-span-2">
          <div className={cardClass}>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                <Package className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[var(--theme-text)]">
                  Pesanan Terbaru
                </h2>
                <p className="text-xs text-[var(--theme-muted)]">
                  Riwayat pesanan kamu.
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {MOCK_ORDERS.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="block rounded-2xl border border-black/5 p-4 transition-colors hover:border-[var(--theme-primary)]/30 hover:bg-[var(--theme-bg)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[var(--theme-text)]">
                          {order.id}
                        </p>
                        <p className="mt-1 text-xs text-[var(--theme-muted)]">
                          {order.date} · {order.items} item
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                        style={{ backgroundColor: "var(--theme-primary)" }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-[var(--theme-primary)]">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/cart"
              className="mt-5 block text-center text-xs font-semibold text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-primary)]"
            >
              Lihat keranjang
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
