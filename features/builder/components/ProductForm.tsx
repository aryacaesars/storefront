"use client"

import { useActionState, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import type { Category } from "@/server/services/product.service"

export type ProductFormState = { error: string } | { success: true } | undefined

interface ProductFormProps {
  storeId: string
  categories: Category[]
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>
  defaultValues?: {
    name?: string
    description?: string
    price?: number
    stock?: number
    published?: boolean
    categoryId?: string
    imageUrl?: string
  }
  submitLabel?: string
  extraActions?: React.ReactNode
}

export function ProductForm({
  categories,
  action,
  defaultValues = {},
  submitLabel = "Simpan",
  extraActions,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    action,
    undefined,
  )
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? "")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? "Upload gagal")
      }
      const data = (await res.json()) as { url: string }
      setImageUrl(data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      {state && "error" in state && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          Produk berhasil disimpan.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues.name}
          placeholder="Kaos Polos Hitam"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues.description ?? ""}
          placeholder="Deskripsi produk..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            required
            min={0}
            defaultValue={defaultValues.price ?? 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stok <span className="text-red-500">*</span>
          </label>
          <input
            name="stock"
            type="number"
            required
            min={0}
            defaultValue={defaultValues.stock ?? 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <select
          name="categoryId"
          defaultValue={defaultValues.categoryId ?? ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
        >
          <option value="">— Tanpa kategori —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gambar Produk
        </label>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {imageUrl ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Preview gambar produk" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
            <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Upload foto</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        )}
        {uploading && <p className="text-xs text-gray-500 mt-1">Mengupload...</p>}
        {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={defaultValues.published ?? false}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Tampilkan di storefront (Aktif)
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
        {extraActions}
      </div>
    </form>
  )
}
