import { CreateStoreForm } from "@/features/builder/components/CreateStoreForm"
import Link from "next/link"

export const metadata = { title: "Buat Store Baru — Etalase" }

export default function NewStorePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Buat Store Baru
        </h1>
        <CreateStoreForm />
      </div>
    </div>
  )
}
