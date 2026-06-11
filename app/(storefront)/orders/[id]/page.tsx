export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1
        className="text-3xl font-semibold text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        Order Status
      </h1>
      <p className="mt-4 text-sm text-[var(--theme-muted)]">
        Order #{id} — coming soon.
      </p>
    </div>
  )
}
